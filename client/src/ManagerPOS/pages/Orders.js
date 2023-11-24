import React, { useState } from 'react';
import OrdersTable from '../components/Tables/OrdersTable';
import SalesReport from '../components/SalesReport'; // Updated import
import { Box, Button, ThemeProvider,  } from '@mui/material';
import theme from '../theme';
// import './Orders.css';



const Orders = () => {
  const [showSalesReport, setShowSalesReport] = useState(false);

  const handleOpenSalesReport = () => {
    setShowSalesReport(true);
  };

  const handleCloseSalesReport = () => {
    setShowSalesReport(false);
  };

  return (
    <div>
    <ThemeProvider theme={theme}>
    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
    <h2>Orders</h2>
    <Button sx={{m:1}}  color="primary" variant="contained" onClick={handleOpenSalesReport}>Sales Report</Button>
    </Box>
      <OrdersTable />
      <SalesReport isOpen={showSalesReport} onClose={handleCloseSalesReport} />
    </ThemeProvider>
    </div>
  );
};

export default Orders;