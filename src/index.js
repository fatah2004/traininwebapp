// src/index.js or src/App.js
import './firebase'; // Adjust the path accordingly
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Or your main component
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth, firestore } from './firebase';

ReactDOM.render(
  <React.StrictMode>
    <App auth={auth} firestore={firestore} />
  </React.StrictMode>,
  document.getElementById('root')
);
