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
    const orderAdd = await addOrder(9.99, [1,2,3], [[1,2,3],[],[3,4]]);
    for (let i = 57037; i < 57046; i++) {
        await deleteOrder(i);
    }
    // const orderDelete = await deleteOrder(57037);
    // const orderDelete2 = await deleteOrder(57038);
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
            .query(
                "SELECT * FROM menu_inventory WHERE menu_id = " + id + ";"
            )
            .then(query_res => {
                for (let i = 0; i < query_res.rowCount; i++) {
                    inventoryItems.push(query_res.rows[i]);
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
            .query(
                "DELETE FROM menu_inventory WHERE menu_id = " + id + ";"
            );
        if (newInventoryItems.length != 0) {
            var queryString = "INSERT INTO menu_inventory (menu_id, inventory_id) VALUES ";
            for (let i = 0; i < newInventoryItems.length; i++) {
                queryString += "(" + id + ", " + newInventoryItems[i] + ")";
                if (i < newInventoryItems.length - 1) {
                    queryString += ",";
                }
            }
            await pool.query(queryString);
        }
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
            .query('SELECT * FROM menu ORDER BY id;')
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
        .query('SELECT * FROM add_on ORDER BY id;')
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
    return addOn[0];
}

async function addAddOn(id, name, price, inventoryItem) {
    try {
        await pool
            .query(
                "INSERT INTO add_on (id, name, price) VALUES " + 
                "(" + id + ", \'" + name + "/', " + price + ");"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
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
        .query('SELECT * FROM orders ORDER BY id;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++) {
                orders.push(query_res.rows[i]);
            }
        });
    return orders;
}

async function addOrder(price, menuItemIds, addOnIds) {
    try {
        var id = 0;
        await pool
            .query("SELECT MAX(id) FROM orders;")
            .then(query_res => {
                id = query_res.rows[0].max + 1;
            });
        await pool
            .query(
                "INSERT INTO orders (id, price, date_time) VALUES " +
                "(" + id + ", " + price + ", LOCALTIMESTAMP);"
            );
        var orderMenuJunctionId = 0;
        await pool
            .query("SELECT MAX(id) FROM order_menu;")
            .then(query_res => {
                orderMenuJunctionId = query_res.rows[0].max + 1;
            });
        if (menuItemIds.length != 0) {
            var orderMenuQueryString = "INSERT INTO order_menu (id, order_id, menu_id) VALUES ";
            for (let i = 0; i < menuItemIds.length; i++) {
                orderMenuQueryString += "(" + (orderMenuJunctionId+i) + ", " + id + ", " + menuItemIds[i] + ")";
                if (i < menuItemIds.length - 1) {
                    orderMenuQueryString += ", ";
                }

                var menuItemInventoryItems = await getMenuItemInventoryItems(menuItemIds[i]);
                var hasInventory = (menuItemInventoryItems.length > 0);
                var inventoryUpdateString = "UPDATE inventory SET amount_remaining = (amount_remaining - 1), amount_used = (amount_used + 1) WHERE id in (";
                for (let j = 0; j < menuItemInventoryItems.length; j++) {
                    inventoryUpdateString += menuItemInventoryItems[j].inventory_id;
                    if (j < menuItemInventoryItems.length - 1) {
                        inventoryUpdateString += ",";
                    }
                }
                inventoryUpdateString += ");";
                if (hasInventory) {
                    await pool.query(inventoryUpdateString);
                }
            }
            await pool.query(orderMenuQueryString);
            var hasAddOns = false;
            var orderAddOnsQueryString = "INSERT INTO order_add_ons (order_menu_junction_id, add_on_id) VALUES ";
            for (let i = 0; i < addOnIds.length; i++) {
                for (let j = 0; j < addOnIds[i].length; j++) {
                    hasAddOns = true;
                    orderAddOnsQueryString += "(" + (orderMenuJunctionId+i) + ", " + addOnIds[i][j] + ")";
                    if (j < addOnIds[i].length - 1) {
                        orderAddOnsQueryString += ",";
                    }

                    var addOn = await getSingleAddOn(addOnIds[i][j]);
                    await pool
                        .query(
                            "UPDATE inventory SET amount_remaining = (amount_remaining - 1), amount_used = (amount_used + 1) WHERE id = " + addOn.inventory_id + ";"
                        );
                    
                }
                if (i < addOnIds.length - 1 && addOnIds[i].length != 0) {
                    orderAddOnsQueryString += ",";
                }
            }
            // console.log(orderAddOnsQueryString);
            if (hasAddOns) {
                await pool.query(orderAddOnsQueryString);
            }
        }
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

async function deleteOrder(id) {
    try {
        await pool
            .query("DELETE FROM orders WHERE id = " + id + ";");
        var orderAddOnQueryString = "DELETE FROM order_add_ons WHERE order_menu_junction_id in (";
        var hasAddOns = false;
        await pool
            .query("SELECT * FROM order_menu WHERE order_id = " + id + ";")
            .then(query_res => {
                for (let i = 0; i < query_res.rowCount; i++) {
                    hasAddOns = true;
                    // orderMenuJunctionIds.push(query_res.rows[i].id);
                    orderAddOnQueryString += query_res.rows[i].id;
                    if (i < query_res.rowCount - 1) {
                        orderAddOnQueryString += ",";
                    }
                }
                orderAddOnQueryString += ");";
            });
        await pool
            .query("DELETE FROM order_menu WHERE order_id = " + id + ";");
        // console.log(orderAddOnQueryString);
        if (hasAddOns) {
            await pool.query(orderAddOnQueryString);
        }
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

// EMPLOYEE SECTION

async function getSingleEmployee(id) {
    var employee = [];
    await pool
        .query("SELECT * FROM employee where id = " + id + ";")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++) {
                employee.push(query_res.rows[i]);
            }
        });
    return employee[0];
}

async function getEmployees() {
    var employees = [];
    await pool
        .query("SELECT * FROM employee;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++) {
                employees.push(query_res.rows[i]);
            }
        });
    return employees;
}

async function addEmployee(id, userName, password, name, startDate, salary, position) {
    try {
        await pool
            .query(
                "INSERT INTO employee (id, username, password, name, start_date, salary, position) VALUES (" +
                id + ", \'" + userName + "\', \'" + password + "\', \'" + name + "\', \'" + startDate +
                "\', " + salary + ", \'" + position + "\');");
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

async function deleteEmployee(id) {
    try {
        await pool
            .query("DELETE FROM employee WHERE id = " + id + ";");
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

async function updateEmployeeUsername(id, newUsername) {
    try {
        await pool
            .query(
                "UPDATE employee " + 
                "SET username = \'" + newUsername + "\' " +
                "WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

async function updateEmployeePassword(id, newPassword) {
    try {
        await pool
            .query(
                "UPDATE employee " + 
                "SET password = \'" + newPassword + "\' " +
                "WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

async function updateEmployeeName(id, newName) {
    try {
        await pool
            .query(
                "UPDATE employee " + 
                "SET name = \'" + newName + "\' " + 
                "WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }  
}

async function updateEmployeeStartDate(id, newStartDate) {
    try {
        await pool
            .query(
                "UPDATE employee " + 
                "SET start_date = \'" + newStartDate + "\' " + 
                "WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }  
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