const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    requiredSkills: {
        type: [String], // Skills needed for this project e.g., ['MongoDB', 'Express']
        required: true
    },
    projectLead: {
        type: mongoose.Schema.Types.ObjectId, // Connects the project to a specific User ID
        ref: 'User',
        required: true
    },
    // 👈 Added this new field to store join requests
    requests: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }]
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
