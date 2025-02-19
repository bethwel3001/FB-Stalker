const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
    facebookId: String,
    name: String,
    profileLink: String
});
const User = mongoose.model('User', UserSchema);

// Passport.js Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'profileUrl']
}, async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ facebookId: profile.id });
    if (!user) {
        user = new User({ facebookId: profile.id, name: profile.displayName, profileLink: profile.profileUrl });
        await user.save();
    }
    return done(null, user);
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

// Facebook Auth Routes
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), (req, res) => {
    res.redirect(`/analytics?user=${req.user.facebookId}`);
});

// Process FB Link Manually
app.post('/process-link', async (req, res) => {
    const { fbProfileLink } = req.body;
    
    if (!fbProfileLink.includes('facebook.com')) {
        return res.status(400).json({ message: 'Invalid Facebook link' });
    }

    let user = await User.findOne({ profileLink: fbProfileLink });
    if (!user) {
        user = new User({ profileLink: fbProfileLink });
        await user.save();
    }

    res.json({ redirectUrl: `/analytics?user=${user._id}` });
});

// Analytics Page (Dummy Route)
app.get('/analytics', (req, res) => {
    res.send('Analytics Page - Fetch Data Here');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
