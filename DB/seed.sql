-- Departments
INSERT into department (name) VALUES ("Finance & Accounting");
INSERT into department (name) VALUES ("Human Resources");
INSERT into department (name) VALUES ("Contracts");
INSERT into department (name) VALUES ("Purchasing");
INSERT into department (name) VALUES ("Planning");
INSERT into department (name) VALUES ("IT");

-- Managers
INSERT into roles (title, salary, department_id) VALUES ("Finance Manager", 127990, 1);
INSERT into roles (title, salary, department_id) VALUES ("Human Resources Manager", 73248, 2);
INSERT into roles (title, salary, department_id) VALUES ("Contracts Manager", 95865, 3);
INSERT into roles (title, salary, department_id) VALUES ("Purchasing Manager", 98783, 4);
INSERT into roles (title, salary, department_id) VALUES ("Planning Manager", 82078, 5);
INSERT into roles (title, salary, department_id) VALUES ("IT Manager", 96785, 6);

-- Finance
INSERT into roles (title, salary, department_id) VALUES ("Accountant", 77317, 1);
INSERT into roles (title, salary, department_id) VALUES ("Payroll", 52000, 1);
INSERT into roles (title, salary, department_id) VALUES ("Data Entry", 35571, 1);

-- Human Resources
INSERT into roles (title, salary, department_id) VALUES ("Administrator", 42421, 2);
INSERT into roles (title, salary, department_id) VALUES ("Coordinator", 32355, 2);

-- Contracts
INSERT into roles (title, salary, department_id) VALUES ("Contracts Clerk", 43217, 3);

-- Purchasing
INSERT into roles (title, salary, department_id) VALUES ("Purchasing", 52068, 4);
INSERT into roles (title, salary, department_id) VALUES ("Purchasing Clerk", 35824, 4);

-- Planning 
INSERT into roles (title, salary, department_id) VALUES ("Civil Engineer", 66710, 5);
INSERT into roles (title, salary, department_id) VALUES ("Electrical Engineer", 63662, 5);
INSERT into roles (title, salary, department_id) VALUES ("Mechanical Engineer", 65927, 5);

-- IT
INSERT into roles (title, salary, department_id) VALUES ("Programming Engineer", 85241, 6);
INSERT into roles (title, salary, department_id) VALUES ("Service Desk", 42027, 6);
INSERT into roles (title, salary, department_id) VALUES ("Network Administrator", 74592, 6);
INSERT into roles (title, salary, department_id) VALUES ("Cyber Security", 87371, 6);


-- Manager Names
INSERT into employee (first_name, last_name, roles_id, manager_id) VALUES ("Sandra", "Williams", 1, NULL);
INSERT into employee (first_name, last_name, roles_id, manager_id) VALUES ("Elena", "Mushyan", 2, NULL);
INSERT into employee (first_name, last_name, roles_id, manager_id) VALUES ("Lia", "Kirchner", 3, NULL);
INSERT into employee (first_name, last_name, roles_id, manager_id) VALUES ("Lorraine", "Wray", 4, NULL);
INSERT into employee (first_name, last_name, roles_id, manager_id) VALUES ("Nikephoros", "Labriola", 5, NULL);
INSERT into employee (first_name, last_name, roles_id, manager_id) VALUES ("Olaug", "McFee", 6, NULL);

-- Finance Names
INSERT into employee (first_name, last_name, roles_id, manager_id) VALUES ("Bess", "Cobb", 7, 1);
INSERT into employee (first_name, last_name, roles_id, manager_id) VALUES ("Davis", "Niles", 8, 1);
INSERT into employee (first_name, last_name, roles_id, manager_id) VALUES ("Hiba", "Abbey", 9, 1);

-- Human Resources Names
INSERT into employee (first_name, last_name, roles_id, manager_id) VALUES ("Disha", "Albertson", 10, 2);
INSERT into employee (first_name, last_name, roles_id, manager_id) VALUES ("Ashanti", "Maes", 11, 2);

-- Contracts Names
INSERT into employee (first_name, last_name, roles_id, manager_id) VALUES ("Abdülhamit", " Abano", 12, 3);

-- Purchasing Names
INSERT into employee (first_name, last_name, roles_id, manager_id) VALUES ("Shanon", "Vogel", 13, 4);
INSERT into employee (first_name, last_name, roles_id, manager_id) VALUES ("Shprintze", "Albert", 14, 4);

-- Planning Names
INSERT into employee (first_name, last_name, roles_id, manager_id) VALUES ("Brita", "Firmin", 15, 5);
INSERT into employee (first_name, last_name, roles_id, manager_id) VALUES ("Kaety", "Terzic", 16, 5);
INSERT into employee (first_name, last_name, roles_id, manager_id) VALUES ("Gugulethu", "Jarrett", 17, 5);

-- IT Names
INSERT into employee (first_name, last_name, roles_id, manager_id) VALUES ("Carpus", "Kumar", 18, 6);
INSERT into employee (first_name, last_name, roles_id, manager_id) VALUES ("Þórunn", "Zientek", 19, 6);
INSERT into employee (first_name, last_name, roles_id, manager_id) VALUES ("Dagmar", "Jusić", 20, 6);
INSERT into employee (first_name, last_name, roles_id, manager_id) VALUES ("Tage", "Arbeid", 21, 6);

SELECT * FROM department;
SELECT * FROM roles;
SELECT * FROM employee;

-- SELECT first_name, last_name, roles_id, manager_id
-- FROM employee
-- INNER JOIN roles ON employee.manager_id = employee.id;