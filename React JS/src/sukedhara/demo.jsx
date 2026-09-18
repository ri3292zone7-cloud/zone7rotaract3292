import { StrictMode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowLeft, AtSign, Mail, MapPin, RotateCw } from 'lucide-react';
import GearScene from './GearScene';
import Reveal from './Reveal';
import { Lightbox, ProjectsTimeline, SaturdaySection, VoicesStrip, useLightbox } from './FieldStory';
import { BoardSection, PresidentsRail } from './Leadership';
import { AboutSection, GoalsSection, MeetupSection, QuickFacts, StatsBand } from './Sections';
import { CLUB } from './data';
import { LOGOS } from './photos';
import './demo.css';

gsap.registerPlugin(ScrollTrigger);

const CONFETTI_COLORS = ['#FF4D1C', '#37D6C0', '#F2EEE3', '#FFB86B', '#6A3FA0'];

/* DOM confetti burst at a point. */
function popConfetti(x, y, count = 46) {
  for (let i = 0; i < count; i++) {
    const bit = document.createElement('span');
    const size = 4 + Math.random() * 7;
    bit.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px;height:${size * 0.7}px;z-index:90;pointer-events:none;border-radius:1px;background:${CONFETTI_COLORS[i % CONFETTI_COLORS.length]};`;
    document.body.appendChild(bit);
    const dx = (Math.random() - 0.5) * 440;
    const dy = -80 - Math.random() * 280;
    const rot = (Math.random() - 0.5) * 780;
    bit
      .animate(
        [
          { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
          { transform: `translate(${dx * 0.7}px,${dy}px) rotate(${rot * 0.6}deg)`, opacity: 1, offset: 0.45 },
          { transform: `translate(${dx}px,${dy + 440}px) rotate(${rot}deg)`, opacity: 0 }
        ],
        { duration: 1150 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.3,1)' }
      )
      .finished.finally(() => bit.remove());
  }
}

function usePrefersReducedMotion() {
  const [calm, setCalm] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setCalm(mq.matches);
    const onChange = (e) => setCalm(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return calm;
}

function DemoBanner() {
  return (
    <div className="border-b border-hair bg-ink px-4 py-2 text-center font-mono text-[10px] tracking-[0.18em] text-mut uppercase">
      Demo concept for the {CLUB.name} — not the official page.{' '}
      <a href="/sukedhara" className="font-semibold text-flame underline underline-offset-2 hover:text-bone">
        See the official club page →
      </a>
    </div>
  );
}

/* Magnetic wrapper: CTAs lean gently toward the cursor. */
function Magnetic({ children }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${dx * 0.12}px, ${dy * 0.18}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };
  return (
    <span ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className="inline-block transition-transform duration-200 will-change-transform">
      {children}
    </span>
  );
}

/* Issue-cover hero: the headline, the wheel, and nothing else. */
function Hero({ calm, gearRef, gearBoxRef, onSpin }) {
  const rootRef = useRef(null);
  const copyRef = useRef(null);
  const glowRef = useRef(null);

  useLayoutEffect(() => {
    if (calm) return;
    const ctx = gsap.context(() => {
      gsap.to(copyRef.current, {
        yPercent: -9,
        opacity: 0.18,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true }
      });
    }, rootRef);
    return () => ctx.revert();
  }, [calm]);

  const onGlow = (e) => {
    const el = glowRef.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = rootRef.current.getBoundingClientRect();
    el.style.transform = `translate(${e.clientX - r.left - 220}px, ${e.clientY - r.top - 220}px)`;
  };

  return (
    <header ref={rootRef} onPointerMove={onGlow} className="suk-vignette relative overflow-hidden bg-ink text-bone">
      <div className="suk-hero-dark pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 hidden h-[26rem] w-[26rem] rounded-full bg-flame/10 blur-3xl md:block"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-2 px-4 pt-5 pb-10 md:grid-cols-[1.08fr_1fr] md:px-8 md:pt-7 md:pb-14">
        <div ref={copyRef} className="text-center will-change-transform md:text-left">
          <p className="suk-rise inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] text-volt uppercase" style={{ animationDelay: '60ms' }}>
            <img src={LOGOS.wheel} alt="" className="suk-spin-slow size-4 opacity-90" />
            District 3292 · Chartered 01.07.2019
          </p>
          <h1 className="suk-rise suk-hero-title mt-5 text-bone" style={{ animationDelay: '150ms' }}>
            Compassion,
            <br />
            in action<span className="text-flame">.</span>
          </h1>
          <p className="suk-rise mx-auto mt-6 max-w-xl leading-relaxed text-bone/70 md:mx-0" style={{ animationDelay: '240ms' }}>
            Twenty members. Nine field projects in one year. A room in Baneshwar that learns your name
            by the second Saturday. {CLUB.meeting}.
          </p>
          <div className="suk-rise mt-7 flex flex-wrap justify-center gap-3 md:justify-start" style={{ animationDelay: '330ms' }}>
            <Magnetic>
              <a
                href="#ledger"
                className="inline-flex items-center gap-2 bg-flame px-7 py-3.5 font-mono text-xs font-semibold tracking-[0.16em] text-ink uppercase transition-transform hover:scale-105 active:scale-95"
              >
                Take the tour
              </a>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                onClick={onSpin}
                className="inline-flex items-center gap-2 border border-bone/30 bg-bone/5 px-7 py-3.5 font-mono text-xs font-semibold tracking-[0.16em] text-bone uppercase transition-colors hover:border-flame hover:text-flame"
              >
                <RotateCw className="size-4" /> Spin the wheel
              </button>
            </Magnetic>
          </div>
          <p className="suk-rise mt-5 flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.14em] text-mut uppercase md:justify-start" style={{ animationDelay: '420ms' }}>
            <MapPin className="size-3.5 text-flame" /> {CLUB.venue} · Kathmandu
          </p>
        </div>
        <div ref={gearBoxRef} className="relative h-[300px] sm:h-[380px] md:h-[540px]">
          <GearScene ref={gearRef} calm={calm} onSpin={onSpin} />
          {!calm && (
            <p className="suk-flicker pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.18em] whitespace-nowrap text-bone/50 uppercase">
              Click the wheel
            </p>
          )}
        </div>
      </div>
      <a
        href="#ledger"
        aria-label="Scroll to the ledger"
        className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 font-mono text-[10px] tracking-[0.28em] text-bone/35 uppercase transition-colors hover:text-bone md:flex"
      >
        Scroll
        <ArrowDown className="size-4 animate-bounce" />
      </a>
    </header>
  );
}

const TICKER_ITEMS = [
  'Service Above Self',
  'Saturdays at 10:00 AM',
  'The Compassion Club',
  'Since 2019 · Baneshwor, Kathmandu',
  'District 3292 · Zone VII'
];

function Ticker() {
  const row = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="overflow-hidden border-y border-hair bg-panel py-3" aria-hidden="true">
      <div className="suk-ticker-track flex w-max items-center gap-8 pr-8">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8 font-mono text-[11px] font-semibold tracking-[0.2em] whitespace-nowrap text-bone/55 uppercase">
            {item}
            <span className="text-flame">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const CHAPTERS = [
  { id: 'ledger', label: 'Ledger', numeral: '01' },
  { id: 'manifesto', label: 'Manifesto', numeral: '02' },
  { id: 'promises', label: 'Four promises', numeral: '03' },
  { id: 'people', label: 'The people', numeral: '04' },
  { id: 'field', label: 'Field logs', numeral: '05' },
  { id: 'saturday', label: 'Saturday 10:00', numeral: '06' },
  { id: 'presidents', label: 'Eight presidents', numeral: '07' },
  { id: 'voices', label: 'Voices', numeral: '08' },
  { id: 'invite', label: 'The invite', numeral: '09' }
];

/* Editorial chapter block. */
function Slide({ id, numeral, label, children, className = '' }) {
  return (
    <section id={id} className={`suk-slide flex scroll-mt-4 flex-col justify-center py-10 md:py-14 ${className}`}>
      <div className="mb-6 flex items-baseline gap-4 md:mb-8">
        <span className="font-mono text-sm font-semibold tracking-[0.1em] text-flame tabular-nums">{numeral}</span>
        <span className="font-mono text-[11px] font-semibold tracking-[0.3em] text-bone uppercase">{label}</span>
        <span className="h-px flex-1 bg-hair" />
      </div>
      {children}
    </section>
  );
}

/* Fixed chapter index (desktop). */
function ChapterRail() {
  const [active, setActive] = useState(CHAPTERS[0].id);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-42% 0px -52% 0px' }
    );
    CHAPTERS.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return (
    <nav aria-label="Chapters" className="fixed top-1/2 right-5 z-50 hidden -translate-y-1/2 lg:block">
      <ul className="flex flex-col items-end gap-3">
        {CHAPTERS.map((c) => (
          <li key={c.id}>
            <a href={`#${c.id}`} className="group flex items-center gap-2">
              <span
                className={`font-mono text-[10px] tracking-[0.2em] transition-all duration-300 ${
                  active === c.id ? 'text-bone opacity-100' : 'translate-x-2 opacity-0 group-hover:opacity-50'
                }`}
              >
                {c.numeral}
              </span>
              <span
                className={`block transition-all duration-300 ${
                  active === c.id
                    ? 'size-2.5 bg-flame shadow-[0_0_0_4px_rgba(255,77,28,.18)]'
                    : 'size-1.5 bg-bone/25 group-hover:bg-bone/50'
                }`}
              />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="mt-6 border-t border-hair bg-panel px-4 py-10 text-center">
      <img src={LOGOS.white} alt="Rotaract Club of Sukedhara logo" className="mx-auto h-16 w-auto opacity-80" loading="lazy" />
      <p className="mt-4 font-display text-lg font-bold text-bone">{CLUB.name}</p>
      <p className="mt-1 font-mono text-[11px] tracking-[0.12em] text-mut uppercase">
        {CLUB.meeting} · {CLUB.venue}
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-5 font-mono text-xs font-semibold">
        <a href={CLUB.igUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-bone/70 transition-colors hover:text-flame">
          <AtSign className="size-4" /> @{CLUB.ig}
        </a>
        <a href={`mailto:${CLUB.emails[0]}`} className="inline-flex items-center gap-2 text-bone/70 transition-colors hover:text-flame">
          <Mail className="size-4" /> {CLUB.emails[0]}
        </a>
      </div>
      <p className="mt-6 font-mono text-[10px] tracking-[0.16em] text-mut/70 uppercase">
        Demo concept — for the real thing, visit the{' '}
        <a href="/sukedhara" className="text-volt underline underline-offset-2 hover:text-bone">
          official club page
        </a>
        .
      </p>
      <p className="mt-3 font-mono text-[10px] tracking-[0.16em] text-mut/50 uppercase">
        Compassion, in action. / vol. 01 — demo
      </p>
    </footer>
  );
}

function App() {
  const calm = usePrefersReducedMotion();
  const gearRef = useRef(null);
  const gearBoxRef = useRef(null);
  const { box, openGallery, close, step } = useLightbox();

  const handleSpin = () => {
    gearRef.current?.spin(6);
    const el = gearBoxRef.current;
    if (el && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const r = el.getBoundingClientRect();
      popConfetti(r.left + r.width / 2, Math.min(Math.max(r.top + r.height / 2, 120), window.innerHeight * 0.7));
    }
  };

  /* Scroll-linked slide wipe: each chapter resolves into full view. */
  useLayoutEffect(() => {
    if (calm) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.suk-slide').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(6% 3% 6% 3%)', opacity: 0.3 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 40%', scrub: true }
          }
        );
      });
    });
    return () => ctx.revert();
  }, [calm]);

  return (
    <div className="min-h-screen bg-ink font-sans text-bone antialiased">
      <div className="suk-grain" aria-hidden="true" />
      <DemoBanner />
      <ChapterRail />
      <Hero calm={calm} gearRef={gearRef} gearBoxRef={gearBoxRef} onSpin={handleSpin} />
      <Ticker />

      <main className="mx-auto max-w-6xl space-y-2 px-4 md:space-y-4 md:px-8">
        <Slide id="ledger" numeral="01" label="The club in numbers">
          <StatsBand />
        </Slide>

        <Slide id="manifesto" numeral="02" label="Why the club exists">
          <AboutSection />
          <div className="mt-6">
            <QuickFacts />
          </div>
        </Slide>

        <Slide id="promises" numeral="03" label="Rota year goals">
          <GoalsSection />
        </Slide>

        <Slide id="people" numeral="04" label="Officers of the board">
          <BoardSection />
        </Slide>

        <Slide id="field" numeral="05" label="Field logs · nine projects">
          <ProjectsTimeline onOpenGallery={openGallery} />
        </Slide>

        <Slide id="saturday" numeral="06" label="A Saturday at ten">
          <SaturdaySection onOpenGallery={openGallery} />
        </Slide>

        <div id="presidents" className="scroll-mt-4 pt-10 md:pt-14">
          <div className="mb-6 flex items-baseline gap-4 md:mb-8">
            <span className="font-mono text-sm font-semibold tracking-[0.1em] text-flame tabular-nums">07</span>
            <span className="font-mono text-[11px] font-semibold tracking-[0.3em] text-bone uppercase">Eight presidents</span>
            <span className="h-px flex-1 bg-hair" />
          </div>
          <PresidentsRail />
        </div>

        <Slide id="voices" numeral="08" label="Why they stay">
          <VoicesStrip />
        </Slide>

        <Slide id="invite" numeral="09" label="Meet us Saturday">
          <MeetupSection />
        </Slide>
      </main>

      <Footer />
      {box.open && <Lightbox photos={box.photos} index={box.index} onClose={close} onStep={step} />}
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);