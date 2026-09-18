import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  ArrowRight,
  AtSign,
  Bolt,
  CalendarDays,
  Cpu,
  Mail,
  MapPin,
  Power,
  ShieldCheck,
  Signal,
  Target,
  Users
} from 'lucide-react';
import { CLUB, BOARD, PROJECTS, STATS, GOALS, FACTS } from './data';
import './demo.css';

const NOISE_SVG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity="0.04"/></svg>';

function Noise() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{ backgroundImage: `url("${NOISE_SVG}")`, mixBlendMode: 'overlay' }}
    />
  );
}

/* -------------------------------------------------------------- atoms ------ */

function Led({ color = 'bg-[#22c55e]', glow = 'shadow-[0_0_10px_rgba(34,197,94,1)]', pulse = true }) {
  return (
    <span
      aria-hidden="true"
      className={`led inline-block shrink-0 ${color} ${glow} ${pulse ? 'animate-pulse' : ''}`}
    />
  );
}

function Label({ children, className = '' }) {
  return <span className={`ind-label text-[var(--color-ind-mut-text)] ${className}`}>{children}</span>;
}

function SectionHead({ code, title, sub, codeClass = 'text-[var(--color-ind-accent)]' }) {
  return (
    <div className="max-w-3xl">
      <p className={`ind-label flex items-center gap-2 ${codeClass}`}>
        <span className="inline-block h-px w-8 bg-current" />
        {code}
      </p>
      <h2 className="ind-display mt-4 text-3xl font-extrabold text-[var(--color-ind-ink)] sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {sub && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--color-ind-mut-text)]">{sub}</p>}
    </div>
  );
}

function Card({ children, className = '' }) {
  return (
    <div className={`screw relative rounded-[16px] bg-[var(--color-ind-bg)] p-6 shadow-[var(--shadow-card)] md:rounded-[20px] ${className}`}>
      {children}
    </div>
  );
}

function ButtonPrimary({ href, children, className = '' }) {
  return (
    <a
      href={href}
      className={`ind-press inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-[#ff4757] px-8 text-sm font-bold tracking-[0.05em] text-white uppercase shadow-[4px_4px_8px_rgba(166,50,60,0.4),-4px_-4px_8px_rgba(255,100,110,0.4)] focus-visible:ring-2 focus-visible:ring-[#ff4757] focus-visible:ring-offset-2 focus-visible:outline-none ${className}`}
    >
      {children}
    </a>
  );
}

function ButtonChassis({ href, children, className = '' }) {
  return (
    <a
      href={href}
      className={`ind-press inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-[var(--color-ind-bg)] px-8 text-sm font-bold tracking-[0.05em] text-[var(--color-ind-ink)] uppercase shadow-[var(--shadow-card)] transition-colors hover:text-[#ff4757] focus-visible:ring-2 focus-visible:ring-[#ff4757] focus-visible:ring-offset-2 focus-visible:outline-none ${className}`}
    >
      {children}
    </a>
  );
}

/* -------------------------------------------------------------- device ----- */

