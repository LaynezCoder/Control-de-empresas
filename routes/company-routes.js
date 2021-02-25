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
api.put('/updateCompany/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdministrator], COMPANY_CONTROLLER.updateCompany);
api.delete('/deleteCompany/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdministrator], COMPANY_CONTROLLER.deleteCompany);
api.get('/getCompanies', [mdAuth.ensureAuth, mdAuth.ensureAuthAdministrator], COMPANY_CONTROLLER.getCompanies);
api.post('/getCompany/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdministrator], COMPANY_CONTROLLER.getCompany);
api.post('/searchCompany', [mdAuth.ensureAuth, mdAuth.ensureAuthAdministrator], COMPANY_CONTROLLER.searchCompany);

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