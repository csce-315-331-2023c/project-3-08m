import React, { useState, useEffect } from 'react';
import { Box, Dialog, Button, Typography, CircularProgress} from '@mui/material';
import { format } from 'date-fns';
import { DataGrid } from '@mui/x-data-grid';
// import './Reports.css';


// Dummy data columns, replace with your actual data columns
const columns = [
  { field: 'itemName', headerName: 'Item Name', flex: 3, minWidth: 50, editable: false},
  { field: 'orderTime', headerName: 'Order Time', flex: 2, minWidth: 50,},
  { field: 'addOns', headerName: 'Add Ons', flex: 4, minWidth: 50,},
];

const SalesReportTable = ({ jsonData, isOpen, onClose }) => {
  const [salesReportData, setSalesReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
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
    for (const item of transformedData) {
      if(item === undefined) {
        setError(true);
        break;
      }
    }
    setLoading(false);
  }
  }, [isOpen, jsonData]);

  const handleOnClose = () => {
    setError(false);
    setLoading(true);
    onClose();
    
  }

  if (!isOpen) return null;

  return (
        
    <Dialog open={isOpen} onClose={handleOnClose} maxWidth="md" PaperProps={{ className: "sales-report-table" }}>
    <Box sx={{ width: '100%' }}>
      <h3>Sales Report</h3>
      <Box sx={{ m: 2 }}></Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 700, color: '#2E4647'}}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 700 }}>
          <Typography variant="subtitle1" color="error">
            Error: No data found, enter a different time window.
          </Typography>
        </Box>
      ) : salesReportData.length > 0 ? (
        <Box sx={{ height: 'calc(700px - 100px)', width: '100%' }}> {/* Adjust 100px to your needs */}
          <DataGrid rows={salesReportData} columns={columns} pageSize={5} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 700 }}>
          <Typography variant="subtitle1">
            No data available for the selected time window.
          </Typography>
        </Box>
      )}
    </Box>
  </Dialog>
  
  );
};

export default SalesReportTable;
