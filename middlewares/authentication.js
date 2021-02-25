'use strict'

let jwt = require('jwt-simple');
let moment = require('moment');
const ADMINISTRADOR = "ADMINISTRATOR";
const COMPANY = "COMPANY";
const SECRET_KEY = '2E1B145AA8A46DBEE8CEF910D91C664F441A1E70ACB8FDA38DB9B3984BD2AA9D'

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'La petición no lleva cabecera de autenticación' })
    } else {
        let token = req.headers.authorization.replace(/['"']+/g, '');
        try {
            let payload = jwt.decode(token, SECRET_KEY);
            if (payload.exp <= moment().unix()) {
                return res.status(401).send({ message: 'Token ha expirado' })
            }
        } catch (err) {
            return res.status(404).send({ message: 'Token inválido' })
        }

        req.user = payload;
        next();
    }
}

exports.ensureAuthAdministrator = (req, res, next) => {
    var payload = req.user;

    if (payload.role != ADMINISTRADOR) {
        return res.status(404).send({ message: 'No tienes permiso para ingresar a esta ruta' })
    } else {
        return next();
    }
}

exports.ensureAuthCompany = (req, res, next) => {
    var payload = req.user;

    if (payload.role != COMPANY) {
        return res.status(404).send({ message: 'No tienes permiso para ingresar a esta ruta' })
    } else {
        return next();
    }
}