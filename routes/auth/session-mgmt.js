var fs = require('fs')
let key = "";

function startSession(res) {
    // TODO store a randomly generated session token to the user's cookies 
    let token = globalThis.crypto.randomUUID()
    // key = 
    let sess = {
        token: token,
        time: Date.now()
    }

    let ad = fs.readFileSync('./admin.json');
    let adminData = JSON.parse(ad)
    adminData.admin.session.push(sess)

    fs.writeFileSync('./admin.json', JSON.stringify(adminData))
    
    res.cookie('boss', token)
    // using res. Save this session token somewhere on the server too
}

function checkSession(req) {
    // TODO check cookie in req. It should match a session token stored 
    // somewhere on the server. Return true if the user is logged in
    const token = req.cookies.boss;
    let exists = false

    let ad = fs.readFileSync('./admin.json')
    let adminData = JSON.parse(ad)

    adminData.admin.session.map((e) => {
        if(e.token === token){
            e.time = Date.now()
            return exists = true
        }
    })

    return exists;
}

function endSession(res) {
    // TODO delete the session token stored in the user's cookies and on the 
    // server
    res.clearCookie('boss');
}


module.exports = { startSession, checkSession, endSession }