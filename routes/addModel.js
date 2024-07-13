var express = require('express');
var multer = require('multer');
var router = express.Router();
var fs = require('fs');
const path = require('path');

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

module.exports = router;
