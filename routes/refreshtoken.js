var express = require('express');
var router = express.Router();
const axios = require('axios');
const qs = require('qs');
const { getConfig, updateConfig } = require('./sendEmail');
const { checkSession } = require('./auth/session-mgmt')

router.get('/', async function (req, res) {
    const authorizationCode = req.query.code;
    let { isAdmin, isowner } = checkSession(req, res);

    if (!authorizationCode) {
        return res.render("confirmationMessage", { title: 'Confirmation Message', message: 'Sorry, Something went wrong. Please try again later.', isAdmin: isAdmin, isowner });
    }

    

    try {
        const config = getConfig();
        const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN, USER } = config;
        const data = qs.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
            code: authorizationCode
        });

        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = tokenResponse.data.access_token;
        const refreshToken = tokenResponse.data.refresh_token;

        const newRefreshToken = {
            REFRESH_TOKEN: refreshToken,
        };

        updateConfig(newRefreshToken);

        console.log(refreshToken);


        return res.render("confirmationMessage", { title: 'Confirmation Message', message: 'Refresh Token Sucessfullly Updated!!', isAdmin: isAdmin, isowner });
    } catch (error) {
        console.error('Error retrieving access token:', error);
        return res.render("confirmationMessage", { title: 'Confirmation Message', message: 'Sorry, Something went wrong. Please try again later.', isAdmin: isAdmin, isowner });
    }

});






module.exports = router;