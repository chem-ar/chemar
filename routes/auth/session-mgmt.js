var fs = require('fs')
const SESSION_DURATION = 21600000; // 21600000 ms == 6 hrs

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
    if (!checkSession(req, res)) {
        let token = globalThis.crypto.randomUUID()
        let sess = {
            token: token,
            time: Date.now()
        }

        let ad = fs.readFileSync('./routes/auth/admin.json');
        let adminData = JSON.parse(ad)
        adminData.admin.session.push(sess)

        fs.writeFileSync('./routes/auth/admin.json', JSON.stringify(adminData))

        res.cookie('session', token, { maxAge: SESSION_DURATION });
    }
}

function checkSession(req, res) {
    const token = req.cookies.session;

    let ad = fs.readFileSync('./routes/auth/admin.json')
    let adminData = JSON.parse(ad)

    const activeSessions = adminData.admin.session
        .filter(session => ((Date.now() - session.time) <= SESSION_DURATION));
    
    const session = activeSessions.find(session => session.token === token);
    if (session) {
        res.cookie('session', token, { maxAge: SESSION_DURATION });
        session.time = Date.now();
    }

    adminData.admin.session = activeSessions;
    fs.writeFileSync('./routes/auth/admin.json', JSON.stringify(adminData));

    return session !== undefined;
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