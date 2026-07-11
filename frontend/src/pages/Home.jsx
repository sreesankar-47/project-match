import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all project listings from our backend API
    axios.get('http://localhost:5000/api/projects')
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
