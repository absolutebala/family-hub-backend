const fs = require('fs');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = 'token.json';

const credentials = require('./credentials.json');

const { client_secret, client_id, redirect_uris } = credentials.installed;

const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
);

// Generate auth URL
const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
});

console.log('\n👉 Copy this URL and open in browser:\n');
console.log(authUrl);

// Wait for code input
process.stdin.on('data', async (code) => {
    try {
        const { tokens } = await oAuth2Client.getToken(code.toString().trim());
        oAuth2Client.setCredentials(tokens);

        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
        console.log('✅ Token stored in token.json');
        process.exit();
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
});
