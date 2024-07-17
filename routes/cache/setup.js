var express = require('express');
var router = express.Router();
var fs = require('fs'); 


router.get('/', function initializeCache(req, res, next){
    let molfileCatalogExists = fs.existsSync('./public/catalog/molfileCatalog.json ');
    let modelFileCatalog = fs.existsSync('./public/catalog/modelFileCatalog.json ')
    let sceneCatalog = fs.existsSync('./public/catalog/sceneCatalog.json ');

    if(!molfileCatalogExists){
        fs.writeFileSync("./public/catalog/molfileCatalog.json", "{}");
    }

    if(!modelFileCatalog){
        fs.writeFileSync("./public/catalog/modelFileCatalog.json", "[]");
    }
    
    if(!sceneCatalog){
        fs.writeFileSync("./public/catalog/sceneCatalog.json", "{}");
    }  
});

module.exports = router;