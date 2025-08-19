import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </AppProvider>
  </React.StrictMode>,
)