import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Crown } from 'lucide-react';
import Reveal from './Reveal';
import { BOARD_FULL, PRESIDENTS } from './photos';
import { BOARD_LINES } from './stories';

gsap.registerPlugin(ScrollTrigger);

/* Official 13-member board: president featured, rest in a tight grid. */
export function BoardSection() {
  const [president, ...rest] = BOARD_FULL;
  return (
    <div>
      <Reveal>
        <p className="text-xs font-bold tracking-[0.2em] text-[#0FB5B1] uppercase">Leadership · 13 officers</p>
        <h2 className="mt-1 text-3xl font-black text-[#241D4D] md:text-4xl">Meet the club's board.</h2>
      </Reveal>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal className="sm:col-span-2 lg:row-span-2">
          <article className="group relative h-full min-h-64 overflow-hidden rounded-3xl shadow-[0_24px_55px_-28px_rgba(160,47,67,.5)]">
            <img
              src={president.img}
              alt={president.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#241D4D]/85 to-transparent" />
            <div className="absolute bottom-0 p-4">
              <span className="rounded-full bg-[#FFB86B] px-2.5 py-1 text-[10px] font-black tracking-wide text-[#241D4D] uppercase">
                {president.role}
              </span>
              <h3 className="mt-1.5 text-xl font-extrabold text-white">{president.name}</h3>
              {BOARD_LINES[president.role] && (
                <p className="text-xs font-semibold text-white/75 italic">{BOARD_LINES[president.role]}</p>
              )}
            </div>
          </article>
        </Reveal>
        {rest.map((p, i) => (
          <Reveal key={p.name} delay={(i % 4) * 70}>
            <article className="group flex items-center gap-3 rounded-2xl border border-[#F0D9BE] bg-white/85 p-2.5 shadow-[0_12px_30px_-22px_rgba(36,29,77,.5)] transition-transform duration-300 hover:-translate-y-0.5">
              <img
                src={p.img}
                alt={p.name}
                loading="lazy"
                className="size-14 shrink-0 rounded-xl object-cover object-top"
              />
              <div className="min-w-0">
                <h3 className="truncate text-sm font-extrabold text-[#241D4D]">{p.name}</h3>
                <p className="truncate text-[11px] font-semibold text-[#6B5B73]">{p.role}</p>
                {BOARD_LINES[p.role] && (
                  <p className="truncate text-[11px] text-[#A82F43] italic">{BOARD_LINES[p.role]}</p>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/*
 * A Line of Leadership: pinned horizontal scroll on desktop (scrub),
 * native snap-scroll strip on mobile / reduced-motion.
 */
export function PresidentsRail() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const track = trackRef.current;
        const section = sectionRef.current;
        if (!track || !section) return;
        const getX = () => -(track.scrollWidth - section.clientWidth);
        const tween = gsap.to(track, {
          x: getX,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top+=72',
            end: () => `+=${track.scrollWidth - section.clientWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
            }
          }
        });
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden rounded-[2rem] bg-[#241D4D] py-8 text-white md:h-screen md:py-0">
      <div className="flex h-full flex-col justify-center gap-4 px-4 md:gap-6 md:px-10">
        <div className="max-w-6xl">
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#FFB86B] uppercase">
            <Crown className="size-4" /> A line of leadership
          </p>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">Eight presidents. One unbroken line.</h2>
          <p className="mt-2 hidden text-sm text-white/60 md:block">Keep scrolling — the wall moves sideways.</p>
        </div>
        <div className="md:overflow-visible">
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:w-max md:snap-none md:overflow-visible md:pb-0"
          >
            {PRESIDENTS.map((p) => (
              <article
                key={p.term}
                className="group w-52 shrink-0 snap-center overflow-hidden rounded-3xl border border-white/12 bg-white/5 transition-colors hover:border-[#FFB86B]/60 md:w-64"
              >
                <div className="overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover object-top transition-transform duration-700 group-hover:scale-108"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-extrabold text-white">{p.name}</p>
                  <p className="mt-1 inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-bold text-[#FFB86B]">
                    {p.term}
                  </p>
                  {p.current && (
                    <p className="mt-1.5 text-[11px] font-bold tracking-wide text-[#0FB5B1] uppercase">
                      Current president
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="hidden max-w-6xl md:block">
          <div className="h-1 overflow-hidden rounded-full bg-white/15">
            <div ref={barRef} className="h-full w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-[#E0475F] to-[#F2A900]" />
          </div>
        </div>
      </div>
    </section>
  );
}
