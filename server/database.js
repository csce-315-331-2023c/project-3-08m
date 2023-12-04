const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const cors = require('cors');
// const axios = require('axios');
// const session = require('express-session');
// const session = require('cookie-session');

const app = express();
app.use(cors());
app.use(express.json())
const port = process.env.PORT || 9000;
console.log(port);

// app.use(session({
//     secret: process.env.GITHUB_CLIENT_SECRET,
//     resave: false,
//     saveUninitialized: false,
    
// }));

// var language = 'en';
// var router = express.Router();

// app.get('/', async (req, res) => {
//     console.log('i');
//     // await excessReport('12-01-2022');
//     // await restockReport();
//     // await menuItemsPopularity('12-01-2022', '12-31-2022', 20);
//     await salesReport('12-30-2022', '12-31-2022');
//     console.log('j');
// });

// OAUTH STUFF
// app.get('/login/github', (req, res) => {
//     const clientId = process.env.GITHUB_CLIENT_ID;
//     const URI_URL = process.env.SERVER_URL || 'http://localhost:9000';
//     const redirectUri = URI_URL + '/' + process.env.GITHUB_REDIRECT_URI;
//     const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&prompt=consent`;
//     console.log(githubAuthUrl);

//     res.redirect(githubAuthUrl);
// });

// app.get('/login/github/callback', async (req, res) => {
//     const clientId = process.env.GITHUB_CLIENT_ID;
//     const clientSecret = process.env.GITHUB_CLIENT_SECRET;
//     const code = req.query.code;

//     try {
//         const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
//             client_id: clientId,
//             client_secret: clientSecret,
//             code: code,
//         }, {
//             headers: {
//                 Accept: 'application/json',
//             },
//         });

//         const accessToken = tokenResponse.data.access_token;

//       // Now you can use the accessToken to make requests to the GitHub API on behalf of the user
//       // For example, fetch the user's information
//         const userResponse = await axios.get('https://api.github.com/user', {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//             },
//         });

//         const userData = userResponse.data;

//         // Store user data in the session
//         req.session.user = userData;
    
//         // Redirect to a dashboard or profile page
//         res.redirect('/dashboard');
//     } catch (error) {
//         console.error('Error during GitHub OAuth callback:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// app.get('/dashboard', (req, res) => {
//     // Check if the user is authenticated (exists in the session)
//     if (req.session.user) {
//       // res.json(req.session.user);
//         res.send('<a href="/logout">logout</a>');
//     } else {
//       // Redirect to login if not authenticated
//         res.redirect('/login/github');
//     }
// });

//   // Implement logout route
// app.get('/logout', (req, res) => {
//     // Destroy the session to log out the user
//     res.clearCookie('connect.sid');
//     req.session.destroy((err) => {
//         if (err) {
//             console.error('Error destroying session:', err);
//             res.status(500).send('Internal Server Error');
//         } else {
//             // Redirect to the home page after logout
//             res.redirect('/');
//         }
//     });
// });

app.post('/single', async (req, res) => {
    let request = req.body;
    console.log(request);
    var response;
    for (const entry in request) {
        if (entry == 'employee') {
            response = await getSingleEmployee(request[entry]);
        }
        else if (entry == 'add_on') {
            response = await getSingleAddOn(request[entry]);
        }
        else if (entry == 'inventory') {
            response = await getSingleInventoryItem(request[entry]);
        }
        else if (entry == 'order') {
            response = await getSingleOrder(request[entry]);
        }
        else if (entry == 'shift') {
            response = await getSingleShift(request[entry]);
        }
        else if (entry == 'menu') {
            response = await getSingleMenuItem(request[entry]);
        }
        else if (entry == 'menu_add_ons') {
            response = await getMenuItemAddOnsNames(request[entry]);
        }
        else if (entry == 'menu_inventory') {
            response = await getMenuItemInventoryItemsNames(request[entry]);
        }
    }
    res.json({response});
});

app.get('/getLanguage', async (req, res) => {
    console.log(language);
    res.json({language});
});

app.post('/setLanguage', async (req, res) => {
    let request = req.body;
    language = request.language;
    console.log(language);
    // res.json({success: true});
});

app.get('/employees', async (req, res) => {
    const employees = await getEmployees();
    console.log(employees);
    res.json({employees});
});

app.get('/menu', async (req, res) => {
    const menu = await getMenu();
    console.log(menu);
    for (let i = 0; i < menu.length; i++) {
        console.log(menu[i].id);
    }
    // res.render('test', {menu: menu});
    res.json({menu});
});

app.get('/addOns', async (req, res) => {
    const addOns = await getAddOns();
    console.log(addOns);
    res.json({addOns});
});

app.get('/inventory', async (req, res) => {
    const inventory = await getInventory();
    console.log(inventory);
    res.json({inventory});
});

