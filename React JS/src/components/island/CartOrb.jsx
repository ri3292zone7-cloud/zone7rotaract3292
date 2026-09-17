/*
 * Shared raised centre-orb cart button for island bottom tab bars
 * (store / magazine / vendors landing) — mirrors the Join orb on the
 * main site. Presentational: pass the section's cart count and opener.
 * Orb styles live in island-nav.css, imported by IslandNav, so every
 * island bundle gets them automatically. Vendor shop pages simply
 * don't pass one, keeping their bottom bar cart-free.
 */
export default function CartOrb({ count = 0, onOpen }) {
  const open = () => {
    try {
      if (navigator.vibrate) navigator.vibrate(10);
    } catch {
      /* haptics unsupported — tap still opens the cart */
    }
    if (onOpen) onOpen();
  };

  return (
    <button type="button" className="in-tab rack-tab" aria-label="Open your cart" title="Cart" onClick={open}>
      <span className="rack-orb">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M2.5 3h2l2.2 11.2a1.5 1.5 0 001.5 1.2h7.6a1.5 1.5 0 001.4-1.1L19.5 7H6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9.2" cy="19.2" r="1.4" fill="#fff" />
          <circle cx="16.6" cy="19.2" r="1.4" fill="#fff" />
        </svg>
        {count > 0 && <span className="rack-count">{count}</span>}
      </span>
      <span>Cart</span>
    </button>
  );
}
