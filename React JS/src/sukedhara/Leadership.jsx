import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Crown } from 'lucide-react';
import Reveal from './Reveal';
import { BOARD, PRESIDENTS } from './photos';

gsap.registerPlugin(ScrollTrigger);

/* BOD card with pointer tilt (desktop, motion-safe only). */
function BoardCard({ person, index }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateY(-6px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <Reveal delay={index * 120}>
      <article
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="group overflow-hidden rounded-3xl border border-[#F0D9BE] bg-white shadow-[0_24px_55px_-28px_rgba(160,47,67,.5)] transition-[transform,box-shadow] duration-200 will-change-transform"
      >
        <div className="relative overflow-hidden">
          <img
            src={person.img}
            alt={person.name}
            loading="lazy"
            className="aspect-[3/4] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#241D4D]/70 to-transparent" />
          <span className="absolute bottom-3 left-4 rounded-full bg-[#FFB86B] px-3 py-1 text-[11px] font-black tracking-wide text-[#241D4D] uppercase">
            {person.role}
          </span>
        </div>
        <h3 className="px-5 pt-4 pb-5 text-xl font-extrabold text-[#241D4D]">{person.name}</h3>
      </article>
    </Reveal>
  );
}

export function BoardSection() {
  return (
    <div>
      <Reveal>
        <p className="text-xs font-bold tracking-[0.2em] text-[#0FB5B1] uppercase">RY 2026-27 board</p>
        <h2 className="mt-2 text-3xl font-black text-[#241D4D] md:text-4xl">The crew steering the hop.</h2>
      </Reveal>
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {BOARD.map((p, i) => (
          <BoardCard key={p.name} person={p} index={i} />
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
    <section ref={sectionRef} className="overflow-hidden rounded-[2rem] bg-[#241D4D] py-10 text-white md:h-screen md:py-0">
      <div className="flex h-full flex-col justify-center gap-6 px-4 md:gap-8 md:px-10">
        <div className="max-w-6xl">
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#FFB86B] uppercase">
            <Crown className="size-4" /> A line of leadership
          </p>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">Eight presidents. One unbroken hop.</h2>
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
