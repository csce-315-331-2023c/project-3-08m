import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridCellEditStopReasons } from '@mui/x-data-grid';

// const serverURL = 'https://project-3-server-ljp9.onrender.com';
const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';

const columns = [
  { field: 'id', headerName: 'ID', headerClassName: 'super-app-theme--header', flex: 1, minWidth: 50,},
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
    flex: 2,
    minWidth: 150,
    editable: true,
  },
  {
    field: 'salary',
    headerName: 'Salary',
    headerClassName: 'super-app-theme--header',
    flex: 1,
    minWidth: 50,
    editable: true,
  },
  {
    field: 'position',
    headerName: 'Position',
    headerClassName: 'super-app-theme--header',
    flex: 2,
    minWidth: 150,
    editable: true,
  },
  
];

const EmployeesTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          employee.start_date = formatDate(employee.start_date);
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
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render loading or error messages
  if (loading) {
    return <p>Loading employees...</p>;
  }

  if (error) {
    return <p>Error loading employees: {error}</p>;
  }

  const handleEdit = (params, event) => {
    if (params.reason === GridCellEditStopReasons.cellFocusOut) {
      event.defaultMuiPrevented = true;
      return;
    }
    console.log(params);
    console.log(event.target.value);
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
    if (params.field == 'username') {
      updateEmployee('username', {'id': params.row.id, 'username': event.target.value});
    }
    else if (params.field == 'name') {
      updateEmployee('name', {'id': params.row.id, 'name': event.target.value});
    }
    else if (params.field == 'password') {
      updateEmployee('password', {'id': params.row.id, 'password': event.target.value});
    }
    else if (params.field == 'start_date') {
      updateEmployee('start_date', {'id': params.row.id, 'startDate': event.target.value});
    }
    else if (params.field == 'salary') {
      updateEmployee('salary', {'id': params.row.id, 'salary': event.target.value});
    }
    else if (params.field == 'position') {
      updateEmployee('position', {'id': params.row.id, 'position': event.target.value});
    }
  }

  return (
    <Box sx={{ width: '100%', '& .super-app-theme--header': {
      backgroundColor: '#2E4647', color: 'white', fontWeight: 'bold'},}}>
      <DataGrid
        onCellEditStop={handleEdit}
        rows={employees}
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

export default EmployeesTable;