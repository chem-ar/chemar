var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  let numScenes = fs.readdirSync("./public/scenes/");
  let scenes = JSON.parse(fs.readFileSync("./public/scenes/scenes.json", "utf8"));
  
  res.render('admin', {title: 'Admin Page', scenes: scenes, numScenes : numScenes});
});

module.exports = router;