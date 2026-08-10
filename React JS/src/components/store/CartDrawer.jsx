import { CATALOG, money, STORE } from '../../data/merch-catalog';
import { useStoreCart } from '../../context/useStoreCart';

export default function CartDrawer() {
  const cart = useStoreCart();
  const open = cart.open;

  const lines = cart.lines
    .map((l) => {
      const p = CATALOG.find((x) => x.id === l.id);
      return p ? { ...l, p } : null;
    })
    .filter(Boolean);

  return (
    <>
      <div className={`st-drawer-scrim ${open ? 'on' : ''}`} onClick={() => cart.setOpen(false)}></div>
      <aside className={`st-drawer ${open ? 'on' : ''}`} aria-hidden={!open}>
        <div className="st-drawer-head">
          <h3>Your rack, {cart.count} item{cart.count === 1 ? '' : 's'}</h3>
          <button type="button" className="st-drawer-close" aria-label="Close cart" onClick={() => cart.setOpen(false)}>
            ×
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="st-drawer-empty">
            <span className="st-drawer-empty-ico">🛍️</span>
            <p>Nothing on the rack yet.</p>
            <p className="sub">Swipe the models up top and grab a drop.</p>
          </div>
        ) : (
          <div className="st-drawer-lines">
            {lines.map((l) => (
              <div className="st-drawer-line" key={l.p.id + (l.size ? '::' + l.size : '')}>
                <span className="st-drawer-dot" style={{ background: l.p.color }}></span>
                <div className="st-drawer-info">
                  <strong>{l.p.name}</strong>
                  <span>{l.size ? 'Size ' + l.size : ''}</span>
                </div>
                <div className="st-drawer-qty">
                  <button type="button" onClick={() => cart.setQty(l.p.id + (l.size ? '::' + l.size : ''), -1)}>
                    −
                  </button>
                  <b>{l.qty}</b>
                  <button type="button" onClick={() => cart.setQty(l.p.id + (l.size ? '::' + l.size : ''), 1)}>
                    +
                  </button>
                </div>
                <span className="st-drawer-price">{money(l.p.price * l.qty)}</span>
              </div>
            ))}
          </div>
        )}

        {lines.length > 0 && (
          <div className="st-drawer-foot">
            <div className="st-drawer-total">
              <span>Total</span>
              <b>{money(cart.total)}</b>
            </div>
            <button type="button" className="btn btn-primary st-checkout" onClick={cart.checkout}>
              💬 Order on WhatsApp
            </button>
            <button type="button" className="st-clear" onClick={cart.clear}>
              Clear rack
            </button>
            <p className="st-drawer-note">{STORE.deliveryNote}</p>
          </div>
        )}
      </aside>
    </>
  );
}