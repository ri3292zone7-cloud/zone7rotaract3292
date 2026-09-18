import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Crown } from 'lucide-react';
import Reveal from './Reveal';
import { BOARD_FULL, PRESIDENTS } from './photos';
import { BOARD_LINES } from './stories';

gsap.registerPlugin(ScrollTrigger);

/* Official 13-member board: president featured, rest in a tight ledger grid. */
export function BoardSection() {
  const [president, ...rest] = BOARD_FULL;
  return (
    <div>
      <Reveal>
        <p className="font-mono text-[10px] font-semibold tracking-[0.22em] text-volt uppercase">Leadership · 13 officers</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-bone uppercase md:text-5xl">The people on the board.</h2>
      </Reveal>
      <div className="mt-6 grid gap-px bg-hair sm:grid-cols-2 lg:grid-cols-4">
        <Reveal className="sm:col-span-2 lg:row-span-2">
          <article className="group relative h-full min-h-72 overflow-hidden border border-hair">
            <img
              src={president.img}
              alt={president.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-ink via-ink/75 to-transparent" />
            <div className="absolute right-4 bottom-4 left-4">
              <span className="bg-flame px-2.5 py-1 font-mono text-[9px] font-bold tracking-[0.16em] text-ink uppercase">
                {president.role}
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold text-bone">{president.name.replace('Rtr. ', '')}</h3>
              {BOARD_LINES[president.role] && (
                <p className="mt-1 text-xs font-medium text-bone/70 italic">{BOARD_LINES[president.role]}</p>
              )}
            </div>
          </article>
        </Reveal>
        {rest.map((p, i) => (
          <Reveal key={p.name} delay={(i % 4) * 70} className="h-full">
            <article className="group flex h-full items-center gap-3 bg-panel p-3 transition-colors hover:bg-raise">
              <img
                src={p.img}
                alt={p.name}
                loading="lazy"
                className="size-13 shrink-0 border border-hair object-cover object-top grayscale-[20%]"
              />
              <div className="min-w-0">
                <p className="font-mono text-[9px] font-semibold tracking-[0.12em] text-mut uppercase">{p.role}</p>
                <h3 className="truncate text-sm font-bold text-bone">{p.name.replace('Rtr. ', '')}</h3>
                {BOARD_LINES[p.role] && (
                  <p className="truncate text-[11px] text-flame/90 italic">{BOARD_LINES[p.role]}</p>
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
    <section ref={sectionRef} className="overflow-hidden border-y border-hair bg-raise py-8 text-bone md:h-screen md:py-0">
      <div className="flex h-full flex-col justify-center gap-5 px-4 md:gap-6 md:px-8">
        <div className="max-w-6xl">
          <p className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold tracking-[0.22em] text-flame uppercase">
            <Crown className="size-4" /> A line of leadership
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase md:text-5xl">Eight presidents. One unbroken line.</h2>
          <p className="mt-2 hidden font-mono text-[10px] tracking-[0.14em] text-mut uppercase md:block">
            Keep scrolling — the wall moves sideways →
          </p>
        </div>
        <div className="md:overflow-visible">
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:w-max md:snap-none md:overflow-visible md:pb-0"
          >
            {PRESIDENTS.map((p) => (
              <article
                key={p.term}
                className="group w-52 shrink-0 snap-center overflow-hidden border border-hair bg-panel transition-colors hover:border-flame/50 md:w-64"
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
                  <p className="font-display text-sm font-bold text-bone">{p.name.replace('Rtr. ', '')}</p>
                  <p className="mt-1 inline-block border border-volt/40 bg-volt/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-volt">
                    {p.term}
                  </p>
                  {p.current && (
                    <p className="mt-1.5 font-mono text-[10px] font-bold tracking-[0.14em] text-flame uppercase">
                      Current president
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="hidden max-w-6xl md:block">
          <div className="h-0.5 overflow-hidden bg-hair">
            <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-flame to-volt" />
          </div>
        </div>
      </div>
    </section>
  );
}