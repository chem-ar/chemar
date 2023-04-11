var express = require('express');
var router = express.Router();
var fs = require('fs');

//Create cookie here then redirect
router.get('/', function(req, res, next) {
  res.redirect("/");
});

router.post('/', function(req, res, next) {
  let adminPass = JSON.parse(fs.readFileSync("./admin.json")).admin.password;
  if(adminPass == req.body.password){
    const oneDay = 86400000
    res.cookie('admin', true, {maxAge: oneDay, signed: true});
    res.redirect("/");
  }
  else{
    res.redirect("back");
  }
});
module.exports = router;
