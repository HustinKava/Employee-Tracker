const mysql = require('mysql');
const inquirer = require('inquirer');
const password = require('./password');
// const consoleTable = require('console.table')

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    // Your password should be located in password.js file to maintain privacy. I have added mine to gitignore :)
    password: `${password}`,
    database: 'employee_trackerDB',
});

const mainMenu = () => {
    inquirer
        .prompt({
            name: 'first',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'View All Employees by Roles', 'Add Employee', 'Add Department', 'Add Role', 'Update Employee Role', 'Update Employee Manager'],
        })
        .then((answer) => {
            // based on their answer a function will execute
            if (answer.first === 'View All Employees') {
                viewEmployees();
            } else if (answer.first === 'View All Employees By Department') {
                viewEmployeesByDepartment();
            } else if (answer.first === 'View All Employees By Manager') {
                viewEmployeesByManager();
            } else if (answer.first === 'View All Employees by Roles') {
                viewEmployeesByRoles();
            } else if (answer.first === 'Add Employee') {
                addEmployee();
            } else if (answer.first === 'Add Department') {
                addDepartment();
            } else if (answer.first === 'Add Role') {
                addRole();
            } else if (answer.first === 'Update Employee Role') {
                updateEmployeeRole();
            } else if (answer.first === 'Update Employee Manager') {
                updateEmployeeManager();
            } else {
                connection.end();
            }
        });
};

const viewEmployees = () => {
    connection.query(
        `
        SELECT employee.id, employee.first_name, employee.last_name, title, name AS department, salary, CONCAT(m.first_name," ",m.last_name) AS manager 
        FROM employee 
        LEFT JOIN roles ON employee.roles_id = roles.id 
        LEFT JOIN department ON roles.department_id = department.id 
        LEFT JOIN employee m ON m.id = employee.manager_id
        `,
        (err, results) => {
            if (err) throw err;
            console.table(results)
            mainMenu();
        });
};

let departmentChoices = []

const viewEmployeesByDepartment = () => {
    connection.query(
        `
        SELECT name 
        FROM department
        `,
        (err, results) => {
            if (err) throw err;

            for (let i = 0; i < results.length; i++) {
                departmentChoices.push(results[i].name);
            }
            inquirer
                .prompt({
                    name: 'viewDepartment',
                    type: 'list',
                    message: 'Which department would you like to view?',
                    choices: departmentChoices
                })
                .then((answer) => {
                    connection.query(
                        `
                        SELECT employee.id, employee.first_name, employee.last_name, title, salary, CONCAT(m.first_name," ",m.last_name) AS manager 
                        FROM employee 
                        LEFT JOIN roles ON employee.roles_id = roles.id 
                        LEFT JOIN employee m ON m.id = employee.manager_id 
                        INNER JOIN department ON roles.department_id = department.id WHERE department.name = '${answer.viewDepartment}'
                        `,
                        (err, results) => {
                            if (err) throw err;
                            console.table(results);
                            mainMenu()
                        })
                })

        })
};

let managerChoices = [];

const viewEmployeesByManager = () => {
    connection.query(
        `
        SELECT employee.roles_id, CONCAT(employee.first_name," ",employee.last_name) AS manager  
        FROM employee WHERE employee.manager_id IS NULL
        `,
        (err, results) => {
            if (err) throw err;
            // console.log(results);
            for (let i = 0; i < results.length; i++) {

                let manager = { name: results[i].manager }
                managerChoices.push(manager);

            }
            inquirer
                .prompt({
                    name: 'viewManager',
                    type: 'list',
                    message: 'Which managers employees would you like to view?',
                    choices: managerChoices
                })
                .then((answer) => {

                    connection.query(
                        `
                        SELECT e.id, e.first_name, e.last_name, title, name AS department, salary
                        FROM employee e
                        LEFT JOIN roles ON e.roles_id = roles.id
                        LEFT JOIN department ON roles.department_id = department.id
                        INNER JOIN employee m ON CONCAT(m.first_name," ",m.last_name) = '${answer.viewManager}'
                        WHERE e.manager_id = m.roles_id
                        `,
                        (err, results) => {
                            if (err) throw err;
                            console.table(results);
                            mainMenu()
                        })
                })
        })
};

let rolesChoices = []

