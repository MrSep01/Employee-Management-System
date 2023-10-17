// Import the mysql2 library to interact with MySQL databases
const mysql = require('mysql2');

// Load environment variables from the .env file using the dotenv library
require('dotenv').config();

// Define a function to establish a connection to the database
function connect() {
  // Create a new connection using the environment variables for the database credentials
  const connection = mysql.createConnection({
    host: '127.0.0.1',  // Database host address
    user: process.env.DB_USER,  // Database username from environment variables
    password: process.env.DB_PASSWORD,  // Database password from environment variables
    database: process.env.DB_NAME  // Database name from environment variables
  });

  // Attempt to establish a connection to the database, and log an error if one occurs
  connection.connect((err) => {
    if (err) throw err;  // Throw an error if the connection fails
    console.log('Connected to the database.');  // Log success message on successful connection
  });

  // Return the database connection object to be used in other parts of the application
  return connection;
}

// Export the connect function to be imported and used in other files
module.exports = connect;

