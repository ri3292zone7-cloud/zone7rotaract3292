import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import StorePage from './pages/StorePage.jsx';
import MerchPage from './pages/MerchPage.jsx';
import StoreNav from './components/store/StoreNav.jsx';
import StoreCartProvider from './context/StoreCartProvider.jsx';
import CartProvider from './context/CartProvider.jsx';

function RedirectToRoot() {
  useEffect(() => {
    window.location.replace('/');
  }, []);
  return null;
}

/*
 * The nav lives ONCE, above the routes — switching between /store and
 * /merch swaps only the page below it, so the bar never remounts,
 * never fades and stays put.
 */
function Shell() {
  const { pathname } = useLocation();
  const isStore = pathname.startsWith('/store');
  return (
    <>
      <StoreNav current={isStore ? 'store' : 'merch'} withCart={isStore} />
      <Routes>
        <Route path="/store" element={<StorePage />} />
        <Route path="/store-react.html" element={<StorePage />} />
        <Route path="/merch" element={<MerchPage />} />
        <Route path="/merch-react.html" element={<MerchPage />} />
        <Route path="*" element={<RedirectToRoot />} />
      </Routes>
    </>
  );
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
          <Shell />
        </BrowserRouter>
      </CartProvider>
    </StoreCartProvider>
  );
}
