// reducers.js
import { FETCH_MENU_ITEMS, UPDATE_MENU_ITEMS, UPDATE_ADDONS, CLEAR_MENU_ITEMS, CLEAR_ADDONS, FETCH_ADDONS, ADD_ITEM_TO_ORDER, CLEAR_ORDER } from './actions';

const menuItemsReducer = (state = [], action) => {
  switch (action.type) {
    case FETCH_MENU_ITEMS:
    case UPDATE_MENU_ITEMS:
      return action.payload;
    case CLEAR_MENU_ITEMS:
        return [];
    default:
      return state;
  }
};

const addonsReducer = (state = [], action) => {
  switch (action.type) {
    case FETCH_ADDONS:
    case UPDATE_ADDONS:
      return action.payload;
    case CLEAR_ADDONS:
        return [];
    default:
      return state;
  }
};

const orderReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_ITEM_TO_ORDER':
      return [...state, action.payload];
    case 'CLEAR_ORDER':
      return [];
    default:
      return state;
  }
}


export { menuItemsReducer, addonsReducer, orderReducer };
