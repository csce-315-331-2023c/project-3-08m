import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridCellEditStopReasons } from '@mui/x-data-grid';

// const serverURL = 'https://project-3-server-ljp9.onrender.com' || 'http://localhost:9000';
const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';
console.log(serverURL);

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
];

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
  
  const handleEdit = (params, event) => {
    if (params.reason === GridCellEditStopReasons.cellFocusOut) {
      event.defaultMuiPrevented = true;
      return;
    }
    console.log(params);
    console.log(event.target.value);
    // console.log(event);
    const updateMenu = async (type, updateVals) => {
      var success = false;
      try {
        var response = await fetch(serverURL+"/updateMenu", {
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
      updateMenu('name', {'id': params.row.id, 'name': event.target.value});
    }
    else if (params.field == 'price') {
      updateMenu('price', {'id': params.row.id, 'price': event.target.value});
    }
  }

  return (
    <Box sx={{ width: '100%', '& .super-app-theme--header': {
      backgroundColor: '#2E4647', color: 'white', fontWeight: 'bold'},}}>
      <DataGrid
        onCellEditStop={handleEdit}
        rows={menuItems}
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

export default MenuTable;