import { useRef } from 'react';
import { Link } from 'react-router-dom';
import SiteShell from '../components/layout/SiteShell';
import Reveal from '../components/ui/Reveal';
import pageCss from './handbook.css?inline';

const TICKER_ITEMS = [
  'District Grants', 'Global Grants', 'Twinship', 'Memorandum of Understanding',
  'Goodwill visits', 'New clubs', 'Charter ceremony', '7 Areas of Focus', 'Club Health Checkup',
];

const CHAPTERS = [
  {
    n: '01', to: '/handbook/grants', img: '/images/handbook-grants.svg', alt: 'Grants illustration',
    title: 'Grants: Funding Service',
    desc: 'District Grants for quick local wins, Global Grants for big international projects, and the reporting rules that keep the money honest.',
    tags: ['District Grant', 'Global Grant', 'Reports'],
  },
  {
    n: '02', to: '/handbook/twinship', img: '/images/handbook-twinship.svg', alt: 'Twinship illustration',
    title: 'Twinship & the MOU',
    desc: 'How two clubs become twins. Intra-district and international, the memorandum of understanding, and goodwill visits done right.',
    tags: ['Twinship', 'MOU', 'Goodwill visits'],
  },
  {
    n: '03', to: '/handbook/newclub', img: '/images/handbook-newclub.svg', alt: 'New club illustration',
    title: 'Starting a New Club',
    desc: "The nine-step path from first idea to certified club, then the charter presentation ceremony, step by ceremonial step.",
    tags: ['Start a club', 'Charter', 'Installation'],
  },
  {
    n: '04', to: '/handbook/projects', img: '/images/handbook-projects.svg', alt: 'Seven areas of focus illustration',
    title: 'Projects: 7 Areas of Focus',
    desc: "Rotary's seven causes with low-cost project designs from the directory, ready to run on budgets of NPR 5,000\u201315,000.",
    tags: ['Peace', 'Health', 'Education', 'Environment'],
  },
  {
    n: '05', to: '/handbook/health', img: '/images/handbook-health.svg', alt: 'Club health checkup illustration',
    title: 'The Club Health Checkup',
    desc: 'Seventy-five questions across five sections, a score you can compute in one meeting, and a six-month rhythm that keeps clubs strong.',
    tags: ['75 items', '5 sections', 'Score & act'],
  },
];

const HERO_BADGES = [
  { cls: 'hc1', stroke: '#E11A6E', width: 2.6, d: 'M5 12.5l4.5 4.5L19 7.5', label: <>5 chapters <b>inside</b></> },
  { cls: 'hc2', stroke: '#F2A900', width: 2.6, d: 'M5 12.5l4.5 4.5L19 7.5', label: <>Official <b>sources</b></> },
  { cls: 'hc3', stroke: '#0E7490', width: 2.6, d: 'M5 12.5l4.5 4.5L19 7.5', label: <>Checklists <b>inside</b></> },
  { cls: 'hc4', stroke: '#C2410C', width: 2.4, d: 'M8 14L12 18L20 8', label: <>Watch & <b>learn</b></> },
];

function WordTitle({ text }) {
  const words = text.split(' ');
  return (
    <h1>
      {words.map((w, i) => (
        <span className="rword" key={i}><span>{w}</span></span>
      ))}
    </h1>
  );
}

function Hero({ children }) {
  const ref = useRef(null);
  const canParallax =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer:fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const onMouseMove = canParallax
    ? (e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const mx = (e.clientX - r.left) / r.width - 0.5;
        const my = (e.clientY - r.top) / r.height - 0.5;
        el.querySelectorAll('[data-parallax]').forEach((p) => {
          const d = parseFloat(p.dataset.parallax) || 1;
          p.style.translate = `${(mx * 26 * d).toFixed(1)}px ${(my * 18 * d).toFixed(1)}px`;
        });
      }
    : undefined;
  return (
    <header className="hero" ref={ref} onMouseMove={onMouseMove}>
      {children}
    </header>
  );
}

