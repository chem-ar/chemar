var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function(req, res, next) {
    res.render('addMolecule', {title: 'Add New Molecule'});
});

router.post('/test', (req, res) => {
    var molfiles = fs.readdirSync('./public/molfiles/')
    var testCheck = "702.mol"

    var fileIsPresent = molfiles.includes(testCheck);

    res.send(`files: ${JSON.stringify(molfiles)} \n chck: ${testCheck} \n ispresent: ${fileIsPresent}`);    
});

// Post request when clicking submit button
router.post('/', (req, res) => {
    //console.log(req.body.name);
    //console.log(req.body.formula);
    //console.log(req.body.fileName);
    //console.log(req.body.preview);

    // Assign values from form to variables
    var molName = req.body.name;
    var molFormula = req.body.formula;
    var fileName = req.body.fileName;
    var molFileContent = req.body.preview;

    var molfiles = fs.readdirSync('./public/molfiles/');
    var fileIsPresent = molfiles.includes(fileName);

    // Check if the molecule already exists
    if (fileIsPresent) {
        console.log('This molecule already exists.');
    }
    else {
        // Create new mol file in ./public/molefiles/
        fs.writeFile('./public/molefiles/'+fileName, molFileContent, function (err) {
            if (err) throw err;
                console.log('New molecule created');
        });
    }    

    // Return to catalog page
    res.redirect('/catalog');
});

module.exports = router;