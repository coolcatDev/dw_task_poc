import React, { useEffect } from 'react';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'NOT_FOUND_URL';

function App() {
  
  // Use useEffect to log the variable once the component mounts
  useEffect(() => {
    console.log('--- Environment Variable Check ---');
    console.log(`API_BASE_URL (from environment): ${API_BASE_URL}`);
    console.log('----------------------------------');
  }, []);

  return (
    <div className="App">
      <p>
        Current API Base URL: <strong>{API_BASE_URL}</strong>
      </p>
    </div>
  );
}

export default App;