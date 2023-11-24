import React, { useState } from 'react';
import OrdersTable from '../components/Tables/OrdersTable';
import SalesReport from '../components/SalesReport'; // Updated import
import { Button } from '@mui/material';
import './Orders.css';

const Orders = () => {
  const [showSalesReport, setShowSalesReport] = useState(false);

  const handleOpenSalesReport = () => {
    setShowSalesReport(true);
  };

  const handleCloseSalesReport = () => {
    setShowSalesReport(false);
  };

  return (
    <div className="orders-container">
    <h2>Orders</h2>
    <Button className='sales-report-btn' onClick={handleOpenSalesReport}>Sales Report</Button>
      <OrdersTable />
      <SalesReport isOpen={showSalesReport} onClose={handleCloseSalesReport} />
    </div>
  );
};

export default Orders;