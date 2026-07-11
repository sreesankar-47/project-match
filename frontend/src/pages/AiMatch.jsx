import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

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
      // 1. Fetch the active projects from your database first
      const dbResponse = await axios.get('http://localhost:5000/api/projects');
      const activeProjects = dbResponse.data;

      // 2. Send the skills AND the projects to your exact AI route
      const aiResponse = await axios.post('http://localhost:5000/api/projects/recommend', {
        studentSkills: skills,
        activeProjects: activeProjects
      });
      
      // 3. Read the 'recommendations' variable your backend sends back
      setRecommendations(aiResponse.data.recommendations);
    } catch (err) {
      console.error("Error fetching AI matches:", err);
      setError("Failed to communicate with the AI engine. Please check your backend terminal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', color: '#333' }}>
        AI Project Matchmaker
      </h2>
      <p style={{ color: '#555', marginBottom: '20px' }}>
        Enter your current tech stack, and our AI will analyze active marketplace listings to find your ideal project.
      </p>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="e.g., Python, React, MongoDB..."
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }}
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: loading ? '#ccc' : '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: loading ? 'not-allowed' : 'pointer', 
            fontWeight: 'bold' 
          }}
        >
          {loading ? 'Analyzing...' : 'Find Matches'}
        </button>
      </form>

      {error && (
        <div style={{ padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {recommendations && (
     <div style={{ 
       padding: '20px', 
       backgroundColor: '#f8f9fa', 
       border: '1px solid #e2e8f0', 
       borderRadius: '8px',
       lineHeight: '1.6',
       color: '#333'
     }}>
       <h3 style={{ marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>AI Recommendations</h3>
       <ReactMarkdown>{recommendations}</ReactMarkdown>
     </div>
   )}
    </div>
  );
}

export default AiMatch;


