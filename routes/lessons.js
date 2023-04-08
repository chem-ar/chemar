var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    const lessons = './public/lessons/';

    //Admin check
    let isAdmin = (req.signedCookies.admin == 'true');

    res.render('lessons', { title: 'Catalog', list: fs.readdirSync(lessons), isAdmin: isAdmin});
});

module.exports = router;
