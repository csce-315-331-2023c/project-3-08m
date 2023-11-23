// store.js
import { createStore, combineReducers } from 'redux';
import { menuItemsReducer, addonsReducer, orderReducer } from './reducers';

const rootReducer = combineReducers({
  menuItems: menuItemsReducer,
  addons: addonsReducer,
  ordersEntered: orderReducer,
});

const store = createStore(rootReducer);

export default store;
