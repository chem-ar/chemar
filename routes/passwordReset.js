var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
   

    res.render('passwordReset', {title: 'Password Reset Page'});
});

module.exports = router;