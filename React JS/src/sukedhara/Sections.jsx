import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AtSign, CalendarDays, Compass, Globe2, HandHeart, Mail, MapPin, ShieldCheck, Users } from 'lucide-react';
import Reveal from './Reveal';
import { PRESIDENTS, QUICK_FACTS } from './photos';
import { CLUB, STATS } from './data';

gsap.registerPlugin(ScrollTrigger);

const GOAL_ICONS = [Users, Globe2, ShieldCheck, Compass];

function useCountUp(target, run, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now) => {
      const k = Math.min((now - t0) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration]);
  return value;
}

function Stat({ stat, run }) {
  const v = useCountUp(stat.value, run);
  return (
    <div className="suk-sweep relative overflow-hidden rounded-3xl border border-line bg-paper px-4 py-6 text-center shadow-[0_18px_40px_-30px_rgba(18,59,60,.5)]">
      <div className="font-display text-4xl font-bold tabular-nums text-plum-deep md:text-5xl">
        {stat.plain ? stat.value : `${v}${stat.suffix}`}
      </div>
      <div className="mt-2 font-mono text-[10px] font-semibold tracking-[0.16em] text-gold uppercase">{stat.label}</div>
    </div>
  );
}

export function StatsBand() {
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
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {STATS.map((s) => (
        <Stat key={s.label} stat={s} run={run} />
      ))}
    </div>
  );
}

const COLLAGE = [
  { p: 3, cls: 'left-0 top-0 -rotate-6', sp: -36 },
  { p: 5, cls: 'right-0 top-20 rotate-3', sp: 44 },
  { p: 6, cls: 'bottom-0 left-10 -rotate-2', sp: -60 }
];

