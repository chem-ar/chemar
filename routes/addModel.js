const { deepStrictEqual } = require('assert');
var express = require('express');
var router = express.Router();
var fs = require('fs');
const notifier = require('node-notifier'); // Node Notifiers: https://www.npmjs.com/package/node-notifier

router.get('/', function(req, res, next) {
    res.render('addModel', {title: 'Add New Model'});
});

//This endpoint needs to be completed to handle the uploading for the files to public/modelfiles
router.post('/saveModel', upload.array('modelFiles', 5), async (req, res) => {
    // Assign values from form to variables
    var name = req.body.name;
    console.log(name);
    
    var modelDescription = req.body.modelDescription;
    console.log(modelDescription);
    
    var models = fs.readdirSync('./public/modelfiles/');
    var fileIsPresent = models.includes(modelFiles);

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
    for (let i = 0; i < modelFiles.length; i++) {
        const file = modelFiles[i];
        const fileName = file.filename;
        const filePath = `public/modelfiles/${fileName}`;

        // Check if the file already exists
        if (fs.existsSync(filePath)) {
            console.log(`File ${fileName} already exists.`);
            notifier.notify({
                title: 'Save Unsuccessful.',
                message: `Cannot save file ${fileName}, it already exists.`,
            });
            // Redirect back to the catalog page
            return res.redirect('/models');
        }
    }


        // Read modelFileCatalog json file and add info to it
        var rawdata = fs.readFileSync('./public/catalog/modelFileCatalog.json');
        var parsedData = JSON.parse(rawdata);

        // Variables to be added to modelFileCatalog
        
        var modelName = req.body.name;
        
        parsedData[modelName] = {
            name: modelName,
            description: modelDescription,
            modelFiles: modelFiles.map(file => file.filename)
        };

        var newModel = JSON.stringify(parsedData);
        fs.writeFileSync('./public/catalog/modelFileCatalog.json', newModel);
        console.log('Model created');

        // Redirect back to the catalog page
        return res.redirect('/models');
    }
);

module.exports = router;
