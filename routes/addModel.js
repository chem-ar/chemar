var express = require('express');
var multer = require('multer');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var obj2gltf = require('obj2gltf');
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

const uploadMiddleware = upload.fields([
    { name: 'objFileName', maxCount: 1 },
    { name: 'mtlFileName', maxCount: 1 },
    { name: 'gltfFileName', maxCount: 1 },
    { name: 'binFileName', maxCount: 1 },
    { name: 'glbFileName', maxCount: 1 }
]);

const catalogPath = './public/catalog/modelFileCatalog.json';

async function convertOBJToGLB(objPath, outputGlbPath) {
    try {
        const glb = await obj2gltf(objPath, { binary: true });
        fs.writeFileSync(outputGlbPath, glb);
        return outputGlbPath;
    } catch (error) {
        console.error('Error converting OBJ to GLB:', error);
        return null;
    }
}

router.post('/saveModel', uploadMiddleware, async (req, res) => {
    const name = req.body.name;
    const modelDescription = req.body.modelDescription;
    let { isAdmin } = checkSession(req, res);
    if (!isAdmin) {
        Object.values(req.files).flat().forEach(file => fs.unlinkSync(file.path));
        return res.status(401).send({ error: "User not logged in" });
    }

    let parsedData = JSON.parse(fs.readFileSync(catalogPath));
    for (const entry of parsedData) {
        if (entry.name === name && entry.description === modelDescription) {
            Object.values(req.files).flat().forEach(file => fs.unlinkSync(file.path));
            return res.status(400).send({ error: 'This model already exists' });
        }
    }

    const newId = parsedData.length ? parsedData[parsedData.length - 1].id + 1 : 1;
    let modelEntry = { id: newId, name, description: modelDescription, files: {} };

    if (req.files['objFileName']) {
        const objFile = req.files['objFileName'][0];
        const objFileNameWithoutExt = path.parse(objFile.originalname).name;
        const outputGlbPath = path.join('public/modelfiles', `${objFileNameWithoutExt}.glb`);
        const convertedGlbPath = await convertOBJToGLB(objFile.path, outputGlbPath);
        
        if (convertedGlbPath) {
            modelEntry.files.glb = `${objFileNameWithoutExt}.glb`;
        }
        fs.unlinkSync(objFile.path);
    }

    if (req.files['gltfFileName']) {
        const gltfFile = req.files['gltfFileName'][0];
        const binFile = req.files['binFileName'] ? req.files['binFileName'][0] : null;
        
        const newGltfFileName = gltfFile.originalname;
        fs.renameSync(gltfFile.path, path.join(gltfFile.destination, newGltfFileName));
        modelEntry.files.gltf = newGltfFileName;
        
        if (binFile) {
            const newBinFileName = binFile.originalname;
            fs.renameSync(binFile.path, path.join(binFile.destination, newBinFileName));
            modelEntry.files.bin = newBinFileName;
        }
    }

    if (req.files['glbFileName']) {
        const glbFile = req.files['glbFileName'][0];
        const newGlbPath = path.join(glbFile.destination, glbFile.originalname);
        fs.renameSync(glbFile.path, newGlbPath);
        modelEntry.files.glb = glbFile.originalname;
    }

    parsedData.push(modelEntry);
    fs.writeFileSync(catalogPath, JSON.stringify(parsedData, null, 2));

    res.send({ message: 'Model saved!' });
});

module.exports = router;
