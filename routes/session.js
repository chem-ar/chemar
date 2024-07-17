var express = require('express');
var router = express.Router();
var fs = require('fs');
const { startSession, checkSession } = require('./auth/session-mgmt')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

async function sendEmail(email){
  let newPassword = globalThis.crypto.randomUUID()

  const html = `
    <p> Please Find attach your new password${newPassword} </p>
  `

  console.log(newPassword);

  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
      user: 'fr933412@dal.ca',
      pass: 'Fer#@8421'
    }
  })

  const info = await transporter.sendMail({
    from: 'Ferin Miyani <fr933412@dal.ca>',
    to: email,
    subject: 'New Password for chemAr',
    html: html
  })

  console.log(info.messageId)
}

//Create cookie here then redirect
router.get('/', function(req, res) {
  res.redirect("/");
});

router.post('/', async function (req, res) {
  let adminEmail = req.body.email;
  let adminPass;
  let admins = JSON.parse(fs.readFileSync("./routes/auth/admin.json"))
  for(let i = 0; i < admins.length; i++){
    if(adminEmail == admins[i].email){
      adminPass = admins[i].password;
      break;
    }
  }

  if(!adminPass){
    console.log("admin not found");
    return res.status(401).send({message: 'Admin Not Found'})
  }

  const hash = await bcrypt.compare(req.body.password, adminPass)
  if(hash){
    startSession(req, res)
    return res.status(200).send({});
  }
  return res.status(401).send({error: "Password Incorrect"});
});

router.post('/changepassword', async function(req, res) {
  let adminData = JSON.parse(fs.readFileSync("./routes/auth/admin.json"));
  let isAdmin = checkSession(req, res);
  let token = req.cookies.session;
  let admin;
  let adminIndex;
  adminData.map((ele, ind) => {
    ele.session.map((e, i) => {
      if(e.token == token){
        admin = ele;
        adminIndex = ind
      }
    })
  })
  if(!admin){
    return res.status(401).json({error: "Invalid Credentials."})
  }
  const hash = await bcrypt.compare(req.body.password, admin.password)
  if(isAdmin && hash){
    let newPassword = await bcrypt.hash(req.body.newPassword, 5)
    adminData[adminIndex].password = newPassword
    let arr = JSON.stringify(adminData)
    fs.writeFileSync("./routes/auth/admin.json", arr)
    return res.send({});
  }
  else{
    return res.status(401).json({error: "Invalid Credentials."})
  }
});

router.post('/forgot', async function(req, res, next){
  let data = {...req.body}
  let isAdmin = checkSession(req, res)
  if(isAdmin){
    return res.redirect("/")
  }
  let email = data.email;
  console.log(email);
  sendEmail(email);
  return res.status(200).send({})
})

module.exports = router;
