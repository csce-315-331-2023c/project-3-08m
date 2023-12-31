import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * The Menu Item card display for the Menu
 * @param {props} props - the props needed for the Menu Card to display correctly 
 * @returns the Menu Item displayed in a card format
 */
function MenuItemCard({ title, price, imageUrl }) {
  return (
    <Box sx={{
      display: 'flex',
      background: '#FFF',
      borderRadius: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      transition: 'box-shadow 0.3s ease',
      width: '513px',
      maxWidth: '600px', // Set max width
      '&:hover': {
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
      }
    }}>
      <Box sx={{
        flex: '0 0 150px',
        overflow: 'hidden'
      }}>
        <img src={imageUrl} alt={title} style={{ width: '100%', height: 'auto' }} />
      </Box>
      <Box sx={{ 
        marginLeft: '20px', 
        marginRight: '20px',
        justifyContent: 'space-between', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start',
      }}>
        <Box sx={{ m: 2 }} />
        <Typography variant="h6" component="h3" sx={{ m: 0, color: '#0000000', fontWeight: 'bold' }}>
          {title}
      </Typography>
        {/* <Box sx={{ m: 1 }} /> */}
        <Typography variant="body1" sx={{ color: '#0000000000' }}>
          {price}
        </Typography>
        <Box sx={{ m: 2 }} />
      </Box>
    </Box>
  );
}

export default MenuItemCard;


