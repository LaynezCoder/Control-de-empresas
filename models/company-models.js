'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var companySchema = Schema({
    name: String,
    username: String,
    password: String,
    role: String,
    employees: [{
        name: String,
        job: String,
        departament: String
    }]
});

module.exports = mongoose.model('company', companySchema);