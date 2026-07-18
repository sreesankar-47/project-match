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

// 🚀 Route 3: Route to handle a user requesting to join a project
router.post('/:id/request', async (req, res) => {
  try {
    const projectId = req.params.id;
    const { userId } = req.body; 

    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the user has already requested to join to prevent spam
    if (project.requests.includes(userId)) {
      return res.status(400).json({ message: 'You have already requested to join this project.' });
    }

    // Add the user's ID to the requests array and save to the database
    project.requests.push(userId);
    await project.save();

    res.status(200).json({ message: 'Request sent successfully!' });
  } catch (error) {
    console.error("Error joining project:", error);
    res.status(500).json({ message: 'Server error while sending request' });
  }
});

// 📊 Route 4: Get Dashboard projects (UPDATED to populate accepted members)
router.get('/my-projects/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Find projects where this user is the lead, and populate both arrays!
        const myProjects = await Project.find({ projectLead: userId })
            .populate('requests', 'name email')
            .populate('acceptedMembers', 'name email'); // 👈 Pulls accepted team members

        res.status(200).json(myProjects);
    } catch (error) {
        console.error('❌ Error fetching dashboard projects:', error);
        res.status(500).json({ message: 'Server error pulling dashboard projects' });
    }
});

// 🏆 Route 5: NEW route to Accept an applicant
router.post('/:id/accept', async (req, res) => {
  try {
    const projectId = req.params.id;
    const { userId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // 1. Remove the user from the requests array
    project.requests = project.requests.filter(id => id.toString() !== userId);
    
    // 2. Add the user to the acceptedMembers array
    if (!project.acceptedMembers.includes(userId)) {
      project.acceptedMembers.push(userId);
    }

    await project.save();
    res.status(200).json({ message: 'Applicant accepted successfully!' });
  } catch (error) {
    console.error("Error accepting applicant:", error);
    res.status(500).json({ message: 'Server error while accepting applicant' });
  }
});

// 🤝 Route 6: NEW route to get projects where the user has been accepted
router.get('/joined-projects/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Find projects where this user's ID is inside the acceptedMembers array
        const joinedProjects = await Project.find({ acceptedMembers: userId })
            .populate('projectLead', 'name email'); // Populate lead so they can see who accepted them

        res.status(200).json(joinedProjects);
    } catch (error) {
        console.error('❌ Error fetching joined projects:', error);
        res.status(500).json({ message: 'Server error pulling joined projects' });
    }
});

module.exports = router;
