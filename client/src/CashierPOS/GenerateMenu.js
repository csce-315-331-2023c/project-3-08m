import React, {useEffect, useState} from 'react';

const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

const GenerateMenu = () => {
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
    <div>
        <div>
          <h1>Menu</h1>
          <ul>
            {menuItems.map((item) => (
              <button type="button" class="btn btn-primary">{item.name} {item.price}</button>
            ))}
          </ul>
        </div>
    </div>
  );
};

export default GenerateMenu;