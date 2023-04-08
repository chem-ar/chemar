var express = require('express');
var router = express.Router();
var fs = require('fs'); 

router.get('/', function(req, res, next) {
  res.render('lessonEditor', { title: 'Scene Viewer'});
});


router.get('/:id', function(req , res){
  var lessonfiles = fs.readdirSync('./public/lessons/')

  if(lessonfiles.includes(req.params.id)){
    res.render('lessonEditor', {
      title: 'Scene Viewer', 
      item: req.params.id
    });
  }
  
  else{
    res.render('error', { title: 'MoleculAR - Error', message: 'Lesson not found', error: {status: 404, stack: 'Scene not found'}});
  }
});

router.post('/upload/images', function(req , res){
  console.log(req.body);
  let image = req.body["image-contents"].replace(/^data:image\/png;base64,/, "");

  console.log(req.body["image-name"]);

  const newImage = './public/images/' + req.body["image-name"];

  fs.writeFile(newImage, image, 'base64', function(err) {
    console.log(err);
  });

  // res.status(200).send("File uploaded successfully.");
  
  res.status(200).json(
    {
      "status": "success",
      "message": "File uploaded successfully.",
      "file-src": newImage.replace('./public', '')
    }
  );

  
});


module.exports = router;
