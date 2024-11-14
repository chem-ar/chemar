var express = require('express');
var router = express.Router();
var { checkSession } = require('./auth/session-mgmt')

router.get('/', function (req, res, next) {
    let { isAdmin, isowner } = checkSession(req, res);
    res.render("confirmationMessage", { title: 'Confirmation Message', message: 'An email has been sent! Please check your junk email and inbox!', isAdmin: isAdmin, isowner });
});

module.exports = router;