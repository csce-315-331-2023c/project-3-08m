import { Checkbox, FormControlLabel, FormGroup, ListItemButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Box from '@mui/material/Box';
import { TranslateText } from '../../../Translate';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

/**
 * InventoryCheckbox is a React component that displays a list of inventory items with checkboxes.
 * It fetches inventory data from a server and allows the user to select inventory items through checkboxes.
 * The component manages the checked state of each inventory item and supports internationalization for the display text.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.isChecked - An object representing the checked state of each inventory item.
 * @param {Function} props.setIsChecked - A function to update the checked state of the inventory items.
 *
 * @returns {ReactElement} A list of checkboxes, each representing an inventory item.
 *
 * @example
 * <InventoryCheckbox isChecked={checkedState} setIsChecked={setCheckedStateFunction} />
 */

const InventoryCheckbox = ({isChecked, setIsChecked}) => {
    const [ inventory, setInventory ] = useState([]);
    const [ translationText, setTranslationText ] = useState('');

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

    useEffect(() => {
        TranslateText('Inventory Items', setTranslationText);
    }, [])

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
        <h5>{translationText || 'Inventory Items'}</h5>
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