import { Dialog, DialogContentText, DialogContent, DialogTitle, TextField, ThemeProvider } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import{ Box, Button, Checkbox } from '@mui/material';
import { useState, useEffect } from 'react';
import './AddOns.css';
import './Menu.css';
import { TranslateBulk } from '../Translate';
import MenuItemCard from './components/MenuItemCard';
// import defaultDrinkImage from './assets/boba.svg';
import { AddOnsCheckbox } from './components/AddOnsCheckbox';
import theme from '../theme';


const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

export function AddOnDialog({menuItem, open, setOpen, orderMenuItems, orderMenuItemAddOns, totalPrice, setTotalPrice, notes, addOns}) {
    // const [ addOns, setAddOns ] = useState([]);
    const [ price, setPrice ] = useState(menuItem.price);
    const [ orderNotes, setOrderNotes ] = useState("");
    const [ doTL, setDoTL ] = useState(false);
    const [ translation, setTranslation ] = useState([]);

    // useEffect(() => {
    //     var abortController = new AbortController();
    //     const getMenu = async () => {
    //         try {
    //             var response = await fetch(serverURL+'/single', {
    //                 signal: abortController.signal,
    //                 method: 'POST',
    //                 headers: {
    //                     "Content-type": "application/json; charset = UTF-8"
    //                 },
    //                 body: JSON.stringify({'menu_add_ons': menuItem.id})
    //             });
    //             var data = await response.json();
    //             // console.log(data.response);
    //             for (var item of data.response) {
    //                 item.enName = item.name;
    //             }
    //             setAddOns(data.response);
    //             setDoTL(true);
    //         }
    //         catch (error) {
    //             console.error('Error fetching data: ', error);
    //         }
    //     };
    //     getMenu();
    //     return () => {
    //         abortController.abort();
    //     }
    // }, []);
    // console.log(addOns);

    // useEffect(() => {
    //     if (doTL) {
    //         var temp = [];
    //         for (const item of addOns) {
    //             temp.push(item.enName);
    //         }
    //         TranslateBulk(temp, setTranslation);
    //         setDoTL(false);
    //     }
    // }, [doTL]);

    // useEffect(() => {
    //     for (let i = 0; i < translation.length; ++i) {
    //         addOns[i].name = translation[i];
    //     }
    //     setAddOns([...addOns]);
    // }, [translation])

    const [ selectedAddOns, setSelectedAddOns ] = useState({});

    const handleClose = (id) => () => {
        setOpen({...open, [id]: false});
    }

    const handleAdd = (id) => () => {
        orderMenuItems.push(menuItem);
        var orderItemAddOns = [];
        for (const item of addOns) {
            if (selectedAddOns[item.id] === true) {
                orderItemAddOns.push(item);
            }
        }
        console.log(orderItemAddOns);
        orderMenuItemAddOns.push(orderItemAddOns);
        totalPrice += price;
        setTotalPrice(totalPrice*1);
        notes.push(orderNotes);
        setOpen({...open, [id]: false});
    }

    const handleNotes = (event) => {
        setOrderNotes(event.target.value);
    }

    // console.log(price);
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
                    <AddOnsCheckbox menuId={menuItem.id} selected={selectedAddOns} setSelected={setSelectedAddOns} totalPrice={price} setTotalPrice={setPrice} />
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
            placeholder='Add Notes to your order!' 
            label='Order Notes' 
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
                Add To Cart <span style={{ marginRight: '30px' }}></span>{`$${Number(price).toFixed(2)}`}
            </Button>
        </div>
    </Box>
                    
                </Box>
            </Dialog>
        </ThemeProvider>
        </Box>
    );
}