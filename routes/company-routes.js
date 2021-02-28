'use strict'

const MD_AUTH = require('../middlewares/authentication');
const COMPANY_CONTROLLER = require('../controllers/company-controller');
const PDF = require('../pdf/pdf-report');
const EXCEL = require('../excel/excel-report');

var express = require('express');
var api = express.Router();

/**
 * Companies routes
 */
api.post('/login', COMPANY_CONTROLLER.login);

/**
 * Administrator only
 */
api.post('/saveCompany', [MD_AUTH.ensureAuth, MD_AUTH.ensureAuthAdministrator], COMPANY_CONTROLLER.saveCompany);
api.put('/updateCompany/:id', [MD_AUTH.ensureAuth, MD_AUTH.ensureAuthAdministrator], COMPANY_CONTROLLER.updateCompany);
api.delete('/deleteCompany/:id', [MD_AUTH.ensureAuth, MD_AUTH.ensureAuthAdministrator], COMPANY_CONTROLLER.deleteCompany);
api.get('/getCompanies', [MD_AUTH.ensureAuth, MD_AUTH.ensureAuthAdministrator], COMPANY_CONTROLLER.getCompanies);
api.post('/getCompany/:id', [MD_AUTH.ensureAuth, MD_AUTH.ensureAuthAdministrator], COMPANY_CONTROLLER.getCompany);
api.post('/searchCompany', [MD_AUTH.ensureAuth, MD_AUTH.ensureAuthAdministrator], COMPANY_CONTROLLER.searchCompany);

/**
 * Employees routes
 */
api.put('/:id/createEmployee', [MD_AUTH.ensureAuth, MD_AUTH.ensureAuthCompany], COMPANY_CONTROLLER.createEmployee);
api.get('/:id/getEmployees', [MD_AUTH.ensureAuth, MD_AUTH.ensureAuthCompany], COMPANY_CONTROLLER.getEmployees);
api.put('/:idC/updateEmployee/:idE', [MD_AUTH.ensureAuth, MD_AUTH.ensureAuthCompany], COMPANY_CONTROLLER.updatedEmployee);
api.put('/:idC/deleteEmployee/:idE', [MD_AUTH.ensureAuth, MD_AUTH.ensureAuthCompany], COMPANY_CONTROLLER.deleteEmployee);
api.get('/:idC/getEmployeeForId/:idE', [MD_AUTH.ensureAuth, MD_AUTH.ensureAuthCompany], COMPANY_CONTROLLER.getEmployeesForId);

/**
 * Reports of employees
 */
api.get('/createEmployeePDF/:id', [MD_AUTH.ensureAuth, MD_AUTH.ensureAuthCompany], PDF.createReportOfEmployees);
api.get('/createEmployeeXLSX/:id', [MD_AUTH.ensureAuth, MD_AUTH.ensureAuthCompany], EXCEL.createReportOfEmployees);

/**
 * Reports of companies
 */
api.get('/createCompaniesPDF', [MD_AUTH.ensureAuth, MD_AUTH.ensureAuthAdministrator], PDF.createReportOfCompanies);
api.get('/createCompaniesXLSX', [MD_AUTH.ensureAuth, MD_AUTH.ensureAuthAdministrator], EXCEL.createReportOfCompanies);

/**
 * Employees find

api.get('/:idC/getEmployeeForName', COMPANY_CONTROLLER.getEmployeeForName);
api.get('/getEmployeeForJob', COMPANY_CONTROLLER.getEmployeeForJob);
api.get('/getEmployeeForDepartament', COMPANY_CONTROLLER.getEmployeeForDepartament);
 */

module.exports = api;