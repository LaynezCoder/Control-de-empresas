'use strict'

const companyController = require('./controllers/company-controller')
const mongoose = require('mongoose');
const app = require('./app');
const port = 3200;


mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/ControlDeEmpresas', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to the database!');
        companyController.createAdministrator();
        app.listen(port, () => {
            console.log('Express server is running!');
        })
    })
    .catch((err) => {
        console.log('Error connecting to database!', err);
    })
