'use strict'

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function capitalizeInitials(string) {
    var split = string.toLowerCase().split(' ');
    for (var i = 0; i < split.length; i++) {
        split[i] = split[i].charAt(0).toUpperCase() + split[i].substring(1);
    }
    return split.join(' ');
}

module.exports = {
    capitalizeFirstLetter,
    capitalizeInitials
}