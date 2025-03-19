var express = require('express');
var router = express.Router();
var { checkSession } = require('./auth/session-mgmt');

router.get('/', async function (req, res, next) {
    let {isAdmin, isInstructor, isOwner} = checkSession(req, res);
    let userRole = res.locals.userRole;
    if(userRole === 'instructor'){
        isAdmin = true;
    }else if(userRole === 'admin'){
        isAdmin = true;
        isOwner = true;
    }
    
    if (!isAdmin) {
        return res.redirect("/");
    }

    res.render('admin', { title: 'Admin', isAdmin, isOwner, isInstructor });
});

module.exports = router;

