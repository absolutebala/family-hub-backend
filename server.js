const express = require('express');
const fs = require('fs');

const app = express();

app.get('/family-data', (req, res) => {
    try {
        if (!fs.existsSync('familyData.json')) {
            return res.json([]);
        }

        const data = JSON.parse(fs.readFileSync('familyData.json'));
        res.json(data);
    } catch (err) {
        console.log("❌ Error:", err.message);
        res.json([]);
    }
});

app.get('/', (req, res) => {
    res.send("Family Hub API running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
