var express = require('express');
var router = express.Router();
var fs = require('fs');
const { checkSession } = require('./auth/session-mgmt');

// Post request when clicking submit button
router.post('/', (req, res) => {
    let { isAdmin, isowner } = checkSession(req, res);
    if (!isAdmin) return res.status(401).send({ error: "User not logged in" });

    // Assign values from form to variables
    var molName = req.body.name;
    var molFormula = req.body.formula;
    var molDescription = req.body.description;
    var fileName = req.body.fileName;
    var molFileContent = req.body.preview;

    var molfiles = fs.readdirSync('./public/molfiles/');
    var fileIsPresent = molfiles.includes(fileName);

    // Check if the molecule already exists
    if (fileIsPresent) {
        return res.status(400).send({ error: 'This molecule already exists' });
    }

    // Create new mol file in ./public/molefiles/
    fs.writeFile('./public/molfiles/' + fileName, molFileContent, function (err) {
        if (err) {
            return res.status(500).send({ error: 'Cannot save the molecule: ' + err });
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

    return res.send({ message: 'Successfully saved the molecule!' });
});

router.post('/saveMolFile', async (req, res) => {
    let { isAdmin, isowner } = checkSession(req, res);
    if (!isAdmin) return res.status(401).send({ error: "User not logged in" });

    // Assign values from form to variables
    const cid = req.body.pubchemId;
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