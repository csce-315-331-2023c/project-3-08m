import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import LoginPage from './LoginPage';
import { useNavigate } from 'react-router-dom';
import AlleyBackgroundVideo from './AlleyBackgroundVideo';
import { Height } from '@mui/icons-material';


export default function LoginLanding({onLogin}) {
    const navigate = useNavigate();

    const profiles = {
        cashier: { email: 'cashier@example.com', password: 'cashier123' },
        manager: { email: 'manager@example.com', password: 'manager123' },
        customer: { email: 'customer@example.com', password: 'customer123' },
      };
    
  
    const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const email = data.get('email');
      const password = data.get('password');
  
      // Check credentials and route accordingly
      if (email === profiles.cashier.email && password === profiles.cashier.password) {
        navigate('/cashier/*');
      } else if (email === profiles.manager.email && password === profiles.manager.password) {
        navigate('/manager');
      } else if (email === profiles.customer.email && password === profiles.customer.password) {
        navigate('/customer');
      } else {
        // Handle invalid credentials
        console.log('Invalid credentials');
      }
    };

  return (
    <ThemeProvider theme={theme}>

      {/* <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        {/* ... (Rest of the Grid layout) */}
        {/* <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} */}
        {/* /> */}
          <AlleyBackgroundVideo/>
          {/* <Box sx={{m:10}}></Box> */}
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper' }}>
        <Grid item xs={12} sm={8} md={5} elevation={6} square>
        
          <Box
            sx={{
                flexGrow: 1,
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square> */}
            <Box sx={{m:1}}></Box>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, }}
              >
                Sign In
              </Button>
              <LoginPage />
              <Button
                onClick={() => navigate('/customer')}
                fullWidth
                variant="contained"
                sx={{ mt: 2, }}
              >
                Continue as Guest
              </Button>
              {/* <Box sx={{m:1}}></Box> */}
              {/* ... (Rest of the UI components) */}
            </Box>
          </Box>
        </Grid>
        </Box>
       
      {/* </Grid> */}
    </ThemeProvider>
    
  );
}
