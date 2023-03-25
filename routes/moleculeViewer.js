var express = require('express');
var router = express.Router();
var fs = require('fs'); 

/* GET the viewer page. */
//This route used to render a page called "viewer".
//URL: https://localhost:4000/moleculeviewer
//This route takes in an id as a parameter and checks if there is a file with the same id as the parameter in the molfiles directory.
router.get('/', function(req, res, next) {
  //Render the viewer page with the id 2519 as an argument with the title "Molecule Viewer" and item 2519 (CID for Caffeine)
  res.render('moleculeViewer', { title: 'Molecule Viewer', item: 2519 });
});

/* GET the viewer page. */
//This route takes in an id as a parameter 
router.get('/:id', function(req , res){
  //Read the molfiles directory and store the names of the files in an array
  var molfiles = fs.readdirSync('./public/molfiles/')

  //Check if the array includes a file with the same name as the id parameter
  //req.params.id is the id parameter '/:id'
  if(molfiles.includes(req.params.id + '.mol')){

    //If the file exists, read the file and store the contents in a variable called molfile
    molfile = fs.readFileSync('./public/molfiles/'+req.params.id+'.mol', 'utf8');
    
  //Render the viewer page with the id as the item argument  
    res.render('moleculeViewer', {
      title: 'Molecule Viewer', 
      item: req.params.id
    });

  }

  //If the file does not exist, render the viewer page with the id 2519 as a fallback
  else{
    res.render('moleculeViewer', {
      title: 'Molecule Viewer', 
      item: 2519
    });  
  }
});

module.exports = router;
