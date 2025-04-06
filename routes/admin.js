var express = require('express');
var router = express.Router();
var { checkSession } = require('./auth/session-mgmt')
const bcrypt = require('bcrypt');
var fs = require('fs')
var {checkPassword} = require('./checkPassword')

/* GET admin page. */
router.get('/', function (req, res, next) {
    let {isAdmin, isowner} = checkSession(req, res);
    if (!isAdmin) return res.redirect("/");
    res.render('admin', { title: 'Admin', isAdmin: isAdmin, isowner });

});

module.exports = router;
