import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Reveal from '../components/ui/Reveal';
import IslandNav from '../components/island/IslandNav';
import { VENDORS } from '../data/vendors';
import './vendor-paws-nepal.css';

import dog1 from '../vendors/paws-nepal/hero/dog-1.png';
import dog2 from '../vendors/paws-nepal/hero/dog-2.png';
import dog3 from '../vendors/paws-nepal/hero/dog-3.png';
import dog4 from '../vendors/paws-nepal/hero/dog-4.png';
import dog5 from '../vendors/paws-nepal/hero/dog-5.png';

import dog09 from '../vendors/paws-nepal/media/dog-09.jpg';
import dog10 from '../vendors/paws-nepal/media/dog-10.jpg';
import dog11 from '../vendors/paws-nepal/media/dog-11.jpg';
import dog12 from '../vendors/paws-nepal/media/dog-12.jpg';
import dog01 from '../vendors/paws-nepal/media/dog-01.jpg';
import dog02 from '../vendors/paws-nepal/media/dog-02.jpg';
import dog03 from '../vendors/paws-nepal/media/dog-03.jpg';
import dog04 from '../vendors/paws-nepal/media/dog-04.jpg';
import dog05 from '../vendors/paws-nepal/media/dog-05.jpg';
import dog06 from '../vendors/paws-nepal/media/dog-06.jpg';
import dog07 from '../vendors/paws-nepal/media/dog-07.jpg';
import dog08 from '../vendors/paws-nepal/media/dog-08.jpg';

const VENDOR = VENDORS[0];

/* ── 3D: soft glow orbs drifting behind the pup ─────────────────── */
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

/* ── 3D: ghost paw prints floating in the dark ──────────────────── */
function PawPrint({ position, scale = 1, rotation = [0, 0, 0], color = '#F2A900', opacity = 0.3 }) {
  const ref = useRef(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.6 + position[0] * 2) * 0.22;
    ref.current.rotation.y += 0.003;
  });
  const m = (color) => ({ color, transparent: true, opacity, emissive: color, emissiveIntensity: 0.4 });
  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.42, 12, 10]} />
        <meshStandardMaterial {...m(color)} />
      </mesh>
      <mesh position={[-0.26, 0, -0.52]}>
        <sphereGeometry args={[0.15, 10, 8]} />
        <meshStandardMaterial {...m(color)} />
      </mesh>
      <mesh position={[-0.09, 0, -0.72]}>
        <sphereGeometry args={[0.15, 10, 8]} />
        <meshStandardMaterial {...m(color)} />
      </mesh>
      <mesh position={[0.09, 0, -0.72]}>
        <sphereGeometry args={[0.15, 10, 8]} />
        <meshStandardMaterial {...m(color)} />
      </mesh>
      <mesh position={[0.26, 0, -0.52]}>
        <sphereGeometry args={[0.15, 10, 8]} />
        <meshStandardMaterial {...m(color)} />
      </mesh>
      <mesh position={[0, 0.06, -0.12]} scale={[0.9, 0.5, 1.5]}>
        <sphereGeometry args={[0.34, 12, 10]} />
        <meshStandardMaterial {...m(color)} />
      </mesh>
    </group>
  );
}

function PawField() {
  const paws = [
    { position: [-4.4, 2.2, -3], scale: 1.15, color: '#F2A900' },
    { position: [-1.6, 0.6, -3.8], scale: 0.8, color: '#E11A6E' },
    { position: [2.2, 2.4, -3.2], scale: 1.3, color: '#F2A900' },
    { position: [4.9, 0.7, -3.9], scale: 0.9, color: '#E11A6E' },
    { position: [-2.6, -0.9, -5.2], scale: 1.25, color: '#F2A900' },
    { position: [0.4, -0.7, -5.4], scale: 1.0, color: '#E11A6E' },
    { position: [3.6, 2.6, -5.6], scale: 0.72, color: '#F2A900' },
    { position: [5.8, -0.4, -5.2], scale: 0.8, color: '#E11A6E' }
  ];
  return (
    <group>
      {paws.map((p, i) => (
        <PawPrint key={i} {...p} />
      ))}
    </group>
  );
}

/* ── 3D: ambient backdrop — orbs, ghost paws, golden dust ──────── */
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
      <GlowOrb position={[0, 2.8, -5]} color="#6C5CE7" scale={2.4} speed={0.18} />
      <PawField />
      <Sparkles count={120} scale={[12, 7, 9]} position={[0, 1.8, -1]} size={2.2} speed={0.3} opacity={0.45} color="#F6C453" />
    </Canvas>
  );
}

/* ── hero pack: real dog cutouts, floating & interactive ────────── */
const PACK = [dog1, dog2, dog3, dog4, dog5];

