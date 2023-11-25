import { Checkbox, FormControlLabel, FormGroup, ListItemButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Box from '@mui/material/Box';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

const AddOnsCheckbox = ({isChecked, setIsChecked}) => {
    const [ addOns, setAddOns ] = useState([]);

    useEffect(() => {
        fetch(serverURL+'/addOns')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setAddOns(data.addOns); // Make sure this matches the key in your JSON response
                var checked = {...isChecked};
                for (const item of data.addOns) {
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
        // failsafe, but no rerender will occur if this gets hit, so it might be better to throw an error lol
        if (!found) {
            checked[id] = true;
        }
        setIsChecked(checked);
    }

    for (const item of addOns) {
        if (isChecked[item.id] === undefined) {
            return <div></div>
        }
    }
    return (
        <div>
        Add-Ons
        <Box style={{maxHeight: 200, overflow: 'auto'}}>
        <List>
            {
                addOns.map((item, index) => {
                    // console.log(isChecked[item.id]);
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

export default AddOnsCheckbox;