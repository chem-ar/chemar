var express = require('express');
var router = express.Router();
var { checkSession } = require('./auth/session-mgmt')

/* GET admin page. */
router.get('/', function(req, res, next) {
    let isAdmin = checkSession(req);
    if (!isAdmin) return res.redirect("/");
    res.render('admin', {title: 'Admin', isAdmin: isAdmin});
    
});

module.exports = router;
