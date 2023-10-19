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

  async viewAllDepartments() {
    const results = await this.queryAsync('SELECT * FROM department');
    console.log('Departments:', results);
    return results;
}

  async viewAllRoles() {
    return await this.queryAsync('SELECT * FROM role');
  }
