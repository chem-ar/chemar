var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render("confirmationMessage", {title: 'Confirmation Message', message: 'An email has been sent! Please check your junk email and inbox!'});
});

module.exports = router;