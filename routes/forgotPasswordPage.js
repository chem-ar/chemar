var express = require('express');
var router = express.Router();
var { sql, connect } = require('../db');
const { sendMail } = require('./sendEmail');
const crypto = require('crypto');

router.get('/', function (req, res) {
    res.render("forgotPasswordPage", { title: 'Forgot Password Page' });
});

router.post('/', async function (req, res) {
    try {
        let email = req.body.email;
        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        const pool = await connect();
        const result = await pool.request()
            .input('email', sql.NVarChar(255), email)
            .query(`SELECT email FROM Users WHERE email = @email`);

        if (result.recordset.length === 0) {
            return res.render("confirmationMessage", {
                title: 'Confirmation Message',
                message: 'If an account exists with this email, you will receive a password reset link.'
            });
        }

        let token = crypto.randomUUID();
        let protocol = req.protocol;
        let host = req.hostname;
        let url = "/passwordReset";
        let port = process.env.PORT || 4000;
        let baseUrl = `${protocol}://${host}${url}`;

        if (port == 4000) {
            baseUrl = `${protocol}://${host}:${port}${url}`;
        }

        let link = `${baseUrl}?token=${token}&email=${email}`;

        const mailOptions = {
            from: "ChemAR <daluni.chemar@gmail.com>",
            to: email,
            subject: "Forgot Password | ChemAR",
            html: `<h1>Hello from ChemAR</h1><p>Here is your password reset link: <a href="${link}">${link}</a></p>`,
        };

        await sendMail(mailOptions);

        return res.render("confirmationMessage", {
            title: 'Confirmation Message',
            message: 'If an account exists with this email, you will receive a password reset link.'
        });

    } catch (error) {
        console.error("Error in forgot password process:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

module.exports = router;
