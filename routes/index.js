var express = require('express');
var router = express.Router();
var fs = require('fs');
var { checkSession } = require('./auth/session-mgmt')

function isMainAdminBySession(session) {
  let adminData = JSON.parse(fs.readFileSync("./routes/auth/admin.json"))
  let isMainAdmin = false

  for (let i = 0; i < adminData.length; i++) {
      for (let j = 0; j < adminData[i].session.length; j++) {
          if (session == adminData[i].session[j].token) {
              isMainAdmin = adminData[i].mainAdmin
              break;
          }
      }
      if (isMainAdmin) {
          break;
      }
  }
  console.log(isMainAdmin);
  return isMainAdmin;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  let isAdmin = checkSession(req, res);
  let isMainAdmin = isMainAdminBySession(req.cookies.session)
  res.render('home', { title: 'Express', testJSON: {name: 'test'}, isAdmin: isAdmin, isMainAdmin});
});

module.exports = router;