const viewEmployeesByRoles = () => {
    connection.query(
        `
        SELECT title
        FROM roles
        `,
        (err, results) => {
            if (err) throw err;

            for (let i = 0; i < results.length; i++) {
                rolesChoices.push(results[i].title);
            }
            inquirer
                .prompt({
                    name: 'viewRoles',
                    type: 'list',
                    message: 'Which role would you like to view?',
                    choices: rolesChoices
                })
                .then((answer) => {
                    connection.query(
                        `
                        SELECT employee.id, employee.first_name, employee.last_name, name AS department, salary
                        FROM roles
                        LEFT JOIN department ON roles.department_id = department.id
                        INNER JOIN employee ON roles_id = roles.id
                        WHERE roles.title = '${answer.viewRoles}'
                        `,
                        (err, results) => {
                            if (err) throw err;
                            console.table(results);
                            mainMenu()
                        })
                })

        })
};

let newEmpRole = [];
let newEmpManager = [];

const addEmployee = () => {
    connection.query(
        `
        SELECT id, title
        FROM roles
        `,
        (err, roles) => {
            if (err) throw err;

            for (let i = 0; i < roles.length; i++) {
                newEmpRole.push(roles[i].title);
            }
            connection.query(
                `
                SELECT employee.id, employee.roles_id, CONCAT(employee.first_name," ",employee.last_name) AS manager  
                FROM employee WHERE employee.manager_id IS NULL
                `,
                (err, manager) => {
                    if (err) throw err;
                    // console.log(results);
                    for (let i = 0; i < manager.length; i++) {

                        let newEmpMan = { name: manager[i].manager }
                        newEmpManager.push(newEmpMan);
                    }

                    // Option to select no manager
                    newEmpManager.unshift('No Manager');

                    inquirer
                        .prompt([{
                            name: 'firstName',
                            type: 'input',
                            message: 'What is your new employees first name?',
                            validate: (value) => {
                                if (value) {
                                    return true;
                                } else {
                                    return 'You need to enter their first name';
                                }
                            }
                        }, {
                            name: 'lastName',
                            type: 'input',
                            message: 'What is your new employees last name?',
                            validate: (value) => {
                                if (value) {
                                    return true;
                                } else {
                                    return 'You need to enter their last name';
                                }
                            }
                        }, {
                            name: 'selectRole',
                            type: 'list',
                            message: 'Please select your employees role',
                            choices: newEmpRole
                        }, {
                            name: 'selectManager',
                            type: 'list',
                            message: 'Who is your new employees manager?',
                            choices: newEmpManager
                        }])
                        .then((answer) => {

                            // Set variable for IDs
                            let roleID;
                            // Default Manager value as null
                            let managerID = null;

                            // Getting the role.id
                            for (i = 0; i < roles.length; i++) {
                                if (answer.selectRole == roles[i].title) {
                                    roleID = roles[i].id;
                                    // console.log(`role id is ${roleID}`)
                                }
                            }

                            // getting the manager_id
                            for (i = 0; i < manager.length; i++) {
                                if (answer.selectManager == manager[i].manager) {
                                    managerID = manager[i].id;
                                    // console.log(`manager id is ${managerID}`)
                                }
                            }

                            connection.query(
                                'INSERT INTO employee SET ?', {
                                    first_name: answer.firstName,
                                    last_name: answer.lastName,
                                    roles_id: roleID,
                                    manager_id: managerID
                                },
                                (err, res) => {
                                    if (err) return err;

                                    console.log(`\n The new employee named ${answer.firstName} ${answer.lastName} has been added \n`)
                                    mainMenu();
                                }
                            )

                        })
                })

        })

};

const addDepartment = () => {
    inquirer
        .prompt({
            name: 'departmentName',
            type: 'input',
            message: 'What is the name of the new department?',
            validate: (value) => {
                if (value) {
                    return true;
                } else {
                    return 'You need to enter the department name';
                }
            }
        })
        .then((answer) => {
            connection.query(
                'INSERT INTO department SET ?', {
                    name: answer.departmentName
                },
                (err, res) => {
                    if (err) return err;

                    console.log(`\n The new department named ${answer.departmentName} has been added \n`)
                    mainMenu();
                }
            )
        })
};


// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    // run the mainMenu function after the connection is made to prompt the user
    mainMenu();
});

// chalk/kolor