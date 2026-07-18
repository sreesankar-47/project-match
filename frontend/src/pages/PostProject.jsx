import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function PostProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [status, setStatus] = useState(null);
  
  const navigate = useNavigate();

  const userString = localStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString) : null;

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!currentUser) {
      setStatus({ type: 'error', message: '❌ You must be logged in to post a project.' });
      return;
    }

    const skillsArray = skills.split(',').map(skill => skill.trim());

    try {
      await axios.post('https://project-match.onrender.com/api/projects', {
        title: title,
        description: description,
        requiredSkills: skillsArray,
        projectLead: currentUser._id || currentUser.id
      });
      
      setStatus({ type: 'success', message: '✅ Project posted successfully! Redirecting...' });
      setTitle('');
      setDescription('');
      setSkills('');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error("Error posting project:", error);
      setStatus({ type: 'error', message: '❌ Failed to post project. Please try again.' });
    }
  };

  if (!currentUser) {
    return (
      <main className="container">
        <div className="project-card" style={{ textAlign: 'center' }}>
          <h2>🔒 Access Denied</h2>
          <p>Please log in to post a new project.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="project-card">
        <h2 style={{ marginTop: 0 }}>➕ Post a New Project</h2>
        
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="skills-label">Project Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="project-card"
              style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div>
            <label className="skills-label">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', minHeight: '120px', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div>
            <label className="skills-label">Required Skills (comma separated)</label>
            <input 
              type="text" 
              placeholder="e.g. React, Node.js, Python"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', boxSizing: 'border-box' }}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Submit Project
          </button>
        </form>
      </div>
    </main>
  );
}

export default PostProject;
