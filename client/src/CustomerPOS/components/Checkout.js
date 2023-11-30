import { Box, Button, Dialog, DialogContentText, DialogTitle, DialogContent,ThemeProvider, Stack } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
import { EditDialog } from './EditOrderDialog';
import { useState, useEffect } from 'react';
import theme from '../../theme';
import { TranslateBulk } from '../../Translate';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

export const CheckoutDialog = ({orderMenuItems, setOrderMenuItems, orderMenuItemsAddOns, setOrderMenuItemAddOns, price, setPrice, isOpen, setIsOpen, notes, setNotes, addOns}) => {
    const [ isEditOpen, setIsEditOpen ] = useState({});
    const [ rows, setRows ] = useState([]);
    const [ cols, setCols ] = useState([]);
    const [ orderSubmitted, setOrderSubmitted ] = useState(false);
    const [ cancelOpen, setCancelOpen ] = useState(false);
    const [ translationHeader, setTranslationHeader ] = useState([]);
    const [ translationText, setTranslationText ] = useState([]);
    const [ translationButtons, setTranslationButtons ] = useState({});

    // console.log(notes);

    const handleDelete = (id, subPrice) => () => {
        // console.log(id);
        var newMenuItems = [];
        var newAddOns = [];
        var newRows = [];
        var newNotes = [];
        // console.log(orderMenuItems.length);
        for (let i = 0; i < orderMenuItems.length; i++) {
            if (i == id) {
                continue;
            }
            // console.log(i);
            newMenuItems.push(orderMenuItems[i]);
            newAddOns.push(orderMenuItemsAddOns[i]);
            newNotes.push(notes[i]);
            if (i > id) {
                rows[i].id--;
            }
            newRows.push(rows[i]);
        }
        // console.log(subPrice);
        if (newMenuItems.length === 0) {
            setPrice(0);
        }
        else {
            // gets rid of the $ and subtracts it from the totalPrice
            price -= Number(subPrice.substring(1));
            setPrice(price*1);
        }
        // console.log(price);
        // setPrice(price*1);
        setOrderMenuItemAddOns(newAddOns);
        setOrderMenuItems(newMenuItems);
        setRows(newRows);
        setNotes(newNotes);
        // console.log(newMenuItems);
        console.log(newRows);
    }

    const handleEdit = (id) => () => {
        setIsEditOpen({...isEditOpen, [id]: true});
    }

    useEffect(() => {
        var headers = ['Item', 'Add-Ons', 'Price', 'Order Notes', 'Actions'];
        TranslateBulk(headers, setTranslationHeader);
        var text = ['Checkout', 'No Items Ordered!', 'No Results From Filter', 'Total', 'Order Submitted!', 'No Items To Checkout', 'Order Cancelled!'];
        TranslateBulk(text, setTranslationText);
        var buttons = ['Clear Cart', 'Checkout'];
        TranslateBulk(buttons, setTranslationButtons);
    }, []);

    useEffect(() => {
        const columns = [
            {
                field: 'menuItemName',
                headerName: translationHeader[0] || 'Item',
                headerClassName: 'super-app-theme--header',
                flex: 2,
                minWidth: 150,
            },
            {
                field: 'addOns',
                headerName: translationHeader[1] || 'Add-Ons',
                headerClassName: 'super-app-theme--header',
                flex: 2,
                minWidth: 150,
            },
            {
                field: 'price',
                headerName: translationHeader[2] || 'Price',
                headerClassName: 'super-app-theme--header',
                flex: 2,
                minWidth: 150,
            },
            {
                field: 'notes',
                headerName: translationHeader[3] || 'Order Notes',
                headerClassName: 'super-app-theme--header',
                flex: 2,
                minWidth: 150,
            },
            {
                field: 'actions',
                type: 'actions',
                headerName: translationHeader[4] || 'Actions',
                flex: 2,
                minWidth: 100,
                cellClassName: 'actions',
                getActions: ({id, row}) => {
                    // console.log(id);
                    // console.log(price);
                    // console.log(row);
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
        setCols(columns);
    }, [translationHeader, rows]);
    
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
    }, [orderMenuItems, orderMenuItemsAddOns, notes]);

    const checkout = () => {
        if (orderMenuItems.length === 0) {
            setOrderSubmitted(true);
            return;
        }

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

    const handleCancel = () => {
        setCancelOpen(true);
    }

    const handleCancelOk = () => {
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
                    <h3>{translationText[0] || 'Checkout'}</h3> {/* Text aligned to left */}
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
                {/* <DialogContentText>{`$${Number(price).toFixed(2)}`}</DialogContentText> */}
                {/* <Box sx={{ height: '70vh'}}>  */}
                {/* <Box style={{maxHeight: 500, overflow: 'auto'}}> */}
                    <DataGrid 
                        columns={cols}
                        rows={rows}
                        // hideFooter
                        // hideFooterPagination
                        hideFooterSelectedRowCount
                        // tbh idk how this hid the page count lol
                        initialState={{
                            pagination: { paginationModel: {pageSize: 8}}
                        }}
                        pageSizeOptions={[8]}
                        // density='compact'
                        // rowHeight={20}
                        // pageSize={20}
                        autoHeight
                        minHeight={500}
                        slots={{
                            noRowsOverlay: () => {
                                return (
                                    <Stack height="100%" alignItems="center" justifyContent="center">
                                        {/* No Items Ordered! */}
                                        {translationText[1] || 'No Items Ordered!'}
                                    </Stack>
                                );
                            },
                            noResultsOverlay: () => {
                                return (
                                    <Stack height="100%" alignItems="center" justifyContent="center">
                                        {/* No Results from Filter */}
                                        {translationText[2] || 'No Results from Filter'}
                                    </Stack>
                                )
                            }
                        }}
                    />
                {/* </Box> */}
                {/* </Box> */}
                <br></br>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end'}} >
                    <h4>{translationText[3] || 'Total'}: {`$${Number(price).toFixed(2)}`}</h4>
                </Box>
                <Box sx={{ mb:1}} ></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between'}} >
                    <Button onClick={handleCancel} color='primary' variant='outlined'>{translationButtons[0] || 'Clear Cart'}</Button>
                {/* <Button onClick={() => setIsOpen(false)}>Cancel</Button> */}
                    <Button color='primary' variant='contained' onClick={checkout}>{translationButtons[1] || 'Checkout'}</Button>
                </Box>
                </ThemeProvider> 
                </DialogContent> 
             {/* </Box> */}
            </Dialog>
        {       
            orderMenuItems.length !== 0 ?
            <Dialog open={orderSubmitted}>
                <DialogTitle>{translationText[4] || 'Order Submitted!'}</DialogTitle>
                <Button onClick={handleOk}>Ok</Button>
            </Dialog>
            :
            <Dialog open={orderSubmitted}>
                <DialogTitle>{translationText[5] || 'No Items to Checkout!'}</DialogTitle>
                <Button onClick={handleOk}>Ok</Button>
            </Dialog>
        }
            <Dialog open={cancelOpen}>
                <DialogTitle>{translationText[6] || 'Order Cancelled!'}</DialogTitle>
                <Button onClick={handleCancelOk}>Ok</Button>
            </Dialog>
        
        {
            rows.map((item) => {
                return (
                    <>
                    {isEditOpen[item.id] && <EditDialog
                                                key={item.id}
                                                open={isEditOpen} setIsOpen={setIsEditOpen}
                                                row={item}
                                                totalPrice={price} setTotalPrice={setPrice}
                                                orderMenuAddOns={orderMenuItemsAddOns} setOrderMenuAddOns={setOrderMenuItemAddOns}
                                                addOns={addOns}
                                                allNotes={notes} setAllNotes={setNotes}
                                            />}
                    </>
                );
            })
        }
        </Box>
        
    );
}