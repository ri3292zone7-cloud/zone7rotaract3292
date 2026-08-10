import { useEffect } from 'react';
import SiteNav from '../components/layout/SiteNav';
import SiteFooter from '../components/layout/SiteFooter';
import MagazineHero from '../components/magazine/MagazineHero';
import MarqueeBand from '../components/magazine/MarqueeBand';
import FeaturedCard from '../components/magazine/FeaturedCard';
import FlipReader from '../components/magazine/FlipReader';
import ShopGrid from '../components/magazine/ShopGrid';
import HowItWorks from '../components/magazine/HowItWorks';
import CTABand from '../components/magazine/CTABand';

export default function MerchPage() {
  useEffect(() => {
    document.title = 'Zonal Magazine | Zone 7 Store \u2014 Rotaract District 3292';
  }, []);

  return (
    <>
      <SiteNav dark />
      <main>
        <MagazineHero />
        <MarqueeBand />
        <div className="wrap">
          <FeaturedCard />
          <FlipReader />
          <ShopGrid />
          <HowItWorks />
          <CTABand />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
