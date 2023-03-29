var express = require('express');
var router = express.Router();

//Create cookie here then redirect
router.get('/', function(req, res, next) {
  const oneDay = 86400000
  res.cookie('name', 'admin', {maxAge: oneDay});
  res.redirect("/");
});

module.exports = router;
