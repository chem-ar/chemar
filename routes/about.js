var express = require('express');
var router = express.Router();

/* GET about page. */
router.get('/', function(req, res, next) {
    let isAdmin = (req.signedCookies.admin == 'true')
    res.render('about', {title: 'About Us', isAdmin: isAdmin});
    
});

module.exports = router;
