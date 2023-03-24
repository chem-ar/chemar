var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('addScene', {title: 'Add New Scene'});
});

/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log(req.body);
  res.render('addScene', {title: 'Add New Scene'});
});




module.exports = router;
