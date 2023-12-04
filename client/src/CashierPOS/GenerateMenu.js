import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchMenuItems, fetchAddOns } from './actions';
import { TranslateBulk } from '../Translate';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

const GenerateMenu = ({menuItems, addOns}) => {
  // const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(menuItems == []);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchMenuItems(menuItems || []));
    dispatch(fetchAddOns(addOns || []));
  }, [menuItems, addOns, dispatch])
  const navigate = useNavigate();

  const navigateToAddOns = (item) => {
    navigate(`/cashier/add-ons/${item.id}`);
  };

  const handleMenuItemClick = (item) => {
    // Optionally, navigate to the AddOns page
    navigateToAddOns(item);
  };

  if (loading) {
    return <p>Loading menu items...</p>;
  }

  if (error) {
    return <p>Error loading menu items: {error}</p>;
  }

  return (
    <div>
      <div>
        <ul>
          {menuItems.map((item) => (
            <button
              class="menu_button"
              type="button"
              key={item.id}
              onClick={() => handleMenuItemClick(item)}
            >
              {item.name}
            </button>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GenerateMenu;
