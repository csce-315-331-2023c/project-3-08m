import React from 'react';
import './CashierPOS.css';
import { NavLink, Routes, Route } from 'react-router-dom';

import AddAddOns from './AddAddOns';

const CashierPOS = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <NavLink to="/AddAddOns" className={({ isActive }) => isActive ? 'active' : ''}>Menu Item 1</NavLink>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/AddAddOns" element={<AddAddOns />} />
      </Routes>
    </div>
  );
};

export default CashierPOS;