const express = require('express');
const router = express.Router();
const { sql, connect } = require('../db');
const bcrypt = require('bcrypt');

const SESSION_DURATION = 14400000; // 4 hours

router.get('/', (req, res) => {
    res.render('login', { title: 'Login Page' }); 
});

router.post('/', async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        console.log("Missing email or password");
        return res.status(400).json({ message: "Email and password required." });
    }

    try {
        const pool = await connect();
        const result = await pool.request()
            .input('email', sql.NVarChar(255), email)
            .query(`SELECT id, password_hash, role FROM Users WHERE email = @email`);

        if (result.recordset.length === 0) {
            console.log("No user found for email:", email);
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const user = result.recordset[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            console.log("Incorrect password for:", email);
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Generate session token
        const token = globalThis.crypto.randomUUID();
        const expiresAt = Date.now() + SESSION_DURATION;

        // Store session in database
        await pool.request()
            .input('userId', sql.Int, user.id)
            .input('token', sql.NVarChar(255), token)
            .input('expiresAt', sql.BigInt, expiresAt)
            .query(`INSERT INTO Sessions (user_id, token, expires_at) VALUES (@userId, @token, @expiresAt)`);

        // Set cookie
        res.cookie('session', token, { maxAge: SESSION_DURATION, httpOnly: true, secure: false });

        res.redirect('/');
    } catch (err) {
        console.error("🚨 Login error:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});

module.exports = router;
