export function startSession(res) {
    // TODO store a randomly generated session token to the user's cookies 
    // using res. Save this session token somewhere on the server too
}

export function checkSession(req) {
    // TODO check cookie in req. It should match a session token stored 
    // somewhere on the server. Return true if the user is logged in
    return false;
}

export function endSession(res) {
    // TODO delete the session token stored in the user's cookies and on the 
    // server
}