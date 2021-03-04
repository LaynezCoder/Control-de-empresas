'use strict'

var excel = require('exceljs');

var Company = require('../models/company-models');

const WORKSHEET_EMPLOYEES = 'Employees';
const WORKSHEET_COMPANIES = 'Employees';
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
                var worksheet = workbook.addWorksheet(WORKSHEET_EMPLOYEES);

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
                    }).catch(err => { res.status(500).send({ message: 'Error creating report!' }) })
            } else {
                res.status(404).send({ message: 'Employees not found!' });
            }
        })
    } else {
        res.send({ message: 'You cannot view a employees that is not yours!' });
    }
}

function createReportOfCompanies(req, res) {
    Company.find({}).exec((err, companies) => {
        if (err) {
            res.status(500).send({ message: 'General server error!' });
        } else if (companies) {
            var workbook = new excel.Workbook();
            var worksheet = workbook.addWorksheet(WORKSHEET_COMPANIES);

            worksheet.columns = [
                { header: 'Id', key: '_id', width: 30 },
                { header: 'Name', key: 'name', width: 30 },
                { header: 'Username', key: 'username', width: 30 }
            ];

            worksheet.getRow(1).font = { bold: true }
            worksheet.getRow(1).alignment = { horizontal: 'center' }

            const columns = ['A', 'B', 'C']
            columns.forEach((c) => {
                worksheet.getColumn(c).alignment = { horizontal: 'center' }
            })

            worksheet.addRows(companies);

            let name = FILE + 'Companies-' + DATE.getDate() + EXTENSION
            workbook.xlsx.writeFile(name)
                .then(() => {
                    res.send({ message: 'Report created at: ' + DATE.getDateAnotherFormat() })
                }).catch(err => { res.status(500).send({ message: 'Error creating report!' }) })
        } else {
            res.status(404).send({ message: 'Employees not found!' });
        }
    })
}

module.exports = {
    createReportOfEmployees,
    createReportOfCompanies
}