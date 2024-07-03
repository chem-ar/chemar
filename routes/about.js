var express = require('express');
var router = express.Router();
var { checkSession } = require('./auth/session-mgmt')

/* GET about page. */
router.get('/', function(req, res, next) {
    let isAdmin = checkSession(req);
    res.render('about', {title: 'About Us', isAdmin: isAdmin});
    
});

module.exports = router;
