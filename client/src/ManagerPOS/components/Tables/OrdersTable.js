import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import theme from '../../../theme';
import { ThemeProvider } from '@emotion/react';
import { TranslateBulk } from '../../../Translate';

// const serverURL = 'https://project-3-server-ljp9.onrender.com' || 'http://localhost:9000';
const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';
console.log(serverURL);

const OrdersTable = ({doTL}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ translationHeaders, setTranslationHeaders ] = useState([]);

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
        console.error("Failed to fetch orders:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (doTL) {
      var headers = ['ID', 'Order Total', 'Date and Time'];
      TranslateBulk(headers, setTranslationHeaders);
    }
  }, [doTL])

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const columns = [
    { field: 'id', headerName: translationHeaders[0] || 'ID', headerClassName: 'super-app-theme--header', flex: 1, minWidth: 50, type: 'number', align: 'left', headerAlign: 'left', editable: false },
    {
      field: 'price',
      headerName: translationHeaders[1] || 'Order Total',
      headerClassName: 'super-app-theme--header',
      flex: 1,
      minWidth: 50,
      editable: false,
    },
    {
      field: 'date_time',
      headerName: translationHeaders[2] || 'Date and Time',
      headerClassName: 'super-app-theme--header',
      flex: 1,
      minWidth: 50,
      editable: false,
    }
  ];

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>Error loading orders: {error}</p>;
  }

  return (
    <Box sx={{ width: '100%', '& .super-app-theme--header': {
      backgroundColor: '#2E4647', color: 'white', fontWeight: 'bold'},}}>
      <DataGrid
        rows={orders}
        columns={columns}
        initialState={{
          sorting: {
            sortModel: [{field: 'id', sort: 'desc'}]
          }
        }}
      />
    </Box>
  );
};

export default OrdersTable;