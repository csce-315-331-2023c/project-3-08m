import React, { useState, useEffect } from 'react';
import { Box, Dialog, Button, Typography, CircularProgress} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import { DataGrid } from '@mui/x-data-grid';
// import './Reports.css';

const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      minWidth: 100,
      editable: false
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 3,
      minWidth: 200,
      editable: false
    },
    {
      field: 'amount_used',
      headerName: 'Amount Used',
      flex: 2,
      minWidth: 150,
      editable: false
    },
    {
      field: 'total_amount',
      headerName: 'Total Amount',
      flex: 2,
      minWidth: 150,
      editable: false
    }
  ];
  

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';


const ExcessReportTable = ({ timeStamp, isOpen, onClose }) => {
  const [excessReportData, setExcessReport] = useState([]);
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
            'excess': {
              'timeStamp': format(timeStamp, 'yyyy-MM-dd HH:mm:ss')
            //   'endDateTime': format(endTime, 'yyyy-MM-dd HH:mm:ss')
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
        const transformedData = data.map(item => ({
            id: item[0],
            name: item[1],
            amount_used: item[2],
            total_amount: item[3]
          }));
        
  
        setExcessReport(transformedData); // Update state with transformed data
      } catch (error) {
        console.error(error);
        setError(true); // Set error state
      } finally {
        setLoading(false); // Reset loading state
      }
    };
  
    fetchData();
  }, [isOpen, timeStamp]);
  

  const handleOnClose = () => {
    setLoading(true);
    setExcessReport([]);
    onClose();
  }

  if (!isOpen) return null;

  return (
        
    <Dialog open={isOpen} onClose={handleOnClose} maxWidth="md">
    <Box sx={{ width: 800, m:2}}>
    <Box sx={{ 
      display: 'flex', // Enable flexbox
      justifyContent: 'space-between', // Place items at the start and end of the container
      alignItems: 'center', // Align items vertically at the center
    }}>
      <h3>Excess Report</h3> {/* Text aligned to left */}
      <Button
      variant="contained"
      onClick={handleOnClose}
      sx={{
        backgroundColor: 'red',
        width: '30px',  // Set the width
        height: '30px', // Set the height to make it square
        minWidth: '30px', // Override minimum width
        padding: 0, // Optional: Adjust padding to your preference
        '&:hover': {
          backgroundColor: 'darkred', // Change for hover state
        }
      }}
    >
        <CloseIcon sx={{ color: 'white' }} />
    </Button>
      
    </Box>
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
      ) : excessReportData.length > 0 ? (
        <Box sx={{ height: 600, width: '100%' }}> 
          <DataGrid rows={excessReportData} columns={columns} pageSize={5} />
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

export default ExcessReportTable;