export const FETCH_MENU_ITEMS = 'FETCH_MENU_ITEMS';
export const UPDATE_MENU_ITEMS = 'UPDATE_MENU_ITEMS';
export const UPDATE_ADDONS = 'UPDATE_ADDONS';
export const FETCH_ADDONS = 'FETCH_ADDONS';

/**
 * Redux action to fetch menu items
 * @param {*} menuItems 
 * @returns void
 */
export const fetchMenuItems = (menuItems) => ({
  type: FETCH_MENU_ITEMS,
  payload: menuItems,
});

/**
 * Redux action to fetch add-ons
 * @param {*} addons 
 * @returns void
 */
export const fetchAddOns = (addons) => ({
  type: FETCH_ADDONS,
  payload: addons,
});

/**
 * Redux action to update menu items
 * @param {*} menuItems 
 * @returns void
 */
export const updateMenuItems = (menuItems) => ({
  type: UPDATE_MENU_ITEMS,
  payload: menuItems,
});

/**
 * Redux action to update add-ons
 * @param {*} itemId 
 * @param {*} addons 
 * @returns void
 */
export const updateAddons = (itemId, addons) => ({
  type: UPDATE_ADDONS,
  payload: { itemId, addons },
});

export const CLEAR_MENU_ITEMS = 'CLEAR_MENU_ITEMS';
export const CLEAR_ADDONS = 'CLEAR_ADDONS';

/**
 * Redux action to clear menu items
 * @returns void
 */
export const clearMenuItems = () => ({
    type: CLEAR_MENU_ITEMS,
    });

/**
 * Redux action to clear add-ons
 * @returns void
 */
export const clearAddons = () => ({
    type: CLEAR_ADDONS,
    });

/**
 * Redux action to add an item to the order
 * @param {*} menuItem 
 * @param {*} addOnList 
 * @returns void
 */
export const addItemToOrder = (menuItem, addOnList) => ({
    type: 'ADD_ITEM_TO_ORDER',
    payload: { menuItem, addOnList },
    });

/**
 * redux action to clear the order
 * @returns void
 */
export const clearOrder = () => ({
    type: 'CLEAR_ORDER',
    });

export const CLEAR_ORDER = 'CLEAR_ORDER';
export const ADD_ITEM_TO_ORDER = 'ADD_ITEM_TO_ORDER';


