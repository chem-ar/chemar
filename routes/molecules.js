var express = require('express');
var router = express.Router();
var { checkSession } = require('./auth/session-mgmt')
var fs = require('fs');

router.get('/', function(req, res, next) {
    const molfiles = './public/molfiles/';

    //Admin check
    let {isAdmin, isInstructor, isOwner} = checkSession(req, res);
    let userRole = res.locals.userRole;
    if(userRole === 'instructor'){
        isAdmin = true;
    }else if(userRole === 'admin'){
        isAdmin = true;
    }

    try {
        let listItems = fs.readdirSync(molfiles);
        let molfileJSON = fs.readFileSync('./public/catalog/molfileCatalog.json', 'utf8');
        let molfileObject = JSON.parse(molfileJSON);

        let finalList = [];

        for (let item of listItems) {
            // Check if the item exists in the molfileObject before accessing its properties
            if (molfileObject.hasOwnProperty(item)) {
                molfileObject[item].file = item;
                finalList.push(molfileObject[item]);
            } else {
                console.error(`Molecule '${item}' not found in catalog.`);
            }
        }


        res.render('molecules', { title: 'Catalog', list: finalList, isAdmin: isAdmin, isInstructor: isInstructor, isOwner: isOwner });
    } catch (error) {
        console.error('Error:', error);
        res.sendStatus(500); // Send error response
    }
});


// Edit molecule
router.put('/editMolecule/:file', function(req, res) {
    const file = req.params.file;

    try {
        // Read the updated molecule data from the request body
        const updatedMoleculeData = req.body;

        // Update the molecule catalog JSON file
        const catalogPath = './public/catalog/molfileCatalog.json';
        const rawdata = fs.readFileSync(catalogPath);
        const parsedData = JSON.parse(rawdata);

        // Update the molecule information
        parsedData[file] = updatedMoleculeData;

        // Write back to the JSON file
        fs.writeFileSync(catalogPath, JSON.stringify(parsedData));

        return res.send({ message: `Molecule '${file}' updated successfully.` });
    } catch(err) {
        const errMsg = `Failed to update molecule file '${file}': ${err}`;
        console.error(errMsg);
        return res.status(500).send({ error: errMsg });
    }
});


// Delete molecule
router.post('/deleteMolecule/:file', function(req, res) {
    const file = req.params.file;
    const filePath = `./public/molfiles/${file}`;

    try {
        fs.unlinkSync(filePath);

        // Update molecule catalog JSON file
        var catalogPath = './public/catalog/molfileCatalog.json';
        var rawdata = fs.readFileSync(catalogPath);
        var parsedData = JSON.parse(rawdata);

        // Remove the entry from the catalog
        delete parsedData[file];

        // Write back to the JSON file
        fs.writeFileSync(catalogPath, JSON.stringify(parsedData));

        return res.send({ message: `Molecule '${file}' deleted successfully.` });
    } catch(err) {
        const errMsg = `Failed to delete molecule file '${file}': ${err}`;
        console.error(errMsg);
        return res.status(500).send({ error: errMsg });
    }
});


module.exports = router;