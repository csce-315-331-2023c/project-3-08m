import { Box, Button, Dialog, DialogContentText, DialogTitle } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export const CheckoutDialog = ({orderMenuItems, orderMenuItemsAddOns, price, isOpen, setIsOpen}) => {

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
        }
    ];

    console.log(orderMenuItems);
    console.log(orderMenuItemsAddOns);
    
    const rows = [];
    for (let i = 0; i < orderMenuItems.length; ++i) {
        var row = {};
        row['id'] = i;
        // row['menuItemName'] = "test";
        // row['addOns'] = "hi, hi2";
        // row['price'] = `$${price.toFixed(2)}`;
        row['menuItemName'] = orderMenuItems[i].name;
        var addOns = "";
        var price = Number(orderMenuItems[i].price);
        console.log(orderMenuItemsAddOns[i]);
        for (let j = 0; j < orderMenuItemsAddOns[i].length; ++j) {
            addOns += orderMenuItemsAddOns[i][j].name;
            if (j < orderMenuItemsAddOns[i].length-1) {
                addOns += ", ";
            }
            price += Number(orderMenuItemsAddOns[i][j].price);
        }
        row['addOns'] = addOns;
        row['price'] = `$${price.toFixed(2)}`;
        rows.push(row);
    }

    return (
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
                <Button>Checkout</Button>
            </Dialog>
        </Box>
    );
}