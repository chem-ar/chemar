var express = require('express');
var router = express.Router();
var fs = require('fs');
const { startSession, checkSession, endSession } = require('./auth/session-mgmt');
const bcrypt = require('bcrypt');

router.get('/', function (req, res) {
    req.cookies.session = req.query.token;
    req.body.email = req.query.email;
    let adminEmail = req.query.email;
    let confirm = false;

    let { isAdmin, isowner } = checkSession(req, res);
    if (isAdmin) {
        confirm = true;
        let i = -1
        let ad = fs.readFileSync('./routes/auth/admin.json')
        let adminData = JSON.parse(ad)
        const token = req.query.token;
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

    req.body.email = adminEmail;
    if (confirm) {
        return res.render('passwordReset', { title: 'Password Reset Page' });
    } else {
        return res.status(404);
    }

});


router.post('/', async function (req, res) {
    console.log(req.body.email);
    adminEmail = req.query.email;
    let adminData = JSON.parse(fs.readFileSync("./routes/auth/admin.json"));
    let admin;
    let adminIndex;
    let isAdmin;

    for (let i = 0; i < adminData.length; i++) {
        if (adminEmail == adminData[i].email) {
            isAdmin = true;
            adminIndex = i;
            break;
        }
    }

    if (isAdmin) {
        let newPassword = await bcrypt.hash(req.body.newPassword, 5)
        adminData[adminIndex].password = newPassword
        let arr = JSON.stringify(adminData)
        fs.writeFileSync("./routes/auth/admin.json", arr)
        return res.redirect("/login");
    }
});

module.exports = router;