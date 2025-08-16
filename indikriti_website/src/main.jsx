import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Import API testing only in development - temporarily disabled for debugging
// if (import.meta.env.DEV) {
//   // Use dynamic import to avoid build issues
//   import('./utils/testApi.js').catch(error => {
//     console.log('API testing module not available:', error.message);
//   });

//   // Test authentication
//   import('./utils/authTest.js').catch(error => {
//     console.log('Auth testing module not available:', error.message);
//   });
// }

// Log environment info
console.log('🚀 Indikriti E-commerce App');
console.log('📍 Environment:', import.meta.env.PROD ? 'Production' : 'Development');
console.log('🔗 API URL:', import.meta.env.VITE_API_URL || 'Mock data mode');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
