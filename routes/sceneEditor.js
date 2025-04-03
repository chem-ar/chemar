var express = require('express');
var router = express.Router();
var fs = require('fs');
const { checkSession } = require('./auth/session-mgmt');
const path = require('path');
const { sql, connect } = require('../db');

router.delete('/delete/:scene/:moleculeIndex', async (req, res) => {
  let { isAdmin, role: userRole } = await checkSession(req, res);

  if (userRole === 'instructor' || userRole === 'admin' || userRole === 'superadmin') {
    isAdmin = true;
  }

  if (!isAdmin) return res.status(401).send({ error: "User not logged in" });
  if (!isAdmin) return res.status(401).json({ error: "User not logged in" });

  const sceneName = req.params.scene;
  const molIndex = req.params.moleculeIndex;

  const sceneFilePath = path.resolve(__dirname, `../public/scenes/${sceneName}.json`);

  if (!fs.existsSync(sceneFilePath)) {
    return res.status(404).json({ error: "Scene not found" });
  }

  fs.readFile(sceneFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: "Scene file not found" });

    let sceneData;
    try {
      sceneData = JSON.parse(data);
      sceneData.molecules.splice(molIndex, 1);
    } catch (parseError) {
      return res.status(500).json({ error: "Failed to parse scene data" });
    }

    fs.writeFile(sceneFilePath, JSON.stringify(sceneData, null, 2), (writeErr) => {
      if (writeErr) return res.status(500).json({ error: "Failed to update scene file" });
      res.status(200).json({ message: "Molecule deleted successfully" });
    });
  });
});

router.get('/', (req, res) => {
  res.render('sceneEditor', { title: 'Scene Viewer' });
});

router.post('/updateCatalog/:oldSceneName', async (req, res) => {
  let { isAdmin, isInstructor, isOwner, role: userRole } = await checkSession(req, res);

  if (!isAdmin) return res.status(401).send({ error: "User not logged in" });

  const oldSceneName = req.params.oldSceneName;
  const newSceneName = req.body.name;
  const newSceneDescription = req.body.description;
  const scenesDirectory = './public/scenes';

  fs.readFile('./public/catalog/sceneCatalog.json', 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading scene catalog file' });

    let sceneCatalog = JSON.parse(data || '{}');
    let sceneUpdated = false;

    Object.keys(sceneCatalog).forEach(filename => {
      const scene = sceneCatalog[filename];
      if (scene.name === oldSceneName) {
        scene.name = newSceneName;
        scene.desc = newSceneDescription;
        sceneUpdated = true;

        const oldFilePath = path.join(scenesDirectory, filename);
        const newFilename = `${newSceneName}.json`;
        const newFilePath = path.join(scenesDirectory, newFilename);

        fs.rename(oldFilePath, newFilePath, (renameErr) => {
          if (renameErr) return res.status(500).json({ error: 'Error renaming scene file' });

          sceneCatalog[newFilename] = scene;
          if (newFilename !== filename) delete sceneCatalog[filename];

          fs.writeFile('./public/catalog/sceneCatalog.json', JSON.stringify(sceneCatalog, null, 2), err => {
            if (err) return res.status(500).json({ error: 'Error writing scene catalog file' });
            res.status(200).json({ success: true });
          });
        });
      }
    });

    if (!sceneUpdated) res.status(400).json({ error: 'Scene not found' });
  });
});

router.get('/:id', async function(req, res) {
  let { isAdmin, isOwner, role: userRole, email: userEmail } = await checkSession(req, res);

  if (userRole === 'instructor') {
    isAdmin = true;
  } else if (userRole === 'admin') {
    isAdmin = true;
  } else if (userRole === 'superadmin') {
    isAdmin = true;
    isOwner = true;
  }

  if (!isAdmin) return res.redirect("/");

  const scenefiles = fs.readdirSync('./public/scenes/');
  const file = req.params.id;
  let sceneOwner;
  let sceneCatalog;

  try {
    const sceneCatalogJSON = fs.readFileSync('./public/catalog/sceneCatalog.json', 'utf8');
    sceneCatalog = JSON.parse(sceneCatalogJSON);
  } catch (error) {
    console.error('Error loading scene catalog:', error);
    return res.sendStatus(500);
  }

  if (sceneCatalog.hasOwnProperty(file)) {
    let thisScene = sceneCatalog[file];
    if (thisScene.hasOwnProperty("sceneOwner")) {
      sceneOwner = thisScene.sceneOwner;
      if (!(isOwner || (sceneOwner === userEmail))) {
        return res.redirect("/scenes");
      }
    }
  }

  if (scenefiles.includes(file)) {
    res.render('sceneEditor', {
      title: 'Scene Viewer',
      item: file
    });
  } else {
    res.render('error', { title: 'ChemAR - Error', message: 'Scene not found', error: { status: 404, stack: 'Scene not found' } });
  }
});

router.post('/upload/images/', function (req, res) {
  let { isAdmin, isInstructor, isOwner } = checkSession(req, res);
    let userRole = res.locals.userRole;

    if (userRole === 'instructor') {
        isAdmin = true;
        isInstructor = true;
    } else if (userRole === 'admin') {
        isAdmin = true;
    } else if (userRole === 'superadmin') {
        isAdmin = true;
        isOwner = true;
    }
    
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



router.post('/save/:scene', async (req, res) => {
  let { isAdmin, role: userRole } = await checkSession(req, res);

  if (userRole === 'instructor' || userRole === 'admin' || userRole === 'superadmin') {
    isAdmin = true;
  }

  if (!isAdmin) return res.status(401).send({ error: "User not logged in" });

  const sceneName = req.params.scene;
  const scenePath = `./public/scenes/${sceneName}.json`;
  let overwritten = fs.existsSync(scenePath);

  fs.writeFile(scenePath, JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      console.error('Error saving scene:', err);
      return res.status(500).send({ successful: false, error: 'Error saving scene' });
    }

    res.status(200).send({
      successful: true,
      overwritten: overwritten,
      path: scenePath
    });
  });
});


router.get('/user/models', async (req, res) => {
  const user_id = res.locals.userId;

  if (!user_id) return res.status(401).json({ error: "User not logged in" });

  try {
    const pool = await connect();
    const result = await pool.request()
      .input('user_id', sql.Int, user_id)
      .query(`SELECT id, file_name AS name, upload_date, [desc], file_path FROM Models WHERE user_id = @user_id`);

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch models" });
  }
});

module.exports = router;
