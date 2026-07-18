import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the logged-in user
  const userString = localStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString) : null;

  // 1. Defined outside useEffect so we can call it to refresh the page after accepting someone
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

  useEffect(() => {
    if (currentUser) {
      fetchMyProjects();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  // 2. New function that fires when you click "Accept"
  const handleAccept = async (projectId, applicantId, applicantName) => {
    try {
      await axios.post(`https://project-match.onrender.com/api/projects/${projectId}/accept`, {
        userId: applicantId
      });
      alert(`✅ Success! You have accepted ${applicantName} into the project.`);
      
      // Refresh the dashboard to instantly move them from Applicants to Team Members
      fetchMyProjects(); 
    } catch (error) {
      console.error('Error accepting applicant:', error);
      alert('❌ Failed to accept applicant. Please try again.');
    }
  };

  if (!currentUser) return <div style={{ padding: '20px' }}>Please log in to view your dashboard.</div>;
  if (loading) return <div style={{ padding: '20px' }}>Loading your projects...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        📊 My Project Dashboard
      </h1>
      <p style={{ color: '#666' }}>Manage the projects you have posted and build your team.</p>
      
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
              
              {/* 👥 Applicants Section with Accept Buttons */}
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #ddd' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#333' }}>
                  👥 Applicants ({project.requests?.length || 0})
                </h3>
                
                {!project.requests || project.requests.length === 0 ? (
                  <p style={{ margin: 0, color: '#777', fontSize: '14px' }}>No pending requests.</p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: '0', listStyle: 'none' }}>
                    {project.requests.map((applicant) => (
                      <li key={applicant._id} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                        <div>
                          <strong>{applicant.name}</strong> <br/>
                          <a href={`mailto:${applicant.email}`} style={{ color: '#007bff', fontSize: '14px' }}>{applicant.email}</a>
                        </div>
                        <button 
                          onClick={() => handleAccept(project._id, applicant._id, applicant.name)}
                          style={{ padding: '6px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          Accept
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* ✅ New Team Members Section */}
              {project.acceptedMembers && project.acceptedMembers.length > 0 && (
                <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '6px', border: '1px solid #c8e6c9' }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#2e7d32' }}>
                    ✅ Team Members ({project.acceptedMembers.length})
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#1b5e20' }}>
                    {project.acceptedMembers.map((member) => (
                      <li key={member._id} style={{ marginBottom: '5px' }}>
                        <strong>{member.name}</strong> - {member.email}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
