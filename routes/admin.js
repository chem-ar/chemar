var express = require('express');
var router = express.Router();
var { checkSession } = require('./auth/session-mgmt');

router.get('/', async function (req, res, next) {
    let { isAdmin, isOwner } = await checkSession(req, res);
    
    if (!isAdmin) {
        return res.redirect("/");
    }

    res.render('admin', { title: 'Admin', isAdmin, isOwner });
});

module.exports = router;

