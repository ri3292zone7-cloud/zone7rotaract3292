import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Reveal from '../components/ui/Reveal';
import IslandNav from '../components/island/IslandNav';
import { VENDORS } from '../data/vendors';
import './vendor-mannka.css';

import photo1 from '../vendors/mannka-creation/media/photo-1.jpg';
import photo2 from '../vendors/mannka-creation/media/photo-2.jpg';
import vid1 from '../vendors/mannka-creation/media/video-1.mp4';
import vid2 from '../vendors/mannka-creation/media/video-2.mp4';

const VENDOR = VENDORS.find((v) => v.id === 'mannka-creation') || VENDORS[0];

/* ── 3D: soft glow orbs drifting behind the blooms ───────────────── */
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

/* ── 3D: ghost petals floating in the dark ──────────────────────── */
const PETAL_COLORS = ['#E11A6E', '#F2A900', '#F7C8D8', '#A80F52', '#F4A9B8'];

function Petal({ position, scale = 1, color = '#E11A6E', opacity = 0.35, spin = 0.004 }) {
  const ref = useRef(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.55 + position[0] * 2) * 0.28;
    ref.current.rotation.y += spin;
    ref.current.rotation.x += spin * 0.6;
  });
  return (
    <group ref={ref} position={position} rotation={[0.5, 0, 0.4]} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.34, 14, 12]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} emissive={color} emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0.22, 0, 0.18]} scale={0.55}>
        <sphereGeometry args={[0.34, 14, 12]} />
        <meshStandardMaterial color={color} transparent opacity={opacity * 0.8} emissive={color} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function PetalField() {
  const petals = [
    { position: [-4.5, 2.0, -3], scale: 1.1, color: PETAL_COLORS[0] },
    { position: [-1.7, 0.7, -3.8], scale: 0.75, color: PETAL_COLORS[1] },
    { position: [2.1, 2.5, -3.1], scale: 1.25, color: PETAL_COLORS[2] },
    { position: [4.8, 0.6, -3.9], scale: 0.85, color: PETAL_COLORS[3] },
    { position: [-2.7, -0.9, -5.1], scale: 1.2, color: PETAL_COLORS[4] },
    { position: [0.5, -0.8, -5.4], scale: 0.95, color: PETAL_COLORS[0] },
    { position: [3.7, 2.7, -5.5], scale: 0.7, color: PETAL_COLORS[1] },
    { position: [5.9, -0.5, -5.2], scale: 0.8, color: PETAL_COLORS[2] }
  ];
  return (
    <group>
      {petals.map((p, i) => (
        <Petal key={i} {...p} />
      ))}
    </group>
  );
}

/* ── 3D: ambient backdrop — orbs, petals, golden dust ────────────── */
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
      <GlowOrb position={[0, 2.8, -5]} color="#A80F52" scale={2.4} speed={0.18} />
      <PetalField />
      <Sparkles count={120} scale={[12, 7, 9]} position={[0, 1.8, -1]} size={2.2} speed={0.3} opacity={0.45} color="#F6C453" />
    </Canvas>
  );
}

/* ── Hero bloom frame: looping bouquet video + petals ───────────── */
function BloomFrame() {
  const [pop, setPop] = useState(0);

  useEffect(() => {
    if (!pop) return;
    const t = setTimeout(() => setPop(0), 900);
    return () => clearTimeout(t);
  }, [pop]);

  return (
    <div className="vm-bloom">
      <span className="vm-bloom-spark s1" aria-hidden="true">✦</span>
      <span className="vm-bloom-spark s2" aria-hidden="true">✧</span>
      <span className="vm-bloom-spark s3" aria-hidden="true">❀</span>

      {pop > 0 && (
        <span className="vm-bloom-hearts" key={pop} aria-hidden="true">
          <i className="vh1">🌸</i>
          <i className="vh2">💮</i>
          <i className="vh3">✦</i>
        </span>
      )}

      <button type="button" className="vm-frame-hit" onClick={() => setPop((p) => p + 1)} aria-label="Send a little bloom" title="tap to bloom">
        <video
          key={pop}
          src={vid1}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          className={`vm-frame-video${pop ? ' pop' : ''}`}
        />
      </button>

      <span className="vm-bloom-badge">🌸 Hand-wrapped with love</span>
    </div>
  );
}