app.get('/orders', async (req, res) => {
    const orders = await getOrders();
    // console.log(orders);
    res.json({orders});
})

app.post('/updateMenu', async (req, res) => {
    let request = req.body;
    // console.log(typeof(request));
    // console.log(req.body);
    console.log(request);
    var updateSuccess = [];
    for (const entry in request) {
        // console.log(entry);
            // console.log(dictEntry);
        // if (entry[0] == 'id') {
        //     console.log(entry);
        // }
        if (entry == 'name') {
            // console.log(entry);
            // var menuItem = await getSingleMenuItem(request['id']);
            // console.log(menuItem.name);
            // console.log(request[entry]);
            var success = await updateMenuItemName(request[entry].id,request[entry].name);
            // menuItem = await getSingleMenuItem(request['id']);
            // console.log(menuItem.name);
            updateSuccess.push(success);
            
        }
        else if (entry == 'price') {
            var success = await updateMenuItemPrice(request[entry].id,request[entry].price);
            updateSuccess.push(success);
        }
        else if (entry == 'addOns') {
            var success = await updateMenuItemAddOns(request[entry].id,request[entry].addOns);
            updateSuccess.push(success);
        }
        else if (entry == 'inventoryItems') {
            var success = await updateMenuItemInventoryItems(request[entry].id,request[entry].inventoryItems);
            updateSuccess.push(success);
        }
        else if (entry == 'delete') {
            var success = await deleteMenuItem(request[entry].id);
            updateSuccess.push(success);
        }
        else if (entry == 'add') {
            var success = await addMenuItem(request[entry].id, request[entry].name, request[entry].price, request[entry].inventoryItems, request[entry].addOns);
            updateSuccess.push(success);
        }
    }
    res.json({updateSuccess});
});

app.post('/updateInventory', async (req, res) => {
    let request = req.body;
    console.log(request);
    var updateSuccess = [];
    for (const entry in request) {
        if (entry == 'name') {
            var success = await updateInventoryItemName(request[entry].id,request[entry].name);
            updateSuccess.push(success);
        }
        else if (entry == 'amount_remaining') {
            var success = await updateInventoryItemAmountRemaining(request[entry].id,request[entry].amountRemaining);
            updateSuccess.push(success);
        }
        else if (entry == 'amount_used') {
            var success = await updateInventoryItemAmountUsed(request[entry].id,request[entry].amountUsed);
            updateSuccess.push(success);
        }
        else if (entry == 'restock') {
            var success = await restockInventoryItem(request[entry].id, request[entry].restockDate, request[entry].restockAmount);
            // var amountRemaining = request[entry].amountRestock;
            // var inventoryItem = await getSingleInventoryItem(request[entry].id);
            // amountRemaining += inventoryItem.amount_remaining;
            // var success = await updateInventoryItemAmountRemaining(request[entry].id,amountRemaining)
            updateSuccess.push(success);
        }
        else if (entry == 'last_restock_date') {
            var success = await updateInventoryItemLastRestockDate(request[entry].id, request[entry].lastRestockDate);
            updateSuccess.push(success);
        }
        else if (entry == 'minimum_amount') {
            var success = await updateInventoryItemMinimumAmount(request[entry].id,request[entry].minimumAmount);
            updateSuccess.push(success);
        }
        else if (entry == 'delete') {
            var success = await deleteInventoryItem(request[entry].id);
            updateSuccess.push(success);
        }
        else if (entry == 'add') {
            var success = await addInventoryItem(request[entry].id,request[entry].name,request[entry].lastRestockDate,request[entry].amountRemaining,request[entry].amountUsed,request[entry].minimumAmount);
            updateSuccess.push(success);
        }
    }
    res.json({updateSuccess});
});

app.post('/updateEmployees', async (req, res) => {
    let request = req.body;
    var updateSuccess = [];
    for (const entry in request) {
        if (entry == 'name') {
            var success = await updateEmployeeName(request[entry].id, request[entry].name);
            updateSuccess.push(success);
        }
        else if (entry == 'username') {
            var success = await updateEmployeeUsername(request[entry].id, request[entry].username);
            updateSuccess.push(success);
        }
        else if (entry == 'password') {
            var success = await updateEmployeePassword(request[entry].id, request[entry].password);
            updateSuccess.push(success);
        }
        else if (entry == 'start_date') {
            var success = await updateEmployeeStartDate(request[entry].id, request[entry].startDate);
            updateSuccess.push(success);
        }
        else if (entry == 'salary') {
            var success = await updateEmployeeSalary(request[entry].id, request[entry].salary);
            updateSuccess.push(success);
        }
        else if (entry == 'position') {
            var success = await updateEmployeePosition(request[entry].id, request[entry].position);
            updateSuccess.push(success);
        }
        else if (entry == 'delete') {
            var success = await deleteEmployee(request[entry].id);
            updateSuccess.push(success);
        }
        else if (entry == 'add') {
            var success = await addEmployee(request[entry].id,request[entry].username,request[entry].password,request[entry].name,request[entry].startDate,request[entry].salary,request[entry].position);
            updateSuccess.push(success);
        }
    }
    res.json({updateSuccess});
});

