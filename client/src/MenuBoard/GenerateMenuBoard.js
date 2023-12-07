import React, {useEffect, useState} from 'react';
import MenuItemCard from '../CustomerPOS/components/MenuItemCard';
import '../CustomerPOS/Menu.css';
import { TranslateBulk, LanguageDialog } from '../Translate';
import { AddOnDialog } from './components/AddOnDialog';
import { AppBar, Toolbar, IconButton, Typography, Button, Box, ThemeProvider, Badge} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import alleyLogo from '../CustomerPOS/assets/the_alley_logo.png';
import theme from '../theme';
import { Weather } from '../Weather';
import AccountButton from '../AccountButton';
import { ZoomIn, ZoomOut } from '@mui/icons-material';

// const serverURL = 'https://project-3-server-ljp9.onrender.com';
const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';
const clientURL = process.env.REACT_APP_CLIENT_URL || 'http://localhost:3000';

const GenerateMenuBoard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [ addOns, setAddOns ] = useState([]);
  const [ translationMenu, setTranslationMenu ] = useState([]);
  const [ translationAddOns, setTranslationAddOns ] = useState([]);
  const [ doTL, setDoTL ] = useState(false);
  const [ isOpen, setIsOpen ] = useState({});
  const [ zoom, setZoom ] = useState(false);
  const [ orderMenuItems, setOrderMenuItems ] = useState([]);
  const [ openCheckout, setOpenCheckout ] = useState(false);

  useEffect(() => {
    const getMenu = async () => {
      try {
        var response = await fetch(serverURL+'/menu');
        var data = await response.json();
        // for (var item of data.menu) {
        //   item.enName = item.name;
        // }
        for (let i = 0; i < data.menu.length; ++i) {
          data.menu[i].enName = data.menu[i].name;
        }
        setMenuItems(data.menu);
        
        response = await fetch(serverURL+'/addOns');
        data = await response.json();
        // for (var item of data.addOns) {
        //   item.enName = item.name;
        // }
        for (let i = 0; i < data.addOns.length; ++i) {
          data.addOns[i].enName = data.addOns[i].name;
        }
        setAddOns(data.addOns);
        
        setDoTL(true);
      }
      catch (error) {
        console.log(error);
      }
    }
    getMenu();
  }, []);

  useEffect(() => {
    var temp = {};
    for (const item of menuItems) {
      temp[item.id] = false;
    }
    setIsOpen(temp);
  }, [menuItems]);

  useEffect(() => {
    if (doTL) {
      var temp = [];
      for (const item of menuItems) {
        temp.push(item.name);
      }
      TranslateBulk(temp, setTranslationMenu);
      temp = [];
      for (const item of addOns) {
        temp.push(item.name);
      }
      TranslateBulk(temp, setTranslationAddOns);
      setDoTL(false);
    }
  }, [doTL])

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

  const importAll = (r) => {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./','')] = r(item); });
    return images;
  }

  const images = importAll(require.context('../CustomerPOS/assets', false, /\.(png|jpe?g|svg)$/));

  const handleZoom = () => {
    if (zoom) {
      document.body.style.zoom = "100%";
    }
    else {
      document.body.style.zoom = "250%";
    }
    setZoom(!zoom);
  }

  const openDialog = (id) => () => {
    setIsOpen({...isOpen, [id]: true});
  }

  // if (menuItems.length === 0) {
  //   return <div></div>
  // }

  // return <div></div>

  return (
    <div>
      <ThemeProvider theme={theme}>
      <AppBar position="static">
      <Toolbar>
      {/* Left Side: Image and Weather Component */}
      <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
        <a href={clientURL}>
          <Box sx={{ mb: 1, mt: 1 }}>
            <img src={alleyLogo} alt="The Alley Logo" style={{ maxHeight: 70, maxWidth: '100%' }} />
          </Box>
        </a>
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
        <AccountButton />
      </Box>
    </Toolbar>
    </AppBar>
    </ThemeProvider>
      <div className="menu">
        {
          menuItems.map((item) => {
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
              </div>
            );
          })
        }
      </div>
      {
        menuItems.map((item) => {
          return (
            <>
            {
              isOpen[item.id]
              &&
              <AddOnDialog menuItem={item} open={isOpen} setOpen={setIsOpen} addOns={addOns} />
            }
            </>
          );
        })
      }
    </div>
  );
};

export default GenerateMenuBoard;