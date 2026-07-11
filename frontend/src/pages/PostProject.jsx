import React, { useState } from 'react';
import axios from 'axios';

function PostProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [projectLead, setProjectLead] = useState(''); // 👈 New state for Project Lead
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    const skillsArray = skills.split(',').map(skill => skill.trim());

    try {
      // 👈 Now sending all 4 required fields to the backend!
      await axios.post('http://localhost:5000/api/projects', {
        title: title,
        description: description,
        requiredSkills: skillsArray,
        projectLead: projectLead 
      });
      
      setStatus({ type: 'success', message: '✅ Project posted successfully!' });
      setTitle('');
      setDescription('');
      setSkills('');
      setProjectLead(''); // clear the field
    } catch (error) {
      console.error("Error posting project:", error);
      setStatus({ type: 'error', message: '❌ Failed to post project. Check your User ID!' });
    }
  };

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

        {/* 👈 New Input Field for Project Lead */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Project Lead (MongoDB User ID)</label>
          <input 
            type="text" 
            placeholder="Paste a valid User ID here..."
            value={projectLead}
            onChange={(e) => setProjectLead(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Submit Project
        </button>
      </form>
    </div>
  );
}

export default PostProject;
