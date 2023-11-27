import React, { useState, useEffect } from 'react';
import './Menu.css'; // Make sure to create a CSS file with this name
import defaultDrinkImage from './assets/boba.svg';
import { TranslateBulk, LanguageDialog } from '../Translate';
import { AddOnDialog } from './AddOns';
import MenuItemCard from './components/MenuItemCard';
import { CheckoutDialog } from './components/Checkout';
import { AppBar, Toolbar, IconButton, Typography, Button, Box, ThemeProvider, Badge} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import alleyLogo from './assets/the_alley_logo.png';
import theme from '../theme';

// const serverURL = 'http://localhost:9000';
// const serverURL = 'https://project-3-server-ljp9.onrender.com';
const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

const MenuItem = ({ name, price }) => (
  // let [isOpen, setIsOpen] = useState(false);
  // <button onClick={}>
  <div className="menu-item">
    <img src={defaultDrinkImage} alt="Default Drink"className='menu-image' />
    <h3>{name}</h3>
    <div className="menu-price">{`$${price.toFixed(2)}`}</div>
    {/* Likes functionality can be added if you have that data */}
  </div>
  // </button>
);

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [ isOpen, setIsOpen ] = useState({});
  const [ orderMenuItems, setOrderMenuItems ] = useState([]);
  const [ orderMenuItemAddOns, setOrderMenuItemAddOns ] = useState([]);
  const [ price, setPrice ] = useState(0);
  const [ openCheckout, setOpenCheckout ] = useState(false);
  const [ notes, setNotes ] = useState([]);

  useEffect(() => {
    var abortController = new AbortController();
    const getMenu = async () => {
      try {
        var response = await fetch(serverURL+'/menu', {signal: abortController.signal});
        var data = await response.json();
        for (let i = 0; i < data.menu.length; i++) {
          data.menu[i].enName = data.menu[i].name;
        }
        setMenuItems(data.menu);
      }
      catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    getMenu();
    return () => {
      abortController.abort();
    }
  }, []);
  console.log(menuItems);

  useEffect(() => {
    var open = {};
    for (const item of menuItems) {
      open[item.id] = false;
    }
    setIsOpen(open);
  }, [menuItems]);
  // let menuItemsDialogDict = [];
  try {
    var temp = [];
    for (const menuItem of menuItems) {
      temp.push(menuItem.name);
    }
    // console.log(temp);
    var translations = TranslateBulk(temp);
    console.log(menuItems);
    for (let i = 0; i < translations.length && i < menuItems.length; ++i) {
      menuItems[i].name = translations[i];
    }
  }
  catch (error) {
    console.log(error);
  }

  const importAll = (r) => {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./','')] = r(item); });
    return images;
  }

  // let menuPicture = enName.toLowerCase().replaceAll(" ", "_").replaceAll('.','')+".jpeg";

  const images = importAll(require.context('./assets', false, /\.(png|jpe?g|svg)$/));

  // if (!(menuPicture in images)) {
  //   menuPicture = 'boba.svg';
  // }

  // if (Object.entries(isOpen).length === 0) {
  //   return <div></div>
  // }

  const openDialog = (id) => () => {
    setIsOpen({...isOpen, [id]: true});
  }

  // console.log(menuItems);
  // console.log(isOpen);

  for (const item of menuItems) {
    if (isOpen[item.id] === undefined) {
      return <div></div>
    }
  }

  return (
    <div>
      <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          
          <Box sx={{mb:1, mt:1, flexGrow: 1 }}>
            <img src={alleyLogo} alt="The Alley Logo" style={{ maxHeight: 70, maxWidth: '100%' }} />
          </Box>  
          <LanguageDialog />
          <div>
           {/* <Button onClick={() => setOpenCheckout(true)}>View Order and Checkout</Button> */}
          <IconButton 
            onClick={() => setOpenCheckout(true)} 
            aria-label="View Order and Checkout" 
            sx={{ color: 'white' }} // Apply white color to the icon
          >
            <Badge badgeContent={orderMenuItems.length} color='secondary'>
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
    </ThemeProvider>
    <Box sx={{ m:3}}></Box>
      {/* <LanguageDialog />
      <Button onClick={() => setOpenCheckout(true)}>View Order and Checkout</Button> */}
      <div className="menu">
        {/* <button> */}
        {menuItems.map(item => {
          let menuPicture = item.enName.toLowerCase().replaceAll(" ", "_").replaceAll('.','')+".jpeg";
          if (!(menuPicture in images)) {
            menuPicture = 'boba.png';
          }
          return (
            <div>
            <button onClick={openDialog(item.id)} className='item-card-btn'>
              <MenuItemCard key={item.id} title={item.name} price={`$${Number(item.price).toFixed(2)}`} imageUrl={images[menuPicture]} />
            </button> 
            <Box sx={{ m:3}}></Box>
            </div>       )})}
        {/* </button> */}
      </div>
      {/* <LanguageDialog /> */}
      {menuItems.map(item => {
        return (
          <>
          {isOpen[item.id] && <AddOnDialog 
                                key={item.id}
                                menuItem={item}
                                open={isOpen} setOpen={setIsOpen}
                                orderMenuItems={orderMenuItems}
                                orderMenuItemAddOns={orderMenuItemAddOns}
                                totalPrice={price} setTotalPrice={setPrice} 
                                notes={notes}
                              />}
          </>
        )
      })}
      {openCheckout && <CheckoutDialog 
                          orderMenuItems={orderMenuItems} setOrderMenuItems={setOrderMenuItems}
                          orderMenuItemsAddOns={orderMenuItemAddOns} setOrderMenuItemAddOns={setOrderMenuItemAddOns}
                          price={price} setPrice={setPrice}
                          notes={notes} setNotes={setNotes}
                          isOpen={openCheckout} setIsOpen={setOpenCheckout}
                      />}
    </div>
  );
};

export default Menu;
