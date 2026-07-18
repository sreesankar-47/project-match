import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the logged-in user
  const userString = localStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    // Fetch only the projects where this user is the lead
    const fetchMyProjects = async () => {
      try {
        const userId = currentUser._id || currentUser.id;
        const response = await axios.get(`https://project-match.onrender.com/api/projects/my-projects/${userId}`);
        setMyProjects(response.data);
        setLoading(false);
      } catch (err) {
        console.error('❌ Error fetching dashboard:', err);
        setError('Failed to load your projects.');
        setLoading(false);
      }
    };

    fetchMyProjects();
  }, [currentUser]);

  if (!currentUser) return <div style={{ padding: '20px' }}>Please log in to view your dashboard.</div>;
  if (loading) return <div style={{ padding: '20px' }}>Loading your projects...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        📊 My Project Dashboard
      </h1>
      <p style={{ color: '#666' }}>Manage the projects you have posted and view your applicants.</p>
      
      <div style={{ marginTop: '20px' }}>
        {myProjects.length === 0 ? (
          <p>You haven't posted any projects yet.</p>
        ) : (
          myProjects.map((project) => (
            <div 
              key={project._id} 
              style={{
                border: '1px solid #007bff',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '20px',
                backgroundColor: '#f8faff'
              }}
            >
              <h2 style={{ margin: '0 0 10px 0', color: '#0056b3' }}>{project.title}</h2>
              <p style={{ color: '#555' }}>{project.description}</p>
              
              {/* This is where the magic happens: Showing the applicants! */}
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #ddd' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#333' }}>
                  👥 Applicants ({project.requests.length})
                </h3>
                
                {project.requests.length === 0 ? (
                  <p style={{ margin: 0, color: '#777', fontSize: '14px' }}>No one has requested to join yet.</p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#444' }}>
                    {project.requests.map((applicant, index) => (
                      <li key={index} style={{ marginBottom: '5px' }}>
                        <strong>{applicant.name}</strong> - <a href={`mailto:${applicant.email}`} style={{ color: '#007bff' }}>{applicant.email}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
