import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { AppUi } from './router/AppRoutes.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppUi />
  </React.StrictMode>,
)
