import React, { useState, useEffect } from 'react';
import { Box, Dialog, Button, Typography, CircularProgress} from '@mui/material';
import { format } from 'date-fns';
import { DataGrid } from '@mui/x-data-grid';
// import './Reports.css';

const columns = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 3,
    minWidth: 200,
    editable: false
  },
  {
    field: 'amount_remaining',
    headerName: 'Amount Remaining',
    flex: 2,
    minWidth: 150,
    editable: false
  },
  {
    field: 'min_amount',
    headerName: 'Minimum Amount',
    flex: 2,
    minWidth: 150,
    editable: false
  }
];

  

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';


const RestockReport = ({isOpen, onClose }) => {
  const [restockReportData, setRestockReport] = useState([]);
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
          body: JSON.stringify({'restock' : {}})
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        let data = await response.json();
        data = data.report;
        console.log(data);

        const transformedData = data.map((item, index) => ({
          id: index,
          ...item
        }));
  
        setRestockReport(transformedData); // Update state with transformed data
      } catch (error) {
        console.error(error);
        setError(true); // Set error state
      } finally {
        setLoading(false); // Reset loading state
      }
    };
  
    fetchData();
  }, [isOpen]);
  

  const handleOnClose = () => {
    setLoading(true);
    setRestockReport([]);
    onClose();
  }

  if (!isOpen) return null;

  return (
        
    <Dialog open={isOpen} onClose={handleOnClose} maxWidth="md">
    <Box sx={{ width: 800, m:2}}>
      <h3>Restock Report</h3>
      <Box sx={{ m: 2 }}></Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 600, color: '#2E4647'}}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 600 }}>
          <Typography variant="subtitle1" color="error">
            Error: No data found, enter a different time stamp.
          </Typography>
        </Box>
      ) : restockReportData.length > 0 ? (
        <Box sx={{ height: 600, width: '100%' }}> 
          <DataGrid rows={restockReportData} columns={columns} pageSize={5} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 600 }}>
          <Typography variant="subtitle1">
            No data available for the selected time stamp.
          </Typography>
        </Box>
      )}
    </Box>
  </Dialog>
  
  );
};

export default RestockReport;