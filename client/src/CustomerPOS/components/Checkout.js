import { Box, Button, Dialog, DialogContentText, DialogTitle, DialogContent,ThemeProvider } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
import { EditDialog } from './EditOrderDialog';
import { useState, useEffect } from 'react';
import theme from '../../theme';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

export const CheckoutDialog = ({orderMenuItems, setOrderMenuItems, orderMenuItemsAddOns, setOrderMenuItemAddOns, price, setPrice, isOpen, setIsOpen, notes, setNotes}) => {
    const [ isEditOpen, setIsEditOpen ] = useState({});
    const [ rows, setRows ] = useState([]);
    const [ orderSubmitted, setOrderSubmitted ] = useState(false);
    // const [ zeroOrder, setZeroOrder ] = useState(false);

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
        if (orderMenuItems.length === 0) {
            setOrderSubmitted(true);
            return;
        }
        // console.log('asdf');
        // if (price.toFixed(2) === '0.00' || price.toFixed(2) === '-0.00') {
        //     setZeroOrder(true);
        //     return;
        // }
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
        setOrderSubmitted(true);
        // setPrice(0);
        // setOrderMenuItemAddOns([]);
        // setOrderMenuItems([]);
        // setNotes([]);
        // setIsOpen(false);
    }

    const handleOk = () => {
        if (orderMenuItems.length === 0) {
            setOrderSubmitted(false);
            return;
        }
        setPrice(0);
        setOrderMenuItemAddOns([]);
        setOrderMenuItems([]);
        setNotes([]);
        setOrderSubmitted(false);
        setIsOpen(false);
    }

    for (let i = 0; i < orderMenuItems.length; ++i) {
        if (isEditOpen[i] === undefined) {
            return <div></div>
        }
    }

    return (
        <Box>
        {/* <Box sx={{ width: '50%', height:200, '& .super-app-theme--header': {
            backgroundColor: '#2E4647', color: 'white', fontWeight: 'bold'},}}> */}
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} fullWidth  maxWidth="xl"sx={{'& .MuiDialog-paper': { maxHeight: 'none', height: '90vh', '@media (max-height:800px)': {height: 'calc(100% - 24px)', },},}}>
            {/* <Box sx={{ width: 800}}> */}
                <DialogTitle><Box sx={{ 
                    display: 'flex', // Enable flexbox
                    justifyContent: 'space-between', // Place items at the start and end of the container
                    alignItems: 'center', // Align items vertically at the center
                    }}>
                    <h3>Checkout</h3> {/* Text aligned to left */}
                    <Button
                    variant="contained"
                    onClick={() => setIsOpen(false)}
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
                </DialogTitle>
                <DialogContent sx={{// Prevent scroll on the dialog content
                    flex: '1 1 auto', // DialogContent will expand to fill the space, minus the DialogTitle
                }}> 
                    <ThemeProvider theme={theme}>
                <DialogContentText>{`$${Number(price).toFixed(2)}`}</DialogContentText>
                {/* <Box sx={{ height: '70vh'}}>  */}
                <DataGrid 
                    columns={columns}
                    rows={rows}
                />
                {/* </Box> */}
                <Button onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button color='primary' variant='contained'onClick={checkout}>Checkout</Button>
                </ThemeProvider> 
                </DialogContent> 
             {/* </Box> */}
            </Dialog>
        {       
            orderMenuItems.length !== 0 ?
            <Dialog open={orderSubmitted}>
                <DialogTitle>Order Submitted!</DialogTitle>
                <Button onClick={handleOk}>Ok</Button>
            </Dialog>
            :
            <Dialog open={orderSubmitted}>
                <DialogTitle>No Orders to Checkout!</DialogTitle>
                <Button onClick={handleOk}>Ok</Button>
            </Dialog>
        }
        
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
        </Box>
        
    );
}