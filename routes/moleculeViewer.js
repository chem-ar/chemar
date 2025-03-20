var express = require('express');
var router = express.Router();
var fs = require('fs'); 
var path = require('path');
var { checkSession } = require('./auth/session-mgmt');

router.get('/', function(req, res, next) {
  //Admin check
  let { isAdmin, isInstructor, isOwner } = checkSession(req, res);

  let userRole = req.session?.user?.role || 'student';

  res.render('moleculeViewer', { title: 'Molecule Viewer', item: 2519, userRole, isAdmin, isInstructor, isOwner});
});

router.get('/:id', function(req , res){
  //Admin check
  let { isAdmin, isInstructor, isOwner } = checkSession(req, res);
  let userRole = req.session?.user?.role || 'student';

  var molfiles = fs.readdirSync('./public/molfiles/')
  
  if(molfiles.includes(req.params.id + '.mol')){    
    res.render('moleculeViewer', {
      title: 'Molecule Viewer', 
      item: req.params.id,
      isAdmin: isAdmin, isOwner, isInstructor
    });
  }

  //If the file does not exist, render the viewer page with the id 2519 as a fallback
  else{
    res.render('moleculeViewer', {
      title: 'Molecule Viewer', 
      item: 2519,
      isAdmin: isAdmin, isOwner, isInstructor
    });  
  }
});

module.exports = router;
