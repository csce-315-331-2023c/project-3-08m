import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

// const serverURL = 'https://project-3-server-ljp9.onrender.com';
const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

// console.log(process.env.SERVER_URL);
// console.log(serverURL);

const columns = [
  { field: 'id', headerName: 'ID', headerClassName: 'super-app-theme--header', flex: 1, minWidth: 50,},
  {
    field: 'name',
    headerName: 'Name',
    headerClassName: 'super-app-theme--header',
    flex: 2,
    minWidth: 150,
    editable: true,
  },
  {
    field: 'price',
    headerName: 'Price',
    headerClassName: 'super-app-theme--header',
    flex: 1,
    minWidth: 50,
    editable: true,
  },
  {
    field: 'inventory_id',
    headerName: 'Inventory ID',
    headerClassName: 'super-app-theme--header',
    flex: 1,
    minWidth: 50,
    editable: true,
  },
];
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
    <Box sx={{ width: '100%', '& .super-app-theme--header': {
      backgroundColor: '#2E4647', color: 'white', fontWeight: 'bold'},}}>
      <DataGrid
        rows={addOns}
        columns={columns}
      />
    </Box>
  );
};

export default AddOnsTable;
