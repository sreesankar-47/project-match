require('dotenv').config(); // Load our secret keys from the .env file
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;
app.use(cors());

// 1. Middleware to let our server process incoming JSON data (Place early!)
app.use(express.json());

// 2. Connect to MongoDB Atlas Cloud
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas cloud database successfully!'))
    .catch((err) => console.error('❌ MongoDB database connection error:', err));

// 3. Initialize the Google Gen AI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 4. Simple Welcome Home Route
app.get('/', (req, res) => {
    res.send('ProjectMatch Backend Server is running smoothly!');
});

// 5. 🧠 The AI Project Discovery Recommendation Route
app.post('/api/projects/recommend', async (req, res) => {
    try {
        const { studentSkills, activeProjects } = req.body;

        // Validation check
        if (!studentSkills || !activeProjects) {
            return res.status(400).json({ success: false, message: 'Missing studentSkills or activeProjects data' });
        }

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

// 6. Link our marketplace project routes
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/auth', require('./routes/auth'));

// 7. Start our backend listener
app.listen(PORT, () => {
    console.log(`🚀 AI Engine is live and listening on http://localhost:${PORT}`);
});


