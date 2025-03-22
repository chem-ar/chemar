var express = require('express');
var router = express.Router();
var { sql, connect } = require('../db');
var bcrypt = require('bcrypt');
var { checkSession } = require('./auth/session-mgmt');

router.get('/', async function (req, res, next) {
    let { isAdmin, isInstructor, isOwner, email } = await checkSession(req, res);
    let userRole = res.locals.userRole;
    
    if (userRole === 'instructor') {
        isAdmin = true;
        isInstructor = true;
    } else if (userRole === 'admin') {
        isAdmin = true;
        isOwner = true;
    }

    if (!isAdmin) {
        return res.redirect("/");
    }

    console.log(email);
    res.render('admin', { title: 'Admin', isAdmin: isAdmin, isOwner: isOwner, isInstructor: isInstructor, email});
});

router.post('/changepassword', async function (req, res) {
    try {
        let { password, newPassword } = req.body;
        let email = res.locals.email;

        if (!password || !newPassword) {
            return res.status(400).json({ message: "Both old and new passwords are required." });
        }

        const pool = await connect();
        const result = await pool.request()
            .input('email', sql.NVarChar(255), email)
            .query(`SELECT password_hash FROM Users WHERE email = @email`);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        let hashedPassword = result.recordset[0].password_hash;
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect old password." });
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.request()
            .input('email', sql.NVarChar(255), email)
            .input('newPassword', sql.NVarChar(255), newHashedPassword)
            .query(`UPDATE Users SET password_hash = @newPassword WHERE email = @email`);

        return res.json({ message: "Password updated successfully." });
    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.post('/changeemail', async function (req, res) {
    try {
        let { password, newEmail } = req.body;
        let email = res.locals.email;

        if (!password || !newEmail) {
            return res.status(400).json({ message: "Password and new email are required." });
        }

        const pool = await connect();
        const result = await pool.request()
            .input('email', sql.NVarChar(255), email)
            .query(`SELECT password_hash FROM Users WHERE email = @email`);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        let hashedPassword = result.recordset[0].password_hash;
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password." });
        }

        await pool.request()
            .input('email', sql.NVarChar(255), email)
            .input('newEmail', sql.NVarChar(255), newEmail)
            .query(`UPDATE Users SET email = @newEmail WHERE email = @email`);

        return res.json({ message: "Email updated successfully." });
    } catch (error) {
        console.error("Error updating email:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

const { endSession } = require('./auth/session-mgmt');

router.post('/deleteaccount', async function (req, res) {
    try {
        let { password } = req.body;
        let email = res.locals.email;

        if (!password) {
            return res.status(400).json({ message: "Password is required." });
        }
        const pool = await connect();
        const result = await pool.request()
            .input('email', sql.NVarChar(255), email)
            .query(`SELECT password_hash FROM Users WHERE email = @email`);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        let hashedPassword = result.recordset[0].password_hash;
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password." });
        }

        await pool.request()
            .input('email', sql.NVarChar(255), email)
            .query(`DELETE FROM Users WHERE email = @email`);

        await endSession(req, res);
        return res.json({ message: "Account deleted successfully.", redirect: "/login" });

    } catch (error) {
        console.error("Error deleting account:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

module.exports = router;
