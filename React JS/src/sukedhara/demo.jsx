import { StrictMode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, AtSign, Mail, MapPin, MousePointerClick, Sparkles } from 'lucide-react';
import HeroScene from './HeroScene';
import Reveal from './Reveal';
import { BoardSection, PresidentsRail } from './Leadership';
import { AboutSection, GoalsSection, MeetupSection, StatsBand } from './Sections';
import { CLUB } from './data';
import { LOGOS } from './photos';
import './demo.css';

gsap.registerPlugin(ScrollTrigger);

const CONFETTI_COLORS = ['#E0475F', '#FFB86B', '#0FB5B1', '#FFF1DC', '#F2A900'];

/* DOM confetti burst at a click point (hero button). */
function popConfetti(x, y, count = 46) {
  for (let i = 0; i < count; i++) {
    const bit = document.createElement('span');
    const size = 5 + Math.random() * 7;
    bit.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px;height:${size * 0.6}px;z-index:90;pointer-events:none;border-radius:2px;background:${CONFETTI_COLORS[i % CONFETTI_COLORS.length]};`;
    document.body.appendChild(bit);
    const dx = (Math.random() - 0.5) * 420;
    const dy = -80 - Math.random() * 260;
    const rot = (Math.random() - 0.5) * 720;
    bit
      .animate(
        [
          { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
          { transform: `translate(${dx * 0.7}px,${dy}px) rotate(${rot * 0.6}deg)`, opacity: 1, offset: 0.45 },
          { transform: `translate(${dx}px,${dy + 420}px) rotate(${rot}deg)`, opacity: 0 }
        ],
        { duration: 1100 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.3,1)' }
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
    <div className="bg-[#241D4D] px-4 py-2 text-center text-[11px] font-semibold tracking-wide text-white/85 sm:text-xs">
      Playful demo concept for the {CLUB.name} — not the official page.{' '}
      <a href="/sukedhara" className="font-bold text-[#FFB86B] underline underline-offset-2 hover:text-white">
        See the official club page
      </a>
    </div>
  );
}

function Hero({ flip, onFlip, calm }) {
  const rootRef = useRef(null);
  const copyRef = useRef(null);
  const birdRef = useRef(null);

  useLayoutEffect(() => {
    if (calm) return;
    const ctx = gsap.context(() => {
      gsap.to(copyRef.current, {
        yPercent: -14,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.to(birdRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true }
      });
    }, rootRef);
    return () => ctx.revert();
  }, [calm]);

  return (
    <header ref={rootRef} className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 suk-hero-glow" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-2 px-4 pt-6 pb-2 md:grid-cols-2 md:px-8 md:pt-10">
        <div ref={copyRef} className="text-center will-change-transform md:text-left">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#F0D9BE] bg-white/70 px-3 py-1.5 text-xs font-bold text-[#6B5B73] transition-colors hover:border-[#E0475F] hover:text-[#A82F43]"
          >
            <ArrowLeft className="size-3.5" /> Zone 7 home
          </a>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#241D4D] px-3 py-1.5 text-[11px] font-bold tracking-widest text-white uppercase">
            <img src={LOGOS.wheel} alt="" className="suk-spin-slow size-4" />
            Chartered July 1, 2019 · District 3292
          </p>
          <h1 className="mt-4 text-4xl leading-[1.05] font-black text-[#241D4D] sm:text-5xl lg:text-6xl">
            Meet <span className="text-[#E0475F]">Sukedhara</span>, the club that hops to service.
          </h1>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-[#4A3F63] md:mx-0">
            {CLUB.meeting} in Baneshwar — service projects, fellowships and twenty people who will learn your name
            by the second Saturday.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
            <button
              type="button"
              onClick={(e) => {
                popConfetti(e.clientX, e.clientY);
                onFlip();
              }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E0475F] to-[#F2A900] px-6 py-3 text-sm font-extrabold text-white shadow-[0_16px_35px_-15px_rgba(224,71,95,.8)] transition-transform hover:scale-105 active:scale-95"
            >
              <MousePointerClick className="size-4" /> Poke the bird
            </button>
            <a
              href="#story"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#241D4D]/15 bg-white/70 px-6 py-3 text-sm font-extrabold text-[#241D4D] transition-colors hover:border-[#E0475F] hover:text-[#A82F43]"
            >
              <Sparkles className="size-4" /> Start the story
            </a>
          </div>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#6B5B73] md:justify-start">
            <MapPin className="size-3.5" /> {CLUB.venue}
          </p>
        </div>
        <div ref={birdRef} className="relative h-[300px] will-change-transform sm:h-[380px] md:h-[480px]">
          <HeroScene flipKey={flip} onFlip={onFlip} calm={calm} />
          {!calm && (
            <p className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-[#241D4D]/70 px-3 py-1 text-[11px] font-bold whitespace-nowrap text-white">
              Psst — click the bird
            </p>
          )}
        </div>
      </div>
    </header>
  );
}

const MARQUEE_ITEMS = ['Service Above Self', 'Saturdays at 10 AM', '200+ Projects', 'Since 2019', 'Baneshwor · Kathmandu'];

function Marquee() {
  const row = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="overflow-hidden border-y-2 border-[#241D4D]/10 bg-[#241D4D] py-3" aria-hidden="true">
      <div className="suk-marquee-track flex w-max items-center gap-8 pr-8">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8 text-sm font-black tracking-[0.18em] whitespace-nowrap text-[#FFB86B] uppercase">
            {item}
            <img src={LOGOS.wheel} alt="" className="size-5 opacity-80" />
          </span>
        ))}
      </div>
    </div>
  );
}

const CHAPTERS = [
  { id: 'numbers', label: 'Numbers' },
  { id: 'story', label: 'Story' },
  { id: 'goals', label: 'Goals' },
  { id: 'board', label: 'Board' },
  { id: 'legacy', label: 'Legacy' },
  { id: 'meetup', label: 'Meetup' }
];

/* Full-screen slide wrapper with chapter marker. */
function Slide({ id, index, label, children, className = '' }) {
  return (
    <section id={id} className={`suk-slide flex min-h-[92vh] scroll-mt-4 flex-col justify-center py-10 md:py-14 ${className}`}>
      <div className="mb-6 flex items-center gap-3 md:mb-8">
        <span className="text-sm font-black tracking-[0.2em] text-[#E0475F] tabular-nums">
          {String(index).padStart(2, '0')} / {String(CHAPTERS.length).padStart(2, '0')}
        </span>
        <span className="h-px flex-1 bg-[#241D4D]/15" />
        <span className="text-xs font-bold tracking-[0.25em] text-[#6B5B73] uppercase">{label}</span>
      </div>
      {children}
    </section>
  );
}

/* Fixed chapter dots (desktop). */
function DotNav() {
  const [active, setActive] = useState(CHAPTERS[0].id);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    CHAPTERS.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return (
    <nav aria-label="Chapters" className="fixed top-1/2 right-4 z-50 hidden -translate-y-1/2 flex-col gap-4 lg:flex">
      {CHAPTERS.map((c) => (
        <a
          key={c.id}
          href={`#${c.id}`}
          aria-label={c.label}
          className="group flex items-center justify-end gap-2"
        >
          <span
            className={`text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
              active === c.id ? 'translate-x-0 text-[#A82F43] opacity-100' : 'translate-x-2 opacity-0 group-hover:opacity-60'
            }`}
          >
            {c.label}
          </span>
          <span
            className={`rounded-full transition-all duration-300 ${
              active === c.id ? 'size-3 bg-[#E0475F] shadow-[0_0_0_4px_rgba(224,71,95,.2)]' : 'size-2 bg-[#241D4D]/25 group-hover:bg-[#241D4D]/50'
            }`}
          />
        </a>
      ))}
    </nav>
  );
}

