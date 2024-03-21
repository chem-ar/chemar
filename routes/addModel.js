var express = require('express');
var router = express.Router();
var fs = require('fs');
const notifier = require('node-notifier'); // Node Notifiers: https://www.npmjs.com/package/node-notifier

router.get('/', function(req, res, next) {
    res.render('addModel', {title: 'Add New Model'});
});

// Post request when clicking submit button
router.post('/', (req, res) => {
    // Assign values from form to variables
    var modelName = req.body.name;
    console.log(modelName);
    var fileName = req.body.fileName;
    var modelFileContent = req.body.preview;

    var modelFiles = fs.readdirSync('./public/modelfiles/');
    var fileIsPresent = modelfiles.includes(fileName);

    // Check if the molecule already exists
    if (fileIsPresent) {
        console.log('This molecule already exists.');
        notifier.notify({
            title: 'Save Unsuccessful.',
            message: 'Cannot save file this model already exists.',
        });
    } 
    else {
        // Create new mol file in ./public/molefiles/
        fs.writeFile('./public/modelfiles/'+fileName, modelFileContent, function (err) {
            if (err) {
                console.log('Error saving file:', err);
                notifier.notify({
                    title: 'Save Unsuccessful',
                    message: 'Cannot save the model: ' + err,
                });
            } else {
                console.log('New model created');
                notifier.notify({
                    title: 'Save Successful!',
                    message: 'Successfully saved the molecule!',
                });
            }
        });

        // Read json file and add info to it
        var rawdata = fs.readFileSync('./public/catalog/modelFileCatalog.json');
        var parsedData = JSON.parse(rawdata);

        parsedData[fileName] = {
            name: modelName
        };

        var newModel = JSON.stringify(parsedData);
        fs.writeFileSync('./public/catalog/modelFileCatalog.json', newModel);
    }

    // Return to catalog page
    res.redirect('/models');
});

router.post('/saveMolFile', async (req, res) => {
    // Assign values from form to variables
    
    fileName = `${fileName}`

    var molfiles = fs.readdirSync('./public/modelfiles/');
    var fileIsPresent = modelfiles.includes(fileName);

    // Check if the molecule already exists
    if (fileIsPresent) {
        console.log('This model already exists.');
        notifier.notify({
            title: 'Save Unsuccessful.',
            message: 'Cannot save file This molecule already exists.',
        });
        // Redirect back to the catalog page
        return res.redirect('/models');
    } 
        const modelFileData = await response.text();

        const filePath = `public/modelfiles/${fileName}.mtl`;
        try {
            fs.writeFileSync(filePath, modelFileData, 'utf8');
            console.log('Model file saved:', filePath);
        } catch (error) {
            console.error('Error saving model file:', error);
        }

        // Read molfileCatalog json file and add info to it
        var rawdata = fs.readFileSync('./public/catalog/modelFileCatalog.json');
        var parsedData = JSON.parse(rawdata);

        // Variables to be added to molfileCatalog
        var fileName = `${req.body.name}.mtl`
        var modelName = req.body.name;
        
        parsedData[fileName] = {
            name: modelName
        };

        var newModel = JSON.stringify(parsedData);
        fs.writeFileSync('./public/catalog/modelFileCatalog.json', newModel);
        console.log('Model created');

        // Redirect back to the catalog page
        return res.redirect('/models');
    }
);

module.exports = router;

// var express = require('express');
// var router = express.Router();
// var fs = require('fs');
// const notifier = require('node-notifier'); // Node Notifiers: https://www.npmjs.com/package/node-notifier

// router.get('/', function(req, res, next) {
//     res.render('addModel', {title: 'Add New Model'});
// });

// router.post('/saveModel', async (req, res) => {
//     // Assign values from form to variables
//     const cid = req.body.pubchemId;
//     console.log(cid);
//     fileName = `${cid}`

//     var models = fs.readdirSync('./public/molfiles/');
//     var fileIsPresent = molfiles.includes(fileName);

//     // Check if the molecule already exists
//     if (fileIsPresent) {
//         console.log('This molecule already exists.');
//         notifier.notify({
//             title: 'Save Unsuccessful.',
//             message: 'Cannot save file This molecule already exists.',
//         });
//         // Redirect back to the catalog page
//         return res.redirect('/molecules');
//     } else {
//         // Create new mol file in ./public/molefiles/
//         const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/SDF/?record_type=3d&response_type=display`;
//         const response = await fetch(url);

//         if (!response.ok) {
//             throw new Error(`Failed to fetch molecule data from PubChem API. Status: ${response.status}`);
//         }

//         const molFileData = await response.text();

//         const filePath = `public/molfiles/${cid}.mol`;
//         try {
//             fs.writeFileSync(filePath, molFileData, 'utf8');
//             console.log('Molecule file saved:', filePath);
//         } catch (error) {
//             console.error('Error saving molecule file:', error);
//         }

//         // Read molfileCatalog json file and add info to it
//         var rawdata = fs.readFileSync('./public/catalog/molfileCatalog.json');
//         var parsedData = JSON.parse(rawdata);

//         // Variables to be added to molfileCatalog
//         var fileName = `${cid}.mol`
//         var molName = req.body.name;
//         var molFormula = req.body.formula
//         var molDescription = "blabalbla"

//         parsedData[fileName] = {
//             name: molName,
//             formula: molFormula,
//             description: molDescription
//         };

//         var newMol = JSON.stringify(parsedData);
//         fs.writeFileSync('./public/catalog/molfileCatalog.json', newMol);
//         console.log('Molecule created');

//         // Redirect back to the catalog page
//         return res.redirect('/molecules');
//     }
// });

// module.exports = router;
