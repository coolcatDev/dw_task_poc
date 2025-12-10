import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './App.css'; // Import the CSS

// 1. Find the root element in index.html
const rootElement = document.getElementById('root');

// 2. Create the root rendering context
const root = ReactDOM.createRoot(rootElement);

// 3. Render the App component into the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);