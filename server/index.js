const express = require("express");
const app = express();
const cors = require("cors");
const database = require("./database");

// Middleware
app.use(express.json());
app.use(cors());

//ROUTES//
var router = express.Router();





app.listen(5000, () => {
    console.log("Server running on port 5000");
});