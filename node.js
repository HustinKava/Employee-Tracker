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
            mainMenu();
        });
};

let departmentChoices = []
    // console.log(choicesTest)

const viewEmployeesByDepartment = () => {
    connection.query(
        'SELECT name FROM department', (err, results) => {
            if (err) throw err;
            // console.log(results);
            // console.table(results)

            for (let i = 0; i < results.length; i++) {
                departmentChoices.push(results[i].name);
                // console.log(choicesTest)
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
                        `SELECT employee.id, employee.first_name, employee.last_name, title, salary, CONCAT(m.first_name," ",m.last_name) AS manager 
                        FROM employee 
                        LEFT JOIN roles ON employee.roles_id = roles.id 
                        LEFT JOIN employee m ON m.id = employee.manager_id 
                        INNER JOIN department ON roles.department_id = department.id WHERE department.name = '${answer.viewDepartment}'`,
                        (err, results) => {
                            if (err) throw err;
                            console.table(results);
                            // console.log(answer)
                            mainMenu()
                        })
                })

        })
}

let managerChoices = [];

const viewEmployeesByManager = () => {
    connection.query(
        `SELECT employee.roles_id, CONCAT(employee.first_name," ",employee.last_name) AS manager  
        FROM employee WHERE employee.manager_id IS NULL`,
        (err, results) => {
            if (err) throw err;
            // console.log(results);
            for (let i = 0; i < results.length; i++) {

                let manager = { name: results[i].manager, roles_id: results[i].roles_id }
                    // managerChoices.push(results[i].manager);
                managerChoices.push(manager);
                // console.log(managerChoices)
                // console.log(manager)
            }
            inquirer
                .prompt({
                    name: 'viewManager',
                    type: 'list',
                    message: 'Which managers employees would you like to view?',
                    choices: managerChoices
                })
                .then((answer) => {

                    console.log(managerChoices)

                    connection.query(
                        `SELECT employee.first_name 
                        FROM employee 
                        LEFT JOIN roles ON employee.manager_id = manager_id 
                        WHERE roles_id = '${answer.viewManager}'
                        `,
                        (err, results) => {
                            if (err) throw err;
                            console.table(results);
                            console.log(answer)
                        })
                })
        })
}

// INNER JOIN department ON roles.department_id = department.id
// WHERE e.manager_id = $ { managerChoices }

// give all employees based on manger_id
// show employees depending on manager id
// roles_id = manager_id
// answer will give manager name, 
// INNER JOIN employee m ON m.manager_id = m.roles_id WHERE m.roles_id = '${answer.roles_id}''



// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    // run the mainMenu function after the connection is made to prompt the user
    mainMenu();
});

// chalk/kolor