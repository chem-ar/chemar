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
    } else {
        return res.status(409).send('');
    }
    
    fs.writeFileSync(modelFileCatalog, JSON.stringify(modelData));
    return res.redirect('/models');
});

// Handling the delete functionality
router.delete('/delete', function (req, res, next) {
    let { isAdmin } = checkSession(req, res);
    if (!isAdmin) return res.status(401).send({ error: "User not logged in" });

    const id = req.body.id;
    const modelFileCatalog = './public/catalog/modelFileCatalog.json';

    try {
        const modelFileData = fs.readFileSync(modelFileCatalog, 'utf8');
        const modelData = JSON.parse(modelFileData);

        let modelIndex = modelData.findIndex(model => model.id === parseInt(id));

        if (modelIndex === -1) {
            console.error(`Model with ID ${id} not found.`);
            return res.status(404).send({ error: "Model not found" });
        }

        const modelDelete = modelData[modelIndex];
        const filesToDelete = [];

        // Delete model files based on the catalog entry
        Object.values(modelDelete.files).forEach(file => {
            const filePath = `./public/modelfiles/${file}`;
            if (fs.existsSync(filePath)) {
                filesToDelete.push(filePath);
            } else {
                console.warn(`File not found: ${filePath}`);
            }
        });

        // Delete files
        filesToDelete.forEach(file => {
            try {
                fs.unlinkSync(file);
                console.log(`Deleted: ${file}`);
            } catch (err) {
                console.error(`Error deleting ${file}:`, err);
            }
        });

        // Remove model from catalog
        modelData.splice(modelIndex, 1);
        fs.writeFileSync(modelFileCatalog, JSON.stringify(modelData, null, 2));

        return res.status(200).send({ message: "Model deleted successfully" });

    } catch (error) {
        console.error("Error deleting model:", error);
        return res.status(500).send({ error: "Internal server error" });
    }
});

module.exports = router;
