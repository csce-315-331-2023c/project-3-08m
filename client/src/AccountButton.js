import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

function AccountButton() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear authentication data here (e.g., localStorage, context, Redux)
    localStorage.removeItem('userToken'); // Example: Clearing token from localStorage

    navigate('/login'); // Redirect to login page
    handleClose();
  };

  return (
    <div>
      <IconButton onClick={handleMenu} color="inherit">
        <AccountCircle />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
export default AccountButton;