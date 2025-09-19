import React from 'react';
import ReactDOM from 'react-dom/client';
// using App.css only for now
import App from './App';

// this puts our main app on the page
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