function Footer() {  return (
    <footer className="mt-14 bg-[#241D4D] px-4 py-8 text-center text-white/75 md:mt-20">
      <img src={LOGOS.white} alt="Rotaract Club of Sukedhara logo" className="mx-auto h-16 w-auto" loading="lazy" />
      <p className="mt-3 text-sm font-bold text-white">{CLUB.name}</p>
      <p className="mt-1 text-xs">
        {CLUB.meeting} · {CLUB.venue}
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
        <a href={CLUB.igUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[#FFB86B] hover:text-white">
          <AtSign className="size-4" /> @{CLUB.ig}
        </a>
        <a href={`mailto:${CLUB.emails[0]}`} className="inline-flex items-center gap-1.5 text-[#FFB86B] hover:text-white">
          <Mail className="size-4" /> {CLUB.emails[0]}
        </a>
      </div>
      <p className="mt-4 text-[11px] text-white/45">
        Demo concept — for the real thing, visit the{' '}
        <a href="/sukedhara" className="underline underline-offset-2 hover:text-white">
          official club page
        </a>
        .
      </p>
    </footer>
  );
}

function App() {
  const calm = usePrefersReducedMotion();
  const [flip, setFlip] = useState(0);

  /* Scroll-linked slide wipe: each chapter un-clips into full view. */
  useLayoutEffect(() => {
    if (calm) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.suk-slide').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(7% 4% 7% 4% round 36px)', scale: 0.985, opacity: 0.35 },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 94%', end: 'top 42%', scrub: true }
          }
        );
      });
    });
    return () => ctx.revert();
  }, [calm]);

  return (
    <div className="min-h-screen bg-[#FFF6EC] font-[Inter] text-[#241D4D] antialiased">
      <DemoBanner />
      <DotNav />
      <Hero flip={flip} onFlip={() => setFlip((f) => f + 1)} calm={calm} />
      <Marquee />

      <main className="mx-auto max-w-6xl space-y-6 px-4 pt-6 md:space-y-10 md:px-8 md:pt-10">
        <Slide id="numbers" index={1} label="The club in numbers" data-wipe>
          <StatsBand />
        </Slide>

        <Slide id="story" index={2} label="Our story" data-wipe>
          <AboutSection />
        </Slide>

        <Slide id="goals" index={3} label="Rota year goals" data-wipe>
          <GoalsSection />
        </Slide>

        <Slide id="board" index={4} label="RY 2026-27 board" data-wipe>
          <BoardSection />
        </Slide>

        <div id="legacy" className="-mx-4 scroll-mt-4 md:-mx-8">
          <PresidentsRail />
        </div>

        <Slide id="meetup" index={6} label="Meet us Saturday" data-wipe>
          <MeetupSection />
        </Slide>
      </main>

      <Footer />
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
