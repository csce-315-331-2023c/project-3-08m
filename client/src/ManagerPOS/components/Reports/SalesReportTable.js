import React, { useState, useEffect } from 'react';
import { Box, Dialog, Button, Typography, CircularProgress} from '@mui/material';
import { format } from 'date-fns';
import { DataGrid } from '@mui/x-data-grid';
// import './Reports.css';

const columns = [
  { field: 'itemName', headerName: 'Item Name', flex: 3, minWidth: 200, editable: false},
  { field: 'orderTime', headerName: 'Order Time', flex: 2, minWidth: 200,},
  { field: 'addOns', headerName: 'Add Ons', flex: 4, minWidth: 200,},
];

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';


const SalesReportTable = ({ startTime, endTime, isOpen, onClose }) => {
  const [salesReportData, setSalesReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen) return; // Exit if the component is not open
      setLoading(true);    // Set loading state
  
      try {
        // Fetch data from server
        const response = await fetch(serverURL + "/report", {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          },
          body: JSON.stringify({
            'sales': {
              'startDateTime': format(startTime, 'yyyy-MM-dd HH:mm:ss'),
              'endDateTime': format(endTime, 'yyyy-MM-dd HH:mm:ss')
            }
          })
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        let data = await response.json();
        data = data.report;
        console.log(data);
  
        // Transform data
        const transformedData = [];
        Object.entries(data).forEach(([itemName, orders], index) => {
          orders.forEach((order, orderIndex) => {
            const orderTime = order[1];
            const date = new Date(orderTime);
            const addOns = order.length > 2 ? order.slice(2).join(', ') : 'None';
  
            transformedData.push({
              id: `${index}-${orderIndex}`,
              itemName,
              orderTime: format(date, 'yyyy-MM-dd HH:mm:ss'),
              addOns
            });
          });
        });
  
        setSalesReport(transformedData); // Update state with transformed data
      } catch (error) {
        console.error(error);
        setError(true); // Set error state
      } finally {
        setLoading(false); // Reset loading state
      }
    };
  
    fetchData();
  }, [isOpen, startTime, endTime]);
  

  const handleOnClose = () => {
    setLoading(true);
    setSalesReport([]);
    onClose();
  }

  if (!isOpen) return null;

  return (
        
    <Dialog open={isOpen} onClose={handleOnClose} maxWidth="md">
    <Box sx={{ width: 800, m:2}}>
      <h3>Sales Report</h3>
      <Box sx={{ m: 2 }}></Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 600, color: '#2E4647'}}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 600 }}>
          <Typography variant="subtitle1" color="error">
            Error: No data found, enter a different time window.
          </Typography>
        </Box>
      ) : salesReportData.length > 0 ? (
        <Box sx={{ height: 600, width: '100%' }}> 
          <DataGrid rows={salesReportData} columns={columns} pageSize={5} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 600 }}>
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
