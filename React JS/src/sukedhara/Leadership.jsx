import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Crown } from 'lucide-react';
import Reveal from './Reveal';
import { BOARD_FULL, PRESIDENTS } from './photos';
import { BOARD_LINES } from './stories';

gsap.registerPlugin(ScrollTrigger);

const CHIP_TINTS = ['bg-plum text-white', 'bg-mint text-ink', 'bg-gold text-ink', 'bg-rose text-white'];

/* The board, photo-first: president anchors the grid at 2×2, everyone else
 * gets a large sticker portrait. Only the president is bigger. */
export function BoardSection() {
  const [president, ...rest] = BOARD_FULL;
  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
      <Reveal className="col-span-2 row-span-2">
        <article className="group suk-shadow-pink relative h-full min-h-[420px] overflow-hidden rounded-[2rem] border-2 border-ink bg-white transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:-rotate-1 md:min-h-[560px]">
          <img
            src={president.img}
            alt={president.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute top-4 left-4 rotate-[-3deg] rounded-full border-2 border-ink bg-gold px-3 py-1.5 text-xs font-bold text-ink uppercase suk-shadow-sm">
            {president.role} · 2026-27
          </span>
          <div className="absolute inset-x-4 bottom-4 rounded-2xl border-2 border-ink bg-white p-4 suk-shadow-sm">
            <h3 className="font-display text-xl font-bold text-ink md:text-3xl">{president.name.replace('Rtr. ', '')}</h3>
            {BOARD_LINES[president.role] && (
              <p className="mt-1 text-sm font-semibold text-mut italic">{BOARD_LINES[president.role]}</p>
            )}
          </div>
        </article>
      </Reveal>

      {rest.map((p, i) => (
        <Reveal key={p.name} delay={(i % 4) * 80} className="h-full">
          <article className="group flex h-full flex-col rounded-3xl border-2 border-ink bg-white transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:-translate-y-1.5 hover:rotate-1">
            <div className="overflow-hidden rounded-t-[1.375rem]">
              <img
                src={p.img}
                alt={p.name}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-3.5 md:p-4">
              <span className={`self-start rounded-full border-2 border-ink px-2.5 py-0.5 text-[10px] font-bold tracking-[0.06em] uppercase -rotate-1 ${CHIP_TINTS[i % 4]}`}>
                {p.role}
              </span>
              <h3 className="mt-2 font-display text-base leading-tight font-bold text-ink">{p.name.replace('Rtr. ', '')}</h3>
              {BOARD_LINES[p.role] && (
                <p className="mt-1 line-clamp-2 text-xs font-semibold text-mut italic">{BOARD_LINES[p.role]}</p>
              )}
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

/* A Line of Leadership: pinned horizontal scroll on desktop (scrub),
 * native snap-scroll strip on mobile / reduced-motion. */
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
    <section ref={sectionRef} className="w-full overflow-hidden border-y-2 border-ink bg-plum py-10 text-white md:h-screen md:py-0">
      <div className="flex h-full flex-col justify-center gap-6 px-4 md:gap-8 md:px-8">
        <div className="max-w-6xl">
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-gold px-4 py-1.5 text-xs font-bold tracking-[0.1em] text-ink uppercase suk-shadow-sm">
            <Crown className="size-4" strokeWidth={2.5} /> A line of leadership
          </p>
          <h2 className="mt-4 font-display text-3xl font-extrabold uppercase md:text-5xl">Eight presidents. One unbroken line.</h2>
          <p className="mt-2 hidden text-sm font-semibold text-white/70 md:block">Keep scrolling — the wall moves sideways →</p>
        </div>
        <div className="md:overflow-visible">
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 md:w-max md:snap-none md:overflow-visible md:pb-0"
          >
            {PRESIDENTS.map((p) => (
              <article
                key={p.term}
                className="group w-56 shrink-0 snap-center rounded-3xl border-2 border-ink bg-white text-ink shadow-[6px_6px_0_0_rgba(30,41,59,1)] transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:-translate-y-2 hover:-rotate-1 md:w-64"
              >
                <div className="overflow-hidden rounded-t-[1.375rem]">
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="font-display text-base font-bold text-ink">{p.name.replace('Rtr. ', '')}</p>
                  <p className="mt-1.5 inline-block rounded-full border-2 border-ink bg-gold px-2 py-0.5 text-[10px] font-bold text-ink">
                    {p.term}
                  </p>
                  {p.current && (
                    <p className="mt-1.5 inline-block rounded-full border-2 border-ink bg-rose px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                      Current president
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="hidden max-w-6xl md:block">
          <div className="h-3 overflow-hidden rounded-full border-2 border-ink bg-white">
            <div ref={barRef} className="h-full w-full origin-left scale-x-0 rounded-full bg-gold" />
          </div>
        </div>
      </div>
    </section>
  );
}