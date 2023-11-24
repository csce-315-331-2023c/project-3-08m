// ManagerPOS.js
import React from 'react';
import './ManagerPOS.css'; // Assuming your CSS is in this file
import './components/Tables/table.css'; 
import { NavLink, Routes, Route } from 'react-router-dom';

// Import your page components
import Employees from './pages/Employees';
import Sales from './pages/Orders';
import Inventory from './pages/Inventory';
import Menu from './pages/Menu';
import AddOns from './pages/AddOns';

const ManagerPOS = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <NavLink to="/manager/employees" className={({ isActive }) => isActive ? 'active' : ''}>Employees</NavLink>
          </li>
          <li>
            <NavLink to="/manager/orders" className={({ isActive }) => isActive ? 'active' : ''}>Orders</NavLink>
          </li>
          <li>
            <NavLink to="/manager/inventory" className={({ isActive }) => isActive ? 'active' : ''}>Inventory</NavLink>
          </li>
          <li>
            <NavLink to="/manager/menu" className={({ isActive }) => isActive ? 'active' : ''}>Menu</NavLink>
          </li>
          <li>
            <NavLink to="/manager/add-ons" className={({ isActive }) => isActive ? 'active' : ''}>Add-ons</NavLink>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/employees" element={<Employees />} />
        <Route path="/orders" element={<Sales />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/add-ons" element={<AddOns />} />
        <Route path="/" element={<Employees />} />
      </Routes>
    </div>
  );
};

export default ManagerPOS;
