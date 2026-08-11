import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from '../ui/Reveal';
import { CATALOG, money } from '../../data/merch-catalog';
import { useStoreCart } from '../../context/useStoreCart';
import Badge from './models/Badge';
import Cap from './models/Cap';
import Bottle from './models/Bottle';
import StudioEnv from './models/StudioEnv';
import tshirtVideo from './models/tshirt-video.mp4';

gsap.registerPlugin(ScrollTrigger);

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'tee', label: 'Tees' },
  { id: 'badge', label: 'Badges & Pins' },
  { id: 'cap', label: 'Caps' },
  { id: 'bottle', label: 'Bottles' }
];

/* one card per category — variants open inside the card's modal */
const CARD_KINDS = [
  { kind: 'tee', label: 'Tees' },
  { kind: 'badge', label: 'Badges & Pins' },
  { kind: 'cap', label: 'Caps' },
  { kind: 'bottle', label: 'Bottles' }
];

const KIND_LABEL = {
  tee: 'Tee',
  badge: 'Badge',
  pin: 'Pin',
  cap: 'Cap',
  bottle: 'Bottle'
};

/* per-kind framing for the card canvas */
const KIND_FRAME = {
  tee: { scale: 0.72, y: -0.3 },
  badge: { scale: 1.15, y: 0.25 },
  pin: { scale: 0.62, y: 0.55 },
  cap: { scale: 1.3, y: -0.85 },
  bottle: { scale: 1.15, y: -0.9 }
};

function productsForKind(kind) {
  return CATALOG.filter((p) => p.kind === kind || (kind === 'badge' && p.kind === 'pin'));
}

/* static fallback visual — shows until the 3D canvas mounts */
function ProductVisual({ product }) {
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
      <div className="st-visual st-visual-tee" style={{ '--tee': product.color }}>
        <span className="st-tee-chest" style={{ color: product.ink }}>Z7</span>
      </div>
    );
  }
  if (product.kind === 'cap') {
    return (
      <div className="st-visual st-visual-cap" style={{ '--cap': product.color }}>
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
    return <div className="st-visual st-visual-bottle" style={{ '--bottle': product.color }} />;
  }

  return <div className="st-visual st-visual-badge">{emblem}</div>;
}

/* gentle turntable for models */
function Turntable({ children }) {
  const group = useRef(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.5;
  });
  return <group ref={group}>{children}</group>;
}

/* real product shot — the Zone 7 tee video replaces the 3D mockup */
function TeeVideo({ controls = false }) {
  return (
    <video
      src={tshirtVideo}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      controls={controls}
      aria-label="Zone 7 t-shirt — real product video"
    />
  );
}

function ModelContent({ product }) {
  const frame = KIND_FRAME[product.kind] || KIND_FRAME.tee;
  return (
    <group scale={frame.scale} position={[0, frame.y, 0]}>
      {(product.kind === 'badge' || product.kind === 'pin') && (
        <group scale={product.kind === 'pin' ? 0.55 : 1}>
          <Badge color={product.color} accentDeep={product.ink || '#A80F52'} />
        </group>
      )}
      {product.kind === 'cap' && <Cap color={product.color} />}
      {product.kind === 'bottle' && <Bottle color={product.color} />}
    </group>
  );
}

function ModelCanvas({ product, style }) {
  return (
    <Canvas
      camera={{ position: [0, 0.55, 5.0], fov: 38 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0, ...style }}
    >
      <StudioEnv />
      <hemisphereLight args={['#ffffff', '#191624', 0.5]} />
      <directionalLight position={[3, 4, 5]} intensity={1.0} />
      <pointLight position={[-3.2, 0.8, 2.4]} intensity={10} distance={9} color="#FF5C9D" />
      <pointLight position={[3.2, -0.6, 2.6]} intensity={8} distance={8} color="#F2A900" />
      <Turntable>
        <ModelContent product={product} />
      </Turntable>
    </Canvas>
  );
}

function Product3D({ product }) {
  const box = useRef(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) {
        setLive(true);
        io.disconnect();
      }
    }, { rootMargin: '500px', threshold: 0.02 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="st-visual3d" ref={box}>
      {product.kind === 'tee'
        ? live
          ? <TeeVideo />
          : <ProductVisual product={product} />
        : live
          ? <ModelCanvas product={product} />
          : <ProductVisual product={product} />}
    </div>
  );
}

function ProductCard({ product, stylesCount, onOpen }) {
  return (
    <Reveal className="st-card">
      <button type="button" className="st-card-open" aria-label={`Open ${product.name} options`} onClick={onOpen}>
        <div className="st-card-media">
          <span className="st-card-glow" style={{ '--glow': product.color }}></span>
          <Product3D product={product} />
          {product.badge && <span className="st-card-badge">{product.badge}</span>}
          <span className="st-card-kind">{KIND_LABEL[product.kind]}</span>
        </div>
      </button>

      <div className="st-card-body" onClick={onOpen} role="button" tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}>
        <h4>{product.name}</h4>
        <p className="st-card-tagline">{product.tagline}</p>

        <div className="st-card-row">
          <span className="st-card-styles">
            {stylesCount} {stylesCount === 1 ? 'style' : 'styles'}{' '}
            <i aria-hidden="true">✦</i>
          </span>
          <span className="st-card-price">from {money(product.price)}</span>
        </div>

        <div className="st-card-foot">
          <button type="button" className="btn btn-primary st-add" onClick={onOpen}>
            Choose style →
          </button>
        </div>
      </div>
    </Reveal>
  );
}

