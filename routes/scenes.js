var express = require('express');
var router = express.Router();
var fs = require('fs');
const path = require('path');
const { sql, connect } = require('../db');
var { checkSession } = require('./auth/session-mgmt')


/* GET home page. */
router.get('/', async (req, res) => {
    let { isAdmin, isInstructor, isOwner } = checkSession(req, res);
    let userRole = res.locals.userRole;
    const userEmail = res.locals.email;

    if (userRole === 'instructor') {
        isInstructor = true;
    } else if (userRole === 'admin') {
        isAdmin = true;
    } else if (userRole === 'superadmin') {
        isAdmin = true;
        isOwner = true;
    } else if (userRole === 'developer') {
        isAdmin = true;
        isOwner = true;
    }

    try {
        const pool = await connect();
        let result;

        if (isAdmin) {
            // Admins see all scenes
            result = await pool.request().query(`
                SELECT s.scene_name AS filename, s.[desc], u.email AS sceneOwner, s.is_public AS studentAccessible
                FROM Scenes s
                JOIN Users u ON s.user_id = u.id
            `);
        } else {
            // Instructors and students only see their own scenes
            result = await pool.request()
                .input('email', sql.VarChar, userEmail)
                .query(`
                    SELECT s.scene_name AS filename, s.[desc], u.email AS sceneOwner, s.is_public AS studentAccessible
                    FROM Scenes s
                    JOIN Users u ON s.user_id = u.id
                    WHERE u.email = @email
                `);
        }

        const sceneList = result.recordset;

        res.render('scenes', {
            title: 'Catalog',
            list: sceneList,
            isAdmin,
            isInstructor,
            isOwner,
        });
    } catch (err) {
        console.error('Failed to load scenes from DB:', err);
        res.status(500).send('Error loading scene catalog');
    }
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
    }else if(userRole === 'developer'){
        isDeveloper = true;
        isAdmin = true;
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
    }else if(userRole === 'developer'){
        isDeveloper = true;
        isAdmin = true;
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

router.get('/api/:sceneName', async (req, res) => {
    const sceneName = req.params.sceneName;
    const pool = await connect();

    try {
        const sceneResult = await pool.request()
            .input('scene_name', sql.VarChar, sceneName)
            .query('SELECT * FROM Scenes WHERE scene_name = @scene_name');

        if (sceneResult.recordset.length === 0) {
            return res.status(404).json({ error: 'Scene not found' });
        }

        const scene = sceneResult.recordset[0];

        const modelResult = await pool.request().query('SELECT * FROM Models');

        const molecules = modelResult.recordset.map(model => ({
            modelInfo: {
                id: model.id,
                name: model.file_name,
                desc: model.desc,
                file_path: model.file_path.replace("public\\", "") 
            },
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            animations: []
        }));

        res.json({
            name: scene.scene_name,
            desc: scene.desc,
            trackingMarker: {
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 }
            },
            molecules
        });

    } catch (err) {
        console.error('Failed to fetch scene data from DB:', err);
        res.status(500).json({ error: 'Database error' });
    }
});



module.exports = router;