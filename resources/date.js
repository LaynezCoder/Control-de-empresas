'use strict'

function getDate() {
    var date = new Date();
    var dateString =
        ("00" + (date.getMonth() + 1)).slice(-2) + '-' +
        ("00" + date.getDate()).slice(-2) + '-' +
        date.getFullYear() + "T" +
        ("00" + date.getHours()).slice(-2) + '-' +
        ("00" + date.getMinutes()).slice(-2) + '-' +
        ("00" + date.getSeconds()).slice(-2);
    return dateString
}

function getDateAnotherFormat() {
    var date = new Date();
    return date.toLocaleTimeString();
}

module.exports = {
    getDate,
    getDateAnotherFormat
};