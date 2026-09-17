import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Reveal from '../components/ui/Reveal';
import IslandNav from '../components/island/IslandNav';
import CartOrb from '../components/island/CartOrb';
import StoreCartDrawer from '../components/store/CartDrawer';
import { useStoreCart } from '../context/useStoreCart';
import { VENDORS, VENDOR_SLOTS } from '../data/vendors';
import './vendors-landing.css';
import './store.css';

import pawsLogo from '../vendors/paws-nepal/media/paws-logo.webp';
import mannkaPhoto from '../vendors/mannka-creation/media/mannka-card.jpg';
import lumosPhoto from '../vendors/studiolumos/media/stickers.jpg';
import pustakCover from '../vendors/shankharapur-pustak-pasal/media/cover.jpg';

const PHOTOS = {
  'paws-nepal': pawsLogo,
  'mannka-creation': mannkaPhoto,
  'studio-lumos': lumosPhoto,
  'shankharapur-pustak-pasal': pustakCover
};

/* per-vendor accent — contrast colors used across spotlight, chips and cards */
const ACCENTS = {
  'paws-nepal': '#38D9C4',
  'mannka-creation': '#FF6BA9',
  'studio-lumos': '#FFD34D',
  'shankharapur-pustak-pasal': '#E8832A'
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/*
 * Permanent bottom-bar cart orb for the vendors landing page — same
 * store cart as /store (restored from localStorage), opening the same
 * drawer. Vendor shop pages don't render one, keeping their bar clean.
 */
function VendorsCartOrb() {
  const cart = useStoreCart();
  return <CartOrb count={cart.count} onOpen={() => cart.setOpen(true)} />;
}

/* ── 3D: soft glow orbs behind the headline ─────────────────────── */
function GlowOrb({ position, color, scale = 1, speed = 0.25 }) {
  const ref = useRef(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * speed + position[0] * 0.7) * 0.35;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[0.6, 20, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.14} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

function AmbientScene() {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 8], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.8]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <GlowOrb position={[-4.6, 1.8, -3]} color="#E11A6E" scale={1.5} speed={0.25} />
      <GlowOrb position={[4.8, 0.9, -3.4]} color="#F2A900" scale={1.9} speed={0.2} />
      <GlowOrb position={[0, 2.8, -5]} color="#4C4A8E" scale={2.4} speed={0.18} />
      <Sparkles count={140} scale={[12, 7, 9]} position={[0, 1.8, -1]} size={2.2} speed={0.3} opacity={0.45} color="#F6C453" />
    </Canvas>
  );
}

function HeroAmbient() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) {
        setOn(true);
        io.disconnect();
      }
    }, { threshold: 0.05 });
    io.observe(document.getElementById('vendors-hero'));
    return () => io.disconnect();
  }, []);
  return on ? <AmbientScene /> : null;
}

/* ── Small inline icons ────────────────────────────────────────── */
function IgIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.1" cy="6.9" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.5 3.9 5.6 3.9 9S14.6 18.5 12 21c-2.6-2.5-3.9-5.6-3.9-9S9.4 5.5 12 3z" />
    </svg>
  );
}

/* ── Why it matters ────────────────────────────────────────────── */
const REASONS = [
  {
    icon: '🏘️',
    title: 'Keep it local',
    desc: 'Money spent here stays in the Kathmandu Valley — with your neighbours.'
  },
  {
    icon: '🤝',
    title: 'Real relationships',
    desc: 'You are a regular, and behind the counter they know your name.'
  },
  {
    icon: '💙',
    title: 'Powered by Rotaract',
    desc: 'Your purchases carry forward Zone 7 service projects.'
  }
];

