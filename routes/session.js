var express = require('express');
var router = express.Router();
var fs = require('fs');
const { startSession, checkSession } = require('./auth/session-mgmt')
const bcrypt = require('bcrypt')

//Create cookie here then redirect
router.get('/', function(req, res) {
  res.redirect("/");
});

router.post('/', async function (req, res) {
  let adminPass = JSON.parse(fs.readFileSync("./routes/auth/admin.json")).admin.password;
  const hash = await bcrypt.compare(req.body.password, adminPass)
  if(hash){
    startSession(req, res)
    return res.status(200).send({});
  }
  return res.status(401).send({error: "Password Incorrect"});
});

router.post('/forgot', async function(req, res) {
  let adminPass = JSON.parse(fs.readFileSync("./routes/auth/admin.json"));
  let isAdmin = checkSession(req, res);
  const hash = await bcrypt.compare(req.body.password, adminPass.admin.password)
  if(isAdmin && hash){
    let newPassword = await bcrypt.hash(req.body.newPassword, 5)
    adminPass.admin.password = newPassword
    let arr = JSON.stringify(adminPass)
    fs.writeFileSync("./routes/auth/admin.json", arr)
    return res.send({});
  }
  else{
    return res.status(401).json({error: "Invalid Credentials."})
  }
});

module.exports = router;
