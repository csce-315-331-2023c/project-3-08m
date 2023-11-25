import { Dialog, TextField, DialogTitle, Button } from "@mui/material";
import Box from "@mui/material/Box";
import AddOnsCheckbox from "./MenuTableAddOnCheckbox";
import { useEffect, useState } from "react";
import InventoryCheckbox from "./MenuTableInventoryCheckbox";

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

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

export const EditDialog = ({menu, setMenu, id, open, setOpen}) => {
    const [ addOns, setAddOns ] = useState([]);
    const [ inventory, setInventory ] = useState([]);
    const [ menuItem, setMenuItem ] = useState({});
    const [ selectedAddOns, setSelectedAddOns ] = useState({'id': 'default'});
    const [ selectedInventory, setSelectedInventory ] = useState({'id': 'default'});
    const [ nameText, setNameText ] = useState(menuItem.name || "");
    const [ priceText, setPriceText ] = useState(menuItem.price || "");
    const [ idText, setIdText ] = useState(menuItem.id || '');

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
            console.log(changedMenuItem);
            for (const item of changed) {
                handleUpdate(item, {'id': menuItem.id, [item]: changedMenuItem[item]});
                // console.log({'id': menuItem.id, [item]: changedMenuItem[item]});
            }
            setMenu(menu.map((row) => (row.id === id ? {'id': changedMenuItem.id, 'name': changedMenuItem.name, 'price': changedMenuItem.price} : row)));
            setMenuItem({'id': changedMenuItem.id, 'name': changedMenuItem.name, 'price': changedMenuItem.price});
        }
        else {
            handleUpdate('add', {'id': changedMenuItem.id, 'name': changedMenuItem.name, 'price': changedMenuItem.price, 'addOns': changedMenuItem.addOns, 'inventoryItems': changedMenuItem.inventoryItems});
            setMenu([...menu, {'id': changedMenuItem.id, 'name': changedMenuItem.name, 'price': changedMenuItem.price}]);
        }
        handleCancel(id);
    }

    const handleID = (event) => {
        // console.log(event.target.value);
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
        <Box>
            <Dialog open={open[id]} onClose={() => handleCancel(id)} fullWidth >
                <DialogTitle>{menuItem.name}</DialogTitle>
                <TextField required size='small' label="ID" defaultValue={menuItem.id || ''} onChange={handleID} disabled={id !== ''} /><br></br>
                <TextField required size='small' label="Name" defaultValue={menuItem.name || ''} onChange={handleName} /><br></br>
                <TextField required size='small' label="Price" defaultValue={menuItem.price || ''} onChange={handlePrice} /><br></br>
                <AddOnsCheckbox isChecked={selectedAddOns} setIsChecked={setSelectedAddOns} />
                <InventoryCheckbox isChecked={selectedInventory} setIsChecked={setSelectedInventory} />
                <Button color="primary" onClick={() => handleCancel(id)}>Cancel</Button>
                <Button color="primary" onClick={() => handleSave(id)}>Save</Button>
            </Dialog>
        </Box>
    )
}