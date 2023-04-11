var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    const molfiles = './public/molfiles/';
    let molecule = JSON.parse(fs.readFileSync("./public/catalog/catalog.json"));
    let name,formula = "not found in catalog";
    
    //Admin check
    let isAdmin = (req.signedCookies.admin == 'true');

    res.render('catalog', { title: 'Catalog', list: fs.readdirSync(molfiles), mol: molecule,name: name, formula: formula, isAdmin: isAdmin});
});

module.exports = router;
