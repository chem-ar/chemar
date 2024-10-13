const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const dotenv = require('dotenv');
// These id's and secrets should come from .env file.
const CLIENT_ID = process.env.CLIENT_ID || "527897734454-hsdddi8i40nadj134ea17dor8h58onso.apps.googleusercontent.com";
const CLIENT_SECRET = process.env.CLIENT_SECRET || "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";
const REDIRECT_URI = process.env.REDIRECT_URI || "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = process.env.REFRESH_TOKEN || "1//04jeeMMoaqjAbCgYIARAAGAQSNwF-L9IrTd1G3cZEArKnhCSaY1wdkz-8iqkks1v06UJ4jp2e6hNaVEepHqy2gR3S6Ioclw2-RJU";
const USER = process.env.USER || "shahriarhossain.3686@gmail.com";

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
            from: "ChemAr <shahriarhossain.3686@gmail.com>",
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
