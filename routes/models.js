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
    const searchResults = modelData.filter(model => model.name.toLowerCase().includes(userSearch));
    
    res.send(searchResults);
});
//To handle the edit functionality
router.post('/edit', function (req, res, next) {
    const data = { ...req.body }
    let id = req.query.id;

    const modelFileCatalog = './public/catalog/modelFileCatalog.json';

    const modelFileData = fs.readFileSync(modelFileCatalog);
    const modelData = JSON.parse(modelFileData);

    let n;
    let exists = false;
    //Finding which model to be deleted using for loop
    for (const key in modelData) {
        if (modelData[key].id == parseInt(id)) {
            n = key
        }
        if(modelData[key].name == data.name){
            if(modelData[key].description == data.description){
                exists = true;
            }
        }
        
    }console.log("model data test")
    if(!exists){
        const previousName = modelData[n].name;
        modelData[n].description = data.description
        modelData[n].name = data.name;
        modelData[n].files = {
            obj: data.name + "-"+ id + ".obj",
            mtl: data.name + "-"+ id + ".mtl"
        }
        fs.renameSync(`./public/modelfiles/${previousName + "-"+ id}.mtl`, `./public/modelfiles/${data.name + "-"+ id}.mtl`);
        fs.renameSync(`./public/modelfiles/${previousName + "-"+ id}.obj`, `./public/modelfiles/${data.name + "-"+ id}.obj`);
    }
    var newModel = JSON.stringify(modelData);
    fs.writeFileSync('./public/catalog/modelFileCatalog.json', newModel);
    return res.redirect('/models');
})

//Handling the delete functionality
router.get('/delete', function (req, res, next) {
    const id = req.query.id

    const modelFileCatalog = './public/catalog/modelFileCatalog.json';

    const modelFileData = fs.readFileSync(modelFileCatalog);
    const modelData = JSON.parse(modelFileData);

    let n = -1;
    //Checking the model to be deleted by using key
    for (const key in modelData) {
        if (modelData[key].id == parseInt(id)) {
            n = key
        }
    }

    const modelDelete = modelData[n];

    // Deleting the .mtl and .obj files from modelfiles folder once the deletion functionality is used
    fs.unlinkSync(`./public/modelfiles/${modelDelete.name + "-" + id}.mtl`);
    fs.unlinkSync(`./public/modelfiles/${modelDelete.name + "-" + id}.obj`);
    
    //To remove the model when deleted from array
    modelData.splice(n, 1)

    var newModel = JSON.stringify(modelData);
    fs.writeFileSync('./public/catalog/modelFileCatalog.json', newModel);
    //Redirecting to models page
    return res.redirect('/models');

})

module.exports = router;