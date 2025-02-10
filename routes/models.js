var express = require('express');
var router = express.Router();
var fs = require('fs');
var { checkSession } = require('./auth/session-mgmt');

/* GET models page. */
router.get('/', function (req, res, next) {
    let { isAdmin, isowner } = checkSession(req, res);
    if (!isAdmin) return res.redirect("/");
    res.render('models', { title: 'Model Catalog', isAdmin: isAdmin, isowner });
});

// To handle the edit functionality
router.post('/edit', function (req, res, next) {
    let { isAdmin, isowner } = checkSession(req, res);
    if (!isAdmin) return res.status(401).send({ error: "User not logged in" });

    const data = { ...req.body };
    let id = req.query.id;
    const modelFileCatalog = './public/catalog/modelFileCatalog.json';
    const modelFileData = fs.readFileSync(modelFileCatalog);
    const modelData = JSON.parse(modelFileData);

    let n;
    let exists = false;
    
    for (const key in modelData) {
        if (modelData[key].id == parseInt(id)) {
            n = key;
        }
        if (modelData[key].name == data.name && modelData[key].description == data.description) {
            exists = true;
        }
    }
    
    if (!exists) {
        const previousName = modelData[n].name;
        modelData[n].description = data.description;
        modelData[n].name = data.name;
        modelData[n].files = {
            obj: `${data.name}-${id}.obj`,
            mtl: `${data.name}-${id}.mtl`
        };
        fs.renameSync(`./public/modelfiles/${previousName}-${id}.mtl`, `./public/modelfiles/${data.name}-${id}.mtl`);
        fs.renameSync(`./public/modelfiles/${previousName}-${id}.obj`, `./public/modelfiles/${data.name}-${id}.obj`);
    } else {
        return res.status(409).send('');
    }
    
    fs.writeFileSync(modelFileCatalog, JSON.stringify(modelData));
    return res.redirect('/models');
});

// Handling the delete functionality
router.delete('/delete', function (req, res, next) {
    let { isAdmin, isowner } = checkSession(req, res);
    if (!isAdmin) return res.status(401).send({ error: "User not logged in" });

    const id = req.body.id;
    const modelFileCatalog = './public/catalog/modelFileCatalog.json';
    const modelFileData = fs.readFileSync(modelFileCatalog);
    const modelData = JSON.parse(modelFileData);

    let n = -1;
    for (const key in modelData) {
        if (modelData[key].id == parseInt(id)) {
            n = key;
        }
    }
    if (n === -1) return res.status(404).send({ error: "Model not found" });
    
    const modelDelete = modelData[n];
    
    // Deleting the .mtl, .obj, and .gltf files if they exist
    const filesToDelete = [
        `./public/modelfiles/${modelDelete.files.mtl}`,
        `./public/modelfiles/${modelDelete.files.obj}`,
        `./public/modelfiles/${modelDelete.name}-${id}.gltf`
    ];
    
    filesToDelete.forEach(file => {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
    });
    
    // Remove model from array
    modelData.splice(n, 1);
    
    fs.writeFileSync(modelFileCatalog, JSON.stringify(modelData));
    return res.status(200).send({ message: "Model deleted successfully" });
});

module.exports = router;
