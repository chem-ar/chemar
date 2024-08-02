var express = require('express');

function checkPassword(password)  {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{7,}$/;
    return regex.test(password)
}
module.exports = { checkPassword };