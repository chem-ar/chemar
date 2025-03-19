var express = require('express');
var router = express.Router();
var { checkSession } = require('./auth/session-mgmt')

/* GET home page. */
router.get('/', async (req, res) => {
  res.render('home', {
      userRole: res.locals.userRole,
      isAdmin: res.locals.isAdmin,
      isInstructor: res.locals.isInstructor,
      isOwner: res.locals.isOwner
  });
});

module.exports = router;
