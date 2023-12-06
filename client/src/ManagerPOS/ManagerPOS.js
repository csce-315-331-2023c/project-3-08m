// ManagerPOS.js
import React, { useEffect, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { AppBar, Toolbar, Tabs, Button, Box, ThemeProvider, IconButton} from '@mui/material';
import theme from '../theme';
import alleyLogo from '../CustomerPOS/assets/the_alley_logo.png';
import { LanguageDialog, TranslateBulk } from '../Translate';
// import { NavLink, Routes, Route } from 'react-router-dom';
import { ZoomOut, ZoomIn } from '@mui/icons-material';

// Import your page components
import Employees from './pages/Employees';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Menu from './pages/Menu';
import AddOns from './pages/AddOns';
import AccountButton from '../AccountButton';
import { Weather } from '../Weather';

/**
 * ManagerPOS is a React component that serves as the main interface for the manager's point of sale (POS) system.
 * It provides navigation to different sections like Employees, Orders, Inventory, Menu, and Add-Ons through a tabbed interface.
 * The component also supports language translation and includes an account button for user management.
 *
 * @component
 *
 * @returns {ReactElement} The main POS interface with navigation and routed content for each section.
 *
 * @example
 * <ManagerPOS />
 */

const ManagerPOS = () => {
  const [selectedTab, setSelectedTab] = useState('/manager/employees');
  const [ doTL, setDoTL ] = useState(true);
  const [ translationButtons, setTranslationButtons ] = useState([]);
  const [ zoom, setZoom ] = useState(false);

  useEffect(() => {
    if (doTL) {
      var buttons = ['Employees', 'Orders', 'Inventory', 'Menu', 'Add-Ons'];
      TranslateBulk(buttons, setTranslationButtons);
      setDoTL(false);
    }
  }, [doTL]);

  const handleButtonClick = (path) => {
    if (path !== selectedTab) {
      setDoTL(true);
      setSelectedTab(path);
    }
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

  const handleZoom = () => {
    if (zoom) {
      document.body.style.zoom = "100%";
    }
    else {
      document.body.style.zoom = "250%";
    }
    setZoom(!zoom);
  }

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
          <Box sx={{mb:2, mt:2, flexGrow: 2, justifyContent: 'space-between'}}>
            <img src={alleyLogo} alt="The Alley Logo" style={{ maxHeight: 70, maxWidth: '100%' }} />
          </Box>
          {/* <Box sx={{ ml:2 }}><Weather doTL={doTL} /></Box> */}
          </Box>
          {navButton(translationButtons[0] || 'Employees', '/manager/employees')}
          {navButton(translationButtons[1] || 'Orders', '/manager/orders')}
          {navButton(translationButtons[2] || 'Inventory', '/manager/inventory')}
          {navButton(translationButtons[3] || 'Menu', '/manager/menu')}
          {navButton(translationButtons[4] || 'Add-ons', '/manager/add-ons')}
          {
            zoom ? 
            <IconButton aria-label="Zoom Out" onClick={handleZoom} sx={{color: 'white'}}><ZoomOut /></IconButton>
            :
            <IconButton aria-label="Zoom In" onClick={handleZoom} sx={{color: 'white'}}><ZoomIn /></IconButton>
          }
          <LanguageDialog setDoTL={setDoTL} />
          <AccountButton />
        </Toolbar>
      </AppBar>
      <Box sx={{ m:1}}></Box>
      <Routes>
        <Route path="/employees" element={<Employees doTL={doTL}/>} />
        <Route path="/orders" element={<Orders doTL={doTL} />} />
        <Route path="/inventory" element={<Inventory doTL={doTL} />} />
        <Route path="/menu" element={<Menu doTL={doTL} />} />
        <Route path="/add-ons" element={<AddOns doTL={doTL} />} />
        <Route path="/" element={<Employees doTL={doTL} />} />
      </Routes>
    </ThemeProvider>
  );
};

export default ManagerPOS;