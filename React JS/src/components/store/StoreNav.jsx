import { useCart } from '../../context/useCart';
import { useStoreCart } from '../../context/useStoreCart';
import IslandNav from '../island/IslandNav';
import CartOrb from '../island/CartOrb';

/*
 * IslandNav plus the section cart button. Rendered once above the routes
 * (see islands-app.jsx), so it never remounts when switching pages.
 * The raised centre-orb cart in the bottom tab bar is permanent across
 * store and magazine — mirroring the Join orb on the main site — so the
 * top-bar cart button hides on mobile (see store.css) instead of
 * duplicating it. Each section opens its own cart: store lines on
 * /store, magazine lines on /merch (both restore from localStorage).
 * `withCart` gates only the desktop top-bar button.
 */
export default function StoreNav({ current = 'store', withCart = true }) {
  const storeCart = useStoreCart();
  const merchCart = useCart();
  const cart = current === 'merch' ? merchCart : storeCart;

  return (
    <IslandNav
      current={current}
      context={current === 'merch' ? 'Magazine' : 'Store'}
      rack={<CartOrb count={cart.count} onOpen={() => cart.setOpen(true)} />}
    >
      {withCart && (
        <button type="button" className="st-cart-btn" aria-label="Open cart" onClick={() => cart.setOpen(true)}>
          🛒 <span className="st-cart-count">{cart.count > 0 ? cart.count : ''}</span>
        </button>
      )}
    </IslandNav>
  );
}