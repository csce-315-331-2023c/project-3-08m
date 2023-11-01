const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();

// const app = express();
// const port = 3000;
// var router = express.Router();

const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

var getMenu = function() {
    menu = []
    // router.post(function() {
    pool
        .query('SELECT * FROM MENU;')
        .then(query_res => {
            for(let i = 0; i < query_res.rowCount; i++) {
                menu.push(query_res.rows[i]);
            }
        });
    // })
    return menu;
}

var getSingleMenuItem = function(router, id) {
    menuItem = []
    pool
        .query('SELECT * FROM MENU WHERE id = '+id+';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++) {
                menuItem.push(query_res.rows[i]);
            }
        });
    console.log(menuItem);
    return menuItem;
}

process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown.');
    process.exit(0);
});

module.exports = {
    getMenu: getMenu,
    getSingleMenuItem: getSingleMenuItem
};