var express = require('express');
var router = express.Router();
var fs = require('fs');

//Get scenes page
router.get('/', function(req, res, next) {
  let numScenes = fs.readdirSync("./public/scenes/");
  let scenes = JSON.parse(fs.readFileSync("./public/scenes/scenes.json", "utf8"));
  //If user is not admin redirect to home page
  if(req.signedCookies.admin != 'true') res.redirect("/");

  res.render('scenes', {title: 'Scene Manager', scenes: scenes, numScenes: numScenes});
});

module.exports = router;