var express = require('express');
var multer = require('multer');
var router = express.Router();
var fs = require('fs');
const path = require('path');
const { checkSession } = require('./auth/session-mgmt');

// Set up multer to handle file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/modelfiles/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
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
    const fileType = req.body.fileType; // "obj-mtl" or "gltf"
    
    let { isAdmin } = checkSession(req, res);
    if (!isAdmin) {
        // Delete any uploaded files
        if (req.files['objFileName']) fs.unlinkSync(req.files['objFileName'][0].path);
        if (req.files['mtlFileName']) fs.unlinkSync(req.files['mtlFileName'][0].path);
        if (req.files['gltfFileName']) fs.unlinkSync(req.files['gltfFileName'][0].path);
        if (req.files['glbFileName']) fs.unlinkSync(req.files['glbFileName'][0].path);

        return res.status(401).send({ error: "User not logged in" });
    }

    // Read model catalog
    const catalogPath = './public/catalog/modelFileCatalog.json';
    var parsedData = JSON.parse(fs.readFileSync(catalogPath));

    // Check if the model already exists
    for (const entry of parsedData) {
        if (entry.name === name && entry.description === modelDescription) {
            // Delete uploaded files
            if (req.files['objFileName']) fs.unlinkSync(req.files['objFileName'][0].path);
            if (req.files['mtlFileName']) fs.unlinkSync(req.files['mtlFileName'][0].path);
            if (req.files['gltfFileName']) fs.unlinkSync(req.files['gltfFileName'][0].path);
            if (req.files['glbFileName']) fs.unlinkSync(req.files['glbFileName'][0].path);

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

        const newObjFileName = `${name}-${newId}.obj`;
        const newMtlFileName = `${name}-${newId}.mtl`;

        fs.renameSync(objFile.path, path.join(objFile.destination, newObjFileName));
        fs.renameSync(mtlFile.path, path.join(mtlFile.destination, newMtlFileName));

        modelEntry.files.obj = newObjFileName;
        modelEntry.files.mtl = newMtlFileName;
    }
    // Handle GLTF file upload
    else if (fileType === 'gltf') {
        const gltfFile = req.files['gltfFileName'][0];

        const newGltfFileName = `${name}-${newId}.gltf`;
        fs.renameSync(gltfFile.path, path.join(gltfFile.destination, newGltfFileName));

        modelEntry.files.gltf = newGltfFileName;
    }
    //Handle GLB file upload
    else if (fileType === 'glb') {
        const gltfFile = req.files['glbFileName'][0];

        const newGlbFileName = `${name}-${newId}.glb`;
        fs.renameSync(glbFile.path, path.join(glbFile.destination, newGlbfFileName));

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

