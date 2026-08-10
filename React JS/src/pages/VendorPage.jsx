import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import Reveal from '../components/ui/Reveal';
import IslandNav from '../components/island/IslandNav';
import { VENDORS } from '../data/vendors';
import './vendor-paws-nepal.css';

import img1 from '../vendors/paws-nepal/media/1.jpg';
import img2 from '../vendors/paws-nepal/media/2.jpg';
import vid1 from '../vendors/paws-nepal/media/1.mp4';
import vid2 from '../vendors/paws-nepal/media/2.mp4';
import dog01 from '../vendors/paws-nepal/media/dog-01.jpg';
import dog02 from '../vendors/paws-nepal/media/dog-02.jpg';
import dog03 from '../vendors/paws-nepal/media/dog-03.jpg';
import dog04 from '../vendors/paws-nepal/media/dog-04.jpg';
import dog05 from '../vendors/paws-nepal/media/dog-05.jpg';
import dog06 from '../vendors/paws-nepal/media/dog-06.jpg';
import dog07 from '../vendors/paws-nepal/media/dog-07.jpg';
import dog08 from '../vendors/paws-nepal/media/dog-08.jpg';

const VENDOR = VENDORS[0];

/* ── 3D: a field of gently floating paw prints ─────────────────── */
function PawPrint({ position, scale = 1, rotation = [0, 0, 0], color = '#F2A900', opacity = 0.35 }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.42, 12, 10]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} emissive={color} emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[-0.26, 0, -0.52]}>
        <sphereGeometry args={[0.15, 10, 8]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} emissive={color} emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[-0.09, 0, -0.72]}>
        <sphereGeometry args={[0.15, 10, 8]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} emissive={color} emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0.09, 0, -0.72]}>
        <sphereGeometry args={[0.15, 10, 8]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} emissive={color} emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0.26, 0, -0.52]}>
        <sphereGeometry args={[0.15, 10, 8]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} emissive={color} emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0, 0.06, -0.12]} scale={[0.9, 0.6, 1.5]}>
        <sphereGeometry args={[0.34, 12, 10]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} emissive={color} emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

/* ── 3D: the PAWS pup — sitting on his disc, wagging for attention ── */
const FUR = '#E3B07C';
const FUR_DARK = '#C98F4E';
const CREAM = '#FFF3DC';
const PUP_INK = '#231E38';

