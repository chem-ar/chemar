var express = require('express');
var router = express.Router();
var fs = require('fs');
var { checkSession } = require('./auth/session-mgmt')

/* GET home page. */
router.get('/', function(req, res, next) {
    const molfiles = './public/molfiles/';
    let molecule = JSON.parse(fs.readFileSync("./public/catalog/catalog.json"));
    let name,formula = "not found in catalog";
    
    //Admin check
    let {isAdmin, isowner} = checkSession(req, res);
    res.render('catalog', { title: 'Catalog', list: fs.readdirSync(molfiles), mol: molecule,name: name, formula: formula, isAdmin: isAdmin, isowner});
});

module.exports = router;
