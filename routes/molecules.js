var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    const molfiles = './public/molfiles/';

    //Admin check
    let isAdmin = (req.signedCookies.admin == 'true');

    res.render('molecules', { title: 'Catalog', list: fs.readdirSync(molfiles), isAdmin: isAdmin});
});

module.exports = router;
