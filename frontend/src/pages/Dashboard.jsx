import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

function Dashboard() {
  const [myProjects, setMyProjects] = useState([]);
  const [joinedProjects, setJoinedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userString = localStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString) : null;

  const fetchDashboardData = async () => {
    try {
      const userId = currentUser._id || currentUser.id;
      const [myProjectsRes, joinedProjectsRes] = await Promise.all([
        axios.get(`https://project-match.onrender.com/api/projects/my-projects/${userId}`),
        axios.get(`https://project-match.onrender.com/api/projects/joined-projects/${userId}`)
      ]);
      setMyProjects(myProjectsRes.data);
      setJoinedProjects(joinedProjectsRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError('Failed to load dashboard data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) fetchDashboardData();
    else setLoading(false);
  }, [currentUser]);

  const handleAccept = async (projectId, applicantId, applicantName) => {
    try {
      await axios.post(`https://project-match.onrender.com/api/projects/${projectId}/accept`, {
        userId: applicantId
      });
      alert(`Success! You have accepted ${applicantName} into the project.`);
      fetchDashboardData(); 
    } catch (error) {
      console.error('Error accepting applicant:', error);
      alert('Failed to accept applicant. Please try again.');
    }
  };

  if (!currentUser) return <main className="container"><p>Please log in to view your dashboard.</p></main>;
  if (loading) return <main className="container"><p>Loading your dashboard...</p></main>;
  if (error) return <main className="container"><p style={{ color: 'red' }}>{error}</p></main>;

  return (
    <main className="container">
      <h1>My Dashboard</h1>
      
      <h2 style={{ marginTop: '40px' }}>Projects I'm Leading</h2>
      {myProjects.length === 0 ? (
        <p>You haven't posted any projects yet.</p>
      ) : (
        myProjects.map((project) => (
          <div key={project._id} className="project-card">
            <h3>{project.title}</h3>
            <p className="project-desc">{project.description}</p>
            
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#F8F9FB', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>Applicants ({project.requests?.length || 0})</h4>
              {!project.requests || project.requests.length === 0 ? (
                <p style={{ margin: 0, fontSize: '0.9rem' }}>No pending requests.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {project.requests.map((applicant) => (
                    <li key={applicant._id} style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{applicant.name}</strong>
                        <div className="skill-pill" style={{ marginLeft: '10px' }}>Score: {applicant.matchScore || 0}</div>
                        <br/><a href={`mailto:${applicant.email}`} style={{ fontSize: '0.85rem' }}>{applicant.email}</a>
                      </div>
                      <button onClick={() => handleAccept(project._id, applicant._id, applicant.name)} className="btn-primary">
                        Accept
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))
      )}

      <h2 style={{ marginTop: '40px' }}>Projects I've Joined</h2>
      {joinedProjects.length === 0 ? (
        <p>You haven't been accepted into any projects yet.</p>
      ) : (
        joinedProjects.map((project) => (
          <div key={project._id} className="project-card">
            <h3>{project.title}</h3>
            <p className="project-desc">{project.description}</p>
            <p><strong>Project Lead:</strong> {project.projectLead?.name} ({project.projectLead?.email})</p>
          </div>
        ))
      )}
    </main>
  );
}

export default Dashboard;
