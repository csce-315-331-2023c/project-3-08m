import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, Typography, CircularProgress} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import { DataGrid } from '@mui/x-data-grid';
import { TranslateBulk } from '../../../Translate';
// import './Reports.css';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

/**
 * PopularityReportTable is a React component that renders a data table for displaying popularity report data.
 * The report data is fetched based on the start and end times, and the number of items specified.
 * This component handles the fetching of data, loading states, and error states.
 * Additionally, it utilizes translation features for internationalization.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Date} props.startTime - The start time for the popularity report.
 * @param {Date} props.endTime - The end time for the popularity report.
 * @param {number} props.numItems - The number of items to display in the report.
 * @param {boolean} props.isOpen - A boolean to determine if the table should be open or closed.
 * @param {function} props.onClose - A function to be called to close the table.
 *
 * @returns {ReactElement|null} A Dialog element containing the PopularityReportTable or null if the table is not open.
 *
 * @example
 * <PopularityReportTable 
 *    startTime={new Date()}
 *    endTime={new Date()}
 *    numItems={5}
 *    isOpen={true} 
 *    onClose={() => {}} 
 * />
 */


const PopularityReportTable = ({ startTime, endTime, numItems, isOpen, onClose }) => {
  const [popularityReportData, setShowPopularityReport] = useState([]);
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
            'popularity': {
              'numMenuItems': numItems,
              'startDateTime': format(startTime, 'yyyy-MM-dd HH:mm:ss'),
              'endDateTime': format(endTime, 'yyyy-MM-dd HH:mm:ss'),
              
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
        const transformedData = data.map((item,index) => ({
            id: index,
            name: item.name,
            order_count: item.order_count,
          }));
        
  
        setShowPopularityReport(transformedData); // Update state with transformed data
      } catch (error) {
        console.error(error);
        setError(true); // Set error state
      } finally {
        setLoading(false); // Reset loading state
      }
    };
  
    fetchData();
  }, [isOpen, startTime, endTime, numItems]);

  useEffect(() => {
    var headers = ['Name', 'Order Count'];
    TranslateBulk(headers, setTranslationHeaders);
    var text = ['Popularity Report', 'Error: No data found, enter a different time window.', 'No data available for the selected time window.'];
    TranslateBulk(text, setTranslationText);
  }, [])
  

  const handleOnClose = () => {
    setLoading(true);
    setShowPopularityReport([]);
    onClose();
  }

  const columns = [
    { field: 'name', headerName: translationHeaders[0] || 'Name', flex: 3, minWidth: 200, editable: false},
    { field: 'order_count', headerName: translationHeaders[1] || 'Order Count', flex: 2, minWidth: 200,editable: false},
  ];

  if (!isOpen) return null;

  return (
        
    <Dialog open={isOpen} onClose={handleOnClose} maxWidth="md">
    <Box sx={{ width: 800, m:1}}>
      
    <Box sx={{ 
      display: 'flex', // Enable flexbox
      justifyContent: 'space-between', // Place items at the start and end of the container
      alignItems: 'center', // Align items vertically at the center
      m: 1 // Margin
    }}>
      <h3>{translationText[0] || 'Popularity Report'}</h3> {/* Text aligned to left */}
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
      ) : popularityReportData.length > 0 ? (
        <Box sx={{ height: 600, width: '100%' }}> 
          <DataGrid rows={popularityReportData} columns={columns} pageSize={5} />
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

export default PopularityReportTable;