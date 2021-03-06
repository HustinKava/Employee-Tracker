// Require variables
const mysql = require('mysql');
const inquirer = require('inquirer');
const password = require('./password');
const consoleTable = require('console.table');
const logo = require('asciiart-logo');
const chalk = require('chalk');

// Global variables to store values
let departmentChoices = [];
let managerChoices = [];
let rolesChoices = [];
let deptBudgetNames = [];
let deptBudgetTotal = 0;
let newEmpRole = [];
let newEmpManager = [];
let deptNames = [];
let employeeNames = [];
let employeeRoles = [];
let empNames = [];
let empManagers = [];
let deleteNames = [];
let deleteRoles = [];
let deleteDepartments = [];

// Setting up mysql connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_trackerDB',
});

// Connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    start();
});

// Created a greeting for when the application is started
const start = () => {
    console.log(
        logo({
            name: 'Employee Tracker',
            font: 'Big Money-nw',
            lineChars: 25,
            padding: 2,
            margin: 3,
            borderColor: 'green',
            logoColor: 'bold-white',
            textColor: 'green',
        })
        .emptyLine()
        .right("https://github.com/HustinKava")
        .render()
    );
    mainMenu();
};

// The main menu function is the base for this application where the user will be able to select what they want to do
const mainMenu = () => {
    console.log(chalk.green('Main Menu'))
    inquirer
        .prompt({
            name: 'first',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'View All Employees by Roles', 'View Department Budgets', 'Add Employee', 'Add Department', 'Add Role', 'Update Employee Role', 'Update Employee Manager', 'Delete Employee', 'Delete Role', 'Delete Department', 'Exit'],
        })
        .then((answer) => {
            // Based on user answer a function will execute
            if (answer.first === 'View All Employees') {
                viewEmployees();
            } else if (answer.first === 'View All Employees By Department') {
                viewEmployeesByDepartment();
            } else if (answer.first === 'View All Employees By Manager') {
                viewEmployeesByManager();
            } else if (answer.first === 'View All Employees by Roles') {
                viewEmployeesByRoles();
            } else if (answer.first === 'View Department Budgets') {
                viewDepartmentBudget();
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
            } else if (answer.first === 'Delete Employee') {
                deleteEmployee();
            } else if (answer.first === 'Delete Role') {
                deleteRole();
            } else if (answer.first === 'Delete Department') {
                deleteDepartment();
            } else if (answer.first === 'Exit') {
                connection.end();
            }
        });
};

// View all employees by id, first name, last name, title, department, salary and manager name if applicable 
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
            console.log(chalk.green(`\n You are currently viewing all employees \n`))
            console.table(results)
            mainMenu();
        });
};

// View all employees based on department the user selects. This will show the employee id, first name, last name, title, salary and manager
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
                            console.log(chalk.green(`\n You are currently viewing all employees based on department that has been selected \n`))
                            console.table(results);
                            mainMenu()
                        })
                })

        })
};

// View all employees by manager selectect. This will show the employee id, first name, last name, title, department and salary
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
                            console.log(chalk.green(`\n You are currently viewing all employees based on the manager that has been selected \n`))
                            console.table(results);
                            mainMenu()
                        })
                })
        })
};

// This will show all employees for the role that has been selected. The table will show employee id, first name, last name, department and salary
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
                            console.log(chalk.green(`\n You are currently viewing all employees based on the role that has been selected \n`))
                            console.table(results);
                            mainMenu()
                        })
                })

        })
};

