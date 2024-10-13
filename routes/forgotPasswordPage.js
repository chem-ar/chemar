var express = require('express');
var router = express.Router();
var fs = require('fs');
const { checkSession } = require('./auth/session-mgmt')
const { sendMail } = require('./sendEmail');
const dotenv = require('dotenv');

router.get('/', function (req, res) {
    res.render("forgotPasswordPage", { title: 'Forgot Password Page' });
});

router.post('/', async function (req, res) {
    let adminEmail = req.body.email;
    let isAdmin;
    let admins = JSON.parse(fs.readFileSync("./routes/auth/admin.json"))
    for (let i = 0; i < admins.length; i++) {
        if (adminEmail == admins[i].email) {
            isAdmin = true;
            break;
        }
    }

    if (isAdmin) {
        let token = await generateToken(req, res)

        //https://www.geeksforgeeks.org/how-to-get-the-full-url-in-expressjs/
        let protocol = req.protocol;
        let host = req.hostname;
        let url = "/passwordReset";
        let port = process.env.PORT || 4000; // Have to declare the port here. or else it doesnt work in localhost.

        let baseUrl = `${protocol}://${host}:${port}${url}`
        // let baseUrl = "https://localhost:4000/passwordReset"

        let tokenlink = baseUrl.concat("?token=", token);
        let link = tokenlink.concat("&email=", adminEmail);

        try {
            let r = await sendMail(adminEmail, link);
            console.log(r); //
        } catch (error) {
            console.log(error); //
        }
    }
    res.render("forgotPasswordPage", { title: 'Forgot Password Page' });

});


async function generateToken(req, res) {
    deletToken(req, res);
    let { isAdmin, isowner } = checkSession(req, res);
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
        return token;
    }
}

async function deletToken(req, res) {
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
}




module.exports = router;