// App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ManagerPOS from './ManagerPOS/ManagerPOS';
import { NavLink, Routes, Route } from 'react-router-dom';
import './App.css'; // Assuming your CSS is in this file

function App() {
  return (
    <Router>
      <div className="App">
        <LandingPage />
      </div>
    </Router>
  );
}

const LandingPage = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <NavLink to="/manager" className={({ isActive }) => isActive ? 'active' : ''}>Manager</NavLink>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/manager" element={<ManagerPOS />} />
      </Routes>
    </div>
  );
}

export default App;