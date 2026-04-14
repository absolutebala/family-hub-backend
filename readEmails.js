const fs = require('fs');
const { google } = require('googleapis');

console.log("🚀 Fetching emails...");

const auth = new google.auth.OAuth2();
auth.setCredentials(JSON.parse(fs.readFileSync('token.json')));

const gmail = google.gmail({ version: 'v1', auth });

async function fetchEmails() {
    try {
        const res = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 5
        });

        const messages = res.data.messages || [];

        console.log("👉 Messages count:", messages.length);

        let results = [];

        for (let msg of messages) {
            const msgData = await gmail.users.messages.get({
                userId: 'me',
                id: msg.id
            });

            const headers = msgData.data.payload.headers;
            const subject = headers.find(h => h.name === 'Subject')?.value;

            console.log("📩 Subject:", subject);

            if (subject && subject.toLowerCase().includes("nikhil")) {
                results.push({
                    type: "event",
                    title: subject
                });
            }
        }

        fs.writeFileSync('familyData.json', JSON.stringify(results, null, 2));

        console.log("✅ Data saved to familyData.json");

    } catch (err) {
        console.log("❌ Error:", err.message);
    }
}

fetchEmails();