function Device() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      {/* side buttons / hardware */}
      <div aria-hidden="true" className="absolute -top-2 -right-2 flex flex-col gap-2">
        <span className="h-8 w-2 rounded-full bg-[#b9bfc9] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.25)]" />
        <span className="h-5 w-2 rounded-full bg-[var(--color-ind-accent)] shadow-[var(--shadow-sharp)]" />
      </div>
      <div
        aria-hidden="true"
        className="absolute -bottom-3 -left-3 grid size-12 rotate-6 place-items-center rounded-xl bg-[var(--color-ind-bg)] shadow-[var(--shadow-card)]"
      >
        <Bolt className="size-5 text-[#ff4757]" strokeWidth={2} />
      </div>

      {/* bezel */}
      <div className="ind-lift relative rounded-[28px] border-2 border-[var(--color-ind-deep)] bg-[#23262e] p-3 shadow-[var(--shadow-floating)] md:rounded-[32px]">
        <div className="absolute inset-0 rounded-[26px] opacity-15 mix-blend-overlay md:rounded-[30px]" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/carbon-fibre.png)' }} />
        <div className="absolute top-3 right-4">
          <Led color="bg-[#ff4757]" glow="shadow-[0_0_10px_rgba(255,71,87,1)]" />
        </div>

        {/* screen */}
        <div className="ind-scanline relative overflow-hidden rounded-[18px] bg-[#14161b] p-[18px] shadow-[inset_4px_4px_12px_rgba(0,0,0,0.8)] md:p-6">
          <div className="flex items-center justify-between">
            <p className="ind-label text-[#8b93a7]">EMPOWER SYSTEM</p>
            <p className="ind-label flex items-center gap-1.5 text-[#8b93a7]">
              <span className="inline-block size-1.5 rounded-full bg-[#22c55e]" />
              LIVE
            </p>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-xl bg-[#ff4757]/15">
              <Cpu className="size-6 text-[#ff4757]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="ind-display text-2xl text-white">Empower to Impact</p>
              <p className="ind-label mt-1 text-[#6b7488]">RAC · D-3292 · ZONE VII</p>
            </div>
          </div>

          {/* dashboard bars */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[72, 96, 54].map((h, i) => (
              <div key={i} className="flex h-20 items-end gap-1 rounded-xl bg-[#0e1014] p-2">
                {[58, 84, i === 1 ? 100 : 66, 40].map((v, j) => (
                  <span
                    key={j}
                    className={`flex-1 rounded-t-sm ${i === 1 ? 'bg-[#ff4757]' : 'bg-[#ff4757]/90'}`}
                    style={{ height: `${v}%`, animationDelay: `${j * 120}ms` }}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2.5">
            {[
              { k: 'MISSION STATUS', v: 'OPERATIONAL', ok: true },
              { k: 'MEMBERS ONLINE', v: '21 / 21', ok: true },
              { k: 'MEETING', v: 'TUE · 12:00', ok: true }
            ].map((r) => (
              <div key={r.k} className="flex items-center justify-between rounded-lg bg-[#0e1014] px-3 py-2">
                <p className="ind-label text-[#6b7488]">{r.k}</p>
                <p className="ind-label flex items-center gap-2 text-white">
                  <Led color="bg-[#22c55e]" glow="shadow-[0_0_8px_rgba(34,197,94,1)]" />
                  {r.v}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* bottom rail */}
        <div className="mt-3 flex items-center justify-between px-1">
          <p className="ind-label text-[#828a9c]">MODEL RAC–LIB 2012</p>
          <div className="flex gap-1.5">
            <span className="h-1.5 w-6 rounded-full bg-[#3a4050]" />
            <span className="h-1.5 w-3 rounded-full bg-[#3a4050]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff4757]/70" />
          </div>
        </div>
      </div>

      {/* floating chips */}
      <div className="absolute -top-4 -left-2 hidden items-center gap-2 rounded-lg bg-[var(--color-ind-bg)] px-4 py-2 shadow-[var(--shadow-card)] sm:flex lg:-left-5">
        <Signal className="size-4 text-[#ff4757]" strokeWidth={2} />
        <Label>45 LOGGED PROJECTS</Label>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- hero ----- */

function Hero() {
  return (
    <header className="relative w-full overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-20">
      <div className="mx-auto grid max-w-[72rem] items-center gap-12 px-6 md:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="relative z-10">
          <p className="ind-label inline-flex items-center gap-2 rounded-md bg-[var(--color-ind-bg)] px-3 py-2 shadow-[var(--shadow-card)]">
            <Led color="bg-[#ff4757]" glow="shadow-[0_0_8px_rgba(255,71,87,1)]" />
            SYSTEM: {CLUB.identity.toUpperCase()} · STANDBY
          </p>
          <h1 className="ind-display mt-7 text-5xl leading-[1.02] font-black text-[var(--color-ind-ink)] drop-shadow-[0_1px_0_#ffffff] sm:text-6xl md:text-7xl">
            Empower
            <br />
            to <span className="text-[#ff4757]">Impact</span>
            <span className="text-[#ff4757]">.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-ind-mut-text)] md:text-xl">
            Chartered {CLUB.foundedDisplay} and sponsored by the {CLUB.sponsor}, running {CLUB.events} logged
            projects from Buddha Nagar — one Tuesday at a time.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {[
              { icon: CalendarDays, label: 'TUE · 12:00' },
              { icon: Users, label: `${CLUB.active} ACTIVE` },
              { icon: Bolt, label: `${CLUB.events} EVENTS` }
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-ind-bg)] px-4 py-2.5 text-sm font-semibold shadow-[var(--shadow-sharp)]"
              >
                <Icon className="size-4 text-[#ff4757]" strokeWidth={2} />
                <Label className="text-[var(--color-ind-ink)]">{label}</Label>
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <ButtonPrimary href="#projects">
              View mission logs <ArrowRight className="size-4" strokeWidth={2.5} />
            </ButtonPrimary>
            <ButtonChassis href="#board">
              <Users className="size-4" strokeWidth={2.5} /> Roster
            </ButtonChassis>
          </div>
        </div>

        <Device />
      </div>
    </header>
  );
}

/* ------------------------------------------------------------- stats ------ */

function StatsStrip() {
  return (
    <section className="w-full pb-4">
      <div className="mx-auto max-w-[72rem] px-6 md:px-12">
        <div className="relative overflow-hidden rounded-[20px] bg-[#2d3436] p-6 shadow-[var(--shadow-card)] md:rounded-[24px] md:p-8">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/carbon-fibre.png)' }} />
          <div className="relative grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="flex items-center justify-center gap-2">
                  <Led color="bg-[#22c55e]" glow="shadow-[0_0_8px_rgba(34,197,94,1)]" />
                  <span className="ind-display text-4xl font-extrabold text-white sm:text-5xl">{s.value}</span>
                </p>
                <p className="ind-label mt-2 text-[#a8b2d1]">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="ind-label absolute top-3 right-5 text-[#a8b2d1]/70">UPTIME: 14 YRS</p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- roster ----- */

const SLOTS = ['President', 'Vice President', 'Secretary', 'Treasurer', 'Service Chair', 'Public Image', 'Fellowship', 'International Chair'];

function BoardSection() {
  return (
    <section id="board" className="w-full scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-[72rem] px-6 md:px-12">
        <SectionHead
          code="SR-01 · LEADERSHIP CHANNEL"
          title="The roster dock."
          sub={BOARD.length ? 'The officers who run the machine.' : `Officer slots are ready below — names are published on the official club page.`}
        />
        <div className="mt-10">
          {BOARD.length === 0 ? (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {SLOTS.map((slot, i) => (
                  <Card key={slot} className={i === 0 ? 'bg-[var(--color-ind-panel)]' : ''}>
                    <div className="flex items-center justify-between">
                      <Label className="text-[var(--color-ind-accent)]">CH {String(i + 1).padStart(2, '0')}</Label>
                      <span
                        className="grid size-10 place-items-center rounded-full bg-[var(--color-ind-bg)] shadow-[var(--shadow-floating)]"
                        aria-hidden="true"
                      >
                        <Users className="size-5 text-[var(--color-ind-mut-text)]" strokeWidth={1.5} />
                      </span>
                    </div>
                    <h3 className="ind-display mt-4 text-xl font-extrabold text-[var(--color-ind-ink)]">{slot}</h3>
                    <p className="ind-label mt-2 flex items-center gap-2 text-[var(--color-ind-mut-text)]">
                      <Led color="bg-[#f59e0b]" glow="shadow-[0_0_8px_rgba(245,158,11,1)]" />
                      PENDING · OFFICIAL PAGE
                    </p>
                  </Card>
                ))}
              </div>
              <p className="ind-label mt-8 rounded-lg bg-[var(--color-ind-bg)] px-4 py-3 text-[var(--color-ind-mut-text)] shadow-[var(--shadow-card)]">
                ▶ The live board list is maintained at the{' '}
                <a href="/liberty/official" className="text-[#ff4757] underline underline-offset-4">
                  official Liberty College club page
                </a>
                .
              </p>
            </>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {BOARD.map((m, i) => (
                <Card key={`${m.name}-${i}`} className={i === 0 ? 'bg-[var(--color-ind-panel)]' : ''}>
                  <div className="flex items-center justify-between">
                    <Label className="text-[var(--color-ind-accent)]">OFFICER {String(i + 1).padStart(2, '0')}</Label>
                    <Led color="bg-[#22c55e]" glow="shadow-[0_0_8px_rgba(34,197,94,1)]" />
                  </div>
                  <h3 className="ind-display mt-4 text-xl font-extrabold text-[var(--color-ind-ink)]">{m.name}</h3>
                  <p className="ind-label mt-2 text-[var(--color-ind-mut-text)]">{m.role}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ projects ----- */

function Projects() {
  return (
    <section id="projects" className="w-full scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-[72rem] px-6 md:px-12">
        <SectionHead
          code="SR-02 · MISSION LOG"
          title="Eight signals, one decade."
          sub="Every logged operation from the last year on record — health, education, partnership and roadways."
        />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {PROJECTS.map((p, i) => (
            <article
              key={p.title}
              className="screw group relative rounded-[16px] bg-[var(--color-ind-bg)] p-4 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-floating)] md:rounded-[20px]"
            >
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="h-52 w-full object-cover transition-all duration-500 grayscale group-hover:scale-[1.03] group-hover:grayscale-0 sm:h-64"
                />
                <span className="absolute top-3 left-3 -skew-y-2 rounded-sm bg-[rgba(255,230,0,0.28)] px-3 py-1 backdrop-blur-sm">
                  <span className="ind-label text-[var(--color-ind-ink)]">{p.category}</span>
                </span>
                <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-[#23262e]/80 backdrop-blur-sm">
                  <span className="ind-label text-white">#{String(i + 1).padStart(2, '0')}</span>
                </span>
              </div>
              <div className="px-2 pt-5 pb-2">
                <p className="ind-label flex flex-wrap items-center gap-2 text-[var(--color-ind-mut-text)]">
                  <CalendarDays className="size-3.5 text-[#ff4757]" strokeWidth={2} />
                  {p.date}
                  <span className="text-[var(--color-ind-deep)]">·</span>
                  <MapPin className="size-3.5 text-[#ff4757]" strokeWidth={2} />
                  {p.place}
                </p>
                <h3 className="ind-display mt-3 text-xl leading-tight font-extrabold text-[var(--color-ind-ink)] md:text-2xl">
                  {p.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- about ----- */

function About() {
  return (
    <section id="about" className="w-full scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto grid max-w-[72rem] grid-cols-1 gap-8 px-6 md:px-12 lg:grid-cols-2 lg:gap-10">
        <div>
          <SectionHead
            code="SR-03 · SPEC SHEET"
            title="Built in Buddha Nagar, 2012."
            codeClass="text-[#ff4757]"
          />
          <div className="mt-8 space-y-5">
            <Card>
              <p className="ind-label flex items-center gap-2 text-[var(--color-ind-accent)]">
                <ShieldCheck className="size-4" strokeWidth={2} /> CLUB DOSSIER
              </p>
              <p className="mt-3 leading-relaxed text-[var(--color-ind-mut-text)]">{CLUB.about}</p>
            </Card>
            <Card className="bg-[#14161b]">
              <p className="ind-label flex items-center gap-2 text-[#ff4757]">
                <Target className="size-4" strokeWidth={2} /> CORE VISION
              </p>
              <p className="ind-scanline relative mt-3 rounded-lg bg-[#0e1014] p-4 font-mono text-sm leading-relaxed text-[#cfd6e4]">
                {CLUB.vision}
              </p>
            </Card>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="relative overflow-hidden rounded-[16px] bg-[#2d3436] p-6 shadow-[var(--shadow-card)] md:rounded-[20px]">
            <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/carbon-fibre.png)' }} />
            <div className="relative">
              <p className="ind-label flex items-center gap-2 text-[#a8b2d1]">
                <Activity className="size-4 text-[#22c55e]" strokeWidth={2} /> SYSTEM PARAMETERS
              </p>
              <div className="mt-4 divide-y divide-[#3a4150]">
                {FACTS.map((f) => (
                  <div key={f.k} className="flex items-baseline justify-between gap-4 py-3">
                    <span className="ind-label text-[#a8b2d1]">{f.k}</span>
                    <span className="ind-label text-right text-white">{f.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Card>
            <p className="ind-label flex items-center gap-2 text-[var(--color-ind-accent)]">
              <Target className="size-4" strokeWidth={2} /> 7 ACTIVE GOALS
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3">
              {GOALS.map((g, i) => (
                <div key={g.t} className="flex items-start gap-3 rounded-lg bg-[var(--color-ind-panel)] px-4 py-3 shadow-[var(--shadow-recessed)]">
                  <Led color="bg-[#22c55e]" glow="shadow-[0_0_6px_rgba(34,197,94,1)]" />
                  <p className="text-sm leading-relaxed font-medium text-[var(--color-ind-ink)]">
                    <span className="ind-label text-[var(--color-ind-mut-text)]">G{i + 1} · </span>
                    {g.t}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- cta ------ */

function Cta() {
  return (
    <section id="join" className="w-full scroll-mt-24 py-16 md:py-20">
      <div className="mx-auto max-w-[72rem] px-6 md:px-12">
        <div className="relative overflow-hidden rounded-[24px] bg-[#2d3436] p-8 text-center shadow-[var(--shadow-floating)] md:rounded-[30px] md:p-14">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/carbon-fibre.png)' }} />
          <div aria-hidden="true" className="ind-spin-slow absolute top-8 left-10 size-20 rounded-full border border-dashed border-[#ff4757]/40" />
          <div className="relative mx-auto max-w-2xl">
            <p className="ind-label flex items-center justify-center gap-2 text-[#a8b2d1]">
              <Led color="bg-[#ff4757]" glow="shadow-[0_0_10px_rgba(255,71,87,1)]" /> JOIN THE SYSTEM
            </p>
            <h2 className="ind-display mt-4 text-4xl leading-tight font-black text-white sm:text-5xl md:text-6xl">
              Be the unit that
              <br />
              empower<span className="text-[#ff4757]">s.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[#a8b2d1]">
              {CLUB.meetingLine} — Liberty College, Buddha Nagar, Kathmandu-10.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ButtonPrimary href={CLUB.igUrl} className="w-full sm:w-auto">
                <AtSign className="size-4" strokeWidth={2.5} /> {CLUB.ig}
              </ButtonPrimary>
              <a
                href={`mailto:${CLUB.emails[0]}`}
                className="ind-press inline-flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-[#23262e] px-8 text-sm font-bold tracking-[0.05em] text-white uppercase shadow-[var(--shadow-floating)] focus-visible:ring-2 focus-visible:ring-[#ff4757] focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto"
              >
                <Mail className="size-4" strokeWidth={2.5} /> Contact
              </a>
            </div>
            <p className="ind-label mt-7 inline-flex items-center gap-2 text-[#a8b2d1]">
              <MapPin className="size-4" strokeWidth={2} /> {CLUB.venue}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- footer ----- */

function Footer() {
  return (
    <footer className="w-full bg-[#1c1f26] px-6 py-14 text-white md:px-12">
      <div className="mx-auto flex max-w-[72rem] flex-col items-center gap-6 text-center">
        <img src={CLUB.logo} alt={`${CLUB.name} logo`} className="h-16 w-16 rounded-xl bg-white object-contain p-1.5" loading="lazy" />
        <div>
          <p className="ind-display text-xl font-extrabold">{CLUB.name}</p>
          <p className="ind-label mt-2 text-[#a8b2d1]">{CLUB.meeting} · {CLUB.venue}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href={CLUB.igUrl} target="_blank" rel="noreferrer" className="ind-press inline-flex h-12 items-center gap-2 rounded-lg bg-[#ff4757] px-6 text-sm font-bold tracking-wide text-white uppercase shadow-[var(--shadow-sharp)]">
            <AtSign className="size-4" strokeWidth={2.5} /> {CLUB.ig}
          </a>
          <a href={`mailto:${CLUB.emails[0]}`} className="ind-press inline-flex h-12 items-center gap-2 rounded-lg bg-[#2d3436] px-6 text-sm font-bold tracking-wide text-white uppercase shadow-[var(--shadow-sharp)]">
            <Mail className="size-4" strokeWidth={2.5} /> Email
          </a>
        </div>
        <p className="ind-label mt-6 flex items-center gap-2 text-[#8b93a7]">
          <Power className="size-3.5 text-[#22c55e]" strokeWidth={2} />
          ZONE 7 CONCEPT CONSOLE ·{' '}
          <a href="/liberty/official" className="text-[#ff4757] underline underline-offset-4">official club page</a>
        </p>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------- app ------ */

function App() {
  return (
    <div className="min-h-screen bg-ind-bg font-sans text-ind-ink antialiased">
      <Noise />
      <Hero />
      <StatsStrip />
      <BoardSection />
      <Projects />
      <About />
      <Cta />
      <Footer />
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);