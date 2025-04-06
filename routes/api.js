const express = require('express');
const router = express.Router();
const { connect, sql } = require('../db');

// GET scene data by scene name (e.g., for AR viewer)
router.get('/scenes/:sceneName', async (req, res) => {
    const sceneName = req.params.sceneName;

    try {
        const pool = await connect();

        // Get scene metadata
        const sceneResult = await pool.request()
            .input('scene_name', sql.NVarChar(255), sceneName)
            .query(`SELECT id, scene_name, desc, scene_data FROM Scenes WHERE scene_name = @scene_name`);

        if (sceneResult.recordset.length === 0) {
            return res.status(404).json({ error: 'Scene not found' });
        }

        const scene = sceneResult.recordset[0];
        const sceneData = JSON.parse(scene.scene_data || '{}');

        // Get associated models
        const modelResult = await pool.request()
            .input('scene_id', sql.Int, scene.id)
            .query(`SELECT sm.*, m.name, m.description, m.file_path 
                    FROM SceneModels sm
                    JOIN Models m ON sm.model_id = m.id
                    WHERE sm.scene_id = @scene_id`);

        const molecules = modelResult.recordset.map(row => ({
            position: JSON.parse(row.position),
            rotation: JSON.parse(row.rotation),
            scale: JSON.parse(row.scale),
            animations: JSON.parse(row.animations || '[]'),
            cjson: row.cjson || null,
            modelInfo: {
                id: row.model_id,
                name: row.name,
                description: row.description,
                file_path: row.file_path
            }
        }));

        res.json({
            name: scene.scene_name,
            desc: scene.desc,
            trackingMarker: sceneData.trackingMarker || { position: { x: 0, y: 0, z: 0 } },
            molecules
        });

    } catch (err) {
        console.error('Failed to load scene from DB:', err);
        res.status(500).json({ error: 'Failed to load scene data' });
    }
});

router.get('/models', async (req, res) => {
    try {
        const pool = await connect();
        const result = await pool.request().query(`
            SELECT id, name, description, user_id, file_path 
            FROM Models
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching models:', err);
        res.status(500).json({ error: 'Failed to fetch models' });
    }
});

module.exports = router;
