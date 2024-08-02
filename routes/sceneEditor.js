var express = require('express');
var router = express.Router();
var fs = require('fs'); 
const path = require('path');
const { checkSession } = require('./auth/session-mgmt');

router.get('/', function(req, res, next) {
  const scenes = './public/scenes/'
  res.render('sceneEditor', { title: 'Scene Viewer' });
});

router.post('/updateCatalog/:oldSceneName', (req, res) => {
  let { isAdmin, isowner } = checkSession(req, res);
  if (!isAdmin) return res.status(401).send({ error: "User not logged in" });

  const oldSceneName = req.params.oldSceneName;
  const newSceneName = req.body.name;
  const newSceneDescription = req.body.description;
  const scenesDirectory = './public/scenes'; // Directory where scene files are stored

  // Read the scene catalog file
  fs.readFile('./public/catalog/sceneCatalog.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading scene catalog file:', err);
      return res.status(500).json({ success: false, error: 'Error reading scene catalog file' });
    }

      let sceneCatalog;
      try {
          sceneCatalog = JSON.parse(data || '{}'); // Handle empty file
      } catch (parseErr) {
          console.error('Error parsing scene catalog file:', parseErr);
          return res.status(500).json({ success: false, error: 'Error parsing scene catalog file' });
      }

      // Check if sceneCatalog is an object
      if (typeof sceneCatalog === 'object') {
          let sceneUpdated = false;

          Object.keys(sceneCatalog).forEach(filename => {
              const scene = sceneCatalog[filename];
              if (scene.name === oldSceneName) {
                  scene.name = newSceneName;
                  scene.desc = newSceneDescription;
                  sceneUpdated = true;

                  // Rename the scene file to match the new scene name
                  const oldFilePath = path.join(scenesDirectory, filename);
                  const newFilename = `${newSceneName}.json`; // Ensure new filename is valid
                  const newFilePath = path.join(scenesDirectory, newFilename);

                  fs.rename(oldFilePath, newFilePath, (renameErr) => {
                      if (renameErr) {
                          console.error('Error renaming scene file:', renameErr);
                          return res.status(500).json({ success: false, error: 'Error renaming scene file' });
                      }

                      // Update the sceneCatalog key
                      sceneCatalog[newFilename] = scene;
                      delete sceneCatalog[filename];

                      // Write the updated scene catalog back to the file
                      fs.writeFile('./public/catalog/sceneCatalog.json', JSON.stringify(sceneCatalog, null, 2), err => {
                          if (err) {
                              console.error('Error writing scene catalog file:', err);
                              return res.status(500).json({ success: false, error: 'Error writing scene catalog file' });
                          }

                          res.status(200).json({ success: true });
                      });
                  });
              }
          });

          if (!sceneUpdated) {
              return res.status(400).json({ success: false, error: 'Scene not found' });
          }
      } else {
          return res.status(400).json({ success: false, error: 'Invalid scene catalog data' });
      }
  });
});


router.get('/:id', function(req , res){
  let { isAdmin, isowner } = checkSession(req, res);
  if (!isAdmin) return res.redirect("/");
  var scenefiles = fs.readdirSync('./public/scenes/');

  if (scenefiles.includes(req.params.id)) {
    res.render('sceneEditor', {
      title: 'Scene Viewer',
      item: req.params.id
    });
  }

  else {
    res.render('error', { title: 'ChemAR - Error', message: 'Scene not found', error: { status: 404, stack: 'Scene not found' } });
  }
});

router.post('/upload/images/', function (req, res) {
  let { isAdmin, isowner } = checkSession(req, res);
  if (!isAdmin) return res.status(401).send({ error: "User not logged in" });

  // Extract image data and image name from the request body
  let imageName = req.body["image-name"]; // Retrieve the image name from the request
  let imageData = req.body["image-contents"].replace(/^data:image\/png;base64,/, "");

  // Generate a unique filename for the image if image name is not provided
  if (!imageName) {
    imageName = Date.now() + '.png'; // You can use any unique identifier
  }

  // Construct the path where the image will be saved
  const imagePath = './public/images/' + imageName;

  // Write the image data to the file system
  fs.writeFile(imagePath, imageData, 'base64', function (err) {
    if (err) {
      console.error('Error saving image:', err);
      return res.status(500).json({ success: false, error: 'Error saving image' });
    }

    // Return the success response with the file path
    res.status(200).json({
      success: true,
      message: "File uploaded successfully.",
      fileSrc: '/images/' + imageName // Assuming '/images/' is the URL path to access uploaded images
    });
  });
});

router.post('/save/:scene', (req, res) => {
  let { isAdmin, isowner } = checkSession(req, res);
  if (!isAdmin) return res.status(401).send({ error: "User not logged in" });

  // Get the scene name from the params.
  const sceneName = req.params.scene;
  const scenePath = `./public/scenes/${sceneName}.json`; // Save the file path.
  var overwritten = false;

  // Check if scene doesn't exist.
  if (fs.existsSync(scenePath))
    overwritten = true;

  // Write the file with template.
  fs.writeFile(scenePath, JSON.stringify(req.body), (err) => {

    if (err) {
      console.error('Error saving scene:', err);
      return res.status(500).send({ successful: false, error: 'Error saving scene' });
    }

    res.status(200).send({
      successful: true,
      overwritten: overwritten,
      path: scenePath
    })
  });
});


module.exports = router;
