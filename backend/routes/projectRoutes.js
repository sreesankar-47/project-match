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

    if (project.requests.includes(userId)) {
      return res.status(400).json({ message: 'You have already requested to join this project.' });
    }

    project.requests.push(userId);
    await project.save();

    res.status(200).json({ message: 'Request sent successfully!' });
  } catch (error) {
    console.error("Error joining project:", error);
    res.status(500).json({ message: 'Server error while sending request' });
  }
});

// Route 4: Get Dashboard projects with Candidate Scoring
router.get('/my-projects/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Populate 'skills' so we can perform the comparison
        const myProjects = await Project.find({ projectLead: userId })
            .populate('requests', 'name email skills')
            .populate('acceptedMembers', 'name email');

        const projectsWithScores = myProjects.map(project => {
            const scoredRequests = project.requests.map(applicant => {
                // Count intersection of applicant skills and project requiredSkills
                const score = applicant.skills.filter(s => 
                    project.requiredSkills.includes(s)
                ).length;
                
                return {
                    ...applicant.toObject(),
                    matchScore: score
                };
            });

            return {
                ...project.toObject(),
                requests: scoredRequests.sort((a, b) => b.matchScore - a.matchScore)
            };
        });

        res.status(200).json(projectsWithScores);
    } catch (error) {
        console.error('❌ Error fetching dashboard projects:', error);
        res.status(500).json({ message: 'Server error pulling dashboard projects' });
    }
});

// 🏆 Route 5: Accept an applicant
router.post('/:id/accept', async (req, res) => {
  try {
    const projectId = req.params.id;
    const { userId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.requests = project.requests.filter(id => id.toString() !== userId);
    
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

// 🤝 Route 6: Get projects where the user has been accepted
router.get('/joined-projects/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const joinedProjects = await Project.find({ acceptedMembers: userId })
            .populate('projectLead', 'name email');

        res.status(200).json(joinedProjects);
    } catch (error) {
        console.error('❌ Error fetching joined projects:', error);
        res.status(500).json({ message: 'Server error pulling joined projects' });
    }
});

// 🤖 Route 7: Original Matchmaking Route
router.get('/match/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const allProjects = await Project.find().populate('projectLead', 'name email');

        const matches = allProjects.map(project => {
            const matchesCount = project.requiredSkills.filter(skill => 
                user.skills.includes(skill)
            ).length;
            
            return {
                ...project.toObject(),
                matchScore: matchesCount 
            };
        });

        const rankedMatches = matches
            .filter(m => m.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore);

        res.json(rankedMatches);
    } catch (error) {
        res.status(500).json({ message: "Error in AI matchmaking", error });
    }
});

// 💡 Route 8: Recommendation route for AiMatch.jsx
router.post('/recommend', async (req, res) => {
    try {
        const { studentSkills, activeProjects } = req.body;
        const skillList = studentSkills.split(',').map(s => s.trim().toLowerCase());

        const recommendations = activeProjects.map(project => {
            const matches = project.requiredSkills.filter(reqSkill => 
                skillList.includes(reqSkill.toLowerCase())
            );
            
            return {
                title: project.title,
                score: matches.length,
                reason: matches.length > 0 
                    ? `Matches your skills in: ${matches.join(', ')}` 
                    : null
            };
        })
        .filter(p => p.score > 0)
        .sort((a, b) => b.score - a.score);

        const markdownResponse = recommendations.length > 0 
            ? recommendations.map(r => `### ${r.title}\n**Match Score:** ${r.score}\n*${r.reason}*\n`).join('\n')
            : "No specific project matches found for your skills. Try adding more technologies!";

        res.json({ recommendations: markdownResponse });
    } catch (error) {
        res.status(500).json({ message: "Error generating recommendations" });
    }
});

module.exports = router;
