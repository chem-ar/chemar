var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render("forgotPasswordPage", {title: 'Password Page'});
});

module.exports = router;