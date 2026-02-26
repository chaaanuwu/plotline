import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import LoginPage from './pages/LoginPage.jsx'
import Dashboard from './pages/Dashboard.jsx';

const token = localStorage.getItem("token");
const user = token ? { token } : null;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {user ? <Dashboard /> : <LoginPage />}
  </StrictMode>,
)
