import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

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
      
      // 🚀 FORCE A FULL RELOAD to ensure App.jsx updates the Navbar instantly
      window.location.href = '/';
      
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || '❌ Login failed. Check your email and password.');
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>🔐 Welcome Back</h2>
      
      {error && (
        <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#f8d7da', color: '#721c24' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Email</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Password</label>
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={formData.password} // Fixed: should be onChange={handleChange} in original
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
          Log In
        </button>
      </form>
    </div>
  );
}

export default Login;
