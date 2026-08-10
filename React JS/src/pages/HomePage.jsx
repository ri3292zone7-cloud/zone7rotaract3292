import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiteShell from '../components/layout/SiteShell';
import { ZONE7_DB, CLUB_DIRECTORY } from '../data/zone7-data';
import pageCss from './home.css?inline';

/* ------------------------------------------------------------------ */
/* Rotary preloader (session-gated, same as the classic site)          */
/* ------------------------------------------------------------------ */
function RotaryPreloader() {
  const [gone, setGone] = useState(() => sessionStorage.getItem('zone7_splash_seen') === '1');
  const [fading, setFading] = useState(false);

  const dismiss = () => {
    if (fading) return;
    setFading(true);
    sessionStorage.setItem('zone7_splash_seen', '1');
    setTimeout(() => setGone(true), 700);
  };

  useEffect(() => {
    if (gone) return;
    const t = setTimeout(dismiss, 450);
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') dismiss();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;
  return (
    <div id="rotaryPreloader" className={fading ? 'hide' : ''} onClick={dismiss}>
      <div id="rpStage">
        <div id="rpContent">
          <div id="rpWheelWrap">
            <img src="/logos/RotaryMoE-R_REV.png" alt="Rotary wheel" />
          </div>
          <img id="rotaractWordmark" src="/logos/Rotaract-Simple_CMYK-Crop.png" alt="Rotaract" />
          <div id="rpTagline">ZONE 7 · DISTRICT 3292</div>
          <div id="rpBarTrack">
            <div id="rpBarFill" style={{ transitionDuration: '450ms' }} />
          </div>
        </div>
        <div id="rpSevenWrap">
          <div id="rpSeven" aria-hidden="true">7</div>
        </div>
      </div>
      <style>{'#rpBarFill{width:100%;}'}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero canvas dot-wave (mouse-reactive)                               */
/* ------------------------------------------------------------------ */
function useHeroDots(heroRef) {
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    if (window.matchMedia('(max-width:760px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, {
      position: 'absolute', inset: '0', width: '100%', height: '100%',
      zIndex: 0, pointerEvents: 'none'
    });
    hero.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    const SPACING = 26;
    const RADIUS = 130;
    const PUSH = 14;
    let mouse = null, target = null, rafId = null;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const cols = Math.ceil(w / SPACING) + 1;
      const rows = Math.ceil(h / SPACING) + 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          let x = i * SPACING, y = j * SPACING;
          let radius = 1.2, alpha = 0.08;
          if (mouse) {
            const dx = x - mouse.x, dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < RADIUS && dist > 0.01) {
              const t = 1 - dist / RADIUS;
              const wave = Math.sin(t * Math.PI) * PUSH;
              x += (dx / dist) * wave;
              y += (dy / dist) * wave;
              radius = 1.2 + t * 1.8;
              alpha = 0.08 + t * 0.3;
            }
          }
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.fill();
        }
      }
    };

    const loop = () => {
      if (target) {
        if (!mouse) mouse = { ...target };
        mouse.x += (target.x - mouse.x) * 0.15;
        mouse.y += (target.y - mouse.y) * 0.15;
      }
      draw();
      rafId = requestAnimationFrame(loop);
    };

    const resize = () => {
      w = hero.clientWidth;
      h = hero.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      target = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (!rafId) rafId = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      target = null;
      mouse = null;
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      draw();
    };
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };

    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', onResize);
    resize();

    return () => {
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
      if (rafId) cancelAnimationFrame(rafId);
      canvas.remove();
    };
  }, [heroRef]);
}

/* ------------------------------------------------------------------ */
/* Magnetic hero headline (per-word push/skew on hover)                */
/* ------------------------------------------------------------------ */
function useMagneticHeadline(h1Ref) {
  useEffect(() => {
    const h1 = h1Ref.current;
    if (!h1) return;
    if (window.matchMedia('(max-width:760px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover:none)').matches) return;

    const hero = h1.closest('.home-hero');
    if (!hero) return;

    const wrap = (node, boosted) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const span = document.createElement('span');
            span.className = 'mag-word' + (boosted ? ' mag-word-boost' : '');
            span.textContent = part;
            span.style.display = 'inline-block';
            span.style.willChange = 'transform';
            frag.appendChild(span);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          wrap(child, boosted || child.classList.contains('hl'));
        }
      });
    };
    wrap(h1.querySelector('.hl'), true);

    const words = [...h1.querySelectorAll('.mag-word')];
    let mouse = null, rafId = null;
    const RADIUS = 180;
    const PUSH = 20;

    const update = () => {
      words.forEach((el) => {
        if (!mouse) { el.style.transform = ''; return; }
        const boost = el.classList.contains('mag-word-boost') ? 1.5 : 1;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = cx - mouse.x, dy = cy - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = RADIUS * (boost > 1 ? 1.15 : 1);
        if (dist < radius) {
          const t = 1 - dist / radius;
          const push = t * PUSH * boost;
          const angle = Math.atan2(dy, dx);
          const tx = Math.cos(angle) * push;
          const ty = Math.sin(angle) * push;
          const skew = (dx / radius) * t * 5 * boost;
          const scale = 1 + t * 0.05 * boost;
          el.style.transform = `translate(${tx}px, ${ty}px) skewX(${skew}deg) scale(${scale})`;
        } else {
          el.style.transform = '';
        }
      });
      rafId = requestAnimationFrame(update);
    };

    const onMove = (e) => {
      mouse = { x: e.clientX, y: e.clientY };
      if (!rafId) rafId = requestAnimationFrame(update);
    };
    const onLeave = () => {
      mouse = null;
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      words.forEach((el) => { el.style.transition = 'transform .45s cubic-bezier(.16,1,.3,1)'; el.style.transform = ''; });
      setTimeout(() => words.forEach((el) => (el.style.transition = '')), 470);
    };

    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
    return () => {
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [h1Ref]);
}

