import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// 👇 UPDATED PATH: Points to the styles folder now
import './styles/index.css' 
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)