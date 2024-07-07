var fs = require('fs')

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
    if (!checkSession(req)) {
        let token = globalThis.crypto.randomUUID()
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
}

function checkSession(req) {
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