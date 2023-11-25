import { Checkbox, FormControlLabel, FormGroup, ListItemButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Box from '@mui/material/Box';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

const InventoryCheckbox = ({isChecked, setIsChecked}) => {
    const [ inventory, setInventory ] = useState([]);

    useEffect(() => {
        fetch(serverURL+'/inventory')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setInventory(data.inventory); // Make sure this matches the key in your JSON response
                var checked = {...isChecked};
                for (const item of data.inventory) {
                    if (checked[item.id] !== true) {
                        checked[item.id] = false;
                    }
                }
                setIsChecked(checked);
            })
            .catch((error) => {
                console.error('Fetch error:', error);
            });
    }, []);

    const toggleCheck = (id) => {
        var checked = {};
        var found = false;
        for (const [k,v] of Object.entries(isChecked)) {
            if (k == id) {
                console.log('d');
                found = true;
                checked[k] = !v;
            }
            else {
                checked[k] = v;
            }
        }
        if (!found) {
            checked[id] = true;
        }
        setIsChecked(checked);
    }

    for (const item of inventory) {
        if (isChecked[item.id] === undefined) {
            return <div></div>
        }
    }

    return (
        <div>
        <h5>Inventory Items</h5>
        <Box style={{maxHeight: 200, overflow: 'auto'}}>
        <List>
            {
                inventory.map((item, index) => {
                    return (
                        <ListItem
                            key={item.id}
                            disablePadding
                            dense
                        >
                            <ListItemButton onClick={() => toggleCheck(item.id)} dense>
                                <ListItemIcon>
                                    <Checkbox size="small" checked={isChecked[item.id]} />
                                </ListItemIcon>
                                <ListItemText size="small" primary={item.name}/>
                            </ListItemButton>
                        </ListItem>
                    )
                })
            }
        </List>
        </Box>
        </div>
    )
}

export default InventoryCheckbox;