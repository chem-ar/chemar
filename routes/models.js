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
    const userSearch = req.query.search;
    const modelFileCatalog = './public/catalog/modelFileCatalog.json';

    const modelFileData = fs.readFileSync(modelFileCatalog);
    const modelData = JSON.parse(modelFileData);
    const allModels = Object.keys(modelData).map(key => modelData[key]);
    const searchResults = allModels.filter(model => model.name.includes(userSearch));
    
    res.send(searchResults);
});

router.post("/edit", function (req, res, next) {
    const data = req.body;
  //   console.log(req.query);
  //   console.log(data);
  
    const catalogPath = './public/catalog/modelFileCatalog.json';
    const rawdata = fs.readFileSync(catalogPath);
    const parsedData = JSON.parse(rawdata);
  
    console.log(parsedData[0]);
  
    console.log("hello world");
  
    parsedData[req.query.name].name = data.name;
    parsedData[req.query.name].description = data.description;
    console.log(parsedData);
  
    fs.writeFileSync(catalogPath, JSON.stringify(parsedData));
  
    notifier.notify({
      title: 'Edit Successful',
      message: `Model updated successfully.`,
  });
  });

module.exports = router;