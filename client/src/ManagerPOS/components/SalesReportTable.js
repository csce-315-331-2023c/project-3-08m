import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { format } from 'date-fns';
import { DataGrid } from '@mui/x-data-grid';


// Dummy data columns, replace with your actual data columns
const columns = [
  { field: 'itemName', headerName: 'Item Name', width: 200 },
  { field: 'orderTime', headerName: 'Order Time', width: 200 },
  { field: 'addOns', headerName: 'Add Ons', width: 200 },
];

const SalesReportTable = ({ jsonData, isOpen, onClose }) => {
  const [salesReportData, setSalesReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const transformedData = [];
    setLoading(true);
    Object.entries(jsonData).forEach(([itemName, orders], index) => {
      orders.forEach((order, orderIndex) => {
        const orderTime = order[1];
        const date = new Date(orderTime);
        const addOns = order.length > 2 ? order.slice(2).join(', ') : 'None';

        transformedData.push({ 
          id: `${index}-${orderIndex}`, // Unique ID using both indices
          itemName, 
          orderTime: format(date, 'yyyy-MM-dd HH:mm:ss'),
          addOns 
        });
      });
    });
    setLoading(false);
    setSalesReport(transformedData);
  }, [jsonData]);

  if (!isOpen) return null;

  if (loading) {
    return <p>Loading ...</p>;
  }

  if (error) {
    return <p>Error loading orders: {error}</p>;
  }

  return (
        
    <div className="sales-report-table-overlay">
      <div className="sales-report-table">
        <h3>Sales Report</h3>
        <Box sx={{ height: 600, width: '100%' }}>
        <button onClick={onClose} className="close-btn">X</button>
          <DataGrid rows={salesReportData} columns={columns} pageSize={5} checkboxSelection />
        </Box>
      </div>
    </div>
  );
};

export default SalesReportTable;
