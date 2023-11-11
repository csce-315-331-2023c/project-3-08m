import React, { useState, useEffect } from 'react';

// const serverURL = 'https://project-3-server-ljp9.onrender.com';
const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

const InventoryTable = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(serverURL+'/inventory');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setInventory(data.inventory);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  if (loading) {
    return <div>Loading inventory...</div>;
  }

  if (error) {
    return <div>Error loading inventory: {error}</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Last Restock Date</th>
          <th>Amount Remaining</th>
          <th>Amount Used</th>
          <th>Minimum Amount</th>
        </tr>
      </thead>
      <tbody>
        {inventory.map(item => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{new Date(item.last_restock_date).toLocaleDateString()}</td>
            <td>{item.amount_remaining}</td>
            <td>{item.amount_used}</td>
            <td>{item.min_amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InventoryTable;
