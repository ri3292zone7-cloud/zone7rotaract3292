import { useCallback, useMemo, useState } from 'react';
import { CATALOG } from '../data/merch-catalog';
import { StoreCartContext } from './store-cart-context';

const KEY = 'z7-store-cart';

function makeLineKey(id, size) {
  return id + (size ? '::' + size : '');
}

export default function StoreCartProvider({ children }) {
  const [lines, setLines] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const saved = raw ? JSON.parse(raw) : [];
      return Array.isArray(saved) ? saved.filter((line) => line && CATALOG.some((p) => p.id === line.id) && Number.isInteger(line.qty) && line.qty > 0 && line.qty <= 99) : [];
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);
  const [demoSession, setDemoSession] = useState(null);
  const [ordersOpen, setOrdersOpen] = useState(false);

  const buyNow = useCallback((id, size) => {
    setOpen(false);
    setOrdersOpen(false);
    setDemoSession({ id: `DEMO-${crypto.randomUUID()}`, lines: [{ id, size: size || '', qty: 1 }], source: 'single' });
  }, []);

  const viewOrders = useCallback(() => {
    setOpen(false);
    setDemoSession(null);
    setOrdersOpen(true);
  }, []);

  const persist = (next) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  };

  const add = useCallback((id, size) => {
    setLines((prev) => {
      const k = makeLineKey(id, size);
      const found = prev.some((l) => makeLineKey(l.id, l.size) === k);
      const next = found
        ? prev.map((l) => makeLineKey(l.id, l.size) === k ? { ...l, qty: Math.min(99, l.qty + 1) } : l)
        : [...prev, { id, size: size || '', qty: 1 }];
      persist(next);
      return next;
    });
  }, []);

  const setQty = useCallback((k, delta) => {
    setLines((prev) => {
      let next = prev.map((l) => {
        if (makeLineKey(l.id, l.size) !== k) return l;
        const q = l.qty + delta;
        return { ...l, qty: Math.min(99, Math.max(0, q)) };
      });
      next = next.filter((l) => l.qty > 0);
      persist(next);
      return next;
    });
  }, []);

  const remove = useCallback((k) => {
    setLines((prev) => {
      const next = prev.filter((l) => makeLineKey(l.id, l.size) !== k);
      persist(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setLines([]);
    persist([]);
  }, []);

  const { total, count } = useMemo(() => {
    let total = 0;
    let count = 0;
    lines.forEach((l) => {
      const p = CATALOG.find((x) => x.id === l.id);
      if (p) {
        total += p.price * l.qty;
        count += l.qty;
      }
    });
    return { total, count };
  }, [lines]);

  const checkout = useCallback(() => {
    if (count === 0) return;
    setOpen(false);
    setOrdersOpen(false);
    setDemoSession({ id: `DEMO-${crypto.randomUUID()}`, lines: lines.map((line) => ({ ...line })), source: 'cart' });
  }, [lines, count]);

  const value = useMemo(
    () => ({ lines, add, setQty, remove, clear, total, count, checkout, open, setOpen, buyNow, demoSession, setDemoSession, ordersOpen, setOrdersOpen, viewOrders }),
    [lines, add, setQty, remove, clear, total, count, checkout, open, buyNow, demoSession, ordersOpen, viewOrders]
  );

  return <StoreCartContext.Provider value={value}>{children}</StoreCartContext.Provider>;
}