import { Box, Dialog, DialogTitle, TextField, Button, DialogContentText } from "@mui/material"
import { useEffect, useState } from "react";
import { AddOnsCheckbox } from "./AddOnsCheckbox";

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

export const EditDialog = ({row, totalPrice, orderMenuAddOns, setOrderMenuAddOns, setTotalPrice, open, setIsOpen}) => {
    const [ selected, setSelected ] = useState({});
    const [ price, setPrice ] = useState(Number(row.price.substring(1)));
    const [ notes, setNotes ] = useState(row.notes);
    // to put the new Add-Ons in orderMenuAddOns
    const [ addOns, setAddOns ] = useState([]);

    useEffect ( () => {
        const getAddOns = async (id) => {
            var response = await fetch(serverURL + '/single',{
                method: 'POST',
                headers: {
                    "Content-type": "application/json; charset = UTF-8"
                },
                body: JSON.stringify({'menu_add_ons': id})
            });
            var res = await response.json();
            setAddOns(res.response);
        }
        getAddOns(row.menuItemId);
    }, []);

    useEffect( () => {
        // orderMenuAddOns[row.id] should contain an array of addOns
        // use item.id to get the id
        for (const item of orderMenuAddOns[row.id]) {
            selected[item.id] = true;
        }
        setSelected({...selected});
    }, []);

    const handleClose = (id) => () => {
        setIsOpen({...open, [id]: false});
    }

    const handleSave = (id) => () => {
        var newSelected = [];
        // for (const [k,v] of Object.entries(selected)) {
        //     if (v === true) {
        //         newSelected.push(k);
        //     }
        // }
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
        setOrderMenuAddOns([...orderMenuAddOns]);
        setTotalPrice(totalPrice*1);
        setIsOpen({...open, [id]: false});
    }

    const handleNotes = (event) => {
        setNotes(event.target.value);
    }

    console.log(row);

    if (row === undefined) {
        return <div></div>
    }

    return (
        <Box>
            <Dialog open={open[row.id]} onClose={handleClose(row.id)} fullWidth>
                <DialogTitle>{row.menuItemName}</DialogTitle>
                <DialogContentText>{`$${Number(price).toFixed(2)}`}</DialogContentText>
                <AddOnsCheckbox menuId={row.menuItemId} selected={selected} setSelected={setSelected} totalPrice={price} setTotalPrice={setPrice}/>
                <br></br>
                <TextField defaultValue={row.notes} placeholder='Add Notes to your order!' label='Order Notes' onChange={handleNotes} multiline maxRows='3'/>
                <Button onClick={handleClose(row.id)}>Cancel</Button>
                <Button onClick={handleSave(row.id)}>Save</Button>
            </Dialog>
        </Box>
    );
}