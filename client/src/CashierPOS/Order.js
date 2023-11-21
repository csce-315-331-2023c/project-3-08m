import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Order = () => {
  const dispatch = useDispatch();
  const menuItems = useSelector((state) => state.menuItems);
  const addons = useSelector((state) => state.addons);

  const clearOrder = () => {
    dispatch({ type: 'CLEAR_MENU_ITEMS' });
    dispatch({ type: 'CLEAR_ADDONS' });
  };

  // Render each order
  const orderElements = menuItems.map((item) => {
    const itemAddons = addons[item.id] || [];
    return (
      <div key={item.id} className="orderItem">
        <div className="orderItemName">{item.name}</div>
        <div className="orderItemPrice">${item.price.toFixed(2)}</div>
        <div className="orderItemAddons">
          {itemAddons.map((addon) => (
            <div key={addon.id} className="orderItemAddon">
              {addon.name}
            </div>
          ))}
        </div>
      </div>
    );
  });

  return (
    <div className="Order">
      <h1 className='text-center'>Orders</h1>
      {orderElements.length > 0 ? (
        <div className="orderText overflow-auto">
          {orderElements}
        </div>
      ) : (
        <p>No orders yet.</p>
      )}
      <div className="totals">
        {/* Display total, tax, etc. as needed */}
      </div>
      <div className='position-relative'>
        <button type="button" className="btn btn-success btn-lg" onClick={clearOrder}>
          Clear Orders
        </button>
      </div>
    </div>
  );
};

export default Order;

