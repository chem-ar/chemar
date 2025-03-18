var express = require('express');
var router = express.Router();
var { checkSession } = require('./auth/session-mgmt');

router.get('/', async function (req, res) {


    res.render('about', { title: 'About ChemAR'});
});

module.exports = router;
