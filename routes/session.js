var express = require('express');
var router = express.Router();
var fs = require('fs');
const { startSession, checkSession } = require('./auth/session-mgmt')
const bcrypt = require('bcrypt')

async function handler(req, res, next) {
  let adminPass = JSON.parse(fs.readFileSync("./routes/auth/admin.json")).admin.password;
  const hash = await bcrypt.compare(req.body.password, adminPass)
  console.log(hash);
  if(hash){
    startSession(req, res)
    return res.status(200).send({});
  }
  return res.status(401).send({error: "Password Incorrect"});
}

async function forgotHandler(req, res, next) {
  let adminPass = JSON.parse(fs.readFileSync("./routes/auth/admin.json"));
  let isAdmin = checkSession(req)
  console.log("about to check");
  const hash = await bcrypt.compare(req.body.password, adminPass.admin.password)
  console.log(hash);
  if(isAdmin && hash){
    console.log("about to hash");
    let newPassword = await bcrypt.hash(req.body.newPassword, 5)
    console.log("new password after hash");
    adminPass.admin.password = newPassword
    let arr = JSON.stringify(adminPass)
    fs.writeFileSync("./routes/auth/admin.json", arr)
    return res.send({});
  }
  else{
    return res.status(401).json({error: "Invalid Credentials."})
  }
}

//Create cookie here then redirect
router.get('/', function(req, res, next) {
  res.redirect("/");
});

router.post('/', handler);

router.post('/forgot', forgotHandler);
module.exports = router;
