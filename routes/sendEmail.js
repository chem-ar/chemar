const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const fs = require('fs');



async function sendMail(mailOptions) {
    const config = getConfig();

    const CLIENT_ID = config.CLIENT_ID;
    const CLIENT_SECRET = config.CLIENT_SECRET;
    const REDIRECT_URI = config.REDIRECT_URI;
    const REFRESH_TOKEN = config.REFRESH_TOKEN;
    const USER = config.USER;

    console.log(CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN);

    const oAuth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    );
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
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

function getConfig() {
    try {
        const data = fs.readFileSync("./routes/emailconfig.json", 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading config file:", error);
        throw error;
    }
}


function updateConfig(newConfig) {
    try {
        // Read existing configuration
        const currentConfig = getConfig();

        // Merge current config with new values
        const updatedConfig = { ...currentConfig, ...newConfig };

        // Write updated config back to the file
        fs.writeFileSync("./routes/emailconfig.json", JSON.stringify(updatedConfig, null, 2), 'utf8');
        console.log("Config updated successfully");
    } catch (error) {
        console.error("Error updating config file:", error);
        throw error;
    }
}

module.exports = { sendMail, getConfig, updateConfig };
