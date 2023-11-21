import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Order = () => {
  const dispatch = useDispatch();
  const menuItems = useSelector((state) => state.menuItems);
  const addons = useSelector((state) => state.addons);
  const ordersEntered = useSelector((state) => state.ordersEntered);

  const clearOrder = () => {
    dispatch({ type: 'CLEAR_ORDER' });
  };

  // Render each order
  const orderElements = ordersEntered.map((item) => {
    console.log(item);

    const itemAddons = item.addOnList || [];
    const orderPrice = item.menuItem.price + itemAddons.reduce((acc, addon) => acc + addon.price, 0);
    console.log("itemAddons: ", itemAddons);
    return (
      <div key={item.menuItem.name} className="orderItem">
        <div className="orderItemName">{item.menuItem.name}</div>
        <div className="orderItemPrice">${orderPrice.toFixed(2)}</div>
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

