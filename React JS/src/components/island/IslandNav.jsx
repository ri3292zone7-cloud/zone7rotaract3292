import { useEffect, useState } from 'react';
import { Link, useInRouterContext } from 'react-router-dom';
import './island-nav.css';

const SITE_LINKS = [
  { key: 'store', label: 'Store', href: '/store' },
  { key: 'merch', label: 'Magazine', href: '/merch' }
];

/*
 * One nav for every island (store / magazine / vendor). Just two
 * destinations — Store and Magazine — plus the Z7 mark, which always
 * falls back to the homepage. Inside the combined store/magazine app
 * the links navigate client-side (no page reload); on the vendor page
 * they are plain links.
 */
export default function IslandNav({ current, context, children }) {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const inRouter = useInRouterContext();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menu]);

  const linkProps = (href) => ({
    ...(inRouter ? { to: href } : { href }),
    onClick: () => setMenu(false)
  });

  const NavLink = inRouter ? Link : 'a';
  const ctx = context || (current === 'store' ? 'Store' : current === 'merch' ? 'Magazine' : 'Vendor');

  return (
    <>
      <header className={`island-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="in-bar">
          <NavLink
            className="in-brand"
            {...linkProps('/')}
            aria-label="Zone 7 — back to the homepage"
          >
            <span className="in-z">Z</span>
            <span>
              Zone 7
              <span className="in-ctx">{ctx}</span>
            </span>
          </NavLink>

          <nav className="in-links" aria-label="Site">
            {SITE_LINKS.map((l) => (
              <NavLink
                key={l.key}
                className={`in-link ${current === l.key ? 'active' : ''}`}
                {...linkProps(l.href)}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="in-actions">
            {children}
            <button
              type="button"
              className={`in-burger ${menu ? 'open' : ''}`}
              aria-label="Menu"
              aria-expanded={menu}
              onClick={() => setMenu((v) => !v)}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      <div className={`in-panel ${menu ? 'open' : ''}`}>
        {SITE_LINKS.map((l) => (
          <NavLink key={l.key} className={`in-panel-link ${current === l.key ? 'active' : ''}`} {...linkProps(l.href)}>
            {l.label}
          </NavLink>
        ))}
        <NavLink className="in-panel-home" {...linkProps('/')}>← Back to the homepage</NavLink>
      </div>
    </>
  );
}
