import React, { useState, useEffect } from 'react';
import './Menu.css'; // Make sure to create a CSS file with this name
import { TranslateBulk, LanguageDialog } from '../Translate';
import { AddOnDialog } from './AddOns';
import MenuItemCard from './components/MenuItemCard';
import { CheckoutDialog } from './components/Checkout';
import { AppBar, Toolbar, IconButton, Typography, Button, Box, ThemeProvider, Badge} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import alleyLogo from './assets/the_alley_logo.png';
import theme from '../theme';
import { Weather } from '../Weather';
import AccountButton from '../AccountButton';
import { ZoomIn, ZoomOut } from '@mui/icons-material';

// const serverURL = 'http://localhost:9000';
// const serverURL = 'https://project-3-server-ljp9.onrender.com';
const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

/**
 * The Menu for the Customer GUI.
 * @returns html for the Menu and associated dialogs
 */
const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [ isOpen, setIsOpen ] = useState({});
  const [ orderMenuItems, setOrderMenuItems ] = useState([]);
  const [ orderMenuItemAddOns, setOrderMenuItemAddOns ] = useState([]);
  const [ price, setPrice ] = useState(0);
  const [ openCheckout, setOpenCheckout ] = useState(false);
  const [ notes, setNotes ] = useState([]);
  const [ doTL, setDoTL ] = useState(false);
  const [ translationMenu, setTranslationMenu ] = useState([]);
  const [ translationAddOns, setTranslationAddOns ] = useState([]);
  const [ addOns, setAddOns ] = useState([]);
  const [ zoom, setZoom ] = useState(false);

  useEffect(() => {
    var abortController = new AbortController();
    // gets the meu and add ons
    const getMenu = async () => {
      try {
        var response = await fetch(serverURL+'/menu', {signal: abortController.signal});
        var data = await response.json();
        for (let i = 0; i < data.menu.length; i++) {
          data.menu[i].enName = data.menu[i].name;
        }
        setMenuItems(data.menu);

        response = await fetch(serverURL+'/addOns', {signal: abortController.signal});
        data = await response.json();
        for (let i = 0; i < data.addOns.length; ++i) {
          data.addOns[i].enName = data.addOns[i].name;
        }
        setAddOns(data.addOns);
        setDoTL(true);
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
  // console.log(menuItems);
  // console.log(addOns);

  // translates the menu and add ons
  useEffect(() => {
    if (doTL) {
      var temp = [];
      for (const menuItem of menuItems) {
        temp.push(menuItem.enName);
      }
      // setTranslation(TranslateBulk(temp));
      TranslateBulk(temp, setTranslationMenu);
      temp = [];
      for (const addOn of addOns) {
        temp.push(addOn.enName);
      }
      TranslateBulk(temp, setTranslationAddOns)
      setDoTL(false);
    }
  }, [doTL])

  // sets open boolean for each menu item dialog to false.
  useEffect(() => {
    var open = {};
    for (const item of menuItems) {
      open[item.id] = false;
    }
    setIsOpen(open);
  }, [menuItems]);

  // sets the name of each menu item to its translation.
  useEffect(() => {
    for (let i = 0; i < translationMenu.length; ++i) {
      menuItems[i].name = translationMenu[i];
    }
    setMenuItems([...menuItems]);
  }, [translationMenu])

  // sets the name of each add on to its translation.
  useEffect(() => {
    for (let i = 0; i < translationAddOns.length; ++i) {
      addOns[i].name = translationAddOns[i];
    }
    setAddOns([...addOns]);
  }, [translationAddOns])

  /**
   * Imports all images in a directory
   * @param {require.context} r - the context of the directory to import from
   * @returns a dictionary mapping the name of the image file to the image.
   */
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

  /**
   * Sets the isOpen state to true for a menu item
   * @param {String} id - the id of the menu item that was clicked
   * @returns void
   */
  const openDialog = (id) => () => {
    setIsOpen({...isOpen, [id]: true});
  }

  const handleZoom = () => {
    if (zoom) {
      document.body.style.zoom = "100%";
    }
    else {
      document.body.style.zoom = "250%";
    }
    setZoom(!zoom);
  }

  // console.log(menuItems);
  // console.log(isOpen);

  // loading
  for (const item of menuItems) {
    if (isOpen[item.id] === undefined) {
      return <div></div>
    }
  }

  return (
    <div>
      <ThemeProvider theme={theme}>
      <AppBar position="static">
      <Toolbar>
      {/* Left Side: Image and Weather Component */}
      <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
        <Box sx={{ mb: 1, mt: 1 }}>
          <img src={alleyLogo} alt="The Alley Logo" style={{ maxHeight: 70, maxWidth: '100%' }} />
        </Box>
        <Box sx={{ ml:2 }}><Weather doTL={doTL} /></Box>
        
      </Box>

      {/* Right Side: Icon Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {
          zoom ? 
          <IconButton aria-label="Zoom Out" alt="Zoom Out" onClick={handleZoom} sx={{color: 'white'}}><ZoomOut /></IconButton>
          :
          <IconButton aria-label="Zoom In" alt="Zoom In" onClick={handleZoom} sx={{color: 'white'}}><ZoomIn /></IconButton>
        }
        <LanguageDialog setDoTL={setDoTL} />
        <IconButton 
          alt="Checkout"
          onClick={() => setOpenCheckout(true)} 
          aria-label="View Order and Checkout" 
          sx={{ color: 'white' }} // Apply white color to the icon
        >
          <Badge badgeContent={orderMenuItems.length} color='secondary'>
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <AccountButton />
      </Box>
    </Toolbar>
    </AppBar>
    </ThemeProvider>
    <Box sx={{ m:3}}></Box>
      {/* <LanguageDialog />
      <Button onClick={() => setOpenCheckout(true)}>View Order and Checkout</Button> */}
      <div className="menu" style={{overflow: 'auto'}}>
        {/* <button> */}
        {menuItems.map((item, i) => {
          let menuPicture = item.enName.toLowerCase().replaceAll(" ", "_").replaceAll('.','')+".jpeg";
          // if no image set to default
          if (!(menuPicture in images)) {
            menuPicture = 'boba.png';
          }
          return (
            <div>
            <button onClick={openDialog(item.id)} className='item-card-btn' alt={item.name}>
              <MenuItemCard key={item.id} title={item.name} price={`$${Number(item.price).toFixed(2)}`} imageUrl={images[menuPicture]} />
            </button> 
            <Box sx={{ m:3}}></Box>
            </div>
          )})}
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
                                addOns={addOns}
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
                          addOns={addOns}
                      />}
    </div>
  );
};

export default Menu;
