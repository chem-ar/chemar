var express = require('express');
var multer = require('multer');
var router = express.Router();
var fs = require('fs');
const path = require('path');
const { checkSession } = require('./auth/session-mgmt');

// Object to track model save status
const modelSaveStatus = {};


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

// Route to handle quick save model from Jmol (receives .obj file directly)
router.post('/quickSaveModel/:modelName/:modelDesc/:fileName', (req, res) => {
    try {
        const { modelName, modelDesc, fileName } = req.params;
        
        // Decode URL parameters
        const decodedModelName = decodeURIComponent(modelName);
        const decodedModelDesc = decodeURIComponent(modelDesc);
        const decodedFileName = decodeURIComponent(fileName);
        
        console.log(`Saving model: ${decodedModelName}, file: ${decodedFileName}`);
        console.log('Request body type:', typeof req.body);
        console.log('Request body keys:', req.body ? Object.keys(req.body) : 'null');
        console.log('Request body content:', req.body);
        
        // Check if user is admin
        let { isAdmin } = checkSession(req, res);
        if (!isAdmin) {
            modelSaveStatus[decodedModelName] = { error: "User not logged in" };
            return res.status(401).send({ error: "User not logged in" });
        }

        // Save the file data to the modelfiles directory
        const modelfilesDir = 'public/modelfiles';
        if (!fs.existsSync(modelfilesDir)) {
            fs.mkdirSync(modelfilesDir, { recursive: true });
        }
        
        const filePath = path.join(modelfilesDir, decodedFileName);
        
        // Handle the body based on what JMol is actually sending
        let fileContent = '';
        if (typeof req.body === 'string') {
            fileContent = req.body;
        } else if (typeof req.body === 'object' && req.body !== null) {
            // If it's an object, maybe JMol is sending JSON with file content
            if (req.body.content) {
                fileContent = req.body.content;
            } else if (req.body.data) {
                fileContent = req.body.data;
            } else {
                // Try to extract any string values from the object
                const values = Object.values(req.body);
                fileContent = values.find(v => typeof v === 'string') || JSON.stringify(req.body);
            }
        }
        
        fs.writeFileSync(filePath, fileContent);
        
        console.log(`File saved to: ${filePath}`);

        // Only update the catalog when we receive the .obj file (not for .mtl)
        if (decodedFileName.endsWith('.obj')) {
            // Wait a moment for potential .mtl file to also be saved
            setTimeout(() => {
                try {
                    // Read model catalog
                    const catalogPath = './public/catalog/modelFileCatalog.json';
                    let parsedData;
                    try {
                        parsedData = JSON.parse(fs.readFileSync(catalogPath));
                    } catch (error) {
                        modelSaveStatus[decodedModelName] = { error: "Unable to read model catalog" };
                        return;
                    }

                    // Check if the model already exists
                    for (const entry of parsedData) {
                        if (entry.name === decodedModelName && entry.description === decodedModelDesc) {
                            modelSaveStatus[decodedModelName] = { error: 'This model already exists' };
                            return;
                        }
                    }

                    // Assign a unique ID
                    const newId = uniqueId(parsedData);

                    let modelEntry = {
                        id: newId,
                        name: decodedModelName,
                        description: decodedModelDesc,
                        files: {
                            obj: decodedFileName
                        }
                    };

                    // Check if there's also an .mtl file
                    const mtlFileName = decodedFileName.replace('.obj', '.mtl');
                    const mtlFilePath = path.join('public/modelfiles', mtlFileName);
                    if (fs.existsSync(mtlFilePath)) {
                        modelEntry.files.mtl = mtlFileName;
                        console.log(`Found MTL file: ${mtlFileName}`);
                    }

                    // Add model to catalog
                    parsedData.push(modelEntry);
                    fs.writeFileSync(catalogPath, JSON.stringify(parsedData, null, 2));

                    // Mark as successfully saved
                    modelSaveStatus[decodedModelName] = { success: true };
                    
                    console.log(`Model catalog updated for: ${decodedModelName}`);
                } catch (error) {
                    console.error('Error updating catalog:', error);
                    modelSaveStatus[decodedModelName] = { error: "Error updating catalog" };
                }
            }, 500); // Wait 500ms for potential MTL file
        }

        return res.send({ message: 'File saved successfully!' });

    } catch (error) {
        console.error('Error in quickSaveModel:', error);
        const modelName = decodeURIComponent(req.params.modelName);
        modelSaveStatus[modelName] = { error: "Internal server error" };
        return res.status(500).send({ error: "Internal server error" });
    }
});


// Endpoint to check model status
router.get('/modelStatus/:modelname', (req, res) => {
    try {
        const { modelname } = req.params;
        console.log(`Checking model status for: ${modelname}`);
        const status = modelSaveStatus[modelname] || false;
        console.log(`Model status: ${JSON.stringify(status)}`);
        res.json({ isSaved: status });
    } catch (error) {
        console.error('Error in modelStatus endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
