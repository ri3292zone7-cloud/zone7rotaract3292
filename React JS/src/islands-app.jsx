import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StorePage from './pages/StorePage.jsx';
import MerchPage from './pages/MerchPage.jsx';
import StoreCartProvider from './context/StoreCartProvider.jsx';
import CartProvider from './context/CartProvider.jsx';

function RedirectToRoot() {
  useEffect(() => {
    window.location.replace('/');
  }, []);
  return null;
}

/*
 * The combined store + magazine island. One bundle, one router — the
 * nav switches pages client-side, so moving between /store and /merch
 * never reloads the site.
 */
export default function IslandsApp() {
  return (
    <StoreCartProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/store" element={<StorePage />} />
            <Route path="/store-react.html" element={<StorePage />} />
            <Route path="/merch" element={<MerchPage />} />
            <Route path="/merch-react.html" element={<MerchPage />} />
            <Route path="*" element={<RedirectToRoot />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </StoreCartProvider>
  );
}
