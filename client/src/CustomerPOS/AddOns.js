import { Dialog, DialogContentText, DialogContent, DialogTitle, TextField, ThemeProvider } from '@mui/material';
import { Close as CloseIcon, Translate } from '@mui/icons-material';
import{ Box, Button, Checkbox } from '@mui/material';
import { useState, useEffect } from 'react';
import './AddOns.css';
import './Menu.css';
// import { TranslateBulk } from '../Translate';
// import MenuItemCard from './components/MenuItemCard';
// import defaultDrinkImage from './assets/boba.svg';
import { AddOnsCheckbox } from './components/AddOnsCheckbox';
import theme from '../theme';
import { TranslateBulk } from '../Translate';


// const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

/**
 * The Dialog that opens upon selecting a menu item.
 * @param {props} props - the props needed for the dialog to work correctly
 * @returns the dialog
 */
export function AddOnDialog({menuItem, open, setOpen, orderMenuItems, orderMenuItemAddOns, totalPrice, setTotalPrice, notes, addOns}) {
    // const [ addOns, setAddOns ] = useState([]);
    const [ price, setPrice ] = useState(menuItem.price);
    const [ orderNotes, setOrderNotes ] = useState("");
    // const [ doTL, setDoTL ] = useState(false);
    // const [ translation, setTranslation ] = useState([]);
    const [ translationText, setTranslationText ] = useState([]);
    const [ translationButtons, setTranslationButtons ] = useState([]);

    const [ selectedAddOns, setSelectedAddOns ] = useState({});

    // translates text on screen
    useEffect(() => {
        var text = ['Order Notes', 'Add Notes to your Order!'];
        TranslateBulk(text, setTranslationText);
        var buttons = ['Add To Cart'];
        TranslateBulk(buttons, setTranslationButtons);
    }, []);

    /**
     * sets the open state of a dialog to false.
     * @param {String} id - the id of the menu item with the open dialog
     * @returns void
     */
    const handleClose = (id) => () => {
        setOpen({...open, [id]: false});
    }

    /**
     * Adds a menu item, its selected add ons, and its notes to the order
     * @param {String} id 
     * @returns void
     */
    const handleAdd = (id) => () => {
        orderMenuItems.push(menuItem);
        var orderItemAddOns = [];
        for (const item of addOns) {
            if (selectedAddOns[item.id] === true) {
                orderItemAddOns.push(item);
            }
        }
        // console.log(orderItemAddOns);
        orderMenuItemAddOns.push(orderItemAddOns);
        totalPrice += price;
        setTotalPrice(totalPrice*1);
        notes.push(orderNotes);
        setOpen({...open, [id]: false});
    }

    /**
     * Updates the notes on change in text.
     * @param {event} event 
     */
    const handleNotes = (event) => {
        setOrderNotes(event.target.value);
    }

    // console.log(price);
    // loading
    if (price === undefined) {
        return <div></div>
    }
    
    return (
        <Box>
            <ThemeProvider theme={theme}>
            <Dialog open={open[menuItem.id]} onClose={handleClose(menuItem.id)} fullWidth>
                <Box sx={{m:3}}> 
                <Box sx={{ 
                    display: 'flex', // Enable flexbox
                    justifyContent: 'space-between', // Place items at the start and end of the container
                    alignItems: 'center', // Align items vertically at the center
                    }}>
                    <h3>{menuItem.name}</h3> {/* Text aligned to left */}
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
                        <CloseIcon sx={{ color: 'white' }} />
                    </Button>
                    </Box>
                
                    {/* <DialogContentText></DialogContentText> */}
                    <Box sx={{m:2}}></Box>
                    <AddOnsCheckbox menuId={menuItem.id} selected={selectedAddOns} setSelected={setSelectedAddOns} totalPrice={price} setTotalPrice={setPrice} allAddOns={addOns} />
                    {/* <br></br> */}
                    <Box sx={{m:3}}></Box>
                    <Box 
        sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-end', 
            gap: 1 
        }}
    >
        <TextField 
            fullWidth 
            placeholder={translationText[1] || 'Add Notes to your order!'}
            label={translationText[0] || 'Order Notes' }
            onChange={handleNotes} 
            multiline 
            maxRows={3}
        />
        <Box sx={{m:.5}}></Box>
        {/* <div>
            <h5>Total Price:  {`$${Number(price).toFixed(2)}`}</h5>
            
        </div> */}
        <div>
            {/* <Button sx={{mr:3}} onClick={handleClose(menuItem.id)}>Cancel</Button> */}
            {/* <Box sx={{m:.5}}></Box> */}
            <Button variant='contained' onClick={handleAdd(menuItem.id)}>
                {translationButtons[0] || 'Add To Cart'} <span style={{ marginRight: '30px' }}></span>{`$${Number(price).toFixed(2)}`}
            </Button>
        </div>
    </Box>
                    
                </Box>
            </Dialog>
        </ThemeProvider>
        </Box>
    );
}