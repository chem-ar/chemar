const { sql, connect } = require('../../db');
const SESSION_DURATION = 14400000;

async function checkSession(req, res) {
    const token = req.cookies.session;

    if (!token) {
        return { isAdmin: false, isInstructor: false, isOwner: false };
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
            console.log("No session found in database for this token.");
            return { isAdmin: false, isInstructor: false, isOwner: false };
        }

        const session = result.recordset[0];

        if (Date.now() > session.expires_at) {
            await endSession(req, res);
            return { isAdmin: false, isOwner: false };
        }

        await pool.request()
            .input('token', sql.NVarChar(255), token)
            .input('expiresAt', sql.BigInt, Date.now() + 14400000)
            .query(`UPDATE Sessions SET expires_at = @expiresAt WHERE token = @token`);

        return { isAdmin: session.role === 'admin', isInstructor: session.role === 'instructor', isOwner: session.owner, role: session.role };
    } catch (err) {
        console.error("Error checking session:", err);
        return { isAdmin: false, isInstructor: false, isOwner: false };
    }
}


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
