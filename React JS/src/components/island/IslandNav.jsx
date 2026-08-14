import { useEffect, useState } from 'react';
import { Link, useInRouterContext } from 'react-router-dom';
import './island-nav.css';

const SITE_LINKS = [
  { key: 'home', label: 'Home', href: '/' },
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

  /*
   * The Home link is always a plain <a> — '/' is not a route in the island
   * app, so it must leave the island entirely (full page load, cross-faded
   * by site-transition.js). Store/Magazine stay router Links: inside the
   * combined app they navigate client-side without reloading.
   */
  const isHome = (href) => href === '/';
  const linkProps = (href) => {
    const onClick = () => setMenu(false);
    if (isHome(href)) return { href: '/', onClick };
    return inRouter ? { to: href, onClick } : { href, onClick };
  };

  const NavLink = ({ href, ...rest }) => {
    const Tag = isHome(href) ? 'a' : (inRouter ? Link : 'a');
    return Tag === 'a' ? <a href={href} {...rest} /> : <Tag {...rest} />;
  };
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
            <span className="in-z">7</span>
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
      </div>
    </>
  );
}
