// App.js
import React from 'react';
import { BrowserRouter, NavLink,Route,Routes} from 'react-router-dom';
import ManagerPOS from './ManagerPOS/ManagerPOS';
import CashierPOS from './CashierPOS/CashierPOS';
import CustomerPOS from './CustomerPOS/CustomerPOS';
import './App.css'; // Assuming your CSS is in this file
import './ManagerPOS/components/table.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <LandingPage />
      </div>
    </BrowserRouter>
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
          <li>
            <NavLink to="/customer" className={({ isActive }) => isActive ? 'active' : ''}>Customer</NavLink>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/manager/*" element={<ManagerPOS />} />
        <Route path="/cashier" element={<CashierPOS />} />
        <Route path="/menu_board" element={<CashierPOS />} />
      </Routes>
    </div>
  );
}

export default App;