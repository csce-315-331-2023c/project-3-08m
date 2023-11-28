import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

var price = 0;
const Order = () => {
  const dispatch = useDispatch();
  const menuItems = useSelector((state) => state.menuItems);
  const addons = useSelector((state) => state.addons);
  const ordersEntered = useSelector((state) => state.ordersEntered);

  price = 0;
    ordersEntered.forEach((item) => {
      price += item.menuItem.price;
      item.addOnList.forEach((addon) => {
        price += addon.price;
      });
  }, 0);

  const checkout = () => {
    //insert code to send order to database
    price = 0;
    ordersEntered.forEach((item) => {
      price += item.menuItem.price;
      item.addOnList.forEach((addon) => {
        price += addon.price;
      });
    }, 0);

    price = price * 1.0825;
    
    const orderIds = ordersEntered.map((item) => item.menuItem.id);
    const addonsIds = ordersEntered.map((item) => item.addOnList.map((addon) => addon.id));

    console.log("addonsIds: ", addonsIds);

    var response = fetch(serverURL+"/updateOrders",{
      // signal: abortController.signal,
      method: "POST",
      headers: {
          "Content-type": "application/json; charset = UTF-8"
      },
      body: JSON.stringify({'add': {'price': price, 'addOns': addonsIds, 'menuItems': orderIds}})
    });

    dispatch({ type: 'CLEAR_ORDER' });
  };

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
        <div className="orderItemName">{item.menuItem.name} ${orderPrice.toFixed(2)}</div>
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
        <div></div>
      )}
      <div className="totals">
        <h2>Subtotal: {price.toFixed(2)}</h2>
        <h2>Tax: {(price * 0.0825).toFixed(2)}</h2>
        <h2>Total: {(price * 1.0825).toFixed(2)}</h2>
      </div>
      <div className='position-relative'>
        <button type="button" class="checkout_button" className="btn btn-success btn-lg" onClick={checkout}>
          Checkout
        </button>
      </div>
      <div className='position-relative'>
        <button type="button" class="clear_button" className="btn btn-danger" onClick={clearOrder}>
          Clear Orders
        </button>
      </div>
    </div>
  );
};

export default Order;

