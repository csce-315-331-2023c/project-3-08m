import React, {useEffect, useState} from 'react';

const GenerateMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:9000/menu')
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
              console.log(item.id),
              <li>{item.id} {item.name} {item.price}</li>
            ))}
          </ul>
        </div>
    </div>
  );
};

export default GenerateMenu;