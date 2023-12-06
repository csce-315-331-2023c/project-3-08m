import React, { useState, useEffect } from 'react';
import { Box, Dialog, Button, Typography, CircularProgress} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import { DataGrid } from '@mui/x-data-grid';
import { TranslateBulk } from '../../../Translate';
// import './Reports.css';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

/**
 * ExcessReportTable is a React component that renders a table to display excess report data.
 * It fetches data based on the provided timestamp and displays it in a DataGrid. The component also handles loading and error states.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Date} props.timeStamp - The timestamp for which the report data should be fetched.
 * @param {boolean} props.isOpen - A boolean to determine if the table should be open or closed.
 * @param {function} props.onClose - A function to be called to close the table.
 *
 * @returns {ReactElement|null} A Dialog element containing the ExcessReportTable or null if the table is not open.
 *
 * @example
 * <ExcessReportTable timeStamp={new Date()} isOpen={true} onClose={() => {}} />
 */

const ExcessReportTable = ({ timeStamp, isOpen, onClose }) => {
  const [excessReportData, setExcessReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ translationHeaders, setTranslationHeaders ] = useState([]);
  const [ translationText, setTranslationText ] = useState([]);

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

  useEffect(() => {
    var headers = ['Name', 'Amount Used', 'Total Amount'];
    TranslateBulk(headers, setTranslationHeaders);
    var text = ['Excess Report', 'Error: No data found, enter a different time stamp.', 'No data available for the selected time stamp.'];
    TranslateBulk(text, setTranslationText);
  }, [])
  

  const handleOnClose = () => {
    setLoading(true);
    setExcessReport([]);
    onClose();
  }

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
      headerName: translationHeaders[0] || 'Name',
      flex: 3,
      minWidth: 200,
      editable: false
    },
    {
      field: 'amount_used',
      headerName: translationHeaders[1] || 'Amount Used',
      flex: 2,
      minWidth: 150,
      editable: false
    },
    {
      field: 'total_amount',
      headerName: translationHeaders[2] || 'Total Amount',
      flex: 2,
      minWidth: 150,
      editable: false
    }
  ];

  if (!isOpen) return null;

  return (
        
    <Dialog open={isOpen} onClose={handleOnClose} maxWidth="md">
    <Box sx={{ width: 800, m:2}}>
    <Box sx={{ 
      display: 'flex', // Enable flexbox
      justifyContent: 'space-between', // Place items at the start and end of the container
      alignItems: 'center', // Align items vertically at the center
    }}>
      <h3>{translationText[0] || 'Excess Report'}</h3> {/* Text aligned to left */}
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
            {translationText[1] || 'Error: No data found, enter a different time stamp.'}
          </Typography>
        </Box>
      ) : excessReportData.length > 0 ? (
        <Box sx={{ height: 600, width: '100%' }}> 
          <DataGrid rows={excessReportData} columns={columns} pageSize={5} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 600 }}>
          <Typography variant="subtitle1">
            {translationText[2] || 'No data available for the selected time stamp.'}
          </Typography>
        </Box>
      )}
    </Box>
  </Dialog>
  
  );
};

export default ExcessReportTable;