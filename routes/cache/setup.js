var fs = require('fs'); 

function initializeCache(){
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
}

module.exports = initializeCache;