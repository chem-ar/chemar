var express = require('express');
var router = express.Router();
var fs = require('fs');
const notifier = require('node-notifier'); // Node Notifiers: https://www.npmjs.com/package/node-notifier

router.get('/', function(req, res, next) {
    const modelfiles = './public/modelfiles/';

    //Admin check
    let isAdmin = (req.signedCookies.admin == 'true');

    try {
        let listItems = fs.readdirSync(modelfiles);
        let modelfileJSON = fs.readFileSync('./public/catalog/modelFileCatalog.json', 'utf8');
        let modelfileObject = JSON.parse(modelfileJSON);

        let finalList = [];

        for (let item of listItems) {
            // Check if the item exists in the modelfile before accessing its properties
            if (modelfileObject.hasOwnProperty(item)) {
                modelfileObject[item].file = item;
                finalList.push(modelfileObject[item]);
            } else {
                console.error(`Model '${item}' not found in catalog.`);
            }
        }

        console.log(finalList);

        res.render('models', { title: 'Catalog', list: finalList, isAdmin: isAdmin });
    } catch (error) {
        console.error('Error:', error);
        res.sendStatus(500); // Send error response
    }
});


// // Edit molecule
// router.put('/editMolecule/:file', function(req, res) {
//     const file = req.params.file;
//     const filePath = `./public/molfiles/${file}`;

//     try {
//         // Read the updated molecule data from the request body
//         const updatedMoleculeData = req.body;

//         // Update the molecule catalog JSON file
//         const catalogPath = './public/catalog/molfileCatalog.json';
//         const rawdata = fs.readFileSync(catalogPath);
//         const parsedData = JSON.parse(rawdata);

//         // Update the molecule information
//         parsedData[file] = updatedMoleculeData;

//         // Write back to the JSON file
//         fs.writeFileSync(catalogPath, JSON.stringify(parsedData));

//         // Notify success
//         notifier.notify({
//             title: 'Edit Successful',
//             message: `Molecule '${file}' updated successfully.`,
//         });

//         res.sendStatus(200); // Send success response
//     } catch(err) {
//         console.error(`Failed to update molecule file '${file}':`, err);
//         res.sendStatus(500); // Send error response
//     }
// });


// Delete molecule
// router.post('/deleteMolecule/:file', function(req, res) {
//     const file = req.params.file;
//     const filePath = `./public/molfiles/${file}`;

//     try {
//         fs.unlinkSync(filePath);
//         console.log(`Molecule file '${file}' deleted successfully.`);

//         // Update molecule catalog JSON file
//         var catalogPath = './public/catalog/molfileCatalog.json';
//         var rawdata = fs.readFileSync(catalogPath);
//         var parsedData = JSON.parse(rawdata);

//         // Remove the entry from the catalog
//         delete parsedData[file];

//         // Write back to the JSON file
//         fs.writeFileSync(catalogPath, JSON.stringify(parsedData));

//         // Notify success
//         notifier.notify({
//             title: 'Delete Successful',
//             message: `Molecule '${file}' deleted successfully.`,
//         });

//         res.sendStatus(200); // Send success response
//     } catch(err) {
//         console.error(`Failed to delete molecule file '${file}':`, err);
//         res.sendStatus(500); // Send error response
//     }
// });


module.exports = router;