/* ── Lazy ambient canvas (mounts only when the hero is visible) ─── */
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
    io.observe(document.getElementById('vendor-hero'));
    return () => io.disconnect();
  }, []);
  return on ? <AmbientScene /> : null;
}

/* ── Marquee ticker ────────────────────────────────────────────── */
const TICKER = [
  'Fresh flowers', 'Hand-wrapped bouquets', 'Gift wraps', 'Event florals',
  'Weddings & birthdays', 'Kathmandu', 'Every stem has a story', 'Made with love'
];

function Ticker() {
  const row = [...TICKER, ...TICKER];
  return (
    <div className="vm-ticker" aria-hidden="true">
      <div className="vm-ticker-track">
        {row.map((t, i) => (
          <span className="vm-ticker-item" key={i}><span className="vm-flower">🌸</span> {t}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Sections ──────────────────────────────────────────────────── */
const CRAFTS = [
  {
    icon: '💐',
    title: 'Bouquets & hand-ties',
    desc: 'Fresh stems wrapped by hand — for anniversaries, apologies, first dates and every I love you in between.'
  },
  {
    icon: '🎀',
    title: 'Gift wrapping',
    desc: 'A gift that arrives wrapped like a present should — ribbons, paper and petals in the right places.'
  },
  {
    icon: '🎉',
    title: 'Event & wedding florals',
    desc: 'Bridal bouquets, table florals and venue blooms that turn a day into a memory.'
  },
  {
    icon: '🏡',
    title: 'Home & office blooms',
    desc: 'Regular fresh flowers for your desk, doorway or dining table — a little life, delivered.'
  }
];

const GALLERY = [
  { video: vid1, span: 'wide' },
  { img: photo1, span: 'tall' },
  { img: photo2, span: '' },
  { video: vid2, span: 'wide' }
];

export default function MannkaPage() {
  useEffect(() => {
    document.title = 'Mannka Creations | Zone 7 Local Vendor';
  }, []);

  return (
    <div className="vm-page">
      <IslandNav current="vendor" context="Mannka Creations" />
      {/* ── HERO ── */}
      <header className="vm-hero" id="vendor-hero">
        <div className="vm-aurora a1"></div>
        <div className="vm-aurora a2"></div>
        <HeroAmbient />

        <div className="vm-hero-frame">
          <div className="vm-hero-copy">
            <span className="vm-eyebrow">Zone 7 · Local Vendor</span>
            <h1 className="vm-title">Mannka <span className="vm-em">Creations</span></h1>
            <p className="vm-tagline">
              Fresh flowers, hand-wrapped with heart.
              <br />Bouquets, gift wraps &amp; event florals in Kathmandu.
            </p>
            <div className="vm-cta-row">
              <a className="vm-btn vm-btn-rose" href={VENDOR.instagram} target="_blank" rel="noreferrer">Follow @mannka_creation →</a>
              <a className="vm-btn vm-btn-glass" href="/vendors">Meet more local vendors</a>
            </div>
          </div>

          <div className="vm-bloom-stage">
            <BloomFrame />
          </div>
        </div>

        <div className="vm-bloom-hint">🌸 tap the bouquet</div>
        <a className="vm-scroll-cue" href="#story">The story <span className="vm-cue-arrow">↓</span></a>
      </header>

      <Ticker />

      {/* ── STORY ── */}
      <section className="vm-story" id="story">
        <div className="vm-wrap vm-story-grid">
          <Reveal className="vm-story-copy">
            <span className="vm-kicker">Why Mannka</span>
            <h2>Every stem has a story.</h2>
            <p>
              Flowers are the shortest way to say the big things — congratulations,
              thank you, I'm sorry, I'm thinking of you. Mannka Creations exists to
              hand you that feeling, wrapped and ready.
            </p>
            <p>
              Each bouquet is built fresh, by hand, around the moment it is for.
              The right stems, the right colours, the right words on the card —
              the little details that make a gift feel like it came from the heart.
            </p>
            <div className="vm-chips">
              <span className="vm-chip">Fresh stems</span>
              <span className="vm-chip">Hand-wrapped</span>
              <span className="vm-chip">Same-day orders</span>
              <span className="vm-chip">All occasions</span>
            </div>
          </Reveal>
          <Reveal className="vm-story-media" delay={0.12}>
            <img src={photo2} alt="A Mannka Creations flower arrangement" loading="lazy" />
            <img className="vm-stacked" src={photo1} alt="A fresh bouquet from Mannka Creations" loading="lazy" />
          </Reveal>
        </div>
      </section>

      {/* ── CRAFTS ── */}
      <section className="vm-services">
        <div className="vm-wrap">
          <Reveal className="vm-center-head">
            <span className="vm-kicker light">What we craft</span>
            <h2>From a single stem to the whole table.</h2>
            <p>Whatever the occasion, there is a bloom for it — made the way it should be.</p>
          </Reveal>
          <div className="vm-service-grid">
            {CRAFTS.map((s, i) => (
              <Reveal className="vm-service-card" key={s.title} delay={i * 0.07}>
                <span className="vm-service-icon" aria-hidden="true">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <a className="vm-service-link" href={VENDOR.instagram} target="_blank" rel="noreferrer">Ask for this →</a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="vm-life">
        <div className="vm-wrap">
          <Reveal className="vm-center-head">
            <span className="vm-kicker">Fresh from the studio</span>
            <h2>Blooms, straight from the hands that made them.</h2>
            <p>A peek inside Mannka Creations — stems being picked, wrapped and handed over.</p>
          </Reveal>
        </div>
        <div className="vm-gallery">
          {GALLERY.map((g, i) => (
            <Reveal className={`vm-cell ${g.span || ''}`} key={i} delay={(i % 4) * 0.05}>
              {g.video ? (
                <video src={g.video} muted loop playsInline autoPlay preload="metadata" aria-label="Video of flowers being arranged at Mannka Creations" />
              ) : (
                <img src={g.img} alt="A flower arrangement from Mannka Creations" loading="lazy" />
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section className="vm-quote">
        <div className="vm-aurora a3"></div>
        <Reveal className="vm-quote-inner">
          <span className="vm-quote-mark" aria-hidden="true">“</span>
          <p className="vm-quote-text">
            Flowers say what words can't — we just hand them to you.
          </p>
          <span className="vm-quote-by">— Mannka Creations</span>
        </Reveal>
      </section>

      {/* ── CTA ── */}
      <section className="vm-cta">
        <div className="vm-wrap vm-cta-inner">
          <Reveal>
            <span className="vm-kicker">Order flowers</span>
            <h2>Got a moment worth<br />celebrating? Start with a bloom.</h2>
            <p>Message Mannka Creations directly to order, customise or ask what's fresh this week.</p>
            <div className="vm-cta-row">
              <a className="vm-btn vm-btn-rose" href={VENDOR.instagram} target="_blank" rel="noreferrer">Follow @mannka_creation</a>
              <a className="vm-btn vm-btn-dark" href="/vendors">Meet more local vendors</a>
            </div>
          </Reveal>
          <a className="vm-store-link" href="/store">← Back to the Zone 7 Store</a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="vm-footer">
        <div className="vm-wrap vm-footer-inner">
          <span><span className="vm-flower">🌸</span> {VENDOR.name}</span>
          <span>Fresh flowers · Gifts · Kathmandu, Nepal</span>
          <span>A <a href="/vendors">Zone 7 Local Vendor</a> · <a href="/">Home</a> · Rotaract District 3292</span>
        </div>
      </footer>
    </div>
  );
}