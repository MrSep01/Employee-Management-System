-- Delete existing data to start fresh
DELETE FROM employee;
DELETE FROM role;
DELETE FROM department;

-- Reset auto increment values for primary keys
ALTER TABLE employee AUTO_INCREMENT = 1;
ALTER TABLE role AUTO_INCREMENT = 1;
ALTER TABLE department AUTO_INCREMENT = 1;

-- Insert initial data for department table
INSERT INTO department (name) VALUES ('Engineering');
INSERT INTO department (name) VALUES ('Human Resources');
INSERT INTO department (name) VALUES ('Finance');
INSERT INTO department (name) VALUES ('Marketing');

-- Insert initial data for role table
INSERT INTO role (title, salary, department_id) VALUES ('Software Engineer', 90000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Mechanical Engineer', 85000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('HR Manager', 75000, 2);
INSERT INTO role (title, salary, department_id) VALUES ('Recruiter', 60000, 2);
INSERT INTO role (title, salary, department_id) VALUES ('Finance Manager', 80000, 3);
INSERT INTO role (title, salary, department_id) VALUES ('Accountant', 65000, 3);
INSERT INTO role (title, salary, department_id) VALUES ('Marketing Manager', 70000, 4);
INSERT INTO role (title, salary, department_id) VALUES ('SEO Specialist', 70000, 4);

-- Insert initial data for employee table
-- Note: manager_id is set to NULL for the first employee, assuming they are the top manager
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Doe', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Emily', 'Smith', 3, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Robert', 'Johnson', 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Michael', 'Brown', 5, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Sarah', 'Williams', 6, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('David', 'Jones', 7, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Laura', 'Garcia', 8, 7);
