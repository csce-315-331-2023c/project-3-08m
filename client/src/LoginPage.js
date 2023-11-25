import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';

export default function LoginPage() {
    const signInWithGitHub = () => {
        window.location.href = '/login/github';
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            bgcolor: 'background.paper' 
        }}>
            <Container maxWidth="sm" sx={{ 
                bgcolor: 'background.paper', 
                p: 4, 
                borderRadius: 1, 
                boxShadow: 1 
            }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Login
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={signInWithGitHub}
                    sx={{ mt: 2 }}
                >
                    Sign in with GitHub
                </Button>
            </Container>
        </Box>
    );
}
