var express = require('express');
var router = express.Router();
const { endSession } = require('./auth/session-mgmt');

router.get('/', async function(req, res, next) {
    try {
        await endSession(req, res);  
        return res.redirect("/login");  
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).send("Error logging out");
    }
});

module.exports = router;