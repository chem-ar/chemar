var express = require('express');
var router = express.Router();
var { checkSession } = require('../auth/session-mgmt');

router.get('/', async function (req, res) {
    let { isAdmin } = await checkSession(req, res);

    let userRole = req.session?.user?.role || 'student';

    let navbar = 'partials/navbar'; 
    if (userRole === 'admin') {
        navbar = 'partials/navbarAdmin'; 
    } else if (userRole === 'instructor') {
        navbar = 'partials/navbarAdmin'; 
    } else if(userRole === 'superadmin'){
        navbar = 'partials/navbarowner';
    } else if(userRole ==='developer'){
        navbar = 'partials/navbarowner';
    }

    console.log(userRole);
    res.render('home', { title: 'Home', navbar: navbar, userRole });
});

module.exports = router;
