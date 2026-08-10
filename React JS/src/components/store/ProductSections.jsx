import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from '../ui/Reveal';
import { CATALOG, CATEGORIES, money } from '../../data/merch-catalog';
import { useStoreCart } from '../../context/useStoreCart';

gsap.registerPlugin(ScrollTrigger);

const KIND_LABEL = {
  tee: 'Tee',
  badge: 'Badge',
  pin: 'Pin',
  cap: 'Cap',
  bottle: 'Bottle'
};

/*
 * Colorway switcher per kind — clicking a swatch swaps the card to that
 * sibling product (name, colour, price, sizes all follow).
 */
function KindSwatches({ products, selectedId, onSelect }) {
  if (products.length < 2) return null;
  return (
    <div className="st-swatches">
      {products.map((p) => (
        <button
          key={p.id}
          type="button"
          className={`st-swatch ${p.id === selectedId ? 'on' : ''}`}
          style={{ background: p.color }}
          aria-label={p.title || p.name}
          title={p.colorName}
          onClick={() => onSelect(p.id)}
        />
      ))}
    </div>
  );
}

function ProductVisual({ product, className }) {
  const emblem =
    product.kind === 'badge' || product.kind === 'pin' ? (
      <svg viewBox="0 0 64 64" className="st-visual-emblem" aria-hidden="true">
        <circle cx="32" cy="32" r="28" fill="url(#stGold)" />
        <circle cx="32" cy="32" r="24" fill="url(#stDisc)" />
        <text x="32" y="41" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="800" fontSize="30" fill="#fff">
          7
        </text>
        <defs>
          <linearGradient id="stGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFD76A" />
            <stop offset="1" stopColor="#B97E00" />
          </linearGradient>
          <linearGradient id="stDisc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={product.color} />
            <stop offset="1" stopColor={product.ink || '#A80F52'} />
          </linearGradient>
        </defs>
      </svg>
    ) : null;

  if (product.kind === 'tee') {
    return (
      <div className={`st-visual st-visual-tee ${className || ''}`} style={{ '--tee': product.color }}>
        <span className="st-tee-chest" style={{ color: product.ink }}>Z7</span>
      </div>
    );
  }
  if (product.kind === 'cap') {
    return (
      <div className={`st-visual st-visual-cap ${className || ''}`} style={{ '--cap': product.color }}>
        <span className="st-cap-front">
          <svg viewBox="0 0 64 40" aria-hidden="true">
            <circle cx="32" cy="18" r="13" fill="url(#stCapDisc)" />
            <defs>
              <linearGradient id="stCapDisc" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#E11A6E" />
                <stop offset="1" stopColor="#A80F52" />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </div>
    );
  }
  if (product.kind === 'bottle') {
    return <div className={`st-visual st-visual-bottle ${className || ''}`} style={{ '--bottle': product.color }} />;
  }

  return <div className={`st-visual st-visual-badge ${className || ''}`}>{emblem}</div>;
}

function ProductCard({ product, siblings, onSelect, selectedId }) {
  const cart = useStoreCart();
  const [size, setSize] = useState(product.sizes?.[0] || '');
  const go = product.sizes.length ? size : '';

  const addToCart = (e) => {
    e.preventDefault();
    if (product.price <= 0) return;
    cart.add(product.id, go || undefined);
    cart.setOpen(true);
  };

  const needsSize = product.kind === 'tee' || product.kind === 'cap';

  return (
    <Reveal className="st-card" delay={0.05}>
      <div className="st-card-media">
        <span className="st-card-glow" style={{ '--glow': product.color }}></span>
        <ProductVisual product={product} />
        {product.badge && <span className="st-card-badge">{product.badge}</span>}
        <span className="st-card-kind">{KIND_LABEL[product.kind]}</span>
      </div>

      <div className="st-card-body">
        <h4>{product.name}</h4>
        <p className="st-card-tagline">{product.tagline}</p>

        <div className="st-card-row">
          <KindSwatches products={siblings} selectedId={selectedId} onSelect={onSelect} />
          <span className="st-card-price">{money(product.price)}</span>
        </div>

        {needsSize && product.sizes.length > 0 && (
          <div className="st-sizes">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                className={`st-size ${s === size ? 'on' : ''}`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="st-card-foot">
          {needsSize ? (
            <button type="button" className="btn btn-primary st-add" onClick={addToCart}>
              Add · {money(product.price)}
            </button>
          ) : (
            <button type="button" className="btn btn-primary st-add" onClick={addToCart}>
              Add to cart · {money(product.price)}
            </button>
          )}
        </div>
      </div>
    </Reveal>
  );
}

export default function ProductSections() {
  const sectionsRef = useRef(null);
  const [selected, setSelected] = useState(() => {
    const map = {};
    CATEGORIES.forEach((c) => {
      const first = CATALOG.find((p) => p.kind === c.id.replace(/s$/, '') || p.kind === c.id);
      map[c.id] = first ? first.id : null;
    });
    return map;
  });

  // pins live under the badges section
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.st-section').forEach((sec) => {
        const big = sec.querySelector('.st-big7');
        if (big) {
          gsap.fromTo(
            big,
            { yPercent: 30, opacity: 0.15 },
            {
              yPercent: -30,
              opacity: 0.05,
              ease: 'none',
              scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true }
            }
          );
        }
      });
    }, sectionsRef);
    return () => ctx.revert();
  }, []);

  const selectProduct = (kindId, productId) => setSelected((s) => ({ ...s, [kindId]: productId }));

  return (
    <div className="st-sections" ref={sectionsRef} id="shop">
      {/* marquee separator */}
      <div className="st-marquee">
        <div className="st-marquee-track">
          {[0, 1].map((dup) => (
            <div className="st-marquee-group" aria-hidden={dup === 1} key={dup}>
              {['Tees', 'Badges', 'Pins', 'Caps', 'Bottles', 'Zone 7', 'District 3292', 'Wear it. Pin it. Live it.'].map(
                (w) => (
                  <span key={w} className="st-marquee-word">
                    {w} <i>✦</i>
                  </span>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {CATEGORIES.map((cat, ci) => {
        const showKind = (cat.id === 'tees' && 'tee') || (cat.id === 'badges' && 'badge') || (cat.id === 'caps' && 'cap') || (cat.id === 'bottles' && 'bottle');
        const products = CATALOG.filter((p) => p.kind === showKind);
        if (!products.length) return null;
        const extraKind = cat.id === 'badges' ? CATALOG.filter((p) => p.kind === 'pin') : [];
        const gridItems = [...products, ...extraKind];
        return (
          <section className={`st-section ${ci % 2 ? 'flip' : ''}`} id={cat.id} key={cat.id}>
            <span className="st-big7" aria-hidden="true">
              7
            </span>
            <div className="wrap">
              <div className="st-head">
                <div>
                  <span className="st-tag">{cat.tag}</span>
                  <h2>{cat.title}</h2>
                  <p className="st-sub">{cat.sub}</p>
                </div>
                <span className="st-count">{String(gridItems.length).padStart(2, '0')} pieces</span>
              </div>
              <div className="st-grid">
                {gridItems.map((p) => {
                  const kindId = p.kind === 'pin' ? 'badges' : cat.id;
                  const siblings = CATALOG.filter((x) => x.kind === p.kind);
                  const selId = selected[kindId];
                  return (
                    <ProductCard
                      key={p.id}
                      product={p}
                      siblings={siblings}
                      selectedId={selId}
                      onSelect={(id) => selectProduct(kindId, id)}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}