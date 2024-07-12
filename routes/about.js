var express = require('express');
var router = express.Router();
var { checkSession } = require('./auth/session-mgmt')
var fs = require('fs')

function isMainAdminBySession(session) {
    let adminData = JSON.parse(fs.readFileSync("./routes/auth/admin.json"))
    let isMainAdmin = false

    for (let i = 0; i < adminData.length; i++) {
        for (let j = 0; j < adminData[i].session.length; j++) {
            if (session == adminData[i].session[j].token) {
                isMainAdmin = adminData[i].mainAdmin
                break;
            }
        }
        if (isMainAdmin) {
            break;
        }
    }
    console.log(isMainAdmin);
    return isMainAdmin;
}

/* GET about page. */
router.get('/', function (req, res, next) {
    let isAdmin = checkSession(req, res);
    let isMainAdmin = isMainAdminBySession(req.cookies.session)
    console.log(isMainAdmin);
    res.render('about', { title: 'About Us', isAdmin: isAdmin, isMainAdmin: isMainAdmin });

});

module.exports = router;
