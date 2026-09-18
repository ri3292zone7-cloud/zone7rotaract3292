import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AtSign, ArrowDown, ArrowRight, ChevronDown, Circle, Mail, Quote, Square, Triangle } from 'lucide-react';
import { CLUB, BOARD, PROJECTS, STATS, FACTS } from './data';
import './demo.css';

/* ------------------------------------------------------------------ deco -- */

function Shape({ kind, className = '', float = false }) {
  const Tag = kind === 'circle' ? Circle : kind === 'square' ? Square : Triangle;
  return (
    <Tag
      aria-hidden="true"
      strokeWidth={2.5}
      className={`${float ? 'bau-float' : ''} ${className}`}
      style={float ? { '--r': `${((kind.charCodeAt(0) * 37) % 45) - 22}deg` } : undefined}
    />
  );
}

function BauBadge({ r = 0, rotate = false }) {
  return (
    <span
      aria-hidden="true"
      className={`bau-shadow-sm inline-grid place-items-center border-2 border-ink bg-paper ${rotate ? '-rotate-45' : ''}`}
      style={{ width: 15 + r, height: 15 + r }}
    >
      <span className="block h-1.5 w-1.5 bg-ink" style={{ width: 4 + r / 4, height: 4 + r / 4 }} />
    </span>
  );
}

/* ---------------------------------------------------------------- hero --- */

