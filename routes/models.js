const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { sql, connect } = require('../db');
const { checkSession } = require('./auth/session-mgmt');

// GET models page
router.get('/', async (req, res) => {
    let { isAdmin, isInstructor, isOwner } = await checkSession(req, res);
    let userRole = res.locals.userRole;
    if (userRole === 'instructor') isAdmin = isInstructor = true;
    else if (userRole === 'admin') isAdmin = isOwner = true;

    if (!isAdmin) return res.redirect("/");

    const userId = res.locals.userId;

    try {
        const pool = await connect();
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query("SELECT * FROM Models WHERE user_id = @userId");

        const models = result.recordset.map(model => ({
            ...model,
            file_name_only: model.file_path ? path.basename(model.file_path) : ''
        }));

        res.render('models', {
            title: 'Model Catalog',
            models,
            isAdmin,
            isOwner,
            isInstructor
        });
    } catch (error) {
        console.error("Error loading models:", error);
        res.sendStatus(500);
    }
});

// Edit model
router.post('/edit', async (req, res) => {
    let { isAdmin, isInstructor, isOwner } = await checkSession(req, res);
    let userRole = res.locals.userRole;
    if (userRole === 'instructor') isAdmin = isInstructor = true;
    else if (userRole === 'admin') isAdmin = isOwner = true;
    
    if (!isAdmin) return res.status(401).send({ error: "Unauthorized" });

    const { id, name, description } = req.body;

    try {
        const pool = await connect();

        const check = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('desc', sql.NVarChar, description)
            .input('id', sql.Int, id)
            .query("SELECT * FROM Models WHERE file_name = @name AND [desc] = @desc AND id <> @id");

        if (check.recordset.length > 0) {
            return res.status(409).send('Duplicate model name and description.');
        }

        await pool.request()
            .input('name', sql.NVarChar, name)
            .input('desc', sql.NVarChar, description)
            .input('id', sql.Int, id)
            .query("UPDATE Models SET file_name = @name, [desc] = @desc WHERE id = @id");

        return res.redirect('/models');
    } catch (error) {
        console.error("Error updating model:", error);
        res.sendStatus(500);
    }
});

// Delete model
router.delete('/delete', async (req, res) => {
    let { isAdmin, isInstructor, isOwner } = await checkSession(req, res);
    let userRole = res.locals.userRole;
    if (userRole === 'instructor') isAdmin = isInstructor = true;
    else if (userRole === 'admin') isAdmin = isOwner = true;

    if (!isAdmin) return res.status(401).send({ error: "Unauthorized" });

    const id = req.body.id;

    try {
        const pool = await connect();

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query("SELECT file_path FROM Models WHERE id = @id");

        if (result.recordset.length === 0) return res.status(404).send({ error: "Model not found" });

        const filePath = result.recordset[0].file_path;
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM Models WHERE id = @id");

        res.status(200).send({ message: "Model deleted successfully" });
    } catch (error) {
        console.error("Error deleting model:", error);
        res.sendStatus(500);
    }
});

module.exports = router;
