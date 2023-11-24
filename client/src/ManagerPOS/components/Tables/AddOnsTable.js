import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridCellEditStopReasons } from '@mui/x-data-grid';

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

  const handleEdit = (params, event) => {
    if (params.reason === GridCellEditStopReasons.cellFocusOut) {
      event.defaultMuiPrevented = true;
      return;
    }
    console.log(params);
    console.log(event.target.value);
    const updateAddOn = async (type, updateVals) => {
      var success = false;
      try {
        var response = await fetch(serverURL+'/updateAddOns', {
          method: 'POST',
          headers: {
            "Content-type": "application/json; charset = UTF-8"
          },
          body: JSON.stringify({[type]: updateVals})
        });
        var res = await response.json();
        success = res.updateSuccess;
      }
      catch (error) {
        console.log(error);
      }
      console.log(success);
      return success;
    }
    if (params.field == 'name') {
      updateAddOn('name', {'id': params.row.id, 'name': event.target.value});
    }
    else if (params.field == 'price') {
      updateAddOn('price', {'id': params.row.id, 'price': event.target.value});
    }
    else if (params.field == 'inventory_id') {
      updateAddOn('inventory_id', {'id': params.row.id, 'inventoryId': event.target.value});
    }
  }

  return (
    <Box sx={{ width: '100%', '& .super-app-theme--header': {
      backgroundColor: '#2E4647', color: 'white', fontWeight: 'bold'},}}>
      <DataGrid
        onCellEditStop={handleEdit}
        rows={addOns}
        columns={columns}
        initialState={{
          sorting: {
            sortModel: [{field: 'id', sort: 'asc'}]
          }
        }}
      />
    </Box>
  );
};

export default AddOnsTable;