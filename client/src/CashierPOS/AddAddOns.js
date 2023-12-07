import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToOrder } from './actions';
import './AddOns.css';
import theme from '../theme';
import alleyLogo from '../CustomerPOS/assets/the_alley_logo.png';
import { ThemeProvider } from '@emotion/react';
import { AppBar, Box, Toolbar } from '@mui/material';
import { Weather } from '../Weather';
import { LanguageDialog, TranslateBulk } from '../Translate';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

/**
 * Generates the add-ons page for the cashier POS
 * @returns {JSX.Element} for add-ons page
 */
const AddAddOns = () => {
  const { itemId } = useParams();
  const dispatch = useDispatch();
  const menuItems = useSelector((state) => state.menuItems);
  const orderItems = useSelector((state) => state.orders);
  const addons = useSelector((state) => state.addons);
  const [ translationText, setTranslationText ] = useState([]);
  const [ translationAddOns, setTranslationAddOns ] = useState([]);
  const [ doTL, setDoTL ] = useState(true);
  const [ menuItemAddOns, setMenuItemAddOns ] = useState([]);

  useEffect(() => {
    const getAddOns = async () => {
      try {
        var response = await fetch(serverURL+'/single', {
            method: 'POST',
            headers: {
                "Content-type": "application/json; charset = UTF-8"
            },
            body: JSON.stringify({'menu_add_ons': itemId})
        });
        var res = await response.json();
        var temp = [];
        // console.log(res.response);
        for (var item of res.response) {
            temp.push(addons.filter((value) => item.id === value.id)[0]);
        }
        console.log(temp);
        setMenuItemAddOns(temp);
        setDoTL(true);
      }
      catch (error) {
          console.log(error);
      }
    }
    getAddOns();
  }, [])

  useEffect(() => {
    if (doTL) {
      var text = ['Add-Ons for', 'Save Order']
      TranslateBulk(text, setTranslationText);
      var temp = [];
      for (const item of menuItemAddOns) {
        temp.push(item.enName);
      }
      console.log(temp);
      TranslateBulk(temp, setTranslationAddOns);
      setDoTL(false);
    }
  }, [doTL, menuItemAddOns])

  useEffect(() => {
    for (let i = 0; i < translationAddOns.length; ++i) {
      menuItemAddOns[i].name = translationAddOns[i];
    }
    setMenuItemAddOns([...menuItemAddOns]);
  }, [translationAddOns])

  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [menuItem, setMenuItem] = useState();
  const navigate = useNavigate();

  const handleAddOnSelect = (addOn) => {
    setSelectedAddOns((prevAddOns) =>
      prevAddOns.includes(addOn)
        ? prevAddOns.filter((selected) => selected !== addOn)
        : [...prevAddOns, addOn]
    );
  };

  useEffect(() => {
    console.log('MenuItem changed:', menuItem);
    console.log('Selected addons changed:', selectedAddOns);
    console.log('Order items changed:', orderItems);
    console.log('Addons changed:', addons);
    console.log('Menu items changed:', menuItems);
  }, [menuItem]);

  useEffect(() => {
    // console.log(itemId);
    // console.log(menuItems);
    const selectedMenuItem = menuItems.find((item) => item.id.toString() === itemId);
    if (selectedMenuItem) {
      setMenuItem(selectedMenuItem);
    }
  }, [itemId, menuItems]);

  const handleSave = () => {
    dispatch(addItemToOrder(menuItem, selectedAddOns));
    navigate('/cashier');
  };

  return (
    <>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>The Alley POS Systems</title>
    </head>
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
    <div class="addOnPage">
      <h1>{translationText[0] || 'Add Ons for'} {menuItem ? menuItem.name : 'Loading...'}</h1>
      <ul class="addOnList">
        {menuItemAddOns.map((addOn) => (
          <li class="addOnListItem" key={addOn}>
            <label class="addOnCheckBox">
              <input class="addOnCheckBoxInput"
                type="checkbox"
                checked={selectedAddOns.includes(addOn)}
                onChange={() => handleAddOnSelect(addOn)}
              />
              <span class="addOnCheckBoxControl"></span>
              {addOn.name}
            </label>
          </li>
        ))}
      </ul>
      <button type="button" onClick={handleSave}>
        {translationText[1] || 'Save Order'}
      </button>
    </div>
    </>
  );
};

export default AddAddOns;