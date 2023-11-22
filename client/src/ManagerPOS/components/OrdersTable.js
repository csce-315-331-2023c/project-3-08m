import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

// const serverURL = 'https://project-3-server-ljp9.onrender.com' || 'http://localhost:9000';
const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';
console.log(serverURL);

//based on this format
/*{
  field: 'username',
  headerName: 'Username',
  headerClassName: 'super-app-theme--header',
  flex: 2,
  minWidth: 150,
  editable: true,
},
*/
// create a const column object that has ID, Price, Menu Item IDs, and Add On IDs

const columns = [
  { field: 'id', headerName: 'ID', headerClassName: 'super-app-theme--header', flex: 1, minWidth: 50,},
  {
    field: 'price',
    headerName: 'Price',
    headerClassName: 'super-app-theme--header',
    flex: 1,
    minWidth: 50,
    editable: true,
  },
  {
    field: 'date_time',
    headerName: 'Date Time',
    headerClassName: 'super-app-theme--header',
    flex: 1,
    minWidth: 50,
    editable: true,
  }
];


const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(serverURL+'/orders')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        data.orders.forEach((order) => {
          order.date_time = formatDate(order.date_time);
        });
        setOrders(data.orders);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch menu items:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <p>Loading menu items...</p>;
  }

  if (error) {
    return <p>Error loading menu items: {error}</p>;
  }

  return (
    <Box sx={{ width: '100%', '& .super-app-theme--header': {
      backgroundColor: '#2E4647', color: 'white', fontWeight: 'bold'},}}>
      <DataGrid
        rows={orders}
        columns={columns}
      />
    </Box>
  );
};

export default OrdersTable;