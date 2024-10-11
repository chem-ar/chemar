var express = require('express');
var router = express.Router();
var fs = require('fs');
const { startSession, checkSession, endSession } = require('./auth/session-mgmt')

router.get('/', function (req, res) {
    req.cookies.session = req.query.token;
    req.body.email = req.query.email;
    let confirm = false;

    let { isAdmin, isowner } = checkSession(req, res);
    if (isAdmin) {
        confirm = true;
        endSession(req, res)
    }

    if (confirm) {
        return res.render('passwordReset', { title: 'Password Reset Page' });
    } else {
        return res.status(404);
    }

});

module.exports = router;