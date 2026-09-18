import { StrictMode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, AtSign, Mail, MapPin, RotateCw } from 'lucide-react';
import GearScene from './GearScene';
import Reveal from './Reveal';
import { Lightbox, ProjectsTimeline, SaturdaySection, VoicesStrip, useLightbox } from './FieldStory';
import { BoardSection, PresidentsRail } from './Leadership';
import { AboutSection, GoalsSection, MeetupSection, QuickFacts, StatsBand } from './Sections';
import { CLUB } from './data';
import { LOGOS } from './photos';
import './demo.css';

gsap.registerPlugin(ScrollTrigger);

const CONFETTI_COLORS = ['#2EA5AD', '#E96D51', '#D22163', '#123B3C', '#F2A900'];

function popConfetti(x, y, count = 46) {
  for (let i = 0; i < count; i++) {
    const bit = document.createElement('span');
    const size = 5 + Math.random() * 7;
    bit.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px;height:${size * 0.7}px;z-index:90;pointer-events:none;border-radius:2px;background:${CONFETTI_COLORS[i % CONFETTI_COLORS.length]};`;
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

const NAV_LINKS = [
  { id: 'ledger', label: 'Numbers' },
  { id: 'manifesto', label: 'Story' },
  { id: 'people', label: 'Board' },
  { id: 'field', label: 'Field' },
  { id: 'saturday', label: 'Saturdays' },
  { id: 'invite', label: 'Join' }
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'border-line bg-paper/90 shadow-[0_10px_30px_-18px_rgba(18,59,60,.35)] backdrop-blur-md'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <a href="/" className="flex items-center gap-2.5">
          <img src={LOGOS.alt} alt="Rotaract Club of Sukedhara" className="h-8 w-auto" />
          <span className="hidden font-mono text-[11px] font-semibold tracking-[0.14em] text-mut uppercase md:block">
            {CLUB.short}
          </span>
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="font-mono text-[11px] font-semibold tracking-[0.14em] text-ink/70 uppercase transition-colors hover:text-coral"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#invite"
          className="rounded-full bg-coral px-5 py-2 font-mono text-[11px] font-bold tracking-[0.12em] text-white uppercase transition-transform hover:scale-105"
        >
          Join us
        </a>
      </div>
    </header>
  );
}

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

function Hero({ calm, gearRef, gearBoxRef, onSpin }) {
  const rootRef = useRef(null);
  const copyRef = useRef(null);
  const glowRef = useRef(null);

  useLayoutEffect(() => {
    if (calm) return;
    const ctx = gsap.context(() => {
      gsap.to(copyRef.current, {
        yPercent: -8,
        opacity: 0.35,
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
    <header ref={rootRef} onPointerMove={onGlow} className="relative overflow-hidden">
      <div className="suk-hero-aqua pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 hidden h-[24rem] w-[24rem] rounded-full bg-teal/10 blur-3xl md:block"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-2 px-4 pt-8 pb-10 md:grid-cols-[1.08fr_1fr] md:px-8 md:pt-12 md:pb-16">
        <div ref={copyRef} className="text-center will-change-transform md:text-left">
          <p
            className="suk-rise inline-flex items-center gap-2 rounded-full border border-teal/30 bg-paper/80 px-3 py-1.5 font-mono text-[10px] font-semibold tracking-[0.18em] text-teal-deep uppercase"
            style={{ animationDelay: '60ms' }}
          >
            <img src={LOGOS.wheel} alt="" className="suk-spin-slow size-4 opacity-90" />
            The Compassion Club · Chartered 2019
          </p>
          <h1 className="suk-rise suk-hero-title mt-5 text-teal-ink" style={{ animationDelay: '150ms' }}>
            Compassion
            <br />
            in <span className="text-teal">action</span>
            <span className="text-coral">.</span>
          </h1>
          <p className="suk-rise mx-auto mt-6 max-w-xl leading-relaxed text-ink/70 md:mx-0" style={{ animationDelay: '240ms' }}>
            Twenty members. Nine field projects in a year. A room in Baneshwar that learns your name by
            the second Saturday. {CLUB.meeting}.
          </p>
          <div className="suk-rise mt-7 flex flex-wrap justify-center gap-3 md:justify-start" style={{ animationDelay: '330ms' }}>
            <Magnetic>
              <a
                href="#manifesto"
                className="inline-flex items-center gap-2 rounded-full bg-teal px-7 py-3.5 font-mono text-xs font-bold tracking-[0.12em] text-white uppercase shadow-[0_16px_38px_-14px_rgba(46,165,173,.9)] transition-transform hover:scale-105 active:scale-95"
              >
                Take the tour
              </a>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                onClick={onSpin}
                className="inline-flex items-center gap-2 rounded-full border-2 border-teal/40 bg-paper/70 px-7 py-3.5 font-mono text-xs font-bold tracking-[0.12em] text-teal-deep uppercase transition-colors hover:border-coral hover:text-coral"
              >
                <RotateCw className="size-4" /> Spin the wheel
              </button>
            </Magnetic>
          </div>
          <p
            className="suk-rise mt-5 flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.12em] text-mut uppercase md:justify-start"
            style={{ animationDelay: '420ms' }}
          >
            <MapPin className="size-3.5 text-coral" /> {CLUB.venue} · Kathmandu
          </p>
        </div>
        <div ref={gearBoxRef} className="relative h-[300px] sm:h-[380px] md:h-[540px]">
          <GearScene ref={gearRef} calm={calm} onSpin={onSpin} />
          {!calm && (
            <p className="suk-flicker pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.18em] whitespace-nowrap text-teal-deep/60 uppercase">
              Click the wheel
            </p>
          )}
        </div>
      </div>
      <a
        href="#ledger"
        aria-label="Scroll to the numbers"
        className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 font-mono text-[10px] tracking-[0.28em] text-teal-deep/50 uppercase transition-colors hover:text-teal md:flex"
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
    <div className="overflow-hidden bg-teal-deep py-3" aria-hidden="true">
      <div className="suk-ticker-track flex w-max items-center gap-8 pr-8">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8 font-mono text-[11px] font-semibold tracking-[0.2em] whitespace-nowrap text-white/85 uppercase">
            {item}
            <span className="text-coral">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const CHAPTERS = [
  { id: 'ledger', label: 'Numbers', numeral: '01' },
  { id: 'manifesto', label: 'Story', numeral: '02' },
  { id: 'promises', label: 'Four promises', numeral: '03' },
  { id: 'people', label: 'The board', numeral: '04' },
  { id: 'field', label: 'Field logs', numeral: '05' },
  { id: 'saturday', label: 'Saturday 10:00', numeral: '06' },
  { id: 'presidents', label: 'Eight presidents', numeral: '07' },
  { id: 'voices', label: 'Voices', numeral: '08' },
  { id: 'invite', label: 'The invite', numeral: '09' }
];

function Slide({ id, numeral, label, children, className = '' }) {
  return (
    <section id={id} className={`suk-slide flex scroll-mt-4 flex-col justify-center py-10 md:py-14 ${className}`}>
      <div className="mb-6 flex items-baseline gap-4 md:mb-8">
        <span className="font-mono text-sm font-semibold tracking-[0.1em] text-coral tabular-nums">{numeral}</span>
        <span className="font-mono text-[11px] font-semibold tracking-[0.3em] text-ink uppercase">{label}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      {children}
    </section>
  );
}

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
                  active === c.id ? 'text-teal-deep opacity-100' : 'translate-x-2 opacity-0 group-hover:opacity-50'
                }`}
              >
                {c.numeral}
              </span>
              <span
                className={`block transition-all duration-300 ${
                  active === c.id
                    ? 'size-2.5 bg-teal shadow-[0_0_0_4px_rgba(46,165,173,.18)]'
                    : 'size-1.5 bg-ink/25 group-hover:bg-ink/50'
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
    <footer className="mt-6 bg-teal-ink px-4 py-12 text-center text-white">
      <img src={LOGOS.white} alt="Rotaract Club of Sukedhara logo" className="mx-auto h-16 w-auto opacity-90" loading="lazy" />
      <p className="mt-5 font-display text-lg font-bold text-white">{CLUB.name}</p>
      <p className="mt-1 font-mono text-[11px] tracking-[0.12em] text-white/60 uppercase">
        {CLUB.meeting} · {CLUB.venue}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-5 font-mono text-xs font-semibold">
        <a href={CLUB.igUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-coral">
          <AtSign className="size-4" /> @{CLUB.ig}
        </a>
        <a href={`mailto:${CLUB.emails[0]}`} className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-coral">
          <Mail className="size-4" /> {CLUB.emails[0]}
        </a>
      </div>
      <p className="mt-7 font-mono text-[10px] tracking-[0.16em] text-white/40 uppercase">
        Demo concept — for the real thing, visit the{' '}
        <a href="/sukedhara" className="text-teal underline underline-offset-2 hover:text-white">
          official club page
        </a>
        .
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
    <div className="min-h-screen bg-page font-sans text-ink antialiased">
      <div className="suk-grain" aria-hidden="true" />
      <Nav />
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

        <Slide id="promises" numeral="03" label="Rota year goals" className="bg-teal/[0.05] -mx-4 px-4 md:-mx-8 md:px-8">
          <GoalsSection />
        </Slide>

        <Slide id="people" numeral="04" label="Officers of the board">
          <BoardSection />
        </Slide>

        <Slide id="field" numeral="05" label="Field logs · nine projects">
          <ProjectsTimeline onOpenGallery={openGallery} />
        </Slide>

        <Slide id="saturday" numeral="06" label="A Saturday at ten" className="bg-paper border-y border-line -mx-4 px-4 md:-mx-8 md:px-8">
          <SaturdaySection onOpenGallery={openGallery} />
        </Slide>

        <div id="presidents" className="scroll-mt-4 pt-10 md:pt-14">
          <div className="mb-6 flex items-baseline gap-4 md:mb-8">
            <span className="font-mono text-sm font-semibold tracking-[0.1em] text-coral tabular-nums">07</span>
            <span className="font-mono text-[11px] font-semibold tracking-[0.3em] text-ink uppercase">Eight presidents</span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <PresidentsRail />
        </div>

        <Slide id="voices" numeral="08" label="Why they stay" className="bg-teal/[0.05] -mx-4 px-4 md:-mx-8 md:px-8">
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