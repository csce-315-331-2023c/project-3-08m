// Menu.js
import React, { useEffect, useState } from 'react';
import MenuTable from '../components/Tables/MenuTable';
import PopularityReport from '../components/Reports/PopularityReport'; // Ensure correct path
import { Box, Button, ThemeProvider } from '@mui/material';
import theme from '../../theme';
import { TranslateBulk } from '../../Translate';

/**
 * Menu is a React component that renders a menu management interface.
 * It includes a title for the menu, a button to open a popularity report, and a table of menu items.
 * The component supports internationalization for the title and button text.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.doTL - A boolean indicating whether translations should be performed for the title and button text.
 *
 * @returns {ReactElement} A component with a title, a button for opening a popularity report, and the MenuTable.
 *
 * @example
 * <Menu doTL={true} />
 */

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

