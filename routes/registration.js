const express = require('express');
const router = express.Router();
const { sql, connect } = require('../db');
const bcrypt = require('bcrypt');

router.post('/', async function (req, res) {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ message: 'Email, password, and role are required.' });
    }

    try {
        const pool = await connect();

        // Check if user already exists
        const checkResult = await pool.request()
            .input('email', sql.NVarChar(255), email)
            .query(`SELECT id FROM Users WHERE email = @email`);

        if (checkResult.recordset.length > 0) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        await pool.request()
            .input('email', sql.NVarChar(255), email)
            .input('passwordHash', sql.NVarChar(255), passwordHash)
            .input('role', sql.NVarChar(50), role)
            .query(`INSERT INTO Users (email, password_hash, role) VALUES (@email, @passwordHash, @role)`);

        res.status(201).json({ message: 'Registration successful.' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});

module.exports = router;
