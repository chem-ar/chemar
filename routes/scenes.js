var express = require('express');
var router = express.Router();
var fs = require('fs');
const path = require('path');
var { checkSession } = require('./auth/session-mgmt')


/* GET home page. */
router.get('/', (req, res) => {
    let { isAdmin, isInstructor, isOwner } = checkSession(req, res);
    let userRole = res.locals.userRole;    
    const userEmail = res.locals.email;
    if (userRole === 'instructor') {
        isAdmin = true;
        isInstructor = true;
    } else if (userRole === 'admin') {
        isAdmin = true;
    }else if(userRole === 'superadmin'){
        isAdmin = true;
        isOwner = true;
    }

    const catalogPath = './public/catalog/sceneCatalog.json';
    let catalog = {};

    try {
        const catalogRaw = fs.readFileSync(catalogPath, 'utf8');
        if (catalogRaw.trim()) {
            catalog = JSON.parse(catalogRaw);
        }
    } catch (err) {
        console.error('Failed to load scene catalog:', err);
    }

    const sceneList = [];

    for (const [filename, scene] of Object.entries(catalog)) {
        const isSceneOwner = scene.sceneOwner === userEmail;
        const isVisibleToUser = scene.studentAccessible || isAdmin || isInstructor || isOwner || isSceneOwner;

        if (isVisibleToUser) {
            sceneList.push({
                filename,
                name: scene.name,
                desc: scene.desc,
                sceneOwner: scene.sceneOwner,
                studentAccessible: scene.studentAccessible
            });
        }
    }

    res.render('scenes', {
        title: 'Catalog',
        list: sceneList,
        isAdmin,
        isInstructor,
        isOwner
    });
});



// Endpoint to delete a scene
router.post('/deleteScene/:sceneName', function (req, res) {
    let { isAdmin, isInstructor, isOwner } = checkSession(req, res);
    let userRole = res.locals.userRole;
    if (userRole === 'instructor') {
        isAdmin = true;
        isInstructor = true;
    } else if (userRole === 'admin') {
        isAdmin = true;
    }else if(userRole === 'superadmin'){
        isAdmin = true;
        isOwner = true;
    }
    if (!isAdmin) return res.status(401).send({ error: "User not logged in" });

    const sceneName = req.params.sceneName;
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
    let {isAdmin, isInstructor, isOwner} = checkSession(req, res);
    let userRole = res.locals.userRole;
    let email = res.locals.email;
    if (userRole === 'instructor') {
        isAdmin = true;
        isInstructor = true;
    } else if (userRole === 'admin') {
        isAdmin = true;
    }else if(userRole === 'superadmin'){
        isAdmin = true;
        isOwner = true;
    }
    if (!isAdmin) return res.status(401).send({ error: "User not logged in" });

    // Get new scene info from request body
    var newSceneName = req.body.name;
    var newSceneDesc = req.body.desc; // Check if 'description' is correctly accessed
    var sessionToken = req.cookies.session;
    var studentAccessible = req.body.studentAccessible;

    
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
        "molecules": [],
        studentAccessible: studentAccessible
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
                    "sceneOwner": email,
                    "studentAccessible": studentAccessible
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


module.exports = router;