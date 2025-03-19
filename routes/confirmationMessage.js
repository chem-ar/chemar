var express = require('express');
var router = express.Router();
var { checkSession } = require('./auth/session-mgmt')

router.get('/', function (req, res, next) {
    let {isAdmin, isInstructor, isOwner} = checkSession(req, res);
    let userRole = res.locals.userRole;
    if(userRole === 'instructor'){
        isAdmin = true;
        isInstructor = true;
    }else if(userRole === 'admin'){
        isAdmin = true;
        isOwner = true;
    }

    res.render("confirmationMessage", { title: 'Confirmation Message', message: 'An email has been sent! Please check your junk email and inbox!', isAdmin: isAdmin, isOwner: isOwner, isInstructor: isInstructor });
});

module.exports = router;