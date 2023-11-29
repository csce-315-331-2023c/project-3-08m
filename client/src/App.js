// App.js
import React, { useState } from 'react';
import { BrowserRouter, NavLink,Route,Routes} from 'react-router-dom';
import { AppBar, Toolbar, Tabs, Tab } from '@mui/material';
import ManagerPOS from './ManagerPOS/ManagerPOS';
import CashierPOS from './CashierPOS/CashierPOS';
import MenuBoard from './MenuBoard/MenuBoard';
import CustomerPOS from './CustomerPOS/CustomerPOS';
import AddAddOns from './CashierPOS/AddAddOns';
import './App.css'; // Assuming your CSS is in this file
import './ManagerPOS/components/Tables/table.css';
import LoginPage from './LoginPage';
import LoginLanding from './LoginLanding';
import { Navigate } from 'react-router-dom';





function App() {
  // const navigate = useNavigate();
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [userRole, setUserRole] = useState('');

  // const handleLogin = (role) => {
  //   setIsLoggedIn(true);
  //   setUserRole(role);
  // };

  return (
    
    <Routes>  
      <Route path="/manager/*" element={<ManagerPOS />} />
      <Route path="/cashier/*" element={<CashierPOS />} />
      <Route path="/menu_board" element={<MenuBoard />} />
      <Route path="/customer/*" element={<CustomerPOS />} />
      <Route path="/cashier/add-ons" element={<AddAddOns />} />
      <Route path="/cashier/add-ons/:itemId" element={<AddAddOns />} />
      <Route path="/menu_board" element={<MenuBoard />} />
      {/* <Route path="/login/*" element={<LoginLanding onLogin={handleLogin} />} /> */}
      {/* Redirect to login by default */}
      <Route path="*" element={<LoginLanding />} />
    </Routes>
  );

  // return (
  //   <BrowserRouter>
  //     <div className="App">
  //       {/* <LoginPage /> */}
  //       <LoginLanding />
  //       {/* <LandingPage /> */}
  //     </div>
  //   </BrowserRouter>
  // );
}

function LinkTab(props) {
  return (
    <Tab
      component={NavLink}
      {...props}
    />
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
          <li>
            <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>Log-In</NavLink>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/manager/*" element={<ManagerPOS />} />
        <Route path="/cashier/*" element={<CashierPOS />} />
        <Route path="/cashier/add-ons" element={<AddAddOns />} />
        <Route path="/cashier/add-ons/:itemId" element={<AddAddOns />} />
        <Route path="/menu_board" element={<MenuBoard />} />
        <Route path="/customer" element={<CustomerPOS />} />
        <Route path="/login/*" element={<LoginPage />} />
      </Routes>
    </div>
    // <div>
    //   <AppBar position="static">
    //     <Toolbar>
    //       <Tabs aria-label="navigation tabs">
    //         <LinkTab label="Manager" to="/manager" />
    //         <LinkTab label="Cashier" to="/cashier" />
    //         <LinkTab label="Menu Board" to="/menu_board" />
    //         <LinkTab label="Customer" to="/customer" />
    //       </Tabs>
    //     </Toolbar>
    //   </AppBar>

    //   <Routes>
    //     <Route path="/manager/*" element={<ManagerPOS />} />
    //     <Route path="/cashier/*" element={<CashierPOS />} />
    //     <Route path="/cashier/add-ons" element={<AddAddOns />} />
    //     <Route path="/cashier/add-ons/:itemId" element={<AddAddOns />} />
    //     <Route path="/menu_board" element={<MenuBoard />} />
    //     <Route path="/customer" element={<CustomerPOS />} />
    //     <Route path="/checkout" element={<Checkout />} />
    //   </Routes>
    // </div>
  );
}

export default App;