// This will show all department names which the user can then select and show the total budget for
const viewDepartmentBudget = () => {
    connection.query(
        `
        SELECT name
        FROM department
        `,
        (err, department) => {
            if (err) throw err;

            for (let i = 0; i < department.length; i++) {
                deptBudgetNames.push(department[i].name);

            }
            inquirer
                .prompt({
                    name: 'viewDeptNames',
                    type: 'list',
                    message: 'Which department would you like to view the total allocated budget for?',
                    choices: deptBudgetNames
                })
                .then((answer) => {

                    connection.query(
                        `
                        SELECT salary
                        FROM department
                        LEFT JOIN roles ON department.id = department_id
                        WHERE department.name = '${answer.viewDeptNames}'
                        `,
                        (err, salary) => {
                            if (err) throw err;

                            let totalDeptBudget = [];

                            for (let i = 0; i < salary.length; i++) {
                                deptBudgetTotal += (salary[i].salary)
                            }

                            department = {
                                Department: answer.viewDeptNames,
                                Budget: deptBudgetTotal
                            }

                            totalDeptBudget.push(department)

                            console.log(chalk.green(`\n You are currently viewing the total allocated budget for the department that has been selected \n`))
                            console.table(totalDeptBudget);
                            mainMenu()
                        })
                })
        })
};

// This will allow a user to add a new employee. User can enter the first name, last name, role and manager name if applicable
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

                                    console.log(chalk.green(`\n The new employee named ${answer.firstName} ${answer.lastName} has been added \n`))
                                    mainMenu();
                                }
                            )

                        })
                })

        })

};

// This will allow the user to create a new department
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

                    console.log(chalk.green(`\n The new department named ${answer.departmentName} has been added \n`))
                    mainMenu();
                }
            )
        })
};

// This will allow the user to create a new role, provide a salary for the position and choose which department the role belongs to
const addRole = () => {
    connection.query(
        `
        SELECT id, name
        FROM department
        `,
        (err, department) => {
            if (err) throw err;

            for (let i = 0; i < department.length; i++) {
                deptNames.push(department[i].name);
            }
            // console.log(deptNames)

            inquirer
                .prompt([{
                        name: 'roleName',
                        type: 'input',
                        message: 'What is the name of the role?',
                        validate: (value) => {
                            if (value) {
                                return true;
                            } else {
                                return 'You need to enter name of the role';
                            }
                        }
                    },
                    {
                        name: 'salary',
                        type: 'number',
                        message: 'Please enter the expected salary for this role',
                        validate: (value) => {
                            if (isNaN(value)) {
                                return 'You need to enter a valid salary number';
                            } else {
                                return true;
                            }
                        }
                    },
                    {
                        name: 'deptName',
                        type: 'list',
                        message: 'Please select the correct department to place this role in',
                        choices: deptNames
                    }
                ])
                .then((answer) => {

                    let deptID;

                    for (let i = 0; i < department.length; i++) {
                        if (answer.deptName == department[i].name) {
                            deptID = department[i].id
                        }
                    }

                    // console.log(deptID)

                    connection.query(
                        'INSERT INTO roles SET ?', {
                            title: answer.roleName,
                            salary: answer.salary,
                            department_id: deptID
                        },
                        (err, res) => {
                            if (err) return err;

                            console.log(chalk.green(`\n The new role named ${answer.roleName} has been added \n`))
                            mainMenu();
                        }
                    )

                })
        })
};

