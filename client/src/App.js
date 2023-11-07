// App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ManagerPOS from './ManagerPOS/ManagerPOS';
import './App.css'; // Assuming your CSS is in this file

function App() {
  return (
    <Router>
      <div className="App">
        <ManagerPOS />
      </div>
    </Router>
  );
}

export default App;