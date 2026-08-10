import { useCallback, useMemo, useState } from 'react';
import { CATALOG, STORE, money } from '../data/merch-catalog';
import { StoreCartContext } from './store-cart-context';

const KEY = 'z7-store-cart';

function makeLineKey(id, size) {
  return id + (size ? '::' + size : '');
}

export default function StoreCartProvider({ children }) {
  const [lines, setLines] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);

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
      const next = [...prev];
      const found = next.find((l) => makeLineKey(l.id, l.size) === k);
      if (found) found.qty += 1;
      else next.push({ id, size: size || '', qty: 1 });
      persist(next);
      return next;
    });
  }, []);

  const setQty = useCallback((k, delta) => {
    setLines((prev) => {
      let next = prev.map((l) => {
        if (makeLineKey(l.id, l.size) !== k) return l;
        const q = l.qty + delta;
        return { ...l, qty: Math.max(0, q) };
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
    const linesMsg = lines
      .map((l) => {
        const p = CATALOG.find((x) => x.id === l.id);
        if (!p) return null;
        const size = l.size ? ' · size ' + l.size : '';
        return `• ${p.name}${size} × ${l.qty} — ${money(p.price * l.qty)}`;
      })
      .filter(Boolean);
    const msg =
      'Namaste Zone 7 Store! 🙏\nI\'d like to order:\n' +
      linesMsg.join('\n') +
      '\nTotal: ' +
      money(total) +
      '\nPlease confirm availability, size and pickup.';
    window.open('https://wa.me/' + STORE.whatsapp + '?text=' + encodeURIComponent(msg), '_blank');
  }, [lines, total, count]);

  const value = useMemo(
    () => ({ lines, add, setQty, remove, clear, total, count, checkout, open, setOpen }),
    [lines, add, setQty, remove, clear, total, count, checkout, open]
  );

  return <StoreCartContext.Provider value={value}>{children}</StoreCartContext.Provider>;
}