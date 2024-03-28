const { deepStrictEqual } = require('assert');
var express = require('express');
var router = express.Router();
var fs = require('fs');
const notifier = require('node-notifier'); // Node Notifiers: https://www.npmjs.com/package/node-notifier

router.get('/', function(req, res, next) {
    res.render('addModel', {title: 'Add New Model'});
});

router.post('/saveModel', async (req, res) => {
    // Assign values from form to variables
    var fileName = req.body.name;
    console.log(fileName);
    var files = req.body.fileName;
    console.log(files);
    var modelDescription = req.body.modelDescription;
    console.log(modelDescription);
    
    var models = fs.readdirSync('./public/modelfiles/');
    var fileIsPresent = models.includes(fileName);

    // Check if the molecule already exists
    if (fileIsPresent) {
        console.log('This model already exists.');
        notifier.notify({
            title: 'Save Unsuccessful.',
            message: 'Cannot save file This model already exists.',
        });
        // Redirect back to the catalog page
        return res.redirect('/models');
    }
        for (let i = 0; i < files.length; i++){
            console.log(i);
        }

        // Read modelFileCatalog json file and add info to it
        var rawdata = fs.readFileSync('./public/catalog/modelFileCatalog.json');
        var parsedData = JSON.parse(rawdata);

        // Variables to be added to modelFileCatalog
        
        var modelName = req.body.name;
        
        parsedData[fileName] = {
            name: modelName,
            description: modelDescription,
            files: files
        };

        var newModel = JSON.stringify(parsedData);
        fs.writeFileSync('./public/catalog/modelFileCatalog.json', newModel);
        console.log('Model created');

        // Redirect back to the catalog page
        return res.redirect('/models');
    }
);

module.exports = router;
