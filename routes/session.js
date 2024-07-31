var express = require('express');
var router = express.Router();
var fs = require('fs');
const { startSession, checkSession } = require('./auth/session-mgmt')
const bcrypt = require('bcrypt')

//Create cookie here then redirect
router.get('/', function (req, res) {
  res.redirect("/");
});

router.post('/', async function (req, res) {
  let adminEmail = req.body.email;
  let adminPass;
  let admins = JSON.parse(fs.readFileSync("./routes/auth/admin.json"))
  for (let i = 0; i < admins.length; i++) {
    if (adminEmail == admins[i].email) {
      adminPass = admins[i].password;
      break;
    }
  }

  if (!adminPass) {
    return res.status(401).send({ error: 'Invalid Credentials' })
  }

  const hash = await bcrypt.compare(req.body.password, adminPass)
  if (hash) {
    startSession(req, res)
    return res.status(200).send({});
  }
  return res.status(401).send({ error: "Password Incorrect" });
});

router.post('/changepassword', async function (req, res) {
  let adminData = JSON.parse(fs.readFileSync("./routes/auth/admin.json"));
  let { isAdmin, isowner } = checkSession(req, res);
  let token = req.cookies.session;
  let admin;
  let adminIndex;
  adminData.map((ele, ind) => {
    ele.session.map((e, i) => {
      if (e.token == token) {
        admin = ele;
        adminIndex = ind
      }
    })
  })
  if (!admin) {
    return res.status(401).json({ error: "Invalid Credentials." })
  }
  const hash = await bcrypt.compare(req.body.password, admin.password)
  if (isAdmin && hash) {
    let newPassword = await bcrypt.hash(req.body.newPassword, 5)
    adminData[adminIndex].password = newPassword
    let arr = JSON.stringify(adminData)
    fs.writeFileSync("./routes/auth/admin.json", arr)
    return res.send({});
  }
  else {
    return res.status(401).json({ error: "Invalid Credentials." })
  }
});



module.exports = router;
