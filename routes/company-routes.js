'use strict'

const express = require('express');
const companyController = require('../controllers/company-controller');
const api = express.Router();
var mdAuth = require('../middlewares/authentication');

/**
 * Companies routes
 */

api.post('/login', companyController.login);

/**
 * Administrator only
 */
api.post('/saveCompany', [mdAuth.ensureAuth, mdAuth.ensureAuthAdministrator], companyController.saveCompany);
api.put('/updateCompany/:id', companyController.updateCompany);
api.delete('/deleteCompany/:id', companyController.deleteCompany);
api.get('/getCompanies', companyController.getCompanies);
api.post('/getCompany/:id', companyController.getCompany);

/**
 * Employees routes
 */
api.put('/:id/createEmployee', companyController.createEmployee);
api.get('/:id/getEmployees', companyController.getEmployees);
api.put('/:idC/updateEmployee/:idE', companyController.updatedEmployee);
api.put('/:idC/deleteEmployee/:idE', companyController.deleteEmployee);

/**
 * Employees find
 */
api.get('/:idC/getEmployeeForId/:idE', companyController.getEmployeesForId);
api.get('/:idC/getEmployeeForName', companyController.getEmployeeForName);
api.get('/getEmployeeForJob', companyController.getEmployeeForJob);
api.get('/getEmployeeForDepartament', companyController.getEmployeeForDepartament);

module.exports = api;