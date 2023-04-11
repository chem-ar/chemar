var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let isAdmin = (req.signedCookies.admin == 'true')
  res.render('home', { title: 'Express', testJSON: {name: 'test'}, isAdmin: isAdmin});
});

module.exports = router;
