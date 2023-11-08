// MenuTable.js
import React, { useEffect, useState } from 'react';

const serverURL = 'https://project-3-server-ljp9.onrender.com';

const MenuTable = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(serverURL+'/menu')
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
        console.error("Failed to fetch menu items:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading menu items...</p>;
  }

  if (error) {
    return <p>Error loading menu items: {error}</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {menuItems.map(item => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>${item.price.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MenuTable;