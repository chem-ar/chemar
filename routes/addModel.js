var express = require('express');
var multer = require('multer');
var router = express.Router();
var fs = require('fs');
const path = require('path');
const { checkSession } = require('./auth/session-mgmt');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/modelfiles/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });


router.get('/', function (req, res, next) {
    res.render('addModel', { title: 'Add New Model' });
});


// Middleware to handle file uploading
const uploadMiddleware = upload.fields([
    { name: 'objFileName', maxCount: 1 },
    { name: 'mtlFileName', maxCount: 1 },
    { name: 'gltfFileName', maxCount: 1 },
    { name: 'binFileName', maxCount: 1 },
    { name: 'glbFileName', maxCount: 1 }
]);


// Generate a unique ID for each model
const uniqueId = (parsedData) => {
    if (parsedData.length == 0) return 1;
    return parsedData[parsedData.length - 1].id + 1;
};


// Handle model saving
router.post('/saveModel', uploadMiddleware, (req, res) => {
    const name = req.body.name;
    const modelDescription = req.body.modelDescription;
    const fileType = req.body.fileType;
   
    let { isAdmin } = checkSession(req, res);
    if (!isAdmin) {
        // Delete any uploaded files
        Object.values(req.files).flat().forEach(file => fs.unlinkSync(file.path));
        return res.status(401).send({ error: "User not logged in" });
    }


    // Read model catalog
    const catalogPath = './public/catalog/modelFileCatalog.json';
    var parsedData = JSON.parse(fs.readFileSync(catalogPath));


    // Check if the model already exists
    for (const entry of parsedData) {
        if (entry.name === name && entry.description === modelDescription) {
            Object.values(req.files).flat().forEach(file => fs.unlinkSync(file.path));
            return res.status(400).send({ error: 'This model already exists' });
        }
    }


    // Assign a unique ID
    const newId = uniqueId(parsedData);


    let modelEntry = {
        id: newId,
        name: name,
        description: modelDescription,
        files: {}
    };


    // Handle OBJ + MTL file uploads
    if (fileType === 'obj-mtl') {
        const objFile = req.files['objFileName'][0];
        const mtlFile = req.files['mtlFileName'][0];


        const newObjFileName = objFile.originalname;
        const newMtlFileName = mtlFile.originalname;


        fs.renameSync(objFile.path, path.join(objFile.destination, newObjFileName));
        fs.renameSync(mtlFile.path, path.join(mtlFile.destination, newMtlFileName));


        modelEntry.files.obj = newObjFileName;
        modelEntry.files.mtl = newMtlFileName;
    }
    // Handle GLTF file upload (must also have .bin file)
    else if (fileType === 'gltf') {
        if (!req.files['binFileName']) {
            Object.values(req.files).flat().forEach(file => fs.unlinkSync(file.path));
            return res.status(400).send({ error: "GLTF file requires a corresponding .bin file." });
        }


        const gltfFile = req.files['gltfFileName'][0];
        const binFile = req.files['binFileName'][0];


        const newGltfFileName = gltfFile.originalname;
        const newBinFileName = binFile.originalname


        fs.renameSync(gltfFile.path, path.join(gltfFile.destination, newGltfFileName));
        fs.renameSync(binFile.path, path.join(binFile.destination, newBinFileName));


        modelEntry.files.gltf = newGltfFileName;
        modelEntry.files.bin = newBinFileName;
    }
    // Handle GLB file upload
    else if (fileType === 'glb') {
        const glbFile = req.files['glbFileName'][0];


        const newGlbFileName = glbFile.originalname;
        fs.renameSync(glbFile.path, path.join(glbFile.destination, newGlbFileName));


        modelEntry.files.glb = newGlbFileName;
    }


    // Add model to catalog
    parsedData.push(modelEntry);
    fs.writeFileSync(catalogPath, JSON.stringify(parsedData, null, 2));


    return res.send({ message: 'Model saved!' });
});


// Endpoint to check model status
router.get('/modelStatus/:modelname', (req, res) => {
    const { modelname } = req.params;
    res.json({ isSaved: modelSaveStatus[modelname] || false });
});


module.exports = router;
