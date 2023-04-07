var express = require('express');
var router = express.Router();
var fs = require('fs'); 

router.get('/', function(req, res, next) {
  res.render('sceneViewer', { title: 'Scene Viewer', item: 2519 });
});


router.get('/:id', function(req , res){
  var scenefiles = fs.readdirSync('./public/scenefiles/')

  if(scenefiles.includes(req.params.id)){
    res.render('sceneViewer', {
      title: 'Scene Viewer', 
      item: req.params.id
    });
  }
  
  else{
    res.render('error', { title: 'MoleculAR - Error', message: 'Scene not found', error: {status: 404, stack: 'Scene not found'}});
  }

});

module.exports = router;
