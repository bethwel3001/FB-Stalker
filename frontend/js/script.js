// Facebook Login
document.getElementById('facebook-login').onclick = function() {
  FB.login(function(response) {
    if (response.authResponse) {
      const accessToken = response.authResponse.accessToken;
      // Send accessToken to backend for verification
      fetch('http://127.0.0.1:5000/facebook-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: accessToken }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          window.location.href = '/dashboard'; // Redirect to analytics dashboard
        }
      });
    }
  }, { scope: 'email' }); // Request email permission
};

// Profile Link Login
document.getElementById('profile-link-login').onclick = function() {
  const profileLink = document.getElementById('profile-link').value;
  if (!profileLink) {
    alert('Please enter your profile link!');
    return;
  }

  // Send profile link to backend
  fetch('http://127.0.0.1:5000/profile-link-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ profile_link: profileLink }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      window.location.href = '/frontend/dashboard'; // Redirect to analytics dashboard
    }
  });
};