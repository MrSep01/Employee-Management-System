const inquirer = require('inquirer');

// Define SqlFunctions class to encapsulate SQL operations
class SqlFunctions {
  // Constructor initializes connection property
  constructor(connection) {
    this.connection = connection;
  }

  // Method to execute SQL queries asynchronously
  queryAsync(sql, args = []) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  // Method to fetch all records from the department table
  async viewAllDepartments() {
    return await this.queryAsync('SELECT * FROM department');
  }

  // Method to fetch all roles along with their respective departments
  async viewAllRoles() {
    const query = `
      SELECT r.id as 'Role ID', r.title as 'Title', d.name as 'Department', r.salary as 'Salary'
      FROM role r
      INNER JOIN department d ON r.department_id = d.id
      ORDER BY r.id ASC`;
    return await this.queryAsync(query);
  }
  // Method to fetch all employees along with their roles, departments, and managers
  async viewAllEmployees() {
    const query = `
      SELECT e.id, e.first_name, e.last_name, r.title, d.name as department, r.salary, CONCAT(m.first_name, ' ', m.last_name) as manager
      FROM employee e
      LEFT JOIN role r ON e.role_id = r.id
      LEFT JOIN department d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id`;
    return await this.queryAsync(query);
  }

  // Helper method to fetch choices for inquirer prompts
  async getChoices(query, nameProp, valueProp) {
    const items = await this.queryAsync(query);
    return items.map(item => ({ name: item[nameProp], value: item[valueProp] }));
  }

  // Method to view employees by Manager, Department, or Role

  async getChoices(query, nameProp, valueProp) {
    const items = await this.queryAsync(query);
    return items.map(item => ({ name: item[nameProp], value: item[valueProp] }));
  }

  async viewEmployeesByChoice() {
    const { choiceType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choiceType',
        message: 'View employees by:',
        choices: ['Manager', 'Department', 'Role']
      }
    ]);

    let query;
    let nameProp;
    let valueProp;
    let message;

    switch (choiceType) {
      case 'Manager':
        query = 'SELECT id, CONCAT(first_name, " ", last_name) as name FROM employee WHERE manager_id IS NOT NULL';
        nameProp = 'name';
        valueProp = 'id';
        message = 'Select a manager:';
        break;
      case 'Department':
        query = 'SELECT id, name FROM department';
        nameProp = 'name';
        valueProp = 'id';
        message = 'Select a department:';
        break;
      case 'Role':
        query = 'SELECT id, title as name FROM role';
        nameProp = 'name';
        valueProp = 'id';
        message = 'Select a role:';
        break;
    }

    const choices = await this.getChoices(query, nameProp, valueProp);
    const { selectedId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedId',
        message,
        choices
      }
    ]);

    let employeeQuery;
    switch (choiceType) {
      case 'Manager':
        employeeQuery = `
          SELECT e.id, e.first_name, e.last_name, r.title as role, d.name as department
          FROM employee e
          LEFT JOIN role r ON e.role_id = r.id
          LEFT JOIN department d ON r.department_id = d.id
          WHERE e.manager_id = ?`;
        break;
      case 'Department':
        employeeQuery = `
          SELECT e.id, e.first_name, e.last_name, r.title as role
          FROM employee e
          INNER JOIN role r ON e.role_id = r.id
          WHERE r.department_id = ?`;
        break;
      case 'Role':
        employeeQuery = `
          SELECT e.id, e.first_name, e.last_name, d.name as department
          FROM employee e
          INNER JOIN role r ON e.role_id = r.id
          LEFT JOIN department d ON r.department_id = d.id
          WHERE e.role_id = ?`;
        break;
    }

    // Perform the query to get the employees based on the selectedId and choiceType
    const employees = await this.queryAsync(employeeQuery, [selectedId]);

    // Return the result to be used with console.table
    return employees;
}
// Method to add a new department
  async addDepartment() {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the new department?'
      }
    ]);
    const existingDepartment = await this.queryAsync('SELECT * FROM department WHERE name = ?', [name]);
    if (existingDepartment.length > 0) {
      console.log('A department with this name already exists. Choose a different name.');
      return;
    }
    return await this.queryAsync('INSERT INTO department SET ?', { name });
  }

  // Method to add a new role
  async addRole() {
    // Fetch the available departments from the database
    const departments = await this.queryAsync('SELECT id, name FROM department');
  
    // Format the departments for inquirer choices
    const departmentChoices = departments.map(dept => ({ name: dept.name, value: dept.id }));
  
    // Prompt the user
    const { roleName, departmentId, salary } = await inquirer.prompt([
      {
        type: 'input',
        name: 'roleName',
        message: 'Enter the name of the new role:',
        validate: input => !!input.trim() || "Role name cannot be empty",
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Select the department for this role:',
        choices: departmentChoices,
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary for this role:',
        validate: input => !isNaN(input) && parseFloat(input) > 0 || "Salary must be a positive number",
      },
    ]);
  
    // Check for existing role
    const existingRole = await this.queryAsync('SELECT * FROM role WHERE title = ?', [roleName]);
    
    if (existingRole.length > 0) {
      console.log('A role with this name already exists. Choose a different name.');
      return;
    }
  
    // Insert the new role into the database
    return await this.queryAsync('INSERT INTO role SET ?', {
      title: roleName,
      department_id: departmentId,
      salary: salary,
    });
  }
  
