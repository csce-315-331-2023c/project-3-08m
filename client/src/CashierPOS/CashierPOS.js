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
import { AppBar, Box, Toolbar } from '@mui/material';
import { Weather } from '../Weather';
import { LanguageDialog, TranslateBulk, TranslateText } from '../Translate';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

const CashierPOS = () => {
  const [ doTL, setDoTL ] = useState(true);
  const [ translationText, setTranslationText ] = useState('');
  const [ translationMenu, setTranslationMenu ] = useState([]);
  const [ translationAddOns, setTranslationAddOns ] = useState([]);
  const [ menuItems, setMenuItems ] = useState([]);
  const [ addOns, setAddOns ] = useState([]);

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

  if (addOns.length === 0 || menuItems.length === 0) {
    return <div></div>
  }

  return (
    <div>
      <ThemeProvider theme={theme}>
        <AppBar position='static'>
          <Toolbar>
            <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
              <Box sx={{ mb: 1, mt: 1 }}>
                <img src={alleyLogo} alt='The Alley Logo' style={{ maxHeight: 70, maxWidth: '100%'}} />
              </Box>
              <Box sx={{ m1:2 }}><Weather doTL={doTL} /></Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center'}}>
              <LanguageDialog setDoTL={setDoTL} />
            </Box>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
      <div class="cashier-container">
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
  );
};

export default CashierPOS;
