var express = require('express');
var router = express.Router();

/* GET models page. */
router.get('/', function(req, res, next) {
    let isAdmin = (req.signedCookies.admin == 'true')
    res.render('models', {title: 'Models', isAdmin: isAdmin});
    
});

module.exports = router;
