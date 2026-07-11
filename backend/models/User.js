const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    skills: {
        type: [String], // Array of skills e.g., ['React', 'Node.js', 'Python']
        default: []
    },
    bio: {
        type: String,
        trim: true,
        default: ''
    }
}, { timestamps: true }); // Automatically tracks 'createdAt' and 'updatedAt' fields

module.exports = mongoose.model('User', UserSchema);
