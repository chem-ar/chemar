var express = require('express');
var router = express.Router();
var fs = require('fs'); 

router.get('/', function(req, res, next) {
  const scenes = './public/scenes/'

  res.render('sceneEditor', { title: 'Scene Viewer'});
});

// Endpoint to update the scene catalog file
router.post('/updateCatalog/:oldSceneName', (req, res) => {
  const oldSceneName = req.params.oldSceneName;
  const newSceneName = req.body.name;
  const newSceneDescription = req.body.description;

  // Read the scene catalog file
  fs.readFile('./public/catalog/sceneCatalog.json', 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading scene catalog file:', err);
          return res.status(500).json({ success: false, error: 'Error reading scene catalog file' });
      }

      try {
          // Parse the JSON data
          let sceneCatalog = JSON.parse(data);

          // Check if sceneCatalog is an array
          if (!Array.isArray(sceneCatalog)) {
              console.error('Scene catalog data is not an array');
              return res.status(500).json({ success: false, error: 'Scene catalog data is not an array' });
          }

          // Find the scene with the old name in the catalog
          const sceneIndex = sceneCatalog.findIndex(scene => scene.name === oldSceneName);

          if (sceneIndex === -1) {
              return res.status(404).json({ success: false, error: 'Scene not found in scene catalog' });
          }

          // Update the scene's name and description
          sceneCatalog[sceneIndex].name = newSceneName;
          sceneCatalog[sceneIndex].description = newSceneDescription;

          // Write the updated scene catalog back to the file
          fs.writeFile('./public/catalog/sceneCatalog.json', JSON.stringify(sceneCatalog, null, 2), err => {
              if (err) {
                  console.error('Error writing scene catalog file:', err);
                  return res.status(500).json({ success: false, error: 'Error writing scene catalog file' });
              }

              // Return success response
              res.status(200).json({ success: true });
          });
      } catch (parseError) {
          console.error('Error parsing scene catalog data:', parseError);
          return res.status(500).json({ success: false, error: 'Error parsing scene catalog data' });
      }
  });
});

router.get('/:id', function(req , res){
  var scenefiles = fs.readdirSync('./public/scenes/');

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
