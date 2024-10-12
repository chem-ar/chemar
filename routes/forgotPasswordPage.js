var express = require('express');
var router = express.Router();
var fs = require('fs');
const { startSession, checkSession, endSession } = require('./auth/session-mgmt')



router.get('/', function(req, res, next) {
    res.render("forgotPasswordPage", {title: 'Forgot Password Page'});
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

        startSession(req, res)

        //https://www.geeksforgeeks.org/how-to-get-the-full-url-in-expressjs/
        let protocol = req.protocol;
        let host = req.hostname;
        let url = req.originalUrl;
        // Have to declare the port here. or else it doesnt work in localhost.
        // todo: research and test. 
        let port = process.env.PORT || 4000;


        // let baseUrl = `${protocol}://${host}:${port}${url}`


        let baseUrl = "https://localhost:4000/passwordReset"

        let tokenlink = baseUrl.concat("?token=", req.cookies.session);

        let link = tokenlink.concat("&email=", adminEmail);


        res.render("forgotPasswordPage", {title: 'Forgot Password Page'});
    }
    res.status(401).send();

});


module.exports = router;