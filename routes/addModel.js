const express = require('express');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const obj2gltf = require('obj2gltf');
const { sql, connect } = require('../db');
const { checkSession } = require('./auth/session-mgmt');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/modelfiles/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    res.render('addModel', { title: 'Add New Model' });
});

const uploadMiddleware = upload.fields([
    { name: 'objFileName', maxCount: 1 },
    { name: 'mtlFileName', maxCount: 1 },
    { name: 'gltfFileName', maxCount: 1 },
    { name: 'binFileName', maxCount: 1 },
    { name: 'glbFileName', maxCount: 1 }
]);

async function convertOBJToGLB(objPath, outputGlbPath) {
    try {
        const glb = await obj2gltf(objPath, {
            binary: true,
            metallicRoughness: true,        
          });
        fs.writeFileSync(outputGlbPath, glb);
        return outputGlbPath;
    } catch (error) {
        console.error('Error converting OBJ to GLB:', error);
        return null;
    }
}

router.post('/saveModel', uploadMiddleware, async (req, res) => {
    const name = req.body.name;
    const description = req.body.modelDescription;
    const uploadDate = new Date();

    let { isAdmin, isInstructor, isOwner } = await checkSession(req, res);
    let userRole = res.locals.userRole;
    const userId = res.locals.userId;


    if (userRole === 'instructor') {
        isAdmin = true;
        isInstructor = true;
    } else if (userRole === 'admin') {
        isAdmin = true;
    }else if(userRole === 'superadmin'){
        isAdmin = true;
        isOwner = true;
    }

    if (!isAdmin) {
        Object.values(req.files).flat().forEach(file => fs.unlinkSync(file.path));
        return res.status(401).send({ error: "Unauthorized" });
    }

    try {
        const pool = await connect();
        const existing = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('userId', sql.Int, userId)
            .query("SELECT * FROM Models WHERE file_name = @name AND user_id = @userId");

        if (existing.recordset.length > 0) {
            Object.values(req.files).flat().forEach(file => fs.unlinkSync(file.path));
            return res.status(400).send({ error: 'This model already exists' });
        }

        let filePath = null;

        if (req.files['objFileName']) {
            const objFile = req.files['objFileName'][0];
            const objDir = path.dirname(objFile.path);
        
            if (req.files['mtlFileName']) {
                const mtlFile = req.files['mtlFileName'][0];
                const mtlDestPath = path.join(objDir, mtlFile.originalname);
        
                // Put .mtl next to .obj so obj2gltf can find it
                fs.renameSync(mtlFile.path, mtlDestPath);
            }
        
            const outputGlbPath = path.join('public/modelfiles', `${Date.now()}-${objFile.originalname}.glb`);
            const convertedGlbPath = await convertOBJToGLB(objFile.path, outputGlbPath);
            if (convertedGlbPath) filePath = convertedGlbPath;
        
            fs.unlinkSync(objFile.path); // optional
        }
        

        if (req.files['gltfFileName']) {
            const gltfFile = req.files['gltfFileName'][0];
            filePath = path.join(gltfFile.destination, gltfFile.filename);
        }

        if (req.files['glbFileName']) {
            const glbFile = req.files['glbFileName'][0];
            filePath = path.join(glbFile.destination, glbFile.filename);
        }

        await pool.request()
            .input('userId', sql.Int, userId)
            .input('file_name', sql.NVarChar, name)
            .input('desc', sql.NVarChar, description)
            .input('file_path', sql.NVarChar, filePath)
            .input('upload_date', sql.DateTime, uploadDate)
            .query(`
                INSERT INTO Models (user_id, file_name, [desc], file_path, upload_date)
                VALUES (@userId, @file_name, @desc, @file_path, @upload_date)
            `);

        res.send({ message: 'Model saved!' });
    } catch (error) {
        console.error('DB Insert Error:', error);
        res.sendStatus(500);
    }
});

module.exports = router;
