import { Listbox } from '@headlessui/react';
import { Dialog, DialogContentText, DialogTitle } from '@mui/material';
import{ Box, Button, Checkbox } from '@mui/material';
import { useState, useEffect } from 'react';
import './AddOns.css';
import './Menu.css';
import { TranslateBulk } from '../Translate';
import MenuItemCard from './components/MenuItemCard';
// import defaultDrinkImage from './assets/boba.svg';
import { AddOnsCheckbox } from './components/AddOnsCheckbox';


const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

const AddOn = ({name, price}) => (
    // return (
        <div>
            <h3>{name}</h3>
            <div>{`$${price.toFixed(2)}`}</div>
        </div>
    // )
)

export function AddOnDialog({menuItem, open, setOpen, orderMenuItems, orderMenuItemAddOns, totalPrice, setTotalPrice}) {
    let [ isOpen, setIsOpen ] = useState(false);
    const [ addOns, setAddOns ] = useState([]);
    const [ price, setPrice ] = useState(menuItem.price);

    useEffect(() => {
        var abortController = new AbortController();
        const getMenu = async () => {
            try {
                var response = await fetch(serverURL+'/single', {
                    signal: abortController.signal,
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json; charset = UTF-8"
                    },
                    body: JSON.stringify({'menu_add_ons': menuItem.id})
                });
                var data = await response.json();
                // console.log(data.response);
                setAddOns(data.response);
            }
            catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        getMenu();
        return () => {
            abortController.abort();
        }
    }, []);
    // console.log(addOns);

    try {
        var temp = [];
        for (const addOn of addOns) {
            temp.push(addOn.name);
        }
        var translations = TranslateBulk(temp);
        for (let i = 0; i < translations.length && i < addOns.length; ++i) {
            addOns[i].name = translations[i];
        }
    }
    catch (error) {
        console.log(error);
    }
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
        orderMenuItemAddOns.push(orderItemAddOns);
        totalPrice += price;
        setTotalPrice(totalPrice*1);
        setOpen({...open, [id]: false});
    }

    // console.log(price);
    if (price === undefined) {
        return <div></div>
    }
    
    return (
        <Box>
            <Dialog open={open[menuItem.id]} onClose={handleClose(menuItem.id)} fullWidth>
                <DialogTitle>{menuItem.name}</DialogTitle>
                <DialogContentText>{`$${Number(price).toFixed(2)}`}</DialogContentText>
                <AddOnsCheckbox menuId={menuItem.id} selected={selectedAddOns} setSelected={setSelectedAddOns} totalPrice={price} setTotalPrice={setPrice} />
                <Button onClick={handleClose(menuItem.id)}>Cancel</Button>
                <Button onClick={handleAdd(menuItem.id)}>Add To Order</Button>
            </Dialog>
        </Box>
    );
}