function Hero() {
  return (
    <header className="relative w-full overflow-hidden border-b-4 border-ink pt-16 pb-8 md:pt-20 md:pb-12">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        {/* copy */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-ink">
            <Shape kind="circle" className="size-5 text-red" fill="currentColor" />
            <Shape kind="square" className="-rotate-45 size-5 text-yellow" fill="currentColor" />
            <Triangle className="bau-tri size-5 text-blue" fill="currentColor" strokeWidth={0} />
            <span className="bau-label ml-3 border-2 border-ink bg-paper px-3 py-1.5">{CLUB.identity}</span>
          </div>
          <h1 className="bau-hero-xl mt-6 text-ink">
            New Road
            <br />
            City<span className="text-red">.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed font-medium text-ink/80 md:text-lg">
            {CLUB.name} — chartered {CLUB.foundedDisplay}, sponsored by the {CLUB.sponsor}, and still logging
            every one of its {CLUB.events} events across two decades of Saturdays in Makkhan Tol.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#board"
              className="bau-shadow bau-press bau-lift inline-flex items-center gap-3 border-2 border-ink bg-blue px-7 py-3.5 font-bold text-white"
            >
              Meet the board <ArrowRight className="size-5" strokeWidth={2.5} />
            </a>
            <a
              href="#projects"
              className="bau-shadow bau-press bau-lift inline-flex items-center gap-3 border-2 border-ink bg-yellow px-7 py-3.5 font-bold text-ink"
            >
              4 projects, logged
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="bau-label text-ink">Every Saturday · 10:30 AM</p>
            <p className="bau-label text-ink/60">{CLUB.venue}</p>
          </div>
        </div>

        {/* blue poster panel */}
        <div className="relative pb-6 lg:pb-0">
          <div className="bau-shadow-lg relative border-2 border-ink bg-blue p-6 md:p-10">
            <Shape kind="circle" className="bau-float absolute -top-6 -right-6 size-20 text-yellow md:size-28" fill="currentColor" float />
            <Shape kind="square" className="absolute -bottom-8 -left-8 -rotate-45 size-16 bg-red md:size-24" fill="currentColor" />
            <Triangle className="bau-tri absolute top-1/2 right-4 size-10 bg-yellow" fill="currentColor" strokeWidth={0} />
            <div className="bau-shadow border-2 border-ink bg-paper p-6 md:p-10">
              <img
                src={CLUB.logo}
                alt={`${CLUB.name} logo`}
                className="mx-auto block h-40 w-40 object-contain md:h-60 md:w-60"
                loading="eager"
              />
            </div>
            <p className="mt-6 text-center font-black tracking-[0.3em] text-white uppercase">RAC · 2004</p>
            <p className="mt-1 text-center text-sm font-semibold text-white/70">District 3292 · Zone VII</p>
          </div>
          <div className="mt-6 flex items-center justify-center gap-3 md:justify-end">
            <BauBadge r={0} />
            <BauBadge r={4} rotate />
            <BauBadge r={8} />
          </div>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------- ticker --- */

const MARQUEE = ['The Heritage Club', 'Chartered 2004', 'New Road · Makkhan Tol', 'Zone VII · D-3292', 'Saturdays at 10:30 AM', '33 events · 186 reports'];

function Ticker() {
  const row = [...MARQUEE, ...MARQUEE];
  return (
    <div className="bau-shadow overflow-hidden border-b-4 border-ink bg-ink" aria-hidden="true">
      <div className="bau-track flex w-max items-center gap-8 py-3 pr-8">
        {row.map((item, i) => (
          <span key={i} className="bau-label flex items-center gap-8 whitespace-nowrap text-yellow">
            {item}
            <span className="size-2 rotate-45 bg-yellow" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- numbers band -- */

function NumbersBand() {
  return (
    <section className="w-full border-b-4 border-ink bg-yellow">
      <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`flex flex-col items-center justify-center gap-1 border-ink px-4 py-10 text-center md:py-14 ${
              i % 2 === 1 ? 'border-l-4' : ''
            } ${i >= 2 ? 'border-t-4' : ''} ${i === 3 ? 'lg:border-l-4' : 'lg:border-l-0'} ${
              i === 2 ? 'lg:border-l-4 lg:border-t-0' : 'lg:border-t-0'
            } ${i === 0 ? 'lg:border-l-0' : ''}`}
          >
            <div className="bau-shadow text-5xl font-black tracking-tight text-ink md:text-7xl">{s.value}</div>
            <div className="bau-label text-ink/80">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- board -------- */

const ROLE_TINTS = {
  President: 'bg-red text-white',
  'IPP · Club Service Chair': 'bg-paper text-ink'
};

function BoardSection() {
  const president = BOARD[0];
  const officers = BOARD.slice(1);
  return (
    <section id="board" className="w-full scroll-mt-24 border-b-4 border-ink py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <span className="bau-label inline-flex items-center gap-3 border-2 border-ink bg-paper px-3 py-1.5">
          <span className="size-2 rotate-45 bg-red" /> The board
        </span>
        <h2 className="bau-headline mt-6 text-ink">
          Eight officers.
          <br />
          One club<span className="text-blue">.</span>
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed font-medium text-ink/70 md:text-lg">
          The 2026–27 board of the Rotaract Club of New Road City — from the president&rsquo;s seat to
          professional development, seven posts deep.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* president — featured */}
          <div className="bau-shadow-lg bau-lift relative overflow-hidden border-2 border-ink bg-ink md:col-span-2 md:row-span-2">
            <img
              src={president.img}
              alt={`${president.name}, President`}
              className="h-72 w-full object-cover grayscale md:h-full md:min-h-[460px] md:grayscale-0"
              loading="lazy"
            />
            <span aria-hidden="true" className="bau-shadow-sm absolute top-4 right-4 grid size-9 place-items-center bg-yellow">
              <Shape kind="square" className="-rotate-45 size-4 text-ink" fill="currentColor" />
            </span>
            <div className="border-t-4 border-ink bg-ink p-6 text-white md:absolute md:right-4 md:-bottom-1 md:w-[72%] md:border md:border-ink md:bg-ink md:shadow-[8px_8px_0_0_#f0c020]">
              <p className="bau-label text-yellow">President · RY 2026–27</p>
              <h3 className="mt-1 text-2xl font-black tracking-tight md:text-3xl">{president.name}</h3>
            </div>
          </div>

          {/* officers */}
          {officers.map((m, i) => (
            <article
              key={m.name}
              className="bau-shadow bau-lift relative border-2 border-ink bg-paper"
            >
              <div className="relative overflow-hidden border-b-2 border-ink">
                <img
                  src={m.img}
                  alt={`${m.name}, ${m.role}`}
                  className="h-48 w-full object-cover grayscale transition duration-300 hover:grayscale-0 md:h-52"
                  loading="lazy"
                />
                {i % 3 === 2 && (
                  <Triangle className="bau-tri absolute -top-2 right-6 size-9 bg-red" fill="currentColor" strokeWidth={0} style={{ rotate: '180deg' }} />
                )}
              </div>
              <div className="p-5">
                <p className={`bau-label inline-block px-2 py-1 ${ROLE_TINTS[m.role] ?? 'bg-paper text-ink'}`}>{m.role}</p>
                <h3 className="mt-3 text-lg leading-tight font-black tracking-tight text-ink">{m.name}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ projects ---- */

const CAT_TINT = {
  Fellowship: 'bg-yellow text-ink',
  Counseling: 'bg-blue text-white',
  'Fund Raising': 'bg-red text-white',
  Environment: 'bg-yellow text-ink'
};

function ProjectsSection() {
  return (
    <section id="projects" className="w-full scroll-mt-24 border-b-4 border-ink bg-blue py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <span className="bau-label inline-flex items-center gap-3 border-2 border-ink bg-yellow px-3 py-1.5">
          <span className="size-2 bg-ink" /> Field log
        </span>
        <h2 className="bau-headline mt-6 text-white">
          Four projects,
          <br />
          logged<span className="text-yellow">.</span>
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed font-medium text-white/80 md:text-lg">
          Goodwill, wellbeing, fellowship and green — the club&rsquo;s logged work from the last year on record.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <article key={p.num} className="bau-shadow-lg bau-lift group relative overflow-hidden border-2 border-ink bg-paper">
              <div className="flex items-center justify-between border-b-2 border-ink px-5 py-3 md:px-6">
                <p className="bau-label text-ink/60">Project {p.num}</p>
                <span className={`bau-label px-2 py-1 ${CAT_TINT[p.category] ?? 'bg-paper text-ink'}`}>{p.category}</span>
              </div>
              <div className="relative p-5 md:p-8">
                <div className="pointer-events-none absolute -top-2 right-4 text-[5.5rem] leading-none font-black text-mute/70 select-none md:text-[7rem]">
                  {i + 1}
                </div>
                <h3 className="relative max-w-[85%] text-xl leading-tight font-black tracking-tight text-ink md:text-2xl">
                  {p.title}
                </h3>
                <p className="bau-label mt-2 text-ink/60">
                  {p.date} · {p.place}
                </p>
                <p className="relative mt-4 max-w-xl text-[0.95rem] leading-relaxed font-medium text-ink/75">{p.tag}</p>
              </div>
              <div className="flex items-center gap-2 border-t-2 border-ink bg-mute/60 px-5 py-3 md:px-6">
                <BauBadge r={i % 3 === 2 ? 6 : 0} rotate={i % 3 === 1} />
                <span className="bau-label text-ink/70">New Road City · Serviced</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- about ---- */

function AboutSection() {
  return (
    <section className="w-full border-b-4 border-ink py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 md:px-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="bau-label inline-flex items-center gap-3 border-2 border-ink bg-paper px-3 py-1.5">
            <span className="size-2 rotate-45 bg-blue" /> The club
          </span>
          <h2 className="bau-headline mt-6 text-ink">
            Two decades
            <br />
            of service<span className="text-red">.</span>
          </h2>
          <div className="bau-shadow relative mt-8 border-2 border-ink bg-yellow p-6 md:p-8">
            <Quote className="absolute top-4 right-4 size-8 text-ink/70" strokeWidth={2} />
            <p className="max-w-xl text-lg leading-relaxed font-medium text-ink md:text-xl">{CLUB.about}</p>
          </div>
        </div>

        <div className="bau-shadow-lg border-2 border-ink bg-paper">
          {FACTS.map((f, i) => (
            <div
              key={f.k}
              className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-ink px-5 py-4 md:px-7 md:py-5 ${
                i > 0 ? 'border-t-4' : ''
              }`}
            >
              <span className="bau-label text-ink/50">{f.k}</span>
              <span className="text-lg font-bold tracking-tight text-ink md:text-xl">{f.v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- join ------ */

function JoinSection() {
  return (
    <section id="join" className="relative w-full scroll-mt-24 border-b-4 border-ink bg-red py-16 md:py-24">
      <div className="absolute inset-0 overflow-hidden opacity-[0.06]" aria-hidden="true">
        <div className="h-full w-full" style={{ backgroundImage: 'repeating-linear-gradient(0deg,#fff 0 1px,transparent 1px 42px),repeating-linear-gradient(90deg,#fff 0 1px,transparent 1px 42px)' }} />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 text-center md:px-8">
        <div className="mb-8 flex items-center justify-center gap-3">
          <Shape kind="circle" className="size-6 text-yellow" fill="currentColor" />
          <Shape kind="square" className="-rotate-45 size-6 bg-yellow" fill="currentColor" />
          <Triangle className="bau-tri size-6 bg-yellow" fill="currentColor" strokeWidth={0} />
        </div>
        <p className="bau-label text-white/70">The invite</p>
        <h2 className="bau-headline mt-4 text-white">
          Every Saturday,
          <br />
          10:30 AM<span className="text-yellow">.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed font-medium text-white/80 md:text-lg">
          {CLUB.venue} — show up, join in, and add your name to the next two decades.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href={CLUB.igUrl}
            target="_blank"
            rel="noreferrer"
            className="bau-shadow bau-press bau-lift inline-flex items-center gap-3 border-2 border-ink bg-yellow px-7 py-3.5 font-bold text-ink"
          >
            <AtSign className="size-5" strokeWidth={2.5} /> @{CLUB.ig}
          </a>
          <a
            href={`mailto:${CLUB.emails[0]}`}
            className="bau-shadow bau-press bau-lift inline-flex items-center gap-3 border-2 border-ink bg-white px-7 py-3.5 font-bold text-ink"
          >
            <Mail className="size-5" strokeWidth={2.5} /> Write to the club
          </a>
        </div>
        <div className="mt-8 inline-flex items-center gap-2 text-white/70">
          <ChevronDown className="size-4" strokeWidth={2.5} />
          <span className="bau-label">New Road · Makkhan Tol · Yetkha</span>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- footer ---- */

function Footer() {
  return (
    <footer className="w-full bg-ink px-4 py-16 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center">
        <div className="bau-shadow-sm">
          <img src={CLUB.logo} alt={`${CLUB.name} logo`} className="h-16 w-16 border-2 border-white bg-paper object-contain p-1" loading="lazy" />
        </div>
        <div>
          <p className="text-xl font-black tracking-tight">{CLUB.name}</p>
          <p className="bau-label mt-2 text-white/60">{CLUB.meeting} · {CLUB.venue}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={CLUB.igUrl}
            target="_blank"
            rel="noreferrer"
            className="bau-shadow-sm bau-press bau-lift inline-flex items-center gap-2 border-2 border-white bg-blue px-5 py-2.5 text-sm font-bold text-white"
          >
            <AtSign className="size-4" strokeWidth={2.5} /> @{CLUB.ig}
          </a>
          <a
            href={`mailto:${CLUB.emails[0]}`}
            className="bau-shadow-sm bau-press bau-lift inline-flex items-center gap-2 border-2 border-white bg-yellow px-5 py-2.5 text-sm font-bold text-ink"
          >
            <Mail className="size-4" strokeWidth={2.5} /> {CLUB.emails[0]}
          </a>
        </div>
        <p className="bau-label mt-6 text-white/50">
          Zone 7 concept page — for live updates, visit the{' '}
          <a href="/newroadcity/official" className="font-black text-yellow underline underline-offset-2 hover:text-white">
            official club page
          </a>
          .
        </p>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------- app ----- */

function App() {
  return (
    <div id="top" className="min-h-screen bg-canvas font-sans text-ink antialiased">
      <Hero />
      <Ticker />
      <NumbersBand />
      <BoardSection />
      <ProjectsSection />
      <AboutSection />
      <JoinSection />
      <Footer />
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);