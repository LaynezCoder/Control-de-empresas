'use strict'

var excel = require('exceljs');

var Company = require('../models/company-models');

const NAME_WORKSHEET = 'Employees';
const FILE = './excel/';
const EXTENSION = '.xlsx'
const DATE = require('../resources/date')

function createReportOfEmployees(req, res) {
    let companyId = req.params.id;

    if (companyId == req.user.sub) {
        Company.findOne({ _id: companyId }).exec((err, employees) => {
            if (err) {
                res.status(500).send({ message: 'General server error!' });
            } else if (employees) {
                var workbook = new excel.Workbook();
                var worksheet = workbook.addWorksheet(NAME_WORKSHEET);

                worksheet.columns = [
                    { header: 'Id', key: '_id', width: 30 },
                    { header: 'Name', key: 'name', width: 30 },
                    { header: 'Job', key: 'job', width: 30 },
                    { header: 'Departament', key: 'departament', width: 30 }
                ];

                worksheet.getRow(1).font = { bold: true }
                worksheet.getRow(1).alignment = { horizontal: 'center' }

                const columns = ['A', 'B', 'C', 'D']
                columns.forEach((c) => {
                    worksheet.getColumn(c).alignment = { horizontal: 'center' }
                })

                worksheet.addRows(employees.employees);

                let name = FILE + employees.name + '-employees-' + DATE.getDate() + EXTENSION
                workbook.xlsx.writeFile(name)
                    .then(() => {
                        res.send({ message: 'Report created at: ' + DATE.getDateAnotherFormat() })
                    })

            } else {
                res.status(404).send({ message: 'Employees not found!' });
            }
        })
    } else {
        res.send({ message: 'You cannot view a employees that is not yours!' });
    }
}

module.exports = {
    createReportOfEmployees
}