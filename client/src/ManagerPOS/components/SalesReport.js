import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { LocalizationProvider, DateTimePicker} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider, createTheme } from '@mui/material';
import './Reports.css';
import { Box } from '@mui/material';

const theme = createTheme({
    palette: {
      primary: {
        main: '#2E4647',
      },
    },
    components: {
      // This is where you can provide the overrides
      MuiPickersDay: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              backgroundColor: '#2E4647',
              '&:hover': {
                backgroundColor: '#2E4647',
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          textPrimary: {
            color: '#2E4647',
          },
        },
      },
      // Add overrides for other picker components as needed
    },
  });

const SalesReport = ({ isOpen, onClose }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  if (!isOpen) return null;

  return (
    <div className="sales-report-overlay">
      <div className="sales-report">
        <div className="sales-report-header">Enter Start and End Time for Sales Report</div>
        <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <form className="sales-report-form">
                <DateTimePicker
                label="Start Date and Time"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
                ampm={false}
                views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                inputFormat="yyyy-MM-dd HH:mm:ss"
                minutesStep={1}  // Set minute steps to 1
                secondsStep={1}  // Set second steps to 1
                />
                <Box sx={{ m: 2 }} />
                <DateTimePicker
                
                label="End Date and Time"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
                ampm={false}
                views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                inputFormat="yyyy-MM-dd HH:mm:ss"
                minutesStep={1}  // Set minute steps to 1
                secondsStep={1}  // Set second steps to 1
                />
                <Box sx={{ m: 2 }} />
            <div className="sales-report-actions">
              <button type="button" onClick={onClose} className="btn cancel-btn">Cancel</button>
              <button type="submit" className="btn create-btn">Create Report</button>
            </div>
          </form>
        </LocalizationProvider>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default SalesReport;