app.post('/updateAddOns', async (req, res) => {
    let request = req.body;
    console.log(request);
    var updateSuccess = [];
    for (const entry in request) {
        if (entry == 'name') {
            var success = await setAddOnName(request[entry].id, request[entry].name);
            updateSuccess.push(success);
        }
        else if (entry == 'price') {
            var success = await setAddOnPrice(request[entry].id, request[entry].price);
            updateSuccess.push(success);
        }
        else if (entry == 'inventory_id') {
            var success = await setAddOnInventoryItem(request[entry].id, request[entry].inventoryId);
            updateSuccess.push(success);
        }
        else if (entry == 'delete') {
            var success = await deleteAddOn(request[entry].id);
            updateSuccess.push(success);
        }
        else if (entry == 'add') {
            var success = await addAddOn(request[entry].id,request[entry].name,request[entry].price,request[entry].inventoryId);
            updateSuccess.push(success);
        }
    }
    res.json({updateSuccess});
});

app.post('/updateOrders', async (req, res) => {
    let request = req.body;
    // console.log(request);
    var updateSuccess = [];
    for (const entry in request) {
        console.log(entry);
        if (entry == 'delete') {
            var success = await deleteOrder(request[entry].id);
            updateSuccess.push(success);
        }
        else if (entry == 'add') {
            // console.log(request[entry]);
            // console.log(request[entry].)
            // request[entry].menuItems = JSON.parse(request[entry].menuItems);
            // for (let i = 0; i < request[entry].menuItems.length; i++) {
            //     request[entry].menuItems[i] = JSON.parse(request[entry].menuItems[i]);
            // }
            // // request[entry].addOns = JSON.parse(request[entry].addOns);
            // for (let i = 0; i < request[entry].addOns.length; i++) {
            //     request[entry].addOns[i] = JSON.parse(request[entry].addOns[i]);
            //     for (let j = 0; j < request[entry].addOns[i].length; j++) {
            //         request[entry].addOns[i][j] = JSON.parse(request[entry].addOns[i][j]);
            //     }
            // }
            console.log(request[entry]);
            console.log(request[entry].addOns);
            var success = await addOrder(request[entry].price,request[entry].menuItems,request[entry].addOns);
            updateSuccess.push(success);
        }
    }
    res.json({updateSuccess});
});

app.post('/report', async (req, res) => {
    let request = req.body;
    console.log(request);
    var report;
    for (const entry in request) {
        console.log(entry);
        if (entry == 'excess') {
            report = await excessReport(request[entry].timeStamp);
        }
        else if (entry == 'restock') {
            report = await restockReport();
        }
        else if (entry == 'popularity') {
            report = await menuItemsPopularity(request[entry].startDateTime, request[entry].endDateTime, request[entry].numMenuItems);
        }
        else if (entry == 'sales') {
            report = await salesReport(request[entry].startDateTime, request[entry].endDateTime);
        }
    }
    console.log(report);
    res.json({report});
});

const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

// REPORT SECTION

/**
 * Generates excess report
 * @param {string} timeStamp - time stamp of beginning of excess report
 * @returns list containing excess report
 */
