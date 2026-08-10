import { useCallback, useMemo, useState } from 'react';
import { PRODUCTS, WHATSAPP_NUMBER, money } from '../data/store';
import { CartContext } from './cart-context';

export default function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('z7-cart');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [open, setOpen] = useState(false);

  const persist = (next) => {
    try {
      localStorage.setItem('z7-cart', JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  };

  const add = useCallback((id) => {
    setItems((prev) => {
      const next = { ...prev, [id]: (prev[id] || 0) + 1 };
      persist(next);
      return next;
    });
  }, []);

  const setQty = useCallback((id, delta) => {
    setItems((prev) => {
      const next = { ...prev };
      const q = (next[id] || 0) + delta;
      if (q <= 0) delete next[id];
      else next[id] = q;
      persist(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setItems({});
    persist({});
  }, []);

  const { total, count } = useMemo(() => {
    let total = 0;
    let count = 0;
    Object.entries(items).forEach(([id, qty]) => {
      const p = PRODUCTS.find((x) => x.id === id);
      if (p) {
        total += p.price * qty;
        count += qty;
      }
    });
    return { total, count };
  }, [items]);

  const checkout = useCallback(() => {
    if (count === 0) return;
    const lines = Object.entries(items)
      .map(([id, qty]) => {
        const p = PRODUCTS.find((x) => x.id === id);
        return p ? `• ${p.name} × ${qty} — ${money(p.price * qty)}` : null;
      })
      .filter(Boolean);
    const msg =
      'Namaste Zone 7 Store! 🙏\nI\'d like to order:\n' +
      lines.join('\n') +
      '\nTotal: ' +
      money(total) +
      '\nPlease confirm availability, size and pickup.';
    window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
  }, [items, total, count]);

  const value = useMemo(
    () => ({ items, add, setQty, clear, total, count, checkout, open, setOpen }),
    [items, add, setQty, clear, total, count, checkout, open]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
