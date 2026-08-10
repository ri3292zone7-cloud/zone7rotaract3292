import Reveal from '../ui/Reveal';
import { STORE, money } from '../../data/merch-catalog';
import { useStoreCart } from '../../context/useStoreCart';

const STEPS = [
  { num: '01', icon: '🎨', title: 'Pick your drop', desc: 'Browse tees, badges, pins, caps and bottles. Swatch-colourway to find your shade.' },
  { num: '02', icon: '💬', title: 'Order & confirm', desc: 'Add to the rack and check out — your order lands straight in our WhatsApp with sizes and total.' },
  { num: '03', icon: '🤝', title: 'Pay & collect', desc: 'Settle with eSewa, Khalti or cash at the next Zone 7 event or meetup. Receipt, sticker, done.' }
];

export default function OrderBand() {
  const cart = useStoreCart();

  const directOrder = () => {
    const msg =
      'Namaste Zone 7 Store! 🙏\nI\'d like to place an order. Please share what\u2019s currently in stock and how collection works.';
    window.open('https://wa.me/' + STORE.whatsapp + '?text=' + encodeURIComponent(msg), '_blank');
  };

  return (
    <section className="st-order" id="how">
      <div className="wrap">
        <div className="st-order-card">
          <span className="st-order-7" aria-hidden="true">7</span>
          <Reveal>
            <span className="st-tag">How buying works</span>
            <h2>Three steps between you and the drop.</h2>
          </Reveal>
          <div className="st-steps">
            {STEPS.map((s, i) => (
              <Reveal className="st-step" key={s.num} delay={i * 0.08}>
                <span className="st-step-num">{s.num}</span>
                <span className="st-step-ico">{s.icon}</span>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="st-order-actions" delay={0.2}>
            <button type="button" className="btn btn-primary" onClick={() => { if (!cart.count) directOrder(); else cart.setOpen(true); }}>
              {cart.count ? `Checkout ${cart.count} item${cart.count === 1 ? '' : 's'} · ${money(cart.total)}` : 'Order on WhatsApp →'}
            </button>
            <a className="btn btn-glass" href="/merch">📖 The Zonal Magazine</a>
          </Reveal>
          <Reveal className="st-pay-chips" delay={0.28}>
            {STORE.payChips.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}