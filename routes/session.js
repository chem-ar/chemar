var express = require('express');
var router = express.Router();
var fs = require('fs');
const { startSession, checkSession } = require('./auth/session-mgmt')

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
  res.status(401).send({error: "Password Incorrect"});
});

router.post('/forgot', function(req, res, next) {
  console.log("Hello");
  let adminPass = JSON.parse(fs.readFileSync("./admin.json"));
  let isAdmin = checkSession(req)
  if(isAdmin && adminPass.admin.password == req.body.password){
    adminPass.admin.password = req.body.newPassword
    let arr = JSON.stringify(adminPass)
    fs.writeFileSync("./admin.json", arr)
    res.redirect("/")
  }
  else{
    res.status(401).json({error: "Invalid Credentials."})
  }
  res.status(401).redirect('/')
});
module.exports = router;
