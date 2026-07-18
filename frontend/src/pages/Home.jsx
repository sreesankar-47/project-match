import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

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

  if (loading) return <div className="p-4">Loading marketplace...</div>;
  if (error) return <div className="p-4 text-red">{error}</div>;

  return (
    <div>
      {/* Professional Navbar */}
      <nav className="nav-bar">
        <h1>ProjectMatch</h1>
      </nav>

      <main className="container">
        <h1 className="hero-title">Build what the market is actually asking for.</h1>
        <p className="hero-subtitle">
          Students post project ideas sourced from live hiring-skill demand. Join one, or start your own.
        </p>

        {projects.map((project) => (
          <div key={project._id} className="project-card">
            <div className="listing-tag">
              ● LIVE LISTING • DEMAND-MATCHED
            </div>
            
            <h2>{project.title}</h2>
            <p className="project-desc">
              {project.description}
            </p>
            
            <div className="skills-section">
              <p className="skills-label">Required Skills</p>
              {project.requiredSkills.map((skill, index) => (
                <span key={index} className="skill-pill">
                  {skill}
                </span>
              ))}
            </div>

            <div className="project-footer">
              <div>
                <strong>{project.projectLead?.name}</strong>
                <small className="lead-email">{project.projectLead?.email}</small>
              </div>
              
              {currentUser ? (
                <button 
                  onClick={() => handleJoinRequest(project._id)}
                  className="btn-primary"
                >
                  Request to Join
                </button>
              ) : (
                <span className="auth-prompt">
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

