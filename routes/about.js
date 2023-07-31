var express = require('express');
var router = express.Router();

// Get about page
router.get('/', function(req, res, next) {

  //Admin check
  let isAdmin = (req.signedCookies.admin == 'true')

  res.render('about', { title: 'Express', testJSON: {name: 'test'}, isAdmin: isAdmin});
});

module.exports = router;

  