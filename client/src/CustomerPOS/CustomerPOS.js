import React from 'react';
import Menu from './Menu';
import { LanguageDialog } from '../Translate';
import { NavLink, Route, Routes } from 'react-router-dom';

const CustomerPOS = () => {
  return (
    <div>
      <h2>
        Menu
        <LanguageDialog />
      </h2>
      <Menu />
    </div>
  );
};

export default CustomerPOS;