import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Save as SaveIcon, Cancel as CancelIcon, Edit as EditIcon, Delete as DeleteIcon} from '@mui/icons-material';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import theme from '../../../theme';
import { ThemeProvider } from '@emotion/react';

// const serverURL = 'https://project-3-server-ljp9.onrender.com';
const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

const handleUpdate = (type, updateVals) => {
  console.log(type);
  if (type === 'last_restock_date') {
    updateVals.lastRestockDate = new Date(updateVals.lastRestockDate).toISOString().split('T')[0];
    // var date = new Date(updateVals.start_date).toISOString().split('T')[0];
    console.log(updateVals.lastRestockDate);
  }
  const updateInventory = async (type, updateVals) => {
    var success = false;
    try {
      var response = await fetch(serverURL+"/updateInventory", {
        method: "POST",
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
  updateInventory(type, updateVals);
}

function AddToolbar(props) {
  const { setInventory, setRowModes, inAdd, setInAdd } = props;
  var id = '';
  const handleAdd = () => {
    if (inAdd) {
      return;
    }
    // if (id !== '') {
    setInventory((oldRows) => [...oldRows, {id, isNew: true }]);
    // }
    setRowModes((oldModes) => ({...oldModes, [id]: { mode: GridRowModes.Edit, fieldToFocus: 'id'}}));
    setInAdd(true);
  }
  return (
    <ThemeProvider theme={theme}>
    <GridToolbarContainer>
      {/* <div style={{flex: '1 1 0%'}} /> */}
      <Box sx={{display: 'flex', alignItems: 'right', marginBottom: .5 }}>
      <Button color='primary' startIcon={<Box sx={{mb:.5}}><div>+</div></Box>} onClick={handleAdd}>
        Create New Inventory Item
      </Button>
      </Box>
    </GridToolbarContainer>
    </ThemeProvider>
  )
}

const InventoryTable = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ inAdd, setInAdd ] = useState(false);

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
          // data.inventory[i].last_restock_date = formatDateTime(data.inventory[i].last_restock_date);
          data.inventory[i].last_restock_date = new Date(data.inventory[i].last_restock_date);
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

  const [ rowModes, setRowModes ] = useState({});

  const preventOutOfFocus = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  }

  const handleEdit = (id) => () => {
    setRowModes({...rowModes, [id]: {mode: GridRowModes.Edit}});
  }

  const handleSave = (id) => () => {
    setRowModes({...rowModes, [id]: {mode: GridRowModes.View}});
  }

  const handleDelete = (id) => () => {
    // THIS ONE IS THE ONE TO USE FOR DELETING
    console.log("dleete");
    console.log(id);
    // console.log(employees[id]);
    // console.log(employees)
    handleUpdate('delete', {'id': id});
    setInventory(inventory.filter((item) => item.id !== id));
  }

  const handleCancel = (id) => () => {
    // console.log('asdf');
    setRowModes({...rowModes, [id]: {mode: GridRowModes.View, ignoreModifications: true}});
    const editedRow = inventory.find((row) => row.id === id);
    if (editedRow.isNew) {
      setInAdd(false);
      setInventory(inventory.filter((row) => row.id !== id));
    }
  }

  const processRowUpdate = (newRow, event) => {
    // THIS ONE IS THE ONE TO USE FOR UPDATING VALUES (NOT DELETE) TO THE DATABASE
    // newRow holds the updated row
    // event holds the old row
    if (newRow.isNew) {
      setInAdd(false)
      if (newRow.id === '') {
        setInventory(inventory.filter((row) => (row.id !== '')));
        return newRow;
      }
      else {
        if (inventory.filter((row) => (row.id === newRow.id)).length != 0) {
          setInventory(inventory.filter((row) => (row.id !== '')));
          return newRow;
        }
        // console.log(newRow);
        const updatedRow = { ...newRow, isNew: false};
        setInventory(inventory.map((row) => (row.id === '' ? updatedRow : row)));
        handleUpdate('add', {'id': newRow.id, 'name': newRow.name, 'lastRestockDate': newRow.last_restock_date, 'amountUsed': newRow.amount_used, 'amountRemaining': newRow.amount_remaining, 'minimumAmount': newRow.min_amount});
        return updatedRow;
      }
    }
    else if (newRow.id === '' && !newRow.isNew) {
      return newRow;
    }
    var changedValues = [];
    for (const key in newRow) {
      if (event[key] !== newRow[key]) {
        changedValues.push(key);
      }
    }
    // console.log(changedValues);
    for (const item of changedValues) {
      if (item === 'min_amount') {
        handleUpdate('minimum_amount', {'id': newRow.id, 'minimumAmount': newRow.min_amount});
      }
      else if (item === 'amount_used') {
        handleUpdate(item, {'id': newRow.id, 'amountUsed': newRow.amount_used});
      }
      else if (item === 'amount_remaining') {
        handleUpdate(item, {'id': newRow.id, 'amountRemaining': newRow.amount_remaining});
      }
      else if (item === 'last_restock_date') {
        handleUpdate(item, {'id': newRow.id, 'lastRestockDate': newRow.last_restock_date});
      }
      else {
        handleUpdate(item, {'id': newRow.id, [item]: newRow[item]});
      }
    }
    const updatedRow = { ...newRow, isNew: false };
    setInventory(inventory.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const columns = [
    { field: 'id', headerName: 'ID', headerClassName: 'super-app-theme--header', flex: 1, minWidth: 50, editable: true, type: 'number', align: 'left', headerAlign: 'left'},
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
      type: 'date',
      flex: 2,
      minWidth: 150,
      editable: true,
    },
    {
      field: 'amount_remaining',
      headerName: 'Amount Remaining',
      headerClassName: 'super-app-theme--header',
      flex: 1,
      type: 'number',
      minWidth: 50,
      editable: true,
      align: 'left', 
      headerAlign: 'left'
    },
    {
      field: 'amount_used',
      headerName: 'Amount Used',
      headerClassName: 'super-app-theme--header',
      type: 'number',
      flex: 1,
      minWidth: 50,
      editable: true,
      align: 'left', 
      headerAlign: 'left'
    },
    {
      field: 'min_amount',
      headerName: 'Minimum Amount',
      headerClassName: 'super-app-theme--header',
      flex: 1,
      type: 'number',
      minWidth: 50,
      editable: true,
      align: 'left', 
      headerAlign: 'left'
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      headerClassName: 'super-app-theme--header',
      minWidth: 100,
      cellClassName: 'actions',
      getActions: ({id}) => {
        const inEdit = rowModes[id]?.mode === GridRowModes.Edit;
  
        if (inEdit) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon style={{ color: 'green' }}/>}
              label='Save'
              onClick={handleSave(id)}
            />,
            <GridActionsCellItem 
              icon={<CancelIcon style={{ color: 'red' }} />}
              label='Cancel'
              onClick={handleCancel(id)}
            />,
          ];
        }
  
        return [
          <GridActionsCellItem 
            icon={<EditIcon />} // Using the Edit icon
            label='Edit'
            onClick={handleEdit(id)}
          />,
          <GridActionsCellItem 
            icon={<DeleteIcon style={{ color: 'red' }} />} // Using the Delete icon
            label='Delete'
            onClick={handleDelete(id)}
          />,
        ]
      }
    },
  ];

  const handleRowModesModelChange = (newRowModes) => {
    setRowModes(newRowModes);
  }


  if (loading) {
    return <div>Loading inventory...</div>;
  }

  if (error) {
    return <div>Error loading inventory: {error}</div>;
  }

  return (
    <Box sx={{ width: '100%', '& .super-app-theme--header': {
      backgroundColor: '#2E4647', color: 'white', fontWeight: 'bold'},}}>
      <DataGrid
        // onCellEditStop={handleEdit}
        editMode='row'
        rowModesModel={rowModes}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={preventOutOfFocus}
        onRowEditStart={preventOutOfFocus}
        processRowUpdate={processRowUpdate}
        rows={inventory}
        columns={columns}
        slots={{
          toolbar: AddToolbar,
        }}
        slotProps={{
          toolbar: { setInventory, setRowModes, inAdd, setInAdd }
        }}
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