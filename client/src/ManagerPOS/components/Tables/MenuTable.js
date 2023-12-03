import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {Edit as EditIcon, Delete as DeleteIcon} from '@mui/icons-material';
import {
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { EditDialog, handleUpdate } from './MenuTableEditDialog';
import { TranslateBulk, TranslateText } from '../../../Translate';

// const serverURL = 'https://project-3-server-ljp9.onrender.com' || 'http://localhost:9000';
const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';
console.log(serverURL);

const AddToolbar = ({menuItems, setMenuItems, isOpen, setIsOpen, translationAdd}) => {

  const handleAdd = () => {
    // console.log('h');
    setIsOpen({...isOpen, '': true});
  }

  if (isOpen === undefined) {
    return <div></div>
  }

  return (
    <>
    {isOpen[''] && <EditDialog key={''} id='' menu={menuItems} setMenu={setMenuItems} open={isOpen} setOpen={setIsOpen}/>}
    <GridToolbarContainer>
      <Button color='primary' startIcon={<Box sx={{mb:.5}}><div>+</div></Box>} onClick={handleAdd}>
        {translationAdd || 'Create New Menu Item'}
      </Button>
    </GridToolbarContainer>
    </>
  )
}

const MenuTable = ({doTL}) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ isOpen, setIsOpen ] = useState({});
  const [ translationHeaders, setTranslationHeaders ] = useState([]);
  const [ translationAdd, setTranslationAdd ] = useState('');

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

  useEffect(() => {
    if (doTL) {
      var headers = ['Name', 'Price', 'Actions'];
      TranslateBulk(headers, setTranslationHeaders);
      TranslateText('Create New Menu Item', setTranslationAdd);
    }
  }, [doTL])

  const handleDelete = (id) => () => {
    console.log(id);
    handleUpdate('delete', {'id': id});
    setMenuItems(menuItems.filter((item) => item.id !== id))
  }

  const handleEdit = (id) => () => {
    console.log(id);
    var open = {};
    Object.entries(isOpen).map((k,v) => open[k] = v);
    open[id] = true;
    setIsOpen(open);
  }

  const columns = [
    { field: 'id', headerName: 'ID', headerClassName: 'super-app-theme--header', headerAlign: 'left', align: 'left', flex: 1, minWidth: 50, editable: false, type: 'number'},
    {
      field: 'name',
      headerName: translationHeaders[0] || 'Name',
      headerClassName: 'super-app-theme--header',
      flex: 2,
      minWidth: 150,
      editable: false,
    },
    {
      field: 'price',
      headerName: translationHeaders[1] || 'Price',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'left', 
      align: 'left', 
      flex: 1,
      type: 'number',
      minWidth: 50,
      editable: false,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: translationHeaders[2] || 'Actions',
      headerClassName: 'super-app-theme--header',
      minWidth: 100,
      cellClassName: 'actions',
      getActions: ({id}) => {
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
    }
  ];
  // var openDialog = {}
  // menuItems.forEach((item, index) => openDialog[item.id] = false);

  useEffect(() => {
    var openDialog = {}
    menuItems.forEach((item, index) => openDialog[item.id] = false);
    setIsOpen(openDialog);
  }, [menuItems]);

  if (loading) {
    return <p>Loading menu items...</p>;
  }

  if (error) {
    return <p>Error loading menu items: {error}</p>;
  }

  if (isOpen === undefined || Object.entries(isOpen).length === 0) {
    return <div></div>
  }

  return (
    <>
    {
      menuItems.map((item) => {
        return (
          <>
          {isOpen[item.id] && <EditDialog key={item.id} menu={menuItems} setMenu={setMenuItems} id={item.id} open={isOpen} setOpen={setIsOpen} />}
          </>
        );
      })
    }
    <Box sx={{ width: '100%', '& .super-app-theme--header': {
      backgroundColor: '#2E4647', color: 'white', fontWeight: 'bold'},}}>
      <DataGrid
        // onCellEditStop={handleEdit}
        rows={menuItems}
        columns={columns}
        slots={{
          toolbar: AddToolbar,
        }}
        slotProps={{
          toolbar: { menuItems, setMenuItems, isOpen, setIsOpen, translationAdd }
        }}
        initialState={{
          sorting: {
            sortModel: [{field: 'id', sort: 'asc'}]
          }
        }}
      />
    </Box>
    </>
  );
};

export default MenuTable;