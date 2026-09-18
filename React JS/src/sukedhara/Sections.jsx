import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, AtSign, CalendarDays, Compass, Globe2, HandHeart, Mail, MapPin, ShieldCheck, Users } from 'lucide-react';
import Reveal from './Reveal';
import { QUICK_FACTS } from './photos';
import { CLUB, STATS } from './data';

gsap.registerPlugin(ScrollTrigger);

const GOAL_ICONS = [Users, Globe2, ShieldCheck, Compass];
const TINTS = ['bg-plum', 'bg-rose', 'bg-gold', 'bg-mint'];
const NUM_TINTS = ['text-plum', 'text-rose', 'text-gold', 'text-mint'];
const TURNS = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2'];

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

function Stat({ stat, run, i }) {
  const v = useCountUp(stat.value, run);
  return (
    <div
      className={`suk-shadow-lg group rounded-3xl border-2 border-ink bg-white p-6 text-center transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:scale-105 ${TURNS[i % 4]}`}
    >
      <div className={`suk-wiggle font-display text-4xl font-extrabold tabular-nums md:text-6xl ${NUM_TINTS[i % 4]}`}>
        {stat.plain ? stat.value : `${v}${stat.suffix}`}
      </div>
      <div className="mt-2 text-xs font-bold tracking-[0.14em] text-mut uppercase">{stat.label}</div>
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
    <div ref={ref} className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
      {STATS.map((s, i) => (
        <Stat key={s.label} stat={s} run={run} i={i} />
      ))}
    </div>
  );
}

const FIELD = '/media/sukedhara/field/';

