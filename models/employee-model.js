'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var employeeSchema = Schema({
    name: String,
    job: String,
    departament: String
});

module.exports = mongoose.model('employee', employeeSchema);