import { StrictMode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, AtSign, Mail, MapPin, Menu, RotateCw, X } from 'lucide-react';
import GearScene from './GearScene';
import { Lightbox, ProjectsTimeline, SaturdaySection, VoicesStrip, useLightbox } from './FieldStory';
import { BoardSection, PresidentsRail } from './Leadership';
import { AboutSection, GoalsSection, MeetupSection, QuickFacts } from './Sections';
import { CLUB, STATS } from './data';
import { LOGOS } from './photos';
import './demo.css';

gsap.registerPlugin(ScrollTrigger);

const CONFETTI_COLORS = ['#6C4F75', '#C9A24B', '#C17890', '#2A1F2E', '#F2E6C8'];

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

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
    ['#numbers', 'Numbers'],
    ['#story', 'Story'],
    ['#board', 'Board'],
    ['#field', 'Field'],
    ['#saturday', 'Saturdays'],
    ['#join', 'Join']
  ];
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? 'bg-paper/90 shadow-[0_10px_30px_-18px_rgba(42,31,46,.35)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <a href="/" className="flex items-center gap-2.5">
          <img src={LOGOS.alt} alt="Rotaract Club of Sukedhara" className="h-9 w-auto" />
          <span className="hidden font-mono text-[11px] font-semibold tracking-[0.14em] text-mut uppercase md:block">
            {CLUB.short} · {CLUB.identity}
          </span>
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-6 lg:flex">
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="font-mono text-[11px] font-semibold tracking-[0.14em] text-ink/70 uppercase transition-colors hover:text-gold"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#join"
            className="hidden rounded-full bg-gold px-5 py-2 font-mono text-[11px] font-bold tracking-[0.12em] text-ink uppercase transition-transform hover:scale-105 lg:inline-flex"
          >
            Join us
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-full border border-line bg-paper/80 text-ink transition-colors hover:text-gold lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile sections" className="border-t border-line bg-paper/95 px-4 py-3 backdrop-blur-md lg:hidden">
          <ul className="flex flex-col gap-1">
            {links.map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 font-mono text-xs font-semibold tracking-[0.12em] text-ink uppercase transition-colors hover:bg-plum/10 hover:text-plum"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
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
        opacity: 0.4,
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
    el.style.transform = `translate(${e.clientX - r.left - 240}px, ${e.clientY - r.top - 240}px)`;
  };

  return (
    <header ref={rootRef} onPointerMove={onGlow} className="relative min-h-[100svh] overflow-hidden pt-20">
      <div className="suk-hero-aqua pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 hidden h-[26rem] w-[26rem] rounded-full bg-plum/10 blur-3xl md:block"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-0 px-4 pb-14 md:grid-cols-[1.15fr_1fr] md:px-8">
        <div ref={copyRef} className="text-left will-change-transform">
          <p className="suk-rise inline-flex items-center gap-2 rounded-full border border-plum/30 bg-paper/80 px-3.5 py-1.5 font-mono text-[10px] font-semibold tracking-[0.18em] text-plum-deep uppercase" style={{ animationDelay: '60ms' }}>
            The Compassion Club · Chartered 2019
          </p>
          <h1 className="suk-rise suk-hero-title mt-5 text-aubergine" style={{ animationDelay: '150ms' }}>
            We show up,
            <br />
            we build,
            <br />
            we{' '}
            <span className="bg-gradient-to-br from-plum via-rose to-gold bg-clip-text text-transparent">serve</span>
            <span className="text-gold">.</span>
          </h1>
          <p className="suk-rise mx-0 mt-6 max-w-xl leading-relaxed text-ink/70" style={{ animationDelay: '240ms' }}>
            {CLUB.identity}, in the true sense — twenty members, nine field projects this year, and a
            Saturday-morning room in Baneshwar that learns your name by the second visit.
          </p>
          <div className="suk-rise mt-7 flex flex-wrap justify-start gap-3" style={{ animationDelay: '330ms' }}>
            <Magnetic>
              <a
                href="#story"
                className="inline-flex items-center gap-2 rounded-full bg-plum px-7 py-3.5 font-mono text-xs font-bold tracking-[0.12em] text-white uppercase shadow-[0_16px_38px_-14px_rgba(46,165,173,.9)] transition-transform hover:scale-105 active:scale-95"
              >
                Read the story
              </a>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                onClick={onSpin}
                className="inline-flex items-center gap-2 rounded-full border-2 border-plum/40 bg-paper/70 px-7 py-3.5 font-mono text-xs font-bold tracking-[0.12em] text-plum-deep uppercase transition-colors hover:border-gold hover:text-gold"
              >
                <RotateCw className="size-4" /> Spin the logo
              </button>
            </Magnetic>
          </div>
          <p className="suk-rise mt-5 flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-mut uppercase" style={{ animationDelay: '420ms' }}>
            <MapPin className="size-3.5 text-gold" /> {CLUB.venue} · {CLUB.meeting}
          </p>
        </div>
        <div ref={gearBoxRef} className="relative h-[300px] sm:h-[380px] md:h-[540px]">
          <GearScene ref={gearRef} calm={calm} onSpin={onSpin} />
          {!calm && (
            <p className="suk-flicker pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.18em] whitespace-nowrap text-plum-deep/60 uppercase">
              Poke the logo
            </p>
          )}
        </div>
      </div>
      <a
        href="#numbers"
        aria-label="Scroll to the numbers"
        className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 font-mono text-[10px] tracking-[0.28em] text-plum-deep/50 uppercase transition-colors hover:text-plum md:flex"
      >
        Scroll
        <ArrowDown className="size-4 animate-bounce" />
      </a>
    </header>
  );
}

