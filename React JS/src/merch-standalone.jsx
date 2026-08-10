import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import MerchPage from './pages/MerchPage.jsx'
import CartProvider from './context/CartProvider.jsx'

function RedirectToRoot() {
  useEffect(() => {
    window.location.replace('/')
  }, [])
  return null
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/merch" element={<MerchPage />} />
          <Route path="/merch-react.html" element={<MerchPage />} />
          <Route path="*" element={<RedirectToRoot />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </StrictMode>,
)