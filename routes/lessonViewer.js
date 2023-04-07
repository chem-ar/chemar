var express = require('express');
var router = express.Router();
var fs = require('fs'); 

router.get('/', function(req, res, next) {
  res.render('lessonViewer', { title: 'Scene Viewer'});
});


router.get('/:id', function(req , res){
  var lessonfiles = fs.readdirSync('./public/lessons/')

  if(lessonfiles.includes(req.params.id)){
    res.render('lessonViewer', {
      title: 'Scene Viewer', 
      item: req.params.id
    });
  }
  
  else{
    res.render('error', { title: 'MoleculAR - Error', message: 'Scene not found', error: {status: 404, stack: 'Scene not found'}});
  }

});

module.exports = router;
