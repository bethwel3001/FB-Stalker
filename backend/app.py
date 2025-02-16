from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['nextspace']
users = db['users']

# Facebook Login Endpoint
@app.route('/facebook-login', methods=['POST'])
def facebook_login():
    access_token = request.json.get('access_token')
    if not access_token:
        return jsonify({'success': False, 'message': 'Access token missing'}), 400

    # Verify the access token with Facebook
    fb_response = requests.get(
        f'https://graph.facebook.com/v18.0/me?fields=id,email&access_token={access_token}'
    )
    fb_data = fb_response.json()

    if 'error' in fb_data:
        return jsonify({'success': False, 'message': 'Invalid access token'}), 400

    # Save user data to MongoDB
    user_data = {
        'email': fb_data.get('email'),
        'facebook_id': fb_data['id'],
        'access_token': access_token,
        'created_at': datetime.utcnow(),
    }
    users.insert_one(user_data)

    return jsonify({'success': True, 'message': 'Login successful!'}), 200

# Profile Link Login Endpoint
@app.route('/profile-link-login', methods=['POST'])
def profile_link_login():
    profile_link = request.json.get('profile_link')
    if not profile_link:
        return jsonify({'success': False, 'message': 'Profile link missing'}), 400

    # Save profile link to MongoDB
    user_data = {
        'profile_link': profile_link,
        'created_at': datetime.utcnow(),
    }
    users.insert_one(user_data)

    return jsonify({'success': True, 'message': 'Profile link saved!'}), 200

# Home Route
@app.route('/')
def home():
    return "Welcome to Next-Space Backend!"

if __name__ == '__main__':
    app.run(debug=True)