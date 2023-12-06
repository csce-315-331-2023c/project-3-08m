import React, { useEffect, useState } from 'react';
import { Box, Button, ThemeProvider,  } from '@mui/material';
import InventoryTable from '../components/Tables/InventoryTable';
import ExcessReport from '../components/Reports/ExcessReport';
import RestockReport from '../components/Reports/RestockReport';
import theme from '../../theme';
import { TranslateBulk } from '../../Translate';

/**
 * Inventory is a React component that renders an inventory management interface.
 * It includes a title for the inventory section, buttons to open the Excess and Restock reports, 
 * and a table of inventory items. The component supports internationalization for the title and button text.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.doTL - A boolean indicating whether translations should be performed for the title and button text.
 *
 * @returns {ReactElement} A component with a title, buttons for opening Excess and Restock reports, and the InventoryTable.
 *
 * @example
 * <Inventory doTL={true} />
 */

const Inventory = ({doTL}) => {
  const [showExcessReport, setShowExcessReport] = useState(false);
  const [showRestockReport, setShowRestockReport] = useState(false);
  const [ translationText, setTranslationText ] = useState([]);

  useEffect(() => {
    if (doTL) {
      var text = ['Inventory', 'Excess Report', 'Restock Report'];
      TranslateBulk(text, setTranslationText);
    }
  }, [doTL])

  const handleOpenExcessReport = () => {
    setShowExcessReport(true);
  };

  const handleCloseExcessReport = () => {
    setShowExcessReport(false);
  };

  const handleOpenRestockReport = () => {
    setShowRestockReport(true);
  };

  const handleCloseRestockReport = () => {
    setShowRestockReport(false);
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2>{translationText[0] || 'Inventory'}</h2>
          <Box>
            <Button sx={{m:1}} color="primary" variant="contained" onClick={handleOpenExcessReport}>{translationText[1] || 'Excess Report'}</Button>
            <Button sx={{m:1}} color="primary" variant="contained" onClick={handleOpenRestockReport}>{translationText[2] || 'Restock Report'}</Button>
          </Box>
        </Box>
        <InventoryTable doTL={doTL}/>
        {
          showExcessReport &&
          <ExcessReport isOpen={showExcessReport} onClose={handleCloseExcessReport} />
        }
        {
          showRestockReport &&
          <RestockReport isOpen={showRestockReport} onClose={handleCloseRestockReport} />
        }
      </ThemeProvider>
    </div>
  );
};

export default Inventory;