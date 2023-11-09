import React, {useEffect, useState} from 'react';

const serverURL = 'https://project-3-server-ljp9.onrender.com';

const GenerateMenuBoard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://project-3-server-ljp9.onrender.com/menu')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setMenuItems(data.menu); // Make sure this matches the key in your JSON response
        setLoading(false);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);
  return (
    <div>
        <div>
          <h1>Menu</h1>
          <ul>
            {menuItems.map((item) => (
              <li>{item.name} {item.price}</li>
            ))}
          </ul>
        </div>
    </div>
  );
};

export default GenerateMenuBoard;