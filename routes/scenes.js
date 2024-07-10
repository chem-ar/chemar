var express = require('express');
var router = express.Router();
var fs = require('fs');
var { checkSession } = require('./auth/session-mgmt')


function isMainAdminBySession(session) {
    let adminData = JSON.parse(fs.readFileSync("./routes/auth/admin.json"))
    let isMainAdmin = false

    for (let i = 0; i < adminData.length; i++) {
        for (let j = 0; j < adminData[i].session.length; j++) {
            if (session == adminData[i].session[j].token) {
                isMainAdmin = adminData[i].mainAdmin
                break;
            }
        }
        if (isMainAdmin) {
            break;
        }
    }
    console.log(isMainAdmin);
    return isMainAdmin;
}

/* GET home page. */
router.get('/', function(req, res, next) {
    const scenesDirectory = './public/scenes/';

    //Admin check
    let isAdmin = checkSession(req, res);

    // Load the scene catalog data
    let sceneCatalog;
    try {
        const sceneCatalogJSON = fs.readFileSync('./public/catalog/sceneCatalog.json', 'utf8');
        sceneCatalog = JSON.parse(sceneCatalogJSON);
    } catch (error) {
        console.error('Error loading scene catalog:', error);
        res.sendStatus(500); // Send error response if scene catalog cannot be loaded
        return;
    }

    // Get the list of scene files
    let sceneFiles;
    try {
        sceneFiles = fs.readdirSync(scenesDirectory);
    } catch (error) {
        console.error('Error reading scene files:', error);
        res.sendStatus(500); // Send error response if scene files cannot be read
        return;
    }

    // Combine scene catalog data with scene files
    let finalList = [];
    for (let filename of sceneFiles) {
        // Check if the scene file exists in the scene catalog
        if (sceneCatalog.hasOwnProperty(filename)) {
            finalList.push({
                filename: filename,
                name: sceneCatalog[filename].name,
                desc: sceneCatalog[filename].desc
            });
        } else {
            console.error(`Scene '${filename}' not found in catalog.`);
        }
    }
    let isMainId = isMainAdminBySession(req.cookies.session)
    res.render('scenes', { title: 'Catalog', list: finalList, isAdmin: isAdmin, sceneCatalog: sceneCatalog });
});


// Endpoint to delete a scene
router.post('/deleteScene/:scene', function(req, res) {
    const isAdmin = checkSession(req, res);
    if (!isAdmin) return res.status(401).send({ error: "User not logged in" });

    const sceneName = req.params.scene;
    const scenePath = `./public/scenes/${sceneName}.json`;
    console.log(scenePath);

    try {
        // Delete scene file
        fs.unlinkSync(scenePath);
        console.log(`Scene file '${sceneName}.json' deleted successfully.`);
        
        // Update scene catalog
        const sceneCatalogPath = './public/catalog/sceneCatalog.json';

        if (fs.existsSync(sceneCatalogPath)) {
            let sceneCatalog = JSON.parse(fs.readFileSync(sceneCatalogPath, 'utf8'));
            delete sceneCatalog[sceneName + '.json'];

            fs.writeFileSync(sceneCatalogPath, JSON.stringify(sceneCatalog, null, 2));
            console.log(`Entry for scene '${sceneName}' removed from scene catalog.`);
            res.sendStatus(200); // Send success response
        } else {
            console.error('Scene catalog file not found.');
            res.sendStatus(500); // Send error response
        }
    } catch(err) {
        console.error(`Failed to delete scene file '${sceneName}.json':`, err);
        res.sendStatus(500); // Send error response
    }
});



// Handle adding a new scene
router.post('/addScene', function(req, res) {
    const isAdmin = checkSession(req, res);
    if (!isAdmin) return res.status(401).send({ error: "User not logged in" });

    // Get new scene info from request body
    var newSceneName = req.body.name;
    var newSceneDesc = req.body.desc; // Check if 'description' is correctly accessed

    // Create scene object
    var scene = {
        "name": newSceneName,
        "desc": newSceneDesc, // Make sure the 'desc' field is populated
        "trackingMarker": {
            "position": {
                "x": 0,
                "y": 0,
                "z": 0
            }
        },
        "molecules": []
    };

    // Write scene data to a new JSON file
    fs.writeFile(`./public/scenes/${newSceneName}.json`, JSON.stringify(scene), (err) => {
        if (err) {
            console.error('Error writing scene file:', err);
            res.sendStatus(500); // Send error response
        } else {
            console.log(`Scene file '${newSceneName}.json' created successfully.`);

            // Update scene catalog
            const sceneCatalogPath = './public/catalog/sceneCatalog.json';
            let sceneCatalog = {};

            try {
                // Read the current scene catalog
                if (fs.existsSync(sceneCatalogPath)) {
                    const sceneCatalogData = fs.readFileSync(sceneCatalogPath, 'utf8');
                    if (sceneCatalogData.trim().length > 0) {
                        sceneCatalog = JSON.parse(sceneCatalogData);
                    }
                }

                // Add new scene entry to the scene catalog
                sceneCatalog[newSceneName + ".json"] = {
                    "name": newSceneName,
                    "desc": newSceneDesc
                };

                // Write updated scene catalog back to the file
                fs.writeFileSync(sceneCatalogPath, JSON.stringify(sceneCatalog, null, 2));

                console.log(`Scene '${newSceneName}' added to the scene catalog.`);
                res.sendStatus(200); // Send success response
            } catch (catalogErr) {
                console.error('Error updating scene catalog:', catalogErr);
                res.sendStatus(500); // Send error response
            }
        }
    });
});

router.get('/list', function(req, res) {
    const scenes = './public/scenes/';

    //Admin check
    let isAdmin = checkSession(req, res);

    res.status(200).send(fs.readdirSync(scenes));
});

module.exports = router;