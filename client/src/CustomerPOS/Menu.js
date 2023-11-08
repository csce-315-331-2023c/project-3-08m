import React, { useState, useEffect } from 'react';
import './Menu.css'; // Make sure to create a CSS file with this name
import defaultDrinkImage from './assets/boba.svg';

const serverURL = 'http://localhost:9000';
// const serverURL = 'https://project-3-server-ljp9.onrender.com';

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
    fetch(serverURL+'/menu')
      .then(response => response.json())
      .then(data => {
        setMenuItems(data.menu);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  return (
    <div className="menu">
      {menuItems.map(item => (
        <MenuItem key={item.id} {...item} />
      ))}
    </div>
  );
};

export default Menu;
