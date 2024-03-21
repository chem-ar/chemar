var express = require('express');
var router = express.Router();
var fs = require('fs');
const notifier = require('node-notifier'); // Node Notifiers: https://www.npmjs.com/package/node-notifier

router.get('/', function(req, res, next) {
    res.render('addMolecule', {title: 'Add New Molecule'});
});

// Post request when clicking submit button
router.post('/', (req, res) => {
    // Assign values from form to variables
    var molName = req.body.name;
    console.log(molName);
    var molFormula = req.body.formula;
    console.log(molFormula);
    var molDescription = req.body.description;
    console.log(molDescription);
    var fileName = req.body.fileName;
    var molFileContent = req.body.preview;
    //const csid = fileName.substring(0, fileName.indexOf("."));

    var molfiles = fs.readdirSync('./public/molfiles/');
    var fileIsPresent = molfiles.includes(fileName);

    // Check if the molecule already exists
    if (fileIsPresent) {
        console.log('This molecule already exists.');
        notifier.notify({
            title: 'Save Unsuccessful.',
            message: 'Cannot save file This molecule already exists.',
        });
    } 
    else {
        // Create new mol file in ./public/molefiles/
        fs.writeFile('./public/molfiles/'+fileName, molFileContent, function (err) {
            if (err) {
                console.log('Error saving file:', err);
                notifier.notify({
                    title: 'Save Unsuccessful',
                    message: 'Cannot save the molecule: ' + err,
                });
            } else {
                console.log('New molecule created');
                notifier.notify({
                    title: 'Save Successful!',
                    message: 'Successfully saved the molecule!',
                });
            }
        });

        // Read json file and add info to it
        var rawdata = fs.readFileSync('./public/catalog/molfileCatalog.json');
        var parsedData = JSON.parse(rawdata);

        parsedData[fileName] = {
            name: molName,
            formula: molFormula,
            description: molDescription
        };

        var newMol = JSON.stringify(parsedData);
        fs.writeFileSync('./public/catalog/molfileCatalog.json', newMol);
    }

    // Return to catalog page
    res.redirect('/molecules');
});

router.post('/saveMolFile', async (req, res) => {
    // Assign values from form to variables
    const cid = req.body.pubchemId;
    console.log(cid);
    const fileName = `${cid}`;

    const molfiles = fs.readdirSync('./public/molfiles/');
    const fileIsPresent = molfiles.includes(fileName);

    // Check if the molecule already exists
    if (fileIsPresent) {
        console.log('This molecule already exists.');
        notifier.notify({
            title: 'Save Unsuccessful.',
            message: 'Cannot save file. This molecule already exists.',
        });
        // Redirect back to the catalog page
        return res.redirect('/molecules');
    } else {
        // Create new mol file in ./public/molfiles/
        const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/SDF/?record_type=3d&response_type=display`;
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch molecule data from PubChem API. Status: ${response.status}`);
            }

            const molFileData = await response.text();

            await storeAsMolFileOnServer(molFileData, cid);
            console.log('Molecule file saved');

            // Read molfileCatalog json file and add info to it
            const rawdata = fs.readFileSync('./public/catalog/molfileCatalog.json');
            const parsedData = JSON.parse(rawdata);

            // Variables to be added to molfileCatalog
            const molName = req.body.name;
            const molFormula = req.body.formula;
            const molDescription = "blabalbla";

            parsedData[fileName] = {
                name: molName,
                formula: molFormula,
                description: molDescription
            };

            const newMol = JSON.stringify(parsedData);
            fs.writeFileSync('./public/catalog/molfileCatalog.json', newMol);
            console.log('Molecule added to catalog');

            // Redirect back to the catalog page
            return res.redirect('/molecules');
        } catch (error) {
            console.error('Error saving molecule:', error);
            notifier.notify({
                title: 'Save Unsuccessful.',
                message: 'An error occurred while saving the molecule.',
            });
            return res.redirect('/molecules');
        }
    }
});

module.exports = router;