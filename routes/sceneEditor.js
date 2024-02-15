var express = require('express');
var router = express.Router();
var fs = require('fs'); 

router.get('/', function(req, res, next) {
  const scenes = './public/scenes/'

  res.render('sceneEditor', { title: 'Scene Viewer'});
});




router.get('/:id', function(req , res){
  var scenefiles = fs.readdirSync('./public/scene/')

  if(scenefiles.includes(req.params.id)){
    res.render('sceneEditor', {
      title: 'Scene Viewer', 
      item: req.params.id
    });
  }
  
  else{
    res.render('error', { title: 'ChemAR - Error', message: 'Scene not found', error: {status: 404, stack: 'Scene not found'}});
  }
});

router.post('/upload/images/', function(req , res){
  let image = req.body["image-contents"].replace(/^data:image\/png;base64,/, "");

  console.log(req.body["image-contents"]);

  const newImage = './public/images/' + req.body["image-name"];

  fs.writeFile(newImage, image, 'base64', function(err) {
    console.log(err);
  });
  
  res.status(200).json(
    {
      "status": "success",
      "message": "File uploaded successfully.",
      "file-src": newImage.replace('./public', '')
    }
  );

  res.send("hello");
  
});

router.post('/save/:scene', (req, res) => {
  
  // Get the scene name from the params.
  const sceneName = req.params.scene;
  const scenePath = `./public/scenes/${sceneName}.json`; // Save the file path.
  var success = false;
  var overwritten = false;

  // Check if scene doesn't exist.
  if (fs.existsSync(scenePath))
    overwritten = true;

  // Write the file with template.
  fs.writeFile(scenePath, JSON.stringify(req.body), (err) => {

    if (err) {
        success = false;
        console.log(err);
    }

  });

  success = true;

  res.status(200).send({
    successful: success,
    overwritten: overwritten,
    path: scenePath
  })

});

module.exports = router;
