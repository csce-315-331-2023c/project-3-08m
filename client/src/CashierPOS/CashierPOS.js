import React from 'react';
import './CashierPOS.css';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GenerateMenu from './GenerateMenu';
import Order from './Order';
import AddAddOns from './AddAddOns';

const CashierPOS = () => {
  return (
    <div>
      <div class="cashier-container">
        <div class="left-half">
          <Order />
        </div>
        <div class="right-half">
          <h1 className='text-center'>Menu</h1>
          <GenerateMenu />
        </div>
      </div>
      <Routes>
        <Route path="/add-ons" element={<AddAddOns />} />
        <Route path="/cashier/add-ons/:itemId" element={<AddAddOns />} />
      </Routes>
    </div>
  );
};

export default CashierPOS;
