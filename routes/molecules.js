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

// Edit molecule
router.put('/', function(req, res) {
    
})

// Delete molecule
router.post('/delete', function(req, res) {
    const path = './file.txt'

    try {
        fs.unlinkSync(path)
    //file removed
    } catch(err) {
        console.error(err)
    }
})

module.exports = router;
