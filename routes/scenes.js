var express = require('express');
var router = express.Router();
var fs = require('fs');

//Get scenes page
router.get('/', function(req, res, next) {
  let list = fs.readdirSync("./public/scenefiles/");

  //Admin check
  let isAdmin = (req.signedCookies.admin == 'true');

  res.render('scenes', {title: 'Scene Manager', list: list, isAdmin: isAdmin});
});

module.exports = router;