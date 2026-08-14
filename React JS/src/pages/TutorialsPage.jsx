import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SiteShell from '../components/layout/SiteShell';
import pageCss from './tutorials.css?inline';

const HERO_TITLE = 'Skills that turn clubs into teams.';

const TUTORIALS = [
  {
    to: '/tutorial/meetings',
    tc: '#E11A6E',
    delay: '',
    num: 'TUTORIAL 01',
    img: '/media/images/tutorial-meeting.png',
    alt: 'Rotaract general meeting illustration',
    tag: 'Meetings \u00b7 The Core',
    title: 'Running General Meetings',
    desc: 'The full arc of a well-run club meeting: agenda, call to order, motions and voting, attendance and minutes that hold up.',
    meta: ['12-min read', '2 videos', '4 docs'],
  },
  {
    to: '/tutorial/board',
    tc: '#1B1836',
    delay: '.06s',
    num: 'TUTORIAL 02',
    img: '/media/images/tutorial-board.png',
    alt: 'Rotaract board meeting illustration',
    tag: 'Leadership \u00b7 The Engine',
    title: 'Running Board Meetings',
    desc: 'Every seat on the board, what a board meeting needs to cover each month, and how the board keeps the club moving between general meetings.',
    meta: ['10-min read', '2 videos', '5 docs'],
  },
  {
    to: '/tutorial/assembly',
    tc: '#0E7490',
    delay: '.12s',
    num: 'TUTORIAL 03',
    img: '/media/images/tutorial-assembly.png',
    alt: 'Rotaract club assembly illustration',
    tag: 'Membership \u00b7 The Voice',
    title: 'Club Assemblies',
    desc: 'The meeting where the whole club plans together: goals, programs and education. How assemblies differ from board and general meetings, and how to run one.',
    meta: ['9-min read', '1 video', '3 docs'],
  },
  {
    to: '/tutorial/zrr',
    tc: '#C2410C',
    delay: '.18s',
    num: 'TUTORIAL 04',
    img: '/media/images/tutorial-zrr.png',
    alt: 'ZRR zonal visit illustration',
    tag: 'Zone \u00b7 The Bridge',
    title: 'ZRR Visits',
    desc: "What a Zonal Rotaract Representative visit actually is, why your club needs at least two a year, and how to host one that strengthens your club.",
    meta: ['8-min read', '1 video', '2 docs'],
  },
  {
    to: '/tutorial/drr',
    tc: '#A80F52',
    delay: '.24s',
    num: 'TUTORIAL 05',
    img: '/media/images/tutorial-drr.png',
    alt: 'DRR district visit illustration',
    tag: 'District \u00b7 The Bigger Picture',
    title: 'DRR Visits',
    desc: "When the District Rotaract Representative visits, it's a chance for recognition, coaching and district connection. Here's how to make it count.",
    meta: ['9-min read', '1 video', '2 docs'],
  },
  {
    to: '/tutorial/blood',
    tc: '#D32027',
    delay: '.3s',
    num: 'TUTORIAL 06',
    img: '/media/images/tutorial-blood.png',
    alt: 'Blood donation camp illustration',
    tag: 'Service \u00b7 The Impact',
    title: 'Blood Donation Programs',
    desc: 'The complete playbook for a safe, legal, well-run blood donation camp, from blood bank partnerships and donor eligibility to day-of flow and first aid.',
    meta: ['14-min read', '3 videos', '5 docs'],
  },
];

const STATS = [
  { num: '6', lab: 'Tutorials covering everything a club year runs on', delay: '' },
  { num: '12+', lab: 'Verified videos, templates & official references', delay: '.08s' },
  { num: '9', lab: 'Clubs across the Kathmandu Valley using these', delay: '.16s' },
  { num: '100%', lab: 'Free & built on Rotary\u2019s official documents', delay: '.24s' },
];

