import { Checkbox, Box, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useState, useEffect } from 'react';
import { TranslateBulk } from '../../Translate';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

export const AddOnsCheckbox = ({menuId, selected, setSelected, totalPrice, setTotalPrice, allAddOns}) => {
    const [ addOns, setAddOns ] = useState([]);
    // const [ doTL, setDoTL ] = useState(false);
    // const [ translation, setTranslation ] = useState([]);

    useEffect(() => {
        const getAddOns = async (id) => {
            try {
                var response = await fetch(serverURL+'/single', {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json; charset = UTF-8"
                    },
                    body: JSON.stringify({'menu_add_ons': id})
                });
                var res = await response.json();
                var temp = [];
                // console.log(res.response);
                for (var item of res.response) {
                    temp.push(allAddOns.filter((value) => item.id === value.id)[0]);
                    item['enName'] = item.name;
                    if (selected[item.id] !== undefined) {
                        continue;
                    }
                    selected[item.id] = false;
                }
                setSelected({...selected});
                setAddOns(temp);
            }
            catch (error) {
                console.log(error);
            }
        }
        getAddOns(menuId);
    }, []);

    const toggleCheck = (id, price) => {
        console.log(price);
        console.log(selected);
        var checked = {};
        for (const [k,v] of Object.entries(selected)) {
            if (k == id) {
                checked[k] = !v;
            }
            else {
                checked[k] = v;
            }
        }
        var p = totalPrice;
        if (checked[id] === true) {
            p += price;
        }
        else {
            p -= price;
        }
        // console.log(totalPrice);
        // console.log(p);
        setTotalPrice(p);
        setSelected(checked);
    }

    // console.log(addOns);
    if (addOns === undefined || addOns.length === 0) {
        return <div></div>
    }

    return (
        <div>
            Add-Ons
        <Box style={{maxHeight: 300, overflow: 'auto'}}>
        <List>
            {
                addOns.map((item) => {
                    return (
                        <ListItem
                            key={item.id}
                            disablePadding
                            dense
                        >
                            <ListItemButton onClick={() => toggleCheck(item.id, item.price)} dense>
                                <ListItemIcon>
                                    <Checkbox size="small" checked={selected[item.id]} />
                                </ListItemIcon>
                                <ListItemText size="small" primary={item.name} secondary={`$${Number(item.price).toFixed(2)}`} />
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