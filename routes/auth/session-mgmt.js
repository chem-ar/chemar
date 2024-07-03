let key = "";

function startSession(res) {
    // TODO store a randomly generated session token to the user's cookies 
    let token = globalThis.crypto.randomUUID()
    key = token
    res.cookie('boss', token)
    // using res. Save this session token somewhere on the server too
}

function checkSession(req) {
    // TODO check cookie in req. It should match a session token stored 
    // somewhere on the server. Return true if the user is logged in
    const token = req.cookies.boss;
    return token === key;
}

function endSession(res) {
    // TODO delete the session token stored in the user's cookies and on the 
    // server
    res.clearCookie('boss');
    key = ""
}


module.exports = { startSession, checkSession, endSession }