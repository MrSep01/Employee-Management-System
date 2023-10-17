const inquirer = require('inquirer');
const figlet = require("figlet");
const SqlFunctions = require('./db/sqlFunctions');
const connect = require('./db/connections');  // Import the connect function from connections.js

const connection = connect();  // Get the connection object using the connect function