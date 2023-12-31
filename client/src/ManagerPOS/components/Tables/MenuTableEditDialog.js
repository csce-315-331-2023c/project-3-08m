import { Dialog, TextField, DialogTitle, Button } from "@mui/material";
import Box from "@mui/material/Box";
import AddOnsCheckbox from "./MenuTableAddOnCheckbox";
import { useEffect, useState } from "react";
import InventoryCheckbox from "./MenuTableInventoryCheckbox";
import { TranslateBulk } from "../../../Translate";

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

/**
 * Handles the update operation for menu items. It makes an asynchronous call to the server 
 * to update menu item details based on the specified type and update values.
 *
 * @param {string} type - The type of update operation (e.g., 'add', 'delete').
 * @param {Object} updateVals - The values to be updated, structured as an object.
 */

export const handleUpdate = (type, updateVals) => {
    console.log(type);
    const updateMenu = async (type, updateVals) => {
        var success = false;
        try {
            var response = await fetch(serverURL+"/updateMenu", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset = UTF-8"
                },
                body: JSON.stringify({[type]: updateVals})
            });
            var res = await response.json();
            success = res.updateSuccess;
        }
        catch (error) {
            console.log(error);
        }
        console.log(success);
        return success;
    }
    updateMenu(type, updateVals);
}

/**
 * EditDialog is a React component that displays a dialog for editing or adding a menu item.
 * It fetches menu item details, add-ons, and inventory from the server, and allows for editing these details.
 * The dialog supports internationalization for labels and buttons.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.menu - The current list of menu items.
 * @param {Function} props.setMenu - Function to update the list of menu items.
 * @param {string} props.id - The ID of the menu item being edited or an empty string for a new item.
 * @param {Object} props.open - Object containing the open state for the dialog.
 * @param {Function} props.setOpen - Function to update the open state of the dialog.
 *
 * @returns {ReactElement} A dialog component for editing or adding a menu item.
 *
 * @example
 * <EditDialog 
 *     menu={currentMenu} 
 *     setMenu={setMenuFunction} 
 *     id={currentItemId} 
 *     open={dialogOpenState} 
 *     setOpen={setDialogOpenState} 
 * />
 */

