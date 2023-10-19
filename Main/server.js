// Required modules
const inquirer = require('inquirer');
const SqlFunctions = require('./db/sqlFunctions');
const connect = require('./db/connections');

// Establishing connection to the database
const connection = connect();
const sqlFunctions = new SqlFunctions(connection);

// Main function to handle user interactions
async function main() {
  // Prompting the user for an action
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'View employees by Department, Role or Manager',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update a role',
        'Update employee info',  
        'Delete department',
        'Delete role',
        'Delete employee',
        'View department budget',
        'Exit'
      ]
    }
  ]);

  // Handling user's action based on their choice
  switch (answer.action) {
    case 'View all departments':
      const departments = await sqlFunctions.viewAllDepartments();
      console.log('\n');
      console.table(departments);
      console.log('\n');
      break;
      
    case 'View all roles':
      const roles = await sqlFunctions.viewAllRoles();
      console.log('\n');
      console.table(roles);
      console.log('\n');
      break;
      
    case 'View all employees':
      const employees = await sqlFunctions.viewAllEmployees();
      console.log('\n');
      console.table(employees);
      console.log('\n');
      break;

    case 'View employees by Department, Role or Manager':
      const employeesByChoice = await sqlFunctions.viewEmployeesByChoice();
      console.log('\n');
      console.table(employeesByChoice);
      console.log('\n');
      break;
      
    case 'Add a department':
      await sqlFunctions.addDepartment();
      console.log('\nAdded new department\n');
      break;
      
    case 'Add a role':
      await sqlFunctions.addRole();
      console.log('\nAdded new role\n');
      break;
      
    case 'Add an employee':
      await sqlFunctions.addEmployee();
      console.log('\nAdded new employee\n');
      break;
      
    case 'Update a role':
      await sqlFunctions.updateRole();
      console.log('\nUpdated role info\n');
      break;
      
    case 'Update employee info':
      await sqlFunctions.updateEmployeeInfo();
      console.log('\nUpdated employee info\n');
      break;
      
    case 'Delete department':
      await sqlFunctions.deleteDepartment();
      console.log('\nDeleted department\n');
      break;
      
    case 'Delete role':
      await sqlFunctions.deleteRole();
      console.log('\nDeleted role\n');
      break;
      
    case 'Delete employee':
      await sqlFunctions.deleteEmployee();
      console.log('\nDeleted employee\n');
      break;
      
    case 'View department budget':
      const budget = await sqlFunctions.viewDepartmentBudget();
      console.log(`\nThe total budget for the department is ${budget}\n`);
      break;
      
    case 'Exit':
      // Exiting the program
      process.exit(0);
      break;
      
    default:
      console.log('\nInvalid action\n');
      break;
  }

  // Looping back to the main menu for further actions
  main();
}

// Invoking main function and handling any uncaught errors
main().catch(console.error);
