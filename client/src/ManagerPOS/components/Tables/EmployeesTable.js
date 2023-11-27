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
  if (type === 'start_date') {
    updateVals.startDate = new Date(updateVals.start_date).toISOString().split('T')[0];
    // var date = new Date(updateVals.start_date).toISOString().split('T')[0];
    console.log(updateVals.startDate);
  }
  const updateEmployee = async (type, updateVals) => {
    var success = false;
    try {
      var response = await fetch(serverURL+"/updateEmployees", {
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
  updateEmployee(type, updateVals);
}

function AddToolbar(props) {
  const { setEmployees, setRowModes, inAdd, setInAdd } = props;
  var id = '';
  const handleAdd = () => {
    if (inAdd) {
      // console.log("hi");
      return;
    }
    // if (id !== '') {
    setEmployees((oldRows) => [...oldRows, {id, isNew: true }]);
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
        Create New Employee
      </Button>
      </Box>
    </GridToolbarContainer>
    </ThemeProvider>
  )
}

const EmployeesTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ inAdd, setInAdd ] = useState(false);

  // Fetch employees from server
  useEffect(() => {
    fetch(serverURL + '/employees')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        data.employees.forEach((employee) => {
          // employee.start_date = formatDate(employee.start_date);
          employee.start_date = new Date(employee.start_date);
        });
        setEmployees(data.employees);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    // console.log(dateString);
    var date = new Date(dateString).toLocaleDateString(undefined, options);
    console.log(date);
    return date;
  };

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
    setEmployees(employees.filter((employee) => employee.id !== id));
  }

  const handleCancel = (id) => () => {
    // console.log('asdf');
    setRowModes({...rowModes, [id]: {mode: GridRowModes.View, ignoreModifications: true}});
    const editedRow = employees.find((row) => row.id === id);
    if (editedRow.isNew) {
      setInAdd(false);
      setEmployees(employees.filter((row) => row.id !== id));
    }
  }

  const processRowUpdate = (newRow, event) => {
    // THIS ONE IS THE ONE TO USE FOR UPDATING VALUES (NOT DELETE) TO THE DATABASE
    // newRow holds the updated row
    // event holds the old row
    if (newRow.isNew) {
      setInAdd(false);
      if (newRow.id === '') {
        setEmployees(employees.filter((row) => (row.id !== '')));
        return newRow;
      }
      else {
        // console.log(newRow);
        console.log(employees.filter((row) => (row.id === newRow.id)))
        if (employees.filter((row) => (row.id === newRow.id)).length != 0) {
          setEmployees(employees.filter((row) => (row.id !== '')));
          return newRow;
        }
        const updatedRow = { ...newRow, isNew: false};
        setEmployees(employees.map((row) => (row.id === '' ? updatedRow : row)));
        handleUpdate('add', {'id': newRow.id, 'username': newRow.username, 'password': newRow.password, 'name': newRow.name, 'startDate': newRow.start_date, 'salary': newRow.salary, 'position': newRow.position});
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
      handleUpdate(item, {'id': newRow.id, [item]: newRow[item]});
    }
    const updatedRow = { ...newRow, isNew: false };
    setEmployees(employees.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const columns = [
    { field: 'id', headerName: 'ID', headerClassName: 'super-app-theme--header', flex: 1, minWidth: 50, editable: true, type: 'number', align: 'left', headerAlign: 'left'},
    {
      field: 'username',
      headerName: 'Username',
      headerClassName: 'super-app-theme--header',
      flex: 2,
      minWidth: 150,
      editable: true,
    },
    {
      field: 'password',
      headerName: 'Password',
      headerClassName: 'super-app-theme--header',
      flex: 2,
      minWidth: 150,
      editable: true,
    },
    {
      field: 'name',
      headerName: 'Name',
      headerClassName: 'super-app-theme--header',
      flex: 2,
      minWidth: 150,
      editable: true,
    },
    {
      field: 'start_date',
      headerName: 'Start Date',
      headerClassName: 'super-app-theme--header',
      type: 'date',
      flex: 2,
      minWidth: 150,
      editable: true,
    },
    {
      field: 'salary',
      headerName: 'Salary',
      headerClassName: 'super-app-theme--header',
      flex: 1,
      type: 'number',
      minWidth: 50,
      editable: true,
      align: 'left', 
      headerAlign: 'left'
    },
    {
      field: 'position',
      headerName: 'Position',
      headerClassName: 'super-app-theme--header',
      flex: 2,
      minWidth: 150,
      editable: true,
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

  // Render loading or error messages
  if (loading) {
    return <p>Loading employees...</p>;
  }

  if (error) {
    return <p>Error loading employees: {error}</p>;
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
        rows={employees}
        columns={columns}
        slots={{
          toolbar: AddToolbar,
        }}
        slotProps={{
          toolbar: { setEmployees, setRowModes, inAdd, setInAdd }
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

export default EmployeesTable;