import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera, Quote, X } from 'lucide-react';
import Reveal from './Reveal';
import { PROJECTS } from './photos';
import { FIELD_NOTES, FIELD_PHOTOS, QUOTES, SATURDAY_MOMENTS } from './stories';

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_COLORS = {
  Education: '#8B5CF6',
  Health: '#F472B6',
  Leadership: '#FBBF24',
  'Professional Development': '#34D399',
  Environment: '#64748B'
};

const CATEGORY_TEXT = {
  Education: 'text-white',
  Health: 'text-white',
  Leadership: 'text-ink',
  'Professional Development': 'text-ink',
  Environment: 'text-white'
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4"
      onClick={onClose}
      role="dialog"
      aria-label="Photo viewer"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close viewer"
        className="suk-shadow-sm absolute top-4 right-4 grid size-11 place-items-center rounded-full border-2 border-ink bg-white text-ink transition-transform hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-plum/40 focus-visible:outline-none"
      >
        <X className="size-5" strokeWidth={2.5} />
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
            className="suk-shadow-sm absolute left-2 grid size-11 place-items-center rounded-full border-2 border-ink bg-white text-xl font-black text-ink transition-transform hover:-translate-y-0.5 md:left-6"
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
            className="suk-shadow-sm absolute right-2 grid size-11 place-items-center rounded-full border-2 border-ink bg-white text-xl font-black text-ink transition-transform hover:-translate-y-0.5 md:right-6"
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
        className="shadow-[8px_8px_0_0_#fbbf24] max-h-[82vh] max-w-full rounded-2xl border-4 border-white object-contain"
      />
      {photos.length > 1 && (
        <p className="suk-shadow-sm absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-bold text-ink tabular-nums">
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
    <div className="mt-4 flex gap-3">
      <button
        type="button"
        onClick={() => onOpen(0)}
        className="suk-shadow-sm group relative overflow-hidden rounded-2xl border-2 border-ink transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:-translate-y-1"
      >
        <img src={first} alt="Field moment" loading="lazy" className="h-20 w-28 object-cover transition-transform duration-500 group-hover:scale-110" />
        <span className="absolute inset-0 grid place-items-center bg-ink/0 transition-colors group-hover:bg-ink/40">
          <Camera className="size-5 text-white opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={2.5} />
        </span>
      </button>
      {rest.length > 0 && (
        <button
          type="button"
          onClick={() => onOpen(1)}
          className="suk-shadow-sm grid h-20 w-20 place-items-center rounded-2xl border-2 border-ink bg-rose font-bold text-white transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:-translate-y-1 hover:-rotate-2"
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
  const color = CATEGORY_COLORS[p.category] || '#8B5CF6';
  const textColor = CATEGORY_TEXT[p.category] || 'text-white';
  return (
    <div className={`relative pl-12 md:w-[calc(50%-2rem)] md:pl-0 ${side === 'right' ? 'md:ml-auto' : 'md:mr-auto'}`}>
      <span
        className={`suk-tnode absolute top-6 ${side === 'right' ? 'suk-tnode-r' : 'suk-tnode-l'}`}
        style={{ backgroundColor: color }}
      />
      <Reveal>
        <article className="suk-shadow-lg group rounded-3xl border-2 border-ink bg-white p-5 transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:-translate-y-1 hover:-rotate-1 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              className={`inline-block rounded-full border-2 border-ink px-3 py-1 text-[11px] font-bold tracking-[0.08em] uppercase -rotate-1 ${textColor}`}
              style={{ backgroundColor: color }}
            >
              {p.category}
            </span>
            <span className="rounded-xl bg-mut/10 px-2.5 py-1 text-xs font-bold text-mut tabular-nums">{p.date}</span>
          </div>
          <h3 className="mt-3 font-display text-lg leading-snug font-bold text-ink md:text-xl">{p.title}</h3>
          {story && (
            <>
              <p className="mt-3 rounded-2xl rounded-bl-none border-2 border-line bg-mut/5 px-4 py-3 text-sm leading-relaxed text-mut italic">
                {story.note}
              </p>
              <p className="mt-3 inline-block rounded-full border-2 border-ink bg-mint px-3 py-1 text-xs font-bold text-ink uppercase">
                {story.impact}
              </p>
            </>
          )}
          <p className="mt-3 text-xs font-bold tracking-[0.04em] text-mut uppercase">{p.location}</p>
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
    <div ref={rootRef} className="relative mt-6">
      <span className="absolute top-0 bottom-0 left-4 w-2 -translate-x-1/2 rounded-full bg-mut/20 md:left-1/2">
        <span ref={lineRef} className="block h-full w-full origin-top rounded-full bg-ink" />
      </span>
      <div className="space-y-7 md:space-y-9">
        {PROJECTS.map((p, i) => (
          <TimelineEntry key={p.title} p={p} side={i % 2 === 0 ? 'left' : 'right'} onOpen={(idx) => onOpenGallery(galleryFor(p), idx)} />
        ))}
      </div>
    </div>
  );
}

export function SaturdaySection({ onOpenGallery }) {
  return (
    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
      {SATURDAY_MOMENTS.map((m, i) => (
        <Reveal key={m.time} delay={(i % 4) * 80} className="h-full">
          <article className={`group flex h-full flex-col rounded-3xl border-2 border-ink bg-white transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:scale-[1.03] ${i % 2 ? 'suk-shadow-pink rotate-1 sm:translate-y-4' : 'suk-shadow -rotate-1'}`}>
            <button type="button" onClick={() => onOpenGallery([m.img], 0)} className="relative block w-full overflow-hidden rounded-t-[1.375rem]">
              <img
                src={m.img}
                alt={m.title}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <span className="suk-shadow-sm absolute top-3 left-3 rounded-full border-2 border-ink bg-rose px-3 py-1 text-xs font-bold text-white tabular-nums">
                {m.time}
              </span>
            </button>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="suk-wiggle font-display text-lg font-bold text-ink">{m.title}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-mut">{m.text}</p>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

export function VoicesStrip() {
  return (
    <div className="grid gap-7 md:grid-cols-3">
      {QUOTES.map((q, i) => (
        <Reveal key={q.by} delay={i * 100} className="h-full">
          <figure className={`flex h-full flex-col rounded-3xl border-2 border-ink bg-white p-6 transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:-rotate-1 hover:scale-[1.02] ${i % 2 ? 'suk-shadow-pink' : 'suk-shadow'}`}>
            <span className="grid size-12 place-items-center rounded-2xl border-2 border-ink bg-mint text-ink suk-shadow-sm">
              <Quote className="suk-wiggle size-6" strokeWidth={2.5} />
            </span>
            <blockquote className="mt-4 flex-1 text-base leading-relaxed font-semibold text-ink italic">“{q.text}”</blockquote>
            <figcaption className="mt-4 text-xs font-bold tracking-[0.1em] text-gold uppercase">— {q.by}</figcaption>
          </figure>
        </Reveal>
      ))}
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