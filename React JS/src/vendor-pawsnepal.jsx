import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import VendorPage from './pages/VendorPage.jsx'

/*
 * No router here on purpose: the vendor page is a single-page island.
 * IslandNav detects the missing router and renders plain links, so
 * Home / Store / Magazine navigate away with a full page load.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <VendorPage />
  </StrictMode>,
)
