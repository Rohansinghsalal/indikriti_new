import React from 'react';
import { CartProvider } from './context/CartContext.jsx';
import AppRouter from './router/AppRouter.jsx';
import './App.css';

function App() {
  return (
    <CartProvider>
      <div className="App">
        <AppRouter />
      </div>
    </CartProvider>
  );
}

export default App;
