const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { checkSession } = require('./auth/session-mgmt');

const router = express.Router();

// Base uploads directory
const UPLOADS_DIR = 'uploads';

// Set up multer storage for multiple file types
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Get file extension without the dot
        const ext = path.extname(file.originalname).toLowerCase().substring(1);
        
        // Define target directory based on extension
        const targetDir = `${UPLOADS_DIR}/${ext}`;
        // Ensure the upload directory exists
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        cb(null, targetDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Limit files to 50MB
    fileFilter: (req, file, cb) => {
        const allowedExtensions = [".obj", ".mtl", ".bin", ".gltf", ".glb", ".fbx"];
        if (!allowedExtensions.includes(path.extname(file.originalname).toLowerCase())) {
            return cb(new Error("Invalid file type. Allowed: .obj, .mtl, .bin, .gltf, .glb, .fbx"));
        }
        cb(null, true);
    }
});

// API Endpoint to handle file uploads
router.post('/saveModel', upload.array("modelFiles", 10), (req, res) => {
    const name = req.body.name;
    const modelDescription = req.body.modelDescription;
    let { isAdmin } = checkSession(req, res);

    if (!isAdmin) {
        // Delete uploaded files if the user is unauthorized
        req.files.forEach(file => fs.unlinkSync(file.path));
        return res.status(401).send({ error: "Unauthorized user" });
    }

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
    }

    // Read modelFileCatalog.json
    const catalogPath = path.join(__dirname, '../public/catalog/modelFileCatalog.json');
    let parsedData = fs.existsSync(catalogPath) ? JSON.parse(fs.readFileSync(catalogPath, 'utf8')) : [];

    // Check for duplicate model
    const duplicate = parsedData.some(entry => entry.name === name && entry.description === modelDescription);
    if (duplicate) {
        req.files.forEach(file => fs.unlinkSync(file.path));
        return res.status(400).send({ error: 'This model already exists' });
    }

    // Create a new model entry
    const newId = parsedData.length ? parsedData[parsedData.length - 1].id + 1 : 1;
    const uploadedFiles = req.files.map(file => file.filename);

    const newModel = {
        id: newId,
        name: name,
        description: modelDescription,
        files: uploadedFiles
    };

    // Save the new entry to modelFileCatalog.json
    parsedData.push(newModel);
    fs.writeFileSync(catalogPath, JSON.stringify(parsedData, null, 2));

    return res.send({ message: "Model uploaded successfully", files: uploadedFiles });
});

// Function to parse incoming file data from Jmol request
const parseFileFromJmolReq = (req) => {
    const fileData = Object.keys(req.body)[0];
    const pureEncodedData = fileData.substring(8).replaceAll('\r\n', "");
    return Buffer.from(pureEncodedData, 'base64');
};

let modelSaveStatus = {};

router.post('/quickSaveModel/:modelname/:modelDesc/:fileName', (req, res) => {
    const { modelname, modelDesc, fileName } = req.params;
    const fileData = parseFileFromJmolReq(req);

    const filePath = path.join(__dirname, '../public/modelfiles', fileName);
    fs.writeFileSync(filePath, fileData);

    const catalogPath = path.join(__dirname, '../public/catalog/modelFileCatalog.json');
    let parsedData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    
    try {
        if (fileName.endsWith('.obj')) {
            for (const entry of parsedData) {
                if (entry.name === modelname && entry.description === decodeURIComponent(modelDesc)) {
                    return res.status(400).send({ error: 'This model already exists' });
                }
            }
            const newId = uniqueId(parsedData);
            const newObjFileName = `${modelname}-${newId}.obj`;
            fs.renameSync(filePath, path.join(__dirname, '../public/modelfiles', newObjFileName));
            parsedData.push({ id: newId, name: modelname, description: decodeURIComponent(modelDesc), files: { obj: newObjFileName } });
        } else if (fileName.endsWith('.mtl')) {
            const modelEntry = parsedData.find(entry => entry.name === modelname && entry.description === decodeURIComponent(modelDesc));
            if (modelEntry && !modelEntry.files.mtl) {
                const newMtlFileName = `${modelname}-${modelEntry.id}.mtl`;
                fs.renameSync(filePath, path.join(__dirname, '../public/modelfiles', newMtlFileName));
                modelEntry.files.mtl = newMtlFileName;
            } else {
                return res.status(404).send({ error: 'Model not found' });
            }
        }
        fs.writeFileSync(catalogPath, JSON.stringify(parsedData, null, 2));
        res.send({ message: `${fileName} saved successfully` });
    } catch (error) {
        res.status(500).send({ error: 'Failed to save model' });
    }
});

// Endpoint to check model status
router.get('/modelStatus/:modelname', (req, res) => {
    const { modelname } = req.params;
    res.json({ isSaved: modelSaveStatus[modelname] || false });
});

module.exports = router;

