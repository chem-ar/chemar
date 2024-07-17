var express = require('express');
var router = express.Router();
var fs = require('fs');
var { checkSession, isownerBySession } = require('./auth/session-mgmt')

/* GET home page. */
router.get('/', function(req, res, next) {
  let isAdmin = checkSession(req, res);
  let isowner = isownerBySession(req.cookies.session)
  res.render('home', { title: 'Express', testJSON: {name: 'test'}, isAdmin: isAdmin, isowner});
});

module.exports = router;
