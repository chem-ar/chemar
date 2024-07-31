var express = require('express');
var router = express.Router();
var { checkSession } = require('./auth/session-mgmt')

router.get('/', function(req, res, next) {
    //Admin check
    const isAdmin = checkSession(req, res);
    if (isAdmin) return res.redirect("/admin");

    res.render('login', {title: 'Login Page'});
});

module.exports = router;