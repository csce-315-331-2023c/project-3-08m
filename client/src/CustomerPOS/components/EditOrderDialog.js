import { Box, Dialog, DialogTitle, TextField, Button, DialogContentText, ThemeProvider } from "@mui/material"
import { useEffect, useState } from "react";
import { AddOnsCheckbox } from "./AddOnsCheckbox";
import { Close as CloseIcon } from '@mui/icons-material';
import theme from '../../theme';
import { TranslateBulk } from "../../Translate";

// const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

export const EditDialog = ({row, totalPrice, orderMenuAddOns, setOrderMenuAddOns, setTotalPrice, open, setIsOpen, addOns, allNotes, setAllNotes}) => {
    const [ selected, setSelected ] = useState({});
    const [ price, setPrice ] = useState(Number(row.price.substring(1)));
    const [ notes, setNotes ] = useState(row.notes);
    // to put the new Add-Ons in orderMenuAddOns
    // const [ addOns, setAddOns ] = useState([]);
    const [ translationText, setTranslationText ] = useState([]);
    const [ translationButtons, setTranslationButtons ] = useState([]);

    useEffect( () => {
        // orderMenuAddOns[row.id] should contain an array of addOns
        // use item.id to get the id
        for (const item of orderMenuAddOns[row.id]) {
            selected[item.id] = true;
        }
        setSelected({...selected});
    }, []);

    useEffect(() => {
        var text = ['Order Notes', 'Add Notes to your Order!'];
        TranslateBulk(text, setTranslationText);
        var buttons = ['Save'];
        TranslateBulk(buttons, setTranslationButtons);
    }, [])

    const handleClose = (id) => () => {
        setIsOpen({...open, [id]: false});
    }

    const handleSave = (id) => () => {
        var newSelected = [];
        for (const item of addOns) {
            if (selected[item.id]) {
                newSelected.push(item);
            }
        }
        var addOnsNames = "";
        for (let i = 0; i < newSelected.length; i++) {
            addOnsNames += newSelected[i].name;
            if (i < newSelected.length - 1) {
                addOnsNames += ", ";
            }
        }
        row.addOns = addOnsNames;
        console.log(price);
        console.log(row.price);
        var diff = price - Number(row.price.substring(1));
        row.price = `$${Number(price).toFixed(2)}`;
        row.notes = notes;
        totalPrice += Number(diff);
        orderMenuAddOns[row.id] = newSelected;
        allNotes[row.id] = notes;
        console.log(notes);
        console.log(allNotes[row.id]);
        setAllNotes([...allNotes]);
        setOrderMenuAddOns([...orderMenuAddOns]);
        setTotalPrice(totalPrice*1);
        setIsOpen({...open, [id]: false});
    }

    const handleNotes = (event) => {
        // console.log(event.target.value);
        setNotes(event.target.value);
    }

    // console.log(row);

    if (row === undefined) {
        return <div></div>
    }

    return (
        <Box>
            <ThemeProvider theme={theme}>
            <Dialog open={open[row.id]} onClose={handleClose(row.id)} fullWidth>
            <Box sx={{m:3}}> 
                <Box sx={{ 
                    display: 'flex', // Enable flexbox
                    justifyContent: 'space-between', // Place items at the start and end of the container
                    alignItems: 'center', // Align items vertically at the center
                    }}>
                    <h3>{row.menuItemName}</h3> {/* Text aligned to left */}
                    <Button
                    variant="contained"
                    onClick={handleClose(row.id)}
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
                    <Box sx={{m:2}}></Box>
                {/* <DialogTitle>{row.menuItemName}</DialogTitle> */}
                {/* <DialogContentText>{`$${Number(price).toFixed(2)}`}</DialogContentText> */}
                <AddOnsCheckbox menuId={row.menuItemId} selected={selected} setSelected={setSelected} totalPrice={price} setTotalPrice={setPrice} allAddOns={addOns}/>
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
                <TextField fullWidth defaultValue={row.notes} placeholder={translationText[1] || 'Add Notes to your order!'} label={translationText[0] || 'Order Notes'} onChange={handleNotes} multiline maxRows='3'/>
                <Box sx={{m:.5}}></Box>
                {/* <Button onClick={handleClose(row.id)}>Cancel</Button> */}
                <div>
                    <Button variant='contained' onClick={handleSave(row.id)}>
                        {translationButtons[0] || 'Save'} <span style={{ marginRight: '30px' }}></span>{`$${Number(price).toFixed(2)}`}
                    </Button>
                </div>
                </Box>
                </Box>
            </Dialog>
            </ThemeProvider>
        </Box>
    );
}