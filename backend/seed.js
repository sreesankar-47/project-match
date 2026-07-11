require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');

const seedDatabase = async () => {
    try {
        // 1. Connect to the cloud database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔄 Connected to database for seeding...');

        // 2. Clear out any existing dummy collections to stay clean
        await User.deleteMany({});
        await Project.deleteMany({});
        console.log('🧹 Cleaned old data collections!');

        // 3. Create a test student looking for matches
        const dummyUser = await User.create({
            name: 'Adarsh Kumar',
            email: 'adarsh@example.com',
            skills: ['React', 'Node.js', 'MongoDB'],
            bio: 'Pre-final year CS student building full-stack platforms.'
        });
        console.log('👤 Created Test User:', dummyUser.name);

        // 4. Create a test project listing with the user as the lead
        const dummyProject = await Project.create({
            title: 'E-Commerce Skill Marketplace',
            description: 'A platform where students post project ideas based on live skill demand.',
            requiredSkills: ['React', 'Express', 'Tailwind CSS'],
            projectLead: dummyUser._id // Links the project to our user
        });
        console.log('🚀 Created Test Project:', dummyProject.title);

        console.log('🎉 Database successfully populated with initial marketplace seed data!');
        process.exit(0); // Safely close the script execution
    } catch (error) {
        console.error('❌ Error injecting seed data:', error);
        process.exit(1);
    }
};

seedDatabase();
