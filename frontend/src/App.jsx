import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import PostProject from './pages/PostProject';
import AiMatch from './pages/AiMatch';
import Register from './pages/Register'; 
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      {/* Refined Professional Navigation Bar */}
      <nav className="nav-bar">
        <div className="logo">
          <h1 style={{ margin: 0, fontSize: '1.25rem', color: '#0A2540' }}>ProjectMatch</h1>
        </div>

        <div className="nav-links">
          <Link to="/">Browse</Link>
          <Link to="/post">Post</Link>
          {user && <Link to="/dashboard">Dashboard</Link>}
          <Link to="/discover" style={{ fontWeight: 'bold' }}>AI Matchmaker</Link>
        </div>

        <div className="user-section">
          {user ? (
            <>
              <span>Hi, {user.name}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<PostProject />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/discover" element={<AiMatch />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
