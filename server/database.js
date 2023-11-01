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

async function getMenu() {
    var menu = [];
    // router.post(function() {
    await pool
        .query('SELECT * FROM MENU;')
        .then(query_res => {
            console.log(query_res.rowCount);
            console.log(query_res.rows.length);
            for(let i = 0; i < query_res.rowCount; i++) {
                // console.log(i);
                menu.push(query_res.rows[i]);
            }
            console.log("got menu");
            // console.log(menu);
            return menu;
        });
    // })
    return menu;
}

async function getSingleMenuItem(id) {
    var menuItem = [];
    await pool
        .query('SELECT * FROM MENU WHERE id = '+id+';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++) {
                menuItem.push(query_res.rows[i]);
            }
        });
    // console.log(menuItem);
    return menuItem[0];
}

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