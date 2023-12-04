import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToOrder } from './actions';
import './AddOns.css';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

const AddAddOns = () => {
  const { itemId } = useParams();
  const dispatch = useDispatch();
  const menuItems = useSelector((state) => state.menuItems);
  const orderItems = useSelector((state) => state.orders);
  const addons = useSelector((state) => state.addons);

  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [menuItem, setMenuItem] = useState();
  const navigate = useNavigate();

  const handleAddOnSelect = (addOn) => {
    setSelectedAddOns((prevAddOns) =>
      prevAddOns.includes(addOn)
        ? prevAddOns.filter((selected) => selected !== addOn)
        : [...prevAddOns, addOn]
    );
  };

  useEffect(() => {
    console.log('MenuItem changed:', menuItem);
    console.log('Selected addons changed:', selectedAddOns);
    console.log('Order items changed:', orderItems);
    console.log('Addons changed:', addons);
    console.log('Menu items changed:', menuItems);
  }, [menuItem]);

  useEffect(() => {
    // console.log(itemId);
    // console.log(menuItems);
    const selectedMenuItem = menuItems.find((item) => item.id.toString() === itemId);
    if (selectedMenuItem) {
      setMenuItem(selectedMenuItem);
    }
  }, [itemId, menuItems]);

  const handleSave = () => {
    dispatch(addItemToOrder(menuItem, selectedAddOns));
    navigate('/cashier');
  };

  return (
    <div class="addOnPage">
      <h1>Add Ons for {menuItem ? menuItem.name : 'Loading...'}</h1>
      <ul class="addOnList">
        {addons.map((addOn) => (
          <li key={addOn}>
            <label>
              <input
                type="checkbox"
                checked={selectedAddOns.includes(addOn)}
                onChange={() => handleAddOnSelect(addOn)}
              />
              {addOn.name}
            </label>
          </li>
        ))}
      </ul>
      <button type="button" onClick={handleSave}>
        Save Order
      </button>
    </div>
  );
};

export default AddAddOns;