const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const dotenv = require('dotenv');
// These id's and secrets should come from .env file.
const CLIENT_ID = process.env.CLIENT_ID || "875656222736-56b6nb0u8u0ma7c83mbmhiooavs5sivl.apps.googleusercontent.com";
const CLIENT_SECRET = process.env.CLIENT_SECRET || "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";
const REDIRECT_URI = process.env.REDIRECT_URI || "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = process.env.REFRESH_TOKEN || "1//04YI4Df5idYMuCgYIARAAGAQSNwF-L9IrNVUI8C0Jf-SggX-V7GmB6OF4BSNYha8Qpmz9pGtl56xbMI6HjLxC8dFlINQ0naTsUqw";
const USER = process.env.USER || "daluni.chemar@gmail.com";

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
