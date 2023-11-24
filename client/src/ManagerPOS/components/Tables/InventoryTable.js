import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridCellEditStopReasons } from '@mui/x-data-grid';

// const serverURL = 'https://project-3-server-ljp9.onrender.com';
const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

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
    field: 'last_restock_date',
    headerName: 'Last Restock Date',
    headerClassName: 'super-app-theme--header',
    flex: 2,
    minWidth: 150,
    editable: false,
  },
  {
    field: 'amount_remaining',
    headerName: 'Amount Remaining',
    headerClassName: 'super-app-theme--header',
    flex: 1,
    minWidth: 50,
    editable: true,
  },
  {
    field: 'amount_used',
    headerName: 'Amount Used',
    headerClassName: 'super-app-theme--header',
    flex: 1,
    minWidth: 50,
    editable: true,
  },
  {
    field: 'min_amount',
    headerName: 'Minimum Amount',
    headerClassName: 'super-app-theme--header',
    flex: 1,
    minWidth: 50,
    editable: true,
  },
];

const InventoryTable = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDateTime = (dateTime) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric'};
    return new Date(dateTime).toLocaleDateString(undefined, options);
  }

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(serverURL+'/inventory');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        for (let i = 0; i < data.inventory.length; i++) {
          data.inventory[i].last_restock_date = formatDateTime(data.inventory[i].last_restock_date);
        }
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

  const handleEdit = (params, event) => {
    if (params.reason === GridCellEditStopReasons.cellFocusOut) {
      event.defaultMuiPrevented = true;
      return;
    }
    console.log(params);
    console.log(event.target.value);
    const updateInventory = async (type, updateVals) => {
      var success = false;
      try {
        var response = await fetch(serverURL+"/updateInventory", {
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
      updateInventory('name', {'id': params.row.id, 'name': event.target.value});
    }
    else if (params.field == 'amount_remaining') {
      updateInventory('amount_remaining', {'id': params.row.id, 'amountRemaining': event.target.value});
    }
    else if (params.field == 'amount_used') {
      updateInventory('amount_remaining', {'id': params.row.id, 'amountUsed': event.target.value});
    }
    else if (params.field == 'min_amount') {
      updateInventory('minimum_amount', {'id': params.row.id, 'minimumAmount': event.target.value});
    }
  }

  return (
    <Box sx={{ width: '100%', '& .super-app-theme--header': {
      backgroundColor: '#2E4647', color: 'white', fontWeight: 'bold'},}}>
      <DataGrid
        onCellEditStop={handleEdit}
        rows={inventory}
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

export default InventoryTable;