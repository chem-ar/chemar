var express = require('express');
var router = express.Router();
const { sql, connect } = require('../db');

const SESSION_DURATION = 14400000; // 4 hours in milliseconds

async function checkSession(req, res, next) {
    const token = req.cookies.session;
    if (!token) {
        res.locals.userRole = 'guest'; // Default role if no session
        return next();
    }

    try {
        const pool = await connect();
        const result = await pool.request()
            .input('token', sql.NVarChar(255), token)
            .query(`SELECT u.role, s.expires_at 
                    FROM Sessions s 
                    JOIN Users u ON s.user_id = u.id 
                    WHERE s.token = @token`);

        if (result.recordset.length === 0) {
            res.locals.userRole = 'guest';
            return next();
        }

        const session = result.recordset[0];

        if (Date.now() > session.expires_at) {
            await endSession(req, res);
            res.locals.userRole = 'guest';
            return next();
        }

        await pool.request()
            .input('token', sql.NVarChar(255), token)
            .input('expiresAt', sql.BigInt, Date.now() + SESSION_DURATION)
            .query(`UPDATE Sessions SET expires_at = @expiresAt WHERE token = @token`);

        res.locals.userRole = session.role;
        return next();
    } catch (err) {
        console.error("Error checking session:", err);
        res.locals.userRole = 'guest';
        return next();
    }
}

router.post('/logout', async function (req, res) {
    const token = req.cookies.session;
    if (!token) {
        return res.redirect('/');
    }

    try {
        const pool = await connect();
        await pool.request()
            .input('token', sql.NVarChar(255), token)
            .query(`DELETE FROM Sessions WHERE token = @token`);

        res.clearCookie('session');
        return res.redirect('/');
    } catch (err) {
        console.error("Logout error:", err);
        return res.redirect('/');
    }
});

async function endSession(req, res) {
    const token = req.cookies.session;
    try {
        const pool = await connect();
        await pool.request()
            .input('token', sql.NVarChar(255), token)
            .query(`DELETE FROM Sessions WHERE token = @token`);
        res.clearCookie('session');
    } catch (err) {
        console.error("Error ending session:", err);
    }
}

module.exports = router;
module.exports.checkSession = checkSession;
