'use strict'

var ejs = require("ejs");
var pdf = require("html-pdf");
var path = require("path");
var Company = require('../models/company-models');
const FILE = './pdf/Employees.pdf';

const OPTIONS = {
    "height": "11.25in",
    "width": "8.5in",
    "header": {
        "height": "20mm"
    },
    "footer": {
        "height": "20mm",
    },
};

function createReport(req, res) {
    let userId = req.params.id;

    if (userId == req.user.sub) {
        Company.findOne({ _id: userId }).exec((err, employees) => {
            if (err) {
                res.status(500).send({ message: 'General server error!' });
            } else if (employees) {
                ejs.renderFile(path.join('./template/', "report-template.ejs"), { employees: employees.employees }, (err, data) => {
                    if (err) {
                        res.status(500).send({ message: 'Error!' });
                    } else {
                        pdf.create(data, OPTIONS).toFile(FILE, function (err, data) {
                            if (err) {
                                res.status(500).send({ message: 'Error!' });
                            } else {
                                res.send({ message: 'File created successfully' });
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
    createReport
};