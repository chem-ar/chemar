var express = require('express');
var router = express.Router();
var { sql, connect } = require('../db');
var bcrypt = require('bcrypt');

router.get('/', function (req, res, next) {
    res.render('registration', { title: 'Registration Page' });
});

router.post('/', async function (req, res, next) {
    let { email, password, role } = req.body;

    try {
        if (!role) {
            role = 'student'; 
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const pool = await connect();
        await pool.request()
            .input('email', sql.NVarChar(255), email)
            .input('passwordHash', sql.NVarChar(255), passwordHash)
            .input('role', sql.NVarChar(50), role)
            .query(`INSERT INTO Users (email, password_hash, role) VALUES (@email, @passwordHash, @role)`);

        res.redirect('/login');
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});

module.exports = router;
