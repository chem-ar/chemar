var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    const scenes = './public/scenes/';

    //Admin check
    let isAdmin = (req.signedCookies.admin == 'true');

    res.render('scenes', { title: 'Catalog', list: fs.readdirSync(scenes), isAdmin: isAdmin});
});

// Post to name that already exists, update file.
// If post to name that doesn't exist, make new file.

// This endpoint is where you can update scenes.
// Example put '/scenes/add/exampleScene'
router.put('/addScene', (req, res) => {

    // Grab info from the request.
    const sceneName = req.params.scene;
    const scenePath = `./public/scenes/${sceneName}.json`;

    // Check if scene doesn't exist.
    if (!fs.existsSync(scenePath)) {

        // Basic template for scene file if file doesn't exist.
        const sceneTemplate = { name: sceneName };

        // Write the file with template.
        fs.writeFile(scenePath, JSON.stringify(sceneTemplate), (err) => {
            
            if (err) {
                // Send err in response if it fails.
                res.status(500).send(err);
            } else {
                res.send("Scene added successfully.");
            }
        });

    }
});

// Endpoint to delete a scene
router.post('/deleteScene/:scene', function(req, res) {
    const sceneName = req.params.scene;
    const scenePath = `./public/scenes/${sceneName}.json`;

    try {
        fs.unlinkSync(scenePath);
        console.log(`Scene file '${sceneName}.json' deleted successfully.`);
        res.sendStatus(200); // Send success response
    } catch(err) {
        console.error(`Failed to delete scene file '${sceneName}.json':`, err);
        res.sendStatus(500); // Send error response
    }
});

router.get('/list', function(req, res) {
    const scenes = './public/scenes/';

    //Admin check
    let isAdmin = (req.signedCookies.admin == 'true');

    res.status(200).send(fs.readdirSync(scenes));
});

module.exports = router;