async function excessReport(timeStamp) {
    var report = [];
    try {
        var inventoryItems = await getInventory();
        // console.log(inventoryItems);
        var totalInventory = {};
        var totalUsed = {};

        for (let i = 0; i < inventoryItems.length; i++) {
            // console.log(inventoryItems[i]);
            var inventoryItem = inventoryItems[i];
            var inventoryId = inventoryItem.id;
            // console.log(inventoryId);
            var total = Number(inventoryItem.amount_remaining) + Number(inventoryItem.amount_used);
            // console.log(total);
            totalInventory[inventoryId] = total;
        }
        // console.log(totalInventory);
        
        var orderMenuCount = [];
        await pool
            .query(
                "SELECT COUNT(*),menu_id FROM order_menu WHERE order_id in (" +
                "SELECT id FROM orders WHERE date_time BETWEEN \'" + timeStamp + "\' AND LOCALTIMESTAMP" +
                ") GROUP BY menu_id;"
            )
            .then(query_res => {
                for (let i = 0; i < query_res.rowCount; i++) {
                    orderMenuCount.push(query_res.rows[i]);
                }
            });
        // console.log(orderMenuCount);
        for (const menuCount of orderMenuCount) {
            // console.log(menuCount);
            var menuId = menuCount.menu_id;
            var count = Number(menuCount.count);
            var menuInventory = await getMenuItemInventoryItems(menuId);
            for (const inventory of menuInventory) {
                // console.log(inventory);
                var inventoryId = inventory.inventory_id;
                if (inventoryId in totalUsed) {
                    totalUsed[inventoryId] += count;
                }
                else {
                    totalUsed[inventoryId] = count;
                }
            }
        }
        // console.log(totalUsed);
        var orderAddOnsCount = [];
        await pool
            .query(
                "SELECT COUNT(*),add_on_id FROM order_add_ons WHERE order_menu_junction_id in (" +
                "SELECT id FROM order_menu WHERE order_id in " +
                "(SELECT id FROM orders WHERE date_time BETWEEN \'" + timeStamp + "\' AND LOCALTIMESTAMP)" +
                ") GROUP BY add_on_id;"
            )
            .then(query_res => {
                for (let i = 0; i < query_res.rowCount; i++) {
                    // console.log(query_res.rows[i]);
                    orderAddOnsCount.push(query_res.rows[i]);
                }
            });
        // console.log(orderAddOnsCount);

        for (const orderAddOn of orderAddOnsCount) {
            // console.log(orderAddOn);
            var addOnId = orderAddOn.add_on_id;
            var count = Number(orderAddOn.count);
            var inventoryId = 0;
            await pool
                .query(
                    "SELECT * FROM add_on WHERE id = " + addOnId + ";"
                )
                .then(query_res => {
                    for (let i = 0; i < query_res.rowCount; i++) {
                        inventoryId = query_res.rows[i].inventory_id;
                    }
                });
            if (inventoryId in totalUsed) {
                totalUsed[inventoryId] += count;
            }
            else {
                totalUsed[inventoryId] = count;
            }
        }
        // console.log(totalUsed);

        for (const inventoryId in totalUsed) {
            var amountUsed = totalUsed[inventoryId];
            if (totalInventory[inventoryId] * 0.1 > amountUsed) {
                var inventoryItemInfo = [];
                inventoryItemInfo.push(inventoryId);
                var name = "";
                await pool
                    .query("SELECT name FROM inventory WHERE id = " + inventoryId + ";")
                    .then(query_res => {
                        for (let i = 0; i < query_res.rowCount; i++) {
                            name = query_res.rows[i].name;
                        }
                    });
                inventoryItemInfo.push(name);
                inventoryItemInfo.push(""+amountUsed);
                inventoryItemInfo.push(""+totalInventory[inventoryId]);
                report.push(inventoryItemInfo);
            }
        }
        // console.log(report);
    }
    catch (error) {
        console.log(error);
    }
    return report;
}

/**
 * Generates restock report
 * @returns list containing restock report
 */
async function restockReport() {
    var report = [];
    try {
        await pool
            .query(
                "SELECT name,amount_remaining,min_amount FROM inventory " +
                "WHERE amount_remaining < min_amount;"
            )
            .then(query_res => {
                for (let i = 0; i < query_res.rowCount; i++) {
                    report.push(query_res.rows[i]);
                }
            });
        // console.log(report);
    }
    catch (error) {
        console.log(error);
    }
    return report;
}

/**
 * Generates popularity report
 * @param {string} startDateTime - start date
 * @param {string} endDateTime - end date
 * @param {int} numMenuItems - number of menu items
 * @returns list containing popularity report
 */
async function menuItemsPopularity(startDateTime, endDateTime, numMenuItems) {
    var report = [];
    try {
        await pool
            .query(
                "WITH popular_menu_items AS (" +
                "SELECT menu_id, COUNT(*) as order_count FROM order_menu " +
                "WHERE order_id in" +
                "(SELECT id FROM orders WHERE date_time BETWEEN '" + startDateTime + 
                "' AND '" + endDateTime + "') " +
                "GROUP BY menu_id " +
                "LIMIT " + numMenuItems + ") " + 
                "SELECT name, order_count FROM " +
                "popular_menu_items LEFT JOIN menu " + 
                "ON popular_menu_items.menu_id = menu.id " + 
                "ORDER BY order_count DESC;"
            )
            .then(query_res => {
                for (let i = 0; i < query_res.rowCount; i++) {
                    report.push(query_res.rows[i]);
                }
            });
        // console.log(report);
    }
    catch (error) {
        console.log(error);
    }
    return report;
}

/**
 * Generates sales report
 * @param {string} startDateTime - start date
 * @param {string} endDateTime - end date
 * @returns list containing sales report
 */
