'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const SECRET_KEY = '2E1B145AA8A46DBEE8CEF910D91C664F441A1E70ACB8FDA38DB9B3984BD2AA9D'

exports.createToken = (user) => {
    let payload = {
        sub: user._id,
        username: user.username,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(5, 'hours').unix()
    }

    return jwt.encode(payload, SECRET_KEY)
}