/* Giant numbers on the first full-bleed band. */
function NumbersBand() {
  const ref = useRef(null);
  const [run, setRun] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRun(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section id="numbers" ref={ref} className="suk-slide w-full scroll-mt-24 bg-aubergine">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-4 py-16 md:grid-cols-4 md:px-8 md:py-20">
        {STATS.map((s) => (
          <div key={s.label} className="border-l-2 border-plum pl-5">
            <div className="font-display text-5xl font-bold tabular-nums text-white md:text-7xl">
              {s.plain ? s.value : `${s.value}${s.suffix}`}
            </div>
            <div className="mt-2 font-mono text-[10px] font-semibold tracking-[0.18em] text-gold uppercase">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* Editorial band with a big statement headline. */
function Band({ id, kicks, title, sub, children, className = '' }) {
  return (
    <section id={id} className={`suk-slide w-full scroll-mt-24 py-16 md:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <p className="font-mono text-[10px] font-semibold tracking-[0.2em] text-gold uppercase">{kicks}</p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold text-aubergine md:text-6xl">{title}</h2>
        {sub && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65 md:text-base">{sub}</p>}
        <div className="mt-9">{children}</div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-aubergine px-4 py-12 text-center text-white">
      <img src={LOGOS.white} alt="Rotaract Club of Sukedhara logo" className="mx-auto h-14 w-auto opacity-90" loading="lazy" />
      <p className="mt-5 font-display text-lg font-bold text-white">{CLUB.name}</p>
      <p className="mt-1 font-mono text-[11px] tracking-[0.12em] text-white/60 uppercase">
        {CLUB.meeting} · {CLUB.venue}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-5 font-mono text-xs font-semibold">
        <a href={CLUB.igUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-gold">
          <AtSign className="size-4" /> @{CLUB.ig}
        </a>
        <a href={`mailto:${CLUB.emails[0]}`} className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-gold">
          <Mail className="size-4" /> {CLUB.emails[0]}
        </a>
      </div>
      <p className="mt-7 font-mono text-[10px] tracking-[0.16em] text-white/40 uppercase">
        Demo concept — for the real thing, visit the{' '}
        <a href="/sukedhara" className="text-gold underline underline-offset-2 hover:text-white">
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
          { opacity: 0.25 },
          {
            opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 98%', end: 'top 50%', scrub: true }
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
      <Hero calm={calm} gearRef={gearRef} gearBoxRef={gearBoxRef} onSpin={handleSpin} />
      <NumbersBand />

      <Band
        id="story"
        kicks="Why the club exists"
        title="Small club. Big reach. And a laugh every Saturday."
        sub={`${CLUB.identity} since ${CLUB.foundedDisplay} — registered, sponsored, and still logging every single event.`}
      >
        <AboutSection />
        <div className="mt-12">
          <QuickFacts />
        </div>
      </Band>

      <Band
        id="promises"
        kicks="Rota year goals"
        title="Four promises we are actively keeping."
        sub="Member engagement · partnerships · governance · leadership."
        className="border-y border-line bg-plum/[0.06]"
      >
        <GoalsSection />
      </Band>

      <section id="board" className="suk-slide w-full scroll-mt-24 border-b border-line bg-paper py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <p className="font-mono text-[10px] font-semibold tracking-[0.2em] text-gold uppercase">The people</p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold text-aubergine md:text-6xl">Thirteen faces, one club.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65 md:text-base">
            Officers who plan, fund, film, and fetch — the president at the head, everyone else hot on her heels.
          </p>
          <div className="mt-9">
            <BoardSection />
          </div>
        </div>
      </section>

      <Band
        id="field"
        kicks="Field logs · nine projects"
        title="A year out there, logged."
        sub="August 2024 → June 2025. Scroll to walk it — photos in the galleries."
      >
        <ProjectsTimeline onOpenGallery={openGallery} />
      </Band>

      <section id="saturday" className="suk-slide w-full scroll-mt-24 border-y border-line bg-paper py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <p className="font-mono text-[10px] font-semibold tracking-[0.2em] text-gold uppercase">Every Saturday · 10:00 AM</p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold text-aubergine md:text-6xl">A Saturday at ten.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65 md:text-base">
            Arrival, fellowship, planning, closing circle — four beats, one morning.
          </p>
          <div className="mt-9">
            <SaturdaySection onOpenGallery={openGallery} />
          </div>
        </div>
      </section>

      <div id="presidents" className="scroll-mt-24 w-full">
        <PresidentsRail />
      </div>

      <Band
        id="voices"
        kicks="Voices"
        title="Why they stay."
        className="border-y border-line bg-gold/[0.07]"
      >
        <VoicesStrip />
      </Band>

      <section id="join" className="suk-slide w-full scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <p className="font-mono text-[10px] font-semibold tracking-[0.2em] text-gold uppercase">The invite</p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold text-aubergine md:text-6xl">Turn up, Saturday.</h2>
          <div className="mt-9">
            <MeetupSection />
          </div>
        </div>
      </section>

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