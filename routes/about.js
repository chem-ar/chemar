var express = require('express');
var router = express.Router();
var fs = require('fs')
var {checkSession} = require('./auth/session-mgmt')

/* GET about page. */
router.get('/', function (req, res, next) {
    let {isAdmin, isowner} = checkSession(req, res);
    console.log(isowner);
    res.render('about', { title: 'About Us', isAdmin: isAdmin, isowner: isowner });

});

module.exports = router;
