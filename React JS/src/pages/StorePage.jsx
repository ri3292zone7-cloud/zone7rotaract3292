import { useEffect } from 'react';
import './store.css';
import StoreHero from '../components/store/StoreHero';
import ProductSections from '../components/store/ProductSections';
import VendorsSection from '../components/store/VendorsSection';
import OrderBand from '../components/store/OrderBand';
import CartDrawer from '../components/store/CartDrawer';
import SiteFooter from '../components/layout/SiteFooter';

export default function StorePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Zone 7 Store — Rotaract District 3292';
    if (window.location.hash === '#vendors') {
      const t = setTimeout(() => {
        const el = document.getElementById('vendors');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 180);
      return () => clearTimeout(t);
    }
    return undefined;
  }, []);

  return (
    <div className="st-page">
      <StoreHero />
      <ProductSections />
      <VendorsSection />
      <OrderBand />
      <CartDrawer />
      <SiteFooter />
    </div>
  );
}