import { useStoreCart } from '../../context/useStoreCart';
import IslandNav from '../island/IslandNav';

export default function StoreNav() {
  const cart = useStoreCart();

  return (
    <IslandNav current="store" context="Store">
      <button type="button" className="st-cart-btn" aria-label="Open cart" onClick={() => cart.setOpen(true)}>
        🛒 <span className="st-cart-count">{cart.count > 0 ? cart.count : ''}</span>
      </button>
    </IslandNav>
  );
}
