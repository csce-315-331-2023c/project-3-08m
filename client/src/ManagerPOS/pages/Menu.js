// Menu.js
import React, { useState } from 'react';
import MenuTable from '../components/Tables/MenuTable';
import PopularityReport from '../components/Reports/PopularityReport'; // Ensure correct path
import { Box, Button, ThemeProvider } from '@mui/material';
import theme from '../theme';

const Menu = () => {
  const [showPopularityReport, setShowPopularityReport] = useState(false);

  const handleOpenPopularityReport = () => {
    setShowPopularityReport(true);
  };

  const handleClosePopularityReport = () => {
    setShowPopularityReport(false);
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Menu</h2>
          <Button sx={{ m: 1 }} color="primary" variant="contained" onClick={handleOpenPopularityReport}>
            Popularity Report
          </Button>
        </Box>
        <MenuTable />
        <PopularityReport isOpen={showPopularityReport} onClose={handleClosePopularityReport} />
      </ThemeProvider>
    </div>
  );
};

export default Menu;

