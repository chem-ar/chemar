var express = require('express');
var router = express.Router();
const {endSession} = require('./auth/session-mgmt')

//Create cookie here then redirect
router.get('/', function(req, res, next) {
  endSession(req, res)
  res.redirect("/");
});

module.exports = router;