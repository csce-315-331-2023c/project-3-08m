import React, { useEffect, useState } from 'react';

const serverURL = process.env.SERVER_URL || 'http://localhost:9000';

console.log(process.env.SERVER_URL);
console.log(serverURL);

const AddOnsTable = () => {
  const [addOns, setAddOns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(serverURL+'/addOns')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setAddOns(data.addOns); // Make sure this matches the key in your JSON response
        setLoading(false);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading add-ons...</p>;
  }

  if (error) {
    return <p>Error loading add-ons: {error}</p>;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Inventory ID</th>
          </tr>
        </thead>
        <tbody>
          {addOns.map((addOn) => (
            <tr key={addOn.id}>
              <td>{addOn.id}</td>
              <td>{addOn.name}</td>
              <td>${addOn.price.toFixed(2)}</td>
              <td>{addOn.inventory_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddOnsTable;
