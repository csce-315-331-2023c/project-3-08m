import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { format } from 'date-fns';
import { DataGrid } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';


// Dummy data columns, replace with your actual data columns
const columns = [
  { field: 'itemName', headerName: 'Item Name', width: 200 },
  { field: 'orderTime', headerName: 'Order Time', width: 200 },
  { field: 'addOns', headerName: 'Add Ons', width: 200 },
];

const SalesReportTable = ({ jsonData, isOpen, onClose }) => {
  const [salesReportData, setSalesReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const transformedData = [];
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
    setSalesReport(transformedData);
    setLoading(false);
  }, [jsonData]);

  if (!isOpen) return null;

  if (error) {
    return <p>Error loading orders: {error}</p>;
  }

  return (
        
    <div className="sales-report-table-overlay">
      <div className="sales-report-table">
        <h3>Sales Report</h3>
        <Box sx={{ height: 600, width: '100%' }}>
        <button onClick={onClose} className="close-btn">X</button>
        <div style={{ height: 600, width: '100%' }}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#2E4647'}}>
          <CircularProgress /> {/* Loading indicator */}
        </div>
      ) : (
        <DataGrid rows={salesReportData} columns={columns} pageSize={5} />
      )}
    </div>
          
        </Box>
      </div>
    </div>
  );
};

export default SalesReportTable;
