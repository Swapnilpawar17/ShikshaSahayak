import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState({ queries: [], modules: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // Auto-refresh every 5 seconds to make it look "live"
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dashboard');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRunAnalysis = async () => {
    alert("⚙️ Running System Analysis on Teacher Data...");
    await axios.post('http://localhost:5000/api/trigger-analysis');
    fetchDashboardData();
    alert("✅ Pattern Detected! New Training Module Generated.");
  };

  const handleDeploy = async (id) => {
    await axios.post(`http://localhost:5000/api/deploy-module/${id}`);
    fetchDashboardData();
    alert("🚀 Module Deployed to District Teachers!");
  };

  return (
    <div className="dashboard">
      <header className="header">
        <h1>🎓 Just-in-Time Teacher Coach</h1>
        <p>District Command Center</p>
      </header>

      <div className="container">
        {/* Action Bar */}
        <div className="action-bar">
          <button className="analyze-btn" onClick={handleRunAnalysis}>
            ⚡ Run System Analysis
          </button>
        </div>

        {/* SECTION 1: SYSTEM GENERATED MODULES */}
        <h2>📚 Recommended Training Modules (Pattern Detection)</h2>
        <div className="module-grid">
          {data.modules.length === 0 ? (
            <p className="placeholder-text">System analyzing classroom patterns...</p>
          ) : (
            data.modules.map((m) => (
              <div key={m.id} className={`card module-card ${m.status}`}>
                <div className="module-header">
                  <h3>{m.title}</h3>
                  <span className={`status-badge ${m.status}`}>
                    {m.status === 'deployed' ? 'LIVE ✅' : 'PENDING ⚠️'}
                  </span>
                </div>
                <p><strong>Generated from:</strong> {m.generated_from_queries} teacher queries</p>
                <p><strong>Success Rate:</strong> {m.success_rate}%</p>
                <div className="module-content">
                  <pre>{m.content}</pre>
                </div>
                {m.status !== 'deployed' && (
                  <button className="deploy-btn" onClick={() => handleDeploy(m.id)}>
                    Approve & Deploy 🚀
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* SECTION 2: LIVE QUERIES */}
        <h2>📝 Live Classroom Queries</h2>
        <div className="query-list">
          {data.queries.map((q) => (
            <div key={q.id} className="card query-card">
              <div className="card-header">
                <span className="badge">{q.subject}</span>
                <span className="teacher">👤 {q.teacher_id}</span>
              </div>
              <p className="query-text">"{q.query}"</p>
              <div className="ai-reply">🤖 {q.response}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;