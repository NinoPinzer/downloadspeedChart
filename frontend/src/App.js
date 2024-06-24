import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard.js';
import Settings from './components/Settings.js';
function App() {
  return (
    <Router>
      <div className="App">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
