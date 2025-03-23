var express = require('express');
var router = express.Router();
var fs = require('fs');
const path = require('path');
const { sql, connect } = require('../db');
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
router.post('/deleteScene/:sceneName', async function (req, res) {
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

    const sceneName = req.params.sceneName;
    const scenePath = `./public/scenes/${sceneName}.json`;
    const sceneCatalogPath = './public/catalog/sceneCatalog.json';

    try {
        // Delete scene file
        if (fs.existsSync(scenePath)) {
            await fs.promises.unlink(scenePath);
        }

        // Update scene catalog
        if (fs.existsSync(sceneCatalogPath)) {
            const rawCatalog = await fs.promises.readFile(sceneCatalogPath, 'utf8');
            let sceneCatalog = rawCatalog.trim() ? JSON.parse(rawCatalog) : {};

            delete sceneCatalog[sceneName + '.json'];

            await fs.promises.writeFile(sceneCatalogPath, JSON.stringify(sceneCatalog, null, 2));
        } else {
            console.error('Scene catalog file not found.');
        }

        const pool = await connect();
        const result = await pool.request()
            .input('scene_name', sql.VarChar, sceneName)
            .query(`
                DELETE FROM Scenes
                WHERE scene_name = @scene_name
            `);

        res.sendStatus(200);
    } catch (err) {
        console.error(`Failed to delete scene '${sceneName}':`, err);
        res.sendStatus(500);
    }
});




// Handle adding a new scene
router.post('/addScene', async function (req, res) {
    let { isAdmin, isInstructor, isOwner } = checkSession(req, res);
    let userRole = res.locals.userRole;
    let email = res.locals.email;
    let userId = res.locals.userId;

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

    const newSceneName = req.body.name;
    const newSceneDesc = req.body.desc;
    const studentAccessible = req.body.studentAccessible;

    const scene = {
        name: newSceneName,
        desc: newSceneDesc,
        trackingMarker: {
            position: { x: 0, y: 0, z: 0 }
        },
        molecules: [],
        studentAccessible: studentAccessible
    };

    try {
        // Save the scene to file
        await fs.promises.writeFile(`./public/scenes/${newSceneName}.json`, JSON.stringify(scene));

        // Update the catalog
        const sceneCatalogPath = './public/catalog/sceneCatalog.json';
        let sceneCatalog = {};

        if (fs.existsSync(sceneCatalogPath)) {
            const raw = await fs.promises.readFile(sceneCatalogPath, 'utf8');
            if (raw.trim()) sceneCatalog = JSON.parse(raw);
        }

        sceneCatalog[newSceneName + ".json"] = {
            name: newSceneName,
            desc: newSceneDesc,
            sceneOwner: email,
            studentAccessible: studentAccessible
        };

        await fs.promises.writeFile(sceneCatalogPath, JSON.stringify(sceneCatalog, null, 2));

        const pool = await connect();

        const userId = res.locals.userId;

        if (!Number.isInteger(userId)) {
            console.error('Invalid userId:', userId);
            return res.status(500).send({ error: 'Invalid user ID' });
        }

        await pool.request()
            .input('user_id', sql.Int, userId)
            .input('scene_name', sql.VarChar, newSceneName)
            .input('is_public', sql.Bit, studentAccessible ? 1 : 0)
            .input('desc', sql.VarChar, newSceneDesc)
            .query(`
                INSERT INTO Scenes (user_id, scene_name, is_public, [desc])
                VALUES (@user_id, @scene_name, @is_public, @desc)
            `);

        res.sendStatus(200);
    } catch (err) {
        console.error('Error creating scene:', err);
        res.sendStatus(500);
    }
});


router.get('/list', function (req, res) {
    const scenes = './public/scenes/';


    res.status(200).send(fs.readdirSync(scenes));
});


module.exports = router;