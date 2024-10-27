var express = require('express');
var router = express.Router();
var fs = require('fs'); 
const { checkSession } = require('./auth/session-mgmt');
const path = require('path');

router.delete('/delete/:scene/:moleculeIndex', (req, res) => {
  let { isAdmin, isowner } = checkSession(req, res);
  if (!isAdmin) return res.status(401).json({ error: "User not logged in" });

  // Extract scene and molecule names from the request parameters
  const sceneName = req.params.scene;
  const molIndex = req.params.moleculeIndex;

  // Correct file path to the scene JSON
  const path = require('path');
  const sceneFilePath = path.resolve(__dirname, `../public/scenes/${sceneName}.json`);
  //console.log(`Resolved scene file path: ${sceneFilePath}`);

  // Check if the scene file exists
  if (!fs.existsSync(sceneFilePath)) {
      return res.status(404).json({ error: "Scene not found" });
  }

  // Load the scene JSON file
  fs.readFile(sceneFilePath, 'utf8', (err, data) => {
      if (err) {
          return res.status(500).json({ error: "Scene file not found" });
      }
      let sceneData;
      try {
          sceneData = JSON.parse(data);
      } catch (parseError) {
          return res.status(500).json({ error: "Failed to parse scene data" });
      }
      
      // Remove the molecule from the array
      sceneData.molecules.splice(molIndex, 1);

      // Save the updated JSON file
      fs.writeFile(sceneFilePath, JSON.stringify(sceneData, null, 2), (writeErr) => {
          if (writeErr) {
              return res.status(500).json({ error: "Failed to update scene file" });
          }
          // otherwise success message
          res.status(200).json({ message: "Molecule deleted successfully" });
      });
  });
});


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
                      if (newFilename !== filename) {
                        delete sceneCatalog[filename];
                      }

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
  const sessionToken = req.cookies.session;
  let adminEmail = findAdminEmailBySession(sessionToken);
  let file = req.params.id;
  let sceneOwner;
  let sceneCatalog;
  try {
      const sceneCatalogJSON = fs.readFileSync('./public/catalog/sceneCatalog.json', 'utf8');
      sceneCatalog = JSON.parse(sceneCatalogJSON);
  } catch (error) {
      console.error('Error loading scene catalog:', error);
      return res.sendStatus(500); // Send error response if scene catalog cannot be loaded
  }

  if(sceneCatalog.hasOwnProperty(file)){
    let thisScene = sceneCatalog[file];
    if (thisScene.hasOwnProperty("sceneOwner")) {
      sceneOwner = thisScene.sceneOwner;
      if (sceneOwner !== adminEmail && !isowner ){
        return res.redirect("/");
      }
    }
  }

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

function findAdminEmailBySession(sessionToken) {
  // Path to the admin.json file (relative to the current file in the routes folder)
  const filePath = path.join(__dirname, 'auth', 'admin.json');
  console.log(filePath);

  // Read and parse the admin.json file
  let adminData;
  try {
      const data = fs.readFileSync(filePath, 'utf-8');
      adminData = JSON.parse(data);
  } catch (error) {
      console.error('Error reading admin.json:', error);
      return null;
  }

  // Iterate through the adminData array
  for (let admin of adminData) {
      // Check if the admin has sessions
      if (admin.session) {
          // Check each session for a matching token
          for (let sess of admin.session) {
              if (sess.token === sessionToken) {
                  // Return the admin's email if the session token matches
                  return admin.email;
              }
          }
      }
  }

  // Return null if no matching session token is found
  return null;
}


module.exports = router;
