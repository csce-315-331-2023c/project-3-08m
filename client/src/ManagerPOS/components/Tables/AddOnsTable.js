import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Save as SaveIcon, Cancel as CancelIcon, Edit as EditIcon, Delete as DeleteIcon, Translate} from '@mui/icons-material';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import './table.css';
import theme from '../../../theme';
import { ThemeProvider } from '@emotion/react';
import { TranslateBulk, TranslateText } from '../../../Translate';

// const serverURL = 'https://project-3-server-ljp9.onrender.com';
const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

// console.log(process.env.SERVER_URL);
// console.log(serverURL);

/**
 * Handles updating various types of add-on data in the database.
 * Based on the provided type, it formats the data accordingly and sends a request to the server.
 * 
 * @param {string} type - The type of update operation (e.g., 'last_restock_date').
 * @param {Object} updateVals - The values to be updated, structured as an object.
 */

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

function AddToolbar({ setAddOns, setRowModes, inAdd, setInAdd, translationAdd }) {
  var id = '';
  const handleAdd = () => {
    // console.log(addOns);
    if (inAdd) {
      return;
    }
    // if (id !== '') {
    setAddOns((oldRows) => [...oldRows, {id, isNew: true }]);
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
        {translationAdd || 'Create New Add-On'}
      </Button>
      </Box>
    </GridToolbarContainer>
    </ThemeProvider>
  )
}

/**
 * AddOnsTable is a React component that displays a table of add-ons.
 * It fetches add-on data from a server, handles loading and error states, and allows for add-on CRUD operations.
 * This component supports internationalization for headers and text.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.doTL - A boolean that determines if translation should be performed.
 *
 * @returns {ReactElement} A DataGrid element containing the add-ons data.
 *
 * @example
 * <AddOnsTable doTL={true} />
 */

const AddOnsTable = ({doTL}) => {
  const [addOns, setAddOns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ inAdd, setInAdd ] = useState(false);
  const [ translationHeaders, setTranslationHeaders ] = useState([]);
  const [ translationAdd, setTranslationAdd ] = useState('');

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

  useEffect(() => {
    if (doTL) {
      var headers = ['Name', 'Price', 'Inventory ID', 'Actions'];
      TranslateBulk(headers, setTranslationHeaders);
      TranslateText('Create New Add-On', setTranslationAdd);
    }
  }, [doTL])

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
      setInAdd(false);
      setAddOns(addOns.filter((row) => row.id !== id));
    }
  }

  const processRowUpdate = (newRow, event) => {
    // THIS ONE IS THE ONE TO USE FOR UPDATING VALUES (NOT DELETE) TO THE DATABASE
    // newRow holds the updated row
    // event holds the old row
    if (newRow.isNew) {
      setInAdd(false);
      if (newRow.id === '') {
        setAddOns(addOns.filter((row) => (row.id !== '')));
        return newRow;
      }
      else {
        // console.log(newRow);
        if (addOns.filter((row) => (row.id === newRow.id)).length != 0) {
          setAddOns(addOns.filter((row) => (row.id !== '')));
          return newRow;
        }
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
      headerName: translationHeaders[0] || 'Name',
      headerClassName: 'super-app-theme--header',
      flex: 2,
      minWidth: 150,
      editable: true,
    },
    {
      field: 'price',
      headerName: translationHeaders[1] || 'Price',
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
      headerName: translationHeaders[2] || 'Inventory ID',
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
      headerName: translationHeaders[3] || 'Actions',
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
        experimentalFeatures={{ariaV7: true}}
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
          toolbar: { setAddOns, setRowModes, inAdd, setInAdd, translationAdd }
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