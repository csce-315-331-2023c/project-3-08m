const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();

const app = express();
const port = 3000;
// var router = express.Router();

app.set("view engine", "ejs");

// app.get('/', (req, res) => {
//     const data = {menu: []};
//     res.send(data);
//     // res.render('index', data);
// })

app.get('/', async (req, res) => {
    const menu = await getMenu();
    const menuItem = await getSingleMenuItem(1);
    const order2 = await getSingleOrder(2);
    console.log(menuItem);
    console.log('after');
    // console.log(menu);
    res.render('test', {menu: menu, menuItem: menuItem, order: order2});
    // res.render('test', {menuItem: menuItem});
});

const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

// pool.connect();

// MENU-INVENTORY JUNCTION

async function getMenuItemInventoryItems(id) {
    var inventoryItems = [];
    try {
        await pool
            .query("")
            .then(query_res => {
                for (let i = 0; i < query_res.rowCount; i++) {

                }
            });
        return inventoryItems;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}

async function updateMenuItemInventoryItems(id, newInventoryItems) {
    try {
        await pool
            .query("");
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

// MENU

async function getMenu() {
    var menu = null;
    // router.post(function() {
    try {
        await pool
            .query('SELECT * FROM menu;')
            .then(query_res => {
                // console.log(query_res.rowCount);
                // console.log(query_res.rows.length);
                menu = [];
                for(let i = 0; i < query_res.rowCount; i++) {
                    // console.log(i);
                    menu.push(query_res.rows[i]);
                }
                // console.log("got menu");
                // console.log(menu);
                return menu;
            });
    }
    catch (error) {
        console.log(error);
    }
    // })
    return menu;
}

async function getSingleMenuItem(id) {
    var menuItem = null;
    try {
        await pool
            .query('SELECT * FROM menu WHERE id = '+id+';')
            .then(query_res => {
                // for (let i = 0; i < query_res.rowCount; i++) {
                //     menuItem.push(query_res.rows[i]);
                // }
                menuItem = query_res.rows[0];
            });
    }
    catch (error) {
        console.log(error);
    }
    // console.log(menuItem);
    return menuItem;
}

async function addMenuItem(id, name, price, inventoryIds, addOnIds) {
    try {
        await pool
            .query(
                "INSERT INTO menu (id, name, price) VALUES"+
                "(" + id + ", \'" + name + "\', " + price + ");"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

async function deleteMenuItem(id) {
    try {
        await pool
            .query(
                "DELETE FROM menu WHERE id = " + id + ";"
            );
        await pool
            .query(
                "DELETE FROM menu_add_on WHERE menu_id = " + id + ";"
            );
        await pool
            .query(
                "DELETE FROM menu_inventory WHERE menu_id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

async function updateMenuItemName(id, newName) {
    try {
        await pool
            .query(
                "UPDATE menu SET name = \'" + newName + "\' WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

async function updateMenuItemPrice(id, newPrice) {
    try {
        await pool
            .query(
                "UPDATE menu SET price = " + newPrice + " WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

// MENU-ADD-ON JUNCTION

async function getMenuItemAddOns(id) {
    var addOns = null;
    try {
        await pool
            .query(
                "SELECT * FROM menu_add_on WHERE menu_id = " + id + ";"
            )
            .then(query_res => {
                addOns = [];
                for (let i = 0; i < query_res.rowCount; i++) {
                    addOns.push(query_res.rows[i]);
                }
            });
    }
    catch (error) {
        console.log(error);
    }
    return addOns;
}

async function updateMenuItemAddOns(id, newAddOns) {
    try {
        await pool
            .query(
                "DELETE FROM menu_add_on WHERE menu_id = " + id + ";"
            );
        if (newAddOns.length != 0) {
            var queryString = "INSERT INTO menu_add_on (menu_id, add_on_id) VALUES ";
            for (let i = 0; i < newAddOns.length; i++) {
                queryString += "(" + id + ", " + newAddOns[i] + ")";
                if (i < newAddOns.length - 1) {
                    queryString += ",";
                }
            }
            queryString += ";"
            await pool
                .query(queryString);
        }
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

// ADD-ON SECTION

async function getAddOns() {
    var addOns = [];
    await pool
        .query('SELECT * FROM add_on;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++) {
                addOns.push(query_res.rows[i]);
            }
        });
    return addOns;
}

async function getSingleAddOn(id) {
    var addOn = [];
    await pool
        .query('SELECT * FROM add_on WHERE id = ' + id + ';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++) {
                addOn.push(query_res.rows[i]);
            }
        });
    return addOn;
}

async function deleteAddOn(id) {
    try {
        await pool
            .query(
                "DELETE FROM add_on WHERE id = " + id + ";"
            );
        await pool
            .query(
                "DELETE FROM menu_add_on WHERE add_on_id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

async function setAddOnName(id, newName) {
    try {
        await pool
            .query(
                "UPDATE add_on SET name = \'" + newName + "\' WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

async function setAddOnPrice(id, newPrice) {
    try {
        await pool
            .query(
                "UPDATE add_on SET price = " + newPrice + " WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

async function setAddOnInventoryItem(id, newInventoryItemMapping) {
    try {
        await pool
            .query(
                "UPDATE add_on SET inventory_id = " + newInventoryItemMapping + " WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

// ORDERS SECTION

async function getSingleOrder(id) {
    var order = [];
    await pool
        .query('SELECT * FROM orders WHERE id = '+ id + ";")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++) {
                order.push(query_res.rows[i]);
            }
        });
    return order[0];
}

async function getOrders() {
    var orders = [];
    await pool
        .query('SELECT * FROM orders;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++) {
                orders.push(query_res.rows[i]);
            }
        });
    return orders;
}

// OTHER STUFF

process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown.');
    process.exit(0);
});

app.listen(port, () => {
    console.log("listening at localhost:${port}");
});

module.exports = {
    getMenu: getMenu,
    getSingleMenuItem: getSingleMenuItem
};