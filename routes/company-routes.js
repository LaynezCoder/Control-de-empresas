'use strict'

const COMPANY_CONTROLLER = require('../controllers/company-controller');
var express = require('express');
var api = express.Router();
var mdAuth = require('../middlewares/authentication');

/**
 * Companies routes
 */

api.post('/login', COMPANY_CONTROLLER.login);

/**
 * Administrator only
 */
api.post('/saveCompany', [mdAuth.ensureAuth, mdAuth.ensureAuthAdministrator], COMPANY_CONTROLLER.saveCompany);
api.put('/updateCompany/:id', COMPANY_CONTROLLER.updateCompany);
api.delete('/deleteCompany/:id', COMPANY_CONTROLLER.deleteCompany);
api.get('/getCompanies', COMPANY_CONTROLLER.getCompanies);
api.post('/getCompany/:id', COMPANY_CONTROLLER.getCompany);

/**
 * Employees routes
 */
api.put('/:id/createEmployee', COMPANY_CONTROLLER.createEmployee);
api.get('/:id/getEmployees', COMPANY_CONTROLLER.getEmployees);
api.put('/:idC/updateEmployee/:idE', COMPANY_CONTROLLER.updatedEmployee);
api.put('/:idC/deleteEmployee/:idE', COMPANY_CONTROLLER.deleteEmployee);

/**
 * Employees find
 */
api.get('/:idC/getEmployeeForId/:idE', COMPANY_CONTROLLER.getEmployeesForId);
api.get('/:idC/getEmployeeForName', COMPANY_CONTROLLER.getEmployeeForName);
api.get('/getEmployeeForJob', COMPANY_CONTROLLER.getEmployeeForJob);
api.get('/getEmployeeForDepartament', COMPANY_CONTROLLER.getEmployeeForDepartament);

module.exports = api;