var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render("forgotPasswordPage", {title: 'Forgot Password Page'});
});

module.exports = router;