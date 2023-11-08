// App.js
import React from 'react';
import { BrowserRouter, NavLink,Route,Routes} from 'react-router-dom';
import ManagerPOS from './ManagerPOS/ManagerPOS';
import CashierPOS from './CashierPOS/CashierPOS';
import { NavLink, Routes, Route } from 'react-router-dom';
// import { NavLink, Routes, Route } from 'react-router-dom';
import './App.css'; // Assuming your CSS is in this file
import './ManagerPOS/components/table.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <ManagerPOS />
      </div>
    </BrowserRouter>
  );
}

// const LandingPage = () => {
//   return (
//     <div>
//       <nav>
//         <ul>
//           <li>
//             <NavLink to="/manager" className={({ isActive }) => isActive ? 'active' : ''}>Manager</NavLink>
//           </li>
//           <li>
        //     <NavLink to="/cashier" className={({ isActive }) => isActive ? 'active' : ''}>Cashier</NavLink>
        //   </li>
        // </ul>
//       </nav>

//       <Routes>
//         <Route path="/manager" element={<ManagerPOS />} />
//         <Route path="/cashier" element={<CashierPOS />} />
      // </Routes>
//     </div>
//   );
// }

export default App;