import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import UserProvider from './context/UserProvider.jsx'
import { Toaster } from 'react-hot-toast'
import ApiProvider from './context/ApiProvider.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApiProvider>
    <UserProvider>
    <App />
    <Toaster/>
    </UserProvider>
    </ApiProvider>
  </React.StrictMode>,
)
