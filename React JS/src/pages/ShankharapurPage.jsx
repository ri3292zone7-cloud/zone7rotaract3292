import { useEffect } from 'react';
import Reveal from '../components/ui/Reveal';
import IslandNav from '../components/island/IslandNav';
import { VENDORS } from '../data/vendors';
import './vendor-shankharapur.css';

import cover from '../vendors/shankharapur-pustak-pasal/media/cover.jpg';
import photo1 from '../vendors/shankharapur-pustak-pasal/media/photo-01.jpg';
import photo2 from '../vendors/shankharapur-pustak-pasal/media/photo-02.jpg';
import photo3 from '../vendors/shankharapur-pustak-pasal/media/photo-03.jpg';
import photo4 from '../vendors/shankharapur-pustak-pasal/media/photo-04.jpg';
import photo5 from '../vendors/shankharapur-pustak-pasal/media/photo-05.jpg';
import photo6 from '../vendors/shankharapur-pustak-pasal/media/photo-06.jpg';
import photo7 from '../vendors/shankharapur-pustak-pasal/media/photo-07.jpg';
import photo8 from '../vendors/shankharapur-pustak-pasal/media/photo-08.jpg';
import photo9 from '../vendors/shankharapur-pustak-pasal/media/photo-09.jpg';
import photo10 from '../vendors/shankharapur-pustak-pasal/media/photo-10.jpg';
import photo11 from '../vendors/shankharapur-pustak-pasal/media/photo-11.jpg';
import photo12 from '../vendors/shankharapur-pustak-pasal/media/photo-12.jpg';

const VENDOR = VENDORS.find((v) => v.id === 'shankharapur-pustak-pasal') || VENDORS[0];
const GET_DIRECTIONS = 'https://maps.app.goo.gl/VbFgRWCkshtW8q9y7';

/* ── Photo-album hero: polaroids pinned to a page ──────────────── */
function AlbumHero() {
  return (
    <div className="vs-album">
      <div className="vs-album-sheet">
        <span className="vs-tape vs-tape-main"></span>
        <span className="vs-tape vs-tape-1"></span>
        <span className="vs-tape vs-tape-2"></span>

        <figure className="vs-polaroid vs-pol-main">
          <img src={cover} alt="Shree Shankharapur Pustak Pasal — shop front" />
          <figcaption>Shree Shankharapur Pustak Pasal</figcaption>
        </figure>
        <figure className="vs-polaroid vs-pol-1">
          <img src={photo1} alt="Books on the shelves at Shree Shankharapur Pustak Pasal" />
          <figcaption>Fresh books in</figcaption>
        </figure>
        <figure className="vs-polaroid vs-pol-2">
          <img src={photo2} alt="Stationery corner at Shree Shankharapur Pustak Pasal" />
          <figcaption>Stationery corner</figcaption>
        </figure>
        <figure className="vs-polaroid vs-pol-3">
          <img src={photo3} alt="School supplies at Shree Shankharapur Pustak Pasal" />
          <figcaption>School essentials</figcaption>
        </figure>

        <span className="vs-pin vs-pin-1"></span>
        <span className="vs-pin vs-pin-2"></span>

        <div className="vs-stamp" aria-hidden="true">
          <span className="vs-stamp-big">10% OFF</span>
          <span className="vs-stamp-small">for Rotaractors</span>
        </div>
      </div>
      <span className="vs-stage-note">📖 every book has a home here</span>
    </div>
  );
}

/* ── Marquee ticker ────────────────────────────────────────────── */
const TICKER = [
  'Books', 'Stationery', 'School supplies', 'Exam materials', 'Copies & prints',
  'Shankharapur-6 · Sankhu', '10% off for Rotaractors', 'Every page starts a story'
];

