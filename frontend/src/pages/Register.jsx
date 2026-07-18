import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    skills: '',
    bio: ''
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert comma-separated skills into an array
    const skillsArray = formData.skills.split(',').map(skill => skill.trim());

    try {
      await axios.post('https://project-match.onrender.com/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        skills: skillsArray,
        bio: formData.bio
      });
      
      setStatus({ type: 'success', message: '✅ Registration successful! You can now log in.' });
      setFormData({ name: '', email: '', password: '', skills: '', bio: '' });
    } catch (error) {
      console.error("Registration error:", error);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || '❌ Registration failed. Please try again.' 
      });
    }
  };

  return (
    <main className="container" style={{ maxWidth: '500px' }}>
      <div className="project-card">
        <h2 style={{ marginTop: 0 }}>📝 Create an Account</h2>
        
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
            <label className="skills-label">Full Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div>
            <label className="skills-label">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div>
            <label className="skills-label">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div>
            <label className="skills-label">Skills (comma separated)</label>
            <input 
              type="text" 
              name="skills"
              placeholder="e.g. React, Node.js, MongoDB"
              value={formData.skills}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label className="skills-label">Short Bio</label>
            <textarea 
              name="bio"
              placeholder="Tell us a bit about yourself..."
              value={formData.bio}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', minHeight: '100px', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Sign Up
          </button>
        </form>
      </div>
    </main>
  );
}

export default Register;
