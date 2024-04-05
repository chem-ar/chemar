const { deepStrictEqual } = require('assert');
var express = require('express');
var multer = require('multer');
var router = express.Router();
var fs = require('fs');
const notifier = require('node-notifier'); // Node Notifiers: https://www.npmjs.com/package/node-notifier

// Set up multer to handle file uploads
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'public/modelfiles')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})
const upload = multer({
    dest: storage
});

const uploadMiddleware = (req, res, next) => {
    upload.array('files', 2)(req, res, (err) => {
        if (err){
            return res.status(400).json({ error: err.message });
        }
    })
}
router.get('/', function(req, res, next) {
    res.render('addModel', {title: 'Add New Model'});
});

//This endpoint needs to be completed to handle the uploading for the files to public/modelfiles
router.post('/saveModel', (req, res) => {
    const name = req.body.name;
    console.log(name);
    const modelDescription = req.body.modelDescription;
    console.log(modelDescription);
    const objFile = req.files['objFileName'][0];
    const mtlFile = req.files['mtlFileName'][0];
    
    const models = fs.readdirSync('./public/modelfiles/');
    const fileIsPresent1 = models.includes(file1.name);
    const fileIsPresent2 = models.includes(file2.name);

    // Check if the model already exists
    if (!fileIsPresent1 && !fileIsPresent2) {
        console.log('This model already exists.');
        notifier.notify({
            title: 'Save Unsuccessful.',
            message: 'Cannot save file This model already exists.',
        });
        // Redirect back to the catalog page
        return res.redirect('/models');
    }

    fs.renameSync(objFile.path, path.join(objFile.destination, name + path.extname(objFile.originalname)));
    fs.renameSync(mtlFile.path, path.join(mtlFile.destination, name + '_description' + path.extname(mtlFile.originalname)));

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
