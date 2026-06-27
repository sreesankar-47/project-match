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

// 2. 🧠 The AI Project Discovery Recommendation Route
app.post('/api/projects/recommend', async (req, res) => {
    try {
        const { studentSkills, activeProjects } = req.body;

        // Construct a tailored prompt for your marketplace discovery concept
        const prompt = `
            Act as a project discovery assistant for a college project marketplace. 
            A student has the following skillset: ${JSON.stringify(studentSkills)}.
            
            Review these active projects posted by project leads: ${JSON.stringify(activeProjects)}.
            
            Analyze which of these posted marketplace projects demand this student's skills the most. 
            Return a clean breakdown of the best project matches, including a brief, encouraging 
            explanation of exactly why their skills are demanded and how they can contribute if they request to join.
        `;

        // Fire the request over to Google Gemini
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        // Send the AI's intelligent discovery match back to the user
        res.json({
            success: true,
            recommendations: response.text
        });

    } catch (error) {
        console.error("AI Recommendation Error:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching project recommendations."
        });
    }
});

// Start our backend listener
app.listen(PORT, () => {
    console.log(`🚀 AI Engine is live and listening on http://localhost:${PORT}`);
});
