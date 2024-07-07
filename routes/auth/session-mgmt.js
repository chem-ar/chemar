var fs = require('fs')
let key = "";

initalizeSessions();

function initalizeSessions() {
    if (!fs.existsSync("./routes/auth/admin.json")) {
        fs.copyFileSync(
            "./routes/auth/admin.json.default",
            "./routes/auth/admin.json"
        );
    }
}

function startSession(req, res) {
    // TODO store a randomly generated session token to the user's cookies 
    if (!checkSession(req)) {
        let token = globalThis.crypto.randomUUID()
        // key = 
        let sess = {
            token: token,
            time: Date.now()
        }

        let ad = fs.readFileSync('./routes/auth/admin.json');
        let adminData = JSON.parse(ad)
        adminData.admin.session.push(sess)

        fs.writeFileSync('./routes/auth/admin.json', JSON.stringify(adminData))


        res.cookie('session', token)
    }
    // using res. Save this session token somewhere on the server too
}

function checkSession(req) {
    // TODO check cookie in req. It should match a session token stored 
    // somewhere on the server. Return true if the user is logged in
    const token = req.cookies.session;
    let exists = false

    let ad = fs.readFileSync('./routes/auth/admin.json')
    let adminData = JSON.parse(ad)

    adminData.admin.session.map((e) => {
        if (e.token === token) {
            e.time = Date.now()
            return exists = true
        }
    })

    return exists;
}

function endSession(req, res) {
    // TODO delete the session token stored in the user's cookies and on the 
    // server
    let i = -1
    let ad = fs.readFileSync('./routes/auth/admin.json')
    let adminData = JSON.parse(ad)
    const token = req.cookies.session;
    adminData.admin.session.map((e, ind) => {
        if (e.token === token) {
            i = ind
            return;
        }
    })

    if (i != -1) {
        adminData.admin.session.splice(i, 1)
    }

    fs.writeFileSync('./routes/auth/admin.json', JSON.stringify(adminData))
    res.clearCookie('session');
}


module.exports = { startSession, checkSession, endSession }