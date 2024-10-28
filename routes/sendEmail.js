const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const dotenv = require('dotenv');
const fs = require('fs').promises;
// These id's and secrets should come from .env file.
const CLIENT_ID = "875656222736-ip7hujo32jhjskno15s9pdi95jom97ig.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = process.env.REDIRECT_URI || "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04RiZewVbtyHCCgYIARAAGAQSNwF-L9Irs77_BrIVK_tIpWy3a21qpG6t9Adkvat-_uemJjADXO48TERLoHlFr6CD-Rrbp4Xqceo";
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
        await logMailError(result);
        return result;
    } catch (error) {
        await logMailError(error);
        return error;
    }
}


// Function to log error if present in result
async function logMailError(result) {
    let logMessage;

    if (result?.response?.data?.error) {
        logMessage = `${result.response.headers.date} - Google Cloud Error: ${result.response.data.error} - ${result.response.data.error_description} - ${result.response.status}\n`;
    } else {
        return;
    }

    try {
        await fs.appendFile('MailError.log', logMessage);
    } catch (err) {
        console.error("Failed to write to log file:", err);
    }
}

module.exports = { sendMail };
