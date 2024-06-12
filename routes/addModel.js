const { deepStrictEqual } = require('assert');
var express = require('express');
var multer = require('multer');
var router = express.Router();
var fs = require('fs');
const path = require('path');
const notifier = require('node-notifier'); // Node Notifiers: https://www.npmjs.com/package/node-notifier

// Set up multer to handle file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/modelfiles/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})
const upload = multer({
    storage: storage
});

router.get('/', function (req, res, next) {
    res.render('addModel', { title: 'Add New Model' });
});

const uploadMiddleware = upload.fields([
    { name: 'objFileName', maxCount: 1 },
    { name: 'mtlFileName', maxCount: 1 }
]);

//This endpoint needs to be completed to handle the uploading for the files to public/modelfiles
router.post('/saveModel', uploadMiddleware, (req, res) => {
    const name = req.body.name;
    const modelDescription = req.body.modelDescription;
    const objFile = req.files['objFileName'][0];
    const mtlFile = req.files['mtlFileName'][0];

    const models = fs.readdirSync('./public/modelfiles/');
    const fileIsPresent1 = models.includes(objFile.originalname);
    const fileIsPresent2 = models.includes(mtlFile.originalname);

    // Check if the model already exists
    if (fileIsPresent1 && fileIsPresent2) {
        console.log('This model already exists.');
        notifier.notify({
            title: 'Save Unsuccessful.',
            message: 'Cannot save file This model already exists.',
        });
        // Redirect back to the catalog page
        return res.redirect('/models');
    }
    const newObjFileName = name + path.extname(objFile.originalname);
    const newMtlFileName = name + path.extname(mtlFile.originalname);

    fs.renameSync(objFile.path, path.join(objFile.destination, newObjFileName));
    fs.renameSync(mtlFile.path, path.join(mtlFile.destination, newMtlFileName));

    // Read modelFileCatalog json file and add info to it
    var rawdata = fs.readFileSync('./public/catalog/modelFileCatalog.json');
    var parsedData = JSON.parse(rawdata);

    // Variables to be added to modelFileCatalog
    var modelName = req.body.name;

    parsedData[modelName] = {
        name: modelName,
        description: modelDescription,
        files: {
            obj: newObjFileName,
            mtl: newMtlFileName
        }
    };

    var newModel = JSON.stringify(parsedData);
    fs.writeFileSync('./public/catalog/modelFileCatalog.json', newModel);

    // Redirect back to the catalog page
    return res.redirect('/models');
}
);

module.exports = router;
