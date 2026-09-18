import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera, Quote, X } from 'lucide-react';
import Reveal from './Reveal';
import { PROJECTS } from './photos';
import { FIELD_NOTES, FIELD_PHOTOS, QUOTES, SATURDAY_MOMENTS } from './stories';

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_COLORS = {
  Education: '#E0475F',
  Health: '#0FB5B1',
  Leadership: '#F2A900',
  'Professional Development': '#6A3FA0',
  Environment: '#1C8A4D'
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#14122B]/90 p-4 backdrop-blur-sm"
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
        className="max-h-[84vh] max-w-full rounded-2xl border-4 border-white object-contain shadow-2xl"
      />
      {photos.length > 1 && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white tabular-nums">
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
    <div className="mt-3 flex gap-2">
      <button type="button" onClick={() => onOpen(0)} className="group relative overflow-hidden rounded-xl">
        <img src={first} alt="Field moment" loading="lazy" className="h-20 w-28 object-cover transition-transform duration-500 group-hover:scale-110" />
        <span className="absolute inset-0 grid place-items-center bg-[#241D4D]/0 transition-colors group-hover:bg-[#241D4D]/35">
          <Camera className="size-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
        </span>
      </button>
      {rest.length > 0 && (
        <button
          type="button"
          onClick={() => onOpen(1)}
          className="grid h-20 w-20 place-items-center rounded-xl bg-[#241D4D] text-sm font-black text-[#FFB86B] transition-transform hover:scale-105"
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
  return (
    <div className={`relative pl-12 md:w-[calc(50%-2.25rem)] md:pl-0 ${side === 'right' ? 'md:ml-auto' : 'md:mr-auto'}`}>
      {/* node on the line */}
      <span
        className={`suk-tnode absolute top-5 md:top-6 ${side === 'right' ? 'suk-tnode-r' : 'suk-tnode-l'}`}
        style={{ backgroundColor: CATEGORY_COLORS[p.category] || '#E0475F' }}
      />
      <Reveal>
        <article className="rounded-3xl border border-[#F0D9BE] bg-white/90 p-4 shadow-[0_18px_45px_-28px_rgba(36,29,77,.5)] md:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-widest text-white uppercase"
              style={{ backgroundColor: CATEGORY_COLORS[p.category] || '#E0475F' }}
            >
              {p.category}
            </span>
            <span className="text-[11px] font-bold text-[#6B5B73] tabular-nums">{p.date}</span>
          </div>
          <h3 className="mt-2 text-base leading-snug font-extrabold text-[#241D4D] md:text-lg">{p.title}</h3>
          {story && (
            <>
              <p className="mt-2 border-l-2 border-[#FFB86B] pl-3 text-sm leading-relaxed text-[#4A3F63] italic">
                {story.note}
              </p>
              <p className="mt-2 inline-block rounded-full bg-[#0FB5B1]/10 px-2.5 py-1 text-[11px] font-bold text-[#0B7C7A]">
                {story.impact}
              </p>
            </>
          )}
          <p className="mt-2 truncate text-[11px] font-semibold text-[#6B5B73]">{p.location}</p>
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
        <p className="text-xs font-bold tracking-[0.2em] text-[#0FB5B1] uppercase">In action · {PROJECTS.length} projects</p>
        <h2 className="mt-1 text-3xl font-black text-[#241D4D] md:text-4xl">A year in the field.</h2>
        <p className="mt-1 text-sm text-[#6B5B73]">August 2024 → June 2025. Scroll to walk it.</p>
      </Reveal>
      <div ref={rootRef} className="relative mt-5">
        <span className="absolute top-0 bottom-0 left-4 w-1 -translate-x-1/2 rounded-full bg-[#241D4D]/8 md:left-1/2">
          <span ref={lineRef} className="block h-full w-full origin-top rounded-full bg-gradient-to-b from-[#E0475F] via-[#F2A900] to-[#0FB5B1]" />
        </span>
        <div className="space-y-4 md:space-y-6">
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
        <p className="text-xs font-bold tracking-[0.2em] text-[#0FB5B1] uppercase">Every Saturday · 10:00 AM</p>
        <h2 className="mt-1 text-3xl font-black text-[#241D4D] md:text-4xl">A Saturday at ten.</h2>
      </Reveal>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SATURDAY_MOMENTS.map((m, i) => (
          <Reveal key={m.time} delay={(i % 4) * 80}>
            <article className={`group overflow-hidden rounded-3xl bg-white shadow-[0_18px_45px_-28px_rgba(36,29,77,.5)] ${i % 2 ? 'sm:translate-y-6' : ''}`}>
              <button type="button" onClick={() => onOpenGallery([m.img], 0)} className="relative block w-full overflow-hidden">
                <img
                  src={m.img}
                  alt={m.title}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <span className="absolute top-2 left-2 rounded-full bg-[#241D4D]/80 px-2.5 py-1 text-[10px] font-black tracking-widest text-[#FFB86B] tabular-nums">
                  {m.time}
                </span>
              </button>
              <div className="p-4">
                <h3 className="text-sm font-extrabold text-[#241D4D]">{m.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#4A3F63]">{m.text}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* Placeholder member voices. */
export function VoicesStrip() {
  return (
    <div>
      <Reveal>
        <p className="text-xs font-bold tracking-[0.2em] text-[#0FB5B1] uppercase">Voices</p>
        <h2 className="mt-1 text-3xl font-black text-[#241D4D] md:text-4xl">Why they stay.</h2>
      </Reveal>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {QUOTES.map((q, i) => (
          <Reveal key={q.by} delay={i * 100}>
            <figure className="flex h-full flex-col rounded-3xl bg-[#241D4D] p-5 text-white shadow-[0_18px_45px_-28px_rgba(36,29,77,.7)]">
              <Quote className="size-6 text-[#FFB86B]" />
              <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-white/90 italic">“{q.text}”</blockquote>
              <figcaption className="mt-3 text-[11px] font-bold tracking-widest text-[#FFB86B] uppercase">— {q.by}</figcaption>
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
