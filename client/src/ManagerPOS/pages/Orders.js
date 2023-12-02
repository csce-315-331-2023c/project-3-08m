import React, { useEffect, useState } from 'react';
import OrdersTable from '../components/Tables/OrdersTable';
import SalesReport from '../components/Reports/SalesReport'; // Updated import
import { Box, Button, ThemeProvider,  } from '@mui/material';
import theme from '../../theme';
import { TranslateBulk, TranslateText } from '../../Translate';
// import './Orders.css';



const Orders = ({doTL}) => {
  const [showSalesReport, setShowSalesReport] = useState(false);
  const [ translationText, setTranslationText ] = useState([]);

  useEffect(() => {
    if (doTL) {
      // TranslateText('Orders', setTranslationText);
      var text = ['Orders', 'Sales Report'];
      TranslateBulk(text, setTranslationText);
    }
  }, [doTL]);

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
    <h2>{translationText[0] || 'Orders'}</h2>
    <Button sx={{m:1}}  color="primary" variant="contained" onClick={handleOpenSalesReport}>{translationText[1] || 'Sales Report'}</Button>
    </Box>
      <OrdersTable doTL={doTL} />
      <SalesReport isOpen={showSalesReport} onClose={handleCloseSalesReport} doTL={doTL} />
    </ThemeProvider>
    </div>
  );
};

export default Orders;