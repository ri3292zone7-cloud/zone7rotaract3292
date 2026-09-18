import { StrictMode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowRight, AtSign, Mail, MousePointerClick } from 'lucide-react';
import GearScene from './GearScene';
import { Lightbox, ProjectsTimeline, SaturdaySection, VoicesStrip, useLightbox } from './FieldStory';
import { BoardSection, PresidentsRail } from './Leadership';
import { AboutSection, GoalsSection, MeetupSection, QuickFacts } from './Sections';
import { CLUB, STATS } from './data';
import { LOGOS } from './photos';
import './demo.css';

gsap.registerPlugin(ScrollTrigger);

const CONFETTI_COLORS = ['#8B5CF6', '#F472B6', '#FBBF24', '#34D399', '#1E293B'];

function popConfetti(x, y, count = 46) {
  for (let i = 0; i < count; i++) {
    const bit = document.createElement('span');
    const size = 6 + Math.random() * 8;
    const round = Math.random() > 0.6;
    bit.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px;height:${size}px;z-index:90;pointer-events:none;${
      round ? 'border-radius:9999px;' : 'border-radius:2px;transform:rotate(45deg);'
    }background:${CONFETTI_COLORS[i % CONFETTI_COLORS.length]};`;
    document.body.appendChild(bit);
    const dx = (Math.random() - 0.5) * 480;
    const dy = -90 - Math.random() * 300;
    bit
      .animate(
        [
          { transform: 'translate(0,0) rotate(0deg) scale(1)', opacity: 1 },
          { transform: `translate(${dx * 0.7}px,${dy}px) rotate(180deg) scale(0.9)`, opacity: 1, offset: 0.45 },
          { transform: `translate(${dx}px,${dy + 460}px) rotate(360deg) scale(0.4)`, opacity: 0 }
        ],
        { duration: 1250 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.3,1)' }
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


function Magnetic({ children }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${dx * 0.1}px, ${dy * 0.16}px)`;
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

/* Rotated paper shapes scattered behind content. */
function Confetti({ count = 6, className = '' }) {
  const styles = [
    'bg-rose rotate-[18deg] rounded-lg',
    'bg-mint -rotate-12 rounded-full',
    'bg-gold rotate-6',
    'bg-plum rotate-[24deg] rounded-full',
    'bg-rose rotate-45 rounded-full',
    'bg-mint rotate-[8deg]'
  ];
  const pos = ['top-8 left-8', 'top-1/4 right-6', 'bottom-10 left-1/4', 'top-[55%] left-12', 'right-1/4 top-2', 'bottom-6 right-8'];
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute inset-0 z-0 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`absolute ${pos[i % pos.length]} ${styles[i % styles.length]} block h-5 w-5 opacity-80`}
        />
      ))}
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
        yPercent: -6,
        opacity: 0.85,
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
    el.style.transform = `translate(${e.clientX - r.left - 180}px, ${e.clientY - r.top - 180}px)`;
  };

  return (
    <header ref={rootRef} onPointerMove={onGlow} className="relative min-h-[100svh] overflow-hidden pt-12 pb-16 md:pt-14">
      {/* giant amber sun behind the headline */}
      <div aria-hidden="true" className="suk-shadow absolute -top-24 -left-20 md:top-4 md:left-[2%] h-56 w-56 rounded-full bg-gold md:h-80 md:w-80" />
      <div aria-hidden="true" className="absolute top-16 right-[4%] hidden h-10 w-10 -rotate-12 rounded-xl bg-rose md:block" />
      <div aria-hidden="true" className="absolute bottom-24 left-[6%] hidden h-8 w-8 rotate-12 rounded-xl bg-mint md:block" />
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 hidden h-72 w-72 rounded-full bg-plum/20 blur-3xl md:block"
      />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-8 px-4 md:grid-cols-2 md:px-8">
        <div ref={copyRef} className="text-left will-change-transform">
          <p className="suk-pop inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-2 text-sm font-bold text-ink suk-shadow-sm">
            <span className="suk-wiggle text-gold">✦</span> The Compassion Club · Chartered 2019
          </p>
          <h1 className="suk-hero-title suk-pop mt-6 text-ink [animation-delay:120ms]">
            We show up,
            <br />
            we <span className="text-mint">build</span>,
            <br />
            <span className="text-plum">we serve</span>
            <span className="text-gold">.</span>
          </h1>
          <p className="suk-pop mt-6 max-w-xl text-base leading-relaxed text-mut [animation-delay:220ms] md:text-lg">
            Twenty members, nine field projects this year, and a Saturday-morning room in Baneshwar that
            learns your name by the second visit.
          </p>
          <div className="suk-pop mt-7 flex flex-wrap gap-4 [animation-delay:320ms]">
            <Magnetic>
              <a
                href="#story"
                className="suk-shadow suk-lift inline-flex items-center gap-3 rounded-full border-2 border-ink bg-plum px-7 py-3.5 font-bold text-white"
              >
                Read the story
                <span className="grid size-7 place-items-center rounded-full bg-white text-ink">
                  <ArrowRight className="size-4" strokeWidth={2.5} />
                </span>
              </a>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                onClick={onSpin}
                className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-transparent px-7 py-3.5 font-bold text-ink transition-colors duration-300 hover:bg-gold focus-visible:ring-4 focus-visible:ring-plum/40 focus-visible:outline-none"
              >
                <MousePointerClick className="size-5" strokeWidth={2.5} /> Poke the logo
              </button>
            </Magnetic>
          </div>
          <p className="suk-pop mt-6 inline-flex items-center gap-2 rounded-2xl bg-mut/70 px-4 py-2 text-sm font-semibold tracking-wide text-ink uppercase [animation-delay:420ms]">
            <span className="hidden text-mint md:inline">✦</span> {CLUB.venue} · {CLUB.meeting}
          </p>
        </div>

        <div ref={gearBoxRef} className="relative">
          <div aria-hidden="true" className="suk-shadow absolute inset-0 -rotate-2 rounded-[3rem] rounded-tl-full bg-white suk-dots p-6" />
          <div className="suk-pop relative h-[300px] sm:h-[380px] md:h-[480px] [animation-delay:120ms]">
            <GearScene ref={gearRef} calm={calm} onSpin={onSpin} />
            {!calm && (
              <p className="suk-flicker absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full border-2 border-ink bg-gold px-3 py-1 text-xs font-bold whitespace-nowrap text-ink suk-shadow-sm">
                Poke the logo
              </p>
            )}
          </div>
          <span aria-hidden="true" className="absolute -top-4 -right-3 grid size-12 rotate-12 place-items-center rounded-2xl border-2 border-ink bg-mint text-2xl suk-shadow">✦</span>
          <span aria-hidden="true" className="absolute -bottom-5 -left-4 grid size-12 -rotate-6 place-items-center rounded-full border-2 border-ink bg-rose text-lg suk-shadow-sm" />
        </div>
      </div>

      <a
        href="#numbers"
        aria-label="Scroll to the numbers"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs font-bold tracking-[0.14em] text-mut uppercase transition-colors hover:text-ink md:flex"
      >
        <ArrowDown className="size-5 animate-bounce" strokeWidth={2.5} />
        Scroll
      </a>
    </header>
  );
}

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
  const tints = ['text-plum', 'text-rose', 'text-gold', 'text-mint'];
  const turns = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2'];
  return (
    <section id="numbers" ref={ref} className="suk-slide relative w-full scroll-mt-24 py-16 md:py-20">
      <Confetti count={5} className="opacity-70" />
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`suk-shadow-lg group rounded-3xl border-2 border-ink bg-white p-6 text-center transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:scale-105 ${turns[i % 4]}`}
            >
              <div className={`suk-wiggle font-display text-4xl font-extrabold tabular-nums md:text-6xl ${tints[i % 4]}`}>
                {s.plain ? s.value : `${s.value}${s.suffix}`}
              </div>
              <div className="mt-2 text-xs font-bold tracking-[0.14em] text-mut uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const MARQUEE = ['Service Above Self', 'Saturdays at 10 AM', 'The Compassion Club', 'Since 2019 · Baneshwor', 'District 3292 · Zone VII'];

