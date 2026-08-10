import { useStoreCart } from '../../context/useStoreCart';
import IslandNav from '../island/IslandNav';

/*
 * IslandNav plus the store cart button. Rendered once above the routes
 * (see islands-app.jsx), so it never remounts when switching pages.
 */
export default function StoreNav({ current = 'store', withCart = true }) {
  const cart = useStoreCart();

  return (
    <IslandNav current={current} context={current === 'merch' ? 'Magazine' : 'Store'}>
      {withCart && (
        <button type="button" className="st-cart-btn" aria-label="Open cart" onClick={() => cart.setOpen(true)}>
          🛒 <span className="st-cart-count">{cart.count > 0 ? cart.count : ''}</span>
        </button>
      )}
    </IslandNav>
  );
}