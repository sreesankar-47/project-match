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
    password: {            // 👈 We just added this for security!
        type: String,
        required: true
    },
    skills: {
        type: [String], 
        default: []
    },
    bio: {
        type: String,
        trim: true,
        default: ''
    }
}, { timestamps: true }); 

module.exports = mongoose.model('User', UserSchema);
