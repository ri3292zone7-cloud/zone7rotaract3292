import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MannkaPage from './pages/MannkaPage.jsx'

/*
 * No router here on purpose: the vendor page is a single-page island.
 * IslandNav detects the missing router and renders plain links, so
 * Home / Store / Support Local navigate away with a full page load.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MannkaPage />
  </StrictMode>,
)