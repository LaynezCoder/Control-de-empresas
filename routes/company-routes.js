'use strict'

const express = require('express');
const companyController = require('../controllers/company-controller');
const api = express.Router();

api.post('/login', companyController.login);
api.post('/saveCompany', companyController.saveCompany);

module.exports = api;