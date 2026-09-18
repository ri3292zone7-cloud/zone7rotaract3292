import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, AtSign, Mail, MapPin, MousePointerClick, Sparkles } from 'lucide-react';
import HeroScene from './HeroScene';
import PhoneHop from './PhoneHop';
import { AboutSection, GoalsSection, MeetupSection, StatsBand } from './Sections';
import { CLUB } from './data';
import './demo.css';

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
  return (
    <header className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 suk-hero-glow" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-2 px-4 pt-6 pb-2 md:grid-cols-2 md:px-8 md:pt-10">
        <div className="text-center md:text-left">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#F0D9BE] bg-white/70 px-3 py-1.5 text-xs font-bold text-[#6B5B73] transition-colors hover:border-[#E0475F] hover:text-[#A82F43]"
          >
            <ArrowLeft className="size-3.5" /> Zone 7 home
          </a>
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
              href="#hop"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#241D4D]/15 bg-white/70 px-6 py-3 text-sm font-extrabold text-[#241D4D] transition-colors hover:border-[#E0475F] hover:text-[#A82F43]"
            >
              <Sparkles className="size-4" /> Hop through the club
            </a>
          </div>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#6B5B73] md:justify-start">
            <MapPin className="size-3.5" /> {CLUB.venue}
          </p>
        </div>
        <div className="relative h-[300px] sm:h-[380px] md:h-[480px]">
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

function Footer() {
  return (
    <footer className="mt-14 bg-[#241D4D] px-4 py-8 text-center text-white/75 md:mt-20">
      <p className="text-sm font-bold text-white">{CLUB.name}</p>
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

  return (
    <div className="min-h-screen bg-[#FFF6EC] font-[Inter] text-[#241D4D] antialiased">
      <DemoBanner />
      <Hero flip={flip} onFlip={() => setFlip((f) => f + 1)} calm={calm} />

      <main className="mx-auto max-w-6xl space-y-14 px-4 md:space-y-20 md:px-8">
        <section aria-label="Club at a glance">
          <StatsBand />
        </section>

        <div id="hop" className="-mx-4 scroll-mt-4 md:-mx-8">
          <PhoneHop calm={calm} />
        </div>

        <AboutSection />
        <GoalsSection />
        <MeetupSection />
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
