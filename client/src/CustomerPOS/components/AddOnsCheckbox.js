import { Checkbox, Box, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useState, useEffect } from 'react';
import { TranslateBulk } from '../../Translate';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

export const AddOnsCheckbox = ({menuId, selected, setSelected, totalPrice, setTotalPrice}) => {
    const [ addOns, setAddOns ] = useState(['default']);

    useEffect(() => {
        // var abortController = new AbortController();
        const getAddOns = async (id) => {
            try {
                var response = await fetch(serverURL+'/single', {
                    // signal: abortController.signal,
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json; charset = UTF-8"
                    },
                    body: JSON.stringify({'menu_add_ons': id})
                });
                var res = await response.json();
                for (const item of res.response) {
                    selected[item.id] = false;
                }
                setSelected({...selected});
                setAddOns(res.response);
            }
            catch (error) {
                console.log(error);
            }
        }
        getAddOns(menuId);
        // return (
        //     abortController.abort()
        // )
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

    console.log(addOns);

    var text = [];
    for (const item of addOns) {
        if (item !== 'default') {
            text.push(item.name);
        }
    }
    var translation = TranslateBulk(text);
    for (let i = 0; i < translation.length && i < addOns.length; ++i) {
        addOns[i].name = translation[i];
    }
    // setAddOns([...addOns]);

    if (addOns === undefined || addOns[0] === 'default') {
        return <div></div>
    }

    return (
        <div>
            Add-Ons
        <Box style={{maxHeight: 500, overflow: 'auto'}}>
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