import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteShell from '../components/layout/SiteShell';
import { ZONE7_DB, CLUB_DIRECTORY } from '../data/zone7-data';
import pageCss from './gallery.css?inline';

const CHUNK = 42;

function clubName(slug) {
  const c = CLUB_DIRECTORY[slug];
  return c ? c.name.replace('Rotaract Club of ', '') : slug;
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [activeClub, setActiveClub] = useState('All');
  const [visible, setVisible] = useState(0);
  const [lb, setLb] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const slugs = Object.keys(CLUB_DIRECTORY);
      const all = [];
      try {
        const grouped = await ZONE7_DB.getProjectsBatch(slugs, 80);
        slugs.forEach((s) => (grouped[s] || []).forEach((p) => {
          const imgs = [p.cover, ...(p.gallery || [])].filter(Boolean);
          imgs.forEach((src) => all.push({ src, title: p.title, club: s, clubName: clubName(s), id: p.id, cat: p.category || 'Project' }));
        }));
      } catch {
        for (const s of slugs) {
          try {
            const projects = await ZONE7_DB.getProjects(s, { limit: 80 });
            projects.forEach((p) => {
              const imgs = [p.cover, ...(p.gallery || [])].filter(Boolean);
              imgs.forEach((src) => all.push({ src, title: p.title, club: s, clubName: clubName(s), id: p.id, cat: p.category || 'Project' }));
            });
          } catch { /* skip club */ }
        }
      }
      if (!alive) return;
      setPhotos(shuffle(all));
      setVisible(0);
      setLoaded(true);
    })();
    return () => { alive = false; };
  }, []);

  const view = useMemo(
    () => (activeClub === 'All' ? photos : photos.filter((p) => p.club === activeClub)),
    [photos, activeClub]
  );

  const chips = useMemo(() => {
    const withPhotos = new Set(photos.map((p) => p.club));
    return ['All', ...Object.keys(CLUB_DIRECTORY).filter((s) => withPhotos.has(s))];
  }, [photos]);

  useEffect(() => {
    setVisible(0);
    setLb(null);
  }, [activeClub, photos]);

  useEffect(() => {
    if (!loaded || visible >= view.length) return;
    const id = requestAnimationFrame(() => {
      setVisible((v) => Math.min(v + CHUNK, view.length));
    });
    return () => cancelAnimationFrame(id);
  }, [loaded, visible, view.length]);

  useEffect(() => {
    if (lb === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setLb(null);
      if (e.key === 'ArrowLeft') setLb((i) => ((i - 1 + view.length) % view.length));
      if (e.key === 'ArrowRight') setLb((i) => ((i + 1) % view.length));
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [lb, view.length]);

  const showLb = useCallback((i) => {
    if (!view.length) return;
    setLb((i + view.length) % view.length);
  }, [view.length]);

  const current = lb === null ? null : view[lb];
  const countText = view.length ? `${view.length} photo${view.length === 1 ? '' : 's'} across ${activeClub === 'All' ? 'Zone 7' : 'this club'}.` : '';

  return (
    <SiteShell
      current="gallery"
      cta="join"
      title="Gallery | Zone 7 Rotaract 3292"
      css={pageCss}
    >
      <header className="hero wrap">
        <div className="eyebrow"><span className="dot"></span>Zone 7 · In Pictures</div>
        <h1>Every project, one gallery.</h1>
        <p>Photos from projects and reports across all nine Zone 7 clubs, pulled straight from what each club has uploaded. Tap any photo for the full story.</p>
        <div className="chip-row">
          {chips.map((c) => (
            <span key={c} className={`chip${c === activeClub ? ' active' : ''}`} onClick={() => setActiveClub(c)}>
              {c === 'All' ? 'All Clubs' : clubName(c)}
            </span>
          ))}
        </div>
        <p className="g-count">{loaded ? countText : ''}</p>
      </header>
      <div className="wrap">
        <div className="masonry">
          {!loaded
            ? <p style={{ padding: '40px 0', color: 'rgba(27,24,54,.5)' }}>Loading gallery…</p>
            : view.length === 0
              ? <div className="empty">No photos uploaded yet{activeClub === 'All' ? '' : ' for this club'}. Check back once clubs add projects via the Club Admin panel.</div>
              : view.slice(0, visible).map((p, i) => (
                  <div key={`${p.club}-${p.id}-${i}`} className="g-item" onClick={() => showLb(i)}>
                    <img src={p.src} alt={`${p.title}, ${p.clubName}`} loading="lazy" decoding="async" fetchPriority="low" />
                    <div className="g-cap"><b>{p.title}</b><span>{p.clubName} · {p.cat}</span></div>
                  </div>
                ))}
        </div>
      </div>

      <div className={`lightbox${lb === null ? '' : ' open'}`} role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={(e) => { if (e.target === e.currentTarget) setLb(null); }}>
        <button className="lb-close" aria-label="Close photo viewer" onClick={() => setLb(null)}>✕</button>
        <span className="lb-count">{lb === null ? '' : `${lb + 1} / ${view.length}`}</span>
        <div className="lightbox-inner">
          <button className="lb-btn lb-prev" aria-label="Previous photo" onClick={() => showLb(lb - 1)}>‹</button>
          {current
            ? <img src={current.src} alt={`${current.title}, ${current.clubName}`} fetchPriority="high" />
            : null}
          <button className="lb-btn lb-next" aria-label="Next photo" onClick={() => showLb(lb + 1)}>›</button>
          {current
            ? (
                <div className="lb-cap">
                  <b>{current.title}</b>
                  <span>{current.clubName} · {current.cat}</span>
                  <br />
                  <Link to={`/project?club=${encodeURIComponent(current.club)}&id=${encodeURIComponent(current.id)}`}>View the full project →</Link>
                </div>
              )
            : null}
        </div>
      </div>
    </SiteShell>
  );
}
