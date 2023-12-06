import { Checkbox, FormControlLabel, FormGroup, ListItemButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Box from '@mui/material/Box';
import { TranslateText } from '../../../Translate';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

/**
 * AddOnsCheckbox is a React component that displays a list of add-ons with checkboxes.
 * It fetches add-on data from a server and allows the user to select add-ons through checkboxes.
 * The component manages the checked state of each add-on and supports internationalization for the display text.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.isChecked - An object representing the checked state of each add-on.
 * @param {Function} props.setIsChecked - A function to update the checked state of the add-ons.
 *
 * @returns {ReactElement} A list of checkboxes, each representing an add-on.
 *
 * @example
 * <AddOnsCheckbox isChecked={checkedState} setIsChecked={setCheckedStateFunction} />
 */

const AddOnsCheckbox = ({isChecked, setIsChecked}) => {
    const [ addOns, setAddOns ] = useState([]);
    const [ translationText, setTranslationText ] = useState('');

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

    useEffect(() => {
        TranslateText('Add-Ons', setTranslationText);
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
        <h5>{translationText || 'Add-Ons'}</h5>
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