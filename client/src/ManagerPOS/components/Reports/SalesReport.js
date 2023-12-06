import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { LocalizationProvider, DateTimePicker} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider,  Dialog, Button, DialogTitle, DialogContent } from '@mui/material';
import { Box } from '@mui/material';
import SalesReportTable from './SalesReportTable';
import theme from '../../../theme';
import { TranslateBulk } from '../../../Translate';
// import './Reports.css';

/**
 * SalesReport is a React component that renders a user interface for generating a sales report.
 * It allows users to select start and end dates and, upon submission, displays a table with the sales report.
 * The component handles state for date selection, loading the report table, and includes internationalization support with translation features.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.isOpen - A boolean to determine if the dialog should be open or closed.
 * @param {function} props.onClose - A function to be called when the dialog needs to be closed.
 *
 * @returns {ReactElement|null} A Dialog element containing the form for generating a sales report or null if the dialog is not open.
 *
 * @example
 * <SalesReport isOpen={true} onClose={() => {}} />
 */

const SalesReport = ({ isOpen, onClose }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showReportTable, setShowReportTable] = useState(false);
    const [ translationButtons, setTranslationButtons] = useState([]);
    const [ translationText, setTranslationText ] = useState([]);

    useEffect(() => {
      var buttons = ['Cancel', 'Create Report'];
      TranslateBulk(buttons, setTranslationButtons);
      var text = ['Enter Start and End Times for Sales Report', 'Start Date and Time', 'End Date and Time'];
      TranslateBulk(text, setTranslationText);
    }, [])

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
  <DialogTitle>{translationText[0] || 'Enter Start and End Times for Sales Report'}</DialogTitle>
  <DialogContent>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {/* <form className="sales-report-form"> */}
          <DateTimePicker
            sx={{ marginTop: 1 ,width: '100%'}}
            label={translationText[1] || "Start Date and Time"}
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
            label={translationText[2] || "End Date and Time"}
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
              {translationButtons[0] || 'Cancel'}
            </Button>
            <Button sx={{m:1}} onClick={handleCreateReportClick} color="primary" variant="contained">
              {translationButtons[1] || 'Create Report'}
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
