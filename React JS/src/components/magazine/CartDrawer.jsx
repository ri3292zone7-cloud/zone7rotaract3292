import { useEffect } from 'react';
import { PRODUCTS, money } from '../../data/store';
import { useCart } from '../../context/useCart';

export default function CartDrawer() {
  const { items, setQty, total, count, checkout, open, setOpen } = useCart();
  const isEmpty = count === 0;

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [setOpen]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <button className="cart-fab" aria-label="Open cart" hidden={isEmpty} onClick={() => setOpen(true)}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M2.5 3h2l2.2 11.2a1.5 1.5 0 001.5 1.2h7.6a1.5 1.5 0 001.4-1.1L19.5 7H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9.2" cy="19.2" r="1.4" fill="currentColor" />
          <circle cx="16.6" cy="19.2" r="1.4" fill="currentColor" />
        </svg>
        <span className="badge">{count}</span>
      </button>

      <div className={`cart-scrim ${open ? 'open' : ''}`} onClick={() => setOpen(false)}></div>

      <aside className={`cart-drawer ${open ? 'open' : ''}`} aria-label="Shopping cart">
        <div className="cart-head">
          <h3>Your cart</h3>
          <button type="button" className="cart-close" aria-label="Close cart" onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="cart-items">
          {isEmpty ? (
            <div className="cart-empty">Your cart is empty.<br />Grab a drop when merch goes live 🛍️</div>
          ) : (
            Object.entries(items).map(([id, qty]) => {
              const p = PRODUCTS.find((x) => x.id === id);
              if (!p) return null;
              return (
                <div className="cart-item" key={id}>
                  <div className="ci-ico">{p.icon}</div>
                  <div className="ci-info">
                    <h5>{p.name}</h5>
                    <div className="ci-price">{money(p.price)} each</div>
                    <div className="ci-qty">
                      <button type="button" className="qty-btn" aria-label="Decrease quantity" onClick={() => setQty(id, -1)}>−</button>
                      <span style={{ minWidth: 26, textAlign: 'center', fontWeight: 700 }}>{qty}</span>
                      <button type="button" className="qty-btn" aria-label="Increase quantity" onClick={() => setQty(id, 1)}>+</button>
                    </div>
                  </div>
                  <div className="ci-total">{money(p.price * qty)}</div>
                </div>
              );
            })
          )}
        </div>
        {!isEmpty && (
          <div className="cart-foot">
            <div className="cart-total-row"><span>Total</span><b>{money(total)}</b></div>
            <button type="button" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={checkout}>
              Order on WhatsApp →
            </button>
            <div className="cart-note">You'll be taken to WhatsApp to confirm your order. Pay with eSewa, Khalti or cash at the next Zone 7 event.</div>
          </div>
        )}
      </aside>
    </>
  );
}
