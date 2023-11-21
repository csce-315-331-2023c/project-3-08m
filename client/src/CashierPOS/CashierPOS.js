import React from 'react';
import './CashierPOS.css';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GenerateMenu from './GenerateMenu';
import Order from './Order';
import AddAddOns from './AddAddOns';

const CashierPOS = () => {
  const dispatch = useDispatch();
  const orderItems = useSelector((state) => state.orders); // Assuming you have 'orders' in your Redux state

  const addItemToOrder = (menuItem) => {
    dispatch({ type: 'ADD_ITEM_TO_ORDER', payload: menuItem });
  };

  return (
    <div>
      <div className='d-flex bd-highlight'>
        <div className='p-2 flex-fill bd-highlight'>
          <Order orderItems={orderItems} />
        </div>
        <div className='p-2 flex-fill bd-highlight'>
          {/* Pass addItemToOrder to GenerateMenu */}
          <GenerateMenu addItemToOrder={addItemToOrder} />
        </div>
      </div>
      <Routes>
        <Route path="/add-ons" element={<AddAddOns addItemToOrder={addItemToOrder} />} />
        <Route path="/cashier/add-ons/:itemId" element={<AddAddOns addItemToOrder={addItemToOrder} />} />
      </Routes>
    </div>
  );
};

export default CashierPOS;
