'use strict'

var companyController = require('./controllers/company-controller')
var mongoose = require('mongoose');
var app = require('./app');
const PORT = 3200;


mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/ControlDeEmpresas', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to the database!');
        companyController.createAdministrator();
        app.listen(PORT, () => {
            console.log('Express server is running!');
        })
    }).catch(err => console.log('Error connecting to database!', err))
