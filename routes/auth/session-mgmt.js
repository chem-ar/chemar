var fs = require('fs')
const path = require('path');
const SESSION_DURATION = 14400000; // 14400000 ms == 4 hrs

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
    let {isAdmin, isowner} = checkSession(req, res);
    if (!isAdmin) {
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

        res.cookie('session', token, { maxAge: SESSION_DURATION, httpOnly: true, secure: true });
    }
}

function checkSession(req, res) {
    const token = req.cookies.session;

    let ad = fs.readFileSync('./routes/auth/admin.json')
    let adminData = JSON.parse(ad)
    let isowner = false

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
                    isowner = adminData[i].owner
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

    activeSessions = activeSessions.filter(session => ((Date.now() - session.time) <= SESSION_DURATION));

    const session = activeSessions.find(session => session.token === token);
    if (session) {
        res.cookie('session', token, { maxAge: SESSION_DURATION });
        session.time = Date.now();
    }

    adminData[adminIndex].session = activeSessions;
    fs.writeFileSync('./routes/auth/admin.json', JSON.stringify(adminData));

    let isAdmin = false
    if(session){
        isAdmin = true
    }

    return {isAdmin, isowner};
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

function findAdminEmailBySession(sessionToken) {
    // Path to the admin.json file (relative to the current file in the routes folder)
    const filePath = path.join(__dirname, 'admin.json');
    console.log(filePath);
  
    // Read and parse the admin.json file
    let adminData;
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        adminData = JSON.parse(data);
    } catch (error) {
        console.error('Error reading admin.json:', error);
        return null;
    }
  
    // Iterate through the adminData array
    for (let admin of adminData) {
        // Check if the admin has sessions
        if (admin.session) {
            // Check each session for a matching token
            for (let sess of admin.session) {
                if (sess.token === sessionToken) {
                    // Return the admin's email if the session token matches
                    return admin.email;
                }
            }
        }
    }
  
    // Return null if no matching session token is found
    return null;
  }


module.exports = { startSession, checkSession, endSession, findAdminEmailBySession }