async function salesReport(startDateTime, endDateTime) {
    var report = {};
    try {
        var menuNames = {};
        var menu = await getMenu();
        for (const menuItem of menu) {
            report[menuItem.name] = [];
            menuNames[menuItem.id] = menuItem.name;
        }
        var addOnNames = {};
        var addOns = await getAddOns();
        for (const addOn of addOns) {
            addOnNames[addOn.id] = addOn.name;
        }
        var fullOrder = [];
        await pool
            .query(
                "SELECT oma.menu_id,o.date_time,o.id,oma.order_menu_junction_id,oma.add_on_id FROM \"orders\" as o FULL OUTER JOIN " +
                "(SELECT oa.add_on_id,oa.order_menu_junction_id,om.menu_id,om.order_id FROM \"order_add_ons\" as oa FULL OUTER JOIN \"order_menu\" AS om " +
                "on om.id = oa.order_menu_junction_id GROUP BY om.menu_id,oa.order_menu_junction_id,om.order_id,oa.add_on_id) AS oma " +
                "on o.id = oma.order_id WHERE o.id in " +
                "(SELECT id FROM orders WHERE date_time BETWEEN timestamp \'" + startDateTime + "\' AND timestamp \'" + endDateTime + "\')" +
                "GROUP BY oma.menu_id,o.date_time,o.id,oma.order_menu_junction_id,oma.add_on_id;"
            )
            .then(query_res => {
                for (let i = 0; i < query_res.rowCount; i++) {
                    fullOrder.push(query_res.rows[i]);
                }
            });
        // console.log(fullOrder);
        // if no addOns, add_on_id is null
        var i = 0;
        while (true) {
            if (i >= fullOrder.length) {
                break;
            }
            // console.log(i);
            var menuId = fullOrder[i].menu_id;
            if (menuId === null) {
                i++;
                continue;
            }
            var orderMenuJunctionId = fullOrder[i].order_menu_junction_id;
            var dateTime = fullOrder[i].date_time;
            var orderId = fullOrder[i].id;
            var addOnId = fullOrder[i].add_on_id;
            
            var value = [];
            value.push(""+orderId);
            value.push(dateTime);

            if (addOnId != null) {
                value.push(addOnNames[addOnId]);
            }
            i++;
            while (i < fullOrder.length) {
                var currentOrderMenuJunctionId = fullOrder[i].order_menu_junction_id;
                if (orderMenuJunctionId != currentOrderMenuJunctionId || currentOrderMenuJunctionId == null) {
                    break;
                }
                addOnId = fullOrder[i].add_on_id;
                if (addOnId != null) {
                    value.push(addOnNames[addOnId]);
                }
                i++;
            }
            // console.log(menuNames[menuId]);
            // console.log(menuId);
            report[menuNames[menuId]].push(value);
        }
        // console.log(report);
    }
    catch (error) {
        console.log(error);
    }
    return report;
}

// MENU-INVENTORY JUNCTION

/**
 * Gets inventory items required for a menu item
 * @param {int} id - id
 * @returns list of inventory items
 */
