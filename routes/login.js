var express = require('express');
var router = express.Router();
var { startSession } = require('./auth/session-mgmt')
var fs = require('fs');

router.get('/', function(req, res, next) {
    //Admin check
    // if (req.signedCookies.admin == 'true') res.redirect('/');
    // startSession(res)
    res.render('login', {title: 'Login Page'});
});

module.exports = router;