// Method to add a new employee
async addEmployee() {
  // Fetch the available roles and managers from the database
  const roles = await this.queryAsync('SELECT id, title FROM role');
  const managers = await this.queryAsync('SELECT id, CONCAT(first_name, " ", last_name) as name FROM employee WHERE manager_id IS NOT NULL');

  // Format the roles and managers for inquirer choices
  const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));
  const managerChoices = managers.map(manager => ({ name: manager.name, value: manager.id }));
  managerChoices.unshift({ name: 'None', value: null });  // Adds an option for no manager

  // Prompt the user
  const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: "Enter the employee's first name:",
      validate: input => !!input.trim() || "First name cannot be empty",
    },
    {
      type: 'input',
      name: 'lastName',
      message: "Enter the employee's last name:",
      validate: input => !!input.trim() || "Last name cannot be empty",
    },
    {
      type: 'list',
      name: 'roleId',
      message: "Select the employee's role:",
      choices: roleChoices,
    },
    {
      type: 'list',
      name: 'managerId',
      message: "Select the employee's manager:",
      choices: managerChoices,
    },
  ]);

  // Insert the new employee into the database
  return await this.queryAsync('INSERT INTO employee SET ?', {
    first_name: firstName,
    last_name: lastName,
    role_id: roleId,
    manager_id: managerId,
  });
}

// Method to update a role
async updateRole() {
  // Fetching roles and departments from the database
  const roles = await this.queryAsync('SELECT id, title FROM role');
  const departments = await this.queryAsync('SELECT id, name FROM department');

  // Formatting for inquirer choices
  const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));
  const departmentChoices = departments.map(dept => ({ name: dept.name, value: dept.id }));

  // Updating prompts to use 'list' type
  const { roleId, newRoleName, newDepartmentId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'roleId',
      message: 'Select the role you want to update:',
      choices: roleChoices,
    },
    {
      type: 'input',
      name: 'newRoleName',
      message: 'Enter the new name for this role (leave blank if unchanged):',
    },
    {
      type: 'list',
      name: 'newDepartmentId',
      message: 'Select the new department for this role:',
      choices: departmentChoices,
    },
  ]);  // Ensure this line ends with a semicolon

  // Validate the salary input
  let newSalary;
  while (true) {
    const { salaryInput } = await inquirer.prompt([
      {
        type: 'input',
        name: 'salaryInput',
        message: 'Enter the new salary for this role (leave blank if unchanged):',
      },
    ]);

    if (salaryInput === '' || !isNaN(parseFloat(salaryInput)) && isFinite(salaryInput)) {
      newSalary = salaryInput;
      break;
    } else {
      console.log('Please enter a valid number for the salary.');
    }
  }

  const updates = {};  // This line should no longer cause a syntax error

  if (newRoleName) updates.title = newRoleName;
  if (newDepartmentId) updates.department_id = newDepartmentId;
  if (newSalary) updates.salary = parseFloat(newSalary);

  return await this.queryAsync('UPDATE role SET ? WHERE id = ?', [updates, roleId]);
}

