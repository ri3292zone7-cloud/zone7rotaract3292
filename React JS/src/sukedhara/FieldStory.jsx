import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera, Quote, X } from 'lucide-react';
import Reveal from './Reveal';
import { PROJECTS } from './photos';
import { FIELD_NOTES, FIELD_PHOTOS, QUOTES, SATURDAY_MOMENTS } from './stories';

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_COLORS = {
  Education: '#FF4D1C',
  Health: '#37D6C0',
  Leadership: '#F2EEE3',
  'Professional Development': '#6A3FA0',
  Environment: '#D9A62E'
};

function galleryFor(p) {
  if (p.title.startsWith('ESRAG')) return FIELD_PHOTOS.esrag;
  if (p.title.includes('Eye Camp')) return FIELD_PHOTOS.eye;
  if (p.img) return [p.img];
  return [];
}

/* Full-screen photo viewer shared by every gallery on the page. */
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-label="Photo viewer"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close viewer"
        className="absolute top-4 right-4 grid size-10 place-items-center border border-hair bg-panel text-bone transition-colors hover:border-flame hover:text-flame"
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
            className="absolute left-2 grid size-10 place-items-center border border-hair bg-panel text-xl font-black text-bone transition-colors hover:border-flame hover:text-flame md:left-6"
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
            className="absolute right-2 grid size-10 place-items-center border border-hair bg-panel text-xl font-black text-bone transition-colors hover:border-flame hover:text-flame md:right-6"
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
        className="max-h-[84vh] max-w-full border-2 border-bone/80 object-contain bg-ink shadow-2xl"
      />
      {photos.length > 1 && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-ink/80 px-3 py-1 font-mono text-xs font-semibold text-bone tabular-nums">
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
      <button type="button" onClick={() => onOpen(0)} className="group relative overflow-hidden border border-hair">
        <img src={first} alt="Field moment" loading="lazy" className="h-20 w-28 object-cover transition-transform duration-500 group-hover:scale-110" />
        <span className="absolute inset-0 grid place-items-center bg-ink/0 transition-colors group-hover:bg-ink/45">
          <Camera className="size-5 text-bone opacity-0 transition-opacity group-hover:opacity-100" />
        </span>
      </button>
      {rest.length > 0 && (
        <button
          type="button"
          onClick={() => onOpen(1)}
          className="grid h-20 w-20 place-items-center border border-flame/50 bg-flame/10 font-mono text-sm font-bold text-flame transition-colors hover:bg-flame hover:text-ink"
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
  const color = CATEGORY_COLORS[p.category] || '#FF4D1C';
  return (
    <div className={`relative pl-12 md:w-[calc(50%-2.25rem)] md:pl-0 ${side === 'right' ? 'md:ml-auto' : 'md:mr-auto'}`}>
      <span
        className={`suk-tnode absolute top-5 md:top-6 ${side === 'right' ? 'suk-tnode-r' : 'suk-tnode-l'}`}
        style={{ backgroundColor: color }}
      />
      <Reveal>
        <article className="group border border-hair bg-panel p-5 transition-colors hover:border-bone/25 hover:bg-raise">
          <div className="flex items-center justify-between gap-3">
            <span
              className="px-2.5 py-1 font-mono text-[9px] font-bold tracking-[0.16em] text-ink uppercase"
              style={{ backgroundColor: color }}
            >
              {p.category}
            </span>
            <span className="font-mono text-[10px] font-semibold text-mut tabular-nums">{p.date}</span>
          </div>
          <h3 className="mt-3 font-display text-base leading-snug font-bold text-bone md:text-lg">{p.title}</h3>
          {story && (
            <>
              <p className="mt-3 border-l-2 border-flame pl-3 text-sm leading-relaxed text-bone/65 italic">{story.note}</p>
              <p className="mt-3 inline-block border border-volt/40 bg-volt/10 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.1em] text-volt uppercase">
                {story.impact}
              </p>
            </>
          )}
          <p className="mt-3 font-mono text-[10px] font-semibold tracking-[0.08em] text-mut uppercase">{p.location}</p>
          <Thumbs photos={photos} onOpen={onOpen} />
        </article>
      </Reveal>
    </div>
  );
}

/* The year in the field: scroll-drawn timeline of all 9 projects. */
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
        <p className="font-mono text-[10px] font-semibold tracking-[0.22em] text-volt uppercase">Field logs · {PROJECTS.length} projects</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-bone uppercase md:text-5xl">A year, logged.</h2>
        <p className="mt-2 text-sm text-bone/50">August 2024 → June 2025. Scroll to walk it.</p>
      </Reveal>
      <div ref={rootRef} className="relative mt-6">
        <span className="absolute top-0 bottom-0 left-4 w-px -translate-x-1/2 bg-hair md:left-1/2">
          <span ref={lineRef} className="block h-full w-full origin-top bg-gradient-to-b from-flame via-[#D9A62E] to-volt" />
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

/* A Saturday at 10 AM: the meetup morning, hour by hour. */
export function SaturdaySection({ onOpenGallery }) {
  return (
    <div>
      <Reveal>
        <p className="font-mono text-[10px] font-semibold tracking-[0.22em] text-volt uppercase">Every Saturday · 10:00 AM</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-bone uppercase md:text-5xl">A Saturday at ten.</h2>
      </Reveal>
      <div className="mt-6 grid gap-px bg-hair sm:grid-cols-2 lg:grid-cols-4">
        {SATURDAY_MOMENTS.map((m, i) => (
          <Reveal key={m.time} delay={(i % 4) * 80} className="h-full">
            <article className={`group flex h-full flex-col bg-panel ${i % 2 ? 'sm:translate-y-4' : ''}`}>
              <button type="button" onClick={() => onOpenGallery([m.img], 0)} className="relative block w-full overflow-hidden">
                <img
                  src={m.img}
                  alt={m.title}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <span className="absolute top-2 left-2 bg-ink/80 px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.14em] text-volt tabular-nums">
                  {m.time}
                </span>
              </button>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-display text-sm font-bold text-bone">{m.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-bone/55">{m.text}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* Member voices. */
export function VoicesStrip() {
  return (
    <div>
      <Reveal>
        <p className="font-mono text-[10px] font-semibold tracking-[0.22em] text-volt uppercase">Voices</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-bone uppercase md:text-5xl">Why they stay.</h2>
      </Reveal>
      <div className="mt-6 grid gap-px bg-hair md:grid-cols-3">
        {QUOTES.map((q, i) => (
          <Reveal key={q.by} delay={i * 100} className="h-full">
            <figure className="flex h-full flex-col bg-panel p-6 transition-colors hover:bg-raise">
              <Quote className="size-6 text-flame" />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-bone/85 italic">“{q.text}”</blockquote>
              <figcaption className="mt-4 font-mono text-[10px] font-semibold tracking-[0.16em] text-volt uppercase">— {q.by}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function useLightbox() {
  const [box, setBox] = useState({ photos: [], index: 0, open: false });
  const openGallery = useCallback(
    (photos, index = 0) => setBox({ photos, index, open: true }),
    []
  );
  const close = useCallback(() => setBox((b) => ({ ...b, open: false })), []);
  const step = useCallback((d) => setBox((b) => ({ ...b, index: b.index + d })), []);
  return { box, openGallery, close, step };
}