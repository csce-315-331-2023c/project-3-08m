import { List, ListItem, ListItemText } from '@mui/material';
import { useEffect, useState } from 'react';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

export const AddOnsList = ({menuItem, addOns}) => {
    const [ menuItemAddOns, setMenuItemAddOns ] = useState([]);

    useEffect(() => {
        const getAddOns = async () => {
            try {
                var response = await fetch(serverURL+'/single', {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json; charset = UTF-8"
                    },
                    body: JSON.stringify({'menu_add_ons': menuItem.id})
                });
                var data = await response.json();
                var temp = [];
                for (var item of data.response) {
                    temp.push(addOns.filter((value) => item.id === value.id)[0]);
                }
                setMenuItemAddOns(temp);
            }
            catch (error) {
                console.log(error);
            }
        }
        getAddOns();
    }, [])

    if (menuItemAddOns.length === 0) {
        return <div></div>
    }

    return (
        <div>
            Add-Ons
            <List>
                {
                    menuItemAddOns.map((item) => (
                        <ListItem
                            key={item.id}
                            disablePadding
                            dense
                        >
                            <ListItemText size='small' primary={item.name} secondary={`$${Number(item.price).toFixed(2)}`} />
                        </ListItem>
                    ))
                }
            </List>
        </div>
    );
}