export const EditDialog = ({menu, setMenu, id, open, setOpen}) => {
    const [ addOns, setAddOns ] = useState([]);
    const [ inventory, setInventory ] = useState([]);
    const [ menuItem, setMenuItem ] = useState({});
    const [ selectedAddOns, setSelectedAddOns ] = useState({'id': 'default'});
    const [ selectedInventory, setSelectedInventory ] = useState({'id': 'default'});
    const [ nameText, setNameText ] = useState(menuItem.name || "");
    const [ priceText, setPriceText ] = useState(menuItem.price || "");
    const [ idText, setIdText ] = useState(menuItem.id || '');
    const [ errorIdText, setErrorIdText ] = useState(" ");

    useEffect(() => {
        setIdText(menuItem.id);
        setNameText(menuItem.name);
        setPriceText(menuItem.price);
    }, [menuItem])

    useEffect(() => {
        if (id !== '') {
            fetch(serverURL+'/single', {
                method: 'POST',
                headers: {
                    "Content-type": "application/json; charset = UTF-8"
                },
                body: JSON.stringify({'menu': id})
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
            })
                .then((data) => {
                    setMenuItem(data.response); // Make sure this matches the key in your JSON response
            })
                .catch((error) => {
                    console.error('Fetch error:', error);
            });
        }
        fetch(serverURL+'/addOns')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setAddOns(data.addOns); // Make sure this matches the key in your JSON response
            })
            .catch((error) => {
                console.error('Fetch error:', error);
        });
        if (id !== '') {
            fetch(serverURL+'/single', {
                method: 'POST',
                headers: {
                    "Content-type": "application/json; charset = UTF-8"
                },
                body: JSON.stringify({'menu_add_ons': id})
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
            })
                .then((data) => {
                    console.log(data.response);
                    var checked = {};
                    for (const item of data.response) {
                        checked[item.id] = true;
                    }
                    for (const item of addOns) {
                        if (checked[item.id] === true) {
                            continue;
                        }
                        else {
                            checked[item.id] = false;
                        }
                    }
                    setSelectedAddOns(checked);
                    // setSelectedAddOns(data.response);
            })
                .catch((error) => {
                    console.error(error);
            });
        }

        fetch(serverURL+'/inventory')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setInventory(data.inventory); // Make sure this matches the key in your JSON response
            })
            .catch((error) => {
                console.error('Fetch error:', error);
        });

        if (id !== '') {
            fetch(serverURL+'/single', {
                method: 'POST',
                headers: {
                    "Content-type": "application/json; charset = UTF-8"
                },
                body: JSON.stringify({'menu_inventory': id})
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
            })
                .then((data) => {
                    console.log(data.response);
                    var checked = {};
                    for (const item of data.response) {
                        checked[item.id] = true;
                    }
                    for (const item of inventory) {
                        if (checked[item.id] === true) {
                            continue;
                        }
                        else {
                            checked[item.id] = false;
                        }
                    }
                    // console.log(checked);
                    setSelectedInventory(checked);
                    // setSelectedAddOns(data.response);
            })
                .catch((error) => {
                    console.error(error);
            });
        }
    }, []);

    const [ translationHeaders, setTranslationHeaders ] = useState([]);
    const [ translationButtons, setTranslationButtons ] = useState([]);

    useEffect(() => {
        var headers = ['Name', 'Price'];
        TranslateBulk(headers, setTranslationHeaders);
        var buttons = ['Cancel', 'Save'];
        TranslateBulk(buttons, setTranslationButtons);
    }, [])

    // if (id === '') {
    //     return "hello";
    // }
    // console.log(menuItem);
    // console.log(menuItem.name);
    // console.log(menuItem.price);
    
    const handleCancel = (id) => {
        var openDialogs = {};
        for (const [k,v] of Object.entries(open)) {
            if (k == id) {
                openDialogs[k] = !v;
            }
            else {
                openDialogs[k] = v;
            }
        }
        // console.log(openDialogs);
        setOpen(openDialogs);
    }

    const handleName = (event) => {
        // console.log(event.target.value);
        setNameText(event.target.value);
    }

    const handlePrice = (event) => {
        // console.log(event.target.value);
        setPriceText(event.target.value);
    }

    const handleSave = (id) => {
        if (errorIdText !== ' ') {
            return;
        }
        console.log(id);
        var changedMenuItem = {'name': nameText, 'price': priceText, 'id': idText};
        console.log(changedMenuItem);
        // Always assume change of add-ons and inventory items
        // console.log(selectedAddOns);
        // console.log(selectedInventory);
        var changed = ['addOns', 'inventoryItems'];
        for (const [k,v] of Object.entries(changedMenuItem)) {
            if (changedMenuItem[k] != menuItem[k]) {
                changed.push(k);
            }
        }
        var addOns = [];
        for (const [k,v] of Object.entries(selectedAddOns)) {
            if (v === true) {
                addOns.push(k);
            }
        }
        changedMenuItem['addOns'] = addOns;
        var inventory = [];
        for (const [k,v] of Object.entries(selectedInventory)) {
            if (v === true) {
                inventory.push(k);
            }
        }
        changedMenuItem['inventoryItems'] = inventory;
        if (id !== '') {
            // console.log(changedMenuItem);
            for (const item of changed) {
                handleUpdate(item, {'id': menuItem.id, [item]: changedMenuItem[item]});
                // console.log({'id': menuItem.id, [item]: changedMenuItem[item]});
            }
            setMenu(menu.map((row) => (row.id === id ? {'id': changedMenuItem.id, 'name': changedMenuItem.name, 'price': changedMenuItem.price} : row)));
            setMenuItem({'id': changedMenuItem.id, 'name': changedMenuItem.name, 'price': changedMenuItem.price});
        }
        else {
            handleUpdate('add', {'id': Number(changedMenuItem.id), 'name': changedMenuItem.name, 'price': Number(changedMenuItem.price), 'addOns': changedMenuItem.addOns, 'inventoryItems': changedMenuItem.inventoryItems});
            setMenu([...menu, {'id': Number(changedMenuItem.id), 'name': changedMenuItem.name, 'price': Number(changedMenuItem.price)}]);
        }
        handleCancel(id);
    }

    const handleID = (event) => {
        // console.log(event.target.value);
        console.log(menu.filter((row) => (row.id === Number(event.target.value))));
        if (menu.filter((row) => (row.id === Number(event.target.value))).length != 0) {
            setErrorIdText("ID in use");
        }
        else {
            setErrorIdText(" ");
        }
        setIdText(event.target.value)
    }

    // hide loading
    // console.log(id);
    if (id !== '' && (selectedAddOns['id'] || selectedInventory['id'])) {
        return <div></div>
    }
    if (open[id] === undefined || (id !== '' && (Object.keys(menuItem).length === 0 || addOns.length === 0 || inventory.length === 0))) {
        return <div></div>
    }
    // console.log(id);
    // console.log(Object.keys(menuItem).length === 0 || addOns.length === 0 || inventory.length === 0)
    // console.log(selectedAddOns);
    // console.log(selectedInventory);

    return (
    <Dialog open={open[id]} onClose={() => handleCancel(id)} fullWidth>
    {/* <DialogTitle>{menuItem.name}</DialogTitle> */}
    <Box sx={{ m: 3}}>
    <h3>{menuItem.name ? menuItem.name : 'New Menu Item'}</h3>
        <Box sx={{m:3}}></Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flexGrow: 0, flexBasis: '20%' }}>
                <TextField required size='small' label="ID" defaultValue={menuItem.id || ''} onChange={handleID} disabled={id !== ''} error={errorIdText !== ' '} helperText={errorIdText} />
            </Box>
            <Box sx={{ flexGrow: 1, flexBasis: '60%' }}>
                <TextField required size='small' label={translationHeaders[0] || "Name"} defaultValue={menuItem.name || ''} onChange={handleName} fullWidth helperText=' ' />
            </Box>
            <Box sx={{ flexGrow: 0, flexBasis: '20%' }}>
                <TextField required size='small' label={translationHeaders[1] || "Price"} defaultValue={menuItem.price || ''} onChange={handlePrice} helperText=' ' />
            </Box>
        </Box>
        <Box sx={{m:2}}></Box>

        <AddOnsCheckbox isChecked={selectedAddOns} setIsChecked={setSelectedAddOns} />
        <Box sx={{m:2}}></Box>
        <InventoryCheckbox isChecked={selectedInventory} setIsChecked={setSelectedInventory} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button color="primary" onClick={() => handleCancel(id)}>{translationButtons[0] || 'Cancel'}</Button>
            <Button variant="contained" color="primary" onClick={() => handleSave(id)}>{translationButtons[1] || 'Save'}</Button>
        </Box>
    </Box>
</Dialog>

    
        // </Box>
    )
}