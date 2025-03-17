var express = require('express');
var router = express.Router();
const { sql, connect } = require('../db');
const bcrypt = require('bcrypt');

const SESSION_DURATION = 14400000; // 4 hours in ms

// Login Route (Creates a Session)
router.post('/', async function (req, res) {
    const { email, password } = req.body;

    try {
        const pool = await connect();
        const result = await pool.request()
            .input('email', sql.NVarChar(255), email)
            .query(`SELECT id, password_hash, role FROM Users WHERE email = @email`);

        if (result.recordset.length === 0) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const user = result.recordset[0];

        // Compare password hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Password Incorrect" });
        }

        // Generate a session token
        const token = globalThis.crypto.randomUUID();
        const expiresAt = Date.now() + SESSION_DURATION;

        // Store session in database
        await pool.request()
            .input('userId', sql.Int, user.id)
            .input('token', sql.NVarChar(255), token)
            .input('expiresAt', sql.BigInt, expiresAt)
            .query(`INSERT INTO Sessions (user_id, token, expires_at) VALUES (@userId, @token, @expiresAt)`);

        // Set session token in cookie
        res.cookie('session', token, { maxAge: SESSION_DURATION, httpOnly: true, secure: false });

        return res.status(200).json({ message: "Login successful", role: user.role });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Logout Route (Deletes Session)
router.post('/logout', async function (req, res) {
    const token = req.cookies.session;

    if (!token) {
        return res.status(400).json({ error: "No active session" });
    }

    try {
        const pool = await connect();
        await pool.request()
            .input('token', sql.NVarChar(255), token)
            .query(`DELETE FROM Sessions WHERE token = @token`);

        res.clearCookie('session');
        return res.json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
