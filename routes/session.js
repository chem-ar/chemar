var express = require('express');
var router = express.Router();

//Create cookie here then redirect
router.get('/', function(req, res, next) {
  const oneDay = 86400000
  res.cookie('admin', true, {maxAge: oneDay, signed: true});
  res.redirect("/");
});

module.exports = router;
