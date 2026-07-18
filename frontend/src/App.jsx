import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import PostProject from './pages/PostProject';
import AiMatch from './pages/AiMatch';
import Register from './pages/Register'; 
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard'; // 👈 1. Imported the new Dashboard component

function App() {
  // 1. Check if there is a logged-in user saved in the browser's memory
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // 2. Create a function to handle logging out
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Refresh and redirect to login
  };

  return (
    <Router>
      <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', padding: '20px' }}>
        
        {/* Navigation Bar */}
        <nav style={{ 
          display: 'flex', 
          gap: '20px', 
          background: '#f8f9fa', 
          padding: '15px 20px', 
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          alignItems: 'center'
        }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold', fontSize: '18px' }}>
            Browse Projects
          </Link>
          <Link to="/post" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold', fontSize: '18px' }}>
            Post a Project
          </Link>
          
          {/* 👈 2. Added Dashboard link, conditionally rendering only for logged-in users */}
          {user && (
            <Link to="/dashboard" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold', fontSize: '18px' }}>
              My Dashboard
            </Link>
          )}

          <Link to="/discover" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold', fontSize: '18px' }}>
            AI Matchmaker
          </Link>
          
          {/* 3. Dynamically show buttons based on login status */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px', alignItems: 'center' }}>
            {user ? (
              <>
                <span style={{ fontWeight: 'bold', color: '#555' }}>Hi, {user.name}</span>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#dc3545', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold', fontSize: '18px' }}>
                  Login
                </Link>
                <Link to="/register" style={{ textDecoration: 'none', color: '#28a745', fontWeight: 'bold', fontSize: '18px' }}>
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Page Content */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post" element={<PostProject />} />
          
          {/* 👈 3. Added the Route for the Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/discover" element={<AiMatch />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
