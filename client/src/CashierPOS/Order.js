import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TranslateBulk } from '../Translate';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

var price = 0;

/**
 * Generates the order text, totals, and checkout/clear buttons for the cashier POS
 * @param {*} menuItems
 * @param {*} addons
 * @param {*} doTL 
 * @returns {JSX.Element} for order text, totals, and checkout/clear buttons
 */
const Order = ({menuItems, addons, doTL}) => {
  const dispatch = useDispatch();
  // const menuItems = useSelector((state) => state.menuItems);
  // const addons = useSelector((state) => state.addons);
  const ordersEntered = useSelector((state) => state.ordersEntered);
  const [ translationButtons, setTranslationButtons ] = useState([]);
  const [ translationText, setTranslationText ] = useState([]);

  useEffect(() => {
    if (doTL) {
      var buttons = ['Checkout', 'Clear Orders'];
      TranslateBulk(buttons, setTranslationButtons);
      var text = ['Orders', 'Subtotal', 'Tax', 'Total'];
      TranslateBulk(text, setTranslationText);
    }
  }, [doTL])

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
      body: JSON.stringify({'add': {'price': price.toFixed(2), 'addOns': addonsIds, 'menuItems': orderIds}})
    });

    dispatch({ type: 'CLEAR_ORDER' });
  };

  const clearOrder = () => {
    dispatch({ type: 'CLEAR_ORDER' });
  };

  // Render each order
  const orderElements = ordersEntered.map((item) => {
    // console.log(item);
    // console.log(menuItems);
    let menuItem = menuItems.filter((menu) => menu.id === item.menuItem.id)[0];
    // console.log(menuItem);

    const itemAddons = item.addOnList || [];
    // console.log(itemAddons);
    let addOns = addons.filter((addOn) => {
      for (let i = 0; i < itemAddons.length; ++i) {
        if (itemAddons[i].id === addOn.id) {
          return true;
        }
      }
      return false;
    })
    // console.log(addOns);
    const orderPrice = item.menuItem.price + itemAddons.reduce((acc, addon) => acc + addon.price, 0);
    // console.log("itemAddons: ", itemAddons);
    return (
      <div key={item.menuItem.name} className="orderItem">
        <div className="orderItemName">{menuItem.name} ${orderPrice.toFixed(2)}</div>
        <div className="orderItemAddons">
          {addOns.map((addon) => (
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
      <h1 className='text-center'>{translationText[0] || 'Orders'}</h1>
      {orderElements.length > 0 ? (
        <div className="orderText overflow-auto">
          {orderElements}
        </div>
      ) : (
        <div></div>
      )}
      <div className="totals">
        <h2>{translationText[1] || 'Subtotal'}: {`$${price.toFixed(2)}`}</h2>
        <h2>{translationText[2] || 'Tax'}: {`$${(price * 0.0825).toFixed(2)}`}</h2>
        <h2>{translationText[3] || 'Total'}: {`$${(price * 1.0825).toFixed(2)}`}</h2>
      </div>
      <div class="checkout_clear_buttons">
        <div className='position-relative'>
          <button type="button" class="checkout_button" className="btn btn-success btn-lg" onClick={checkout}>
            {translationButtons[0] || 'Checkout'}
          </button>
        </div>
        <br></br>
        <div className='position-relative'>
          <button type="button" class="clear_button" className="btn btn-danger" onClick={clearOrder}>
            {translationButtons[1] || 'Clear Orders'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;

