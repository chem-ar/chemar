const { sql, connect } = require('../../db');
const SESSION_DURATION = 14400000;

// Check if a session is valid
async function checkSession(req, res) {
    const token = req.cookies.session;
    if (!token) {
        return { isAdmin: false, isOwner: false };
    }

    try {
        const pool = await connect();
        const result = await pool.request()
            .input('token', sql.NVarChar(255), token)
            .query(`SELECT u.role, s.expires_at 
                FROM Sessions s 
                JOIN Users u ON s.user_id = u.id 
                WHERE s.token = @token
                `);

        if (result.recordset.length === 0) {
            return { isAdmin: false, isOwner: false };
        }

        const session = result.recordset[0];

        // Check if session is expired
        if (Date.now() > session.expires_at) {
            await endSession(req, res);
            return { isAdmin: false, isOwner: false };
        }

        // Refresh session expiration
        await pool.request()
            .input('token', sql.NVarChar(255), token)
            .input('expiresAt', sql.BigInt, Date.now() + SESSION_DURATION)
            .query(`UPDATE Sessions SET expires_at = @expiresAt WHERE token = @token`);

        return { isAdmin: session.role === 'admin', isOwner: session.owner };
    } catch (err) {
        console.error("Error checking session:", err);
        return { isAdmin: false, isOwner: false };
    }
}

// End session (logout)
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

module.exports = { checkSession, endSession };