function Ticker() {
  const row = [...TICKER, ...TICKER];
  return (
    <div className="vs-ticker" aria-hidden="true">
      <div className="vs-ticker-track">
        {row.map((t, i) => (
          <span className="vs-ticker-item" key={i}><span className="vs-book">📚</span> {t}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Sections ──────────────────────────────────────────────────── */
const DEPARTMENTS = [
  {
    icon: '📚',
    title: 'Books',
    desc: 'Textbooks, storybooks and reference titles for every class — and every kind of reader.'
  },
  {
    icon: '✏️',
    title: 'Stationery',
    desc: 'Pens, notebooks, art supplies and the everyday things students run out of first.'
  },
  {
    icon: '📐',
    title: 'School & office',
    desc: 'Bags, uniforms, calculators and everything a school day actually needs, in one stop.'
  },
  {
    icon: '🖨️',
    title: 'Copies & prints',
    desc: 'Printing, scanning, photocopies and laminated IDs — ready quickly, done neatly.'
  }
];

const GALLERY = [
  { img: photo1, span: 'wide' },
  { img: photo2, span: 'tall' },
  { img: photo3, span: '' },
  { img: photo4, span: '' },
  { img: photo5, span: 'tall' },
  { img: photo6, span: '' },
  { img: photo7, span: 'wide' },
  { img: photo8, span: '' },
  { img: photo9, span: 'tall' },
  { img: photo10, span: '' },
  { img: photo11, span: '' },
  { img: photo12, span: 'wide' }
];

export default function ShankharapurPage() {
  useEffect(() => {
    document.title = 'Shree Shankharapur Pustak Pasal | Zone 7 Local Vendor';
  }, []);

  return (
    <div className="vs-page">
      <IslandNav current="vendor" context="Shree Shankharapur Pustak Pasal" />
      {/* ── HERO ── */}
      <header className="vs-hero" id="vendor-hero">
        <div className="vs-aurora a1"></div>
        <div className="vs-aurora a2"></div>

        <div className="vs-hero-frame">
          <div className="vs-hero-copy">
            <span className="vs-eyebrow">Zone 7 · Local Vendor</span>
            <h1 className="vs-title">Shree Shankharapur<br /><span className="vs-em">Pustak Pasal</span></h1>
            <p className="vs-tagline">
              Books, stationery and everything a student needs —
              <br />right in the heart of Shankharapur, Sankhu.
            </p>
            <div className="vs-cta-row">
              <a className="vs-btn vs-btn-saffron" href={VENDOR.facebook} target="_blank" rel="noreferrer">Visit on Facebook →</a>
              <a className="vs-btn vs-btn-glass" href="/vendors">Meet more local vendors</a>
            </div>
          </div>

          <AlbumHero />
        </div>

        <a className="vs-scroll-cue" href="#story">The story <span className="vs-cue-arrow">↓</span></a>
      </header>

      <Ticker />

      {/* ── STORY ── */}
      <section className="vs-story" id="story">
        <div className="vs-wrap vs-story-grid">
          <Reveal className="vs-story-copy">
            <span className="vs-kicker">Why Shankharapur Pustak Pasal</span>
            <h2>Every great journey starts with a page.</h2>
            <p>
              Shree Shankharapur Pustak Pasal has been the neighbourhood book and
              stationery stop in Shankharapur-6 — the shop students run to before
              the new session, the shop parents trust for school day essentials,
              and the corner where a story always waits.
            </p>
            <p>
              From textbooks and storybooks to pens, notebooks and quick copies,
              everything under one roof — served with the warmth of a shop that
              knows its regulars by name.
            </p>
            <div className="vs-chips">
              <span className="vs-chip">Books &amp; stationery</span>
              <span className="vs-chip">School supplies</span>
              <span className="vs-chip">Copies &amp; prints</span>
              <span className="vs-chip">Serving Sankhu</span>
            </div>
          </Reveal>
          <Reveal className="vs-story-media" delay={0.12}>
            <img src={photo3} alt="Shelves at Shree Shankharapur Pustak Pasal" loading="lazy" />
            <img className="vs-stacked" src={photo2} alt="Books and stationery at Shree Shankharapur Pustak Pasal" loading="lazy" />
          </Reveal>
        </div>
      </section>

      {/* ── DEPARTMENTS ── */}
      <section className="vs-services">
        <div className="vs-wrap">
          <Reveal className="vs-center-head">
            <span className="vs-kicker light">What you will find</span>
            <h2>From the first book to the final exam.</h2>
            <p>Everything a student, teacher or family needs — in one friendly corner of Sankhu.</p>
          </Reveal>
          <div className="vs-service-grid">
            {DEPARTMENTS.map((s, i) => (
              <Reveal className="vs-service-card" key={s.title} delay={i * 0.07}>
                <span className="vs-service-icon" aria-hidden="true">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <a className="vs-service-link" href={VENDOR.facebook} target="_blank" rel="noreferrer">Ask for this →</a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="vs-life">
        <div className="vs-wrap">
          <Reveal className="vs-center-head">
            <span className="vs-kicker">Around the shop</span>
            <h2>Shelves, supplies and stories from Shankharapur.</h2>
            <p>A peek inside Shree Shankharapur Pustak Pasal — the books, the stock and the everyday hustle.</p>
          </Reveal>
        </div>
        <div className="vs-gallery">
          {GALLERY.map((g, i) => (
            <Reveal className={`vs-cell ${g.span || ''}`} key={i} delay={(i % 4) * 0.05}>
              <img src={g.img} alt="A look inside Shree Shankharapur Pustak Pasal" loading="lazy" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── ROTARACTOR DISCOUNT ── */}
      <section className="vs-discount">
        <div className="vs-aurora a3"></div>
        <Reveal className="vs-discount-inner">
          <span className="vs-discount-tag">🎓 Rotaractor perk</span>
          <h2><span className="vs-discount-big">10% off</span> for Rotaractors</h2>
          <p>
            Carry your Rotaract card — or just mention your club — and take 10% off
            books, stationery and supplies at the counter. A little thank-you from
            Shree Shankharapur Pustak Pasal to every Rotaractor in the neighbourhood.
          </p>
          <a className="vs-btn vs-btn-saffron" href={VENDOR.facebook} target="_blank" rel="noreferrer">Show it on Facebook →</a>
        </Reveal>
      </section>

      {/* ── QUOTE ── */}
      <section className="vs-quote">
        <div className="vs-aurora a4"></div>
        <Reveal className="vs-quote-inner">
          <span className="vs-quote-mark" aria-hidden="true">“</span>
          <p className="vs-quote-text">
            A student's first book, a child's first crayon — every great story starts with a page.
          </p>
          <span className="vs-quote-by">— Shree Shankharapur Pustak Pasal</span>
        </Reveal>
      </section>

      {/* ── VISIT ── */}
      <section className="vs-visit">
        <div className="vs-wrap vs-visit-grid">
          <Reveal className="vs-visit-copy">
            <span className="vs-kicker">Find the shop</span>
            <h2>Stop by on your way through Sankhu.</h2>
            <p>
              Look for the books at the corner of Shankharapur-6 — open for
              students, teachers and families, every school day of the week.
            </p>
            <div className="vs-visit-rows">
              <span className="vs-visit-row vs-visit-loc">📍 Shankharapur-6, Sankhu, Kathmandu</span>
              <span className="vs-visit-row">🤝 Partner of the Rotaract Club of Sankhu</span>
              <a className="vs-visit-row vs-visit-link" href={VENDOR.facebook} target="_blank" rel="noreferrer">📘 facebook.com/shankharapurbook</a>
            </div>
            <a className="vs-map-btn" href={GET_DIRECTIONS} target="_blank" rel="noreferrer">
              <span className="vs-map-pin" aria-hidden="true">📍</span>
              <span className="vs-map-text">
                <strong>Get Directions on Google Maps</strong>
                <small>Shankharapur-6, Sankhu — tap to open</small>
              </span>
              <span className="vs-map-arrow" aria-hidden="true">→</span>
            </a>
          </Reveal>
          <Reveal className="vs-visit-card" delay={0.12}>
            <span className="vs-visit-card-emoji" aria-hidden="true">📚</span>
            <h3>Shree Shankharapur Pustak Pasal</h3>
            <p>Books · Stationery · School supplies · Copies &amp; prints</p>
            <span className="vs-visit-club">Rotaract Club of Sankhu</span>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="vs-cta">
        <div className="vs-wrap vs-cta-inner">
          <Reveal>
            <span className="vs-kicker">Say hello</span>
            <h2>Need a book before the<br />session starts? Just ask.</h2>
            <p>Message the shop on Facebook for stock, orders or to check what is new this week.</p>
            <div className="vs-cta-row">
              <a className="vs-btn vs-btn-saffron" href={VENDOR.facebook} target="_blank" rel="noreferrer">Message on Facebook</a>
              <a className="vs-btn vs-btn-glass" href="/vendors">Meet more local vendors</a>
            </div>
          </Reveal>
          <a className="vs-store-link" href="/store">← Back to the Zone 7 Store</a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="vs-footer">
        <div className="vs-wrap vs-footer-inner">
          <span><span className="vs-book">📚</span> {VENDOR.name}</span>
          <span>Books · Stationery · Shankharapur, Sankhu, Nepal</span>
          <span>A <a href="/vendors">Zone 7 Local Vendor</a> · <a href="/">Home</a> · Rotaract District 3292</span>
        </div>
      </footer>
    </div>
  );
}