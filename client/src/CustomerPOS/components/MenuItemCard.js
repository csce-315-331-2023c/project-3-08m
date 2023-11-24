import React from 'react';
import './MenuItemCard.css'; // Import the CSS file we'll create
import Box from '@mui/material/Box';

function MenuItemCard({ title, price, imageUrl }) {
  return (
    <div className="menu-item-card">
      <div className="menu-item-image-container">
        <img src={imageUrl} alt={title} />
      </div>
      <div className="menu-item-info">
        <h3>{title}</h3>
        <Box sx={{ m: 1 }} />
        <p className="price">{price}</p>
      </div>
    </div>
  );
}

export default MenuItemCard;
