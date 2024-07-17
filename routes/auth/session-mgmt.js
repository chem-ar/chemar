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
        let adminIndex
        let email = req.body.email;
        for (let i = 0; i < adminData.length; i++) {
            if (adminData[i].email == email) {
                adminIndex = i
            }
        }
        adminData[adminIndex].session.push(sess)

        fs.writeFileSync('./routes/auth/admin.json', JSON.stringify(adminData))

        res.cookie('session', token, { maxAge: SESSION_DURATION });
    }
}

function checkSession(req, res) {
    const token = req.cookies.session;

    let ad = fs.readFileSync('./routes/auth/admin.json')
    let adminData = JSON.parse(ad)

    let adminIndex
    let email = req.body.email
    let activeSessions

    for (let i = 0; i < adminData.length; i++) {
        if (adminData[i].email == email && email) {
            activeSessions = adminData[i].session
            adminIndex = i
        }
        else {
            for (let j = 0; j < adminData[i].session.length; j++) {
                if (token == adminData[i].session[j].token) {
                    activeSessions = adminData[i].session;
                    adminIndex = i;
                    break;
                }
                if (activeSessions) {
                    break;
                }
            }
        }
    }

    if (!activeSessions) {
        return false
    }

    activeSessions.filter(session => ((Date.now() - session.time) <= SESSION_DURATION));

    const session = activeSessions.find(session => session.token === token);
    if (session) {
        res.cookie('session', token, { maxAge: SESSION_DURATION });
        session.time = Date.now();
    }

    adminData[adminIndex].session = activeSessions;
    fs.writeFileSync('./routes/auth/admin.json', JSON.stringify(adminData));

    return session !== undefined;
}

function endSession(req, res) {
    let i = -1
    let ad = fs.readFileSync('./routes/auth/admin.json')
    let adminData = JSON.parse(ad)
    const token = req.cookies.session;
    let adminIndex;
    adminData.map((e, ai) => {
        e.session.map((ele, ind) => {
            if (ele.token === token) {
                i = ind
                adminIndex = ai;
                return;
            }
        })
    })

    if (i != -1) {
        adminData[adminIndex].session.splice(i, 1)
    }

    fs.writeFileSync('./routes/auth/admin.json', JSON.stringify(adminData))
    res.clearCookie('session');
}

function isownerBySession(session) {
    let adminData = JSON.parse(fs.readFileSync("./routes/auth/admin.json"))
    let isowner = false

    for (let i = 0; i < adminData.length; i++) {
        for (let j = 0; j < adminData[i].session.length; j++) {
            if (session == adminData[i].session[j].token) {
                isowner = adminData[i].owner
                break;
            }
        }
        if (isowner) {
            break;
        }
    }
    return isowner;
}


module.exports = { startSession, checkSession, endSession, isownerBySession }