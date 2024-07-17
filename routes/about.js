var express = require('express');
var router = express.Router();
var { checkSession, isownerBySession } = require('./auth/session-mgmt')
var fs = require('fs')

/* GET about page. */
router.get('/', function (req, res, next) {
    let isAdmin = checkSession(req, res);
    let isowner = isownerBySession(req.cookies.session)
    console.log(isowner);
    res.render('about', { title: 'About Us', isAdmin: isAdmin, isowner: isowner });

});

module.exports = router;
