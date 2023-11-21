const express = require('express');
const axios = require('axios');
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = 9000;

// Set up session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

app.get('/', (req, res) => {
    // res.send('<a href="/login/github">Authenticate with Github</a>');
    res.sendFile(__dirname + '/views/login.html');
});

app.get('/login/github', (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_REDIRECT_URI;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&prompt=consent`;

  res.redirect(githubAuthUrl);
});

app.get('/login/github/callback', async (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const code = req.query.code;

  try {
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
    }, {
      headers: {
        Accept: 'application/json',
      },
    });

    const accessToken = tokenResponse.data.access_token;

    // Now you can use the accessToken to make requests to the GitHub API on behalf of the user
    // For example, fetch the user's information
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = userResponse.data;

    // Store user data in the session
    req.session.user = userData;

    // Redirect to a dashboard or profile page
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error during GitHub OAuth callback:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/dashboard', (req, res) => {
  // Check if the user is authenticated (exists in the session)
  if (req.session.user) {
    // res.json(req.session.user);
    res.send('<a href="/logout">logout</a>');
  } else {
    // Redirect to login if not authenticated
    res.redirect('/login/github');
  }
});

// Implement logout route
app.get('/logout', (req, res) => {
  // Destroy the session to log out the user
  res.clearCookie('connect.sid');
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Internal Server Error');
    } else {
      // Redirect to the home page after logout
      res.redirect('/');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
