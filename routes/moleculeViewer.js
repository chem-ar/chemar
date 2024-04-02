var express = require('express');
var router = express.Router();
var fs = require('fs'); 
var path = require('path');


router.get('/', function(req, res, next) {
  res.render('moleculeViewer', { title: 'Molecule Viewer', item: 2519 });
  //Admin check
  let isAdmin = (req.signedCookies.admin == 'true');
});

router.get('/:id', function(req , res){
  var molfiles = fs.readdirSync('./public/molfiles/')
  console.log(JSON.stringify(req.headers['user-agent']))

  if(molfiles.includes(req.params.id + '.mol')){    
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
