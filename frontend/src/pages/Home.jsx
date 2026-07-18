import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Ensure this points to the file we just updated

function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userString = localStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    axios.get('https://project-match.onrender.com/api/projects')
      .then((response) => {
        setProjects(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Error fetching data:', err);
        setError('Failed to pull project listings.');
        setLoading(false);
      });
  }, []);

  const handleJoinRequest = async (projectId) => {
    try {
      const response = await axios.post(`https://project-match.onrender.com/api/projects/${projectId}/request`, {
        userId: currentUser._id || currentUser.id
      });
      alert(`✅ ${response.data.message}`);
    } catch (error) {
      alert(`❌ ${error.response?.data?.message || 'Failed to send request.'}`);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading marketplace...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div>
      {/* Professional Navbar */}
      <nav className="nav-bar">
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>ProjectMatch</h1>
      </nav>

      <main style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px' }}>
          Build what the market is actually asking for.
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '40px' }}>
          Students post project ideas sourced from live hiring-skill demand. Join one, or start your own.
        </p>

        {projects.map((project) => (
          <div key={project._id} className="project-card">
            <div className="listing-tag">
              ● LIVE LISTING • DEMAND-MATCHED
            </div>
            
            <h2 style={{ fontSize: '2rem', margin: '0 0 15px 0' }}>{project.title}</h2>
            <p style={{ color: '#444', lineHeight: '1.6', marginBottom: '25px' }}>
              {project.description}
            </p>
            
            <div style={{ marginBottom: '25px' }}>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', marginBottom: '12px' }}>Required Skills</p>
              {project.requiredSkills.map((skill, index) => (
                <span key={index} className="skill-pill">
                  {skill}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E5E7EB', paddingTop: '20px' }}>
              <div>
                <strong style={{ display: 'block' }}>{project.projectLead?.name}</strong>
                <small style={{ color: '#666' }}>{project.projectLead?.email}</small>
              </div>
              
              {currentUser ? (
                <button 
                  onClick={() => handleJoinRequest(project._id)}
                  className="btn-primary"
                >
                  Request to Join
                </button>
              ) : (
                <span style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
                  🔒 Log in to join
                </span>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default Home;
