import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AtSign,
  ArrowRight,
  CalendarDays,
  Mail,
  MapPin,
  Quote,
  Sparkles,
  Users,
  Mountain
} from 'lucide-react';
import { CLUB, BOARD, PROJECTS, STATS, GOALS, FACTS } from './data';
import './demo.css';

function initialsOf(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

/* -------------------------------------------------------------- shared ---- */

function SectionHead({ kicker, title, sub, tint = 'text-neu-acc' }) {
  return (
    <div className="max-w-3xl">
      <span className="neu-raised-sm inline-flex items-center gap-2 rounded-2xl bg-neu-surface px-4 py-2 text-[0.72rem] font-bold tracking-[0.18em] uppercase">
        <Sparkles className={`size-3.5 ${tint}`} strokeWidth={2.5} />
        {kicker}
      </span>
      <h2 className="neu-display mt-6 text-3xl font-extrabold tracking-tight text-neu-ink sm:text-4xl md:text-5xl">{title}</h2>
      {sub && <p className="mt-4 max-w-2xl text-base leading-relaxed text-neu-mut md:text-lg">{sub}</p>}
    </div>
  );
}

function Avatar({ name, photo, className = '', text = '' }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        loading="lazy"
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className={`neu-pressed-deep grid place-items-center rounded-full bg-neu-surface ${className}`}
    >
      <span className="neu-display font-extrabold text-neu-ink" style={{ fontSize: text || undefined }}>
        {initialsOf(name)}
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------- hero --- */

function Hero() {
  return (
    <header className="relative w-full overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24">
      {/* ambient raised/inset blobs */}
      <div aria-hidden="true" className="neu-ring absolute -top-24 -right-24 h-80 w-80 rounded-full bg-neu-surface sm:h-96 sm:w-96" />
      <div aria-hidden="true" className="neu-ring in neu-anim-breathe absolute top-[30%] -left-28 h-72 w-72 rounded-full bg-neu-surface sm:h-80 sm:w-80" />
      <div aria-hidden="true" className="neu-ring neu-anim-float absolute bottom-[-6rem] right-[10%] h-64 w-64 rounded-full bg-neu-surface" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="relative z-10">
          <span className="neu-raised-sm inline-flex items-center gap-2 rounded-2xl bg-neu-surface px-4 py-2 text-[0.72rem] font-bold tracking-[0.18em] uppercase">
            <Mountain className="size-3.5 text-neu-teal" strokeWidth={2.5} />
            {CLUB.identity} · Vision “{CLUB.vision}”
          </span>
          <h1 className="neu-display mt-7 text-5xl leading-[1.05] font-extrabold tracking-tight text-neu-ink sm:text-6xl md:text-7xl lg:text-8xl">
            Kathmandu
            <br />
            <span className="text-neu-acc">Height</span> rises.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed font-medium text-neu-mut md:text-xl">
            Chartered {CLUB.foundedDisplay} and sponsored by the {CLUB.sponsor}. Based at New Summit College in
            Baneshwar — building competent leaders, one Saturday morning at a time.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {[
              { icon: Users, label: `${CLUB.active} members` },
              { icon: Mountain, label: `${PROJECTS.length} projects logged` },
              { icon: CalendarDays, label: CLUB.meeting }
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="neu-raised-sm inline-flex items-center gap-2 rounded-2xl bg-neu-surface px-4 py-2.5 text-sm font-semibold text-neu-ink"
              >
                <Icon className="size-4 text-neu-acc" strokeWidth={2.5} />
                {label}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#projects"
              className="neu-squish neu-focus inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#6C63FF] px-8 text-base font-bold text-white transition-colors duration-300 hover:bg-[#8B84FF]"
            >
              See the projects <ArrowRight className="size-5" strokeWidth={2.5} />
            </a>
            <a
              href="#about"
              className="neu-squish neu-focus inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-neu-surface px-8 text-base font-bold text-neu-ink transition-colors duration-300"
            >
              About the club
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="neu-raised neu-anim-float relative rounded-[2rem] bg-neu-surface p-8 sm:rounded-[2.5rem] sm:p-12">
            <div aria-hidden="true" className="neu-ring in absolute -top-6 -right-6 h-20 w-20 rounded-full bg-neu-surface" />
            <div aria-hidden="true" className="neu-ring in absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-neu-surface" />
            <div className="relative flex flex-col items-center gap-6">
              <Avatar
                name={CLUB.name}
                photo={CLUB.logo}
                className="neu-raised-sm h-40 w-40 rounded-[2rem] object-contain p-3 sm:h-52 sm:w-52"
              />
              <div className="text-center">
                <p className="neu-display text-xl font-extrabold text-neu-ink sm:text-2xl">{CLUB.short}</p>
                <p className="mt-1 text-sm font-medium text-neu-mut">{CLUB.fullLoc}</p>
              </div>
              <a
                href={CLUB.igUrl}
                target="_blank"
                rel="noreferrer"
                className="neu-squish neu-focus inline-flex h-12 items-center gap-2 rounded-2xl bg-neu-surface px-6 text-sm font-bold text-neu-ink"
              >
                <AtSign className="size-4 text-neu-teal" strokeWidth={2.5} /> @{CLUB.ig}
              </a>
            </div>
          </div>

          <div className="neu-raised-sm neu-anim-float-d absolute -top-5 -right-3 hidden items-center gap-2 rounded-2xl bg-neu-surface px-4 py-3 text-sm font-bold text-neu-ink sm:flex lg:-right-6">
            <Mountain className="size-4 text-neu-acc" strokeWidth={2.5} /> The Rising Club
          </div>
          <div className="neu-raised-sm neu-anim-float-slow absolute -bottom-5 -left-3 hidden items-center gap-2 rounded-2xl bg-neu-surface px-4 py-3 text-sm font-bold text-neu-ink sm:flex lg:-left-6">
            <Sparkles className="size-4 text-neu-teal" strokeWidth={2.5} /> Chartered 2026
          </div>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------- stats ----- */

function StatsBand() {
  return (
    <section className="w-full pb-4">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="neu-raised rounded-[2rem] bg-neu-surface p-6 sm:rounded-[2.5rem] sm:p-10">
          <div className="grid grid-cols-2 gap-5 sm:gap-8 md:grid-cols-4">
            {STATS.map((s, i) => (
              <div key={s.label} className="flex flex-col items-center gap-3 text-center">
                <div
                  className={`neu-pressed-deep neu-anim-breathe grid h-24 w-24 place-items-center rounded-[2rem] bg-neu-surface sm:h-28 sm:w-28`}
                  style={{ animationDelay: `${i * 0.6}s` }}
                >
                  <span className="neu-display text-3xl font-extrabold text-neu-acc sm:text-4xl">{s.value}</span>
                </div>
                <span className="px-2 text-xs font-bold tracking-[0.14em] uppercase text-neu-mut sm:text-sm">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- board ----- */

function Board() {
  if (!BOARD || BOARD.length === 0) {
    return (
      <section id="board" className="w-full scroll-mt-24 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <SectionHead
            kicker="Leadership"
            title="The board is taking shape."
            sub="Kathmandu Height chartered in January 2026 and its officer line-up is being finalised — the first board will be published here as soon as it is on record."
          />
          <div className="neu-raised-sm mt-12 rounded-[2rem] bg-neu-surface p-8 text-center text-sm font-medium text-neu-mut sm:p-12">
            <span className="neu-pressed-sm mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-neu-surface">
              <Users className="size-7 text-neu-teal" strokeWidth={2} />
            </span>
            <p>No board line-up on record yet. Club officers can add the President and team via the</p>
            <p className="mt-2">
              <a href="/admin" className="font-bold text-neu-acc underline underline-offset-4 hover:text-neu-acc-light">
                Club Admin panel
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    );
  }

  const president = BOARD[0];
  const officers = BOARD.slice(1);
  return (
    <section id="board" className="w-full scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHead
          kicker="The people"
          title="The board behind the height."
          sub={`From the president’s seat to every chair — the ${CLUB.short} team that plans, funds and delivers the year.`}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <article className="neu-raised neu-card-lift relative overflow-hidden rounded-[2rem] bg-neu-surface p-7 sm:col-span-2 sm:p-9 xl:col-span-2 xl:row-span-2">
            <div className="flex h-full flex-col items-start gap-5">
              <Avatar
                name={president.name}
                photo={president.photo}
                className="h-28 w-28 rounded-[2rem] sm:h-36 sm:w-36"
                text="3rem"
              />
              <div className="mt-auto">
                <p className="text-xs font-bold tracking-[0.18em] uppercase text-neu-teal">President · RY 2026–27</p>
                <h3 className="neu-display mt-2 text-2xl font-extrabold text-neu-ink sm:text-3xl">{president.name}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-neu-mut sm:text-base">
                  Leading {CLUB.short} through its vision of growing competent leaders — one Saturday morning at a
                  time.
                </p>
              </div>
            </div>
          </article>

          {officers.map((m) => (
            <article
              key={`${m.name}-${m.role}`}
              className="neu-raised neu-card-lift relative flex flex-col overflow-hidden rounded-[2rem] bg-neu-surface p-6"
            >
              <Avatar name={m.name} photo={m.photo} className="h-16 w-16 rounded-2xl" text="1.25rem" />
              <h3 className="neu-display mt-4 text-lg font-extrabold text-neu-ink">{m.name}</h3>
              <p className="mt-1 text-xs font-bold tracking-[0.12em] uppercase text-neu-mut">{m.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- projects --- */

function Projects() {
  return (
    <section id="projects" className="w-full scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHead
          kicker="In pictures"
          title="Projects that gave the club its footing."
          sub="Four records logged in the club’s first months — from Maghe Sankranti to warm clothes in Kavre. The pictures tell the story."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:gap-10">
          {PROJECTS.map((p, i) => (
            <article
              key={p.title}
              className="neu-raised neu-card-lift group relative flex flex-col overflow-hidden rounded-[2rem] bg-neu-surface"
            >
              <div className="relative overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-[1.04] sm:h-72"
                />
                <span className="neu-raised-sm absolute left-4 top-4 rounded-2xl bg-neu-surface px-4 py-2 text-[0.7rem] font-bold tracking-[0.16em] uppercase text-neu-acc">
                  {p.category}
                </span>
              </div>
              <div className="flex flex-col gap-3 p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase text-neu-mut">
                  <CalendarDays className="size-3.5" strokeWidth={2.5} />
                  {p.date}
                  <span className="text-neu-teal">·</span>
                  <MapPin className="size-3.5" strokeWidth={2.5} />
                  <span className="normal-case tracking-normal">{p.place}</span>
                </div>
                <h3 className="neu-display text-2xl font-extrabold text-neu-ink sm:text-3xl">{p.title}</h3>
                <p className="text-base leading-relaxed text-neu-mut">{p.tag}</p>
              </div>
            </article>
          ))}

          <article className="neu-pressed-deep relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-neu-surface p-8 sm:p-10">
            <Quote className="absolute right-8 top-8 size-9 text-neu-teal/30" strokeWidth={1.5} />
            <div>
              <p className="text-[0.72rem] font-bold tracking-[0.2em] uppercase text-neu-mut">The vision</p>
              <h3 className="neu-display mt-3 text-3xl leading-tight font-extrabold text-neu-ink sm:text-4xl">
                “{CLUB.vision}”
              </h3>
              <p className="mt-4 max-w-md text-base leading-relaxed text-neu-mut">
                Every project builds leaders — through service, partnership and learning across Kathmandu and beyond.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-neu-mut">
              <Mountain className="size-5 text-neu-acc" strokeWidth={2.5} />
              Supported by {CLUB.sponsor}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- about ----- */

function About() {
  return (
    <section id="about" className="w-full scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHead
            kicker="The club"
            title="The newest club in Zone 7."
            tint="text-neu-teal"
          />
          <div className="neu-raised mt-8 rounded-[2rem] bg-neu-surface p-7 sm:p-9">
            <blockquote className="text-lg leading-relaxed font-medium text-neu-ink sm:text-xl">
              {CLUB.about}
            </blockquote>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="neu-raised rounded-[2rem] bg-neu-surface p-2 sm:p-3">
            {FACTS.map((f, i) => (
              <div
                key={`${f.k}-${f.v}`}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-neu-sh-dark/20 px-5 py-4 last:border-b-0 sm:px-6"
              >
                <span className="text-xs font-bold tracking-[0.16em] uppercase text-neu-mut">{f.k}</span>
                <span className="text-right text-base font-bold text-neu-ink sm:text-lg">{f.v}</span>
              </div>
            ))}
          </div>
          <div className="neu-raised rounded-[2rem] bg-neu-surface p-7 sm:p-8">
            <p className="text-[0.72rem] font-bold tracking-[0.2em] uppercase text-neu-acc">Goals on record</p>
            <ul className="mt-4 space-y-3">
              {GOALS.map((g) => (
                <li key={g.t} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-3 text-base font-semibold text-neu-ink">
                    <span className="neu-pressed-sm grid size-6 shrink-0 place-items-center rounded-full bg-neu-surface">
                      <span className="size-1.5 rounded-full bg-neu-acc" />
                    </span>
                    {g.t}
                  </span>
                  <span className="rounded-2xl bg-neu-acc/10 px-3 py-1 text-xs font-bold text-neu-acc">{g.s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- join ----- */

function Meetup() {
  return (
    <section id="join" className="w-full scroll-mt-24 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="neu-pressed-deep relative overflow-hidden rounded-[2.5rem] bg-neu-surface p-8 text-center sm:p-14">
          <div aria-hidden="true" className="neu-ring neu-anim-float absolute -left-10 -top-14 h-40 w-40 rounded-full bg-neu-surface" />
          <div aria-hidden="true" className="neu-ring in neu-anim-float-slow absolute -bottom-14 -right-10 h-44 w-44 rounded-full bg-neu-surface" />
          <div className="relative mx-auto max-w-2xl">
            <p className="text-[0.72rem] font-bold tracking-[0.22em] uppercase text-neu-mut">The invite</p>
            <h2 className="neu-display mt-4 text-4xl leading-tight font-extrabold text-neu-ink sm:text-5xl md:text-6xl">
              Every Saturday,
              <br />
              10 AM at Baneshwar<span className="text-neu-acc">.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed font-medium text-neu-mut">
              Show up at New Summit College, Basuki Marg — meet the founding members, learn something, and help grow
              the newest club in Zone 7.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={CLUB.igUrl}
                target="_blank"
                rel="noreferrer"
                className="neu-squish neu-focus inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#6C63FF] px-8 text-base font-bold text-white transition-colors duration-300 hover:bg-[#8B84FF] sm:w-auto"
              >
                <AtSign className="size-5" strokeWidth={2.5} /> @{CLUB.ig}
              </a>
              <a
                href={`mailto:${CLUB.emails[0]}`}
                className="neu-squish neu-focus inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-neu-surface px-8 text-base font-bold text-neu-ink sm:w-auto"
              >
                <Mail className="size-5" strokeWidth={2.5} /> Write to the club
              </a>
            </div>
            <p className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-neu-mut">
              <MapPin className="size-4" strokeWidth={2.5} /> {CLUB.venue}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- footer ---- */

function Footer() {
  return (
    <footer className="w-full bg-[#1A2027] px-6 py-16 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center">
        <img
          src={CLUB.logo}
          alt={`${CLUB.name} logo`}
          className="h-16 w-16 rounded-2xl bg-white object-contain p-1.5"
          loading="lazy"
        />
        <div>
          <p className="neu-display text-xl font-extrabold">{CLUB.name}</p>
          <p className="mt-2 text-sm font-medium text-white/60">
            {CLUB.meeting} · {CLUB.venue}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={CLUB.igUrl}
            target="_blank"
            rel="noreferrer"
            className="neu-squish inline-flex h-12 items-center gap-2 rounded-2xl bg-white/10 px-6 text-sm font-bold text-white transition-colors duration-300 hover:bg-white/20"
          >
            <AtSign className="size-4" strokeWidth={2.5} /> @{CLUB.ig}
          </a>
          <a
            href={`mailto:${CLUB.emails[0]}`}
            className="neu-squish inline-flex h-12 items-center gap-2 rounded-2xl bg-white/10 px-6 text-sm font-bold text-white transition-colors duration-300 hover:bg-white/20"
          >
            <Mail className="size-4" strokeWidth={2.5} /> {CLUB.emails[0]}
          </a>
        </div>
        <p className="mt-6 text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">
          Zone 7 club page — for live event data, visit the{' '}
          <a href="/kathmanduheight/official" className="font-bold text-white underline underline-offset-4 hover:text-[#8B84FF]">
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
    <div className="min-h-screen bg-neu-bg font-sans text-neu-ink antialiased">
      <Hero />
      <StatsBand />
      <Projects />
      <About />
      <Board />
      <Meetup />
      <Footer />
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);