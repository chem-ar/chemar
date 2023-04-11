var express = require('express');
var router = express.Router();
var fs = require('fs'); 



router.get('/:id', function(req , res){
  
  //Read the molfiles directory and store the names of the files in an array
  var molfiles = fs.readdirSync('./public/molfiles/')
  
  
  //Check if the array includes a file with the same name as the id parameter
  if(molfiles.includes(req.params.id + '.mol')){
    
    //Render the item page with the id as the item argument and the molfile as the molfile argument
    res.render('item', {
      title: 'Molecule Viewer: '+ req.params.id, 
      item: req.params.id
    });
  }
  
  //If the file does not exist, render the error page:
  else{
    res.render('error', {title: 'Error', message: 'Molecule not found', error: {status: 404}});
  }
});

module.exports = router;
