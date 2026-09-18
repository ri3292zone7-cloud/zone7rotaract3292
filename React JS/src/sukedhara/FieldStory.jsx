import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera, Quote, X } from 'lucide-react';
import Reveal from './Reveal';
import { PROJECTS } from './photos';
import { FIELD_NOTES, FIELD_PHOTOS, QUOTES, SATURDAY_MOMENTS } from './stories';

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_COLORS = {
  Education: '#2EA5AD',
  Health: '#E96D51',
  Leadership: '#123B3C',
  'Professional Development': '#6A3FA0',
  Environment: '#7FB84E'
};

function galleryFor(p) {
  if (p.title.startsWith('ESRAG')) return FIELD_PHOTOS.esrag;
  if (p.title.includes('Eye Camp')) return FIELD_PHOTOS.eye;
  if (p.img) return [p.img];
  return [];
}

export function Lightbox({ photos, index, onClose, onStep }) {
  useLayoutEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onStep]);

  if (!photos || photos.length === 0) return null;
  const src = photos[((index % photos.length) + photos.length) % photos.length];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-teal-ink/95 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-label="Photo viewer"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close viewer"
        className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
      >
        <X className="size-5" />
      </button>
      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation();
              onStep(-1);
            }}
            className="absolute left-2 grid size-10 place-items-center rounded-full bg-white/10 text-xl font-black text-white transition-colors hover:bg-white/25 md:left-6"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              onStep(1);
            }}
            className="absolute right-2 grid size-10 place-items-center rounded-full bg-white/10 text-xl font-black text-white transition-colors hover:bg-white/25 md:right-6"
          >
            ›
          </button>
        </>
      )}
      <img
        key={src}
        src={src}
        alt="Field photo"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[84vh] max-w-full rounded-2xl object-contain shadow-2xl"
      />
      {photos.length > 1 && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 font-mono text-xs font-semibold text-white tabular-nums">
          {((index % photos.length) + photos.length) % photos.length + 1} / {photos.length}
        </p>
      )}
    </div>
  );
}

function Thumbs({ photos, onOpen }) {
  if (photos.length === 0) return null;
  const [first, ...rest] = photos;
  return (
    <div className="mt-4 flex gap-2">
      <button type="button" onClick={() => onOpen(0)} className="group relative overflow-hidden rounded-xl">
        <img src={first} alt="Field moment" loading="lazy" className="h-20 w-28 object-cover transition-transform duration-500 group-hover:scale-110" />
        <span className="absolute inset-0 grid place-items-center bg-teal-ink/0 transition-colors group-hover:bg-teal-ink/40">
          <Camera className="size-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
        </span>
      </button>
      {rest.length > 0 && (
        <button
          type="button"
          onClick={() => onOpen(1)}
          className="grid h-20 w-20 place-items-center rounded-xl bg-coral font-mono text-sm font-bold text-white transition-transform hover:scale-105"
        >
          +{rest.length}
        </button>
      )}
    </div>
  );
}

function TimelineEntry({ p, side, onOpen }) {
  const story = FIELD_NOTES[p.title];
  const photos = galleryFor(p);
  const color = CATEGORY_COLORS[p.category] || '#2EA5AD';
  return (
    <div className={`relative pl-12 md:w-[calc(50%-2.25rem)] md:pl-0 ${side === 'right' ? 'md:ml-auto' : 'md:mr-auto'}`}>
      <span
        className={`suk-tnode absolute top-5 md:top-6 ${side === 'right' ? 'suk-tnode-r' : 'suk-tnode-l'}`}
        style={{ backgroundColor: color }}
      />
      <Reveal>
        <article className="group rounded-3xl bg-paper p-5 shadow-[0_18px_45px_-30px_rgba(18,59,60,.5)] transition-transform duration-300 hover:-translate-y-0.5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <span
              className="rounded-full px-2.5 py-1 font-mono text-[9px] font-bold tracking-[0.12em] text-white uppercase"
              style={{ backgroundColor: color }}
            >
              {p.category}
            </span>
            <span className="font-mono text-[10px] font-semibold text-mut tabular-nums">{p.date}</span>
          </div>
          <h3 className="mt-3 font-display text-base leading-snug font-bold text-ink md:text-lg">{p.title}</h3>
          {story && (
            <>
              <p className="mt-3 border-l-2 border-coral pl-3 text-sm leading-relaxed text-ink/70 italic">{story.note}</p>
              <p className="mt-3 inline-block rounded-full bg-teal/10 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.08em] text-teal-deep uppercase">
                {story.impact}
              </p>
            </>
          )}
          <p className="mt-3 font-mono text-[10px] font-semibold tracking-[0.06em] text-mut uppercase">{p.location}</p>
          <Thumbs photos={photos} onOpen={onOpen} />
        </article>
      </Reveal>
    </div>
  );
}

