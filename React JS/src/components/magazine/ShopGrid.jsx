import { PRODUCTS, COMING_SOON, money } from '../../data/store';
import { useCart } from '../../context/useCart';
import Reveal from '../ui/Reveal';

export default function ShopGrid() {
  const cart = useCart();

  const goReader = () => {
    const el = document.getElementById('reader');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="section-label" id="shop">Shop the zone</div>
      <div className="shop-grid">
        {PRODUCTS.map((p, i) => (
          <Reveal className="product-card" key={p.id} delay={i * 0.06}>
            <div className="pc-media">
              <span className="pc-badge">{p.badge}</span>
              <span className="pc-ico">{p.icon}</span>
            </div>
            <div className="pc-body">
              <h5>{p.name}</h5>
              <p className="pc-desc">{p.tagline}</p>
              <div className="pc-price">{p.price > 0 ? money(p.price) : p.priceLabel}</div>
              <div className="pc-foot">
                {p.price > 0 ? (
                  <button type="button" className="btn btn-primary" onClick={() => { cart.add(p.id); cart.setOpen(true); }}>
                    🛒 Add to cart · {money(p.price)}
                  </button>
                ) : (
                  <button type="button" className="btn btn-primary" onClick={goReader}>📖&nbsp; Read free</button>
                )}
                {p.flip
                  ? <a className="btn btn-ghost" href="#reader" onClick={(e) => { e.preventDefault(); goReader(); }}>Preview</a>
                  : <a className="btn btn-ghost" href={p.file} download={p.pdfName || ''}>Download</a>}
              </div>
            </div>
          </Reveal>
        ))}
        {COMING_SOON.map((c, i) => (
          <Reveal className="product-card ghost" key={c.name} delay={i * 0.06}>
            <div className="pc-media"><span className="pc-ico">{c.icon}</span></div>
            <div className="pc-body">
              <h5>{c.name}</h5>
              <p className="pc-desc">{c.desc}</p>
              <div className="pc-price">Coming soon</div>
              <div className="pc-foot"><button className="btn btn-ghost" disabled>Drop loading…</button></div>
            </div>
          </Reveal>
        ))}
      </div>
    </>
  );
}
