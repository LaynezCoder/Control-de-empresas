'use strict'

var ejs = require("ejs");
var pdf = require("html-pdf");
var path = require("path");
var Company = require('../models/company-models');

const FILE = './pdf/';
const DATE = require('../resources/date')
const EXTENSION = '.pdf'
const EJS_EMPLOYEES = './templates/employees-report-template.ejs'
const EJS_COMPANIES = './templates/companies-report-template.ejs'

const OPTIONS = {
    'height': '11.25in',
    'width': '8.5in',
    'header': {
        'height': '20mm'
    },
    'footer': {
        'height': '20mm',
    },
};

function createReportOfEmployees(req, res) {
    let companyId = req.params.id;

    if (companyId == req.user.sub) {
        Company.findOne({ _id: companyId }).exec((err, employees) => {
            if (err) {
                res.status(500).send({ message: 'General server error!' });
            } else if (employees) {
                ejs.renderFile(path.join(EJS_EMPLOYEES), { employees: employees.employees }, (err, data) => {
                    if (err) {
                        res.status(500).send({ message: 'Error!' });
                    } else {
                        let name = FILE + employees.name + '-employees-' + DATE.getDate() + EXTENSION
                        pdf.create(data, OPTIONS).toFile(name, (err, data) => {
                            if (err) {
                                res.status(500).send({ message: 'Error!' });
                            } else if (data) {
                                res.send({ message: 'Report created at: ' + DATE.getDateAnotherFormat() })
                            }
                        });
                    }
                });
            } else {
                res.status(404).send({ message: 'Employees not added' });
            }
        })
    } else {
        res.send({ message: 'You cannot view a employees that is not yours!' });
    }
}

module.exports = {
    createReportOfEmployees
};