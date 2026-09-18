import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AtSign,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock,
  HeartHandshake,
  Mail,
  MapPin,
  Quote,
  Sparkles,
  Users
} from 'lucide-react';
import { CLUB, BOARD, PROJECTS, STATS, GOALS, FACTS } from './data';
import './demo.css';

const ORB_GRADS = [
  'from-[#A78BFA] to-[#7C3AED]',
  'from-[#F472B6] to-[#DB2777]',
  'from-[#38BDF8] to-[#0EA5E9]',
  'from-[#34D399] to-[#10B981]',
  'from-[#FBBF24] to-[#F59E0B]'
];

function initialsOf(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

/* ------------------------------------------------------------------ bg --- */

function Blobs() {
  return (
    <div className="clay-blobs" aria-hidden="true">
      <div className="clay-anim-float absolute -top-[10%] -left-[10%] h-[60vh] w-[60vh] rounded-full bg-clay-acc/10 blur-3xl" />
      <div className="clay-anim-float-d absolute top-[18%] -right-[10%] h-[55vh] w-[55vh] rounded-full bg-clay-pink/10 blur-3xl" />
      <div className="clay-anim-float-slow absolute bottom-[-8%] left-[12%] h-[50vh] w-[50vh] rounded-full bg-clay-blue/10 blur-3xl" />
    </div>
  );
}

/* -------------------------------------------------------------- shared ---- */

function SectionHead({ kicker, title, sub, tint = 'text-clay-acc' }) {
  return (
    <div className="max-w-3xl">
      <span className="clay-card inline-flex items-center gap-2 rounded-[20px] bg-clay-card/70 px-4 py-2 text-[0.72rem] font-bold tracking-[0.18em] uppercase backdrop-blur-xl">
        <Sparkles className={`size-3.5 ${tint}`} strokeWidth={2.5} />
        {kicker}
      </span>
      <h2 className="clay-display mt-6 text-3xl font-black text-clay-ink sm:text-4xl md:text-5xl">{title}</h2>
      {sub && <p className="mt-4 max-w-2xl text-base leading-relaxed text-clay-mut md:text-lg">{sub}</p>}
    </div>
  );
}

function Avatar({ name, photo, grad, className = '', text = '' }) {
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
      className={`clay-orb grid place-items-center rounded-full bg-linear-to-br ${grad} ${className}`}
    >
      <span className="clay-display font-black text-white" style={{ fontSize: text || undefined }}>
        {initialsOf(name)}
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------- hero --- */

function Hero() {
  return (
    <header className="relative w-full overflow-hidden pt-10 pb-20 sm:pt-14 sm:pb-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div className="relative z-10">
          <span className="clay-card inline-flex items-center gap-2 rounded-[20px] bg-clay-card/70 px-4 py-2 text-[0.72rem] font-bold tracking-[0.18em] uppercase backdrop-blur-xl">
            <BookOpen className="size-3.5 text-clay-pink" strokeWidth={2.5} />
            {CLUB.identity} · Vision “{CLUB.vision}”
          </span>
          <h1 className="clay-display mt-7 text-5xl leading-[1.05] font-black tracking-tight text-clay-ink sm:text-6xl md:text-7xl lg:text-8xl">
            Sankhu
            <br />
            <span className="clay-text-gradient">reads.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed font-medium text-clay-mut md:text-xl">
            Chartered {CLUB.foundedDisplay} and sponsored by the {CLUB.sponsor}, serving the historic town of
            Sankhu with one big idea — learn, then act.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {[
              { icon: Users, label: `${CLUB.active} members` },
              { icon: CalendarDays, label: `${CLUB.events} events logged` },
              { icon: Clock, label: CLUB.meeting }
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="clay-card inline-flex items-center gap-2 rounded-[20px] bg-clay-card/70 px-4 py-2.5 text-sm font-semibold text-clay-ink backdrop-blur-xl"
              >
                <Icon className="size-4 text-clay-acc" strokeWidth={2.5} />
                {label}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#board"
              className="clay-btn clay-squish clay-lift inline-flex h-14 items-center justify-center gap-2 rounded-[20px] bg-linear-to-br from-[#A78BFA] to-[#7C3AED] px-8 text-base font-bold text-white"
            >
              Meet the board <ArrowRight className="size-5" strokeWidth={2.5} />
            </a>
            <a
              href="#projects"
              className="clay-btn-white clay-squish clay-lift inline-flex h-14 items-center justify-center gap-2 rounded-[20px] bg-clay-card/80 px-8 text-base font-bold text-clay-ink backdrop-blur-xl"
            >
              See the projects
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="clay-deep clay-anim-float relative overflow-hidden rounded-[48px] bg-clay-card/60 p-8 backdrop-blur-xl sm:rounded-[60px] sm:p-12">
            <div aria-hidden="true" className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-clay-pink/10 blur-2xl" />
            <div aria-hidden="true" className="absolute -bottom-12 -left-10 h-44 w-44 rounded-full bg-clay-acc/10 blur-2xl" />
            <div className="relative flex flex-col items-center gap-6">
              <Avatar
                name={CLUB.name}
                photo={CLUB.logo}
                grad={ORB_GRADS[0]}
                className="h-40 w-40 rounded-[40px] object-contain p-3 sm:h-52 sm:w-52"
              />
              <div className="text-center">
                <p className="clay-display text-xl font-extrabold text-clay-ink sm:text-2xl">{CLUB.short}</p>
                <p className="mt-1 text-sm font-medium text-clay-mut">{CLUB.fullLoc}</p>
              </div>
              <a
                href={CLUB.igUrl}
                target="_blank"
                rel="noreferrer"
                className="clay-btn clay-squish inline-flex h-12 items-center gap-2 rounded-[20px] bg-clay-card/80 px-6 text-sm font-bold text-clay-ink backdrop-blur-xl"
              >
                <AtSign className="size-4 text-clay-pink" strokeWidth={2.5} /> @{CLUB.ig}
              </a>
            </div>
          </div>

          <div className="clay-card clay-anim-float-d absolute -top-5 -right-3 hidden items-center gap-2 rounded-[24px] bg-clay-card/80 px-4 py-3 text-sm font-bold text-clay-ink backdrop-blur-xl sm:flex lg:-right-6">
            <BookOpen className="size-4 text-clay-acc" strokeWidth={2.5} /> Literate Sankhu
          </div>
          <div className="clay-card clay-anim-float-slow absolute -bottom-5 -left-3 hidden items-center gap-2 rounded-[24px] bg-clay-card/80 px-4 py-3 text-sm font-bold text-clay-ink backdrop-blur-xl sm:flex lg:-left-6">
            <Sparkles className="size-4 text-clay-amber" strokeWidth={2.5} /> Chartered 2020
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
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="clay-card rounded-[40px] bg-clay-card/60 p-6 backdrop-blur-xl sm:rounded-[48px] sm:p-10">
          <div className="grid grid-cols-2 gap-5 sm:gap-8 md:grid-cols-4">
            {STATS.map((s, i) => (
              <div key={s.label} className="flex flex-col items-center gap-2 text-center">
                <div
                  className={`clay-orb clay-anim-breathe grid h-24 w-24 place-items-center rounded-full bg-linear-to-br sm:h-28 sm:w-28 ${ORB_GRADS[i % ORB_GRADS.length]}`}
                  style={{ animationDelay: `${i * 0.6}s` }}
                >
                  <span className="clay-display text-3xl font-black text-white sm:text-4xl">{s.value}</span>
                </div>
                <span className="px-2 text-xs font-bold tracking-[0.14em] uppercase text-clay-mut sm:text-sm">
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

/* -------------------------------------------------------------- board ---- */

function Board() {
  const president = BOARD[0];
  const officers = BOARD.slice(1);
  return (
    <section id="board" className="w-full scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHead
          kicker="The people"
          title="Nineteen faces, one board."
          sub={`From the president’s seat to every chair — the ${CLUB.short} team that plans, funds and delivers the year.`}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <article className="clay-card clay-lift relative overflow-hidden rounded-[40px] bg-clay-card/75 p-7 backdrop-blur-xl sm:col-span-2 sm:rounded-[48px] sm:p-9 xl:col-span-2 xl:row-span-2">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-2 bg-linear-to-r from-[#A78BFA] to-[#7C3AED]" />
            <div className="flex h-full flex-col items-start gap-5">
              <Avatar
                name={president.name}
                photo={president.photo}
                grad={ORB_GRADS[0]}
                className="h-28 w-28 rounded-[32px] sm:h-36 sm:w-36"
                text="3.5rem"
              />
              <div className="mt-auto">
                <p className="text-xs font-bold tracking-[0.18em] uppercase text-clay-pink">President · RY 2026–27</p>
                <h3 className="clay-display mt-2 text-2xl font-extrabold text-clay-ink sm:text-3xl">{president.name}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-clay-mut sm:text-base">
                  Leading {CLUB.short} through its vision of a {CLUB.vision.toLowerCase()} — one Wednesday evening at a time.
                </p>
              </div>
            </div>
          </article>

          {officers.map((m, i) => (
            <article
              key={`${m.name}-${m.role}`}
              className="clay-card clay-lift relative flex flex-col overflow-hidden rounded-[32px] bg-clay-card/75 p-6 backdrop-blur-xl"
            >
              <Avatar
                name={m.name}
                photo={m.photo}
                grad={ORB_GRADS[(i + 2) % ORB_GRADS.length]}
                className="h-16 w-16 rounded-[22px]"
                text="1.5rem"
              />
              <h3 className="clay-display mt-4 text-lg font-extrabold text-clay-ink">{m.name}</h3>
              <p className="mt-1 text-xs font-bold tracking-[0.12em] uppercase text-clay-mut">{m.role}</p>
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
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHead
          kicker="In pictures"
          title="Three projects, one vision."
          sub="Education, dignity and green space — the logged work that puts “Literate Sankhu” into practice."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:gap-10">
          {PROJECTS.map((p, i) => (
            <article
              key={p.title}
              className="clay-card clay-lift group relative flex flex-col overflow-hidden rounded-[40px] bg-clay-card/75 backdrop-blur-xl"
            >
              <div className="relative overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] sm:h-72"
                />
                <span className="clay-card absolute top-4 left-4 rounded-[20px] bg-clay-card/85 px-4 py-2 text-[0.7rem] font-bold tracking-[0.16em] uppercase text-clay-pink backdrop-blur-xl">
                  {p.category}
                </span>
              </div>
              <div className="flex flex-col gap-3 p-6 sm:p-8">
                <div className="flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase text-clay-mut">
                  <CalendarDays className="size-3.5" strokeWidth={2.5} />
                  {p.date}
                  <span className="text-clay-acc">·</span>
                  <MapPin className="size-3.5" strokeWidth={2.5} />
                  {p.place}
                </div>
                <h3 className="clay-display text-2xl font-extrabold text-clay-ink sm:text-3xl">{p.title}</h3>
                <p className="text-base leading-relaxed text-clay-mut">{p.tag}</p>
              </div>
            </article>
          ))}

          <article className="clay-deep relative flex flex-col justify-between overflow-hidden rounded-[40px] bg-linear-to-br from-[#7C3AED] to-[#5B21B6] p-8 text-white sm:p-10">
            <Quote className="absolute top-8 right-8 size-9 text-white/20" strokeWidth={1.5} />
            <div>
              <p className="text-[0.72rem] font-bold tracking-[0.2em] uppercase text-white/70">The vision</p>
              <h3 className="clay-display mt-3 text-3xl leading-tight font-black sm:text-4xl">
                “{CLUB.vision}”
              </h3>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/85">
                Every project leads back to learning — through health, infrastructure and new skills for the
                community of Sankhu.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <HeartHandshake className="size-6 text-white/80" strokeWidth={2.5} />
              <span className="text-sm font-semibold text-white/80">
                Supported by {CLUB.sponsor} · Twin: {CLUB.twin}
              </span>
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
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHead
            kicker="The club"
            title="Serving Sankhu since 2020."
            tint="text-clay-pink"
          />
          <div className="clay-card mt-8 rounded-[40px] bg-clay-card/70 p-7 backdrop-blur-xl sm:p-9">
            <blockquote className="text-lg leading-relaxed font-medium text-clay-ink sm:text-xl">
              {CLUB.about}
            </blockquote>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="clay-card rounded-[40px] bg-clay-card/70 p-2 backdrop-blur-xl sm:p-3">
            {FACTS.map((f, i) => (
              <div
                key={f.k}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-clay-acc/10 px-5 py-4 last:border-b-0 sm:px-6"
              >
                <span className="text-xs font-bold tracking-[0.16em] uppercase text-clay-mut">{f.k}</span>
                <span className="text-right text-base font-bold text-clay-ink sm:text-lg">{f.v}</span>
              </div>
            ))}
          </div>
          <div className="clay-card rounded-[40px] bg-clay-card/70 p-7 backdrop-blur-xl sm:p-8">
            <p className="text-[0.72rem] font-bold tracking-[0.2em] uppercase text-clay-acc">Goals on record</p>
            <ul className="mt-4 space-y-3">
              {GOALS.map((g) => (
                <li key={g.t} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-3 text-base font-semibold text-clay-ink">
                    <span className={`clay-orb grid size-6 shrink-0 place-items-center rounded-full bg-linear-to-br ${ORB_GRADS[2]}`}>
                      <span className="size-1.5 rounded-full bg-white" />
                    </span>
                    {g.t}
                  </span>
                  <span className="rounded-[14px] bg-clay-acc/10 px-3 py-1 text-xs font-bold text-clay-acc">{g.s}</span>
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
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="clay-deep relative overflow-hidden rounded-[48px] bg-linear-to-br from-[#7C3AED] to-[#DB2777] p-8 text-center text-white sm:rounded-[60px] sm:p-14">
          <div aria-hidden="true" className="clay-anim-float absolute -top-14 -left-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div aria-hidden="true" className="clay-anim-float-slow absolute -right-12 -bottom-14 h-52 w-52 rounded-full bg-black/10 blur-2xl" />
          <div className="relative mx-auto max-w-2xl">
            <p className="text-[0.72rem] font-bold tracking-[0.22em] uppercase text-white/75">The invite</p>
            <h2 className="clay-display mt-4 text-4xl leading-tight font-black sm:text-5xl md:text-6xl">
              Every Wednesday,
              <br />
              5 PM at Sankhu<span className="text-white/80">.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed font-medium text-white/85">
              Show up in Sankhu, Shankharapur-07 — learn something, teach something, and give the week a better ending.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={CLUB.igUrl}
                target="_blank"
                rel="noreferrer"
                className="clay-btn-white clay-squish clay-lift inline-flex h-14 w-full items-center justify-center gap-2 rounded-[20px] bg-white px-8 text-base font-bold text-clay-ink sm:w-auto"
              >
                <AtSign className="size-5 text-clay-pink" strokeWidth={2.5} /> @{CLUB.ig}
              </a>
              <a
                href={`mailto:${CLUB.emails[0]}`}
                className="clay-btn clay-squish clay-lift inline-flex h-14 w-full items-center justify-center gap-2 rounded-[20px] bg-black/20 px-8 text-base font-bold text-white sm:w-auto"
              >
                <Mail className="size-5" strokeWidth={2.5} /> Write to the club
              </a>
            </div>
            <p className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white/75">
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
    <footer className="w-full bg-[#1B1635] px-4 py-16 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center">
        <img
          src={CLUB.logo}
          alt={`${CLUB.name} logo`}
          className="h-16 w-16 rounded-[20px] bg-white object-contain p-1.5"
          loading="lazy"
        />
        <div>
          <p className="clay-display text-xl font-extrabold">{CLUB.name}</p>
          <p className="mt-2 text-sm font-medium text-white/60">{CLUB.meeting} · {CLUB.venue}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={CLUB.igUrl}
            target="_blank"
            rel="noreferrer"
            className="clay-btn clay-squish inline-flex h-12 items-center gap-2 rounded-[20px] bg-white/10 px-6 text-sm font-bold text-white"
          >
            <AtSign className="size-4" strokeWidth={2.5} /> @{CLUB.ig}
          </a>
          <a
            href={`mailto:${CLUB.emails[0]}`}
            className="clay-btn clay-squish inline-flex h-12 items-center gap-2 rounded-[20px] bg-white/10 px-6 text-sm font-bold text-white"
          >
            <Mail className="size-4" strokeWidth={2.5} /> {CLUB.emails[0]}
          </a>
        </div>
        <p className="mt-6 text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">
          Zone 7 concept page — for live updates, visit the{' '}
          <a href="/sankhu/official" className="font-bold text-white underline underline-offset-4 hover:text-clay-acc">
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
    <div className="min-h-screen bg-clay-canvas font-sans text-clay-ink antialiased">
      <Blobs />
      <Hero />
      <StatsBand />
      <Board />
      <Projects />
      <About />
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