// This will allow the user to change an employees current role
const updateEmployeeRole = () => {
    connection.query(
        `
        SELECT id, CONCAT(first_name,' ',last_name) AS employee
        FROM employee
        `,
        (err, names) => {
            if (err) throw err;

            for (let i = 0; i < names.length; i++) {
                employeeNames.push(names[i].employee);
            }
            connection.query(
                `
                SELECT id, title  
                FROM roles
                `,
                (err, roles) => {
                    if (err) throw err;
                    // console.log(results);
                    for (let i = 0; i < roles.length; i++) {
                        employeeRoles.push(roles[i].title);
                    }
                    inquirer
                        .prompt([{
                            name: 'employeeName',
                            type: 'list',
                            message: 'Which employee name would you like to change the role for?',
                            choices: employeeNames
                        }, {
                            name: 'employeeRole',
                            type: 'list',
                            message: 'Please select the new role for your selected employee',
                            choices: employeeRoles
                        }])
                        .then((answer) => {

                            // console.log(employeeNames)
                            // console.log(employeeRoles)

                            // Set variable for IDs
                            let roleID;
                            // Default Manager value as null
                            let employeeID;

                            // Getting the employee.id
                            for (i = 0; i < names.length; i++) {
                                if (answer.employeeName == names[i].employee) {
                                    employeeID = names[i].id;
                                    // console.log(`employee id is ${employeeID}`)
                                }
                            }

                            // getting the roles.id
                            for (i = 0; i < roles.length; i++) {
                                if (answer.employeeRole == roles[i].title) {
                                    roleID = roles[i].id;
                                    // console.log(`role id is ${roleID}`)
                                }
                            }

                            connection.query(
                                'UPDATE employee SET ? WHERE ?', [{
                                        roles_id: roleID,
                                    },
                                    {
                                        id: employeeID,
                                    },
                                ],
                                (err, res) => {
                                    if (err) return err;

                                    console.log(chalk.green(`\n The employee named ${answer.employeeName}, has had their role updated to the tile of: ${answer.employeeRole} \n`))
                                    mainMenu();
                                }
                            )

                        })
                })

        })

};

// This will allow the user to change an employees existing manager to a different one
const updateEmployeeManager = () => {
    connection.query(
        `
        SELECT id, CONCAT(first_name,' ',last_name) AS employees
        FROM employee
        WHERE employee.manager_id IS NOT NULL;
        `,
        (err, names) => {
            if (err) throw err;

            for (let i = 0; i < names.length; i++) {
                empNames.push(names[i].employees);
            }
            connection.query(
                `
                SELECT id, CONCAT(first_name,' ',last_name) AS managers
                FROM employee
                WHERE employee.manager_id IS NULL;
                `,
                (err, manager) => {
                    if (err) throw err;
                    // console.log(results);
                    for (let i = 0; i < manager.length; i++) {
                        empManagers.push(manager[i].managers);
                    }
                    inquirer
                        .prompt([{
                            name: 'empName',
                            type: 'list',
                            message: 'Which employee name would you like to change the manager for?',
                            choices: empNames
                        }, {
                            name: 'empManager',
                            type: 'list',
                            message: 'Please select the new manager for your selected employee',
                            choices: empManagers
                        }])
                        .then((answer) => {

                            // console.log(empNames)
                            // console.log(empManagers)

                            // Set variable for IDs
                            let empID;
                            // Set variable for Manager IDs
                            let manID;

                            // Getting the employee.id
                            for (i = 0; i < names.length; i++) {
                                if (answer.empName == names[i].employees) {
                                    empID = names[i].id;
                                    // console.log(`employee id is ${empID}`)
                                }
                            }

                            // getting the roles.id
                            for (i = 0; i < manager.length; i++) {
                                if (answer.empManager == manager[i].managers) {
                                    manID = manager[i].id;
                                    // console.log(`manager id is ${manID}`)
                                }
                            }

                            connection.query(
                                'UPDATE employee SET ? WHERE ?', [{
                                        manager_id: manID,
                                    },
                                    {
                                        id: empID,
                                    },
                                ],
                                (err, res) => {
                                    if (err) return err;

                                    console.log(chalk.green(`\n The employee named ${answer.empName}, has had their manager changed to: ${answer.empManager} \n`))
                                    mainMenu();
                                }
                            )

                        })
                })

        })

};

