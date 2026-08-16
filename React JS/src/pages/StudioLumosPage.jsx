import { useEffect, useRef, useState } from 'react';
import Reveal from '../components/ui/Reveal';
import IslandNav from '../components/island/IslandNav';
import './vendor-lumos.css';

import stickersImg from '../vendors/studiolumos/media/stickers.jpg';
import stickers2Img from '../vendors/studiolumos/media/stickers-2.jpg';
import notebooksImg from '../vendors/studiolumos/media/notebooks.jpg';
import garoImg from '../vendors/studiolumos/media/garo.jpg';
import gokuImg from '../vendors/studiolumos/media/goku.jpg';
import spidermanImg from '../vendors/studiolumos/media/spiderman.jpg';
import logoImg from '../vendors/studiolumos/media/logo.jpg';

const VENDOR = {
  name: 'StudioLumos.np',
  founder: 'Rtr. Saurav Singh',
  founded: 2021,
  club: 'Rotaract Club of Tripureswor Kathmandu',
  phone: '9861246936',
  phoneIntl: '+9779861246936',
  instagram: 'https://www.instagram.com/studiolumos.np/',
  tagline: 'Custom stickers, anime posters, notebooks and frames — your ideas, printed beautifully.'
};

const WHATSAPP = `https://wa.me/${VENDOR.phoneIntl}?text=${encodeURIComponent('Hi StudioLumos! I found you through the Zone 7 Store and I would like to order:')}`;
const WHATSAPP_ROT = `https://wa.me/${VENDOR.phoneIntl}?text=${encodeURIComponent('Hi StudioLumos! I am a Rotaractor (Zone 7 store) — I would like to order with the 10% discount:')}`;

/* ── Sticker Burst (DOM confetti) ───────────────────────────────── */
const BURST_COLORS = ['#F01010', '#F2A900', '#FF3B3B', '#B90F0F', '#FF6B6B', '#FFFFFF'];

