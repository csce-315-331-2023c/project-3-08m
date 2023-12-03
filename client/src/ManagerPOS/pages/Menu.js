// Menu.js
import React, { useEffect, useState } from 'react';
import MenuTable from '../components/Tables/MenuTable';
import PopularityReport from '../components/Reports/PopularityReport'; // Ensure correct path
import { Box, Button, ThemeProvider } from '@mui/material';
import theme from '../../theme';
import { TranslateBulk } from '../../Translate';

const Menu = ({doTL}) => {
  const [showPopularityReport, setShowPopularityReport] = useState(false);
  const [ translationText, setTranslationText ] = useState([]);

  useEffect(() => {
    if (doTL) {
      var text = ['Menu', 'Popularity Report'];
      TranslateBulk(text, setTranslationText);
    }
  }, [doTL])

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
          <h2>{translationText[0] || 'Menu'}</h2>
          <Button sx={{ m: 1 }} color="primary" variant="contained" onClick={handleOpenPopularityReport}>
            {translationText[1] || 'Popularity Report'}
          </Button>
        </Box>
        <MenuTable doTL={doTL} />
        {
          showPopularityReport &&
          <PopularityReport isOpen={showPopularityReport} onClose={handleClosePopularityReport} />
        }
      </ThemeProvider>
    </div>
  );
};

export default Menu;

