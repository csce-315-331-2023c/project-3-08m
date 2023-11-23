import React from 'react';
import Menu from './Menu';
import { LanguageDialog } from '../Translate';
import { NavLink, Route, Routes } from 'react-router-dom';
import { Checkout } from './Checkout';

const CustomerPOS = () => {
  return (
    <div>
      <h2>
        Menu
        <LanguageDialog />
        <nav>
          <NavLink to="/checkout" className={({ isActive }) => isActive ? 'active' : ''}>Checkout</NavLink>
        </nav>
      </h2>
      <Menu />
    </div>
  );
};

export default CustomerPOS;