function HeroDog({ onPet }) {
  const root = useRef(null);
  const tail = useRef(null);
  const earL = useRef(null);
  const earR = useRef(null);
  const bounce = useRef(0);

  const pet = (e) => {
    e.stopPropagation();
    bounce.current = 1;
    if (onPet) onPet();
  };

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (!root.current) return;
    bounce.current = Math.max(0, bounce.current - dt * 0.25);
    const b = bounce.current;
    const hop = Math.abs(Math.sin(t * 9)) * b * 0.55;
    const s = Math.min(1, Math.max(0.55, state.viewport.width / 6.4));
    root.current.scale.setScalar(s);
    root.current.position.y = -2.05 + hop + Math.sin(t * 1.4) * 0.03;
    if (tail.current) tail.current.rotation.y = Math.sin(t * 13) * 0.6 + b * 1.1;
    if (earL.current) { earL.current.rotation.z = -0.28 + Math.sin(t * 3 + 1) * 0.08 + b * 0.2; earL.current.rotation.x = b * 0.35; }
    if (earR.current) { earR.current.rotation.z = 0.28 - Math.sin(t * 3) * 0.08 - b * 0.2; earR.current.rotation.x = b * 0.35; }
  });

  const cursor = (c) => ({
    onPointerOver: (e) => { e.stopPropagation(); document.body.style.cursor = c; },
    onPointerOut: (e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }
  });

  return (
    <group ref={root} position={[0, -2.05, -0.5]} onClick={pet} {...cursor('pointer')}>
      {/* floor disc */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.45, 1.62, 0.1, 32]} />
        <meshStandardMaterial color="#2A2345" />
      </mesh>

      {/* doghouse + bone + ball */}
      <group position={[-1.8, 0, 0.5]}>
        <mesh position={[0, 0.52, 0]}>
          <boxGeometry args={[1.2, 0.98, 1.05]} />
          <meshStandardMaterial color="#2A2345" />
        </mesh>
        <mesh position={[0, 1.06, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.95, 0.6, 4]} />
          <meshStandardMaterial color="#F2A900" emissive="#F2A900" emissiveIntensity={0.25} />
        </mesh>
        <mesh position={[0, 0.3, 0.53]}>
          <boxGeometry args={[0.4, 0.55, 0.08]} />
          <meshStandardMaterial color="#171330" />
        </mesh>
        <group position={[0, 0.1, 0.62]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.05, 0.24, 4, 10]} />
            <meshStandardMaterial color="#FFF3DC" />
          </mesh>
          <mesh position={[0.17, 0, 0]}>
            <sphereGeometry args={[0.06, 10, 8]} />
            <meshStandardMaterial color="#FFF3DC" />
          </mesh>
          <mesh position={[-0.17, 0, 0]}>
            <sphereGeometry args={[0.06, 10, 8]} />
            <meshStandardMaterial color="#FFF3DC" />
          </mesh>
        </group>
      </group>
      <mesh position={[1.0, 0.13, 0.45]}>
        <sphereGeometry args={[0.13, 14, 12]} />
        <meshStandardMaterial color="#E11A6E" emissive="#E11A6E" emissiveIntensity={0.2} />
      </mesh>

      {/* sitting body */}
      <mesh position={[0, 0.62, -0.3]}>
        <sphereGeometry args={[0.55, 18, 14]} />
        <meshStandardMaterial color={FUR} />
      </mesh>
      <mesh position={[-0.36, 0.5, -0.15]}>
        <sphereGeometry args={[0.3, 14, 12]} />
        <meshStandardMaterial color={FUR_DARK} />
      </mesh>
      <mesh position={[0.36, 0.5, -0.15]}>
        <sphereGeometry args={[0.3, 14, 12]} />
        <meshStandardMaterial color={FUR_DARK} />
      </mesh>
      <mesh position={[0, 1.05, 0.05]}>
        <sphereGeometry args={[0.56, 18, 14]} />
        <meshStandardMaterial color={FUR} />
      </mesh>
      <mesh position={[0, 0.98, 0.38]} scale={[0.9, 0.72, 0.8]}>
        <sphereGeometry args={[0.42, 16, 12]} />
        <meshStandardMaterial color={CREAM} />
      </mesh>

      {/* front legs + paws */}
      <mesh position={[-0.34, 0.58, 0.2]} rotation={[0.08, 0, 0.06]}>
        <capsuleGeometry args={[0.15, 0.38, 4, 12]} />
        <meshStandardMaterial color={FUR} />
      </mesh>
      <mesh position={[0.34, 0.58, 0.2]} rotation={[0.08, 0, -0.06]}>
        <capsuleGeometry args={[0.15, 0.38, 4, 12]} />
        <meshStandardMaterial color={FUR} />
      </mesh>
      <mesh position={[-0.34, 0.14, 0.3]}>
        <sphereGeometry args={[0.13, 12, 10]} />
        <meshStandardMaterial color={CREAM} />
      </mesh>
      <mesh position={[0.34, 0.14, 0.3]}>
        <sphereGeometry args={[0.13, 12, 10]} />
        <meshStandardMaterial color={CREAM} />
      </mesh>

      {/* head */}
      <mesh position={[0, 1.78, 0.42]}>
        <sphereGeometry args={[0.44, 18, 14]} />
        <meshStandardMaterial color={FUR} />
      </mesh>
      <mesh position={[0, 1.7, 0.9]} scale={[1, 0.85, 1.2]}>
        <sphereGeometry args={[0.26, 14, 12]} />
        <meshStandardMaterial color={CREAM} />
      </mesh>
      <mesh position={[0, 1.74, 1.13]}>
        <sphereGeometry args={[0.09, 12, 10]} />
        <meshStandardMaterial color={PUP_INK} />
      </mesh>
      <mesh position={[0, 1.61, 1.06]}>
        <boxGeometry args={[0.26, 0.045, 0.03]} />
        <meshStandardMaterial color={PUP_INK} transparent opacity={0.85} />
      </mesh>
      <mesh position={[-0.19, 1.9, 0.78]}>
        <sphereGeometry args={[0.07, 12, 10]} />
        <meshStandardMaterial color={PUP_INK} />
      </mesh>
      <mesh position={[0.19, 1.9, 0.78]}>
        <sphereGeometry args={[0.07, 12, 10]} />
        <meshStandardMaterial color={PUP_INK} />
      </mesh>
      <mesh position={[-0.145, 1.935, 0.83]}>
        <sphereGeometry args={[0.024, 8, 6]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[0.145, 1.935, 0.83]}>
        <sphereGeometry args={[0.024, 8, 6]} />
        <meshStandardMaterial color="#fff" />
      </mesh>

      {/* floppy ears */}
      <group ref={earL} position={[-0.4, 1.94, 0.22]}>
        <mesh position={[0, -0.3, 0]} scale={[0.75, 1.4, 0.4]}>
          <sphereGeometry args={[0.22, 12, 10]} />
          <meshStandardMaterial color={FUR_DARK} />
        </mesh>
      </group>
      <group ref={earR} position={[0.4, 1.94, 0.22]}>
        <mesh position={[0, -0.3, 0]} scale={[0.75, 1.4, 0.4]}>
          <sphereGeometry args={[0.22, 12, 10]} />
          <meshStandardMaterial color={FUR_DARK} />
        </mesh>
      </group>

      {/* collar + tag */}
      <mesh position={[0, 1.54, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.05, 10, 24]} />
        <meshStandardMaterial color="#F2A900" emissive="#F2A900" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 1.44, 0.78]}>
        <sphereGeometry args={[0.075, 12, 10]} />
        <meshStandardMaterial color="#F2A900" emissive="#F2A900" emissiveIntensity={0.5} />
      </mesh>

      {/* wagging tail */}
      <group ref={tail} position={[0, 1.02, -0.55]}>
        <mesh position={[0, 0.3, -0.35]} rotation={[-1.35, 0, 0]}>
          <capsuleGeometry args={[0.1, 0.5, 4, 12]} />
          <meshStandardMaterial color={FUR} />
        </mesh>
      </group>
    </group>
  );
}