export default function VendorsLandingPage() {
  const [order, setOrder] = useState(() => shuffle(VENDORS));
  const [spotIdx, setSpotIdx] = useState(() => Math.floor(Math.random() * VENDORS.length));
  const [query, setQuery] = useState('');
  const [chip, setChip] = useState('All');
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const t = window.scrollY > 140;
      setStuck((prev) => (prev === t ? prev : t));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const CATEGORIES = useMemo(() => {
    const set = new Set();
    VENDORS.forEach((v) => v.category.split('·').forEach((c) => set.add(c.trim())));
    return [...set];
  }, []);

  useEffect(() => {
    document.title = 'Local Vendors — Zone 7 Vendors | Rotaract District 3292';
  }, []);

  const spotlight = order[spotIdx % Math.max(order.length, 1)];
  const q = query.trim().toLowerCase();
  const filtered = order.filter(
    (v) =>
      (chip === 'All' || v.category.includes(chip)) &&
      (!q || `${v.name} ${v.tagline} ${v.category} ${v.location} ${v.club}`.toLowerCase().includes(q))
  );

  const reshuffle = () => {
    setOrder(shuffle(VENDORS));
    setSpotIdx(Math.floor(Math.random() * VENDORS.length));
  };

  return (
    <div className="vl-page">
      <IslandNav current="vendors" context="Local Vendors" rack={<VendorsCartOrb />} />

      {/* ── HERO ── */}
      <header className="vl-hero" id="vendors-hero">
        <div className="vl-graph" aria-hidden="true"></div>
        <div className="vl-aurora a1"></div>
        <div className="vl-aurora a2"></div>
        <HeroAmbient />

        <div className="vl-hero-inner">
          <span className="vl-eyebrow">Zone 7 · Community first</span>
          <h1 className="vl-title">Support local.<br /><span className="vl-em">Grow together.</span></h1>
          <p className="vl-sub">
            Businesses from inside our district — pet care, flowers and more.
            Every purchase comes home to the community.
          </p>
          <div className="vl-cta-row">
            <a className="vl-btn vl-btn-gold" href="#vendors">Browse the shops ↓</a>
            <a className="vl-btn vl-btn-ghost" href="/store">Visit the store →</a>
          </div>

          <div className="vl-jump-row" role="navigation" aria-label="Jump to a shop">
            {order.map((v) => (
              <a className="vl-jump" key={v.id} href={`#shop-${v.id}`} style={{ '--acc': ACCENTS[v.id] }}>
                <span aria-hidden="true">{v.emoji}</span> {v.shortName}
              </a>
            ))}
          </div>

          <div className="vl-hero-stats">
            <span><b>{VENDORS.length}</b> local partner{VENDORS.length === 1 ? '' : 's'}</span>
            <span><b>Zone 7</b> Kathmandu Valley</span>
            <span><b>100%</b> community-first</span>
          </div>
        </div>
        <a className="vl-scroll-cue" href="#spotlight">Meet them <span className="vl-cue-arrow">↓</span></a>
      </header>

      {/* ── SPOTLIGHT ── */}
      {spotlight ? (
        <section className="vl-spot" id="spotlight">
          <div className="vl-wrap">
            <Reveal className="vl-spot-card" style={{ '--acc': ACCENTS[spotlight.id] }}>
              <div className={`vl-spot-media${spotlight.id === 'paws-nepal' ? ' fit' : ''}`}>
                <img src={PHOTOS[spotlight.id]} alt={spotlight.name} loading="eager" />
                <span className="vl-spot-emoji" aria-hidden="true">{spotlight.emoji}</span>
              </div>
              <div className="vl-spot-body">
                <span className="vl-spot-kicker">✨ Shop spotlight</span>
                <h2>{spotlight.name}</h2>
                <span className="vl-chip" style={{ '--acc': ACCENTS[spotlight.id] }}>{spotlight.category}</span>
                <p className="vl-spot-tag">{spotlight.tagline}</p>
                <p className="vl-spot-desc">{spotlight.desc}</p>
                <div className="vl-spot-meta">
                  <span className="vl-pin">📍 {spotlight.location}</span>
                  <span className="vl-club">{spotlight.club}</span>
                </div>
                <div className="vl-spot-actions">
                  <a className="vl-btn vl-btn-acc" href={spotlight.page}>Enter the shop →</a>
                  {spotlight.instagram ? (
                    <a className="vl-icon-btn" href={spotlight.instagram} target="_blank" rel="noreferrer" aria-label={`${spotlight.name} on Instagram`}><IgIcon /></a>
                  ) : null}
                  {spotlight.site && spotlight.site !== spotlight.instagram ? (
                    <a className="vl-icon-btn" href={spotlight.site} target="_blank" rel="noreferrer" aria-label={`${spotlight.name} website`}><GlobeIcon /></a>
                  ) : null}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* ── DIRECTORY ── */}
      <section className="vl-vendors" id="vendors">
        <div className="vl-wrap">
          <div className={`vl-toolbar${stuck ? ' compact' : ''}`}>
            <div className="vl-toolbar-top">
              <div className="vl-search">
                <span aria-hidden="true">🔍</span>
                <input
                  type="search"
                  placeholder="Search shops, categories, clubs…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search local vendors"
                />
              </div>
              <button type="button" className="vl-shuffle" onClick={reshuffle} aria-label="Shuffle the shops">
                🔀 Shuffle
              </button>
            </div>
            <div className="vl-chips" role="tablist" aria-label="Filter by category">
              <button type="button" className={`vl-chip-btn${chip === 'All' ? ' active' : ''}`} onClick={() => setChip('All')}>All</button>
              {CATEGORIES.map((c) => (
                <button type="button" key={c} className={`vl-chip-btn${chip === c ? ' active' : ''}`} onClick={() => setChip(c)}>{c}</button>
              ))}
              <span className="vl-count">{filtered.length} shop{filtered.length === 1 ? '' : 's'}</span>
            </div>
          </div>

          <div className="vl-vendor-grid">
            {filtered.map((v, i) => (
              <Reveal className="vl-card" key={`${v.id}-${i}`} delay={Math.min(i, 4) * 0.06}>
                <a className="vl-card-link" href={v.page} id={`shop-${v.id}`} style={{ '--acc': ACCENTS[v.id] }}>
                  <div className={`vl-card-media${v.id === 'paws-nepal' ? ' fit' : ''}`}>
                    <img src={PHOTOS[v.id]} alt={v.shortName} loading="lazy" />
                    <span className="vl-card-badge">{v.category}</span>
                    <span className="vl-card-emoji" aria-hidden="true">{v.emoji}</span>
                  </div>
                  <div className="vl-card-body">
                    <h3>{v.name}</h3>
                    <p className="vl-card-desc">{v.tagline}</p>
                    <div className="vl-card-meta">
                      <span className="vl-pin">📍 {v.location}</span>
                      <span className="vl-club">{v.club}</span>
                    </div>
                    <div className="vl-card-actions">
                      <span className="vl-more">Visit shop →</span>
                      <span className="vl-icon-row">
                        {v.instagram ? <span className="vl-icon-btn" aria-hidden="true"><IgIcon /></span> : null}
                        {v.site && v.site !== v.instagram ? <span className="vl-icon-btn" aria-hidden="true"><GlobeIcon /></span> : null}
                      </span>
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}

            {filtered.length === 0 ? (
              <Reveal className="vl-card vl-empty">
                <div className="vl-card-link">
                  <div className="vl-card-media">
                    <span className="vl-plus" aria-hidden="true">?</span>
                  </div>
                  <div className="vl-card-body">
                    <h3>No shops found</h3>
                    <p className="vl-card-desc">No shops found. Try a different word, or clear the filters.</p>
                    <div className="vl-card-meta">
                      <span className="vl-more" onClick={(e) => { e.preventDefault(); setQuery(''); setChip('All'); }}>Clear filters →</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ) : null}

            {Array.from({ length: VENDOR_SLOTS }).map((_, i) => (
              <Reveal className="vl-card ghost" key={`slot-${i}`} delay={(filtered.length + i) * 0.05}>
                <div className="vl-card-link">
                  <div className="vl-card-media">
                    <span className="vl-plus" aria-hidden="true">+</span>
                  </div>
                  <div className="vl-card-body">
                    <h3>Your business here</h3>
                    <p className="vl-card-desc">Run a shop, studio or service in Zone 7? Partner with the store.</p>
                    <div className="vl-card-meta">
                      <span className="vl-pin">Zone 7 · Kathmandu Valley</span>
                      <span className="vl-more">Coming soon</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY IT MATTERS ── */}
      <section className="vl-why">
        <div className="vl-wrap">
          <Reveal className="vl-center-head">
            <span className="vl-kicker">Why it matters</span>
            <h2>Small shops, big neighbourhood.</h2>
            <p>Buying local makes your money mean something.</p>
          </Reveal>
          <div className="vl-why-grid">
            {REASONS.map((r, i) => (
              <Reveal className="vl-why-card" key={r.title} delay={i * 0.07}>
                <span className="vl-why-icon" aria-hidden="true">{r.icon}</span>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNER BAND ── */}
      <section className="vl-partner">
        <div className="vl-graph" aria-hidden="true"></div>
        <div className="vl-aurora a3"></div>
        <Reveal className="vl-partner-inner">
          <span className="vl-partner-mark" aria-hidden="true">✦</span>
          <h2>Run a shop, studio or service in Zone 7?</h2>
          <p>Partner with the store and get your own page.</p>
          <a className="vl-btn vl-btn-gold" href="/store">Say hello via the store →</a>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="vl-footer">
        <div className="vl-wrap vl-footer-inner">
          <span><span className="vl-dot">✦</span> Local Vendors · Zone 7</span>
          <span>A Rotaract District 3292 initiative · Kathmandu, Nepal</span>
          <span><a href="/store">Store</a> · <a href="/">Home</a> · Rotaract District 3292</span>
        </div>
      </footer>
      <StoreCartDrawer />
    </div>
  );
}