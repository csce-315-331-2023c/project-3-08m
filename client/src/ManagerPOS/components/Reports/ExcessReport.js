import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { LocalizationProvider, DateTimePicker} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider,  Dialog, Button, DialogTitle, DialogContent } from '@mui/material';
import { Box } from '@mui/material';
import ExcessReportTable from './ExcessReportTable';
import theme from '../../../theme';
import { TranslateBulk } from '../../../Translate';
// import './Reports.css';

/**
 * ExcessReport is a React component that presents a dialog for creating an excess report.
 * It allows users to select a start date and time, and displays a report table based on the selected date.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.isOpen - A boolean to determine if the dialog should be open or closed.
 * @param {function} props.onClose - A function to be called when the dialog needs to be closed.
 *
 * @returns {ReactElement|null} A Dialog element containing the ExcessReport form or null if the dialog is not open.
 *
 * @example
 * <ExcessReport isOpen={true} onClose={() => {}} />
 */

const ExcessReport = ({ isOpen, onClose }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [showReportTable, setShowReportTable] = useState(false);
    const [ translationButtons, setTranslationButtons ] = useState([]);
    const [ translationText, setTranslationText ] = useState([]);

    useEffect(() => {
      var buttons = ['Cancel', 'Create Report'];
      TranslateBulk(buttons, setTranslationButtons);
      var text = ['Enter Timestamp for Excess Report', 'Start Date and Time'];
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
  <DialogTitle>{translationText[0] || 'Enter Timestamp for Excess Report'}</DialogTitle>
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
          {/* <DateTimePicker
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
          <Box sx={{ m: 2 }} /> */}
          {/* <div className="sales-report-actions"> */}
          <Box sx={{ display: 'flex', justifyContent: 'right' }}>
            <Button sx={{m:1}}  onClick={onClose} color="primary">
              {translationButtons[0] || 'Cancel'}
            </Button>
            <Button sx={{m:1}} onClick={handleCreateReportClick} color="primary" variant="contained">
              {translationButtons[1] || 'Create Report'}
            </Button>
            {showReportTable && (
              <ExcessReportTable
                isOpen={showReportTable}
                onClose={() => setShowReportTable(false)}
                timeStamp={startDate}
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

export default ExcessReport;