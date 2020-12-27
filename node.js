const mysql = require('mysql');
const inquirer = require('inquirer');
const password = require('./password');
const consoleTable = require('console.table')

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: `${password}`,
    database: 'employee_trackerDB',
});

// const start = () => {
//     connection.query('SELECT * FROM employee', (err, results) => {
//         if (err) throw err;
//         console.table(results)
//     });
// }

const start = () => {
    inquirer
        .prompt({
            name: 'first',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Update Employee Role', 'Update Employee Manager'],
        })
        .then((answer) => {
            // based on their answer a function will execute
            if (answer.first === 'View All Employees') {
                viewEmployees();
            } else if (answer.first === 'View All Employees By Department') {
                viewEmployeesByDepartment();
            } else if (answer.first === 'View All Employees By Manager') {
                viewEmployeesByManager();
            } else if (answer.first === 'Add Employee') {
                addEmployee();
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
        'SELECT employee.id, first_name, last_name, title, name AS department, salary, CONCAT(first_name," ",last_name) AS manager FROM employee LEFT JOIN employee ON employee.id = employee.manager_id LEFT JOIN roles ON employee.roles_id = roles.id LEFT JOIN department ON roles.department_id = department.id', (err, results) => {
            if (err) throw err;
            console.table(results)
            start();
        });

};


// CONCAT(m.first_name," ", m.last_name) AS manager
// LEFT JOIN m.id = e.manager_id 
//  INNER JOIN department ON roles.depart_id = department.id


// SELECT * FROM department;
// SELECT * FROM roles;
// SELECT * FROM employee;

// SELECT first_name, last_name, roles_id, manager_id
// FROM employee
// INNER JOIN roles ON employee.manager_id = employee.id;












// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

// manager id as manager (rename a key)
// queries will do the heavy lifting

// look up joining multiple tables in mysql
// look up console.table
// look up concat with mysql

// manager /column
// Sandra William