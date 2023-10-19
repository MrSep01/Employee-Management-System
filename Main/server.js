const inquirer = require('inquirer');
const SqlFunctions = require('./db/sqlFunctions');
const connect = require('./db/connections');  // Import the connect function from connections.js

const connection = connect();  // Get the connection object using the connect function

const sqlFunctions = new SqlFunctions(connection);


async function main() {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Update employee manager',
        'View employees by manager',
        'View employees by department',
        'Delete a department',
        'View department budget',
        'Exit'
      ]
    }
  ]);