/* ------------------------------------------------------------------ */
/* Project skyline mosaic                                              */
/* ------------------------------------------------------------------ */
const MOSAIC_COLORS = ['#E11A6E', '#A80F52', '#F2A900', '#8a6300', '#1c8a4d', '#3a3170', '#1B1836', '#c1502e'];
const MOSAIC_ICONS = ['🩸', '📚', '🌳', '💧', '🎓', '🤝', '🎤', '🌍', '🧺', '🎨', '⚽', '🏥', '🧵', '🔥', '📷', '🎗️'];

const MOSAIC_CODES = {
  Health: 'HLTH', International: 'INTL', Fellowship: 'FLWS', Education: 'EDU', Leadership: 'LEAD',
  Community: 'CMTY', Environment: 'ENVR', WASH: 'WASH', 'Prof. Dev.': 'PDEV', 'Public Image': 'PIMG',
  Fundraising: 'FUND', Uncategorized: 'UNCT', Balkumari: 'BALK', Baneshwor: 'BANE', Sankhu: 'SANK',
  'Liberty College': 'LIBC', Sukedhara: 'SUKD', Tripureswor: 'TRIP', 'Kathmandu West': 'KTMW',
  'Kathmandu Height': 'KTMH', 'New Road City': 'NRC', 'Membership Development': 'MBRD',
  'Club Administration': 'ADMN', 'Service Project': 'SERV', 'Professional Development': 'PDEV',
  Finance: 'FNCE', 'The Rotary Foundation': 'TRF', 'Young Leaders Contact': 'YLC'
};

const MOSAIC_AVENUE_KW = {
  'Membership Development': ['membership', 'member growth', 'retention'],
  'Club Administration': ['administration', 'installation', 'bod', 'assembly', 'drr visit', 'governance', 'transition'],
  'International Service': ['international', 'twin', 'goodwill visit', 'exchange', 'mother language'],
  'Professional Development': ['professional', 'career', 'skill', 'workshop', 'training', 'seminar', 'counsel'],
  'Finance': ['finance', 'fundrais', 'budget', 'carnival'],
  'The Rotary Foundation': ['rotary foundation', 'trf', 'grant'],
  'Public Image': ['public image', 'publicity', 'social media', 'photowalk', 'public relation'],
  'Young Leaders Contact': ['interact', 'young leader', 'youth leader']
};

const MOCK_DEMO = [
  { t: 'Blood Donation Drive', c: 'Health', club: 'balkumari', cn: 'Balkumari', id: 'mock-1' },
  { t: 'Twin Club Meet', c: 'International', club: 'balkumari', cn: 'Balkumari', id: 'mock-2' },
  { t: 'Fellowship Night', c: 'Fellowship', club: 'balkumari', cn: 'Balkumari', id: 'mock-3' },
  { t: 'School Repaint', c: 'Education', club: 'baneshwor', cn: 'Baneshwor', id: 'mock-4' },
  { t: 'Youth Leadership Camp', c: 'Leadership', club: 'baneshwor', cn: 'Baneshwor', id: 'mock-5' },
  { t: 'Community Meal Drive', c: 'Community', club: 'baneshwor', cn: 'Baneshwor', id: 'mock-6' },
  { t: 'River Clean-Up', c: 'Environment', club: 'sankhu', cn: 'Sankhu', id: 'mock-7' },
  { t: 'Water Aid Project', c: 'WASH', club: 'sankhu', cn: 'Sankhu', id: 'mock-8' },
  { t: 'Literacy Drive', c: 'Education', club: 'sankhu', cn: 'Sankhu', id: 'mock-9' },
  { t: 'Career Talk Series', c: 'Prof. Dev.', club: 'liberty', cn: 'Liberty College', id: 'mock-10' },
  { t: 'Entrepreneurship Bootcamp', c: 'Prof. Dev.', club: 'liberty', cn: 'Liberty College', id: 'mock-11' },
  { t: 'Cultural Exchange Meet', c: 'International', club: 'liberty', cn: 'Liberty College', id: 'mock-12' },
  { t: 'Elder Home Visit', c: 'Community', club: 'sukedhara', cn: 'Sukedhara', id: 'mock-13' },
  { t: 'Sports Fest', c: 'Fellowship', club: 'sukedhara', cn: 'Sukedhara', id: 'mock-14' },
  { t: 'Health Camp', c: 'Health', club: 'sukedhara', cn: 'Sukedhara', id: 'mock-15' },
  { t: 'Tree Plantation', c: 'Environment', club: 'tripureswor', cn: 'Tripureswor', id: 'mock-16' },
  { t: 'Public Image Photowalk', c: 'Public Image', club: 'tripureswor', cn: 'Tripureswor', id: 'mock-17' },
  { t: 'District Grant Project', c: 'Fundraising', club: 'tripureswor', cn: 'Tripureswor', id: 'mock-18' },
  { t: 'Menstrual Health Camp', c: 'Health', club: 'kathmanduwest', cn: 'Kathmandu West', id: 'mock-19' },
  { t: 'Joint Rotary Meeting', c: 'Fellowship', club: 'kathmanduwest', cn: 'Kathmandu West', id: 'mock-20' },
  { t: 'Skill Development Workshop', c: 'Prof. Dev.', club: 'kathmanduwest', cn: 'Kathmandu West', id: 'mock-21' },
  { t: 'Literacy Workshop', c: 'Education', club: 'kathmanduheight', cn: 'Kathmandu Height', id: 'mock-22' },
  { t: 'Installation Ceremony', c: 'Fellowship', club: 'kathmanduheight', cn: 'Kathmandu Height', id: 'mock-23' },
  { t: 'Sapling Distribution', c: 'Environment', club: 'kathmanduheight', cn: 'Kathmandu Height', id: 'mock-24' },
  { t: 'Fundraiser Gala', c: 'Fundraising', club: 'newroadcity', cn: 'New Road City', id: 'mock-25' },
  { t: 'Youth Leadership Session', c: 'Leadership', club: 'newroadcity', cn: 'New Road City', id: 'mock-26' },
  { t: 'Public Image Campaign', c: 'Public Image', club: 'newroadcity', cn: 'New Road City', id: 'mock-27' }
];

