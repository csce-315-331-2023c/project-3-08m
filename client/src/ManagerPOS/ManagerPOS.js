// ManagerPOS.js
import React, { useEffect, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { AppBar, Toolbar, Tabs, Button, Box, ThemeProvider} from '@mui/material';
import theme from '../theme';
import alleyLogo from '../CustomerPOS/assets/the_alley_logo.png';
import { LanguageDialog, TranslateBulk } from '../Translate';
// import { NavLink, Routes, Route } from 'react-router-dom';

// Import your page components
import Employees from './pages/Employees';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Menu from './pages/Menu';
import AddOns from './pages/AddOns';
import AccountButton from '../AccountButton';
const ManagerPOS = () => {
  const [selectedTab, setSelectedTab] = useState('/manager/employees');
  const [ doTL, setDoTL ] = useState(true);
  const [ translationButtons, setTranslationButtons ] = useState([]);

  useEffect(() => {
    if (doTL) {
      var buttons = ['Employees', 'Orders', 'Inventory', 'Menu', 'Add-Ons'];
      TranslateBulk(buttons, setTranslationButtons);
      setDoTL(false);
    }
  }, [doTL]);

  const handleButtonClick = (path) => {
    setSelectedTab(path);
  };

  const navButton = (label, path) => (
    <Button
      variant={selectedTab === path ? 'contained' : 'text'}
      color="inherit"
      component={NavLink}
      to={path}
      onClick={() => handleButtonClick(path)}
      sx={{
        borderRadius: 50,
        marginX: 1,
        color: selectedTab === path ? theme.palette.primary.main : 'inherit',
        backgroundColor: selectedTab === path ? 'white' : 'inherit',
        '&:hover': {
          backgroundColor: '#CFCFCD', // Change background color on hover
          color: selectedTab === path ? 'inherit' : 'black', // Optional: Change text color on hover
        },
      }}
    >
      {label}
    </Button>
  );

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
          <Box sx={{mb:2, mt:2, flexGrow: 2, justifyContent: 'space-between'}}>
            <img src={alleyLogo} alt="The Alley Logo" style={{ maxHeight: 70, maxWidth: '100%' }} />
          </Box>
          </Box>
          {navButton(translationButtons[0] || 'Employees', '/manager/employees')}
          {navButton(translationButtons[1] || 'Orders', '/manager/orders')}
          {navButton(translationButtons[2] || 'Inventory', '/manager/inventory')}
          {navButton(translationButtons[3] || 'Menu', '/manager/menu')}
          {navButton(translationButtons[4] || 'Add-ons', '/manager/add-ons')}
          <LanguageDialog setDoTL={setDoTL} />
          <AccountButton />
        </Toolbar>
      </AppBar>
      <Box sx={{ m:1}}></Box>
      <Routes>
        <Route path="/employees" element={<Employees doTL={doTL}/>} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/add-ons" element={<AddOns />} />
        <Route path="/" element={<Employees />} />
      </Routes>
    </ThemeProvider>
  );
};

export default ManagerPOS;