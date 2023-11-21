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
      <div className='d-flex bd-highlight'>
        <div className='p-2 flex-fill bd-highlight'>
          <Order />
        </div>
        <div className='p-2 flex-fill bd-highlight'>
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
