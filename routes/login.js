var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function(req, res, next) {
    let users = JSON.parse(fs.readFileSync("./admin.json", "utf8"));
    res.render('login', {title: 'Login Page', users: users});
});

module.exports = router;