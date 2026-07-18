import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import '../App.css';

function AiMatch() {
  const [skills, setSkills] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecommendations('');

    try {
      const dbResponse = await axios.get('https://project-match.onrender.com/api/projects');
      const activeProjects = dbResponse.data;

      const aiResponse = await axios.post('https://project-match.onrender.com/api/projects/recommend', {
        studentSkills: skills,
        activeProjects: activeProjects
      });
      
      setRecommendations(aiResponse.data.recommendations);
    } catch (err) {
      console.error("Error fetching AI matches:", err);
      setError("Failed to communicate with the AI engine. Please check your backend terminal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <div className="project-card">
        <h2 style={{ marginTop: 0 }}>AI Project Matchmaker</h2>
        <p className="project-desc">
          Enter your current tech stack, and our AI will analyze active marketplace listings to find your ideal project.
        </p>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <input 
            type="text" 
            placeholder="e.g., Python, React, MongoDB..."
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '16px' }}
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary"
            style={{ padding: '0 20px', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Analyzing...' : 'Find Matches'}
          </button>
        </form>

        {error && (
          <div style={{ padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '8px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {recommendations && (
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#F8F9FB', 
            border: '1px solid #E5E7EB', 
            borderRadius: '8px',
            lineHeight: '1.6',
            color: '#0A2540'
          }}>
            <h3 style={{ marginTop: 0, borderBottom: '1px solid #E5E7EB', paddingBottom: '10px' }}>AI Recommendations</h3>
            <ReactMarkdown>{recommendations}</ReactMarkdown>
          </div>
        )}
      </div>
    </main>
  );
}

export default AiMatch;