async function getMenuItemInventoryItems(id) {
    var inventoryItems = [];
    try {
        // console.log(id);
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

/**
 * Updates inventory items associated with menu item
 * @param {int} id - id
 * @param {list} newInventoryItems - list of new inventory items
 * @returns true if function is successful, else false
 */
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

/**
 * Gets menu
 * @returns list containing the menu
 */
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

/**
 * Gets a single menu item
 * @param {int} id - id
 * @returns single menu item
 */
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

/**
 * Adds a menu item
 * @param {int} id - item id
 * @param {string} name - name of item
 * @param {float} price - price of item
 * @param {list} inventoryIds - inventory items required to make item
 * @param {list} addOnIds - add ons possible for item
 * @returns true if function succeeds, else false
 */
async function addMenuItem(id, name, price, inventoryIds, addOnIds) {
    try {
        await pool
            .query(
                "INSERT INTO menu (id, name, price) VALUES"+
                "(" + id + ", \'" + name + "\', " + price + ");"
            );
        var a = updateMenuItemInventoryItems(id, inventoryIds);
        var b = updateMenuItemAddOns(id, addOnIds);
        return a && b;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Deletes a menu item
 * @param {int} id - id
 * @returns true if function succeeds, else false
 */
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

/**
 * Updates menu item name
 * @param {int} id - id
 * @param {string} newName - new name 
 * @returns true if function succeeds, else false
 */
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

/**
 * Updates menu item price
 * @param {int} id - id
 * @param {float} newPrice - new price 
 * @returns true if function succeeds, else false
 */
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

/**
 * Gets add ons possible for a given menu item
 * @param {int} id - id
 * @returns list of add ons
 */
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

/**
 * Updates add ons possible for menu item
 * @param {int} id - id
 * @param {list} newAddOns - list of new add ons 
 * @returns true if function succeeds, else false
 */
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

/**
 * Gets all add ons
 * @returns list of add ons
 */
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

/**
 * Gets a single add on
 * @param {int} id - id
 * @returns a single add on
 */
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

/**
 * Adds an add on
 * @param {int} id - id
 * @param {string} name - name 
 * @param {float} price - price
 * @param {int} inventoryItem - inv item
 * @returns true if function succeeds, else false
 */
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

/**
 * Deletes an add on
 * @param {int} id - id
 * @returns true if function succeeds, else false
 */
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

/**
 * Updates add on name
 * @param {int} id - id
 * @param {string} newName - new name 
 * @returns true if function succeeds, else false
 */
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

/**
 * Updates add on price
 * @param {int} id - id
 * @param {float} newPrice - new price 
 * @returns true if function succeeds, else false
 */
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

/**
 * Sets new inventory item for add on
 * @param {int} id - id
 * @param {*} newInventoryItemMapping - inventory item id
 * @returns true if function succeeds, else false
 */
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

/**
 * Gets single order
 * @param {int} id - id
 * @returns a single order
 */
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

/**
 * Gets all orders
 * @returns list of orders
 */
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

/**
 * Adds an order
 * @param {float} price - price 
 * @param {list} menuItemIds - list of menu item ids
 * @param {list} addOnIds - list of add on ids
 * @returns true if function suceeds, else false
 */
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
            // console.log(orderAddOnsQueryString[orderAddOnsQueryString.length-1]);
            if (orderAddOnsQueryString.charAt(orderAddOnsQueryString.length-1) === ",") {
                orderAddOnsQueryString = orderAddOnsQueryString.substring(0, orderAddOnsQueryString.length-1);
            }
            orderAddOnsQueryString += ";";
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

/**
 * Deletes an order
 * @param {int} id - id 
 * @returns true if function succeeds, else false
 */
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

/**
 * Gets a single employee by id
 * @param {int} id - id 
 * @returns a single employee
 */
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

/**
 * Gets all employees
 * @returns list of employees
 */
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

/**
 * Adds an employee
 * @param {int} id - id
 * @param {string} userName - username 
 * @param {string} password - password
 * @param {string} name - employee name
 * @param {string} startDate - start date
 * @param {float} salary - salary
 * @param {string} position - postiion
 * @returns true if function succeeds, else false
 */
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

/**
 * Deletes an employee by id
 * @param {int} id - id
 * @returns true if function suceeds, else false
 */
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

/**
 * Updates employee username
 * @param {int} id 
 * @param {string} newUsername 
 * @returns true if function succeeds, else false
 */
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

/**
 * Updates employee password
 * @param {int} id 
 * @param {string} newPassword 
 * @returns true if function succeeds, else false
 */
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

/**
 * Updates employee name
 * @param {int} id - id
 * @param {string} newName - new name 
 * @returns true if function succeeds, else false
 */
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

/**
 * Updates employee start date
 * @param {int} id - id
 * @param {string} newStartDate - new start date 
 * @returns true if function succeeds, else false
 */
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

/**
 * Updates employee salary
 * @param {int} id 
 * @param {float} newSalary 
 * @returns true if function succeeds, else false
 */
async function updateEmployeeSalary(id, newSalary) {
    try {
        await pool
            .query(
                "UPDATE employee " + 
                "SET salary = " + newSalary + " " + 
                "WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }  
}

/**
 * Updates employee position
 * @param {int} id - id
 * @param {string} newPosition - new position 
 * @returns true if function succeeds, else false
 */
async function updateEmployeePosition(id, newPosition) {
    try {
        await pool
            .query(
                "UPDATE employee " + 
                "SET position = \'" + newPosition + "\' " +
                "WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }  
}

// SHIFTS SECTION

/**
 * Gets a single shift by id
 * @param {int} id - id
 * @returns a single shift
 */
async function getSingleShift(id) {
    var shift = [];
    await pool
        .query("SELECT * FROM shifts WHERE id = " + id + ";")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++) {
                shift.push(query_res.rows[i]);
            }
        });
    return shift[0];
}

/**
 * Adds a shift
 * @param {int} id - id 
 * @param {string} startTime - start time 
 * @param {string} endTime - end time
 * @returns true if function succeeds, else false
 */
async function addShift(id, startTime, endTime) {
    try {
        await pool
            .query(
                "INSERT INTO shifts (id, start_time, end_time) VALUES(" +
                id + ", " + startTime + ", " + endTime + ");"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Deletes a shift
 * @param {int} id - id 
 * @returns true if function succeeds, else false
 */
async function deleteShift(id) {
    try {
        await pool
            .query(
                "DELETE FROM shifts WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Updates shift start time
 * @param {int} id - id
 * @param {string} newStartTime - new start time 
 * @returns true if function succeeds, else false
 */
async function updateShiftStartTime(id, newStartTime) {
    try {
        await pool
            .query(
                "UPDATE shifts " +
                "SET start_time = " + newStartTime + " " + 
                "WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Updates shift end time
 * @param {int} id - id
 * @param {string} newEndTime - new end time 
 * @returns true if function succeeds, else false
 */
async function updateShiftEndTime(id, newEndTime) {
    try {
        await pool
            .query(
                "UPDATE shifts " +
                "SET end_time = " + newEndTime + " " + 
                "WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Gets all shifts
 * @returns list of shifts
 */
async function getAllShifts() {
    var shifts = [];
    await pool
        .query("SELECT * FROM shifts;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++) {
                shifts.push(query_res.rows[i]);
            }
        });
    return shifts;
}

// EMPLOYEE SHIFTS JUNCTION TABLE SECTION

/**
 * Gets all shifts for an employee
 * @param {int} id - id
 * @returns list of shifts
 */
async function getSingleEmployeeShifts(id) {
    var shifts = [];
    await pool
        .query("SELECT * FROM employee_shift WHERE employee_id = " + id + ";")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++) {
                shifts.push(query_res.rows[i]);
            }
        });
    return shifts;
}

/**
 * Gets all shifts of all employees
 * @returns list of shifts
 */
async function getAllEmployeeShifts() {
    var shifts = [];
    await pool
        .query("SELECT * FROM employee_shift;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++) {
                shifts.push(query_res.rows[i]);
            }
        });
    return shifts;
}

/**
 * Adds an employee shift
 * @param {int} id - id
 * @param {int} shiftId - shift id 
 * @param {int} employeeId - employee id
 * @param {string} month - month
 * @param {string} dayOfWeek - day
 * @returns true if function succeeds, else false
 */
async function addEmployeeShift(id, shiftId, employeeId, month, dayOfWeek) {
    try {
        await pool
            .query(
                "INSERT INTO employee_shift (id, shift_id, employee_id, month, day_of_week) VALUES (" +
                id + ", " + shiftId + ", " + employeeId + ", " + month + ", " + dayOfWeek + ");"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Deletes employee shift
 * @param {int} id 
 * @returns true if function succeeds, else false
 */
async function deleteEmployeeShift(id) {
    try {
        await pool
            .query(
                "DELETE FROM employee_shift WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Updates shift id
 * @param {int} id - id
 * @param {int} newShiftId - new shift id
 * @returns true if function succeeds, else false
 */
async function updateShiftId(id, newShiftId) {
    try {
        await pool
            .query(
                "UPDATE employee_shift " + 
                "SET shift_id = " + newShiftId + " " + 
                "WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Updates employee id
 * @param {int} id - id
 * @param {int} newEmployeeId - new employee id 
 * @returns true if function succeeds, else false
 */
async function updateEmployeeId(id, newEmployeeId) {
    try {
        await pool
            .query(
                "UPDATE employee_shift " + 
                "SET employee_id = " + newEmployeeId + " " + 
                "WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Updates month
 * @param {int} id - id
 * @param {string} newMonth - new month 
 * @returns true if function succeeds, else false
 */
async function updateMonth(id, newMonth) {
    try {
        await pool
            .query(
                "UPDATE employee_shift " + 
                "SET month = " + newMonth + " " + 
                "WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Updates day of week
 * @param {int} id - id
 * @param {string} newDayOfWeek - new day of week
 * @returns true if function succeeds, else false
 */
async function updateDayOfWeek(id, newDayOfWeek) {
    try {
        await pool
            .query(
                "UPDATE employee_shift " + 
                "SET day_of_week = " + newDayOfWeek + " " + 
                "WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

// INVENTORY SECTION

/**
 * Gets a single inventory item by id
 * @param {int} id - id
 * @returns a single inventory item
 */
async function getSingleInventoryItem(id) {
    var item = [];
    await pool
        .query("SELECT * FROM inventory where id = " + id + ";")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++) {
                item.push(query_res.rows[i]);
            }
        });
    return item[0];
}

/**
 * Gets all inventory items
 * @returns list of inventory items
 */
async function getInventory() {
    var items = [];
    await pool
        .query("SELECT * FROM inventory;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++) {
                items.push(query_res.rows[i]);
            }
        });
    return items;
}

/**
 * Adds an inventory item
 * @param {int} id - id
 * @param {string} name - name of item 
 * @param {string} lastRestockDate - last restock date of item
 * @param {float} amountRemaining - amount of item remaining
 * @param {float} amountUsed - amount of item used
 * @param {float} minimumAmount - minimum amount of item
 * @returns true if function succeeds, else false
 */
async function addInventoryItem(id, name, lastRestockDate, amountRemaining, amountUsed, minimumAmount) {
    try {
        await pool
            .query(
                "INSERT INTO inventory (id, name, last_restock_date, amount_remaining, amount_used, min_amount) VALUES (" +
                id + ", \'" + name + "\', \'" + lastRestockDate + "\', " + amountRemaining + ", " + amountUsed + ", " + minimumAmount + ");"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Deletes an inventory item by id
 * @param {int} id - id
 * @returns true if function succeeds, else false
 */
async function deleteInventoryItem(id) {
    try {
        await pool
            .query("DELETE FROM inventory WHERE id = " + id + ";");
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Updates amount remaining of inventory item
 * @param {int} id - id
 * @param {float} newAmountRemaining - new amount remaining
 * @returns true if function succeeds, else false
 */
async function updateInventoryItemAmountRemaining(id, newAmountRemaining) {
    try {
        await pool
            .query(
                "UPDATE inventory " +
                "SET amount_remaining = " + newAmountRemaining + " " + 
                "WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Updates inventory item amount used
 * @param {int} id - id
 * @param {float} newAmountUsed - new amount used 
 * @returns true if function succeeds, else false
 */
async function updateInventoryItemAmountUsed(id, newAmountUsed) {
    try {
        await pool
            .query(
                "UPDATE inventory " +
                "SET amount_used = " + newAmountUsed + " " +
                "WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Updates inventory item name
 * @param {int} id - id
 * @param {string} newName - new name 
 * @returns true if function succeeds, else false
 */
async function updateInventoryItemName(id, newName) {
    try {
        await pool
            .query(
                "UPDATE inventory " +
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

/**
 * Updates inventory item minimum amount
 * @param {int} id - id
 * @param {float} newMinimumAmount - new min amount
 * @returns true if function succeeds, else false
 */
async function updateInventoryItemMinimumAmount(id, newMinimumAmount) {
    try {
        await pool
            .query(
                "UPDATE inventory " +
                "SET min_amount = " + newMinimumAmount + " " +
                "WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Updates inventory item last restock date
 * @param {int} id - id
 * @param {string} newLastRestockDate - new restock date
 * @returns true if function succeeds, else false
 */
async function updateInventoryItemLastRestockDate(id, newLastRestockDate) {
    try {
        await pool
            .query(
                "UPDATE inventory " +
                "SET last_restock_date = '" + newLastRestockDate + '\' ' + 
                "WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Restocks inventory item
 * @param {int} id - id
 * @param {string} restockDate - restock date 
 * @param {float} restockAmount - restock amount
 * @returns true if function succeeds, else false
 */
async function restockInventoryItem(id, restockDate, restockAmount) {
    try {
        var item = [];
        await pool
            .query("SELECT * FROM inventory WHERE id = "+ id + ";")
            .then(query_res => {
                for (let i = 0; i < query_res.rowCount; i++) {
                    item.push(query_res.rows[i]);
                }
            });
        var rem = item[0].amount_remaining;
        await pool
            .query(
                "UPDATE inventory " + 
                "SET amount_remaining = " + (rem + restockAmount) + ", " + 
                "last_restock_date = \'" + restockDate + "\', " + 
                "amount_used = 0 " +    // amount_used is the amount used after the last restock
                "WHERE id = " + id + ";"
            );
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Uses inventory item
 * @param {int} id - id
 * @returns true if function succeeds, else false
 */
async function useInventoryItem(id) {
    try {
        var item = getSingleInventoryItem(id);
        var amountRemaining = item.amount_remaining;
        var amountUsed = item.amount_used;
        amountRemaining--;
        amountUsed++;
        var updatedAmtRem = updateInventoryItemAmountRemaining(id, amountRemaining);
        var updatedAmtUsed = updateInventoryItemAmountUsed(id, amountUsed);
        return updatedAmtRem && updatedAmtUsed;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

// HELPERS

/**
 * Gets add ons associated with menu item
 * @param {int} id - id
 * @returns list of add ons
 */
async function getMenuItemAddOnsNames(id) {
    var names = [];
    try {
        await pool
            .query(
                "SELECT * FROM add_on WHERE id in " +
                "(SELECT add_on_id FROM menu_add_on WHERE menu_id = "+id + ");"
            )
            .then(query_res => {
                for (let i = 0; i < query_res.rowCount; i++) {
                    names.push(query_res.rows[i]);
                }
            });
    }
    catch (error) {
        console.log(error);
    }
    return names;
}

/**
 * Gets names of inventory items associated with menu item
 * @param {int} id - id
 * @returns list of names
 */
async function getMenuItemInventoryItemsNames(id) {
    var names = [];
    try {
        await pool
            .query(
                "SELECT * FROM inventory WHERE id in " +
                "(SELECT inventory_id FROM menu_inventory WHERE menu_id = " + id + ");"
            )
            .then(query_res => {
                for (let i = 0; i < query_res.rowCount; ++i) {
                    names.push(query_res.rows[i]);
                }
            });
    }
    catch (error) {
        console.log(error);
    }
    return names;
}

// OTHER STUFF

process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown.');
    process.exit(0);
});

app.listen(port, '0.0.0.0',() => {
    console.log(`listening at localhost:${port}`);
});

module.exports = app;

// module.exports = {
//     getMenu: getMenu,
//     getSingleMenuItem: getSingleMenuItem
// };