var express = require('express');
var router = express.Router();

/* GET admin page. */
router.get('/', function(req, res, next) {
    let isAdmin = (req.signedCookies.admin == 'true')
    res.render('admin', {title: 'Admin', isAdmin: isAdmin});
    
});

module.exports = router;