function PawField() {  const group = useRef(null);

  const paws = [
    { position: [-3.4, 1.1, -2.5], scale: 1.15, color: '#F2A900' },
    { position: [-1.2, 0.4, -3.2], scale: 0.8, color: '#E11A6E' },
    { position: [1.6, 1.4, -2.8], scale: 1.3, color: '#F2A900' },
    { position: [3.6, 0.5, -3.4], scale: 0.9, color: '#E11A6E' },
    { position: [-4.6, -0.9, -4.2], scale: 1.5, color: '#F2A900' },
    { position: [-0.4, -1.3, -4.6], scale: 1.0, color: '#E11A6E' },
    { position: [2.8, -0.7, -4.4], scale: 1.35, color: '#F2A900' },
    { position: [4.9, -1.2, -4.8], scale: 1.05, color: '#E11A6E' },
    { position: [0.6, 2.0, -4.9], scale: 0.7, color: '#F2A900' },
    { position: [5.4, 1.8, -5.4], scale: 0.75, color: '#E11A6E' },
    { position: [-5.6, 1.9, -5.6], scale: 0.8, color: '#E11A6E' },
    { position: [-2.1, -1.9, -5.6], scale: 1.25, color: '#F2A900' }
  ];

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!group.current) return;
    group.current.rotation.z = Math.sin(t * 0.08) * 0.04;
    group.current.children.forEach((paw, i) => {
      paw.position.y += Math.sin(t * 0.7 + i * 1.7) * 0.0016;
      paw.rotation.y = Math.sin(t * 0.25 + i) * 0.5;
      paw.rotation.z = Math.sin(t * 0.4 + i * 2.1) * 0.35;
    });
  });

  return (
    <group ref={group}>
      {paws.map((p, i) => (
        <PawPrint key={i} {...p} />
      ))}
    </group>
  );
}

function PawScene({ onPet }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.8]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} color="#FFF3D6" />
      <pointLight position={[-5, -3, 3]} intensity={1.4} color="#E11A6E" />
      <pointLight position={[5, 3, 2]} intensity={1.4} color="#F2A900" />
      <PawField />
      <HeroDog onPet={onPet} />
    </Canvas>
  );
}

/* ── Lazy 3D hero canvas (mounts only when visible) ────────────── */
function Hero3D({ onPet }) {
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
  return on ? <PawScene onPet={onPet} /> : null;
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
  { img: img1, span: 'tall' },
  { img: dog01, span: '' },
  { img: dog02, span: '' },
  { video: vid1, span: 'wide' },
  { img: dog03, span: '' },
  { img: dog04, span: 'tall' },
  { img: dog05, span: '' },
  { video: vid2, span: 'wide' },
  { img: dog06, span: '' },
  { img: img2, span: 'tall' },
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
        <Hero3D onPet={petPup} />
        {bark > 0 && (
          <div className="vp-bark" key={bark} role="status">Woof! <span className="vp-bark-heart">♥</span></div>
        )}
        <div className="vp-hero-inner">
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
          <a className="vp-scroll-cue" href="#story">Meet the pack <span className="vp-cue-arrow">↓</span></a>
        </div>
        <div className="vp-pup-hint">🐾 tap the pup</div>
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
            <img className="vp-stacked" src={img2} alt="A dog at PAWS" loading="lazy" />
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
