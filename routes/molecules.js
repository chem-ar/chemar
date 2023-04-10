var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    const molfiles = './public/molfiles/';

    //Admin check
    let isAdmin = (req.signedCookies.admin == 'true');


    let listItems =  fs.readdirSync(molfiles);
    let molfileJSON = fs.readFileSync('./public/catalog/molfileCatalog.json', 'utf8');
    let molfileObject = JSON.parse(molfileJSON);
    

    let finalList = [];

    for(let item of listItems){

        molfileObject[item].file = item;
        finalList.push(molfileObject[item])
    }
    console.log(finalList)

    res.render('molecules', { title: 'Catalog', list: finalList, isAdmin: isAdmin});
});

router.post('/', function(req, res) {
    var molName = req.body.name;
    console.log(molName);
})

module.exports = router;
