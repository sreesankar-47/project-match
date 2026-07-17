import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 👈 1. Read the user from local storage to see if they are logged in
  const userString = localStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    // Fetch all project listings from our live backend API
    axios.get('https://project-match.onrender.com/api/projects')
      .then((response) => {
        setProjects(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Error fetching data from backend:', err);
        setError('Failed to pull project listings from server.');
        setLoading(false);
      });
  }, []);

  // 👈 2. Create the function that fires when the button is clicked
  const handleJoinRequest = (projectId, projectTitle) => {
    // For now, we will trigger a success alert. 
    // Later, this can be an axios.post() to send an email or database notification!
    alert(`✅ Success! A request to join "${projectTitle}" has been triggered.`);
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading project marketplace...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        🚀 ProjectMatch Marketplace
      </h1>
      
      <div style={{ marginTop: '20px' }}>
        {projects.length === 0 ? (
          <p>No active projects posted yet.</p>
        ) : (
          projects.map((project) => (
            <div 
              key={project._id} 
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '15px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>{project.title}</h2>
              <p style={{ color: '#666', lineHeight: '1.5' }}>{project.description}</p>
              
              <div style={{ marginTop: '10px' }}>
                <strong>Required Skills:</strong>{' '}
                {project.requiredSkills.map((skill, index) => (
                  <span 
                    key={index} 
                    style={{
                      display: 'inline-block',
                      background: '#f0f0f0',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      marginRight: '5px',
                      fontSize: '14px'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {project.projectLead && (
                <div style={{ marginTop: '15px', fontSize: '14px', color: '#777' }}>
                  👤 <strong>Project Lead:</strong> {project.projectLead.name} ({project.projectLead.email})
                </div>
              )}

              {/* 👈 3. The Conditional "Request to Join" UI */}
              <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                {currentUser ? (
                  <button 
                    onClick={() => handleJoinRequest(project._id, project.title)}
                    style={{ 
                      padding: '10px 15px', 
                      backgroundColor: '#28a745', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer', 
                      fontWeight: 'bold' 
                    }}
                  >
                    Request to Join
                  </button>
                ) : (
                  <span style={{ fontSize: '14px', color: '#dc3545', fontStyle: 'italic' }}>
                    🔒 Please log in to request to join this project.
                  </span>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