// Method to update employee info
async updateEmployeeInfo() {
  // Fetch lists of employees, roles, and managers from the database
  const employees = await this.queryAsync('SELECT id, CONCAT(first_name, " ", last_name) as name FROM employee');
  const roles = await this.queryAsync('SELECT id, title FROM role');
  const managers = await this.queryAsync('SELECT id, CONCAT(first_name, " ", last_name) as name FROM employee WHERE manager_id IS NOT NULL');

  // Format the fetched data for inquirer choices
  const employeeChoices = employees.map(employee => ({ name: employee.name, value: employee.id }));
  const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));
  const managerChoices = managers.map(manager => ({ name: manager.name, value: manager.id }));
  managerChoices.unshift({ name: 'None', value: null });  // Adds an option for no manager

  // Prompt the user to select an employee and the type of information to update
  const { employeeId, updateType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employeeId',
      message: "Select an employee:",
      choices: employeeChoices,
    },
    {
      type: 'list',
      name: 'updateType',
      message: "What information would you like to update?",
      choices: ['Role', 'Manager'],
    },
  ]);

  // Based on the selected update type, prompt the user for the new value and update the database
  switch (updateType) {
    case 'Role': {
      const { roleId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'roleId',
          message: "Select the employee's new role:",
          choices: roleChoices,
        },
      ]);
      return await this.queryAsync('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId]);
    }
    case 'Manager': {
      const { managerId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'managerId',
          message: "Select the employee's new manager:",
          choices: managerChoices,
        },
      ]);
      return await this.queryAsync('UPDATE employee SET manager_id = ? WHERE id = ?', [managerId, employeeId]);
    }
  }
}
// Method to delete a department
async deleteDepartment() {
  const departments = await this.queryAsync('SELECT id, name FROM department');
  const departmentChoices = departments.map(dept => ({ name: dept.name, value: dept.id }));

  const { departmentId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'departmentId',
      message: 'Select the department to delete:',
      choices: departmentChoices,
    }
  ]);

  return await this.queryAsync('DELETE FROM department WHERE id = ?', [departmentId]);
}
// Method to delete a role
async deleteRole() {
  const roles = await this.queryAsync('SELECT id, title FROM role');
  const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

  const { roleId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'roleId',
      message: 'Select the role to delete:',
      choices: roleChoices,
    }
  ]);

  return await this.queryAsync('DELETE FROM role WHERE id = ?', [roleId]);
}
// Method to delete an employee
async deleteEmployee() {
  const employees = await this.queryAsync('SELECT id, CONCAT(first_name, " ", last_name) as name FROM employee');
  const employeeChoices = employees.map(emp => ({ name: emp.name, value: emp.id }));

  const { employeeId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employeeId',
      message: 'Select the employee to delete:',
      choices: employeeChoices,
    }
  ]);

  return await this.queryAsync('DELETE FROM employee WHERE id = ?', [employeeId]);
}

// Method to view department budget
async viewDepartmentBudget() {
  // Fetch departments and prepare choices
  const departments = await this.viewAllDepartments();
  const departmentChoices = departments.map(dept => ({ name: dept.name, value: dept.id }));

  // Prompt the user to select a department
  const { budgetDeptId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'budgetDeptId',
      message: 'Select the department to view its budget:',
      choices: departmentChoices
    }
  ]);

  // Query the budget for the selected department
  const query = `
    SELECT SUM(r.salary) as total_budget
    FROM employee e
    INNER JOIN role r ON e.role_id = r.id
    WHERE r.department_id = ?`;
  const budget = await this.queryAsync(query, [budgetDeptId]);
  
  return budget[0].total_budget;
}


}  // This closing brace should be here to close the SqlFunctions class definition.

module.exports = SqlFunctions;
