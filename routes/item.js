var express = require('express');
var router = express.Router();
var fs = require('fs'); 



router.get('/:id', function(req , res){
  
  //Read the molfiles directory and store the names of the files in an array
  let molfiles = fs.readdirSync('./public/molfiles/')
  
  //Read the contents of the catalogData.json file and store the contents in a variable called data
  let catalogData = JSON.parse(fs.readFileSync('./public/catalog/catalog.json', "utf8"));
  
  //Check if the array includes a file with the same name as the id parameter
  if(molfiles.includes(req.params.id + '.mol')){
    
    //If the file exists, read the file and store the contents in a variable called molfile
    let molfile = fs.readFileSync('./public/catalog.json');
    
    let moleculeName = 'No name in catalog';
    let moleculeFormula = 'No formula in catalog';
    //Check if the catalogData object has a property with the same name as the id parameter (needs to correspond to file name)
    if(catalogData[req.params.id]){
      //If the property does exist, set the name and formula properties to 'No name in catalog' and 'No formula in catalog'
      moleculeName = catalogData[req.params.id].name;
      moleculeFormula = catalogData[req.params.id].formula;
    }
    
    //Render the item page with the id as the item argument and the molfile as the molfile argument
    res.render('mol', {
      title: 'Molecule Viewer: '+ req.params.id, 
      item: req.params.id, 
      molfile: molfile,
      name: moleculeName,
      formula: moleculeFormula,
    });
  }
  
  //If the file does not exist, render the error page:
  else{
    res.render('error', {title: 'Error', message: 'Molecule not found', error: {status: 404}});
  }
});

module.exports = router;
