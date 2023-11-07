// ManagerPOS.js
import React from 'react';
import './ManagerPOS.css'; // Assuming your CSS is in this file
import { NavLink, Routes, Route } from 'react-router-dom';

// Import your page components
import Employees from './pages/Employees';
import Sales from './pages/Sales';
import Inventory from './pages/Inventory';
import Menu from './pages/Menu';
import AddOns from './pages/AddOns';

const ManagerPOS = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <NavLink to="/employees" className={({ isActive }) => isActive ? 'active' : ''}>Employees</NavLink>
          </li>
          <li>
            <NavLink to="/sales" className={({ isActive }) => isActive ? 'active' : ''}>Sales</NavLink>
          </li>
          <li>
            <NavLink to="/inventory" className={({ isActive }) => isActive ? 'active' : ''}>Inventory</NavLink>
          </li>
          <li>
            <NavLink to="/menu" className={({ isActive }) => isActive ? 'active' : ''}>Menu</NavLink>
          </li>
          <li>
            <NavLink to="/add-ons" className={({ isActive }) => isActive ? 'active' : ''}>Add-ons</NavLink>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/employees" element={<Employees />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/add-ons" element={<AddOns />} />
        <Route path="/" element={<Employees />} />
      </Routes>
    </div>
  );
};

export default ManagerPOS;
