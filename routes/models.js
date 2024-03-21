var express = require('express');
var router = express.Router();

/* GET models page. */
router.get('/', function(req, res, next) {
    //Admin check
    let isAdmin = (req.signedCookies.admin == 'true');

    res.render('models', { title: 'Model Catalog', isAdmin: isAdmin});
});

module.exports = router;
