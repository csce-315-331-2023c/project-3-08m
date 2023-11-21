import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchMenuItems, fetchAddOns } from './actions';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

const GenerateMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const navigate = useNavigate();

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
    const fetchAddOnsFromApi = async () => {
      try {
        const response = await fetch(`${serverURL}/addOns`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        dispatch(fetchAddOns(data.addOns || []));
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchAddOnsFromApi();
  }, [dispatch]);

  useEffect(() => {
    fetch(serverURL + '/menu')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMenuItems(data.menu);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch menu items:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

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
              type="button"
              className="btn btn-primary"
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
