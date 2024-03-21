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