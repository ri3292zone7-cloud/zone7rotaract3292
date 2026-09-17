import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import StoreCartProvider from './context/StoreCartProvider.jsx'
import VendorsLandingPage from './pages/VendorsLandingPage.jsx'

/*
 * No router here on purpose: the Support Local page is a single-page
 * island. IslandNav detects the missing router and renders plain links,
 * so Home / Store / Magazine navigate away with a full page load.
 * Wrapped in the store cart provider so the permanent bottom-bar cart
 * orb shows the real count (restored from localStorage) and opens the
 * store drawer without leaving the page.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreCartProvider>
      <VendorsLandingPage />
    </StoreCartProvider>
  </StrictMode>,
)