function VariantModal({ kindLabel, products, selectedId, onSelect, onClose }) {
  const cart = useStoreCart();
  const product = products.find((p) => p.id === selectedId) || products[0];
  const [size, setSize] = useState(product.sizes?.[0] || '');
  const needsSize = product.kind === 'tee' || product.kind === 'cap';

  useEffect(() => {
    setSize(product.sizes?.[0] || '');
  }, [product.id, product.sizes]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const add = () => {
    if (product.price <= 0) return;
    cart.add(product.id, needsSize && product.sizes.length ? size : undefined);
    cart.setOpen(true);
    onClose();
  };

  return (
    <div className="st-modal" role="dialog" aria-modal="true" aria-label={kindLabel}>
      <div className="st-modal-backdrop" onClick={onClose} aria-hidden="true"></div>
      <div className="st-modal-panel">
        <button type="button" className="st-modal-x" aria-label="Close" onClick={onClose}>✕</button>

        <div className="st-modal-media">
          {product.kind === 'tee' ? <TeeVideo controls /> : <ModelCanvas product={product} />}
        </div>

        <div className="st-modal-body">
          <span className="st-modal-kicker">{kindLabel} · {KIND_LABEL[product.kind]}</span>
          <h3>{product.name}</h3>
          <p className="st-modal-tagline">{product.tagline}</p>

          <div className="st-modal-opts" role="group" aria-label="Choose style">
            {products.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`st-modal-opt ${p.id === product.id ? 'on' : ''}`}
                aria-pressed={p.id === product.id}
                onClick={() => onSelect(p.id)}
              >
                <span className="st-modal-dot" style={{ background: p.color }} />
                <span className="st-modal-opt-name">{p.colorName}</span>
                <b className="st-modal-opt-price">{money(p.price)}</b>
              </button>
            ))}
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

          <button type="button" className="btn btn-primary st-add" onClick={add}>
            Add to cart · {money(product.price)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductSections() {
  const sectionsRef = useRef(null);
  const [filter, setFilter] = useState('all');
  const [openKind, setOpenKind] = useState(null);
  const [selected, setSelected] = useState(() => {
    const map = {};
    CARD_KINDS.forEach(({ kind }) => {
      const first = productsForKind(kind)[0];
      map[kind] = first ? first.id : null;
    });
    return map;
  });

  /* the hero's "Shop …" buttons land here and pre-filter the grid */
  useEffect(() => {
    const onFilter = (e) => {
      if (e.detail) setFilter(e.detail);
    };
    window.addEventListener('store:filter', onFilter);
    return () => window.removeEventListener('store:filter', onFilter);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const big = sectionsRef.current?.querySelector('.st-big7');
      if (big) {
        gsap.fromTo(
          big,
          { yPercent: 30, opacity: 0.15 },
          {
            yPercent: -30,
            opacity: 0.05,
            ease: 'none',
            scrollTrigger: { trigger: sectionsRef.current, start: 'top bottom', end: 'bottom top', scrub: true }
          }
        );
      }
    }, sectionsRef);
    return () => ctx.revert();
  }, []);

  const visibleKinds = CARD_KINDS.filter((k) => filter === 'all' || k.kind === filter);

  const openCard = (kind) => setOpenKind(kind);
  const selectVariant = (kind, productId) => setSelected((s) => ({ ...s, [kind]: productId }));
  const activeKind = CARD_KINDS.find((k) => k.kind === openKind) || null;
  const activeProducts = activeKind ? productsForKind(activeKind.kind) : [];
  const activeSelected = activeKind ? selected[activeKind.kind] : null;

  return (
    <div className="st-sections" ref={sectionsRef}>
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

      <section className="st-section" id="shop">
        <span className="st-big7" aria-hidden="true">
          7
        </span>
        <div className="wrap">
          <div className="st-head">
            <div>
              <span className="st-tag">The full drop</span>
              <h2>Everything, in one place.</h2>
              <p className="st-sub">
                One card per category — tap a card to see every colourway and pick yours. Real 3D mockups, rotating on the page.
              </p>
            </div>
            <div className="st-shop-side">
              <div className="st-filters" role="group" aria-label="Filter products">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`st-filter ${filter === f.id ? 'on' : ''}`}
                    aria-pressed={filter === f.id}
                    onClick={() => setFilter(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <span className="st-count">
                {String(visibleKinds.length).padStart(2, '0')} {visibleKinds.length === 1 ? 'category' : 'categories'}
              </span>
            </div>
          </div>

          <div className={`st-grid ${filter !== 'all' ? 'anim' : ''}`} key={filter}>
            {visibleKinds.map(({ kind, label }) => {
              const products = productsForKind(kind);
              const sel = selected[kind];
              const product = products.find((p) => p.id === sel) || products[0];
              return (
                <ProductCard
                  key={kind}
                  product={product}
                  stylesCount={products.length}
                  onOpen={() => openCard(kind)}
                />
              );
            })}
          </div>
        </div>
      </section>

      {activeKind && (
        <VariantModal
          kindLabel={activeKind.label}
          products={activeProducts}
          selectedId={activeSelected}
          onSelect={(id) => selectVariant(activeKind.kind, id)}
          onClose={() => setOpenKind(null)}
        />
      )}
    </div>
  );
}