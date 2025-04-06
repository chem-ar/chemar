var express = require('express');
var router = express.Router();
var { sql, connect } = require('../db');
var bcrypt = require('bcrypt');

router.get('/', function (req, res) {
    let email = req.query.email;
    let token = req.query.token;

    if (!email || !token) {
        return res.status(400).json({ message: "Invalid password reset request." });
    }

    // Render the password reset page
    res.render('passwordReset', { title: 'Password Reset Page', email });
});

router.post('/', async function (req, res) {
    try {
        let { email, newPassword } = req.body;
        
        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required." });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        const pool = await connect();
        const result = await pool.request()
            .input('email', sql.NVarChar(255), email)
            .input('hashedPassword', sql.NVarChar(255), hashedPassword)
            .query(`UPDATE Users SET password_hash = @hashedPassword WHERE email = @email`);

        if (result.rowsAffected[0] > 0) {
            return res.redirect("/login");
        } else {
            return res.status(404).json({ message: "User not found." });
        }
    } catch (err) {
        console.error("Error resetting password:", err);
        return res.status(500).json({ message: "Internal server error. Please try again." });
    }
});

module.exports = router;
