import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { LocalizationProvider, DateTimePicker} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider, createTheme,  Dialog, Button, DialogTitle, DialogContent } from '@mui/material';
import { Box } from '@mui/material';
import SalesReportTable from './SalesReportTable';
import { format } from 'date-fns';
import theme from '../../theme';
// import './Reports.css';
const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

const SalesReport = ({ isOpen, onClose }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showReportTable, setShowReportTable] = useState(false);

    const handleClose = (event, reason) => {
      if (reason && reason === 'backdropClick') {
        // Optionally prevent dialog from closing if clicked outside
        return;
      }
      onClose();
    };

    const handleCreateReportClick = () => {
    setShowReportTable(true); // When the button is clicked, set showReportTable to true
    };

    if (!isOpen) return null;

return (
  <Dialog open={isOpen} onClose={handleClose} maxWidth="md">
  <DialogTitle>Enter Start and End Time for Sales Report</DialogTitle>
  <DialogContent>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {/* <form className="sales-report-form"> */}
          <DateTimePicker
            sx={{ marginTop: 1 ,width: '100%'}}
            label="Start Date and Time"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth />}
            ampm={false}
            views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
            inputFormat="yyyy-MM-dd HH:mm:ss"
            minutesStep={1}
            secondsStep={1}
          />
          <Box sx={{ m: 2 }} />
          <DateTimePicker
            sx={{ marginTop: 1 ,width: '100%'}}
            label="End Date and Time"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth />}
            ampm={false}
            views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
            inputFormat="yyyy-MM-dd HH:mm:ss"
            minutesStep={1}
            secondsStep={1}
          />
          <Box sx={{ m: 2 }} />
          {/* <div className="sales-report-actions"> */}
          <Box sx={{ display: 'flex', justifyContent: 'right' }}>
            <Button sx={{m:1}}  onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button sx={{m:1}} onClick={handleCreateReportClick} color="primary" variant="contained">
              Create Report
            </Button>
            {showReportTable && (
              <SalesReportTable
                isOpen={showReportTable}
                onClose={() => setShowReportTable(false)}
                startTime={startDate}
                endTime={endDate}
              />
            )}
          </Box>
          {/* </div> */}
        {/* </form> */}
      </LocalizationProvider>
    </ThemeProvider>
  </DialogContent>
</Dialog>
  );
};

export default SalesReport;