export default function HandbookPage() {
  return (
    <SiteShell
      current="handbook"
      cta="join"
      title="The Zone 7 Club Handbook | Rotaract District 3292"
      css={pageCss}
    >
      <Hero>
        <div className="aurora a1"></div>
        <div className="aurora a2"></div>
        <div className="aurora a3"></div>
        <div className="fshape shape-ring" data-parallax="1"></div>
        <div className="fshape shape-tri" data-parallax="-1"></div>
        <div className="fshape shape-dot" data-parallax="2"></div>
        <div className="fshape shape-dot2" data-parallax="-2"></div>
        <div className="fshape shape-sq" data-parallax="1.4"></div>
        <div className="wrap">
          <div className="eyebrow"><span className="dot"></span>The Handbook &middot; Rules That Run Clubs</div>
          <WordTitle text="Everything a club runs on. One place." />
          <p className="sub">The handbook takes the permanent parts of the District 3292 Directory and turns them into plain-language chapters with videos, vector graphics and tickable checklists, covering grant rules, twinship and the MOU, starting new clubs, the 7 Areas of Focus, and the club health checkup. Themes, goals and award points change every year; this is the stuff that stays.</p>
          <p className="note">Compiled from the <a href="/guides/RC. Dis. Dinesh Gaire BW 2082 Final District directory.pdf">District 3292 Directory</a>, the <a href="/guides/Rotaract-Guidebook.pdf">District Rotaract Guidebook</a> and official <a href="https://www.rotary.org" target="_blank" rel="noopener noreferrer">Rotary International</a> sources. Where a rule changes, the official document wins.</p>
          <div className="hero-grid">
            <div></div>
            <div className="hero-char">
              <div className="char-ring"></div>
              <img src="/images/handbook-hub.svg" alt="Open handbook illustration" data-parallax="0.6" />
              {HERO_BADGES.map((b) => (
                <div className={`hc-badge ${b.cls}`} key={b.cls}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d={b.d} stroke={b.stroke} strokeWidth={b.width} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Hero>

      <div className="ticker">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      <div className="wrap">
        <Reveal as="h2" className="section-title">The five chapters</Reveal>
        <Reveal as="p" className="section-sub">Open any chapter to see the workflow, the checklists, the videos and the official documents behind it.</Reveal>

        <div className="chapter-grid">
          {CHAPTERS.map((c, i) => (
            <Reveal key={c.to} delay={i * 0.06}>
              <Link className="chapter-card" to={c.to}>
                <div className="cc-hero"><span className="cc-num">Chapter {c.n}</span><img src={c.img} alt={c.alt} /></div>
                <div className="cc-body">
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                  <div className="cc-tags">
                    {c.tags.map((t) => <span key={t}>{t}</span>)}
                  </div>
                  <span className="cc-go">Open chapter &rarr;</span>
                </div>
              </Link>
            </Reveal>
          ))}

          <Reveal className="cc-wide" delay={0.3}>
            <Link className="chapter-card cc-wide" style={{ flex: 1 }} to="/tutorials">
              <div className="cc-hero"><img src="/images/tutorial-meeting.png" alt="Tutorials illustration" /></div>
              <div className="cc-body">
                <h3>Need the how, not the rule? &rarr; The Tutorials</h3>
                <p>The handbook explains what the rules are; the tutorials walk you through running meetings, board meetings, assemblies, ZRR and DRR visits and blood donation drives, one practice at a time. Each tutorial page uses the same design language of steps, checklists, videos and documents.</p>
                <span className="cc-go">Browse the tutorials &rarr;</span>
              </div>
            </Link>
          </Reveal>
        </div>

        <Reveal className="promise-strip">
          <div className="promise-item">
            <div className="p-ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#F2A900" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
            <div><h5>Checked against the directory</h5><p>Every rule on these pages comes from the District 3292 Directory or official Rotary documents, not from memory.</p></div>
          </div>
          <div className="promise-item">
            <div className="p-ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3a6 6 0 00-6 6v4.5L4 17h16l-2-3.5V9a6 6 0 00-6-6z" stroke="#F2A900" strokeWidth="1.6" strokeLinejoin="round" /></svg></div>
            <div><h5>Built for real meetings</h5><p>Print a chapter, tick the checklist, and bring it to your next board meeting. Everything is one page deep.</p></div>
          </div>
          <div className="promise-item">
            <div className="p-ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#F2A900" strokeWidth="1.8" /><path d="M12 7v5l3.5 2" stroke="#F2A900" strokeWidth="1.8" strokeLinecap="round" /></svg></div>
            <div><h5>Yearly numbers excluded</h5><p>Themes, goals, teams and award points change every edition. The handbook deliberately keeps only what stays true.</p></div>
          </div>
        </Reveal>

        <div className="cta-band">
          <div>
            <h3>Learn by doing instead?</h3>
            <p>The tutorials take the same design and walk through meetings, assemblies and service programs step by step.</p>
          </div>
          <Link className="btn" to="/tutorials">Go to Tutorials &rarr;</Link>
        </div>
      </div>
    </SiteShell>
  );
}