const COLLAGE = [
  { img: `${FIELD}meet-02.jpg`, caption: 'Saturday fellowship', cls: '-left-1 -top-3 -rotate-6', sp: -36, tint: 'suk-shadow' },
  { img: `${FIELD}esrag-05.jpg`, caption: 'ESRAG field day', cls: 'right-0 top-16 rotate-3', sp: 44, tint: 'suk-shadow-pink' },
  { img: `${FIELD}eye-03.jpg`, caption: 'Eye camp, Lalitpur', cls: '-left-2 bottom-0 -rotate-2', sp: -60, tint: 'suk-shadow' }
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
    <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_1fr]">
      <Reveal>
        <blockquote className="suk-shadow-pink rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-none border-2 border-ink bg-white p-6 text-xl leading-relaxed font-semibold text-ink md:p-8 md:text-2xl">
          <span className="text-plum">“</span>
          {CLUB.vision}
          <span className="text-plum">”</span>
        </blockquote>
        <p className="mt-6 leading-relaxed text-mut">{CLUB.about}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <span className="suk-shadow-sm suk-lift inline-block rounded-full border-2 border-ink bg-plum px-4 py-2 text-xs font-bold text-white uppercase">
            Chartered {CLUB.foundedDisplay}
          </span>
          <span className="suk-shadow-sm suk-lift inline-block -rotate-1 rounded-full border-2 border-ink bg-rose px-4 py-2 text-xs font-bold text-white uppercase">
            Sponsor · {CLUB.sponsor}
          </span>
          <span className="suk-shadow-sm suk-lift inline-block rotate-1 rounded-full border-2 border-ink bg-gold px-4 py-2 text-xs font-bold text-ink uppercase">
            Twins · {CLUB.twins.join(' / ')}
          </span>
        </div>
      </Reveal>
      <Reveal delay={140}>
        <div ref={collageRef}>
          {/* Mobile: three tidy stickers, no overlapping */}
          <div className="grid grid-cols-3 gap-3 lg:hidden">
            {COLLAGE.map((c, i) => {
              const tilt = ['-rotate-3', 'rotate-2', '-rotate-1'][i % 3];
              return (
                <figure
                  key={c.caption}
                  className={`${tilt} rounded-2xl border-2 border-ink bg-white p-1.5 pb-4 transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:scale-105 ${c.tint}`}
                >
                  <img src={c.img} alt={c.caption} loading="lazy" className="aspect-[3/4] w-full rounded-xl object-cover object-top" />
                  <figcaption className="pt-1.5 text-center text-[9px] font-bold tracking-[0.02em] text-mut uppercase">
                    {c.caption}
                  </figcaption>
                </figure>
              );
            })}
          </div>
          {/* Desktop: offset sticker collage behind the dot grid */}
          <div className="relative hidden h-[360px] sm:h-[440px] lg:block">
            <div aria-hidden="true" className="absolute inset-3 rounded-[3rem] bg-white suk-dots" />
            {COLLAGE.map((c, i) => {
              return (
                <figure
                  key={c.caption}
                  data-plx={c.sp}
                  className={`absolute w-40 rounded-3xl border-2 border-ink bg-white p-2 pb-6 transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:scale-105 hover:-rotate-1 sm:w-48 ${c.cls} ${c.tint}`}
                  style={{ zIndex: i + 1 }}
                >
                  <img src={c.img} alt={c.caption} loading="lazy" className="aspect-[3/4] w-full rounded-2xl object-cover object-top" />
                  <figcaption className="pt-2 text-center text-[10px] font-bold tracking-[0.04em] text-mut uppercase">
                    {c.caption}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

export function QuickFacts() {
  return (
    <Reveal>
      <dl className="rounded-3xl border-2 border-ink bg-white p-2 shadow-[6px_6px_0_0_#e2e8f0] md:p-4">
        {QUICK_FACTS.map(([k, v], i) => (
          <div
            key={k}
            className={`flex flex-col gap-1 rounded-2xl px-5 py-3 sm:flex-row sm:items-center sm:gap-8 ${i % 2 ? 'bg-mut/10' : ''} ${i !== QUICK_FACTS.length - 1 ? 'border-b-2 border-dashed border-line' : ''}`}
          >
            <dt className="w-52 shrink-0 text-xs font-bold tracking-[0.1em] text-mut uppercase">{k}</dt>
            <dd className="text-base font-semibold text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}

export function GoalsSection() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {CLUB.goals.map((g, i) => {
        const Icon = GOAL_ICONS[i % GOAL_ICONS.length];
        const tint = TINTS[i % 4];
        const num = NUM_TINTS[i % 4];
        const turn = TURNS[i % 4];
        return (
          <Reveal key={g.title} delay={(i % 4) * 90} className="h-full">
            <article className={`group relative flex h-full flex-col rounded-3xl border-2 border-ink bg-white p-6 pt-10 transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:-rotate-1 hover:scale-[1.03] ${turn} ${i % 2 ? 'suk-shadow-pink' : 'suk-shadow'}`}>
              <span className={`absolute -top-6 left-6 grid size-14 place-items-center rounded-2xl border-2 border-ink text-white suk-shadow-sm ${tint}`}>
                <Icon className="suk-wiggle size-6" strokeWidth={2.5} />
              </span>
              <span className={`absolute top-4 right-4 rounded-xl border-2 border-ink bg-white px-2 py-1 font-display text-sm font-extrabold ${num}`}>
                0{i + 1}
              </span>
              <h3 className="mt-2 font-display text-xl font-bold text-ink">{g.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-mut">{g.body}</p>
              <div className="mt-4 h-3 rounded-full border-2 border-ink bg-mut/15" aria-hidden="true">
                <div className={`suk-shimmer h-full w-2/5 rounded-full ${tint}`} />
              </div>
              <span className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-mint uppercase">
                <span className="relative flex size-3">
                  <span className={`absolute inline-flex size-full animate-ping rounded-full ${tint} opacity-60`} />
                  <span className={`relative inline-flex size-3 rounded-full border-2 border-ink ${tint}`} />
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
      <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-ink bg-gold p-6 md:p-10">
        <span aria-hidden="true" className="absolute -top-8 -right-6 grid size-24 rotate-12 place-items-center rounded-3xl border-2 border-ink bg-rose suk-shadow-sm" />
        <span aria-hidden="true" className="absolute -bottom-8 left-16 grid size-16 -rotate-6 place-items-center rounded-full border-2 border-ink bg-mint suk-shadow-sm" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-bold tracking-[0.1em] text-ink uppercase">
              <CalendarDays className="size-5" strokeWidth={2.5} /> Weekly meetup
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-ink md:text-5xl">{CLUB.meeting}.</h2>
            <p className="mt-4 flex items-start gap-2 text-base font-semibold leading-relaxed text-ink/80">
              <MapPin className="mt-1 size-5 shrink-0" strokeWidth={2.5} />
              {CLUB.venue}
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <a
                href={CLUB.igUrl}
                target="_blank"
                rel="noreferrer"
                className="suk-shadow suk-lift inline-flex items-center gap-3 rounded-full border-2 border-ink bg-plum px-6 py-3 font-bold text-white"
              >
                <AtSign className="size-5" strokeWidth={2.5} /> @{CLUB.ig}
                <span className="grid size-6 place-items-center rounded-full bg-white text-ink">
                  <ArrowRight className="size-3.5" strokeWidth={2.5} />
                </span>
              </a>
              <button
                type="button"
                onClick={() => {
                  window.location.href = `mailto:${CLUB.emails[0]}?subject=Hi%20Sukedhara!%20I%20want%20to%20join`;
                }}
                className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-transparent px-6 py-3 font-bold text-ink transition-colors duration-300 hover:bg-white focus-visible:ring-4 focus-visible:ring-plum/40 focus-visible:outline-none"
              >
                <Mail className="size-5" strokeWidth={2.5} /> Say hi
              </button>
            </div>
            <p className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-ink/70">
              <HandHeart className="size-5" strokeWidth={2.5} /> Visitors welcome — just show up, or say hi first.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 border-t-2 border-dashed border-ink/30 pt-6">
              <a
                href="/join"
                className="suk-shadow suk-lift inline-flex items-center gap-2 rounded-full border-2 border-ink bg-plum px-6 py-3 font-bold text-white"
              >
                Fill the Join Form <ArrowRight className="size-5" strokeWidth={2.5} />
              </a>
              <a
                href="/#clubs"
                className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-transparent px-6 py-3 font-bold text-ink transition-colors duration-300 hover:bg-white"
              >
                Explore Other Clubs
              </a>
            </div>
          </div>
          <div className="suk-shadow-pink rounded-[2rem] border-2 border-ink bg-white px-8 py-7 text-center">
            <img src="/media/logos/sukedhara.jpg" alt="Rotaract Club of Sukedhara emblem" loading="lazy" className="mx-auto mb-4 h-24 w-24 rounded-full object-cover ring-4 ring-gold" />
            <p className="text-xs font-bold tracking-[0.14em] text-mut uppercase">Next meetup in</p>
            <p className="mt-1 font-display text-3xl font-extrabold tabular-nums text-plum md:text-4xl">{countdown}</p>
            <p className="mt-2 text-xs font-bold tracking-[0.1em] text-mut uppercase">Saturdays · 10:00 AM NPT</p>
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