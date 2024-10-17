const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const dotenv = require('dotenv');
// These id's and secrets should come from .env file.
const CLIENT_ID = "875656222736-ip7hujo32jhjskno15s9pdi95jom97ig.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = process.env.REDIRECT_URI || "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04waHLtEtFY5JCgYIARAAGAQSNwF-L9Irpr1LP4mAUe9_tNoT5z0XtgAd3KTZ1mDIlELqFa_OfzL8Y7Thp5CcNMsxWma4QMX4cJ4";
const USER = "daluni.chemar@gmail.com";

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(email, link) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: USER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: "ChemAr <daluni.chemar@gmail.com>",
            to: email,
            subject: "Forgot Password | ChemAr-test",
            text: `Hi, here is your link: ${link}`,
            html: `<h1>Hello from ChemAr</h1><p>Here is your password reset link: <a href="${link}">${link}</a></p>`,
        };

        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        return error;
    }
}

module.exports = { sendMail };
