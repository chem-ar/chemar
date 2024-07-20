var express = require('express');
var router = express.Router();
var { checkSession } = require('./auth/session-mgmt')
const bcrypt = require('bcrypt');
var fs = require('fs')

/* GET admin page. */
router.get('/', function (req, res, next) {
    let {isAdmin, isowner} = checkSession(req, res);
    if (!isAdmin) return res.redirect("/");
    res.render('admin', { title: 'Admin', isAdmin: isAdmin, isowner });

});

router.get('/alladmin', async function (req, res, next) {
    let {isAdmin, isowner} = checkSession(req, res);
    if (!isowner) return res.redirect("/");
    res.render('allAdmins', { title: 'allAdmin', isowner })
})

router.get('/alladminsearch', async function (req, res, next) {
    let {isAdmin, isowner} = checkSession(req, res);
    if (!isowner) return res.redirect('/')

    let adminData = JSON.parse(fs.readFileSync("./routes/auth/admin.json"))

    return res.send(adminData)
})

router.get('/delete', async function (req, res, next) {
    let {isAdmin, isowner} = checkSession(req, res);
    if (!isowner) return res.redirect('/')
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
    let {isAdmin, isowner} = checkSession(req, res);
    if (!isAdmin && isowner) return res.redirect("/")

    let data = { ...req.body }

    let hashPassword = await bcrypt.hash(data.password, 5)

    let newAdmin = {
        session: [],
        email: data.email,
        password: hashPassword,
        owner: data.adminType
    }

    let adminData = JSON.parse(fs.readFileSync("./routes/auth/admin.json"))

    adminData.push(newAdmin)

    fs.writeFileSync("./routes/auth/admin.json", JSON.stringify(adminData))

    return res.status(200).send({message: 'add success'})
})

module.exports = router;
