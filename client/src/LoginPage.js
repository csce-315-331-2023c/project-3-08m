import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

const serverURL = process.env.REACT_APP_SERVER_URL || "http://localhost:9000";

export default function LoginPage() {
    const signInWithGitHub = () => {
        // window.location.href = '/login/github';
        // const login = async () => {
        //     await fetch(serverURL + '/login/github', {
        //         headers: {
        //             // Content-type: "application/json; charset = UTF-8",
        //             credientials: "include"
        //         }
        //     });
        // }
        // login();
        const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
        // const URI_URL = process.env.SERVER_URL || 'http://localhost:9000';
        // const redirectUri = URI_URL + '/' + process.env.GITHUB_REDIRECT_URI;
        const redirectUri = process.env.REACT_APP_GITHUB_REDIRECT_URI;
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&prompt=consent`;
        console.log(githubAuthUrl);
        window.location.href = githubAuthUrl;
    };

    return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          bgcolor: 'background.paper' 
        }}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<GitHubIcon />} // Leading icon
              onClick={signInWithGitHub}
              sx={{ mt: 2 }}
              fullWidth // Optional: if you want the button to take the full width of the container
            >
              Sign in with GitHub
            </Button>
        </Box>
      );
}
