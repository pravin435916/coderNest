import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import UserProvider from './context/UserProvider.jsx'
import { Toaster } from 'react-hot-toast'
import ApiProvider from './context/ApiProvider.jsx'
import { NotificationProvider } from './context/NotificationProvider.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApiProvider>
    <UserProvider>
    <NotificationProvider>
    <App />
    </NotificationProvider>
    <Toaster/>
    </UserProvider>
    </ApiProvider>
  </React.StrictMode>,
)
