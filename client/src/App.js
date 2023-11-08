// App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ManagerPOS from './ManagerPOS/ManagerPOS';
import CashierPOS from './CashierPOS/CashierPOS';
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
          <li>
            <NavLink to="/cashier" className={({ isActive }) => isActive ? 'active' : ''}>Cashier</NavLink>
          </li>
          <li>
            <NavLink to="/menu_board" className={({ isActive }) => isActive ? 'active' : ''}>Menu Board</NavLink>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/manager" element={<ManagerPOS />} />
        <Route path="/cashier" element={<CashierPOS />} />
        <Route path="/menu_board" element={<CashierPOS />} />
      </Routes>
    </div>
  );
}

export default App;