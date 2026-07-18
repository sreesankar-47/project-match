import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const response = await axios.post('https://project-match.onrender.com/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
      window.location.reload(); // Ensures the Navbar updates with user state
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || '❌ Login failed. Check your email and password.');
    }
  };

  return (
    <main className="container" style={{ maxWidth: '450px' }}>
      <div className="project-card">
        <h2 style={{ marginTop: 0 }}>🔐 Welcome Back</h2>
        
        {error && (
          <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#f8d7da', color: '#721c24' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Log In
          </button>
        </form>
      </div>
    </main>
  );
}

export default Login;
