import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenuItems, updateAddons } from './actions';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

const AddAddOns = () => {
  const { itemId } = useParams();
  const dispatch = useDispatch();
  const menuItems = useSelector((state) => state.menuItems);
  const orderItems = useSelector((state) => state.orders);
  const addons = useSelector((state) => state.addons);

  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [menuItem, setMenuItem] = useState(null);
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
  }, [menuItem]);

  useEffect(() => {
    const fetchMenuItemsFromApi = async () => {
      try {
        const response = await fetch(`${serverURL}/menu`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        dispatch(fetchMenuItems(data.menu || []));
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItemsFromApi();
  }, [dispatch]);

  useEffect(() => {
    const selectedMenuItem = menuItems.find((item) => item.id.toString() === itemId);
    if (selectedMenuItem) {
      setMenuItem(selectedMenuItem);
    }
  }, [itemId, menuItems]);

  const handleSave = () => {
    dispatch(updateAddons(itemId, selectedAddOns));
    navigate('/cashier');
  };

  return (
    <div>
      <h1>Add Ons for {menuItem ? menuItem.name : 'Loading...'}</h1>
      <ul>
        {selectedAddOns.map((addOn) => (
          <li key={addOn}>
            <label>
              <input
                type="checkbox"
                checked={selectedAddOns.includes(addOn)}
                onChange={() => handleAddOnSelect(addOn)}
              />
              {addOn}
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