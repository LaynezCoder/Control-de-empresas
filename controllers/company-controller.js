'use strict'

var Company = require('../models/company-models');
var Employee = require('../models/employee-model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

const STRING_UTILS = require('../resources/stringUtils');
const ADMINISTRADOR = "ADMINISTRATOR";
const COMPANY = "COMPANY";

/**
 * Companies functions
 */
function createAdministrator(req, res) {
    let administrator = new Company();

    Company.findOne({ username: 'admin' }, (err, createAdmin) => {
        if (err) {
            console.log('Failed to create user!');
        } else if (createAdmin) {
            console.log('Administrator user is already created!');
            console.log('ROLE:', createAdmin.role);
        } else {
            bcrypt.hash('12345', null, null, (err, passwordHash) => {
                if (err) {
                    res.status(500).send({ message: 'Password encryption error!' })
                } else if (passwordHash) {
                    administrator.username = 'admin'
                    administrator.name = 'Administrador'
                    administrator.password = passwordHash
                    administrator.role = ADMINISTRADOR
                    administrator.save((err, userSaved) => {
                        if (err) {
                            console.log('Failed to create user!');
                        } else if (userSaved) {
                            console.log('Admin user created!');
                            console.log('ROLE:', userSaved.role);
                        } else {
                            console.log('Admin user not created!');
                        }
                    })
                }
            })
        }
    })
}

function login(req, res) {
    let params = req.body;

    if (params.username && params.password) {
        Company.findOne({ username: params.username.toLowerCase().trim() }, (err, userFind) => {
            if (err) {
                res.status(500).send({ message: 'Server error, trying to search!' })
            } else if (userFind) {
                bcrypt.compare(params.password.trim(), userFind.password, (err, checkPassword) => {
                    if (err) {
                        res.status(500).send({ message: 'General server error!' });
                    } else if (checkPassword) {
                        if (params.getToken) {
                            res.send({ token: jwt.createToken(userFind) });
                            console.log('User role logged:', userFind.role, '|', 'Username:', userFind.username, '|', 'ID:', userFind._id)
                        } else {
                            console.log('User find role:', userFind.role, '|', 'Role variable: ', userFind.role, '|', 'Username:', userFind.username, '|', 'ID:', userFind._id)
                            res.send({ message: 'User successfully logged in!' });
                        }
                    } else {
                        res.status(404).send({ message: 'Incorrect username or password!' })
                    }
                })
            } else {
                res.send({ message: 'Account not found!' })
            }
        })
    } else {
        res.status(200).send({ message: 'Please, enter all fields!' })
    }
}

function saveCompany(req, res) {
    let company = new Company();
    let params = req.body;

    if (params.name && params.password && params.username) {
        Company.findOne({ username: params.username.toLowerCase().trim() }, (err, userFind) => {
            if (err) {
                res.status(500).send({ message: 'General error', err })
            } else if (userFind) {
                res.send({ message: 'Name already used!' })
            } else {
                bcrypt.hash(params.password.trim(), null, null, (err, passwordHash) => {
                    if (err) {
                        res.status(500).send({ message: 'Password encryption error!' })
                    } else if (passwordHash) {
                        company.username = params.username.toLowerCase().trim()
                        company.password = passwordHash
                        company.name = STRING_UTILS.capitalizeInitials(params.name.trim())
                        company.role = COMPANY

                        company.save((err, companySaved) => {
                            if (err) {
                                res.status(500).send({ message: 'Failed to save data!' })
                            } else if (companySaved) {
                                res.send({ message: 'Company saved successfully' })
                            }
                        })
                    } else {
                        res.status(401).send({ message: 'Password not encrypted!' });
                    }

                })
            }
        })
    } else {
        res.send({ message: 'Please enter all the required data! ' })
    }
}

function updateCompany(req, res) {
    let companieId = req.params.id;
    let update = req.body;

    if (update.password) {
        res.status(500).send({ message: 'You cannot update the password!' });
    } else if (update.role) {
        res.status(500).send({ message: 'You cannot update the role!' });
    } else {
        if (update.name && update.username) {
            Company.findOne({ username: update.username.toLowerCase().trim() }, (err, usernameFind) => {
                if (err) {
                    res.status(500).send({ message: 'Server error!' });
                } else if (usernameFind) {
                    res.send({ message: 'Username already existing, your account cannot be updated!' });
                } else {
                    Company.findByIdAndUpdate({ _id: companieId }, { username: update.username.toLowerCase(), name: STRING_UTILS.capitalizeInitials(update.name.trim()) }, { new: true }, (err, companyUpdated) => {
                        if (err) {
                            res.status(500).send({ message: 'Server error trying to update!' });
                        } else if (companyUpdated) {
                            res.send({ message: 'Updated company!', companyUpdated });
                        } else {
                            res.send({ message: 'There are no records to update!' });
                        }
                    });
                }
            })
        } else {
            res.send({ message: 'Please enter all the required data!' })
        }
    }
}

function deleteCompany(req, res) {
    let companieId = req.params.id;
    let params = req.body;

    if (companieId != req.user.sub) {
        Company.findOne({ _id: companieId }, (err, companyFind) => {
            if (err) {
                res.status(500).send({ message: 'General error!' });
            } else if (companyFind) {
                if (params.password) {
                    bcrypt.compare(params.password.trim(), companyFind.password, (err, checkPassword) => {
                        if (err) {
                            res.status(500).send({ message: 'Failed to verify password!' });
                        } else if (checkPassword) {
                            Company.findByIdAndRemove(companieId, (err, companyRemoved) => {
                                if (err) {
                                    res.send({ message: 'Server error!' });
                                } else if (companyRemoved) {
                                    res.send({ message: 'Company removed!', companyRemoved });
                                } else {
                                    res.send({ message: 'The company does not exist, or has already been eliminated' });
                                }
                            })
                        } else {
                            res.status(403).send({ message: 'Wrong password, you cannot delete your account without your password!' });
                        }
                    })
                } else {
                    res.send({ message: 'To delete, enter your password' });
                }
            } else {
                res.status(403).send({ message: 'User not deleted!' });
            }
        })
    } else {
        res.send({ message: 'He cannot eliminate himself!' });
    }
}

function getCompanies(req, res) {
    Company.find({}).exec((err, companies) => {
        if (err) {
            res.status(500).send({ message: 'Server error trying to search!' })
        } else if (companies) {
            res.send({ message: 'Companies found:', companies })
        } else {
            res.send({ message: 'There are no records!' })
        }
    })
}

function getCompany(req, res) {
    let companieId = req.params.id;

    Company.findById(companieId).exec((err, companie) => {
        if (err) {
            res.status(500).send({ message: 'Server error trying to search!' });
        } else if (companie) {
            res.send({ message: 'Company found:', companie });
        } else {
            res.send({ message: 'There are no companies!' });
        }
    })

}

function searchCompany(req, res) {
    var params = req.body;

    if (params.search) {
        Company.find({
            $or: [{ name: STRING_UTILS.capitalizeInitials(params.search.trim()) },
            { username: params.search.toLowerCase().trim() }]
        }, (err, resultSearch) => {
            if (err) {
                res.status(500).send({ message: 'General error!' });
            } else if (resultSearch) {
                res.send({ message: 'Matches found: ', resultSearch });
            } else {
                res.status(403).send({ message: 'Search without matches!' });
            }
        })
    } else {
        res.status(403).send({ message: 'Enter data in the search field!' });
    }
}

/**
 * Employee functions
 */
function createEmployee(req, res) {
    let companieId = req.params.id;
    let params = req.body;
    let employee = new Employee();

    if (companieId == req.user.sub) {
        Company.findById(companieId, (err, companyFind) => {
            if (err) {
                res.status(500).send({ message: 'Server error trying to add a course!' });
            } else if (companyFind) {
                if (params.name && params.job && params.departament) {
                    employee.name = STRING_UTILS.capitalizeInitials(params.name.trim())
                    employee.job = STRING_UTILS.capitalizeFirstLetter(params.job.trim())
                    employee.departament = STRING_UTILS.capitalizeFirstLetter(params.departament.trim());

                    Company.findByIdAndUpdate(userId, { $push: { employees: employee } }, { new: true }, (err, companyUpdated) => {
                        if (err) {
                            res.status(500).send({ message: 'General server error!' });
                        } else if (companyUpdated) {
                            res.send({ message: 'Course added!', companyUpdated })
                        } else {
                            res.status(404).send({ message: 'Course not added!' });
                        }
                    })
                } else {
                    res.send({ message: 'Enter the minimum data to add a course!' })
                }
            } else {
                res.send({ message: 'Company does not exist!' });
            }
        });
    } else {
        res.send({ message: 'You cannot add employees to a company that is not yours!' })
    }
}

function getEmployees(req, res) {
    let companyId = req.params.id;

    if (companyId == req.user.sub) {
        Company.findOne({ _id: companyId }).exec((err, employees) => {
            if (err) {
                res.status(500).send({ message: 'General server error!' });
            } else if (employees) {
                res.send({ message: 'Employees: ', employees: employees.employees })
            } else {
                res.status(404).send({ message: 'Employees not added' });
            }
        })
    } else {
        res.send({ message: 'You cannot view a employees that is not yours!' });
    }
}

function updatedEmployee(req, res) {
    let companieId = req.params.idC;
    let employeeId = req.params.idE;
    let update = req.body;

    if (companieId == req.user.sub) {
        if (update.name && update.job && update.departament) {
            Company.findOne({ _id: companieId }, (err, companieFind) => {
                if (err) {
                    res.status(500).send({ message: 'General error!' });
                } else if (companieFind) {
                    Company.findOneAndUpdate({ _id: companieId, 'employees._id': employeeId },
                        {
                            'employees.$.name': STRING_UTILS.capitalizeInitials(update.name.trim()),
                            'employees.$.job': STRING_UTILS.capitalizeFirstLetter(update.job.trim()),
                            'employees.$.departament': STRING_UTILS.capitalizeFirstLetter(update.departament.trim()),
                        }, { new: true }, (err, employeeUpdated) => {
                            if (err) {
                                res.status(500).send({ message: 'General error when updating embedded document!' });
                            } else if (employeeUpdated) {
                                res.send({ message: 'Updated employees: ', employeeUpdated });
                            } else {
                                res.status(404).send({ message: 'Employees not updated!' });
                            }
                        })
                } else {
                    res.send({ message: 'Non-existent user!' });
                }
            })
        } else {
            res.status(200).send({ message: 'Please enter all the required data!' });
        }
    } else {
        res.status(404).send({ message: 'You cannot updated a employees that is not yours!' });
    }
}

function deleteEmployee(req, res) {
    let companieId = req.params.idC;
    let courseId = req.params.idE;

    if (companieId == req.user.sub) {
        Company.findOneAndUpdate({ _id: companieId, 'employees._id': courseId },
            { $pull: { employees: { _id: courseId } } }, { new: true }, (err, employeeRemove) => {
                if (err) {
                    res.status(500).send({ message: 'General error while deleting embedded document!' });
                } else if (employeeRemove) {
                    res.send({ message: 'Employee removed: ', employeeRemove });
                } else {
                    res.status(404).send({ message: 'Employee not found or already deleted!' });
                }
            })
    } else {
        res.status(404).send({ message: 'You cannot deleted a cemployees that is not yours!' });
    }

}

function getEmployeesForId(req, res) {
    let companyId = req.params.idC;
    let employeeId = req.params.idE;

    if (companyId == req.user.sub) {
        Company.findOne({ _id: companyId }, { employees: { $elemMatch: { _id: employeeId } } }).exec((err, employees) => {
            if (err) {
                res.status(500).send({ message: 'General server error!' });
            } else if (employees) {
                res.send({ message: 'Employees:', employee: employees.employees })
            } else {
                res.status(404).send({ message: 'Employees not added' });
            }
        })
    } else {
        res.send({ message: 'You cannot view a employees that is not yours!' });
    }
}

function searchEmployee(req, res) {
    let companyId = req.user.sub;
    let search = req.body.search;
    let username = req.user.username;

    Company.aggregate([
        { $match: { username: username } },
        { $unwind: '$employees' },
        {
            $match: {
                $or: [{ 'employees.name': STRING_UTILS.capitalizeInitials(search) },
                { 'employees.departament': STRING_UTILS.capitalizeFirstLetter(search) },
                { 'employees.job': STRING_UTILS.capitalizeFirstLetter(search) }]
            }
        },
        {
            $group: {
                _id: companyId,
                employees: { $push: '$employees' }
            }
        }
    ], (err, employee) => {
        if (err) {
            res.status(500).send({ message: 'General server error!' });
        } else if (employee) {
            res.send({ Result: employee })
        } else {
            res.status(404).send({ message: 'Employees not added' });
        }
    })
}

function getCount(req, res) {
    let companyId = req.user.sub;
    let username = req.user.username;

    Company.aggregate([
        { $match: { username: username } },
        { $unwind: '$employees' },
        { $group: { _id: '$_id', 'sum': { $sum: 1 } } },
        { $group: { _id: companyId, total: { '$sum': '$sum' } } }
    ]).exec((err, count) => {
        if (err) {
            res.status(500).send({ message: 'General server error!' });
        } else if (count) {
            res.send({ Result: count })
        } else {
            res.status(404).send({ message: 'Employees not added' });
        }
    })
}


module.exports = {
    /**
     * Company exports
     */
    createAdministrator,
    login,
    /**
     * Administrator only exports
     */
    updateCompany,
    saveCompany,
    deleteCompany,
    getCompanies,
    getCompany,
    searchCompany,
    /**
     * Employee exports
     */
    createEmployee,
    getEmployees,
    updatedEmployee,
    deleteEmployee,
    /**
     * Get employees
     */
    getEmployeesForId,
    searchEmployee,
    getCount
}