# Employee Management System

## Introduction 📚

The Employee Management System is a robust and interactive application designed to streamline the management of employee data within an organization. This application offers a user-friendly command line interface to view, add, update, and delete employee-related information, encapsulating the essential aspects of effective data management and organization hierarchy.

## Project Overview 🌐

The core objective of this project is to provide a simplified, yet comprehensive, interface for managing various aspects of employee data, departments, roles, and budgets within a designated database structure.

### Objectives 🎯

- Interactive CLI interface facilitating ease of navigation and data manipulation.
- Efficient data retrieval and modification for departments, roles, and employees.
- Real-time budget analysis for different departments.
- Structured database schema ensuring data integrity and consistency.

## SQL Classes Defined 🧩

The project incorporates a class `SqlFunctions` to encapsulate the SQL operations required for interacting with the database. This class provides methods to execute a variety of SQL queries to manage and retrieve data.

## Development Process 💻

### Step 1: Requirement Analysis

Identify the requirements for data management, such as:

- Data attributes for employees, roles, and departments.
- Necessary operations like viewing, adding, updating, and deleting records.

### Step 2: Database Design

Designing the database schema to accommodate the data structures for employees, roles, and departments while ensuring referential integrity.

### Step 3: Coding the Solution

Key components developed:

- **`main`:** The main function to handle user interactions through a series of prompts.
- **`SqlFunctions`:** A class to encapsulate SQL operations and provide asynchronous query execution.

### Step 4: Testing & Debugging

Ensure all functionality works as expected, and the database interactions are handled gracefully.

## Code Breakdown 🧠

### Main Function: `main`

- **User Input:** Utilizes `inquirer` to prompt the user for actions and inputs.
- **Action Handling:** Based on user's action, relevant methods of `SqlFunctions` class are invoked to execute corresponding database operations.

### SQL Functions Class: `SqlFunctions`

- **Asynchronous Query Execution:** Provides a method `queryAsync` for executing SQL queries asynchronously.
- **Data Management Methods:** Includes a variety of methods to handle CRUD (Create, Read, Update, Delete) operations for departments, roles, and employees.



## How to Use the Project 🖥️

1. Ensure that `node.js` and MySQL are installed on your machine.
2. Clone the repository or download the source code.
3. Open your terminal and navigate to the project directory.
4. Once inside the project directory, navigate to the `Main` directory.
5. Install the necessary npm modules by executing the command `npm install`.
6. make sure you have a .enf file with the following format. Please make sure to update your password to match the mysql password.

DB_NAME='employeeDB'
DB_USER='root'
DB_PASSWORD='Your MySql password'

7. Navigate to the `db` directory, which contains the `schema.sql` and `seeds.sql` files.
8. Launch MySQL by entering the following command in your terminal: 

 `

   mysql -u root -p


9. When prompted, enter your MySQL password.
10. Once logged into MySQL, execute the following commands to set up the database and seed it with initial data:


source schema.sql;

source seeds.sql;

11. Quit and navigate back to the Main directory 
12. Run the application by executing the command:
 
 npm start

13. Follow the prompts to interact with the employee management system.


## Repository

[GitHub Repository Link](https://github.com/MrSep01/Employee-Management-System)

## Demo

Watch the app demo:
[Demo Video](https://youtu.be/bklq9ilMzMc)

## Conclusion 🏁

The Employee Management System is a compact and intuitive solution for managing essential organizational data. The CLI interface coupled with structured database interactions makes data management efficient and straightforward.

## License & Contribution 📜

This project is open for contributions and is licensed under the MIT License.

## Contact 📞

For any inquiries, feel free to contact at sep.alamouti@sepalamouti.com
