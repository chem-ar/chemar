// File: routes/sceneViewer.js
const express = require('express');
const router = express.Router();
const { sql, connect } = require('../db');

router.get('/', function (req, res) {
  res.redirect('/scenes');
});

// Load viewer page using DB data
router.get('/:id', async function (req, res) {
  const sceneName = req.params.id;

  try {
    const pool = await connect();
    const result = await pool.request()
      .input('scene_name', sql.VarChar, sceneName)
      .query('SELECT * FROM Scenes WHERE scene_name = @scene_name');

    if (result.recordset.length === 0) {
      return res.render('error', {
        title: 'ChemAR - Error',
        message: 'Scene not found in DB',
        error: { status: 404, stack: 'Scene not found in DB' }
      });
    }

    // Scene exists in DB, just render the viewer EJS
    res.render('sceneViewer', {
      title: 'Scene Viewer',
      item: sceneName
    });

  } catch (err) {
    console.error('Error fetching scene from DB:', err);
    res.status(500).render('error', {
      title: 'ChemAR - Error',
      message: 'Internal server error',
      error: { status: 500, stack: err.stack }
    });
  }
});

module.exports = router;
