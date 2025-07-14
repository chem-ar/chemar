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
})
const upload = multer({
    storage: storage
});
 
router.get('/', function (req, res, next) {
    res.render('addModel', { title: 'Add New Model' });
});
//To handle file uploading
const uploadMiddleware = upload.fields([
    { name: 'objFileName', maxCount: 1 },
    { name: 'mtlFileName', maxCount: 1 }
]);
 
//Creation of unique ID for different models which can be displayed in modelFileCatalog.json
const uniqueId = (parsedData) => {
    if (parsedData.length == 0) {
        return 1;
    }
    let length = parsedData.length
    let lastObj = parsedData[length - 1];
    return (lastObj.id) + 1;
}
 
//This endpoint needs to be completed to handle the uploading for the files to public/modelfiles
router.post('/saveModel', uploadMiddleware, (req, res) => {
    const name = req.body.name;
    const modelDescription = req.body.modelDescription;
    const objFile = req.files['objFileName'][0];
    const mtlFile = req.files['mtlFileName'][0];
 
    let {isAdmin, isowner} = checkSession(req, res);
    if (!isAdmin) {
        // delete files saved by multer
        fs.unlinkSync(objFile.path);
        fs.unlinkSync(mtlFile.path);
       
        return res.status(401).send({ error: "User not logged in" });
    }
 
    // Read modelFileCatalog json file and add info to it
    var rawdata = fs.readFileSync('./public/catalog/modelFileCatalog.json');
    var parsedData = JSON.parse(rawdata);
    // To check whether the model is present or not
    for(const key in parsedData) {
        if(parsedData[key].name == req.body.name){
            if(parsedData[key].description == modelDescription){
                // delete files saved by multer
                fs.unlinkSync(objFile.path);
                fs.unlinkSync(mtlFile.path);
 
                return res.status(400).send({
                    error: 'This model already exists'
                });
            }
        }
    }
    //Changing the format of files saved as modelNmae-ID
    const newObjFileName = `${name}-${uniqueId(parsedData)}.obj`;
    const newMtlFileName = `${name}-${uniqueId(parsedData)}.mtl`;
    fs.renameSync(objFile.path, path.join(objFile.destination, newObjFileName));
    fs.renameSync(mtlFile.path, path.join(mtlFile.destination, newMtlFileName));
 
    // Variables to be added to modelFileCatalog
    var modelName = req.body.name;
    obj = {
        id: uniqueId(parsedData),
        name: modelName,
        description: modelDescription,
        files: {
            obj: newObjFileName,
            mtl: newMtlFileName
        }
    }
 
    parsedData.push(obj)
 
    var newModel = JSON.stringify(parsedData);
    fs.writeFileSync('./public/catalog/modelFileCatalog.json', newModel);
 
    return res.send({ message: 'Model saved!' });
}
);
 
// Function to parse incoming file data from Jmol request
const parseFileFromJmolReq = (req, fileName) => {
    // Extract file data from the request body
    const fileData = Object.keys(req.body)[0];
    // Remove the base64 prefix and newline characters
    const pureEncodedData = fileData.substring(8).replaceAll('\r\n', "");
    
    // For text-based files (like OBJ), decode to string
    if (fileName && (fileName.endsWith('.obj') || fileName.endsWith('.mtl'))) {
        // Decode from base64 to string for text files
        const decodedData = Buffer.from(pureEncodedData, 'base64').toString('utf8');
        return decodedData;
    }
    
    // For binary files, return as Buffer
    const decodedData = Buffer.from(pureEncodedData, 'base64');
    return decodedData;
};
 
// for checking model's status using quicksave
let modelSaveStatus = {};
 
// Endpoint to save models directly from the molecule page through jmol instead of local download.
router.post('/quickSaveModel/:modelname/:modelDesc/:fileName', (req, res) => {
    const { modelname, modelDesc, fileName } = req.params;
    const fileData = parseFileFromJmolReq(req, fileName);
 
    // path for saving the file then writing the file in the folder
    const filePath = path.join(__dirname, '../public/modelfiles', fileName);
    fs.writeFileSync(filePath, fileData);
 
    // Read the modelFileCatalog.json file
    const catalogPath = path.join(__dirname, '../public/catalog/modelFileCatalog.json');
    let parsedData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
   
    try {
   
        // If it's an .obj file, create a new entry in the catalog
        if (fileName.endsWith('.obj')) {
            // Check if the model already exists
            for (const entry of parsedData) {
                if (entry.name === modelname && entry.description === decodeURIComponent(modelDesc)) {
                    modelSaveStatus[modelname] = { error: 'This model already exists' };
                    return res.status(400).send({
                        error: 'This model already exists'
                    });
                }
            }
 
            // Create a new unique ID for the model, used from an existing function
            const newId = uniqueId(parsedData);
           
            // Create new entry
            const newObjFileName = `${modelname}-${newId}.obj`;
            const newEntry = {
                id: newId,
                name: modelname,
                description: decodeURIComponent(modelDesc),
                files: {
                    obj: newObjFileName
                }
            };
 
            // Rename the saved .obj file to the new format
            fs.renameSync(filePath, path.join(__dirname, '../public/modelfiles', newObjFileName));
            // Add the new entry to the catalog
            parsedData.push(newEntry);
        }
        // If it's an .mtl file, find the existing entry and update it
        else if (fileName.endsWith('.mtl')) {
            const modelEntry = parsedData.find(entry => entry.name === modelname && entry.description === decodeURIComponent(modelDesc) );
 
            if (modelEntry && !modelEntry.files.mtl) {
                const newMtlFileName = `${modelname}-${modelEntry.id}.mtl`;
 
                // Rename the saved .mtl file to the new format
                fs.renameSync(filePath, path.join(__dirname, '../public/modelfiles', newMtlFileName));
 
                // Add the .mtl file to the files array in the catalog entry
                modelEntry.files.mtl = newMtlFileName;
            } else if(modelEntry.files.mtl) {
                modelSaveStatus[modelname] = { error: 'This model already exists' };
                return res.status(400).send({
                    error: 'This model already exists'
                });
            }else {
                modelSaveStatus[modelname] = { error: 'Model not found' };
                return res.status(404).send({
                    error: 'Model not found'
                });
            }
        }
 
        // Save the updated catalog back to the file
        fs.writeFileSync(catalogPath, JSON.stringify(parsedData, null, 2));
 
        modelSaveStatus[modelname] = { success: true };
 
        res.send({ message: `${fileName} saved and catalog updated successfully` });
    }catch (error) {
        modelSaveStatus[modelname] = { error: 'Failed to save model' };
        res.status(500).send({ error: 'Failed to save model' });
    }
});
 
router.get('/modelStatus/:modelname', (req, res) => {
    const { modelname } = req.params;
    const isSaved = modelSaveStatus[modelname] || false;
    res.json({ isSaved });
});
module.exports = router;
 
 