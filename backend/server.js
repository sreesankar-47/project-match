require('dotenv').config(); // Load our secret keys from the .env file
const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = 5000;

// Middleware to let our server process incoming JSON data
app.use(express.json());

// Initialize the Google Gen AI client (it will automatically look for your GEMINI_API_KEY)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 1. Simple Welcome Home Route
app.get('/', (req, res) => {
    res.send('ProjectMatch Backend Server is running smoothly!');
});

// 2. 🧠 The AI Team Matching Engine Route
app.post('/api/match', async (req, res) => {
    try {
        const { students, projectRequirements } = req.body;

        // Formulate a clean, instructional prompt for Gemini
        const prompt = `
            You are an expert academic team coordinator. 
            I am going to provide you with a list of students and the project requirements.
            Your job is to cleanly organize these students into optimized teams based on how their skill sets complement the requirements.

            Project Requirements: ${projectRequirements}
            Available Students: ${JSON.stringify(students)}

            Please return a structured breakdown of recommended teams, outlining who belongs where and a short sentence explaining why this team is balanced.
        `;

        // Fire the request over to Google Gemini 2.5 Flash
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        // Send the AI's intelligent breakdown right back to the client
        res.json({
            success: true,
            teamMatches: response.text
        });

    } catch (error) {
        console.error("AI Matching Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Something went wrong while matching teams with the AI." 
        });
    }
});

// Start our backend listener
app.listen(PORT, () => {
    console.log(`🚀 AI Engine is live and listening on http://localhost:${PORT}`);
});
