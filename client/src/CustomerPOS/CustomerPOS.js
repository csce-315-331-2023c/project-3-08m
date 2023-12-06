import React from 'react';
import Menu from './Menu';
import { LanguageDialog } from '../Translate';
import { NavLink, Route, Routes } from 'react-router-dom';

/**
 * The CustomerPOS class used by the /customer Route
 * @returns html for the CustomerPOS class (the menu)
 */
const CustomerPOS = () => {
  return (
    <div>
      <Menu />
    </div>
  );
};

export default CustomerPOS;