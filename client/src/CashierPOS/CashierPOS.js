import React from 'react';
import './CashierPOS.css';
import { NavLink, Routes, Route } from 'react-router-dom';
import GenerateMenu from './GenerateMenu';
import Order from './Order';

import AddAddOns from './AddAddOns';

const CashierPOS = () => {
  return (
    <div>
      <div class='d-flex bd-highlight'>
        <div class='p-2 flex-fill bd-highlight'>
          <Order />
        </div>
        <div class='p-2 flex-fill bd-hightlight'>
          <GenerateMenu />
        </div>
      </div>

      <Routes>
        <Route path="/AddAddOns" element={<AddAddOns />} />
      </Routes>
    </div>
  );
};

export default CashierPOS;