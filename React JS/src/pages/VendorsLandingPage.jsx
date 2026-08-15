import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Reveal from '../components/ui/Reveal';
import IslandNav from '../components/island/IslandNav';
import { VENDORS, VENDOR_SLOTS } from '../data/vendors';
import './vendors-landing.css';

import pawsPhoto from '../vendors/paws-nepal/media/dog-01.jpg';
import mannkaPhoto from '../vendors/mannka-creation/media/photo-1.jpg';

const PHOTOS = {
  'paws-nepal': pawsPhoto,
  'mannka-creation': mannkaPhoto
};

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
      <GlowOrb position={[0, 2.8, -5]} color="#1B1836" scale={2.4} speed={0.18} />
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

/* ── Marquee ticker ────────────────────────────────────────────── */
const TICKER = [
  'Support local', 'PAWS — Play & Stay', 'Mannka Creations', 'Pet boarding & day care',
  'Fresh flowers', 'Kathmandu', 'Community first', 'Every purchase gives back'
];

function Ticker() {
  const row = [...TICKER, ...TICKER];
  return (
    <div className="vl-ticker" aria-hidden="true">
      <div className="vl-ticker-track">
        {row.map((t, i) => (
          <span className="vl-ticker-item" key={i}><span className="vl-dot">✦</span> {t}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Why it matters ────────────────────────────────────────────── */
const REASONS = [
  {
    icon: '🏘️',
    title: 'Keep it local',
    desc: 'Every rupee spent with a Zone 7 business stays in the Kathmandu Valley — in the hands of your neighbours.'
  },
  {
    icon: '🤝',
    title: 'Real relationships',
    desc: 'You are not a ticket number. You are a regular — and the person behind the counter knows your name.'
  },
  {
    icon: '💙',
    title: 'Powered by Rotaract',
    desc: 'These vendors are partners of the district store. Your purchases help carry forward Zone 7 service projects.'
  }
];

export default function VendorsLandingPage() {
  useEffect(() => {
    document.title = 'Local Vendors — Zone 7 Vendors | Rotaract District 3292';
  }, []);

  return (
    <div className="vl-page">
      <IslandNav current="vendors" context="Local Vendors" />

      {/* ── HERO ── */}
      <header className="vl-hero" id="vendors-hero">
        <div className="vl-aurora a1"></div>
        <div className="vl-aurora a2"></div>
        <HeroAmbient />

        <div className="vl-hero-inner">
          <span className="vl-eyebrow">Zone 7 · Community first</span>
          <h1 className="vl-title">Support local.<br /><span className="vl-em">Grow together.</span></h1>
          <p className="vl-sub">
            The Zone 7 store is powered by businesses from right inside our district —
            pet care, fresh flowers and more. Shop with them, and every purchase comes
            home to the community.
          </p>
          <div className="vl-cta-row">
            <a className="vl-btn vl-btn-dark" href="#vendors">Browse the vendors ↓</a>
            <a className="vl-btn vl-btn-ghost" href="/store">Visit the store →</a>
          </div>
          <div className="vl-hero-stats">
            <span><b>{VENDORS.length}</b> local partner{VENDORS.length === 1 ? '' : 's'}</span>
            <span><b>Zone 7</b> Kathmandu Valley</span>
            <span><b>100%</b> community-first</span>
          </div>
        </div>
        <a className="vl-scroll-cue" href="#vendors">Meet them <span className="vl-cue-arrow">↓</span></a>
      </header>

      <Ticker />

      {/* ── VENDORS GRID ── */}
      <section className="vl-vendors" id="vendors">
        <div className="vl-wrap">
          <Reveal className="vl-center-head">
            <span className="vl-kicker">Our local vendors</span>
            <h2>The businesses building Zone 7.</h2>
            <p>Each vendor has its own page — their story, their craft and the good work your purchase helps carry forward.</p>
          </Reveal>

          <div className="vl-vendor-grid">
            {VENDORS.map((v, i) => (
              <Reveal className="vl-card" key={v.id} delay={i * 0.08}>
                <a className="vl-card-link" href={v.page}>
                  <div className="vl-card-media">
                    <img src={PHOTOS[v.id]} alt={v.shortName} loading="lazy" />
                    <span className="vl-card-badge">{v.category}</span>
                    <span className="vl-card-emoji" aria-hidden="true">{v.emoji}</span>
                  </div>
                  <div className="vl-card-body">
                    <h3>{v.name}</h3>
                    <p className="vl-card-desc">{v.tagline}</p>
                    <div className="vl-card-meta">
                      <span className="vl-pin">📍 {v.location}</span>
                      <span className="vl-more">Visit vendor →</span>
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}

            {Array.from({ length: VENDOR_SLOTS }).map((_, i) => (
              <Reveal className="vl-card ghost" key={`slot-${i}`} delay={(VENDORS.length + i) * 0.08}>
                <div className="vl-card-link">
                  <div className="vl-card-media">
                    <span className="vl-plus" aria-hidden="true">+</span>
                  </div>
                  <div className="vl-card-body">
                    <h3>Your business here</h3>
                    <p className="vl-card-desc">Run a shop, studio or service in Zone 7? Partner with the store and get your own page.</p>
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
            <span className="vl-kicker light">Why it matters</span>
            <h2>Small shops, big neighbourhood.</h2>
            <p>Buying local is the easiest way to make your money mean something.</p>
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
        <div className="vl-aurora a3"></div>
        <Reveal className="vl-partner-inner">
          <span className="vl-partner-mark" aria-hidden="true">✦</span>
          <h2>Run a shop, studio or service in Zone 7?</h2>
          <p>Partner with the store and get your own page — story, photos, video and a direct line to the community.</p>
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
    </div>
  );
}