var express = require('express');
var router = express.Router();
var fs = require('fs'); 

router.get('/', function(req, res, next) {
  res.redirect('/lessons');
});


router.get('/:id', function(req , res){
  var lessonFiles = fs.readdirSync(`./public/lessons/`);

  if(lessonFiles.includes(req.params.id + ".json")){
    res.render('lessonViewer', {
      title: 'Scene Viewer', 
      item: req.params.id
    });
  }
  
  else{
    res.render('error', { title: 'ChemAR - Error', message: 'Scene not found', error: {status: 404, stack: 'Scene not found'}});
  }

});

module.exports = router;
