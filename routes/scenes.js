var express = require('express');
var router = express.Router();
var fs = require('fs');
const path = require('path');
var { checkSession } = require('./auth/session-mgmt')


/* GET home page. */
router.get('/', function (req, res, next) {
    const scenesDirectory = './public/scenes/';
    // Admin and owner check
    let { isAdmin, isowner } = checkSession(req, res);

    // Retrieve the current user's email using the session token
    const sessionToken = req.cookies.session;
    const adminEmail = findAdminEmailBySession(sessionToken);
    
    // Load the scene catalog data
    let sceneCatalog;
    try {
        const sceneCatalogJSON = fs.readFileSync('./public/catalog/sceneCatalog.json', 'utf8');
        sceneCatalog = JSON.parse(sceneCatalogJSON);
    } catch (error) {
        console.error('Error loading scene catalog:', error);
        return res.sendStatus(500); // Send error response if scene catalog cannot be loaded
    }

    // Get the list of scene files
    let sceneFiles;
    try {
        sceneFiles = fs.readdirSync(scenesDirectory);
    } catch (error) {
        console.error('Error reading scene files:', error);
        return res.sendStatus(500); // Send error response if scene files cannot be read
    }

    // Combine scene catalog data with scene files, filter according to ownership
    let finalList = [];
    for (let filename of sceneFiles) {
        // Check if the scene file exists in the scene catalog
        if (sceneCatalog.hasOwnProperty(filename)) {
            const sceneOwner = sceneCatalog[filename].sceneOwner;    

            // Show scene if:
            // 1. The user is the website owner (isowner === true)
            // 2. The scene has no owner field (meaning the owner field is absent)
            // 3. The current user is the owner of the scene
            if (isowner || !sceneCatalog[filename].hasOwnProperty('sceneOwner') || sceneOwner === adminEmail || !isAdmin) {
                finalList.push({
                    filename: filename,
                    name: sceneCatalog[filename].name,
                    desc: sceneCatalog[filename].desc,
                    sceneOwner: sceneOwner || 'No Owner'
                });
                console.log(`Added scene: ${filename}`);
            } 
        } 
    }
    // Render the scenes page, passing the filtered list of scenes
    res.render('scenes', { title: 'Catalog', list: finalList, isAdmin: isAdmin, sceneCatalog: sceneCatalog, isowner });
});


// Endpoint to delete a scene
router.post('/deleteScene/:scene', function (req, res) {
    let { isAdmin, isowner } = checkSession(req, res);
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
    } catch (err) {
        console.error(`Failed to delete scene file '${sceneName}.json':`, err);
        res.sendStatus(500); // Send error response
    }
});



// Handle adding a new scene
router.post('/addScene', function (req, res) {
    let { isAdmin, isowner } = checkSession(req, res);
    if (!isAdmin) return res.status(401).send({ error: "User not logged in" });

    // Get new scene info from request body
    var newSceneName = req.body.name;
    var newSceneDesc = req.body.desc; // Check if 'description' is correctly accessed
    var sessionToken = req.cookies.session;

    var adminEmail = findAdminEmailBySession(sessionToken);
    
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
                    "desc": newSceneDesc,
                    "sceneOwner": adminEmail
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

router.get('/list', function (req, res) {
    const scenes = './public/scenes/';


    res.status(200).send(fs.readdirSync(scenes));
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