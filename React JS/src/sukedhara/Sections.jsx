import { useEffect, useRef, useState } from 'react';
import { AtSign, CalendarDays, Compass, Globe2, HandHeart, Mail, MapPin, ShieldCheck, Users } from 'lucide-react';
import { CLUB, STATS } from './data';

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
    <div className="rounded-2xl border border-[#F0D9BE] bg-white/70 px-4 py-5 text-center shadow-[0_10px_30px_-18px_rgba(160,47,67,.45)]">
      <div className="text-3xl font-black tabular-nums text-[#A82F43] md:text-4xl">
        {stat.plain ? stat.value : `${v}${stat.suffix}`}
      </div>
      <div className="mt-1 text-xs font-semibold tracking-wide text-[#6B5B73] uppercase">{stat.label}</div>
    </div>
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

export function AboutSection() {
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <p className="text-xs font-bold tracking-[0.2em] text-[#0FB5B1] uppercase">Who we are</p>
        <h2 className="mt-2 text-3xl font-black text-[#241D4D] md:text-4xl">Small club, big Saturdays.</h2>
        <blockquote className="mt-4 border-l-4 border-[#E0475F] pl-4 text-lg font-medium text-[#4A3F63] italic">
          “{CLUB.vision}”
        </blockquote>
        <p className="mt-4 leading-relaxed text-[#4A3F63]">{CLUB.about}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-[#A82F43]/10 px-3 py-1.5 text-[#A82F43]">
            Chartered {CLUB.foundedDisplay}
          </span>
          <span className="rounded-full bg-[#0FB5B1]/10 px-3 py-1.5 text-[#0B7C7A]">
            Sponsored by {CLUB.sponsor}
          </span>
          <span className="rounded-full bg-[#F2A900]/15 px-3 py-1.5 text-[#8A5B00]">
            Twins: {CLUB.twins.join(' · ')}
          </span>
        </div>
      </div>
      <div className="overflow-hidden rounded-3xl border-4 border-white bg-white shadow-[0_24px_60px_-30px_rgba(160,47,67,.5)]">
        <img
          src="/media/logos/sukedhara.jpg"
          alt="Rotaract Club of Sukedhara logo"
          className="aspect-square w-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
}

export function GoalsSection() {
  return (
    <div>
      <p className="text-xs font-bold tracking-[0.2em] text-[#0FB5B1] uppercase">Rota year goals</p>
      <h2 className="mt-2 text-3xl font-black text-[#241D4D] md:text-4xl">Four promises, in progress.</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {CLUB.goals.map((g, i) => {
          const Icon = GOAL_ICONS[i % GOAL_ICONS.length];
          return (
            <article
              key={g.title}
              className="group rounded-3xl border border-[#F0D9BE] bg-white/80 p-5 shadow-[0_16px_40px_-24px_rgba(36,29,77,.4)] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#E0475F] to-[#F2A900] text-white">
                  <Icon className="size-5" strokeWidth={2.2} />
                </span>
                <h3 className="text-lg font-extrabold text-[#241D4D]">{g.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#4A3F63]">{g.body}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#0B7C7A]">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#0FB5B1] opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-[#0FB5B1]" />
                </span>
                In progress
              </span>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function MeetupSection() {
  const countdown = useMeetupCountdown();
  return (
    <div className="overflow-hidden rounded-[2rem] bg-[#241D4D] p-6 text-white shadow-[0_30px_70px_-30px_rgba(36,29,77,.8)] md:p-10">
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#FFB86B] uppercase">
            <CalendarDays className="size-4" /> Weekly meetup
          </p>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">{CLUB.meeting}.</h2>
          <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-white/80">
            <MapPin className="mt-0.5 size-4 shrink-0 text-[#FFB86B]" />
            {CLUB.venue}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={CLUB.igUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E0475F] to-[#F2A900] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
            >
              <AtSign className="size-4" /> @{CLUB.ig}
            </a>
            <button
              type="button"
              onClick={() => {
                window.location.href = `mailto:${CLUB.emails[0]}?subject=Hi%20Sukedhara!%20I%20want%20to%20join`;
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              <Mail className="size-4" /> Say hi
            </button>
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-white/60">
            <HandHeart className="size-4" /> Visitors welcome — just show up, or say hi first.
          </p>
        </div>
        <div className="rounded-3xl border border-white/15 bg-white/5 px-8 py-6 text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase">Next meetup in</p>
          <p className="mt-1 text-3xl font-black tabular-nums text-[#FFB86B] md:text-4xl">{countdown}</p>
          <p className="mt-2 text-xs text-white/60">Saturdays · 10:00 AM NPT</p>
        </div>
      </div>
    </div>
  );
}
