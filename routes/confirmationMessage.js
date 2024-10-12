var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render("conformationMessage", {title: 'Confirmation Message'});
});

module.exports = router;