'use strict'

var Company = require('../models/company-models');
var Employee = require('../models/employee-model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

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
        Company.findOne({ username: params.username }, (err, userFind) => {
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
                        company.name = params.name.trim()
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
    let userId = req.params.id;
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
                    Company.findByIdAndUpdate({ _id: userId }, { username: update.username.toLowerCase(), name: update.name.trim() }, { new: true }, (err, companyUpdated) => {
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
    let userId = req.params.id;
    let params = req.body;

    if (userId != req.user.sub) {
        Company.findOne({ _id: userId }, (err, companyFind) => {
            if (err) {
                res.status(500).send({ message: 'General error!' });
            } else if (companyFind) {
                if (params.password) {
                    bcrypt.compare(params.password.trim(), companyFind.password, (err, checkPassword) => {
                        if (err) {
                            res.status(500).send({ message: 'Failed to verify password!' });
                        } else if (checkPassword) {
                            Company.findByIdAndRemove(userId, (err, companyRemoved) => {
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
            res.status(200).send({ message: 'Users found:', companies })
        } else {
            res.status(200).send({ message: 'There are no records!' })
        }
    })

}

function getCompany(req, res) {
    let userId = req.params.id;

    Company.findById(userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: 'Server error trying to search!' });
        } else if (user) {
            res.status(200).send({ message: 'Company found:', user });
        } else {
            res.status(200).send({ message: 'There are no companies!' });
        }
    })

}

function searchCompany(req, res) {
    var params = req.body;

    if (params.search) {
        Company.find({
            $or: [{ name: params.search.trim() },
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
    let userId = req.params.id;
    let params = req.body;
    let employee = new Employee();

    if (role === COMPANY) {
        if (userId == id) {
            Company.findById(userId, (err, companyFind) => {
                if (err) {
                    res.status(500).send({ message: 'Server error trying to add a course!' });
                } else if (companyFind) {
                    if (params.name && params.job && params.departament) {
                        employee.name = params.name;
                        employee.job = params.job;
                        employee.departament = params.departament;

                        Company.findByIdAndUpdate(userId, { $push: { employees: employee } }, { new: true }, (err, companyUpdated) => {
                            if (err) {
                                res.status(500).send({ message: 'General server error!' });
                            } else if (companyUpdated) {
                                res.status(200).send({ message: 'Course added!', companyUpdated })
                            } else {
                                res.status(404).send({ message: 'Course not added!' });
                            }
                        })
                    } else {
                        res.status(200).send({ message: 'Enter the minimum data to add a course!' })
                    }
                } else {
                    res.status(200).send({ message: 'Company does not exist!' });
                }
            });
        } else {
            res.status(200).send({ message: 'No puede agregar empledos a una empresa que no sea la suya!' });
        }
    } else {
        res.status(404).send({ message: 'You dont have permissions!' });
    }
}

function getEmployees(req, res) {
    let userId = req.params.id;

    if (role === COMPANY) {
        if (userId == id) {
            Company.findOne({ _id: userId }).exec((err, userCourse) => {
                if (err) {
                    res.status(500).send({ message: 'General server error!' });
                } else if (userCourse) {
                    res.status(200).send({ message: 'Courses: ', employees: userCourse.employees })
                } else {
                    res.status(404).send({ message: 'Courses not added' });
                }
            })
        } else {
            res.status(200).send({ message: 'You cannot view a course that is not yours!' });
        }
    } else {
        res.status(404).send({ message: 'You dont have permissions!' });
    }
}

function updatedEmployee(req, res) {
    let userId = req.params.idC;
    let employeeId = req.params.idE;
    let update = req.body;

    if (role === COMPANY) {
        if (userId == id) {
            if (update.name && update.job && update.departament) {
                Company.findOne({ _id: userId }, (err, userFind) => {
                    if (err) {
                        res.status(500).send({ message: 'General error!' });
                    } else if (userFind) {
                        Company.findOneAndUpdate({ _id: userId, 'employees._id': employeeId },
                            {
                                'employees.$.name': update.name,
                                'employees.$.job': update.job,
                                'employees.$.departament': update.departament,
                            }, { new: true }, (err, userUpdated) => {
                                if (err) {
                                    res.status(500).send({ message: 'General error when updating embedded document!' });
                                } else if (userUpdated) {
                                    res.status(200).send({ message: 'Updated course: ', userUpdated });
                                } else {
                                    res.status(404).send({ message: 'Contact not updated!' });
                                }
                            })
                    } else {
                        res.status(200).send({ message: 'Non-existent user!' });
                    }
                })
            } else {
                res.status(200).send({ message: 'Please enter all the required data!' });
            }
        } else {
            res.status(404).send({ message: 'You cannot updated a course that is not yours!' });
        }
    } else {
        res.status(404).send({ message: 'You dont have permissions!' });
    }
}

function deleteEmployee(req, res) {
    let userId = req.params.idC;
    let courseId = req.params.idE;

    if (role === COMPANY) {
        if (userId == id) {
            Company.findOneAndUpdate({ _id: userId, 'employees._id': courseId },
                { $pull: { employees: { _id: courseId } } }, { new: true }, (err, courseRemove) => {
                    if (err) {
                        res.status(500).send({ message: 'General error while deleting embedded document!' });
                    } else if (courseRemove) {
                        res.status(200).send({ message: 'Course removed: ', courseRemove });
                    } else {
                        res.status(404).send({ message: 'Course not found or already deleted!' });
                    }
                })
        } else {
            res.status(404).send({ message: 'You cannot deleted a course that is not yours!' });
        }
    } else {
        res.status(404).send({ message: 'You dont have permissions!' });
    }
}

/**
 * Get functions
 * VALIDAR NO BUSCAR DE OTRAS EMPRESAS
 */
function getEmployeesForId(req, res) {
    let companyId = req.params.idC;
    let employeeId = req.params.idE;

    if (role === COMPANY) {
        if (companyId == id) {
            Company.aggregate([
                { $unwind: "$employees" },
                { $match: { "employees.name": "Alberto" } },
                { $project: { _id: false, name: "$employees.name" } }

            ], (err, userCourse) => {
                if (err) {
                    res.status(500).send({ message: 'General server error!' });
                } else if (userCourse) {
                    res.status(200).send({ message: 'Courses: ', employees: userCourse.employees })
                } else {
                    res.status(404).send({ message: 'Courses not added' });
                }
            })
        } else {
            res.status(200).send({ message: 'You cannot view a course that is not yours!' });
        }
    } else {
        res.status(404).send({ message: 'You dont have permissions!' });
    }
}

function getEmployeeForName(req, res) {
    let companyId = req.params.idC;
    let employeeName = req.body.name;

    Company.findById(companyId, (err, companyFind) => {
        if (err) {
            res.status(500).send({ message: 'Server error trying to add a course!' });
        } else if (companyFind) {
            Company.aggregate([
                { $unwind: "$_id" },
                { $unwind: "$employees" },
                { $match: { "employees.name": employeeName } },
                { $project: { _id: false, name: "$employees" } }], (err, userCourse) => {
                    if (err) {
                        res.status(500).send({ message: 'General server error!' });
                    } else if (userCourse) {
                        res.status(200).send({ message: 'Emplpyees: ', employees: userCourse })
                    } else {
                        res.status(404).send({ message: 'Courses not added' });
                    }
                })
        } else {
            res.status(200).send({ message: 'Company does not exist!' });
        }
    })
}

function getEmployeeForJob(req, res) {
    let job = req.body.job;

    if (role === COMPANY) {
        if (job) {
            Company.findOne({ 'employees.job': job }).exec((err, userCourse) => {
                if (err) {
                    res.status(500).send({ message: 'General server error!' });
                } else if (userCourse) {
                    res.status(200).send({ message: 'Courses: ', employees: userCourse.employees })
                } else {
                    res.status(404).send({ message: 'Courses not added' });
                }
            })
        } else {
            res.status(200).send({ message: 'Ingrese un puesto' })
        }
    } else {
        res.status(404).send({ message: 'You dont have permissions!' });
    }
}

function getEmployeeForDepartament(req, res) {
    let departament = req.body.departament;

    if (role === COMPANY) {
        if (departament) {
            Company.findOne({ 'employees.departament': departament }).exec((err, userCourse) => {
                if (err) {
                    res.status(500).send({ message: 'General server error!' });
                } else if (userCourse) {
                    res.status(200).send({ message: 'Courses: ', employees: userCourse.employees })
                } else {
                    res.status(404).send({ message: 'Courses not added' });
                }
            })
        } else {
            res.status(200).send({ message: 'Ingrese un departamento' })
        }
    } else {
        res.status(404).send({ message: 'You dont have permissions!' });
    }
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
    getEmployeeForName,
    getEmployeeForJob,
    getEmployeeForDepartament
}