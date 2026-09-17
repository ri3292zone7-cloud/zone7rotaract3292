import { money } from '../../data/merch-catalog';
import { useStoreCart } from '../../context/useStoreCart';
import { loadOrders, setOrderStatus } from '../../context/demo-orders.js';
import StoreDialog from './StoreDialog';

const STATUS_LABEL = {
  awaiting: 'Awaiting payment',
  success: 'Paid (simulated)',
  failed: 'Payment failed (simulated) — retry available',
  pending: 'Payment pending (simulated) — retry available'
};

export default function DemoOrders() {
  const cart = useStoreCart();

  let orders = [];
  let loadError = '';
  try {
    orders = loadOrders(localStorage);
  } catch {
    loadError = 'Saved demo orders on this device could not be read.';
  }

  if (!cart.ordersOpen) return null;

  return (
    <StoreDialog label="Demo orders and status" onClose={() => cart.setOrdersOpen(false)}>
      <div className="st-co-body">
        <p className="st-co-kicker">Demo orders</p>
        <h3>Your demo orders on this device</h3>
        <p className="st-co-sub">
          These orders live only in this browser. They are not real purchases and nothing will be shipped. Payment outcomes
          are simulated for demonstration.
        </p>

        {loadError && <p className="st-co-error" role="alert">{loadError}</p>}

        {!loadError && orders.length === 0 && (
          <p className="st-co-sub">No demo orders yet. Use Buy now or the cart checkout to create one.</p>
        )}

        {orders.map((order) => (
          <article key={order.id} className={`st-co-order st-co-${order.status}`}>
            <header>
              <b>{order.id}</b>
              <span className={`st-co-pill st-co-pill-${order.status}`}>{STATUS_LABEL[order.status]}</span>
            </header>
            <ul>
              {order.items.map((item) => (
                <li key={item.id + '::' + item.size}>
                  {item.name}{item.size ? ` · size ${item.size}` : ''} × {item.qty} — {money(item.price * item.qty)}
                </li>
              ))}
            </ul>
            <p>
              {order.fulfillment === 'delivery' ? `Demo delivery to ${order.address}` : 'Pickup'} · fee {order.fee ? money(order.fee) : 'Free'} · total {money(order.total)}
            </p>
            <p className="st-co-history">
              {order.history.map((entry, index) => (
                <span key={entry.at + ':' + index}>{STATUS_LABEL[entry.status]}{index < order.history.length - 1 ? ' → ' : ''}</span>
              ))}
            </p>
            {(order.status === 'failed' || order.status === 'pending' || order.status === 'awaiting') && (
              <button type="button" className="btn btn-primary" onClick={() => { try { setOrderStatus(localStorage, order.id, 'awaiting'); } catch { /* review still opens; errors surface there */ } cart.setOrdersOpen(false); cart.setDemoSession({ id: order.id, lines: order.items.map((item) => ({ id: item.id, size: item.size, qty: item.qty })), source: 'retry' }); }}>
                {order.status === 'awaiting' ? 'Complete simulated payment' : 'Retry simulated payment'}
              </button>
            )}
          </article>
        ))}

        <div className="st-co-actions">
          <button type="button" className="btn btn-glass" onClick={() => cart.setOrdersOpen(false)}>
            Back to store
          </button>
        </div>
      </div>
    </StoreDialog>
  );
}
