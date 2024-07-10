var express = require('express');
var router = express.Router();
var fs = require('fs');
var { checkSession } = require('./auth/session-mgmt')


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

/* GET home page. */
router.get('/', function(req, res, next) {
    const molfiles = './public/molfiles/';
    let molecule = JSON.parse(fs.readFileSync("./public/catalog/catalog.json"));
    let name,formula = "not found in catalog";
    
    //Admin check
    let isAdmin = checkSession(req, res);
    let isMainAdmin = isMainAdminBySession(req.cookies.session)
    res.render('catalog', { title: 'Catalog', list: fs.readdirSync(molfiles), mol: molecule,name: name, formula: formula, isAdmin: isAdmin, isMainAdmin});
});

module.exports = router;
