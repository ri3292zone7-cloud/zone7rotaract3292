import { useEffect, useState } from 'react';
import { CATALOG, money } from '../../data/merch-catalog';
import { useStoreCart } from '../../context/useStoreCart';
import { createOrder, setOrderStatus, saveOrder, loadOrders, DEMO_DELIVERY_FEE } from '../../context/demo-orders.js';
import StoreDialog from './StoreDialog';

const STATUS_LABEL = {
  awaiting: 'Awaiting payment',
  success: 'Paid (simulated)',
  failed: 'Payment failed (simulated)',
  pending: 'Payment pending (simulated)'
};

function readSaved(id) {
  try {
    return loadOrders(localStorage).find((o) => o.id === id) || null;
  } catch {
    return null;
  }
}

export default function DemoCheckout() {
  const cart = useStoreCart();
  const session = cart.demoSession;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [fulfillment, setFulfillment] = useState('pickup');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [payingId, setPayingId] = useState(null);
  const [payError, setPayError] = useState('');
  const [, setOrdersTick] = useState(0);

  const saved = session ? readSaved(session.id) : null;
  const isRetry = Boolean(session && session.source === 'retry' && saved);

  useEffect(() => {
    setError('');
    setPayingId(null);
    setPayError('');
    if (session?.source === 'retry') {
      const existing = session ? readSaved(session.id) : null;
      setName(existing?.customer.name || '');
      setPhone(existing?.customer.phone || '');
      setFulfillment(existing?.fulfillment || 'pickup');
      setAddress(existing?.address || '');
    } else {
      setName('');
      setPhone('');
      setFulfillment('pickup');
      setAddress('');
    }
  }, [session?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!session) return null;

  const reviewLines = isRetry
    ? saved.items.map((item) => ({ ...item, p: null }))
    : session.lines
      .map((line) => {
        const p = CATALOG.find((x) => x.id === line.id);
        return p ? { ...line, p } : null;
      })
      .filter(Boolean);

  const setLineQty = (id, size, qty) => {
    const q = Math.min(99, Math.max(1, qty));
    cart.setDemoSession({
      ...session,
      lines: session.lines.map((l) => (l.id === id && (l.size || '') === (size || '') ? { ...l, qty: q } : l))
    });
  };

  const lineTotal = (l) => (l.p ? l.p.price : l.price) * l.qty;
  const subtotal = reviewLines.reduce((sum, l) => sum + lineTotal(l), 0);
  const fee = (isRetry ? saved.fulfillment : fulfillment) === 'delivery' ? DEMO_DELIVERY_FEE : 0;

  const submit = () => {
    try {
      if (isRetry) {
        setPayingId(session.id);
        return;
      }
      const order = createOrder(session.lines, { name, phone, fulfillment, address }, session.id);
      saveOrder(localStorage, order);
      setPayingId(order.id);
    } catch (e) {
      setError(e.message);
    }
  };

  const pay = (status) => {
    try {
      setOrderStatus(localStorage, payingId, status);
      setOrdersTick((t) => t + 1);
      setPayError('');
    } catch (e) {
      setPayError(e.message);
    }
  };

  const closeSession = () => cart.setDemoSession(null);

  const backToReview = () => {
    try {
      const o = readSaved(payingId);
      if (o && (o.status === 'failed' || o.status === 'pending')) setOrderStatus(localStorage, payingId, 'awaiting');
    } catch {
      /* review stays reachable even if storage hiccups */
    }
    setPayingId(null);
  };

  if (payingId) {
    const order = readSaved(payingId);
    return (
      <StoreDialog label="Simulated payment" onClose={backToReview}>
        <div className="st-co-body">
          <p className="st-co-kicker">Demo checkout — simulated payment</p>
          <h3>{payingId}</h3>
          <p className="st-co-sub">
            This payment screen is a demo. No real money moves, no payment provider is contacted, and no real order is placed.
          </p>
          {!order && <p className="st-co-error" role="alert">This demo order is no longer saved on this device.</p>}
          {order && (
            <>
              <dl className="st-co-summary">
                <div><dt>Subtotal</dt><dd>{money(order.subtotal)}</dd></div>
                <div><dt>{order.fulfillment === 'delivery' ? 'Demo delivery fee' : 'Pickup'}</dt><dd>{order.fee ? money(order.fee) : 'Free'}</dd></div>
                <div className="st-co-total"><dt>Total</dt><dd>{money(order.total)}</dd></div>
              </dl>
              {order.status === 'awaiting' && (
                <fieldset className="st-co-outcomes">
                  <legend>Choose a simulated outcome</legend>
                  {['success', 'failure', 'pending'].map((s) => (
                    <button key={s} type="button" className="btn btn-glass" onClick={() => pay(s === 'failure' ? 'failed' : s)}>
                      {s === 'success' ? 'Simulate success' : s === 'failure' ? 'Simulate failure' : 'Simulate pending'}
                    </button>
                  ))}
                </fieldset>
              )}
              {order.status !== 'awaiting' && (
                <div className={`st-co-result st-co-${order.status}`}>
                  <strong>{STATUS_LABEL[order.status]}</strong>
                  {order.status === 'failed' && <p>Retry is available — nothing was charged because this is a demo.</p>}
                  {order.status === 'pending' && <p>Still pending in this demo. Retry now or later from View demo orders / status.</p>}
                  {order.status === 'success' && <p>Saved on this device only. Track it under View demo orders / status.</p>}
                </div>
              )}
            </>
          )}
          {payError && <p className="st-co-error" role="alert">{payError}</p>}
          <div className="st-co-actions">
            {order?.status === 'success' ? (
              <button type="button" className="btn btn-primary" onClick={() => { setPayingId(null); closeSession(); cart.viewOrders(); }}>
                View demo order
              </button>
            ) : (
              <button type="button" className="btn btn-glass" onClick={backToReview}>
                Back to review
              </button>
            )}
          </div>
        </div>
      </StoreDialog>
    );
  }

  return (
    <StoreDialog label="Demo checkout" onClose={closeSession}>
      <div className="st-co-body">
        <p className="st-co-kicker">Demo checkout</p>
        <h3>Review your order</h3>
        <p className="st-co-sub">
          Nothing is real here: no payment is processed and no actual order is placed. Orders are saved on this device only.
        </p>
        {reviewLines.length === 0 && <p className="st-co-error" role="alert">There is nothing to review in this demo session.</p>}
        <ul className="st-co-lines">
          {reviewLines.map((l) => (
            <li key={(l.p ? l.p.id : l.id) + '::' + (l.size || '')}>
              <span className="st-co-dot" style={{ background: l.p ? l.p.color : '#E11A6E' }} />
              <span className="st-co-name">{l.p ? l.p.name : l.name}{l.size ? ` · size ${l.size}` : ''}</span>
              {isRetry ? (
                <span className="st-co-qty-static">× {l.qty}</span>
              ) : (
                <span className="st-co-qty">
                  <button type="button" aria-label="Decrease quantity" onClick={() => setLineQty(l.p.id, l.size, l.qty - 1)}>−</button>
                  <b>{l.qty}</b>
                  <button type="button" aria-label="Increase quantity" onClick={() => setLineQty(l.p.id, l.size, l.qty + 1)}>+</button>
                </span>
              )}
              <b>{money(lineTotal(l))}</b>
            </li>
          ))}
        </ul>
        {isRetry && (
          <p className="st-co-sub">Retrying the recorded order — items, {saved.customer.name}'s details and fulfilment stay exactly as saved, so this retry cannot create a duplicate.</p>
        )}

        {!isRetry && (
          <>
            <label className="st-co-field">
              <span>Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder="Your name" autoComplete="name" />
            </label>
            <label className="st-co-field">
              <span>Phone (demo)</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={24} inputMode="tel" placeholder="98XXXXXXXX" autoComplete="tel" />
            </label>

            <fieldset className="st-co-fulfill">
              <legend>Fulfilment</legend>
              <label><input type="radio" name="fulfillment" checked={fulfillment === 'pickup'} onChange={() => setFulfillment('pickup')} /> Pickup (default)</label>
              <label><input type="radio" name="fulfillment" checked={fulfillment === 'delivery'} onChange={() => setFulfillment('delivery')} /> Demo delivery · {money(DEMO_DELIVERY_FEE)}</label>
            </fieldset>
            {fulfillment === 'delivery' && (
              <label className="st-co-field">
                <span>Delivery address (demo)</span>
                <input value={address} onChange={(e) => setAddress(e.target.value)} maxLength={240} placeholder="Where should this go?" autoComplete="street-address" />
              </label>
            )}
          </>
        )}

        <dl className="st-co-summary">
          <div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
          <div><dt>{(isRetry ? saved.fulfillment : fulfillment) === 'delivery' ? 'Demo delivery fee' : 'Pickup'}</dt><dd>{fee ? money(fee) : 'Free'}</dd></div>
          <div className="st-co-total"><dt>Total</dt><dd>{money(subtotal + fee)}</dd></div>
        </dl>

        {error && <p className="st-co-error" role="alert">{error}</p>}

        <div className="st-co-actions">
          <button type="button" className="btn btn-primary" onClick={submit} disabled={reviewLines.length === 0}>
            Continue to simulated payment
          </button>
          <button type="button" className="btn btn-glass" onClick={closeSession}>
            Back to shopping
          </button>
        </div>
      </div>
    </StoreDialog>
  );
}
