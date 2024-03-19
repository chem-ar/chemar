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
router.post('/deleteMolecule/:file', function(req, res) {
    const file = req.params.file;
    const filePath = `./public/molfiles/${file}`;

    try {
        fs.unlinkSync(filePath);
        console.log(`Molecule file '${file}' deleted successfully.`);

        // Update molecule catalog JSON file
        var catalogPath = './public/catalog/molfileCatalog.json';
        var rawdata = fs.readFileSync(catalogPath);
        var parsedData = JSON.parse(rawdata);

        // Remove the entry from the catalog
        delete parsedData[file];

        // Write back to the JSON file
        fs.writeFileSync(catalogPath, JSON.stringify(parsedData));

        // Notify success
        notifier.notify({
            title: 'Delete Successful',
            message: `Molecule '${file}' deleted successfully.`,
        });

        res.sendStatus(200); // Send success response
    } catch(err) {
        console.error(`Failed to delete molecule file '${file}':`, err);
        res.sendStatus(500); // Send error response
    }
});


module.exports = router;