const ROWCAP = 6;

function codeFor(label, mode) {
  if (mode === 'az') return label;
  return MOSAIC_CODES[label] || String(label).replace(/[^A-Za-z]/g, '').slice(0, 4).toUpperCase();
}

function avenueFor(p) {
  const text = (p.c + ' ' + p.t).toLowerCase();
  for (const av in MOSAIC_AVENUE_KW) {
    if (MOSAIC_AVENUE_KW[av].some((k) => text.includes(k))) return av;
  }
  return 'Service Project';
}

function useMosaic() {
  const [projects, setProjects] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [mode, setMode] = useState('category');
  const [popup, setPopup] = useState(null); // {x, y, p}

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const live = await ZONE7_DB.getAllProjects({ limit: 400 });
        if (!alive) return;
        if (live && live.length) {
          const mapped = live.slice(0, 300).map((p) => ({
            t: p.title || 'Untitled Project',
            c: (p.category || '').trim() || 'Uncategorized',
            club: p.club_slug,
            cn: (CLUB_DIRECTORY[p.club_slug] && CLUB_DIRECTORY[p.club_slug].name.replace(/^Rotaract Club of /i, '')) || p.club_slug,
            id: p.id
          }));
          setProjects(mapped);
          setIsLive(true);
          return;
        }
      } catch {
        console.error('Mosaic: falling back to demo projects');
      }
      if (alive) setProjects(MOCK_DEMO);
    })();
    return () => { alive = false; };
  }, []);

  const tiles = useMemo(() => {
    const combos = [];
    MOSAIC_ICONS.forEach((ic) => MOSAIC_COLORS.forEach((c) => combos.push({ ic, c })));
    for (let i = combos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combos[i], combos[j]] = [combos[j], combos[i]];
    }
    return projects.map((p, i) => {
      const combo = combos[i % combos.length];
      return { ...p, ic: combo.ic, bg: combo.c, av: avenueFor(p) };
    });
  }, [projects]);

  const groups = useMemo(() => {
    const keyFor = { category: (p) => p.c, club: (p) => p.cn, az: (p) => p.t[0].toUpperCase(), avenue: (p) => p.av };
    const key = keyFor[mode];
    const g = {};
    tiles
      .slice()
      .sort((a, b) => (mode === 'az' ? a.t.localeCompare(b.t) : 0))
      .forEach((p) => {
        const k = key(p);
        (g[k] = g[k] || []).push(p);
      });
    return Object.entries(g).map(([label, items], ci) => {
      const chunks = [];
      for (let i = 0; i < items.length; i += ROWCAP) chunks.push(items.slice(i, i + ROWCAP));
      return { label, ci, chunks, items };
    });
  }, [tiles, mode]);

  const showPopup = (e, modeType) => {
    const el = e.target.closest('.mosaic-tile');
    if (!el) return;
    const p = tiles[Number(el.dataset.i)];
    if (!p) return;
    const left = modeType === 'touch' ? e.clientX + 8 : Math.min(e.clientX + 16, window.innerWidth - 246);
    const top = modeType === 'touch' ? Math.min(e.clientY - 96, window.innerHeight - 150) : Math.min(e.clientY + 16, window.innerHeight - 100);
    setPopup({ x: left, y: top, p });
  };

  const navigate = useNavigate();
  const openProject = (e) => {
    const el = e.target.closest('.mosaic-tile');
    if (!el) return;
    const p = tiles[Number(el.dataset.i)];
    if (p) navigate(`/project?club=${p.club}&id=${encodeURIComponent(p.id)}`);
  };

  return { tiles, isLive, mode, setMode, groups, popup, setPopup, showPopup, openProject };
}

