const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();

// Use CORS middleware
app.use(cors());

app.use(express.json());

app.post('/api/save-env', async (req, res) => {
    try {
        const { GOOGLE_API_KEY } = req.body;

        if (!GOOGLE_API_KEY) {
            return res.status(400).json({ error: 'API key is required' });
        }

        const envPath = path.resolve(process.cwd(), '.env');
        const envContent = await fs.readFile(envPath, 'utf-8');

        const updatedContent = envContent.replace(
            /GOOGLE_API_KEY=.*/,
            `GOOGLE_API_KEY=${GOOGLE_API_KEY}`
        );

        await fs.writeFile(envPath, updatedContent);

        res.json({ message: 'API key saved successfully' });
    } catch (error) {
        console.error('Error saving to .env:', error);
        res.status(500).json({ error: 'Failed to save API key' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
