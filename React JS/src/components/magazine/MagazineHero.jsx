import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Eyebrow from '../ui/Eyebrow';
import Reveal from '../ui/Reveal';
import MagazineScene from './MagazineScene';
import { bookMotion } from '../../lib/bookMotion';
import { MAGAZINE, HERO_STATS } from '../../data/store';

gsap.registerPlugin(ScrollTrigger);

function splitWords(el) {
  const frag = document.createDocumentFragment();
  Array.from(el.childNodes).forEach((node) => {
    if (node.nodeType !== 3) {
      frag.appendChild(node.cloneNode(true));
      return;
    }
    node.textContent.trim().split(/\s+/).forEach((w) => {
      const rw = document.createElement('span');
      rw.className = 'rword';
      const inner = document.createElement('span');
      inner.textContent = w + '\u00A0';
      rw.appendChild(inner);
      frag.appendChild(rw);
    });
  });
  el.textContent = '';
  el.appendChild(frag);
}

export default function MagazineHero() {
  const root = useRef(null);
  const glowRef = useRef(null);
  const copyRef = useRef(null);
  const statsRef = useRef(null);
  const titleRef = useRef(null);
  const sceneWrap = useRef(null);
  const hintRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  const firstGrab = useCallback(() => {
    if (hintRef.current) hintRef.current.classList.add('hide');
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rootEl = root.current;
    const titleEl = titleRef.current;
    splitWords(titleEl);

    const onMove = (e) => {
      pointerRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      };
    };
    window.addEventListener('mousemove', onMove);

    if (reduce) {
      gsap.set(sceneWrap.current, { opacity: 1 });
      return () => window.removeEventListener('mousemove', onMove);
    }

    const ctx = gsap.context(() => {
      const words = titleEl.querySelectorAll('.rword > span');
      gsap.fromTo(
        words,
        { yPercent: 115 },
        { yPercent: 0, duration: 0.85, stagger: 0.07, ease: 'power4.out', delay: 0.15 }
      );
      gsap.fromTo(
        copyRef.current.querySelectorAll('[data-hero-fade]'),
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.55 }
      );
      gsap.fromTo(glowRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2, delay: 0.3, ease: 'power2.out' });
      gsap.fromTo(
        sceneWrap.current,
        { opacity: 0, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 1.2, delay: 0.2, ease: 'power2.out' }
      );
      gsap.fromTo(bookMotion.intro, { scale: 0.72 }, { scale: 1, duration: 1.4, delay: 0.2, ease: 'power3.out' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootEl,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
      tl.to(copyRef.current, { y: -90, opacity: 0.15, ease: 'none' }, 0)
        .to(statsRef.current, { y: -140, opacity: 0, ease: 'none' }, 0)
        .to(glowRef.current, { opacity: 0, ease: 'none' }, 0);
    }, rootEl);

    return () => {
      ctx.revert();
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <section className="darkhero" ref={root} id="top">
      <div className="hero-glow" ref={glowRef}></div>

      <div className="hero-scene" ref={sceneWrap} style={{ opacity: 0 }}>
        <div className="scene-hint" ref={hintRef} aria-hidden="true">
          <span className="scene-hint-spark">✦</span> drag to spin
        </div>
        <MagazineScene pdfUrl={MAGAZINE.file} pointerRef={pointerRef} onFirstGrab={firstGrab} />
      </div>

      <div className="wrap hero-content" ref={copyRef}>
        <div data-hero-fade>
          <Eyebrow dark>District 3292 · The Zonal Magazine</Eyebrow>
        </div>
        <h1 className="hero-h1" ref={titleRef}>
          The Zone 7 <span className="hl">Magazine.</span> <span className="outline">2024-25.</span>
        </h1>
        <p className="hero-sub" data-hero-fade>
          <b>40 pages</b> of service stories, club spotlights, fellowship highlights and the moments that made
          the year — designed by the zone, written by all nine clubs, and now yours to <b>flip like a real book</b>.
        </p>
        <div className="hero-actions" data-hero-fade>
          <a className="btn btn-primary" href="#reader">
            📖&nbsp; Read the flip book
          </a>
          <a className="btn btn-glass" href={MAGAZINE.file} download={MAGAZINE.pdfName}>
            ⬇&nbsp; Download PDF
          </a>
        </div>
      </div>

      <div className="wrap hero-bottom" ref={statsRef}>
        <div className="stat-strip">
          {HERO_STATS.map((s, i) => (
            <Reveal className="stat-card" key={s.id} delay={i * 0.08}>
              <div className={`num ${s.small ? 'small' : ''}`}>{s.num}</div>
              <div className="lab">{s.lab}</div>
            </Reveal>
          ))}
        </div>
        <div className="hero-scroll-hint" style={{ marginTop: 18 }} data-hero-fade>
          <span className="mouse"><i></i></span> Scroll — watch the magazine flip open on its own
        </div>
      </div>
    </section>
  );
}
