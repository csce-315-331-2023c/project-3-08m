import React, { useState, useEffect } from 'react';
import { Box, Dialog, Button, Typography, CircularProgress} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import { DataGrid } from '@mui/x-data-grid';
import { TranslateBulk } from '../../../Translate';
// import './Reports.css';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

/**
 * SalesReportTable is a React component that displays a sales report table. 
 * It fetches and shows data based on the given start and end times. 
 * The component handles the loading and error states and supports internationalization for headers and text.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Date} props.startTime - The start time for generating the sales report.
 * @param {Date} props.endTime - The end time for generating the sales report.
 * @param {boolean} props.isOpen - A boolean to determine if the table should be open or closed.
 * @param {function} props.onClose - A function to be called to close the table.
 *
 * @returns {ReactElement|null} A Dialog element containing the SalesReportTable or null if the table is not open.
 *
 * @example
 * <SalesReportTable 
 *    startTime={new Date('2023-01-01')} 
 *    endTime={new Date('2023-01-31')} 
 *    isOpen={true} 
 *    onClose={() => {}} 
 * />
 */

const SalesReportTable = ({ startTime, endTime, isOpen, onClose }) => {
  const [salesReportData, setSalesReport] = useState([]);
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
            const addOns = order.length > 2 ? order.slice(2).join(', ') : translationText[3] || 'None';
  
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
  }, [isOpen, startTime, endTime, translationText]);

  useEffect(() => {
    var headers = ['Item Name', 'Order Time', 'Add-Ons'];
    TranslateBulk(headers, setTranslationHeaders);
    var text = ['Sales Report', 'Error: No data found, enter a different time window.', 'No data available for the selected time window.', 'None'];
    TranslateBulk(text, setTranslationText);
  }, [])
  

  const handleOnClose = () => {
    setLoading(true);
    setSalesReport([]);
    onClose();
  }

  const columns = [
    { field: 'itemName', headerName: translationHeaders[0] || 'Item Name', flex: 3, minWidth: 200, editable: false},
    { field: 'orderTime', headerName: translationHeaders[1] || 'Order Time', flex: 2, minWidth: 200,},
    { field: 'addOns', headerName: translationHeaders[2] || 'Add-Ons', flex: 4, minWidth: 200,},
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
      <h3>{translationText[0] || 'Sales Report'}</h3> {/* Text aligned to left */}
      <Button
      variant="contained"
      onClick={handleOnClose}
      sx={{
        backgroundColor: 'red',
        width: '30px',  // Set the widths
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
            {translationText[1] || 'Error: No data found, enter a different time window.'}
          </Typography>
        </Box>
      ) : salesReportData.length > 0 ? (
        <Box sx={{ height: 600, width: '100%' }}> 
          <DataGrid rows={salesReportData} columns={columns} pageSize={5} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 600 }}>
          <Typography variant="subtitle1">
            {translationText[2] || 'No data available for the selected time window.'}
          </Typography>
        </Box>
      )}
    </Box>
  </Dialog>
  
  );
};

export default SalesReportTable;
