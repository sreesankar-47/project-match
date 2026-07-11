import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import PostProject from './pages/PostProject';

function App() {
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
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold', fontSize: '18px' }}>
            🏠 Browse Projects
          </Link>
          <Link to="/post" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold', fontSize: '18px' }}>
            ➕ Post a Project
          </Link>
        </nav>

        {/* Page Content */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post" element={<PostProject />} />
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
