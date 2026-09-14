import { Link, useInRouterContext } from 'react-router-dom';

const HOME_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 11l8-7 8 7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 9.5V20h5v-5.5h2V20h5V9.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const STORE_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5.5 8h13l-1.1 12.5H6.6z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);
const MAG_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15.5H6.7A1.7 1.7 0 0 0 5 20.2z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
    <path d="M5 19.5A1.5 1.5 0 0 1 6.5 18H19" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);
const VENDORS_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4.5 9.5 5.6 4.5h12.8l1.1 5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 9.5V20h15V9.5" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
    <path d="M9.5 20v-5.5h5V20" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TABS = [
  { key: 'home', label: 'Home', href: '/', icon: HOME_ICON },
  { key: 'store', label: 'Store', href: '/store', icon: STORE_ICON },
  { key: 'merch', label: 'Magazine', href: '/merch', icon: MAG_ICON },
  { key: 'vendors', label: 'Vendors', href: '/vendors', icon: VENDORS_ICON }
];

function buzz() {
  try {
    if (navigator.vibrate) navigator.vibrate(10);
  } catch {
    /* haptics unsupported — tap still works */
  }
}

/*
 * Shared bottom tab bar for every island page (store / magazine /
 * vendors / vendor detail). Same routing rule as IslandNav: '/' and
 * '/vendors' always leave the island (full page load); Store/Magazine
 * stay client-side when a router is present.
 */
export default function MobileTabBar({ current }) {
  const inRouter = useInRouterContext();
  const active = current === 'vendor' ? 'vendors' : current;

  return (
    <nav className="in-tabbar" aria-label="Primary">
      {TABS.map((t) => {
        const external = t.href === '/' || t.href === '/vendors';
        const cls = `in-tab${active === t.key ? ' active' : ''}`;
        const inner = (
          <>
            {t.icon}
            <span>{t.label}</span>
          </>
        );
        return external || !inRouter ? (
          <a key={t.key} className={cls} href={t.href} onClick={buzz}>
            {inner}
          </a>
        ) : (
          <Link key={t.key} className={cls} to={t.href} onClick={buzz}>
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}
