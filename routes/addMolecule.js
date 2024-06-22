var express = require('express');
var router = express.Router();
var fs = require('fs');
const notifier = require('node-notifier'); // Node Notifiers: https://www.npmjs.com/package/node-notifier

router.get('/', function(req, res, next) {
    res.render('addMolecule', {title: 'Add New Molecule'});
});

/**
 * Function to fetch data from a URL and store it as a .mol file on the server.
 * @param {string} molData - The URL to fetch.
 * @param {number} cid - PubChem Compound ID.
 * @returns {Promise<void>} - Promise resolving when the .mol file is stored.
 */
async function storeAsMolFileOnServer(molData, cid) {
    const filePath = `public/molfiles/${cid}.mol`;

    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, molData, 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                console.log('Molecule file saved:', filePath);
                resolve();
            }
        });
    });
}

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
    fileName = `${cid}.mol`;

    var molfiles = fs.readdirSync('./public/molfiles/');
    var fileIsPresent = molfiles.includes(fileName);

    // Check if the molecule already exists
    if (fileIsPresent) {
        return res.status(400).send({ error: 'This molecule already exists' });
    }

    // Create new mol file in ./public/molefiles/
    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/SDF/?record_type=3d&response_type=display`;
    const response = await fetch(url);

    if (!response.ok) {
        const errMsg = `Failed to fetch molecule data from PubChem API. Status: ${response.status}`;
        return res.status(500).send({ error: errMsg });
    }

    const molFileData = await response.text();

    const filePath = `public/molfiles/${cid}.mol`;
    try {
        fs.writeFileSync(filePath, molFileData, 'utf8');
        console.log('Molecule file saved:', filePath);
    } catch (error) {
        const errMsg = 'Error saving molecule file: ' + error;
        console.error(errMsg);
        return res.status(500).send({ error: errMsg });
    }

    // Read molfileCatalog json file and add info to it
    var rawdata = fs.readFileSync('./public/catalog/molfileCatalog.json');
    var parsedData = JSON.parse(rawdata);

    // Variables to be added to molfileCatalog
    var fileName = `${cid}.mol`
    var molName = req.body.name;
    var molFormula = req.body.formula
    var molDescription = "blabalbla"

    parsedData[fileName] = {
        name: molName,
        formula: molFormula,
        description: molDescription
    };

    var newMol = JSON.stringify(parsedData);
    fs.writeFileSync('./public/catalog/molfileCatalog.json', newMol);

    return res.send({ message: 'Molecule created' });
});

module.exports = router;