var express = require('express');
var router = express.Router();
var fs = require('fs');
const { startSession, checkSession, endSession } = require('./auth/session-mgmt')

router.get('/', function (req, res) {
    req.cookies.session = req.query.token;
    req.body.email = req.query.email;
    let confirm = false;

    let { isAdmin, isowner } = checkSession(req, res);
    if (isAdmin) {
        confirm = true;
        endSession(req, res)
    }

    if (confirm) {
        return res.render('passwordReset', { title: 'Password Reset Page' });
    } else {
        return res.status(404);
    }

});


function emailExists(email) {
    let adminData = JSON.parse(fs.readFileSync("./routes/auth/admin.json"));
    return adminData.some(ele => ele.email === email);
}

router.post('/reset-password', async function (req, res) {
    let { isAdmin, isowner } = checkSession(req, res);
    
    if (!isAdmin) {
        return res.status(403).json({ error: 'Not authorized' });
    }

    const { email, newPassword } = req.body;

    if (!emailExists(email)) {
        return res.status(404).json({ error: 'Email not found' });
    }

    let adminData = JSON.parse(fs.readFileSync("./routes/auth/admin.json"));
    let adminIndex = adminData.findIndex(ele => ele.email === email);

    if (adminIndex === -1) {
        return res.status(404).json({ error: 'Admin not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the admin's password
    adminData[adminIndex].password = hashedPassword;

    // Save the updated admin data back to admin.json
    fs.writeFileSync("./routes/auth/admin.json", JSON.stringify(adminData));

    return res.status(200).send({ message: 'Password reset successfully' });
});

module.exports = router;