function Mosaic() {
  const { tiles, isLive, mode, setMode, groups, popup, setPopup, showPopup, openProject } = useMosaic();

  return (
    <>
      <div className="mosaic-head">
        <h3>Every Zone 7 project, one skyline.</h3>
        <div className="mosaic-tabs">
          {[['category', 'By Category'], ['avenue', 'By Avenue'], ['club', 'By Club'], ['az', 'A–Z']].map(([m, label]) => (
            <button key={m} type="button" className={`mt ${mode === m ? 'active' : ''}`} onClick={() => setMode(m)}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="mosaic-frame">
        <div
          className="mosaic-columns"
          onMouseMove={(e) => showPopup(e, 'mouse')}
          onMouseLeave={() => setPopup(null)}
          onTouchStart={(e) => showPopup(e, 'touch')}
          onTouchEnd={() => setTimeout(() => setPopup(null), 2400)}
          onClick={openProject}
        >
          {groups.map((col) => (
            <div className="mosaic-col" key={col.ci} onMouseEnter={(e) => {
              e.currentTarget.closest('.mosaic-columns').classList.add('dim');
              e.currentTarget.classList.add('hi');
            }} onMouseLeave={(e) => {
              e.currentTarget.closest('.mosaic-columns').classList.remove('dim');
              e.currentTarget.classList.remove('hi');
            }}>
              <div className="mosaic-substacks">
                {col.chunks.map((chunk, ci) => (
                  <div className="mosaic-stack" key={ci}>
                    {chunk.map((p) => (
                      <div key={p.id} className="mosaic-tile" style={{ background: p.bg }} data-i={tiles.indexOf(p)}>
                        {p.ic}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="mosaic-col-code" title={col.label}>{codeFor(col.label, mode)}</div>
            </div>
          ))}
        </div>
      </div>
      <p className="mosaic-note">
        {isLive
          ? `Live · ${tiles.length} project${tiles.length === 1 ? '' : 's'} uploaded by Zone 7 clubs. Codes are short labels; hover or tap any tile for the full project name.`
          : 'Mockup preview · real club-uploaded projects will populate this automatically. Codes are short labels; hover or tap any tile for the full project name.'}
      </p>
      <div className={`mosaic-popup ${popup ? 'show' : ''}`} style={popup ? { left: popup.x, top: popup.y } : undefined}>
        {popup && (
          <>
            <span className="mp-tag">{popup.p.c}</span>
            <h5>{popup.p.t}</h5>
            <p>Rotaract Club of {popup.p.cn}</p>
          </>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Leadership + ZRR modals                                             */
/* ------------------------------------------------------------------ */
function LeaderSection() {
  const [leaders, setLeaders] = useState([]);
  const [zrrs, setZrrs] = useState([]);
  const [open, setOpen] = useState(null); // {type:'leader'|'zrr', person}

  useEffect(() => {
    let alive = true;
    (async () => {
      const [l, z] = await Promise.all([
        ZONE7_DB.getLeadership().catch(() => []),
        ZONE7_DB.getZRRs().catch(() => [])
      ]);
      if (!alive) return;
      setLeaders(l || []);
      setZrrs((z || []).map((r) => ({
        name: r.name, years: r.years, current: !!r.is_current,
        bio: r.bio || '', photo: r.photo || '', club: r.club || ''
      })));
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const initials = (name) => String(name || '').replace(/^Rtr\.\s*/, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const close = () => setOpen(null);

  return (
    <section className="hsec home-leader" id="leadership">
      <div className="wrap">
        <span className="section-tag">Zone Leadership · RY 2026–27</span>
        <h2 style={{ marginBottom: 40, maxWidth: 600 }}>Guided by the Zone 7 leadership team.</h2>
        <div className="leader-card">
          <div className="leader-grid">
            {leaders.length === 0 && (
              <p style={{ color: 'rgba(255,255,255,.6)', fontStyle: 'italic' }}>Loading leadership…</p>
            )}
            {leaders.map((p, i) => (
              <button key={i} type="button" className="leader-item" onClick={() => setOpen({ type: 'leader', person: p })}>
                <div className="leader-avatar">
                  {p.photo ? <img src={p.photo} alt={p.name} loading="lazy" /> : initials(p.name)}
                </div>
                <span className="role">{p.role}</span>
                <h4>{p.name}</h4>
                <span className="role-full">{p.role_full || p.roleFull || ''}</span>
                {p.club ? <span className="leader-club">{p.club}</span> : null}
              </button>
            ))}
          </div>
        </div>

        <div className="zrr-timeline">
          <span className="section-tag">A Line of Leadership</span>
          <h2 style={{ marginBottom: 0 }}>Zone 7's ZRRs, year by year.</h2>
          <div className="zrr-track">
            {zrrs.map((z, i) => (
              <button key={i} type="button" className={`zrr-node ${z.current ? 'current' : ''}`} onClick={() => setOpen({ type: 'zrr', person: z })}>
                <div className="zrr-year">{z.years}</div>
                <div className="zrr-avatar">
                  {z.photo ? <img src={z.photo} alt={z.name} loading="lazy" /> : initials(z.name)}
                </div>
                <div className="zrr-dot" />
                <div className="zrr-name">Rtr. {z.name}</div>
                {z.club ? <div className="zrr-club">{z.club}</div> : null}
                {z.current ? <span className="zrr-tag">Current ZRR</span> : null}
              </button>
            ))}
          </div>
        </div>
      </div>

      {open && (
        <div className="zone-modal-overlay open" onClick={(e) => e.target === e.currentTarget && close()}>
          <div className="zone-modal">
            <button type="button" className="zone-modal-close" aria-label="Close" onClick={close}>✕</button>
            <div className="zone-modal-avatar">
              {open.person.photo ? (
                <img src={open.person.photo} alt={open.person.name} />
              ) : (
                initials(open.person.name)
              )}
            </div>
            {open.type === 'zrr' ? (
              <>
                <span className="zone-modal-year">RY 20{String(open.person.years).replace('-', '–20')}</span>
                <h3>Rtr. {open.person.name}</h3>
                <p className="zone-modal-role">
                  {open.person.current ? 'Current Zone Rotaract Representative' : 'Zone Rotaract Representative'}
                </p>
                {open.person.club ? <p className="zone-modal-club">{open.person.club}</p> : null}
                <p className="zone-modal-body">
                  {open.person.bio ||
                    (open.person.current
                      ? `Rtr. ${open.person.name} is currently serving as Zone 7's Rotaract Representative for RY 20${String(open.person.years).replace('-', '–20')}, guiding the zone's clubs through the year's goals and events.`
                      : `Rtr. ${open.person.name} served as Zone 7's Rotaract Representative for RY 20${String(open.person.years).replace('-', '–20')}, guiding the zone's clubs through that Rotary year.`)}
                </p>
              </>
            ) : (
              <>
                <span className="zone-modal-year">{open.person.role}</span>
                <h3>{open.person.name}</h3>
                <p className="zone-modal-role">{open.person.role_full || open.person.roleFull || ''}</p>
                {open.person.club ? <p className="zone-modal-club">{open.person.club}</p> : null}
                {open.person.bio ? <p className="zone-modal-body">{open.person.bio}</p> : null}
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Clubs                                                               */
/* ------------------------------------------------------------------ */
const SQUARE_LOGO_CLUBS = new Set(['newroadcity', 'tripureswor', 'kathmanduwest', 'sankhu']);

function ClubsSection() {
  const clubs = Object.entries(CLUB_DIRECTORY || {});
  const shuffled = useMemo(() => {
    const items = clubs.map(([slug, c]) => ({ slug, name: c.name.replace('Rotaract Club of ', ''), logo: c.logo, ig: c.ig }));
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }, [clubs]);

  const [members, setMembers] = useState(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      const out = [];
      await Promise.all(
        clubs.map(async ([slug, club]) => {
          try {
            const profile = await ZONE7_DB.getClubProfile(slug);
            if (profile && profile.board && profile.board.length) {
              profile.board.forEach((m, i) => out.push({
                name: m.name || '', role: m.role || '', photo: m.photo || '',
                clubName: club.name.replace('Rotaract Club of ', ''), clubSlug: slug, isPresident: i === 0
              }));
            }
          } catch { /* skip club without profile */ }
        })
      );
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      if (alive) setMembers(out);
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [projects, setProjects] = useState(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      const slugs = Object.keys(CLUB_DIRECTORY || {});
      try {
        const grouped = await ZONE7_DB.getProjectsBatch(slugs, 12);
        const out = [];
        slugs.forEach((slug) => {
          const club = CLUB_DIRECTORY[slug];
          (grouped[slug] || []).forEach((p) => out.push({
            id: p.id, title: p.title || 'Untitled Project', category: p.category || 'Project',
            cover: p.cover || '', clubName: club.name.replace('Rotaract Club of ', ''), clubSlug: slug
          }));
        });
        for (let i = out.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [out[i], out[j]] = [out[j], out[i]];
        }
        if (alive) setProjects(out);
      } catch {
        if (alive) setProjects([]);
      }
    })();
    return () => { alive = false; };
  }, []);

  const initials = (name) => String(name || '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const projCard = (p) => (
    <Link key={`${p.clubSlug}-${p.id}`} className="proj-card" to={`/project?club=${p.clubSlug}&id=${encodeURIComponent(p.id)}`}>
      <img src={p.cover || 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600'} alt={p.title} loading="lazy" />
      <div className="proj-cap"><b>{p.title}</b><span>{p.category} · {p.clubName}</span></div>
    </Link>
  );

  return (
    <section className="hsec" id="clubs" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <span className="section-tag">Our Clubs</span>
        <h2>The clubs that make up Zone 7.</h2>
        <p className="sub">
          Nine Rotaract clubs across the Kathmandu Valley. Click a card to view the club's profile, or tap its
          Instagram handle to open Instagram directly.{' '}
          <Link to="/club-guides" style={{ color: 'var(--magenta-deep)', fontWeight: 700, textDecoration: 'underline' }}>
            Running a club? Open the playbook →
          </Link>
        </p>

        <div className="logo-carousel">
          <div className="logo-track">
            {shuffled.concat(shuffled).map((it, i) => (
              <Link key={i} className="logo-chip" to={`/club/${it.slug}`} title={it.name}>
                <img className={SQUARE_LOGO_CLUBS.has(it.slug) ? 'square' : 'round'} src={`/${it.logo}`} alt={it.name} loading="lazy" />
              </Link>
            ))}
          </div>
        </div>

        <div className="clubs-grid">
          {clubs.map(([slug, c]) => (
            <Link key={slug} className="club-card" to={`/club/${slug}`}>
              <div className="club-mark"><img src={`/${c.logo}`} alt={`${c.name} logo`} loading="lazy" /></div>
              <h4>{c.name}</h4>
              <p>Kathmandu Valley · Zone 7</p>
              <a
                className="club-ig"
                href={`https://www.instagram.com/${c.ig}/`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" />
                </svg>
                @{c.ig}
              </a>
            </Link>
          ))}
        </div>
        <p className="clubs-note">Instagram handles were sourced from each club's public profile.</p>

        <div className="bod-carousel-wrap">
          <div className="bod-carousel-head">
            <span className="section-tag" style={{ marginBottom: 0 }}>Faces of Zone 7</span>
            <h3 style={{ fontSize: '1.3rem' }}>Meet the club boards.</h3>
          </div>
          <div className="bod-carousel">
            <div className="bod-track">
              {members === null && (
                <p style={{ padding: 20, color: 'rgba(27,24,54,0.45)', fontSize: '0.85rem' }}>Loading club boards…</p>
              )}
              {members !== null && members.length === 0 && (
                <p style={{ padding: 20, color: 'rgba(27,24,54,0.45)', fontSize: '0.85rem' }}>Club boards haven't been set up yet.</p>
              )}
              {members !== null && members.length > 0 &&
                members.concat(members).map((m, i) => (
                  <Link key={i} className={`bod-card ${m.isPresident ? 'is-president' : ''}`} to={`/club/${m.clubSlug}#board`}>
                    <div className="bod-photo">
                      {m.photo ? (
                        <img src={m.photo} alt={m.name} loading="lazy" />
                      ) : (
                        <div className="bod-initials">{initials(m.name)}</div>
                      )}
                      {m.isPresident ? <span className="bod-crown">👑 President</span> : null}
                    </div>
                    <div className="bod-info">
                      <h5>{m.name}</h5>
                      <span className="bod-role">{m.role}</span>
                      <span className="bod-club">{m.clubName}</span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 60 }}>
        <div className="proj-carousel-wrap">
          <div className="bod-carousel-head">
            <span className="section-tag" style={{ marginBottom: 0 }}>Recent Work</span>
            <h3 style={{ fontSize: '1.3rem' }}>Projects run across Zone 7.</h3>
          </div>
          <div className="proj-carousel">
            <div className="proj-track">
              {projects === null && (
                <p style={{ padding: 20, color: 'rgba(27,24,54,0.45)', fontSize: '0.85rem' }}>Loading projects…</p>
              )}
              {projects !== null && projects.length === 0 && (
                <p style={{ padding: 20, color: 'rgba(27,24,54,0.45)', fontSize: '0.85rem' }}>No projects uploaded yet.</p>
              )}
              {projects !== null && projects.length > 0 && (() => {
                const mid = Math.ceil(projects.length / 2);
                return projects.slice(0, mid).concat(projects.slice(0, mid)).map((p, i) => (
                  <span key={i} style={{ display: 'contents' }}>{projCard(p)}</span>
                ));
              })()}
            </div>
            {projects !== null && projects.length > 0 && (
              <div className="proj-track proj-track-2">
                {(() => {
                  const mid = Math.ceil(projects.length / 2);
                  const rowB = projects.slice(mid).length ? projects.slice(mid) : projects.slice(0, mid);
                  return rowB.concat(rowB).map((p, i) => (
                    <span key={i} style={{ display: 'contents' }}>{projCard(p)}</span>
                  ));
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* District calendar                                                   */
/* ------------------------------------------------------------------ */
const DISTRICT_CALENDAR = [
  [2026, 6, 'Maternal & Child Health Month', [1, 2, 7, 11, 30], ['1 Jul – Club President & DG Installation', '2 Jul – District Interact Rep. Installation', '7 Jul – Guru Purnima', '11 Jul – DRR Installation', '30 Jul – International Friendship Day', 'Jul–Aug – Zonal COTS & Club Installation']],
  [2026, 7, 'Membership & New Club Development Month', [1, 12, 19, 28, 29], ['1 Aug – Grant Management Seminar', '12 Aug – International Youth Day', '19 Aug – World Photography Day', '28 Aug – Janai Purnima (Raksha Bandhan)', '29 Aug – Gai Jatra', 'Jul–Aug – Zonal COTS & Club Installation']],
  [2026, 8, 'Basic Education & Literacy Month', [4, 5, 8, 11, 12, 13, 14, 19, 25, 26], ['From Sep – DRR Visit', '4 Sep – Gaura Parba / Krishna Janmashtami', '5 Sep – Int\u2019l Day of Charity', '8 Sep – Gen-Z Sahid Diwas', '11–13 Sep – SEARIC Summit, Sri Lanka', '14 Sep – Hartalika Teej (women only)', '19 Sep – Constitution Day', '19 Sep – Nationwide Inter College Quiz (Region-wise)', '25–26 Sep – President Night 2026']],
  [2026, 9, 'Community Economic Development Month', [5, 10, 11, 16, 17, 18, 19, 20, 21], ['5 Oct – World Teachers\u2019 Day (UNESCO)', '10 Oct – World Mental Health Day', '11 Oct – Int\u2019l Day of the Girl Child', '11 Oct – Dashain (Ghatasthapana)', '16 Oct – World Food Day', '17–21 Oct – Dashain Week']],
  [2026, 10, 'Rotary Foundation Month', [6, 7, 8, 9, 10, 15, 20, 21, 24, 25, 28], ['6–10 Nov – Laxmi Puja to Bhai Tika', '15 Nov – Chhath Parba', '20 Nov – Universal Children\u2019s Day', '21 Nov – 1st President-Secretary Meet', '24 Nov – Guru Nanak Jayanti (Sikhs only)', '25 Nov – Elimination of Violence Against Women', '28 Nov – 13th Late Rtr. Sachin Memorial Blood Donation']],
  [2026, 11, 'Disease Prevention & Treatment Month', [3, 5, 7, 8, 9, 10, 11, 12, 13, 19, 24, 25, 30], ['3 Dec – Int\u2019l Day of Disabled Persons', '5 Dec – International Volunteer Day', '7–13 Dec – Computer Science Education Week', '10 Dec – Human Rights Day', '19 Dec – Nationwide Futsal Tournament (Zonal Round)', '24 Dec – Udauli Parwa / Yomari Purnima', '25 Dec – Christmas (Christians only)', '30 Dec – Tamu Lhosar', 'Dec – District Fundraiser: Rotaract Sahayatra']],
  [2027, 0, 'Vocational Service Month', [1, 11, 14, 29, 30], ['1 Jan – Gregorian New Year', '11 Jan – Prithvi Jayanti', '14 Jan – Maghe Sankranti', '29 Jan – Nationwide Inter College Quiz (Final)', '29–30 Jan – 19th Rotaract District Conference', '30 Jan – Martyrs\u2019 Day', 'Jan – District Fundraiser: Rotaract Sahayatra']],
  [2027, 1, 'Peacebuilding & Conflict Prevention Month', [4, 5, 6, 7, 11, 19], ['4–7 Feb – ROTASIA Indore', '5–6 Feb – 19th District Rotary Conference', '7 Feb – Sonam Lohsar', '11 Feb – Saraswati Puja', '19 Feb – Democracy Day', 'Feb – District Fundraiser: Rotaract Sahayatra']],
  [2027, 2, 'Water, Sanitation & Hygiene Month', [6, 8, 9, 13, 21, 22, 27], ['6 Mar – Maha Shivaratri', '8 Mar – International Women\u2019s Day', '8–14 Mar – Rotaract Week', '9 Mar – Gyalpo Lohsar', '13 Mar – World Rotaract Day', '21–22 Mar – Holi Festival', '22 Mar – World Water Day', '27 Mar – 2nd PS Meet & PETS-SETS']],
  [2027, 3, 'Environmental Month', [6, 7, 10, 14, 22, 24], ['6 Apr – Ghode Jatra', '7 Apr – World Health Day', '10 Apr – Late Rtr. Santosh Memorial ROTA Quiz (Zonal)', '14 Apr – Nepali New Year + Bisket Jatra', '22 Apr – World Earth Day', '24 Apr – Nationwide Futsal Tournament (Regional)']],
  [2027, 4, 'Youth Service Month', [1, 8, 20, 29], ['1 May – Labour Day', '8 May – Late Rtr. Santosh Memorial ROTA Quiz (Cluster)', '20 May – Buddha Jayanti', '29 May – Nationwide Futsal Tournament (Final)', '29 May – Republic Day']],
  [2027, 5, 'Rotary Fellowships Month', [5, 19, 21, 26, 27, 28, 29, 30], ['5 Jun – World Environment Day', '19 Jun – 20th Rotaract District Assembly, DLTS & Recognition', '19 Jun – Late Rtr. Santosh Memorial ROTA Quiz (Final)', '19 Jun – Nepal Investigative Journalism Award', '21 Jun – International Day of Yoga', '26–30 Jun – RI Convention 2027, Barcelona']]
];
const DCAL_DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DCAL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function DistrictCalendar() {
  const [index, setIndex] = useState(0);
  const swipeRef = useRef(null);
  const touchX = useRef(0);

  const [year, month, theme, hlDays, items] = DISTRICT_CALENDAR[index];

  const cells = useMemo(() => {
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const out = DCAL_DOW.map((d, i) => <div key={`dow-${i}`} className="dcal-dow">{d}</div>);
    for (let i = 0; i < firstDow; i++) out.push(<div key={`e-${i}`} className="dcal-cell empty">.</div>);
    for (let d = 1; d <= daysInMonth; d++) {
      out.push(
        <div key={d} className={`dcal-cell ${hlDays.includes(d) ? 'hl' : ''}`}>{d}</div>
      );
    }
    return out;
  }, [year, month, hlDays]);

  const go = (delta) => setIndex((v) => Math.max(0, Math.min(DISTRICT_CALENDAR.length - 1, v + delta)));

  return (
    <div className="dcal-card">
      <div className="dcal-topbar">
        <button className="dcal-nav" aria-label="Previous month" disabled={index === 0} onClick={() => go(-1)}>←</button>
        <div className="dcal-title">
          <h4>{DCAL_MONTHS[month]} {year}</h4>
          <span className="theme">{theme}</span>
        </div>
        <button className="dcal-nav" aria-label="Next month" disabled={index === DISTRICT_CALENDAR.length - 1} onClick={() => go(1)}>→</button>
      </div>
      <div
        className="dcal-swipe"
        ref={swipeRef}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
      >
        <div className="dcal-inner">
          <div className="dcal-grid">{cells}</div>
          <ul className="dcal-list">{items.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </div>
      </div>
      <div className="dcal-dots">
        {DISTRICT_CALENDAR.map((_, i) => (
          <span key={i} className={i === index ? 'active' : ''} onClick={() => setIndex(i)} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Events                                                              */
/* ------------------------------------------------------------------ */
function EventsSection() {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const list = await ZONE7_DB.getEvents().catch(() => []);
      if (alive) setEvents(list || []);
    })();
    return () => { alive = false; };
  }, []);

  return (
    <section className="home-events" id="events">
      <div className="wrap">
        <span className="section-tag">What's Coming Up</span>
        <h2>Zone 7 events &amp; meets.</h2>
        <div className="events-list">
          {events === null && (
            <p style={{ padding: '30px 0', color: 'rgba(27,24,54,0.5)', fontSize: '0.9rem' }}>Loading events…</p>
          )}
          {events !== null && events.length === 0 && (
            <p style={{ padding: '30px 0', color: 'rgba(27,24,54,0.5)', fontSize: '0.9rem' }}>
              No upcoming events posted yet. Check back soon.
            </p>
          )}
          {events !== null && events.map((ev, i) => {
            const hasLink = !!ev.rsvp_link;
            const label = ev.event_date && ev.event_date !== 'TBD'
              ? new Date(ev.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : 'TBD';
            const yr = ev.event_date && ev.event_date !== 'TBD'
              ? new Date(ev.event_date).getFullYear()
              : (String(ev.event_date || '').split('-')[0] || '2026');
            const row = (
              <>
                <div className="event-date">{label}<small>{yr}</small></div>
                <div className="event-info">
                  <h4>{ev.title}</h4>
                  <p>
                    {ev.description || ''}
                    {!hasLink ? <em style={{ color: 'rgba(27,24,54,.45)', fontStyle: 'normal' }}> (RSVP link coming soon)</em> : null}
                  </p>
                </div>
                <div className="event-arrow" style={hasLink ? undefined : { opacity: 0.22 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </>
            );
            return hasLink ? (
              <a key={i} className="event-row" href={ev.rsvp_link} target="_blank" rel="noopener noreferrer">{row}</a>
            ) : (
              <div key={i} className="event-row">{row}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Social (Behold Instagram widget)                                    */
/* ------------------------------------------------------------------ */
function SocialSection() {
  useEffect(() => {
    if (window.__bhldScript) return;
    window.__bhldScript = true;
    const s = document.createElement('script');
    s.type = 'module';
    s.src = 'https://w.behold.so/widget.js';
    setTimeout(() => document.head.append(s), 0);
  }, []);

  return (
    <section className="home-social" id="connect">
      <div className="wrap">
        <span className="section-tag">Follow Along</span>
        <h2>@zone7rotaract3292</h2>
        <p className="sub">Carousel recaps, reels and club spotlights from across the zone.</p>
        <div style={{ marginTop: 56 }}>
          <behold-widget feed-id="oACl7lyBKgqQ9BqPUEJt" />
        </div>
        <a href="https://www.instagram.com/zone7rotaract3292/" target="_blank" rel="noopener noreferrer" className="ig-follow">
          Follow on Instagram →
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  const heroRef = useRef(null);
  const h1Ref = useRef(null);

  useHeroDots(heroRef);
  useMagneticHeadline(h1Ref);

  return (
    <SiteShell current="home" title="Zone 7 Rotaract | District 3292 Nepal-Bhutan" css={pageCss}>
      <RotaryPreloader />

      <header className="home-hero" id="top" ref={heroRef}>
        <div className="hero-orbit" aria-hidden="true">
          <div className="orbit-seven-anim">
            <div className="orbit-seven">7</div>
          </div>
        </div>
        <div className="wrap">
          <div className="eyebrow"><span className="dot" />Rotaract District 3292 · Nepal-Bhutan</div>
          <h1 id="heroHeading" ref={h1Ref}>
            Young leaders in the<br />Kathmandu Valley,<br />
            <span className="hl">united as Zone 7.</span>
          </h1>
          <p className="lead">
            Zone 7 brings together Rotaract clubs across the Kathmandu Valley under District 3292,
            turning service, fellowship and leadership into action, one project at a time.
          </p>
          <div className="hero-actions">
            <Link to="/join" className="hero-btn hero-btn-primary">Fill the Form, Become a Rotaractor →</Link>
            <a href="#clubs" className="hero-btn hero-btn-ghost">Explore our Clubs</a>
          </div>
          <div className="hero-actions hero-actions-secondary">
            <Link to="/guides" className="hero-btn hero-btn-ghost">Rotaract Resources</Link>
            <Link to="/club-guides" className="hero-btn hero-btn-ghost">Guides for Clubs</Link>
          </div>
          <div className="stat-row">
            <div className="stat"><b>9</b><span>Clubs in Zone 7</span></div>
            <div className="stat"><b>180+</b><span>Clubs districtwide</span></div>
            <div className="stat"><b>5,500+</b><span>Rotaractors, D3292</span></div>
            <div className="stat"><b>18–30</b><span>Age range to join</span></div>
          </div>
        </div>
      </header>

      <section className="hsec home-about" id="about">
        <div className="wrap">
          <span className="section-tag">Who we are</span>
          <h2>Service above self, <span className="mark">led by youth.</span></h2>
          <p className="sub">
            Rotaract is Rotary International's club for young adults aged 18–30, sponsored by local Rotary
            clubs and entirely run by Rotaractors. Zone 7 unites 9 such clubs across the Kathmandu Valley
            under District 3292.{' '}
            <Link to="/about" style={{ color: 'var(--magenta-deep)', fontWeight: 700, textDecoration: 'underline' }}>
              Read our full story →
            </Link>
          </p>
          <Mosaic />
        </div>
      </section>

      <LeaderSection />

      <ClubsSection />

      <section className="hsec" id="dcal" style={{ paddingTop: 90, paddingBottom: 20 }}>
        <div className="wrap">
          <span className="section-tag">District 3292 · RY 2026–27</span>
          <h2>District event calendar.</h2>
          <p className="sub">Swipe or use the arrows to browse the Rotary year, month by month.</p>
          <div style={{ marginTop: 40 }}>
            <DistrictCalendar />
          </div>
        </div>
      </section>

      <EventsSection />

      <SocialSection />

      <div className="logostrip">
        <div className="wrap">
          <img src="/zone7_logos.png" alt="Rotaract District 3292 Nepal-Bhutan logo" style={{ maxWidth: 420, display: 'block' }} />
        </div>
      </div>

      <section className="join-cta">
        <div className="wrap">
          <div className="join-card">
            <h2>One form is all it takes to become a Rotaractor.</h2>
            <p>
              Fill out our short membership form: share a few details about yourself, your age, and why you
              want to serve, and a Zone 7 club will welcome you in as a Rotaractor.
            </p>
            <Link to="/join" className="btn btn-primary">Fill the Join Form →</Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
