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
        'SELECT employee.id, employee.first_name, employee.last_name, title, name AS department, salary, CONCAT(m.first_name," ",m.last_name) AS manager FROM employee LEFT JOIN roles ON employee.roles_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee m ON m.id = employee.manager_id', (err, results) => {
            if (err) throw err;
            console.table(results)
            start();
        });
};

let choicesTest = []
    // console.log(choicesTest)

const viewEmployeesByDepartment = () => {
    connection.query(
        'SELECT name FROM department', (err, results) => {
            if (err) throw err;
            // console.log(results);
            else {
                // console.table(results)

                for (let i = 0; i < results.length; i++) {
                    choicesTest.push(results[i].name);
                    // console.log(choicesTest)
                }
                inquirer
                    .prompt({
                        name: 'viewDepartment',
                        type: 'list',
                        message: 'Which department would you like to view?',
                        choices: choicesTest
                    })
            }
        })
}

// const viewEmployeesByDepartment = () => {
//     inquirer
//         .prompt({
//             name: 'viewDepartment',
//             type: 'list',
//             message: 'Which department would you like to view?',
//             choices: ['Finance & Accounting', 'Human Resources', 'Contracts', 'Purchasing', 'Planning', 'IT'],
//         })
//         .then((answer) => {
//             // based on their answer a function will execute
//             if (answer.viewDepartment === 'Finance & Accounting') {
//                 // console.log('-----------------------------------Finance & Accounting-----------------------------------')
//                 connection.query(
//                     'SELECT employee.id, employee.first_name, employee.last_name, title, salary, CONCAT(m.first_name," ",m.last_name) AS manager FROM employee LEFT JOIN roles ON employee.roles_id = roles.id LEFT JOIN employee m ON m.id = employee.manager_id INNER JOIN department ON roles.department_id = department.id WHERE department.id = 1', (err, results) => {
//                         if (err) throw err;
//                         console.table(results)
//                         start();
//                     });
//             } else if (answer.viewDepartment === 'Human Resources') {
//                 connection.query(
//                     'SELECT employee.id, employee.first_name, employee.last_name, title, salary, CONCAT(m.first_name," ",m.last_name) AS manager FROM employee LEFT JOIN roles ON employee.roles_id = roles.id LEFT JOIN employee m ON m.id = employee.manager_id INNER JOIN department ON roles.department_id = department.id WHERE department.id = 2', (err, results) => {
//                         if (err) throw err;
//                         console.table(results)
//                         start();
//                     });
//             } else if (answer.viewDepartment === 'Contracts') {
//                 connection.query(
//                     'SELECT employee.id, employee.first_name, employee.last_name, title, salary, CONCAT(m.first_name," ",m.last_name) AS manager FROM employee LEFT JOIN roles ON employee.roles_id = roles.id LEFT JOIN employee m ON m.id = employee.manager_id INNER JOIN department ON roles.department_id = department.id WHERE department.id = 3', (err, results) => {
//                         if (err) throw err;
//                         console.table(results)
//                         start();
//                     });
//             } else if (answer.viewDepartment === 'Purchasing') {
//                 connection.query(
//                     'SELECT employee.id, employee.first_name, employee.last_name, title, salary, CONCAT(m.first_name," ",m.last_name) AS manager FROM employee LEFT JOIN roles ON employee.roles_id = roles.id LEFT JOIN employee m ON m.id = employee.manager_id INNER JOIN department ON roles.department_id = department.id WHERE department.id = 4', (err, results) => {
//                         if (err) throw err;
//                         console.table(results)
//                         start();
//                     });
//             } else if (answer.viewDepartment === 'Planning') {
//                 connection.query(
//                     'SELECT employee.id, employee.first_name, employee.last_name, title, salary, CONCAT(m.first_name," ",m.last_name) AS manager FROM employee LEFT JOIN roles ON employee.roles_id = roles.id LEFT JOIN employee m ON m.id = employee.manager_id INNER JOIN department ON roles.department_id = department.id WHERE department.id = 5', (err, results) => {
//                         if (err) throw err;
//                         console.table(results)
//                         start();
//                     });
//             } else if (answer.viewDepartment === 'IT') {
//                 connection.query(
//                     'SELECT employee.id, employee.first_name, employee.last_name, title, salary, CONCAT(m.first_name," ",m.last_name) AS manager FROM employee LEFT JOIN roles ON employee.roles_id = roles.id LEFT JOIN employee m ON m.id = employee.manager_id INNER JOIN department ON roles.department_id = department.id WHERE department.id = 6', (err, results) => {
//                         if (err) throw err;
//                         console.table(results)
//                         start();
//                     });
//             } else {
//                 connection.end();
//             }
//         });
// }








// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});