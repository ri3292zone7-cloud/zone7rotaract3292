import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '../../data/store';

const LINKS = [
  { label: 'Magazine', href: '#reader' },
  { label: 'Shop', href: '#shop' },
  { label: 'How buying works', href: '#how' }
];

export default function SiteNav({ dark = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (href) => (e) => {
    setMenu(false);
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''} ${dark && !scrolled ? 'nav-dark' : ''}`}>
        <a href="#top" className="nav-brand" onClick={go('#top')}>
          <span className="z">Z</span>
          <span>
            Zone 7 Rotaract
            <span className="tag">Zonal Magazine · {SITE.district}</span>
          </span>
        </a>
        <div className="nav-links">
          {LINKS.map((l) => (
            <a key={l.href} className="nav-link" href={l.href} onClick={go(l.href)}>
              {l.label}
            </a>
          ))}
          <Link to="/" className="nav-link">
            ← Home
          </Link>
          <a className="nav-cta" href="#reader" onClick={go('#reader')}>
            Get the magazine
          </a>
        </div>
        <button
          type="button"
          className={`nav-burger ${menu ? 'open' : ''}`}
          aria-label="Menu"
          aria-expanded={menu}
          onClick={() => setMenu((v) => !v)}
        >
          <span></span><span></span><span></span>
        </button>
      </nav>
      <div className={`nav-mobile ${menu ? 'open' : ''}`}>
        <Link to="/" onClick={() => setMenu(false)}>
          ← Home
        </Link>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={go(l.href)}>
            {l.label}
          </a>
        ))}
        <a className="nav-cta" href="#reader" onClick={go('#reader')}>
          Get the magazine
        </a>
      </div>
    </>
  );
}
