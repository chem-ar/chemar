var express = require('express');
var router = express.Router();
var fs = require('fs');
const notifier = require('node-notifier'); // Node Notifiers: https://www.npmjs.com/package/node-notifier

router.get('/', function(req, res, next) {
    res.render('addModel', {title: 'Add New Model'});
});

<<<<<<< HEAD
router.post('/saveModel', async (req, res) => {
=======
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
        // Create new mol file in ./public/modelfiles/
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

router.post('/saveModelFile', async (req, res) => {
>>>>>>> 3ee41719567f108f48dd56aaebcbd07cedf10709
    // Assign values from form to variables
    var fileName = req.body.modelName;
    console.log(fileName);
    
    var models = fs.readdirSync('./public/modelfiles/');
    var fileIsPresent = modelfiles.includes(fileName);

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

        const filePath = `public/modelfiles/${fileName}`;
        try {
            fs.writeFileSync(filePath, modelFileData, 'utf8');
            console.log('Model file saved:', filePath);
        } catch (error) {
            console.error('Error saving model file:', error);
        }

        // Read modelFileCatalog json file and add info to it
        var rawdata = fs.readFileSync('./public/catalog/modelFileCatalog.json');
        var parsedData = JSON.parse(rawdata);

        // Variables to be added to modelFileCatalog
        
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
