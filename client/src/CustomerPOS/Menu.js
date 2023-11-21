import React, { useState, useEffect } from 'react';
import './Menu.css'; // Make sure to create a CSS file with this name
import defaultDrinkImage from './assets/boba.svg';
import { TranslateBulk, LanguageDialog } from '../Translate';

// const serverURL = 'http://localhost:9000';
// const serverURL = 'https://project-3-server-ljp9.onrender.com';
const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

const MenuItem = ({ name, price }) => (
  <div className="menu-item">
    <img src={defaultDrinkImage} alt="Default Drink"className='menu-image' />
    <h3>{name}</h3>
    <div className="menu-price">{`$${price.toFixed(2)}`}</div>
    {/* Likes functionality can be added if you have that data */}
  </div>
);

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    var abortController = new AbortController();
    const getMenu = async () => {
      try {
        var response = await fetch(serverURL+'/menu', {signal: abortController.signal});
        var data = await response.json();
        setMenuItems(data.menu);
          // .then(response => response.json())
          // .then(data => {
          //   // console.log(data.menu);
          //   setMenuItems(data.menu);
          // })
          // .catch(error => {
          //   console.error('Error fetching data: ', error);
          // });
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
  try {
    var temp = [];
    for (const menuItem of menuItems) {
      temp.push(menuItem.name);
    }
    // console.log(temp);
    var translations = TranslateBulk(temp);
    // var translations = [];
    // if (menuItems[0].name !== 'default') {
    //   console.log(menuItems);
    //   translations = TranslateBulk(temp);
    // }
    console.log(menuItems);
    for (let i = 0; i < translations.length && i < menuItems.length; ++i) {
      menuItems[i].name = translations[i];
    }
  }
  catch (error) {
    console.log(error);
  }
  return (
    <div>
      <div className="menu">
        {menuItems.map(item => (
          <MenuItem key={item.id} {...item} />
        ))}
      </div>
      <LanguageDialog />
    </div>
  );
};

export default Menu;
