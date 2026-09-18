import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Crown } from 'lucide-react';
import Reveal from './Reveal';
import { BOARD_FULL, PRESIDENTS } from './photos';
import { BOARD_LINES } from './stories';

gsap.registerPlugin(ScrollTrigger);

/*
 * The board, photo-first: the president anchors the grid at 2×2, everyone
 * else gets a large portrait card. Only the president is bigger.
 */
export function BoardSection() {
  const [president, ...rest] = BOARD_FULL;
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 md:gap-4">
        {/* President: the biggest card on the board. */}
        <Reveal className="col-span-2 row-span-2">
          <article className="group relative h-full min-h-[420px] overflow-hidden rounded-3xl shadow-[0_30px_70px_-30px_rgba(18,59,60,.55)] md:min-h-[560px]">
            <img
              src={president.img}
              alt={president.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-plum-ink via-gold-ink/70 to-transparent" />
            <span className="absolute top-4 left-4 rounded-full bg-gold px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.14em] text-ink uppercase shadow-lg">
              {president.role} · 2026-27
            </span>
            <div className="absolute right-5 bottom-5 left-5">
              <h3 className="font-display text-2xl font-bold text-white md:text-4xl">{president.name.replace('Rtr. ', '')}</h3>
              {BOARD_LINES[president.role] && (
                <p className="mt-1.5 text-sm font-medium text-white/75 italic">{BOARD_LINES[president.role]}</p>
              )}
            </div>
          </article>
        </Reveal>

        {/* Officers: large portraits, second only to the president. */}
        {rest.map((p, i) => (
          <Reveal key={p.name} delay={(i % 4) * 80} className="h-full">
            <article className="group relative overflow-hidden rounded-3xl bg-paper shadow-[0_18px_45px_-28px_rgba(18,59,60,.4)] transition-transform duration-300 hover:-translate-y-1.5">
              <div className="overflow-hidden">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <span className="absolute top-3 left-3 rounded-full bg-aubergine/85 px-2.5 py-1 font-mono text-[9px] font-bold tracking-[0.1em] text-white uppercase">
                {p.role}
              </span>
              <div className="p-3.5 md:p-4">
                <h3 className="truncate font-display text-sm font-bold text-ink md:text-base">{p.name.replace('Rtr. ', '')}</h3>
                {BOARD_LINES[p.role] && (
                  <p className="mt-0.5 line-clamp-2 text-[11px] font-medium text-mut italic md:text-xs">{BOARD_LINES[p.role]}</p>
                )}
              </div>
            </article>
          </Reveal>
        ))}
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
    <section
      ref={sectionRef}
      className="w-full overflow-hidden border-y border-line bg-aubergine py-8 text-white md:h-screen md:py-0"
    >
      <div className="flex h-full flex-col justify-center gap-5 px-4 md:gap-6 md:px-10">
        <div className="max-w-6xl">
          <p className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold tracking-[0.22em] text-gold uppercase">
            <Crown className="size-4" /> A line of leadership
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase md:text-5xl">Eight presidents. One unbroken line.</h2>
          <p className="mt-2 hidden font-mono text-[10px] tracking-[0.14em] text-white/50 uppercase md:block">
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
                className="group w-52 shrink-0 snap-center overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/15 transition-colors hover:ring-gold/60 md:w-64"
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
                  <p className="font-display text-sm font-bold text-white">{p.name.replace('Rtr. ', '')}</p>
                  <p className="mt-1 inline-block rounded-full bg-gold/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-gold">
                    {p.term}
                  </p>
                  {p.current && (
                    <p className="mt-1.5 font-mono text-[10px] font-bold tracking-[0.14em] text-gold uppercase">
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
            <div ref={barRef} className="h-full w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-rose to-gold" />
          </div>
        </div>
      </div>
    </section>
  );
}