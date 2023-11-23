import React, { useState } from 'react';
import OrdersTable from '../components/OrdersTable';
import SalesReport from '../components/SalesReport'; // Updated import
import './Orders.css'; // Assuming you have a CSS file for styling

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
      <button className="sales-report-btn" onClick={handleOpenSalesReport}>Sales Report</button>
      <h2>Orders</h2>
      <OrdersTable />
      <SalesReport isOpen={showSalesReport} onClose={handleCloseSalesReport} />
    </div>
  );
};

export default Orders;