function RealDogPack({ onPet }) {
  const [idx, setIdx] = useState(0);
  const [pop, setPop] = useState(0);

  useEffect(() => {
    if (!pop) return;
    const t = setTimeout(() => setPop(0), 900);
    return () => clearTimeout(t);
  }, [pop]);

  const pet = () => {
    setIdx((i) => (i + 1) % PACK.length);
    setPop((p) => p + 1);
    if (onPet) onPet();
  };

  const backA = PACK[(idx + 2) % PACK.length];
  const backB = PACK[(idx + 4) % PACK.length];

  return (
    <div className="vp-dog-float">
      <span className="vp-dog-spark s1" aria-hidden="true">✦</span>
      <span className="vp-dog-spark s2" aria-hidden="true">✧</span>
      <span className="vp-dog-spark s3" aria-hidden="true">★</span>

      {pop > 0 && (
        <span className="vp-dog-hearts" key={pop} aria-hidden="true">
          <i className="vh1">♥</i>
          <i className="vh2">♥</i>
          <i className="vh3">✦</i>
        </span>
      )}

      <div className="vp-pack">
        <img src={backA} alt="" aria-hidden="true" className="vp-dog-back back-a" draggable="false" />
        <img src={backB} alt="" aria-hidden="true" className="vp-dog-back back-b" draggable="false" />
        <button type="button" className="vp-dog-hit" onClick={pet} aria-label="Meet the next PAWS dog" title="tap for the next pup">
          <img
            key={idx}
            src={PACK[idx]}
            alt="A happy PAWS dog, ready for a stay"
            className={`vp-dog-photo${pop ? ' pop' : ''}`}
            draggable="false"
          />
        </button>
      </div>

      <span className="vp-dog-badge">🐾 PAWS approved</span>
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
  'Day care', 'Sleepover', 'Short stays', 'Long stays',
  'A home away from home', 'Play & Stay', 'Kathmandu', 'Wag more, worry less'
];

function Ticker() {
  const row = [...TICKER, ...TICKER];
  return (
    <div className="vp-ticker" aria-hidden="true">
      <div className="vp-ticker-track">
        {row.map((t, i) => (
          <span className="vp-ticker-item" key={i}><span className="vp-paw">🐾</span> {t}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Sections ──────────────────────────────────────────────────── */
const SERVICES = [
  {
    icon: '🏡',
    title: 'Day care',
    desc: 'Drop your pup off for the day — playtime, naps and company while you work, travel or run errands.'
  },
  {
    icon: '🌙',
    title: 'Sleepover',
    desc: 'A cosy night away from home with bedtime routines, morning walks and someone who checks on them all night.'
  },
  {
    icon: '📅',
    title: 'Short stays',
    desc: 'Weekends away, holidays and quick trips — your pet gets a mini-vacation of their own.'
  },
  {
    icon: '🧳',
    title: 'Long stays',
    desc: 'Extended care for months away or life transitions — stability, routine and plenty of love.'
  }
];

const GALLERY = [
  { img: dog09, span: 'tall' },
  { img: dog01, span: '' },
  { img: dog02, span: '' },
  { img: dog11, span: 'wide' },
  { img: dog03, span: '' },
  { img: dog04, span: 'tall' },
  { img: dog05, span: '' },
  { img: dog12, span: 'wide' },
  { img: dog06, span: '' },
  { img: dog10, span: 'tall' },
  { img: dog07, span: '' },
  { img: dog08, span: '' }
];

export default function VendorPage() {
  const [bark, setBark] = useState(0);
  useEffect(() => {
    document.title = 'PAWS — Play & Stay | Zone 7 Local Vendor';
  }, []);

  const petPup = () => setBark((b) => b + 1);

  return (
    <div className="vp-page">
      <IslandNav current="vendor" context="PAWS — Play & Stay" />
      {/* ── HERO ── */}
      <header className="vp-hero" id="vendor-hero">
        <div className="vp-aurora a1"></div>
        <div className="vp-aurora a2"></div>
        <HeroAmbient />
        {bark > 0 && (
          <div className="vp-bark" key={bark} role="status">Woof! <span className="vp-bark-heart">♥</span></div>
        )}

        <div className="vp-hero-frame">
          <div className="vp-hero-copy">
            <span className="vp-eyebrow">Zone 7 · Local Vendor</span>
            <h1 className="vp-title">PAWS <span className="vp-em">— Play &amp; Stay</span></h1>
            <p className="vp-tagline">
              A home away from home for your four-legged family.
              <br />Pet boarding &amp; day care in Kathmandu.
            </p>
            <div className="vp-cta-row">
              <a className="vp-btn vp-btn-gold" href={VENDOR.site} target="_blank" rel="noreferrer">Visit pawsnepal.com →</a>
              <a className="vp-btn vp-btn-glass" href={VENDOR.instagram} target="_blank" rel="noreferrer">Follow @pawsnepal</a>
            </div>
          </div>

          <div className="vp-dog-stage">
            <RealDogPack onPet={petPup} />
          </div>
        </div>

        <div className="vp-pup-hint">🐾 tap the pup</div>
        <a className="vp-scroll-cue" href="#story">Meet the pack <span className="vp-cue-arrow">↓</span></a>
      </header>

      <Ticker />

      {/* ── STORY ── */}
      <section className="vp-story" id="story">
        <div className="vp-wrap vp-story-grid">
          <Reveal className="vp-story-copy">
            <span className="vp-kicker">Why Paws</span>
            <h2>The dogs make the house a home.</h2>
            <p>
              When you leave town, someone has to keep the routines, the walks and the
              treats flowing. PAWS — Play &amp; Stay exists for exactly that: a clean,
              quiet and comfortable second home where your pet is the guest of honour.
            </p>
            <p>
              Every stay is built around your pet's rhythm — feeding times, nap spots,
              favourite toys and a soft bed that smells like them. No cages, no crowds,
              no stress. Just a house full of tails that won't stop wagging.
            </p>
            <div className="vp-chips">
              <span className="vp-chip">24/7 care</span>
              <span className="vp-chip">Daily walks</span>
              <span className="vp-chip">Owner updates</span>
              <span className="vp-chip">Clean &amp; quiet</span>
            </div>
          </Reveal>
          <Reveal className="vp-story-media" delay={0.12}>
            <img src={dog01} alt="A happy dog enjoying life" loading="lazy" />
            <img className="vp-stacked" src={dog10} alt="A dog at PAWS" loading="lazy" />
          </Reveal>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="vp-services">
        <div className="vp-wrap">
          <Reveal className="vp-center-head">
            <span className="vp-kicker light">Stays &amp; care</span>
            <h2>Every kind of stay, one kind of love.</h2>
            <p>From a single day to a season away — each stay is tailored to your pet.</p>
          </Reveal>
          <div className="vp-service-grid">
            {SERVICES.map((s, i) => (
              <Reveal className="vp-service-card" key={s.title} delay={i * 0.07}>
                <span className="vp-service-icon" aria-hidden="true">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <a className="vp-service-link" href={VENDOR.site} target="_blank" rel="noreferrer">Book this stay →</a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE LIFE OF DOGS ── */}
      <section className="vp-life">
        <div className="vp-wrap">
          <Reveal className="vp-center-head">
            <span className="vp-kicker">The life of dogs</span>
            <h2>They eat. They play. They sleep like royalty.</h2>
            <p>A glimpse of the everyday at PAWS — naps in sunbeams, zoomies in the yard and dinner-time chaos.</p>
          </Reveal>
        </div>
        <div className="vp-gallery">
          {GALLERY.map((g, i) => (
            <Reveal className={`vp-cell ${g.span || ''}`} key={i} delay={(i % 4) * 0.05}>
              {g.video ? (
                <video src={g.video} muted loop playsInline autoPlay preload="metadata" aria-label="Video of a dog at PAWS" />
              ) : (
                <img src={g.img} alt="A dog living its best life at PAWS" loading="lazy" />
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section className="vp-quote">
        <div className="vp-aurora a3"></div>
        <Reveal className="vp-quote-inner">
          <span className="vp-quote-mark" aria-hidden="true">“</span>
          <p className="vp-quote-text">
            Every guest arrives with a story — and leaves as family.
          </p>
          <span className="vp-quote-by">— The pack at PAWS, Play &amp; Stay</span>
        </Reveal>
      </section>

      {/* ── CTA ── */}
      <section className="vp-cta">
        <div className="vp-wrap vp-cta-inner">
          <Reveal>
            <span className="vp-kicker">Book a stay</span>
            <h2>Planning a trip?<br />Your pup's holiday starts here.</h2>
            <p>Reach out to PAWS directly to check availability and book your pet's home away from home.</p>
            <div className="vp-cta-row">
              <a className="vp-btn vp-btn-gold" href={VENDOR.site} target="_blank" rel="noreferrer">Visit pawsnepal.com →</a>
              <a className="vp-btn vp-btn-dark" href={VENDOR.instagram} target="_blank" rel="noreferrer">Follow @pawsnepal</a>
            </div>
          </Reveal>
          <a className="vp-store-link" href="/store">← Back to the Zone 7 Store</a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="vp-footer">
        <div className="vp-wrap vp-footer-inner">
          <span><span className="vp-paw">🐾</span> {VENDOR.name}</span>
          <span>Pet boarding &amp; day care · Kathmandu, Nepal</span>
          <span>A <a href="/store">Zone 7 Local Vendor</a> · <a href="/">Home</a> · Rotaract District 3292</span>
        </div>
      </footer>
    </div>
  );
}
