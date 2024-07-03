var express = require('express');
var router = express.Router();
var fs = require('fs');
const { startSession } = require('./auth/session-mgmt')
const adminPass = "TestPassword123"

//Create cookie here then redirect
router.get('/', function(req, res, next) {
  res.redirect("/");
});

router.post('/', function(req, res, next) {
  let adminPass = JSON.parse(fs.readFileSync("./admin.json")).admin.password;
  if(adminPass == req.body.password){
    startSession(res)
    res.status(200).redirect("/");
  }
  res.status(401).redirect('/')
});
module.exports = router;
