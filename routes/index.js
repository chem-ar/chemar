var express = require('express');
var router = express.Router();
var fs = require('fs');
var { checkSession } = require('./auth/session-mgmt')

function isownerBySession(session) {
  let adminData = JSON.parse(fs.readFileSync("./routes/auth/admin.json"))
  let isowner = false

  for (let i = 0; i < adminData.length; i++) {
      for (let j = 0; j < adminData[i].session.length; j++) {
          if (session == adminData[i].session[j].token) {
              isowner = adminData[i].owner
              break;
          }
      }
      if (isowner) {
          break;
      }
  }
  console.log(isowner);
  return isowner;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  let isAdmin = checkSession(req, res);
  let isowner = isownerBySession(req.cookies.session)
  res.render('home', { title: 'Express', testJSON: {name: 'test'}, isAdmin: isAdmin, isowner});
});

module.exports = router;
