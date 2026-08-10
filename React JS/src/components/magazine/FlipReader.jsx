import { useEffect, useRef, useState } from 'react';
import { PageFlip } from 'page-flip';
import {
  loadPdf,
  RENDER_SCALE,
  THUMB_SCALE,
  MAX_CACHE,
  PRE_RENDER_AHEAD
} from '../../lib/pdf';
import { PRODUCTS, formatBytes } from '../../data/store';

function Ico({ d }) {
  return (
    <svg className="cico" viewBox="0 0 18 18" fill="none">
      <path d={d} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ICONS = {
  prev: 'M11 4.5L6.5 9L11 13.5',
  next: 'M7 4.5L11.5 9L7 13.5',
  grid: 'M2 2h5.6v5.6H2zM10.4 2H16v5.6h-5.6zM2 10.4h5.6V16H2zM10.4 10.4H16V16h-5.6z',
  full: 'M2 6V2h4M12 2h4v4M16 12v4h-4M6 16H2v-4',
  dl: 'M9 2v8m0 0l-3.2-3.2M9 10l3.2-3.2M3 14v1.5A1.5 1.5 0 004.5 17h9a1.5 1.5 0 001.5-1.5V14'
};

export default function FlipReader() {
  const spec = PRODUCTS.find((p) => p.flip);

  const stageRef = useRef(null);
  const shellRef = useRef(null);
  const scaleRef = useRef(null);
  const bookRef = useRef(null);
  const gridRef = useRef(null);

  const [status, setStatus] = useState('loading');
  const [load, setLoad] = useState({ pct: 0, title: 'Opening the magazine…', sub: 'Streaming pages from the Zonal Magazine file.' });
  const [numPages, setNumPages] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [thumbsOpen, setThumbsOpen] = useState(false);
  const [full, setFull] = useState(false);

  const stateRef = useRef({
    doc: null,
    book: null,
    pageW: 0,
    pageH: 0,
    cache: new Map(),
    cacheOrder: [],
    rendering: new Map(),
    thumbs: new Map()
  });

  useEffect(() => {
    const st = stateRef.current;
    const bookEl = bookRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let alive = true;

    const rescale = () => {
      const shell = shellRef.current;
      if (!shell || !st.pageW || !st.book) return;
      const avail = shell.clientWidth - 8;
      const s = Math.max(0.1, Math.min(1.25, avail / (st.pageW * 2)));
      scaleRef.current.style.transform = `scale(${s})`;
      scaleRef.current.style.height = Math.floor(st.pageH * s) + 'px';
    };

    const updateCounter = (pages) => {
      if (!alive) return;
      const cur = Math.min(pages[0] + 1, st.pageW ? st.doc.numPages : 1);
      setPageNum(cur);
      setThumbsOpen(false);
    };

    const trimCache = (keep) => {
      while (st.cacheOrder.length > MAX_CACHE) {
        const old = st.cacheOrder.shift();
        if (keep && keep.has(old)) { st.cacheOrder.push(old); continue; }
        const c = st.cache.get(old);
        if (c && c.parentNode) c.parentNode.removeChild(c);
        st.cache.delete(old);
      }
    };

    const renderPage = (i, delay) => {
      if (st.cache.has(i) || st.rendering.has(i) || !st.doc || !alive) return;
      st.rendering.set(i, true);
      const start = () => {
        if (!alive) { st.rendering.delete(i); return; }
        st.doc.getPage(i + 1)
          .then((pg) => {
            const vp = pg.getViewport({ scale: RENDER_SCALE });
            const canvas = document.createElement('canvas');
            canvas.width = Math.floor(vp.width);
            canvas.height = Math.floor(vp.height);
            const ctx = canvas.getContext('2d');
            const task = pg.render({ canvasContext: ctx, viewport: vp, canvas, background: '#ffffff' });
            return task.promise.then(() => ({ i, canvas }));
          })
          .then((res) => {
            if (!res || !alive) return;
            st.rendering.delete(res.i);
            if (!st.cache.has(res.i)) {
              st.cache.set(res.i, res.canvas);
              st.cacheOrder.push(res.i);
            }
            const shim = document.getElementById('shim-' + res.i);
            const slot = shim ? shim.parentElement : null;
            if (slot && !slot.querySelector('canvas')) {
              slot.appendChild(res.canvas);
              if (shim) shim.remove();
            }
            trimCache(new Set());
          })
          .catch(() => {
            st.rendering.delete(i);
            const shim = document.getElementById('shim-' + i);
            if (shim) shim.remove();
          });
      };
      if (delay > 0) setTimeout(start, delay); else start();
    };

    const cancelStaleRenders = (want) => {
      st.rendering.forEach((val, i) => {
        if (st.cache.has(i)) return;
        if (val && val.cancel) { try { val.cancel(); } catch {} {} }
        if (!want.has(i)) st.rendering.delete(i);
      });
    };

    const renderVisible = (pages) => {
      const want = new Set(pages);
      pages.forEach((p) => { want.add(p - 1); want.add(p + 1); });
      cancelStaleRenders(want);
      want.forEach((i) => { if (i >= 0 && i < st.doc.numPages) renderPage(i, 0); });
      trimCache(want);
    };

    const preRenderAhead = (from) => {
      if (!st.doc || !st.book) return;
      const end = Math.min(st.doc.numPages, from + PRE_RENDER_AHEAD);
      for (let i = from; i < end; i++) {
        if (st.cache.has(i) || st.rendering.has(i)) continue;
        renderPage(i, (i - from) * 60);
      }
    };

    const buildBook = () => {
      const bookEl = bookRef.current;
      bookEl.innerHTML = '';
      for (let i = 0; i < st.doc.numPages; i++) {
        const page = document.createElement('div');
        page.className = 'page';
        page.innerHTML = `<div class="p-inner"><div class="p-slot"><div class="shimmer" id="shim-${i}"></div></div></div>`;
        bookEl.appendChild(page);
      }
      const book = new PageFlip(bookEl, {
        width: st.pageW,
        height: st.pageH,
        usePortrait: st.pageH < st.pageW,
        flippingTime: reduceMotion ? 0 : 650,
        maxShadowOpacity: 0.4,
        drawShadow: true,
        showCover: true,
        showPageCorners: true,
        mobileScrollSupport: true,
        swipeDistance: 24,
        swipeThreshold: 0.25,
        autoSize: false
      });
      st.book = book;
      book.loadFromHTML(bookEl.querySelectorAll('.page'));
      book.on('init', () => {
        if (!alive || !st.book) return;
        st.book.turnToPage(0);
        renderVisible([0, 1, 2]);
        updateCounter([0]);
        setStatus('ready');
        setLoad({ pct: 100, title: 'Ready', sub: '' });
        rescale();
        preRenderAhead(3);
      });
      book.on('flip', (e) => {
        const idx = e && e.data;
        if (typeof idx !== 'number' || !st.book || !alive) return;
        const pages = st.pageH < st.pageW ? [idx, idx + 1] : [idx];
        updateCounter(pages);
        renderVisible(pages);
        preRenderAhead(idx + 2);
      });
      rescale();
    };

    const boot = async () => {
      if (!spec || !spec.file) {
        setStatus('error');
        setLoad({ pct: 0, title: 'Couldn\'t open the reader', sub: 'No file is configured for this publication yet.' });
        return;
      }
      try {
        const { task } = loadPdf(spec.file);
        task.onProgress = (p) => {
          if (p.total && p.total > 0 && alive) {
            setLoad((prev) => ({ ...prev, pct: Math.round((p.loaded / p.total) * 100), sub: 'Fetching ' + formatBytes(p.total) + ' file.' }));
          }
        };
        const doc = await task.promise;
        if (!alive) { doc.destroy(); return; }
        if (doc.numPages < 4) {
          doc.destroy();
          setStatus('error');
          setLoad({ pct: 0, title: 'Couldn\'t open the reader', sub: 'This publication needs at least 4 pages to become a flip book.' });
          return;
        }
        st.doc = doc;
        setNumPages(doc.numPages);
        setLoad({ pct: 100, title: 'Preparing ' + doc.numPages + ' pages…', sub: 'Rendering each page just before you turn to it.' });
        const pg = await doc.getPage(1);
        const vp = pg.getViewport({ scale: RENDER_SCALE });
        st.pageW = Math.floor(vp.width);
        st.pageH = Math.floor(vp.height);
        buildBook();
      } catch (err) {
        console.warn('Showcase error:', err);
        if (!alive) return;
        setStatus('error');
        setLoad({ pct: 0, title: 'Couldn\'t open the reader', sub: 'The reader hit a snag loading this publication.' });
      }
    };

    boot();

    const onKey = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowLeft') { if (st.book) st.book.flipPrev(); }
      else if (e.key === 'ArrowRight') { if (st.book) st.book.flipNext(); }
      else if (e.key === 'Escape') { setThumbsOpen(false); }
    };
    let resizeT;
    const onResize = () => { clearTimeout(resizeT); resizeT = setTimeout(rescale, 150); };
    const onFs = () => { setFull(!!document.fullscreenElement); setTimeout(rescale, 120); };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    document.addEventListener('fullscreenchange', onFs);

    return () => {
      alive = false;
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('fullscreenchange', onFs);
      if (st.book) { try { st.book.destroy(); } catch {} {} st.book = null; }
      if (st.doc) { try { st.doc.destroy(); } catch {} {} st.doc = null; }
      st.cache.clear();
      st.cacheOrder = [];
      st.rendering.clear();
      st.thumbs.clear();
      if (bookEl) bookEl.innerHTML = '';
    };
  }, [spec]);

  const buildThumbs = () => {
    const grid = gridRef.current;
    const st = stateRef.current;
    if (!grid || !st.doc) return;
    grid.innerHTML = '';
    for (let i = 0; i < st.doc.numPages; i++) {
      const t = document.createElement('div');
      t.className = 'thumb';
      t.dataset.p = i;
      t.innerHTML = `<div class="th-shimmer"></div><span class="th-num">${i + 1}</span>`;
      t.addEventListener('click', () => {
        if (st.book) st.book.flip(i);
        setThumbsOpen(false);
      });
      grid.appendChild(t);
    }
    let i = 0;
    const step = () => {
      while (i < st.doc.numPages) {
        const el = grid.children[i];
        if (el && !el.querySelector('canvas')) {
          renderThumb(i, el);
          i++;
          if (i % 3 === 0) { setTimeout(step, 0); return; }
        } else i++;
      }
    };
    const renderThumb = (n, el) => {
      if (st.thumbs.has(n) || !st.doc) return;
      st.thumbs.set(n, true);
      st.doc.getPage(n + 1)
        .then((pg) => {
          const vp = pg.getViewport({ scale: THUMB_SCALE });
          const canvas = document.createElement('canvas');
          canvas.width = Math.floor(vp.width);
          canvas.height = Math.floor(vp.height);
          return pg.render({ canvasContext: canvas.getContext('2d'), viewport: vp, canvas, background: '#ffffff' }).promise.then(() => canvas);
        })
        .then((canvas) => {
          const shim = el.querySelector('.th-shimmer');
          if (shim) shim.remove();
          el.appendChild(canvas);
        })
        .catch(() => { st.thumbs.delete(n); });
    };
    step();
  };

  const toggleThumbs = () => {
    if (!stateRef.current.book) return;
    setThumbsOpen((v) => {
      const next = !v;
      if (next) setTimeout(buildThumbs, 0);
      return next;
    });
  };

  const toggleFullscreen = () => {
    const stage = stageRef.current;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else if (stage.requestFullscreen) stage.requestFullscreen().catch(() => {});
  };

  const ready = status === 'ready';

  return (
    <>
      <div className="reader-head" id="reader">
        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}><span className="dot"></span>Preview before you download</div>
          <h2>Read it like a real book.</h2>
          <p>Grab a page corner and drag it — the magazine flips with the weight of a printed copy. Use the arrows, the thumbnails, or your keyboard.</p>
        </div>
        {spec && (
          <div className="tabs-row" style={{ margin: 0 }}>
            <button type="button" className="tab active"><span className="tab-ico">{spec.icon}</span>{spec.name}</button>
          </div>
        )}
      </div>

      <section className="stage" ref={stageRef} aria-label="Flip-through reader">
        <div className="stage-ring"></div>
        <div className="book-shell" ref={shellRef}>
          <div className="book-scale" ref={scaleRef}>
            <div ref={bookRef}></div>
          </div>
        </div>

        <div className="hint">Drag a page corner to flip · <kbd>←</kbd> <kbd>→</kbd> to turn · tap thumbnails to jump</div>

        <div className="controls">
          <button type="button" className="c-btn" aria-label="Previous page" disabled={!ready || pageNum <= 1} onClick={() => stateRef.current.book && stateRef.current.book.flipPrev()}>
            <Ico d={ICONS.prev} />
          </button>
          <div className="page-counter"><b>{String(pageNum).padStart(2, '0')}</b><span>{numPages ? ' / ' + numPages : ''}</span></div>
          <button type="button" className="c-btn" aria-label="Next page" disabled={!ready || pageNum >= numPages} onClick={() => stateRef.current.book && stateRef.current.book.flipNext()}>
            <Ico d={ICONS.next} />
          </button>
          <div className="c-divider"></div>
          <button type="button" className="c-btn" aria-label="Show page thumbnails" onClick={toggleThumbs}>
            <Ico d={ICONS.grid} />
          </button>
          <button type="button" className="c-btn" aria-label="Fullscreen" onClick={toggleFullscreen}>
            <Ico d={full ? ICONS.full : ICONS.full} />
          </button>
          <div className="c-divider"></div>
          {spec && (
            <a className="dl-btn" href={spec.file} download={spec.pdfName}>
              <Ico d={ICONS.dl} /> Download
            </a>
          )}
        </div>

        <div className={`thumbs-panel ${thumbsOpen ? 'open' : ''}`}>
          <div className="thumbs-head">
            <h4>Jump to a page</h4>
            <button type="button" className="thumbs-close" aria-label="Close thumbnails" onClick={() => setThumbsOpen(false)}>✕</button>
          </div>
          <div className="thumbs-grid" ref={gridRef}></div>
        </div>

        <div className={`loading-overlay ${status !== 'loading' ? 'hidden' : ''}`}>
          <div className="load-card">
            <div className="spinner"></div>
            <div className="load-title">{load.title}</div>
            <div className="load-sub">{load.sub}</div>
            <div className="progress-track"><div className="progress-fill" style={{ width: load.pct + '%' }}></div></div>
            <span className="progress-pct">{load.pct > 0 ? load.pct + '%' : ''}</span>
          </div>
        </div>

        <div className={`stage-fallback ${status === 'error' ? 'show' : ''}`}>
          <div className="fallback-card">
            <div className="f-ico">📕</div>
            <h3>{load.title}</h3>
            <p>{load.sub}</p>
            {spec && (
              <a className="dl-btn" href={spec.file} download={spec.pdfName}>Download the PDF</a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
