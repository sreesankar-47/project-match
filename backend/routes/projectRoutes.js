const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User'); 

// 🎯 Route 1: Get ALL project listings
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate('projectLead', 'name email');
        res.status(200).json(projects);
    } catch (error) {
        console.error('❌ Error fetching projects:', error);
        res.status(500).json({ message: 'Server error pulling project listings' });
    }
});

// 🎯 Route 2: Create a NEW project listing
router.post('/', async (req, res) => {
    try {
        const { title, description, requiredSkills, projectLead } = req.body;

        // Validation check
        if (!title || !description || !requiredSkills || !projectLead) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newProject = new Project({
            title,
            description,
            requiredSkills,
            projectLead
        });

        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (error) {
        console.error('❌ Error creating project:', error);
        res.status(500).json({ message: 'Server error creating project listing' });
    }
});

module.exports = router;

