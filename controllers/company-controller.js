'use strict'

const Company = require('../models/company-models');
const bcrypt = require('bcrypt-nodejs');

const ADMINISTRADOR = "ADMINISTRATOR";
const COMPANY = "COMPANY";

let role;

function createAdministrator(req, res) {
    let administrator = new Company();

    Company.findOne({ username: 'admin' }, (err, createAdmin) => {
        if (err) {
            console.log('Failed to create user!');
        } else if (createAdmin) {
            console.log('Administrator user is already created!');
            role = ADMINISTRADOR;
            console.log('INITIAL ROL:', role);
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
                            role = ADMINISTRADOR;
                            console.log('Admin user created!');
                            console.log('ROLE:', role);
                        } else {
                            console.log('Admin user not created!');
                        }
                    })
                }
            })
        }
    })
}

function saveCompany(req, res) {
    let company = new Company();
    let params = req.body;

    if (role === ADMINISTRADOR) {
        if (params.name && params.password && params.username) {
            Company.findOne({ name: params.name }, (err, userFind) => {
                if (err) {
                    res.status(500).send({ message: 'Error general', err })
                } else if (userFind) {
                    res.status(200).send({ message: 'Nombre ya utilizado' })
                } else {
                    bcrypt.hash(params.password, null, null, (err, passwordHash) => {
                        if (err) {
                            res.status(500).send({ message: 'Error en la encriptación de la contraseña' })
                        } else if (passwordHash) {
                            company.username = params.username
                            company.password = passwordHash
                            company.name = params.name
                            company.role = COMPANY
                            company.save((err, userSaved) => {
                                if (err) {
                                    res.status(500).send({ message: 'Error al guardar los datos' })
                                } else if (userSaved) {
                                    res.status(200).send({ message: 'Compania guardado exitosamente' })
                                }
                            })
                        }

                    })
                }
            })
        } else {
            res.status(200).send({ message: 'Por favor ingresa todos los datos obligatorios' })
        }
    } else {
        res.status(500).send({ message: 'No tienes permisos agregar empresas!' })
    }
}

function login(req, res) {
    let params = req.body;

    if (params.username && params.password) {
        Company.findOne({ username: params.username }, (err, userFind) => {
            if (err) {
                res.status(500).send({ message: 'Server error, trying to search!' })
            } else if (userFind) {
                bcrypt.compare(params.password, userFind.password, (err, checkPassword) => {
                    if (err) {
                        res.status(500).send({ message: 'General server error!' });
                    } else if (checkPassword) {
                        if (userFind.role === ADMINISTRADOR) {
                            role = ADMINISTRADOR
                        } else {
                            role = COMPANY
                        }
                        console.log('User find role:', userFind.role, '-', 'Role variable: ', role)
                        res.status(200).send({ message: 'User successfully logged in!' });
                    } else {
                        res.status(404).send({ message: 'Incorrect username or password!' })
                    }
                })
            } else {
                res.status(200).send({ message: 'Account not found!' })
            }
        })
    } else {
        res.status(200).send({ message: 'Please, enter all fields!' })
    }
}

module.exports = {
    createAdministrator,
    saveCompany,
    login
}