export function ProjectsTimeline({ onOpenGallery }) {
  const rootRef = useRef(null);
  const lineRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (lineRef.current) lineRef.current.style.transform = 'scaleY(1)';
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top 72%', end: 'bottom 55%', scrub: true }
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div>
      <Reveal>
        <p className="font-mono text-[10px] font-semibold tracking-[0.2em] text-coral uppercase">Field logs · {PROJECTS.length} projects</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-ink md:text-5xl">A year, logged.</h2>
        <p className="mt-2 text-sm text-mut">August 2024 → June 2025. Scroll to walk it.</p>
      </Reveal>
      <div ref={rootRef} className="relative mt-7">
        <span className="absolute top-0 bottom-0 left-4 w-1 -translate-x-1/2 rounded-full bg-line md:left-1/2">
          <span ref={lineRef} className="block h-full w-full origin-top rounded-full bg-gradient-to-b from-coral via-teal to-magenta" />
        </span>
        <div className="space-y-5 md:space-y-7">
          {PROJECTS.map((p, i) => (
            <TimelineEntry key={p.title} p={p} side={i % 2 === 0 ? 'left' : 'right'} onOpen={(idx) => onOpenGallery(galleryFor(p), idx)} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SaturdaySection({ onOpenGallery }) {
  return (
    <div>
      <Reveal>
        <p className="font-mono text-[10px] font-semibold tracking-[0.2em] text-coral uppercase">Every Saturday · 10:00 AM</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-ink md:text-5xl">A Saturday at ten.</h2>
      </Reveal>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SATURDAY_MOMENTS.map((m, i) => (
          <Reveal key={m.time} delay={(i % 4) * 80} className="h-full">
            <article className={`group flex h-full flex-col rounded-3xl bg-paper shadow-[0_18px_45px_-30px_rgba(18,59,60,.5)] ${i % 2 ? 'sm:translate-y-5' : ''}`}>
              <button type="button" onClick={() => onOpenGallery([m.img], 0)} className="relative block w-full overflow-hidden rounded-t-3xl">
                <img
                  src={m.img}
                  alt={m.title}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <span className="absolute top-3 left-3 rounded-full bg-teal px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.12em] text-white tabular-nums">
                  {m.time}
                </span>
              </button>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-display text-sm font-bold text-ink">{m.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink/60">{m.text}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function VoicesStrip() {
  return (
    <div>
      <Reveal>
        <p className="font-mono text-[10px] font-semibold tracking-[0.2em] text-coral uppercase">Voices</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-ink md:text-5xl">Why they stay.</h2>
      </Reveal>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {QUOTES.map((q, i) => (
          <Reveal key={q.by} delay={i * 100} className="h-full">
            <figure className="flex h-full flex-col rounded-3xl bg-teal-ink p-6 text-white shadow-[0_25px_60px_-35px_rgba(18,59,60,.9)] transition-transform duration-300 hover:-translate-y-1">
              <Quote className="size-6 text-coral" />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-white/90 italic">“{q.text}”</blockquote>
              <figcaption className="mt-4 font-mono text-[10px] font-semibold tracking-[0.14em] text-teal uppercase">— {q.by}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function useLightbox() {
  const [box, setBox] = useState({ photos: [], index: 0, open: false });
  const openGallery = useCallback((photos, index = 0) => setBox({ photos, index, open: true }), []);
  const close = useCallback(() => setBox((b) => ({ ...b, open: false })), []);
  const step = useCallback((d) => setBox((b) => ({ ...b, index: b.index + d })), []);
  return { box, openGallery, close, step };
}