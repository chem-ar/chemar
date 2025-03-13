var express = require('express');
var router = express.Router();
var { sql, connect } = require('../db');
var bcrypt = require('bcrypt'); 

router.get('/', function (req, res, next) {
    res.render('registration', { title: 'Registration Page' });
});

router.post('/', async function (req, res, next) {
    const { email, password, role } = req.body;

    try {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const pool = await connect();
        const request = pool.request();

        request.input('email', sql.NVarChar(255), email);
        request.input('passwordHash', sql.NVarChar(255), passwordHash);
        request.input('role', sql.NVarChar(50), role);

        await request.query(`
            INSERT INTO Users (email, password_hash, role)
            VALUES (@email, @passwordHash, @role)
        `);

        res.redirect('/login');
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});

module.exports = router;