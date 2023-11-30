import { Dialog, DialogTitle, Box, List, ListItem, Button, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
// import { useEffect, useState } from 'react';
import { AddOnsList } from './AddOnsList';
import theme from '../../theme';
import { ThemeProvider } from '@emotion/react';

export const AddOnDialog = ({menuItem, addOns, open, setOpen}) => {

    const handleClose = (id) => () => {
        setOpen({...open, [id]: false});
    }

    return (
        <Box>
            <ThemeProvider theme={theme}>
                <Dialog open={open[menuItem.id]} onClose={handleClose(menuItem.id)} fullWidth>
                    <Box sx={{m:3}}>
                        <Box
                            sx={{ 
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <h3>{menuItem.name}</h3>
                            <Button
                                variant="contained"
                                onClick={handleClose(menuItem.id)}
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
                                <CloseIcon sx={{ color: 'white' }}/>
                            </Button>
                        </Box>
                        <Box sx={{m:2}}></Box>
                        <AddOnsList menuItem={menuItem} addOns={addOns} />
                        <Box sx={{m:2}}></Box>
                    </Box>
                </Dialog>
            </ThemeProvider>
        </Box>
    )
}