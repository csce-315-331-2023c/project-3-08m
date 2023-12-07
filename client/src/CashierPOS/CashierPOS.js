import React, { useEffect, useState } from 'react';
import './CashierPOS.css';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GenerateMenu from './GenerateMenu';
import Order from './Order';
import AddAddOns from './AddAddOns';
import theme from '../theme';
import alleyLogo from '../CustomerPOS/assets/the_alley_logo.png';
import { ThemeProvider } from '@emotion/react';
import { AppBar, Box, Toolbar, IconButton } from '@mui/material';
import { Weather } from '../Weather';
import { LanguageDialog, TranslateBulk, TranslateText } from '../Translate';
import AccountButton from '../AccountButton';
import { ZoomOut, ZoomIn } from '@mui/icons-material';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';
const clientURL = process.env.REACT_APP_CLIENT_URL || 'http://localhost:3000';

/**
 * Generates the cashier page
 * @returns {JSX.Element} for cashier page
 */
const CashierPOS = () => {
  const [ doTL, setDoTL ] = useState(true);
  const [ translationText, setTranslationText ] = useState('');
  const [ translationMenu, setTranslationMenu ] = useState([]);
  const [ translationAddOns, setTranslationAddOns ] = useState([]);
  const [ menuItems, setMenuItems ] = useState([]);
  const [ addOns, setAddOns ] = useState([]);
  const [ zoom, setZoom ] = useState(false);

  useEffect(() => {
    const getMenuAndAddOns = async () => {
      try {
        var response = await fetch(serverURL + '/menu');
        var res = await response.json();
        for (var item of res.menu) {
          item['enName'] = item.name;
        }
        setMenuItems(res.menu);
        response = await fetch(serverURL + '/addOns');
        res = await response.json();
        for (var item of res.addOns) {
          item['enName'] = item.name;
        }
        setAddOns(res.addOns);
        setDoTL(true);
      }
      catch (error) {
        console.log(error);
      }
    }
    getMenuAndAddOns();
  }, [])
  
  useEffect(() => {
    if (doTL) {
      TranslateText('Menu', setTranslationText);
      var temp = [];
      for (const item of menuItems) {
        temp.push(item.enName);
      }
      TranslateBulk(temp, setTranslationMenu);
      temp = [];
      for (const item of addOns) {
        temp.push(item.enName);
      }
      TranslateBulk(temp, setTranslationAddOns);
      setDoTL(false);
    }
  }, [doTL, menuItems, addOns])

  useEffect(() => {
    for (let i = 0; i < translationMenu.length; ++i) {
      menuItems[i].name = translationMenu[i];
    }
    setMenuItems([...menuItems]);
  }, [translationMenu])

  useEffect(() => {
    for (let i = 0; i < translationAddOns.length; ++i) {
      addOns[i].name = translationAddOns[i];
    }
    setAddOns([...addOns]);
  }, [translationAddOns])

  const handleZoom = () => {
    if (zoom) {
      document.body.style.zoom = "100%";
    }
    else {
      document.body.style.zoom = "250%";
    }
    setZoom(!zoom);
  }

  if (addOns.length === 0 || menuItems.length === 0) {
    return <div></div>
  }

  return (
    <>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>The Alley POS Systems</title>
    </head>
    <div>
      <ThemeProvider theme={theme}>
        <AppBar position='static'>
          <Toolbar>
            <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
              <a href={clientURL}>
                <Box sx={{ mb: 1, mt: 1 }}>
                  <img src={alleyLogo} alt='The Alley Logo' style={{ maxHeight: 70, maxWidth: '100%'}} />
                </Box>
              </a>
              <Box sx={{ m1:2 }}><Weather doTL={doTL} /></Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center'}}>
              {
                zoom ? 
                  <IconButton aria-label="Zoom Out" onClick={handleZoom} sx={{color: 'white'}}><ZoomOut /></IconButton>
                  :
                  <IconButton aria-label="Zoom In" onClick={handleZoom} sx={{color: 'white'}}><ZoomIn /></IconButton>
              }
              <LanguageDialog setDoTL={setDoTL} />
              <AccountButton />
            </Box>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
      <div class="cashier-container" style={{overflow: 'auto'}}>
        <div class="left-half">
          <Order doTL={doTL} menuItems={menuItems} addons={addOns} />
        </div>
        <div class="right-half">
          <h1 className='text-center'>{translationText || 'Menu'}</h1>
          <GenerateMenu doTL={doTL} menuItems={menuItems} addOns={addOns} />
        </div>
      </div>
      <Routes>
        <Route path="/add-ons" element={<AddAddOns />} />
        <Route path="/cashier/add-ons/:itemId" element={<AddAddOns />} />
      </Routes>
    </div>
    </>
  );
};

export default CashierPOS;
