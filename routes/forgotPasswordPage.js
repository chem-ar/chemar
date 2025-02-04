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
    let Admin;
    let admins = JSON.parse(fs.readFileSync("./routes/auth/admin.json"))
    for (let i = 0; i < admins.length; i++) {
        if (adminEmail == admins[i].email) {
            Admin = true;
            break;
        }
    }

    if (Admin) {
        let token = await generateToken(req, res)

        //https://www.geeksforgeeks.org/how-to-get-the-full-url-in-expressjs/
        let protocol = req.protocol;
        let host = req.hostname;
        let url = "/passwordReset";
        let port = process.env.PORT || 4000;
        let baseUrl = `${protocol}://${host}${url}` // If the Server is running on production no need for port.

        if (port == 4000) {
            baseUrl = `${protocol}://${host}:${port}${url}` // If the server is running in devlopment the port needs to be added. 
        }


        let tokenlink = baseUrl.concat("?token=", token);
        let link = tokenlink.concat("&email=", adminEmail);

        try {
            const mailOptions = {
                from: "ChemAR <daluni.chemar@gmail.com>",
                to: adminEmail,
                subject: "Forgot Password | ChemAR",
                text: `Hi, here is your link: ${link}`,
                html: `<h1>Hello from ChemAR</h1><p>Here is your password reset link: <a href="${link}">${link}</a></p>`,
            };
            let r = await sendMail(mailOptions);
            console.log(r); //


        } catch (error) {
            console.log(error); //
        }
    }
    let { isAdmin, isowner } = checkSession(req, res);
    res.render("confirmationMessage", { title: 'Confirmation Message', message: 'If an account exist with this email, you will recive the password reset link', isAdmin: isAdmin, isowner });

});


async function generateToken(req, res) {
    deleteToken(req, res);
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

async function deleteToken(req, res) {
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