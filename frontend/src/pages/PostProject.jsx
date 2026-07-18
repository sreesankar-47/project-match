import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PostProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [status, setStatus] = useState(null);
  
  const navigate = useNavigate();

  // 1. Grab the logged-in user from local storage securely
  const userString = localStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString) : null;

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    // Safety check: Prevent submission if the user is somehow not logged in
    if (!currentUser) {
      setStatus({ type: 'error', message: '❌ You must be logged in to post a project.' });
      return;
    }

    const skillsArray = skills.split(',').map(skill => skill.trim());

    try {
      // 2. Automatically inject the exact MongoDB ID behind the scenes!
      await axios.post('https://project-match.onrender.com/api/projects', {
        title: title,
        description: description,
        requiredSkills: skillsArray,
        projectLead: currentUser._id || currentUser.id // 👈 Automating the ID!
      });
      
      setStatus({ type: 'success', message: '✅ Project posted successfully! Redirecting...' });
      setTitle('');
      setDescription('');
      setSkills('');
      
      // 3. Automatically send the user to their dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error("Error posting project:", error);
      setStatus({ type: 'error', message: '❌ Failed to post project. Please try again.' });
    }
  };

  // 4. Prevent rendering the form entirely if the user isn't logged in
  if (!currentUser) {
    return (
      <div style={{ padding: '30px', textAlign: 'center', color: '#721c24' }}>
        <h2>🔒 Access Denied</h2>
        <p>Please log in to post a new project.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>➕ Post a New Project</h2>
      
      {status && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '15px', 
          borderRadius: '4px',
          backgroundColor: status.type === 'success' ? '#d4edda' : '#f8d7da',
          color: status.type === 'success' ? '#155724' : '#721c24'
        }}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Project Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Description</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Required Skills (comma separated)</label>
          <input 
            type="text" 
            placeholder="e.g. React, Node.js, Python"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        {/* Notice: The Project Lead manual input field has been completely removed! */}

        <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Submit Project
        </button>
      </form>
    </div>
  );
}

export default PostProject;
