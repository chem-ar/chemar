var express = require('express');
var router = express.Router();
var { checkSession } = require('./auth/session-mgmt')
const bcrypt = require('bcrypt');
var fs = require('fs')

function isMainAdminBySession(session) {
    let adminData = JSON.parse(fs.readFileSync("./routes/auth/admin.json"))
    let isMainAdmin = false

    for (let i = 0; i < adminData.length; i++) {
        for (let j = 0; j < adminData[i].session.length; j++) {
            if (session == adminData[i].session[j].token) {
                isMainAdmin = adminData[i].mainAdmin
                break;
            }
        }
        if (isMainAdmin) {
            break;
        }
    }
    console.log(isMainAdmin);
    return isMainAdmin;
}

/* GET admin page. */
router.get('/', function (req, res, next) {
    let isAdmin = checkSession(req, res);
    let isMainAdmin = isMainAdminBySession(req.cookies.session)
    if (!isAdmin) return res.redirect("/");
    res.render('admin', { title: 'Admin', isAdmin: isAdmin, isMainAdmin });

});

router.get('/alladmin', async function (req, res, next) {
    let isMainAdmin = isMainAdminBySession(req.cookies.session)
    if (!isMainAdmin) return res.redirect("/");
    res.render('allAdmins', { title: 'allAdmin', isMainAdmin })
})

router.get('/alladminsearch', async function (req, res, next) {
    let isMainAdmin = isMainAdminBySession(req.cookies.session)
    if (!isMainAdmin) return res.redirect('/')

    let adminData = JSON.parse(fs.readFileSync("./routes/auth/admin.json"))

    return res.send(adminData)
})

router.get('/addadmin', async function (req, res, next) {
    let isMainAdmin = isMainAdminBySession(req.cookies.session)
    if (!isMainAdmin) return res.redirect('/')

    return res.render('addadmin', { title: 'addAdmin', isMainAdmin })
})

router.get('/delete', async function (req, res, next) {
    let isMainAdmin = isMainAdminBySession(req.cookies.session)
    if (!isMainAdmin) return res.redirect('/')
    let email = req.query.email;

    let adminData = JSON.parse(fs.readFileSync("./routes/auth/admin.json"))
    let adminDeleteIndex
    adminData.map((ele, i) => {
        if(ele.email == email){
            adminDeleteIndex = i
        }
    })
    adminData.splice(adminDeleteIndex, 1)

    fs.writeFileSync("./routes/auth/admin.json", JSON.stringify(adminData))

    return res.status(200).send({message: 'deleted success'})
})

// adding admins
router.post('/addadmin', async function (req, res, next) {
    let isAdmin = checkSession(req, res)
    if (!isAdmin && isMainAdminBySession(req.cookies.session)) return res.redirect("/")

    let data = { ...req.body }

    let hashPassword = await bcrypt.hash(data.password, 5)

    let newAdmin = {
        session: [],
        email: data.email,
        password: hashPassword,
        mainAdmin: data.adminType
    }

    let adminData = JSON.parse(fs.readFileSync("./routes/auth/admin.json"))

    adminData.push(newAdmin)

    fs.writeFileSync("./routes/auth/admin.json", JSON.stringify(adminData))

    return res.status(200).send({message: 'add success'})
})

module.exports = router;
