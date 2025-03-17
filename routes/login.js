const express = require('express');
const router = express.Router();
const { sql, connect } = require('../db');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('login', { title: 'Login Page' }); 
});

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const pool = await connect();
        const result = await pool.request()
            .input('email', sql.NVarChar(255), email)
            .query(`SELECT id, password_hash, role FROM Users WHERE email = @email`);

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const user = result.recordset[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        req.session.user = { id: user.id, role: user.role };

        res.redirect('/dashboard');
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal server error." });
    }
});

module.exports = router;
