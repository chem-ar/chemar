var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET models page. */
router.get('/', function(req, res, next) {
    
    //Admin check
    let isAdmin = (req.signedCookies.admin == 'true');

    res.render('models', { title: 'Model Catalog', isAdmin: isAdmin});
});

router.get('/searchModels', function(req, res, next) {
    const userSearch = decodeURIComponent(req.query.search || '').toLowerCase();

    if(!userSearch){
        return res.send([]);
    }
    const modelFileCatalog = './public/catalog/modelFileCatalog.json';

    const modelFileData = fs.readFileSync(modelFileCatalog);
    const modelData = JSON.parse(modelFileData);
    const allModels = Object.keys(modelData).map(key => modelData[key]);
    const searchResults = allModels.filter(model => model.name.toLowerCase().includes(userSearch));
    
    res.send(searchResults);
});

module.exports = router;

