import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './CashierPOS/store';
import App from './App';

import { BrowserRouter } from 'react-router-dom';

// ReactDOM.render(
//   <Provider store={store}>
//       <App />
//   </Provider>,
//   document.getElementById('root')
// );
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}> {/* Wrap your app in the Provider */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

