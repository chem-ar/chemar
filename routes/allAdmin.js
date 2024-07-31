var express = require('express');
var router = express.Router();
var { checkSession } = require('./auth/session-mgmt')
const bcrypt = require('bcrypt');
var fs = require('fs')

function emailExists(email){
    let adminData = JSON.parse(fs.readFileSync("./routes/auth/admin.json"))

    let exists = false

    adminData.map((ele, i) => {
        if(ele.email == email){
            exists = true
        }
    })
    
    return exists
}

router.get('/alladmin', async function (req, res, next) {
    let {isAdmin, isowner} = checkSession(req, res);
    if (!isowner) return res.redirect("/");
    res.render('allAdmins', { title: 'allAdmin', isowner })
})

router.get('/alladminsearch', async function (req, res, next) {
    let {isAdmin, isowner} = checkSession(req, res);
    if (!isowner) return res.status(401).json({error: 'Please log in as owner of the page'})

    let adminData = JSON.parse(fs.readFileSync("./routes/auth/admin.json"))

    return res.send(adminData)
})

router.get('/delete', async function (req, res, next) {
    let {isAdmin, isowner} = checkSession(req, res);
    if (!isowner) return res.status(401).json({error: 'Please log in as owner of the page'})
    let email = req.query.email;

    let adminData = JSON.parse(fs.readFileSync("./routes/auth/admin.json"))
    let adminDeleteIndex
    adminData.map((ele, i) => {
        if(ele.email == email){
            adminDeleteIndex = i
        }
    })

    if(!adminDeleteIndex){
        return res.status(400).json({error: 'Email does not exists'})
    }

    const thisAdminSession = adminData[adminDeleteIndex].session.find(
        session => session.token === req.cookies.session
    );
    if (thisAdminSession !== undefined) {
        return res.status(400).json({
            error: 'You cannot delete your own account'
        });
    }
    adminData.splice(adminDeleteIndex, 1)

    fs.writeFileSync("./routes/auth/admin.json", JSON.stringify(adminData))

    return res.status(200).send({message: 'deleted success'})
})

// adding admins
router.post('/addadmin', async function (req, res, next) {
    let {isAdmin, isowner} = checkSession(req, res);
    if (!isowner) return res.status(401).json({error: 'Please log in as owner of the page'})

    let data = { ...req.body }

    if(emailExists(data.email, res)){
        return res.status(400).json({error: 'Email already exists'})
    }

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