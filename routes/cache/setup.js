var fs = require('fs'); 

function initializeCache(){
    let molFilesExists = fs.existsSync('./public/molFiles');
    let scenesExists = fs.existsSync('./public/ scenes');
    let modelFilesExists = fs.existsSync('./public/modelFiles');
 
    let molfiles= fs.existsSync('./public/catalog/molfileCatalog.json');
    let modelFiles= fs.existsSync('./public/catalog/modelFileCatalog.json ')
    let scenes = fs.existsSync('./public/catalog/sceneCatalog.json ');


    if(!molFilesExists){
        fs.mkdirSync('./public/molFiles', {recursive: true});
    }
   
    if(!scenesExists){
        fs.mkdirSync('./public/scenes', {recursive: true});
    }

    if(!modelFilesExists){
        fs.mkdirSync('./public/modelFiles', {recursive: true});
    }



    if(!molfiles){
        fs.writeFileSync("./public/catalog/molfileCatalog.json", "{}");
    }

    if(!modelFiles){
        fs.writeFileSync("./public/catalog/modelFileCatalog.json", "[]");
    }
    
    if(!scenes){
        fs.writeFileSync("./public/catalog/sceneCatalog.json", "{}");
    } 
}

module.exports = initializeCache;