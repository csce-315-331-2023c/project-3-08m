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

// const serverURL = 'https://project-3-server-ljp9.onrender.com';
const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

// console.log(process.env.SERVER_URL);
// console.log(serverURL);

const handleUpdate = (type, updateVals) => {
  console.log(type);
  if (type === 'last_restock_date') {
    updateVals.lastRestockDate = new Date(updateVals.lastRestockDate).toISOString().split('T')[0];
    // var date = new Date(updateVals.start_date).toISOString().split('T')[0];
    console.log(updateVals.lastRestockDate);
  }
  const updateAddOns = async (type, updateVals) => {
    var success = false;
    try {
      var response = await fetch(serverURL+"/updateAddOns", {
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
  updateAddOns(type, updateVals);
}

function AddToolbar(props) {
  const { setAddOns, setRowModes } = props;
  var id = '';
  const handleAdd = () => {
    // if (id !== '') {
    setAddOns((oldRows) => [...oldRows, {id, isNew: true }]);
    // }
    setRowModes((oldModes) => ({...oldModes, [id]: { mode: GridRowModes.Edit, fieldToFocus: 'id'}}));
  }
  return (
    <GridToolbarContainer>
      {/* <div style={{flex: '1 1 0%'}} /> */}
      <Button color='primary' startIcon= {<div>+</div>} onClick={handleAdd}>
        Create New Add-On
      </Button>
    </GridToolbarContainer>
  )
}

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

  const preventOutOfFocus = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  }

  const [ rowModes, setRowModes ] = useState({});

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
    setAddOns(addOns.filter((item) => item.id !== id));
  }

  const handleCancel = (id) => () => {
    // console.log('asdf');
    setRowModes({...rowModes, [id]: {mode: GridRowModes.View, ignoreModifications: true}});
    const editedRow = addOns.find((row) => row.id === id);
    if (editedRow.isNew) {
      setAddOns(addOns.filter((row) => row.id !== id));
    }
  }

  const processRowUpdate = (newRow, event) => {
    // THIS ONE IS THE ONE TO USE FOR UPDATING VALUES (NOT DELETE) TO THE DATABASE
    // newRow holds the updated row
    // event holds the old row
    if (newRow.isNew) {
      if (newRow.id === '') {
        setAddOns(addOns.filter((row) => (row.id !== '')));
        return newRow;
      }
      else {
        console.log(newRow);
        const updatedRow = { ...newRow, isNew: false};
        setAddOns(addOns.map((row) => (row.id === '' ? updatedRow : row)));
        handleUpdate('add', {'id': newRow.id, 'name': newRow.name, 'price': newRow.price, 'inventoryId': newRow.inventory_id});
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
      if (item === 'inventory_id') {
        handleUpdate(item, {'id': newRow.id, 'inventoryId': newRow.inventory_id});
      }
      else {
        handleUpdate(item, {'id': newRow.id, [item]: newRow[item]});
      }
    }
    const updatedRow = { ...newRow, isNew: false };
    setAddOns(addOns.map((row) => (row.id === newRow.id ? updatedRow : row)));
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
      field: 'price',
      headerName: 'Price',
      headerClassName: 'super-app-theme--header',
      type: 'number',
      flex: 1,
      minWidth: 50,
      editable: true,
      align: 'left', 
      headerAlign: 'left'
    },
    {
      field: 'inventory_id',
      headerName: 'Inventory ID',
      headerClassName: 'super-app-theme--header',
      type: 'number',
      flex: 1,
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
    return <p>Loading add-ons...</p>;
  }

  if (error) {
    return <p>Error loading add-ons: {error}</p>;
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
        rows={addOns}
        columns={columns}
        slots={{
          toolbar: AddToolbar,
        }}
        slotProps={{
          toolbar: { setAddOns, setRowModes }
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

export default AddOnsTable;