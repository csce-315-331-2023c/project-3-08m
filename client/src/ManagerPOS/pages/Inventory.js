import React, { useState } from 'react';
import OrdersTable from '../components/Tables/OrdersTable';
import SalesReport from '../components/Reports/SalesReport'; // Updated import
import { Box, Button, ThemeProvider,  } from '@mui/material';
import InventoryTable from '../components/Tables/InventoryTable';
import ExcessReport from '../components/Reports/ExcessReport';
import RestockReport from '../components/Reports/RestockReport';
import theme from '../../theme';

const Inventory = () => {
  const [showExcessReport, setShowExcessReport] = useState(false);
  const [showRestockReport, setShowRestockReport] = useState(false);

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
          <h2>Inventory</h2>
          <Box>
            <Button sx={{m:1}} color="primary" variant="contained" onClick={handleOpenExcessReport}>Excess Report</Button>
            <Button sx={{m:1}} color="primary" variant="contained" onClick={handleOpenRestockReport}>Restock Report</Button>
          </Box>
        </Box>
        <InventoryTable />
        <ExcessReport isOpen={showExcessReport} onClose={handleCloseExcessReport} />
        <RestockReport isOpen={showRestockReport} onClose={handleCloseRestockReport} />
      </ThemeProvider>
    </div>
  );
};

export default Inventory;