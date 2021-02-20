'use strict'

const express = require('express');
const companyController = require('../controllers/company-controller');
const api = express.Router();

api.post('/login', companyController.login);
api.post('/saveCompany', companyController.saveCompany);
api.put('/updateCompany/:id', companyController.updateCompany);
api.delete('/deleteCompany/:id', companyController.deleteCompany);
api.get('/getCompanies', companyController.getCompanies);
api.post('/getCompany/:id', companyController.getCompany);

module.exports = api;