function Ticker() {
  const row = [...MARQUEE, ...MARQUEE];
  return (
    <div className="border-y-2 border-ink bg-gold py-3" aria-hidden="true">
      <div className="suk-ticker-track flex w-max items-center gap-7 pr-7">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-7 text-sm font-extrabold tracking-[0.08em] whitespace-nowrap text-ink uppercase">
            {item}
            <span className={`grid size-6 shrink-0 place-items-center rounded-full border-2 border-ink text-[10px] ${i % 2 ? 'bg-rose' : 'bg-mint'}`}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Band({ id, kicker, title, sub, children, className = '' }) {
  return (
    <section id={id} className={`suk-slide relative w-full scroll-mt-24 py-16 md:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <p className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-1.5 text-xs font-bold tracking-[0.1em] text-ink uppercase suk-shadow-sm">
          <span className="text-plum">✦</span> {kicker}
        </p>
        <h2 className="mt-5 max-w-3xl font-display text-3xl font-extrabold text-ink md:text-6xl">{title}</h2>
        {sub && <p className="mt-4 max-w-2xl text-base leading-relaxed text-mut md:text-lg">{sub}</p>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-ink px-4 py-14 text-center text-white">
      <Confetti count={5} className="opacity-40" />
      <img src={LOGOS.white} alt="Rotaract Club of Sukedhara logo" className="mx-auto h-16 w-auto" loading="lazy" />
      <p className="mt-5 font-display text-xl font-bold text-white">{CLUB.name}</p>
      <p className="mt-1 text-sm tracking-wide text-white/70">{CLUB.meeting} · {CLUB.venue}</p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
        <a
          href={CLUB.igUrl}
          target="_blank"
          rel="noreferrer"
          className="suk-shadow-sm suk-lift inline-flex items-center gap-2 rounded-full border-2 border-white bg-plum px-5 py-2.5 text-sm font-bold text-white"
        >
          <AtSign className="size-4" strokeWidth={2.5} /> @{CLUB.ig}
        </a>
        <a
          href={`mailto:${CLUB.emails[0]}`}
          className="suk-shadow-sm suk-lift inline-flex items-center gap-2 rounded-full border-2 border-white bg-mint px-5 py-2.5 text-sm font-bold text-ink"
        >
          <Mail className="size-4" strokeWidth={2.5} /> {CLUB.emails[0]}
        </a>
      </div>
      <p className="mt-8 text-xs font-semibold tracking-[0.1em] text-white/60 uppercase">
        Demo concept — for the real thing, visit the{' '}
        <a href="/sukedhara/official" className="font-bold text-rose underline underline-offset-2 hover:text-gold">
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
      popConfetti(r.left + r.width / 2, r.top + r.height / 2);
    }
  };

  useLayoutEffect(() => {
    if (calm) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.suk-slide').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0.3, y: 14 },
          {
            opacity: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 98%', end: 'top 55%', scrub: true }
          }
        );
      });
    });
    return () => ctx.revert();
  }, [calm]);

  return (
    <div className="min-h-screen bg-page font-sans text-ink antialiased">
      <div className="suk-grain" aria-hidden="true" />
      <Hero calm={calm} gearRef={gearRef} gearBoxRef={gearBoxRef} onSpin={handleSpin} />
      <Ticker />

<Band
        id="story"
        kicker="Story"
        title="Welcome to Sukedhara."
        sub={`${CLUB.identity} since ${CLUB.foundedDisplay} — registered, sponsored, and still logging every single event.`}
      >
        <AboutSection />
        <div className="mt-12">
          <QuickFacts />
        </div>
      </Band>

      <Band
        id="promises"
        kicker="Promises"
        title="Four promises, in progress."
        sub="Member engagement · partnerships · governance · leadership."
        className="bg-mut/60"
      >
        <GoalsSection />
      </Band>

      <section id="board" className="suk-slide relative w-full scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-1.5 text-xs font-bold tracking-[0.1em] text-ink uppercase suk-shadow-sm">
            <span className="text-rose">✦</span> The people
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-3xl font-extrabold text-ink md:text-6xl">
            Thirteen faces, one club.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-mut md:text-lg">
            Officers who plan, fund, film and fetch — the president at the head, everyone else hot on her heels.
          </p>
          <div className="mt-10">
            <BoardSection />
          </div>
        </div>
      </section>

      <Band
        id="field"
        kicker="Field logs"
        title="A year out there, logged."
        sub="Nine projects from one year of Saturdays — tap a photo (or hit Open gallery) to see the field shots."
      >
        <ProjectsTimeline onOpenGallery={openGallery} />
      </Band>

      <section id="saturday" className="suk-slide w-full scroll-mt-24 bg-mut/60 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-1.5 text-xs font-bold tracking-[0.1em] text-ink uppercase suk-shadow-sm">
            <span className="text-mint">✦</span> Saturdays
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-3xl font-extrabold text-ink md:text-6xl">A Saturday at ten.</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-mut md:text-lg">
            Arrival, fellowship, planning, closing circle — four beats, one morning.
          </p>
          <div className="mt-10">
            <SaturdaySection onOpenGallery={openGallery} />
          </div>
        </div>
      </section>

      <div id="presidents" className="scroll-mt-24 w-full">
        <PresidentsRail />
      </div>

      <Band
        id="voices"
        kicker="Voices"
        title="Why they stay."
      >
        <VoicesStrip />
      </Band>

      <section id="join" className="suk-slide relative w-full scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-1.5 text-xs font-bold tracking-[0.1em] text-ink uppercase suk-shadow-sm">
            <span className="text-gold">✦</span> The invite
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-3xl font-extrabold text-ink md:text-6xl">Turn up, Saturday.</h2>
          <div className="mt-10">
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