var express = require('express');
var router = express.Router();
var fs = require('fs');
const { parse } = require('path');
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
        const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/SDF/?record_type=3d&response_type=display`;
        const data = fetchData(url)
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log('Molecule file saved:', fileName);
                resolve();
            }
        });
    });
}

/**
 * Function to fetch data from a URL.
 * @param {string} url - The URL to fetch.
 * @returns {Promise<string>} - Promise resolving to the fetched data.
 */
function fetchData(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            return data.trim();
        });
}

router.post('/test', (req, res) => {
    var molfiles = fs.readdirSync('./public/molfiles/')
    var testCheck = "702.mol"

    var fileIsPresent = molfiles.includes(testCheck);

    res.send(`files: ${JSON.stringify(molfiles)} \n chck: ${testCheck} \n ispresent: ${fileIsPresent}`);    
});

// Post request when clicking submit button
router.post('/saveMolFile', async (req, res) => {
    // Assign values from form to variables
    const cid = req.body.pubchemId;
    console.log(cid);
    fileName = `${cid}`
    

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
        const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid.pubchemId}/record/SDF/?record_type=3d&response_type=display`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch molecule data from PubChem API. Status: ${response.status}`);
        }
        
        var molFileData = await response.text();
        
        // Read json file and add info to it
        var rawdata = fs.readFileSync('./public/catalog/molfileCatalog.json');
        var parsedData = JSON.parse(rawdata);
        var fileName = `${cid.pubchemId}.mol`
        console.log(fileName)

        parsedData[fileName] = {
            name: molName,
            formula: molFormula,
            description: molDescription
        };

        var newMol = JSON.stringify(parsedData);
        fs.writeFileSync('./public/catalog/molfileCatalog.json', newMol);
        console.log('This molecule already exists.');
    }

    // Return to catalog page
    res.redirect('/molecules');
});

module.exports = router;