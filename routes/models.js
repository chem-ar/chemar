var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET models page. */
router.get('/', function (req, res, next) {

    //Admin check
    let isAdmin = (req.signedCookies.admin == 'true');

    res.render('models', { title: 'Model Catalog', isAdmin: isAdmin });
});

router.get('/searchModels', function (req, res, next) {
    const userSearch = decodeURIComponent(req.query.search || '').toLowerCase();

    if (!userSearch) {
        return res.send([]);
    }
    const modelFileCatalog = './public/catalog/modelFileCatalog.json';

    const modelFileData = fs.readFileSync(modelFileCatalog);
    const modelData = JSON.parse(modelFileData);
    const allModels = Object.keys(modelData).map(key => modelData[key]);
    const searchResults = allModels.filter(model => model.name.toLowerCase().includes(userSearch));

    res.send(searchResults);
});

router.post('/edit', function (req, res, next) {
    const data = { ...req.body }
    let id = req.query.id;

    const modelFileCatalog = './public/catalog/modelFileCatalog.json';

    const modelFileData = fs.readFileSync(modelFileCatalog);
    const modelData = JSON.parse(modelFileData);

    let n;
    let exists = false;

    for (const key in modelData) {
        if (modelData[key].id == parseInt(id)) {
            n = key
        }
        if(modelData[key].name == data.name){
            if(modelData[key].description == data.description){
                exists = true;
            }
        }
    }

    if(!exists){
        modelData[n].description = data.description
        modelData[n].name = data.name;
    }

    var newModel = JSON.stringify(modelData);
    fs.writeFileSync('./public/catalog/modelFileCatalog.json', newModel);

    return res.redirect('/models');

})


router.get('/delete', function (req, res, next) {
    const id = req.query.id

    const modelFileCatalog = './public/catalog/modelFileCatalog.json';

    const modelFileData = fs.readFileSync(modelFileCatalog);
    const modelData = JSON.parse(modelFileData);

    let n = -1;

    for (const key in modelData) {
        if (modelData[key].id == parseInt(id)) {
            n = key
        }
    }

    modelData.splice(n, 1)

    var newModel = JSON.stringify(modelData);
    fs.writeFileSync('./public/catalog/modelFileCatalog.json', newModel);

    return res.redirect('/models');

})

module.exports = router;