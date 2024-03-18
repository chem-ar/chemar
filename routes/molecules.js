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
router.delete('/deleteMolecule/:file', function(req, res) {
    const file = req.params.file;
    const path = `./public/molfiles/${file}`;

    try {
        fs.unlinkSync(path);
        console.log(`Molecule '${file}' deleted successfully.`);
        res.sendStatus(200); // Send success response
    } catch(err) {
        console.error(`Failed to delete molecule '${file}':`, err);
        res.sendStatus(500); // Send error response
    }
});


module.exports = router;