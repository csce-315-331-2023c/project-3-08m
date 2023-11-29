import { Checkbox, Box, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useState, useEffect } from 'react';
import { TranslateBulk } from '../../Translate';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

export const AddOnsCheckbox = ({menuId, selected, setSelected, totalPrice, setTotalPrice}) => {
    const [ addOns, setAddOns ] = useState([]);
    const [ doTL, setDoTL ] = useState(false);
    const [ translation, setTranslation ] = useState([]);

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
                for (var item of res.response) {
                    item['enName'] = item.name;
                    if (selected[item.id] !== undefined) {
                        continue;
                    }
                    selected[item.id] = false;
                }
                // console.log(res.response);
                // for (let i = 0; i < res.response.length; i++) {
                //     res.response[i].enName = res.response[i].name;
                //     if (selected[res.response[i].id] !== undefined) {
                //         continue;
                //     }
                //     selected[res.response[i].id] = false;
                // }
                // console.log(res.response);
                setSelected({...selected});
                setAddOns(res.response);
                setDoTL(true);
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

    useEffect(() => {
        // console.log('l');
        if (doTL) {
            var temp = [];
            // console.log(addOns);
            for (const item of addOns) {
                temp.push(item.enName);
            }
            // console.log(temp);
            TranslateBulk(temp, setTranslation);
            setDoTL(false);
        }
    }, [doTL])

    useEffect(() => {
        // console.log(addOns);
        // console.log(translation);
        for (let i = 0; i < translation.length; i++) {
            addOns[i].name = translation[i];
        }
        setAddOns([...addOns]);
    }, [translation])

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

    // try {
    //     var text = [];
    //     for (const item of addOns) {
    //         if (item !== 'default') {
    //             text.push(item.name);
    //         }
    //     }
    //     var translation = TranslateBulk(text);
    //     for (let i = 0; i < translation.length && i < addOns.length; ++i) {
    //         addOns[i].name = translation[i];
    //     }
    // }
    // catch (error) {
    //     console.log(error);
    // }

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