export function AboutSection() {
  const collageRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-plx]').forEach((el) => {
        gsap.to(el, {
          y: Number(el.dataset.plx),
          ease: 'none',
          scrollTrigger: { trigger: collageRef.current, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });
    }, collageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr]">
      <Reveal>
        <blockquote className="border-l-4 border-plum pl-5 text-xl leading-relaxed font-medium text-ink/90 italic md:text-2xl">
          “{CLUB.vision}”
        </blockquote>
        <p className="mt-5 leading-relaxed text-ink/70">{CLUB.about}</p>
        <div className="mt-6 flex flex-wrap gap-2 font-mono text-[10px] font-semibold tracking-[0.08em] uppercase">
          <span className="rounded-full bg-plum/10 px-3.5 py-1.5 text-plum-deep">Chartered {CLUB.foundedDisplay}</span>
          <span className="rounded-full bg-gold/10 px-3.5 py-1.5 text-gold">Sponsor · {CLUB.sponsor}</span>
          <span className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-mut">Twins · {CLUB.twins.join(' / ')}</span>
        </div>
      </Reveal>
      <Reveal delay={140}>
        <div ref={collageRef} className="relative h-[360px] sm:h-[420px]">
          {COLLAGE.map((c, i) => {
            const person = PRESIDENTS[c.p];
            return (
              <figure
                key={person.term}
                data-plx={c.sp}
                className={`absolute w-40 rounded-2xl bg-paper p-2 pb-8 shadow-[0_22px_55px_-24px_rgba(18,59,60,.55)] sm:w-48 ${c.cls}`}
                style={{ zIndex: i + 1 }}
              >
                <img src={person.img} alt={person.name} loading="lazy" className="aspect-[3/4] w-full rounded-xl object-cover object-top" />
                <figcaption className="pt-2 text-center font-mono text-[9px] font-semibold tracking-[0.06em] text-mut uppercase">
                  {person.name.replace('Rtr. ', '')} · {person.term.replace('RY ', '')}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}

export function QuickFacts() {
  return (
    <Reveal>
      <dl className="overflow-hidden rounded-3xl bg-paper ring-1 ring-line">
        {QUICK_FACTS.map(([k, v], i) => (
          <div
            key={k}
            className={`flex flex-col gap-1 px-6 py-3.5 sm:flex-row sm:items-center sm:gap-8 ${i !== QUICK_FACTS.length - 1 ? 'border-b border-line' : ''}`}
          >
            <dt className="w-52 shrink-0 font-mono text-[10px] font-semibold tracking-[0.14em] text-mut uppercase">{k}</dt>
            <dd className="text-sm font-medium text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}

export function GoalsSection() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
        {CLUB.goals.map((g, i) => {
          const Icon = GOAL_ICONS[i % GOAL_ICONS.length];
          return (
            <Reveal key={g.title} delay={(i % 2) * 110} className="h-full">
              <article className="group flex h-full flex-col rounded-3xl bg-paper p-6 shadow-[0_20px_45px_-30px_rgba(18,59,60,.5)] transition-transform duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-plum text-white shadow-[0_12px_28px_-12px_rgba(46,165,173,.9)]">
                    <Icon className="size-5" strokeWidth={2.2} />
                  </span>
                  <span className="font-mono text-sm font-semibold text-gold tabular-nums">0{i + 1}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-ink">{g.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/65">{g.body}</p>
                <div className="mt-5 h-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
                  <div className="suk-shimmer h-full w-2/5 rounded-full bg-gradient-to-r from-plum to-rose" />
                </div>
                <span className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] font-semibold tracking-[0.12em] text-plum uppercase">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-plum opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-plum" />
                  </span>
                  In progress
                </span>
              </article>
            </Reveal>
          );
        })}
    </div>
  );
}

export function MeetupSection() {
  const countdown = useMeetupCountdown();
  return (
    <Reveal>
      <div className="suk-sweep relative overflow-hidden bg-aubergine p-6 text-white md:p-10">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-plum/25 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-gold/20 blur-3xl" aria-hidden="true" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.18em] text-gold uppercase">
              <CalendarDays className="size-4" /> Weekly meetup
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase md:text-5xl">{CLUB.meeting}.</h2>
            <p className="mt-4 flex items-start gap-2 text-sm font-medium leading-relaxed text-white/80">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
              {CLUB.venue}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={CLUB.igUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-mono text-xs font-bold tracking-[0.12em] text-ink uppercase transition-transform hover:scale-105"
              >
                <AtSign className="size-4" /> @{CLUB.ig}
              </a>
              <button
                type="button"
                onClick={() => {
                  window.location.href = `mailto:${CLUB.emails[0]}?subject=Hi%20Sukedhara!%20I%20want%20to%20join`;
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-mono text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:border-gold hover:text-gold"
              >
                <Mail className="size-4" /> Say hi
              </button>
            </div>
            <p className="mt-4 flex items-center gap-2 font-mono text-[10px] font-semibold tracking-[0.12em] text-white/50 uppercase">
              <HandHeart className="size-4 text-gold" /> Visitors welcome — just show up, or say hi first.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 border-t border-white/15 pt-6">
              <a
                href="/join"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-mono text-xs font-bold tracking-[0.12em] text-aubergine uppercase transition-transform hover:scale-105"
              >
                Fill the Join Form
              </a>
              <a
                href="/#clubs"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-mono text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:border-plum hover:text-plum"
              >
                Explore Other Clubs
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 px-8 py-7 text-center backdrop-blur-sm">
            <img src="/media/logos/sukedhara.jpg" alt="Rotaract Club of Sukedhara emblem" loading="lazy" className="mx-auto mb-4 h-24 w-24 rounded-full object-cover ring-2 ring-white/20" />
            <p className="font-mono text-[10px] font-bold tracking-[0.18em] text-gold uppercase">Next meetup in</p>
            <p className="mt-1 font-mono text-3xl font-semibold tabular-nums text-white md:text-4xl">{countdown}</p>
            <p className="mt-2 font-mono text-[10px] font-semibold tracking-[0.14em] text-white/60 uppercase">Saturdays · 10:00 AM NPT</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* Next Saturday 10:00 AM Kathmandu time (NPT is fixed UTC+5:45, no DST). */
function useMeetupCountdown() {
  const [label, setLabel] = useState('');
  useEffect(() => {
    const NPT = 5.75 * 3600 * 1000;
    const compute = () => {
      const now = new Date();
      const kNow = new Date(now.getTime() + NPT + now.getTimezoneOffset() * 60000);
      const midnight = new Date(kNow);
      midnight.setHours(0, 0, 0, 0);
      let ahead = (6 - kNow.getDay() + 7) % 7;
      if (ahead === 0 && (kNow.getHours() > 10 || (kNow.getHours() === 10 && kNow.getMinutes() > 0))) ahead = 7;
      const target = new Date(midnight.getTime() + ahead * 86400000 + 10 * 3600000);
      const ms = Math.max(target - kNow, 0);
      const d = Math.floor(ms / 86400000);
      const h = Math.floor((ms % 86400000) / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setLabel(`${d}d ${h}h ${m}m ${s}s`);
    };
    compute();
    const id = setInterval(compute, 1000);
    return () => clearInterval(id);
  }, []);
  return label;
}