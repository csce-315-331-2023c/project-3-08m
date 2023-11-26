import { Box, Button, Dialog, DialogContentText, DialogTitle } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { EditDialog } from './EditOrderDialog';
import { useState, useEffect } from 'react';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

export const CheckoutDialog = ({orderMenuItems, setOrderMenuItems, orderMenuItemsAddOns, setOrderMenuItemAddOns, price, setPrice, isOpen, setIsOpen, notes, setNotes}) => {
    const [ isEditOpen, setIsEditOpen ] = useState({});
    const [ rows, setRows ] = useState([]);

    const handleDelete = (id, subPrice) => () => {
        var newMenuItems = [];
        var newAddOns = [];
        var newRows = [];
        for (let i = 0; i < orderMenuItems.length; i++) {
            if (i == id) {
                continue;
            }
            newMenuItems.push(orderMenuItems[i]);
            newAddOns.push(orderMenuItemsAddOns[i]);
            newRows.push(rows[i]);
        }
        console.log(subPrice);
        // gets rid of the $ and subtracts it from the totalPrice
        price -= Number(subPrice.substring(1));
        console.log(price);
        setPrice(price*1);
        setOrderMenuItemAddOns(newAddOns);
        setOrderMenuItems(newMenuItems);
        setRows(newRows);
    }

    const handleEdit = (id) => () => {
        setIsEditOpen({...isEditOpen, [id]: true});
    }

    const columns = [
        {
            field: 'menuItemName',
            headerName: 'Item',
            headerClassName: 'super-app-theme--header',
            flex: 2,
            minWidth: 150,
        },
        {
            field: 'addOns',
            headerName: 'Add-Ons',
            headerClassName: 'super-app-theme--header',
            flex: 2,
            minWidth: 150,
        },
        {
            field: 'price',
            headerName: 'Price',
            headerClassName: 'super-app-theme--header',
            flex: 2,
            minWidth: 150,
        },
        {
            field: 'notes',
            headerName: 'Order Notes',
            headerClassName: 'super-app-theme--header',
            flex: 2,
            minWidth: 150,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            flex: 2,
            minWidth: 100,
            cellClassName: 'actions',
            getActions: ({id, row}) => {
                // console.log(id);
                // console.log(price);
                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label='Edit'
                        onClick={handleEdit(id)}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label='Delete'
                        onClick={handleDelete(id, row.price)}
                    />
                ]
            }
        }
    ];
    
    useEffect (() => {
        const r = [];
        for (let i = 0; i < orderMenuItems.length; ++i) {
            var row = {};
            row['id'] = i;
            // row['menuItemName'] = "test";
            // row['addOns'] = "hi, hi2";
            // row['price'] = `$${price.toFixed(2)}`;
            row['menuItemId'] = orderMenuItems[i].id;
            row['menuItemName'] = orderMenuItems[i].name;
            var addOns = "";
            var subPrice = Number(orderMenuItems[i].price);
            console.log(orderMenuItemsAddOns[i]);
            for (let j = 0; j < orderMenuItemsAddOns[i].length; ++j) {
                addOns += orderMenuItemsAddOns[i][j].name;
                if (j < orderMenuItemsAddOns[i].length-1) {
                    addOns += ", ";
                }
                subPrice += Number(orderMenuItemsAddOns[i][j].price);
            }
            row['addOns'] = addOns;
            row['price'] = `$${subPrice.toFixed(2)}`;
            row['notes'] = notes[i];
            r.push(row);
            isEditOpen[i] = false;
        }
        setIsEditOpen({...isEditOpen});
        setRows(r);
    }, []);

    const checkout = () => {
        console.log('asdf');
        var menuItemIds = [];
        var menuItemAddOnIds = [];
        for (let i = 0; i < orderMenuItems.length; ++i) {
            menuItemIds.push(orderMenuItems[i].id);
            var addOnIds = [];
            for (let j = 0; j < orderMenuItemsAddOns[i].length; ++j) {
                addOnIds.push(orderMenuItemsAddOns[i][j].id);
            }
            menuItemAddOnIds.push(addOnIds);
        }
        
        const sendOrder = async () => {
            try {
                await fetch(serverURL+'/updateOrders', {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json; charset = UTF-8"
                    },
                    body: JSON.stringify({'add': {'price': price, 'menuItems': menuItemIds, 'addOns': menuItemAddOnIds}})
                });
            }
            catch (error) {
                console.log(error);
            }
        }
        sendOrder();
        setPrice(0);
        setOrderMenuItemAddOns([]);
        setOrderMenuItems([]);
        setNotes([]);
        setIsOpen(false);
    }

    for (let i = 0; i < orderMenuItems.length; ++i) {
        if (isEditOpen[i] === undefined) {
            return <div></div>
        }
    }

    return (
        <>
        <Box sx={{ width: '100%', '& .super-app-theme--header': {
            backgroundColor: '#2E4647', color: 'white', fontWeight: 'bold'},}}>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} fullScreen>
                <DialogTitle>Checkout</DialogTitle>
                <DialogContentText>{`$${Number(price).toFixed(2)}`}</DialogContentText>
                <DataGrid 
                    columns={columns}
                    rows={rows}
                />
                <Button onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button onClick={checkout}>Checkout</Button>
            </Dialog>
        </Box>
        {
            rows.map((item) => {
                return (
                    <>
                    {isEditOpen[item.id] && <EditDialog 
                                                open={isEditOpen} setIsOpen={setIsEditOpen}
                                                row={item}
                                                totalPrice={price} setTotalPrice={setPrice}
                                                orderMenuAddOns={orderMenuItemsAddOns} setOrderMenuAddOns={setOrderMenuItemAddOns}
                                            />}
                    </>
                );
            })
        }
        </>
    );
}