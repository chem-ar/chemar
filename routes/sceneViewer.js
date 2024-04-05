var express = require('express');
var router = express.Router();
var fs = require('fs'); 

router.get('/', function(req, res, next) {
  res.redirect('/scenes');
});


router.get('/:id', function(req , res){
  var sceneFiles = fs.readdirSync(`./public/scenes/`);

  if(sceneFiles.includes(req.params.id + ".json")){
    res.render('sceneViewer', {
      title: 'Scene Viewer', 
      item: req.params.id
    });
  }
  
  else{
    res.render('error', { title: 'ChemAR - Error', message: 'Scene not found', error: {status: 404, stack: 'Scene not found'}});
  }

});

module.exports = router;
