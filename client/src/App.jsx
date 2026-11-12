import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '100vh',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <h1 style={{ color: 'var(--text-primary)' }}>FlyerTech Blog</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Development environment ready. Milestone 1 complete.</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
