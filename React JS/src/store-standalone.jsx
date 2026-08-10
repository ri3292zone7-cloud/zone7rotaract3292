import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import IslandsApp from './islands-app.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <IslandsApp />
  </StrictMode>,
)
