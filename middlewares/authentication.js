'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

const ADMINISTRADOR = "ADMINISTRATOR";
const COMPANY = "COMPANY";
const SECRET_KEY = 'Shhhh'

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'La petición no lleva cabecera de autenticación' })
    } else {
        let token = req.headers.authorization.replace(/['"']+/g, '');
        try {
            var payload = jwt.decode(token, SECRET_KEY);
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
    let payload = req.user;

    if (payload.role != ADMINISTRADOR) {
        return res.status(404).send({ message: 'No tienes permiso para ingresar a esta ruta' })
    } else {
        return next();
    }
}

exports.ensureAuthCompany = (req, res, next) => {
    let payload = req.user;

    if (payload.role != COMPANY) {
        return res.status(404).send({ message: 'No tienes permiso para ingresar a esta ruta' })
    } else {
        return next();
    }
}