function StickerFlurry({ on }) {
  if (!on) return null;
  const bits = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 10 + Math.random() * 22,
    delay: Math.random() * 0.9,
    dur: 2.4 + Math.random() * 1.6,
    color: BURST_COLORS[i % BURST_COLORS.length],
    rot: Math.random() * 360,
    dx: Math.round(Math.random() * 160 - 80)
  }));
  return (
    <div className="sl-flurry" aria-hidden="true">
      {bits.map((b) => (
        <span
          key={b.id}
          className="sl-flurry-bit"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            borderRadius: b.id % 5 === 0 ? '50%' : '6px',
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.dur}s`,
            background: b.color,
            ['--rot']: `${b.rot}deg`,
            ['--dx']: `${b.dx}px`
          }}
        />
      ))}
    </div>
  );
}

/* ── Die-cut sticker accents (inline SVG) ───────────────────────── */
function StickerStar() {
  return (
    <svg viewBox="0 0 100 100" className="sl-sticker-art" aria-hidden="true">
      <path d="M50 4 L61.8 37.4 L97.5 37.4 L68.8 58 L78.5 91.3 L50 71.5 L21.5 91.3 L31.2 58 L2.5 37.4 L38.2 37.4 Z" fill="#FFFFFF" />
      <path d="M50 14 L59.2 39.8 L87.6 39.8 L65.3 55.8 L72.9 84.2 L50 68.6 L27.1 84.2 L34.7 55.8 L12.4 39.8 L40.8 39.8 Z" fill="#F2A900" stroke="#B8860B" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="50" cy="47" r="4.5" fill="#FFF8EF" opacity="0.8" />
    </svg>
  );
}

function StickerBadge() {
  return (
    <svg viewBox="0 0 100 100" className="sl-sticker-art" aria-hidden="true">
      <circle cx="50" cy="50" r="45" fill="#FFFFFF" />
      <circle cx="50" cy="50" r="38" fill="#E11A6E" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#A80F52" strokeWidth="3" />
      <text x="50" y="66" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="900" fontSize="46" fill="#FFF8EF">7</text>
      <circle cx="50" cy="50" r="43" fill="none" stroke="#FFF8EF" strokeWidth="1.5" opacity="0.45" />
    </svg>
  );
}

function StickerPill() {
  return (
    <svg viewBox="0 0 160 56" className="sl-sticker-art" aria-hidden="true">
      <rect x="6" y="6" width="148" height="44" rx="22" fill="#FFFFFF" />
      <rect x="6" y="6" width="148" height="44" rx="22" fill="none" stroke="#F01010" strokeWidth="3" />
      <text x="80" y="36" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="800" fontSize="21" letterSpacing="1.5" fill="#1B1836">✦ LUMOS ✦</text>
    </svg>
  );
}

/* ── Marquee ticker ─────────────────────────────────────────────── */
const TICKER = [
  'Laptop skins', 'Phone skins', 'Sticker sheets', 'Anime posters', 'Notebooks & frames',
  'Waterproof & dustproof', 'StudioLumos.np', '10% off for Rotaractors', 'Make it yours', 'Kathmandu'
];

function Ticker() {
  const row = [...TICKER, ...TICKER];
  return (
    <div className="sl-ticker" aria-hidden="true">
      <div className="sl-ticker-track">
        {row.map((t, i) => (
          <span className="sl-ticker-item" key={i}><span className="sl-dot">✦</span> {t}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Categories ─────────────────────────────────────────────────── */
const CATEGORIES = [
  {
    img: stickers2Img,
    title: 'Laptop Skins',
    desc: 'Give your lid a personality — custom skins sized for any laptop, printed waterproof and dustproof, ready to peel on and off.',
    tag: 'Fit your lid'
  },
  {
    img: stickersImg,
    title: 'Phone Skins',
    desc: 'A skin that wraps your phone in your own art — custom shapes, cut to fit, matte or normal finish, safe for daily carry.',
    tag: 'Wrap your phone'
  },
  {
    img: gokuImg,
    title: 'Anime Posters',
    desc: 'A4 and A3 prints for bedrooms, gaming setups and studios — or fully customized poster designs made to your taste.',
    tag: 'A4 · A3'
  },
  {
    img: notebooksImg,
    title: 'Notebooks & Frames',
    desc: 'Customized note copies and unique frames — stationery and keepsakes with your name, your art or your brand on them.',
    tag: 'Custom print'
  }
];

/* ── Price board ────────────────────────────────────────────────── */
const PRICES = [
  { item: 'Customized Matte Stickers', detail: '12 pcs — any size, shape or finish', price: 'NPR 450' },
  { item: 'Customized Poster', detail: 'A4 size · 60/-', price: 'NPR 60' },
  { item: 'Customized Poster', detail: 'A3 size · 120/-', price: 'NPR 120' },
  { item: 'Customized Note Copy', detail: 'Your design, printed on a note copy', price: 'NPR 450' }
];

/* ── Gallery ────────────────────────────────────────────────────── */
const GALLERY = [
  { img: stickers2Img, span: 'wide' },
  { img: gokuImg, span: 'tall' },
  { img: stickersImg, span: '' },
  { img: notebooksImg, span: 'tall' },
  { img: spidermanImg, span: '' },
  { img: garoImg, span: '' }
];

export default function StudioLumosPage() {
  const [flurry, setFlurry] = useState(false);
  const [reduced] = useState(() => (typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false));
  const heroRef = useRef(null);
  const shotsRef = useRef([]);

  useEffect(() => {
    document.title = 'StudioLumos.np | Zone 7 Local Vendor';
  }, []);

  // each photo tilts in its own 3D space toward the cursor — off for touch & reduced motion
  useEffect(() => {
    const el = heroRef.current;
    if (!el || reduced || (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches)) return;
    const BASE = [-2, 3, -4, 5, -3, 4];
    const DEPTH = [46, 20, 28, 16, 26, 18];
    let raf = 0;
    let mouseX = 0, mouseY = 0;
    const apply = () => {
      shotsRef.current.forEach((shot, i) => {
        if (!shot) return;
        const r = shot.getBoundingClientRect();
        const nx = (mouseX - (r.left + r.width / 2)) / (r.width / 2);
        const ny = (mouseY - (r.top + r.height / 2)) / (r.height / 2);
        // atan soft-falloff: cards near the cursor respond most, distant ones settle gently
        const tx = Math.atan(ny * 1.3) * 7.5;
        const ty = Math.atan(nx * 1.3) * 10;
        shot.style.transform =
          `perspective(900px) rotateX(${tx.toFixed(2)}deg) rotateY(${ty.toFixed(2)}deg) rotate(${BASE[i]}deg) translateZ(${DEPTH[i]}px)`;
      });
      raf = 0;
    };
    const onMove = (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      cancelAnimationFrame(raf); raf = 0;
      shotsRef.current.forEach((shot, i) => {
        if (shot) shot.style.transform =
          `perspective(900px) rotateX(0deg) rotateY(0deg) rotate(${BASE[i]}deg) translateZ(${DEPTH[i]}px)`;
      });
    };
    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const burstFlurry = () => {
    if (reduced) return;
    setFlurry(true);
    setTimeout(() => setFlurry(false), 3400);
  };

  return (
    <div className="sl-page">
      <IslandNav current="vendor" context="StudioLumos.np" />
      <StickerFlurry on={flurry} />

      {/* ── HERO ── */}
      <header className="sl-hero" id="lumos-hero" ref={heroRef}>
        <div className="sl-graph" aria-hidden="true"></div>
        <div className="sl-hero-shots" aria-hidden="true">
          <img className="sl-shot sl-shot-main" ref={(el) => (shotsRef.current[0] = el)} src={stickers2Img} alt="" loading="eager" />
          <img className="sl-shot sl-shot-a" ref={(el) => (shotsRef.current[1] = el)} src={gokuImg} alt="" loading="lazy" />
          <img className="sl-shot sl-shot-b" ref={(el) => (shotsRef.current[2] = el)} src={notebooksImg} alt="" loading="lazy" />
          <img className="sl-shot sl-shot-c" ref={(el) => (shotsRef.current[3] = el)} src={stickersImg} alt="" loading="lazy" />
          <img className="sl-shot sl-shot-d" ref={(el) => (shotsRef.current[4] = el)} src={garoImg} alt="" loading="lazy" />
          <img className="sl-shot sl-shot-e" ref={(el) => (shotsRef.current[5] = el)} src={spidermanImg} alt="" loading="lazy" />
          <span className="sl-sticker sl-sticker-star"><StickerStar /></span>
          <span className="sl-sticker sl-sticker-badge"><StickerBadge /></span>
          <span className="sl-sticker sl-sticker-pill"><StickerPill /></span>
        </div>
        <div className="sl-hero-scrim"></div>

        <div className="sl-hero-content">
          <div className="sl-logo-chip">
            <img src={logoImg} alt="StudioLumos.np logo" />
          </div>
          <span className="sl-eyebrow">Zone 7 · Local Vendor · Est. {VENDOR.founded}</span>
          <h1 className="sl-title">
            Stick a little <span className="sl-em-red">joy</span>{' '}
            on <span className="sl-em-gold">everything</span>.
          </h1>
          <p className="sl-tagline">{VENDOR.tagline}</p>
          <div className="sl-rot-badge" role="note">
            <span className="sl-rot-star">★</span> 10% off for Rotaractors — show your badge
          </div>
          <div className="sl-cta-row">
            <a className="sl-btn sl-btn-wa" href={WHATSAPP_ROT} target="_blank" rel="noreferrer">Order on WhatsApp</a>
            <a className="sl-btn sl-btn-ig" href={VENDOR.instagram} target="_blank" rel="noreferrer">@studiolumos.np</a>
            <button type="button" className="sl-btn sl-btn-burst" onClick={burstFlurry} disabled={reduced}>
              ✦ Sticker Burst
            </button>
          </div>
        </div>

        <a className="sl-scroll-cue" href="#story">The story <span className="sl-cue-arrow">↓</span></a>
      </header>

      <Ticker />

      {/* ── STORY ── */}
      <section className="sl-story" id="story">
        <div className="sl-wrap sl-story-grid">
          <Reveal className="sl-story-copy">
            <span className="sl-kicker">The studio</span>
            <h2>From one idea to thousands of stickers.</h2>
            <p>
              StudioLumos.np began in {VENDOR.founded} with a passion for creative designs and
              personalized products — founded by {VENDOR.founder}. What started small has grown
              into a studio where customers turn their ideas into high-quality, customized
              products.
            </p>
            <p>
              Bring your own design or idea, and StudioLumos will make it real — at your
              preferred size, shape, finish and requirement. Matte or normal finish, waterproof
              and dustproof, ready for laptops, bottles, notebooks, vehicles, product
              packaging, branding, events and everyday use.
            </p>
            <div className="sl-chips">
              <span className="sl-chip">Matte &amp; normal finish</span>
              <span className="sl-chip">Waterproof · dustproof</span>
              <span className="sl-chip">Custom size &amp; shape</span>
              <span className="sl-chip">Bulk &amp; business orders</span>
            </div>
          </Reveal>
          <Reveal className="sl-story-media" delay={0.12}>
            <img src={stickersImg} alt="A sheet of custom stickers from StudioLumos" loading="lazy" />
            <img className="sl-stacked" src={stickers2Img} alt="More custom stickers" loading="lazy" />
          </Reveal>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="sl-cats">
        <div className="sl-wrap">
          <Reveal className="sl-center-head">
            <span className="sl-kicker light">What we stick</span>
            <h2>Ideas, printed beautifully.</h2>
            <p>Laptop skins, phone skins, posters, notebooks, frames — or hundreds of any of them for your brand.</p>
          </Reveal>
          <div className="sl-cat-grid">
            {CATEGORIES.map((c, i) => (
              <Reveal className="sl-cat-card" key={c.title} delay={i * 0.07}>
                <div className="sl-cat-media">
                  <img src={c.img} alt={c.title} loading="lazy" />
                  <span className="sl-cat-tag">{c.tag}</span>
                  <span className="sl-cat-fold" aria-hidden="true"></span>
                </div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICE BOARD ── */}
      <section className="sl-pricing">
        <div className="sl-wrap">
          <Reveal className="sl-center-head">
            <span className="sl-kicker">The price board</span>
            <h2>Small prices, big customization.</h2>
            <p>Every order is made to your design — these are the starting rates.</p>
          </Reveal>
          <Reveal className="sl-price-board">
            {PRICES.map((p, i) => (
              <div className="sl-price-row" key={i}>
                <span className="sl-price-item">
                  <strong>{p.item}</strong>
                  <em>{p.detail}</em>
                </span>
                <span className="sl-price-amt">{p.price}</span>
              </div>
            ))}
            <div className="sl-price-foot">
              <span>★ Rotaractors get 10% off on every order</span>
              <a href={WHATSAPP_ROT} target="_blank" rel="noreferrer">Order with your Rotaract badge →</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="sl-gallery">
        <div className="sl-wrap">
          <Reveal className="sl-center-head">
            <span className="sl-kicker light">Fresh from the studio</span>
            <h2>Recent stick-ations.</h2>
            <p>A peek at the sheets, posters and notebooks StudioLumos has been printing lately.</p>
          </Reveal>
        </div>
        <div className="sl-gallery-grid">
          {GALLERY.map((g, i) => (
            <Reveal className={`sl-cell ${g.span || ''}`} key={i} delay={(i % 4) * 0.05}>
              <img src={g.img} alt="Custom printing by StudioLumos" loading="lazy" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── QUALITY ── */}
      <section className="sl-quality">
        <div className="sl-wrap sl-quality-grid">
          <Reveal className="sl-quality-copy">
            <span className="sl-kicker">Stick-tough</span>
            <h2>Printed to survive real life.</h2>
            <p>
              Laptop bags that get thrown around, bottles that live in backpacks, notebooks
              that travel everywhere — StudioLumos stickers are made to stay. Waterproof,
              dustproof and scratch-friendly, with a matte or normal finish that suits your
              style.
            </p>
            <div className="sl-quality-list">
              <span>💧 Waterproof</span>
              <span>🌬️ Dustproof</span>
              <span>🎨 Matte or glossy</span>
              <span>✂️ Any size &amp; shape</span>
            </div>
          </Reveal>
          <Reveal className="sl-quality-media" delay={0.12}>
            <img src={notebooksImg} alt="Customized notebooks from StudioLumos" loading="lazy" />
          </Reveal>
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section className="sl-quote">
        <div className="sl-aurora a3"></div>
        <Reveal className="sl-quote-inner">
          <span className="sl-quote-mark" aria-hidden="true">“</span>
          <p className="sl-quote-text">
            Every sticker starts as an idea someone didn't want to lose.
          </p>
          <span className="sl-quote-by">— {VENDOR.founder}, {VENDOR.name}</span>
        </Reveal>
      </section>

      {/* ── CTA ── */}
      <section className="sl-cta">
        <div className="sl-wrap sl-cta-inner">
          <Reveal>
            <span className="sl-kicker">Bring your idea</span>
            <h2>Got a design?<br />Let's print it.</h2>
            <p>
              Message StudioLumos on WhatsApp or Instagram with your idea — laptop skins,
              phone skins, stickers, posters, note copies, frames or bulk for your business.
              Rotaractors, don't forget your 10% off.
            </p>
            <div className="sl-cta-row">
              <a className="sl-btn sl-btn-wa" href={WHATSAPP} target="_blank" rel="noreferrer">Order on WhatsApp</a>
              <a className="sl-btn sl-btn-ig" href={VENDOR.instagram} target="_blank" rel="noreferrer">Follow @studiolumos.np</a>
            </div>
          </Reveal>
          <a className="sl-store-link" href="/store">← Back to the Zone 7 Store</a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="sl-footer">
        <div className="sl-wrap sl-footer-inner">
          <span><span className="sl-paw">✦</span> {VENDOR.name} · {VENDOR.founder}</span>
          <span>Custom stickers · posters · notebooks · {VENDOR.club}</span>
          <span>A <a href="/store">Zone 7 Local Vendor</a> · <a href="/">Home</a> · Rotaract District 3292</span>
        </div>
      </footer>
    </div>
  );
}