class SqlFunctions {
  constructor(connection) {
    this.connection = connection;
  }

  queryAsync(sql, args = []) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
// query to add a new employee
  async viewAllDepartments() {
    const results = await this.queryAsync('SELECT * FROM department');
    console.log('Departments:', results);
    return results;
}
// query to view all roles
  async viewAllRoles() {
    return await this.queryAsync('SELECT * FROM role');
  }

  // query to view all employees
  async viewAllEmployees() {
    const query = `
      SELECT e.id, e.first_name, e.last_name, r.title, d.name as department, r.salary, CONCAT(m.first_name, ' ', m.last_name) as manager
      FROM employee e
      LEFT JOIN role r ON e.role_id = r.id
      LEFT JOIN department d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id`;
    return await this.queryAsync(query);
  }
// query to add a new department
  async addDepartment(name) {
    return await this.queryAsync('INSERT INTO department SET ?', { name });
  }
// query to update an employee's manager
  async updateEmployeeManager(employeeId, managerId) {
    return await this.queryAsync('UPDATE employee SET manager_id = ? WHERE id = ?', [managerId, employeeId]);
  }
// query to view employees by manager
  async viewEmployeesByManager(managerId) {
    return await this.queryAsync('SELECT * FROM employee WHERE manager_id = ?', [managerId]);
  }
// query to view all employees by department
  async viewEmployeesByDepartment(departmentId) {
    const query = `
      SELECT e.id, e.first_name, e.last_name, r.title
      FROM employee e
      INNER JOIN role r ON e.role_id = r.id
      WHERE r.department_id = ?`;
    return await this.queryAsync(query, [departmentId]);
  }
// query to delete a department
  async deleteDepartment(id) {
    return await this.queryAsync('DELETE FROM department WHERE id = ?', [id]);
  }
// query to delete a role
  async deleteRole(id) {
    return await this.queryAsync('DELETE FROM role WHERE id = ?', [id]);
  }
// query to delete an employee
  async deleteEmployee(id) {
    return await this.queryAsync('DELETE FROM employee WHERE id = ?', [id]);
  }
  //query to view department budget
  async viewDepartmentBudget(departmentId) {
    const query = `
      SELECT SUM(r.salary) as total_budget
      FROM employee e
      INNER JOIN role r ON e.role_id = r.id
      WHERE r.department_id = ?`;
    return await this.queryAsync(query, [departmentId]);
  }
}
module.exports = SqlFunctions;