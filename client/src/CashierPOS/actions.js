// actions.js
export const FETCH_MENU_ITEMS = 'FETCH_MENU_ITEMS';
export const UPDATE_MENU_ITEMS = 'UPDATE_MENU_ITEMS';
export const UPDATE_ADDONS = 'UPDATE_ADDONS';
export const FETCH_ADDONS = 'FETCH_ADDONS';

export const fetchMenuItems = (menuItems) => ({
  type: FETCH_MENU_ITEMS,
  payload: menuItems,
});

export const fetchAddOns = (addons) => ({
  type: FETCH_ADDONS,
  payload: addons,
});

export const updateMenuItems = (menuItems) => ({
  type: UPDATE_MENU_ITEMS,
  payload: menuItems,
});

export const updateAddons = (itemId, addons) => ({
  type: UPDATE_ADDONS,
  payload: { itemId, addons },
});

export const CLEAR_MENU_ITEMS = 'CLEAR_MENU_ITEMS';
export const CLEAR_ADDONS = 'CLEAR_ADDONS';

export const clearMenuItems = () => ({
    type: CLEAR_MENU_ITEMS,
    });

export const clearAddons = () => ({
    type: CLEAR_ADDONS,
    });


