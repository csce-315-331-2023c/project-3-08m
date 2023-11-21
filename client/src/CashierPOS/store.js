// store.js
import { createStore, combineReducers } from 'redux';
import { menuItemsReducer, addonsReducer } from './reducers';

const rootReducer = combineReducers({
  menuItems: menuItemsReducer,
  addons: addonsReducer,
});

const store = createStore(rootReducer);

export default store;
