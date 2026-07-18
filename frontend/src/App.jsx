import React, { useState, useEffect } from 'react'; // 👈 1. Import useState and useEffect
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import PostProject from './pages/PostProject';
import AiMatch from './pages/AiMatch';
import Register from './pages/Register'; 
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard';

function App() {
  // 👈 2. Use state to track the user
  const [user, setUser] = useState(null);

  // 👈 3. Check localStorage whenever the app loads
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null); // 👈 4. Clear the state so the Navbar updates instantly
    window.location.href = '/login';
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
          
          {user && (
            <Link to="/dashboard" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold', fontSize: '18px' }}>
              My Dashboard
            </Link>
          )}

          <Link to="/discover" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold', fontSize: '18px' }}>
            AI Matchmaker
          </Link>
          
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
