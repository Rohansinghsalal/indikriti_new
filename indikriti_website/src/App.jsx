import React from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import AppRouter from './router/AppRouter.jsx';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <AppRouter />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
