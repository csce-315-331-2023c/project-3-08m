import React from 'react';
import Menu from './Menu';
import { LanguageDialog } from '../Translate';
import { NavLink, Route, Routes } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Button, Badge, Box, ThemeProvider} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import alleyLogo from './assets/the_alley_logo.png';
import { Checkout } from './Checkout';
import theme from '../theme';

const CustomerPOS = () => {
  return (
  //   <div>
  //     <h2>
  //       Menu
  //       <LanguageDialog />
  //       <nav>
  //         <NavLink to="/checkout" className={({ isActive }) => isActive ? 'active' : ''}>Checkout</NavLink>
  //       </nav>
  //     </h2>
  //     <Menu />
  //   </div>
  // );
  <div>
  <ThemeProvider theme={theme}>
  <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        
      <Box sx={{mb:1, mt:1, flexGrow: 1 }}>
        <img src={alleyLogo} alt="The Alley Logo" style={{ maxHeight: 70, maxWidth: '100%' }} />
      </Box>

        <div>
        <LanguageDialog />
        <IconButton
          component={NavLink}
          to="/checkout"
          className={({ isActive }) => isActive ? 'active' : ''}
          color="inherit" // or any color you want
          aria-label="Go to checkout"
        >
          <ShoppingCartIcon />
      </IconButton>
        </div>
      </Toolbar>
    </AppBar>
    </ThemeProvider>
    <Box sx={{ m:3}}></Box>
    <Menu />
  </div>
  );
};

export default CustomerPOS;