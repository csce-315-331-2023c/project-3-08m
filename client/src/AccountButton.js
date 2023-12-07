import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { TranslateBulk } from './Translate';

/**
 * Provides a button for the user to access their account
 * @returns {JSX.Element} Account button
 */
function AccountButton() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [ translationText, setTranslationText] = useState([]);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  useEffect(() => {
    // console.log('a');
    if (open) {
      var text = ['Logout'];
      TranslateBulk(text, setTranslationText);
    }
  }, [open]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear authentication data here (e.g., localStorage, context, Redux)
    localStorage.removeItem('userToken'); // Example: Clearing token from localStorage
    sessionStorage.removeItem('language');
    sessionStorage.removeItem('languageName');

    navigate('/login'); // Redirect to login page
    handleClose();
  };

  return (
    <div>
      <IconButton onClick={handleMenu} color="inherit" aria-label="Account">
        <AccountCircle />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleLogout}>{translationText[0] || 'Logout'}</MenuItem>
      </Menu>
    </div>
  );
}
export default AccountButton;