const BADGES = [
  {
    cls: 'hb1',
    svg: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3z" fill="#E11A6E" />
      </svg>
    ),
    text: <span>Learn <b>by doing</b></span>,
  },
  {
    cls: 'hb2',
    svg: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#0E7490" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: 'Step-by-step',
  },
  {
    cls: 'hb3',
    svg: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 19V6a2 2 0 012-2h12a2 2 0 012 2v13l-3-2-3 2-3-2-3 2-3-2-3 2z" stroke="#C2410C" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
    text: 'Docs included',
  },
  {
    cls: 'hb4',
    svg: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 14L12 18L20 8" stroke="#A80F52" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: 'Proven in Zone 7',
  },
];

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function TutorialsPage() {
  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = root.querySelectorAll('[data-reveal]:not(.in)');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const fine = window.matchMedia('(pointer:fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;
    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width - 0.5;
      const my = (e.clientY - r.top) / r.height - 0.5;
      hero.querySelectorAll('[data-parallax]').forEach((el) => {
        const d = parseFloat(el.dataset.parallax) || 1;
        el.style.translate = `${(mx * 26 * d).toFixed(1)}px ${(my * 18 * d).toFixed(1)}px`;
      });
    };
    hero.addEventListener('mousemove', onMove);
    return () => hero.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <SiteShell
      current="tutorials"
      cta="join"
      title="Tutorials | Zone 7 Rotaract"
      css={pageCss}
    >
      <div ref={rootRef}>
        <div id="progress" ref={progressRef} aria-hidden="true"></div>

        <header className="hero" ref={heroRef}>
          <div className="aurora a1"></div>
          <div className="aurora a2"></div>
          <div className="aurora a3"></div>
          <div className="fshape shape-ring" data-parallax="1"></div>
          <div className="fshape shape-tri" data-parallax="-1"></div>
          <div className="fshape shape-dot" data-parallax="2"></div>
          <div className="fshape shape-dot2" data-parallax="-2"></div>
          <div className="fshape shape-sq" data-parallax="1.4"></div>
          <div className="wrap">
            <div className="eyebrow"><span className="dot"></span>Zone 7 &middot; Tutorial Hub</div>
            <h1 id="heroTitle">
              {HERO_TITLE.split(' ').map((w) => [
                <span className="rword" key={w}><span>{w}</span></span>,
                ' ',
              ])}
            </h1>
            <p className="sub">Everything Zone 7 clubs actually run (meetings, board meetings, club assemblies, ZRR and DRR visits, and full blood donation programs), explained step by step, with motion, visuals, videos and the official documents to back it up. Pick a tutorial and follow along.</p>
            <p className="note">Each tutorial is based on the <a href="/media/guides/Standard-Rotaract-Club-Constitution.docx" style={{ color: 'var(--magenta-deep)', fontWeight: 700, textDecoration: 'underline' }}>Standard Rotaract Club Constitution</a>, the <a href="/media/guides/Rotaract-Guidebook.pdf" style={{ color: 'var(--magenta-deep)', fontWeight: 700, textDecoration: 'underline' }}>District 3292 Rotaract Guidebook</a>, Rotary International guidance and WHO-aligned practices. Your club&apos;s own constitution and bylaws always win when they differ.</p>

            <div className="hero-grid">
              <div>
                <div className="stat-strip">
                  {STATS.map((s) => (
                    <div key={s.num} className="stat-card" data-reveal style={{ '--d': s.delay }}>
                      <div className="num">{s.num}</div>
                      <div className="lab">{s.lab}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hero-mascot">
                <div className="mascot-ring"></div>
                <img src="/media/images/tutorial-mascot.png" alt="Zone 7 tutorial mascot waving with a book" data-parallax="0.6" />
                {BADGES.map((b) => (
                  <div key={b.cls} className={`hm-badge ${b.cls}`}>
                    {b.svg}
                    {b.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="wrap">
          <h2 className="section-title" data-reveal>The Tutorials</h2>
          <p className="section-sub" data-reveal>Six deep-dive guides. Each one opens its own page with the full playbook, animated walkthroughs, checklists, videos and the official documents you need.</p>

          <div className="tutorial-grid">
            {TUTORIALS.map((t) => (
              <Link key={t.to} to={t.to} className="t-card" data-reveal style={{ '--tc': t.tc, '--d': t.delay }}>
                <div className="t-num">{t.num}</div>
                <div className="t-img"><img src={t.img} alt={t.alt} /></div>
                <div className="t-tag">{t.tag}</div>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
                <div className="t-meta">
                  {t.meta.map((m) => <span key={m}>{m}</span>)}
                </div>
                <div className="t-go"><ArrowIcon /></div>
              </Link>
            ))}
          </div>

          <div className="cta-band">
            <div className="aurora a2" style={{ top: '-60px', right: '-60px', width: '300px', height: '300px', background: '#E11A6E' }}></div>
            <div>
              <h3>New to leading? Start with Tutorial 01.</h3>
              <p>Every strong Zone 7 officer started somewhere. The meetings tutorial builds the foundation everything else stands on.</p>
            </div>
            <Link className="btn" to="/tutorial/meetings">Start with Meetings &rarr;</Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