// This will allow the user to delete an employee
const deleteEmployee = () => {
    connection.query(
        `
        SELECT id, CONCAT(first_name,' ',last_name) AS employees
        FROM employee
        `,
        (err, names) => {
            if (err) throw err;

            for (let i = 0; i < names.length; i++) {
                deleteNames.push(names[i].employees);
            }
            inquirer
                .prompt(
                    [{
                        name: 'delName',
                        type: 'list',
                        message: 'Select the employee name of who you wish to terminate',
                        choices: deleteNames
                    }, {
                        name: 'areYouSure',
                        type: 'list',
                        message: 'Are you sure you want to terminate this employee?',
                        choices: ['Yes', 'No']
                    }]
                )
                .then((answer) => {

                    if (answer.areYouSure === 'Yes') {

                        let employeeID;

                        for (let i = 0; i < names.length; i++) {
                            if (answer.delName === names[i].employees) {
                                employeeID = names[i].id;
                            }
                        }

                        // console.log(employeeID)

                        connection.query(
                            `DELETE FROM employee WHERE id = '${employeeID}'`,
                            (err, res) => {
                                if (err) return err;

                                console.log(chalk.green(`\n The employee named ${answer.delName} has been terminated! \n`))
                                mainMenu();
                            })
                    } else {

                        console.log(chalk.green(`\n The employee named ${answer.delName} has not been terminated \n`))
                        mainMenu();
                    }
                })
        })
};

// This will allow the user to delete an existing role
const deleteRole = () => {
    connection.query(
        `
        SELECT id, title
        FROM roles
        `,
        (err, roles) => {
            if (err) throw err;

            for (let i = 0; i < roles.length; i++) {
                deleteRoles.push(roles[i].title);
            }
            inquirer
                .prompt(
                    [{
                        name: 'delRole',
                        type: 'list',
                        message: 'Select the role that you wish to delete',
                        choices: deleteRoles
                    }, {
                        name: 'areYouSure',
                        type: 'list',
                        message: 'Are you sure you want to delete this role? All employees with this role will also be removed',
                        choices: ['Yes', 'No']
                    }]
                )
                .then((answer) => {

                    if (answer.areYouSure === 'Yes') {

                        let roleID;

                        for (let i = 0; i < roles.length; i++) {
                            if (answer.delRole === roles[i].title) {
                                roleID = roles[i].id;
                            }
                        }

                        // console.log(roleID)

                        connection.query(
                            `DELETE FROM roles WHERE id = '${roleID}'`,
                            (err, res) => {
                                if (err) return err;

                                console.log(chalk.green(`\n The role named ${answer.delRole} has been terminated! \n`))
                                mainMenu();
                            })
                    } else {

                        console.log(chalk.green(`\n The role named ${answer.delRole} has not been terminated \n`))
                        mainMenu();
                    }
                })
        })
};

// This will allow the user to delete an existing department
const deleteDepartment = () => {
    connection.query(
        `
        SELECT id, name AS department
        FROM department
        `,
        (err, departments) => {
            if (err) throw err;

            for (let i = 0; i < departments.length; i++) {
                deleteDepartments.push(departments[i].department);
            }
            inquirer
                .prompt(
                    [{
                        name: 'delDepartment',
                        type: 'list',
                        message: 'Select the department that you wish to delete',
                        choices: deleteDepartments
                    }, {
                        name: 'areYouSure',
                        type: 'list',
                        message: 'Are you sure you want to delete this department? All employees and roles associated with this department will also be removed',
                        choices: ['Yes', 'No']
                    }]
                )
                .then((answer) => {

                    if (answer.areYouSure === 'Yes') {

                        let deptID;

                        for (let i = 0; i < departments.length; i++) {
                            if (answer.delDepartment === departments[i].department) {
                                deptID = departments[i].id;
                            }
                        }

                        connection.query(
                            `DELETE FROM department WHERE id = '${deptID}'`,
                            (err, res) => {
                                if (err) return err;

                                console.log(chalk.green(`\n The department named ${answer.delDepartment} has been terminated! \n`))
                                mainMenu();
                            })
                    } else {

                        console.log(chalk.green(`\n The department named ${answer.delDepartment} has not been terminated \n`))
                        mainMenu();
                    }
                })
        })
};