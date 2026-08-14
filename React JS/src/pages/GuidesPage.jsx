import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteShell from '../components/layout/SiteShell';
import Reveal from '../components/ui/Reveal';
import { ZONE7_DB, CLUB_DIRECTORY } from '../data/zone7-data';
import pageCss from './guides.css?inline';

const STATIC_GUIDES = [
  { id: 's1', file: '/media/guides/Standard-Rotaract-Club-Constitution.docx', tag: 'Governance', icon: '📜', size: 'DOCX · 76 KB',
    title: 'Standard Rotaract Club Constitution', desc: 'The base constitution every Rotaract club operates under. It covers name, purpose, membership, meetings and officer roles.',
    inside: ['Name, purpose and membership rules', 'Meeting structure and officer roles', 'Council powers and amendments'] },
  { id: 's2', file: '/media/guides/662_rotaract_club_recommended_bylaws_en.docx', tag: 'Governance', icon: '📝', size: 'DOCX · 99 KB',
    title: 'Recommended Club Bylaws', desc: "RI's model bylaws that supplement the constitution. Customize these to set your own club's practices around dues, attendance and elections.",
    inside: ['Customizing dues and attendance', 'Election and officer rules', 'Committees and standing practices'] },
  { id: 's3', file: '/media/guides/statement-of-policy.docx', tag: 'Governance', icon: '🏛️', size: 'DOCX · 128 KB',
    title: 'Statement of Policy', desc: "Rotary International's official policy on Rotaract, covering sponsorship, authority, and the standards every club is expected to follow.",
    inside: ['Sponsorship and authority', 'RI standards for Rotaract clubs', 'Conduct and expectations'] },
  { id: 's4', file: '/media/guides/MOU-Document.doc', tag: 'Governance', icon: '🤝', size: 'DOC · 106 KB',
    title: 'MOU Document', desc: 'Memorandum of Understanding template outlining the relationship and responsibilities between a Rotaract club and its sponsoring Rotary club, or between twin clubs.',
    inside: ['Twin club commitments', 'Joint meeting and project terms', 'Signature and renewal format'] },
  { id: 's5', file: '/media/guides/Strategic-Planning-Guide.docx', tag: 'Planning', icon: '🎯', size: 'DOCX · 102 KB',
    title: 'Strategic Planning Guide', desc: "A real district club's strategic plan, used as a template for setting a multi-year vision and goals for your own club.",
    inside: ['Multi-year vision and goals', 'Goal-setting worksheets', 'Annual review calendar'] },
  { id: 's6', file: '/media/guides/Effective-Planning-Guide-to-Clubs.docx', tag: 'Planning', icon: '📅', size: 'DOCX · 95 KB',
    title: 'Effective Planning Guide for Clubs', desc: 'A goal-setting worksheet to help clubs track membership trends and plan a strong Rotary year.',
    inside: ['Membership trend tracking', 'Yearly goal planning', 'Rotary year alignment'] },
  { id: 's7', file: '/media/guides/Rotaract_-Membership_Form.docx', tag: 'Templates', icon: '📋', size: 'DOCX · 28 KB',
    title: 'Membership Application Form', desc: 'Standard form for onboarding new members, covering personal details, ID number and sponsoring club info.',
    inside: ['Personal details fields', 'Rotaract ID number section', 'Sponsor confirmation area'] },
  { id: 's8', file: '/media/guides/Sample-GM-attendance-sheet.docx', tag: 'Templates', icon: '✅', size: 'DOCX · 88 KB',
    title: 'Sample GM Attendance Sheet', desc: 'Ready-to-use attendance sheet for General Meetings, including guests, visiting Rotaractors and past presidents.',
    inside: ['Members, guests and visitors', 'Visiting Rotaractor column', 'General-meeting-ready layout'] },
  { id: 's9', file: '/media/guides/Sample-Agenda-Paper.doc', tag: 'Templates', icon: '🗒️', size: 'DOC · 94 KB',
    title: 'Sample Agenda Paper', desc: 'A template agenda format clubs can adapt for board meetings or general meetings.',
    inside: ['Board meeting structure', 'Action item tracking', 'Easily adaptable template'] },
  { id: 's10', file: '/media/guides/Rotaract-Guidebook.pdf', tag: 'Handbook', icon: '📘', size: 'PDF · 1.5 MB',
    title: 'Rotaract Guidebook (District 3292)', desc: "The district's full guidebook: starting a club, board roles, running meetings, elections, finances and working with the district, all in one reference.",
    inside: ['Starting a club', 'Board roles and meetings', 'Elections, finance, district links'] },
  { id: 's11', file: '/media/guides/Rotaract-District-Fund_Grant-Criterion-Document.pdf', tag: 'Funding', icon: '💵', size: 'PDF · 434 KB',
    title: 'District Fund (RDG) Grant Criterion', desc: 'How to apply for the Rotaract District Grant, including eligibility, evaluation criteria, funding installments and the application form and timeline.',
    inside: ['Eligibility and evaluation criteria', 'Funding installments', 'Application form and timeline'] },
  { id: 's12', file: '/media/guides/Rotary-Rotaract-Reading-Materials-Rota-Quiz-2025-26.pdf', tag: 'Quiz', icon: '🏆', size: 'PDF · 929 KB',
    title: 'Rotary-Rotaract Reading Materials (Rota Quiz 2025-26)', desc: 'The big Rota Quiz question bank: Rotary history, mottoes, the Four-Way Test, club structure and service above self, plus the acronym list every team should memorize.',
    inside: ['300+ practice questions', 'Rotary and Rotaract history', 'Acronym cheat-sheet list'] },
  { id: 's13', file: '/media/guides/Reading%20materials%20for%20Rota%20Quiz%2025-26.pdf', tag: 'Quiz', icon: '🧠', size: 'PDF · 641 KB',
    title: 'Reading Materials for Rota Quiz 25-26', desc: 'A second question set for quiz prep: founder and foundation facts, the Object of Rotary, and general knowledge questions used in district quiz rounds.',
    inside: ['Founder and foundation facts', 'Object of Rotary breakdown', 'General knowledge questions'] }
];

export default function GuidesPage() {
  const [query, setQuery] = useState('');
  const [activeChip, setActiveChip] = useState('All');
  const [dynamic, setDynamic] = useState([]);
  const heroRef = useRef(null);

  const allGuides = useMemo(() => [...STATIC_GUIDES, ...dynamic], [dynamic]);

  const chips = useMemo(
    () => ['All', ...new Set(STATIC_GUIDES.concat(dynamic.filter(g => g.dynamic)).map(g => g.tag))],
    [dynamic]
  );

  const list = useMemo(() => {
    const q = query.toLowerCase();
    let l = allGuides.filter(g =>
      (g.title + g.desc + g.tag + (g.inside || []).join(' ')).toLowerCase().includes(q)
    );
    if (activeChip !== 'All') l = l.filter(g => g.tag === activeChip);
    return l;
  }, [allGuides, query, activeChip]);

  const statDocs = allGuides.length;
  const statCats = new Set(STATIC_GUIDES.concat(dynamic.filter(g => g.dynamic)).map(g => g.tag)).size;
  const statClubs = CLUB_DIRECTORY ? Object.keys(CLUB_DIRECTORY).length : 9;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rows = await ZONE7_DB.getGuides();
        if (!mounted) return;
        setDynamic(rows.filter(r => r.file_url).map(r => ({
          id: r.id,
          file: r.file_url || r.file_data,
          fileName: r.file_name,
          tag: r.category || 'Other',
          icon: '📎',
          size: (r.file_name || '').split('.').pop().toUpperCase(),
          title: r.title,
          desc: r.description || '',
          dynamic: true,
          inside: []
        })));
      } catch (e) { console.warn('ZONE7_DB.getGuides unavailable, static library only', e); }
    })();
    return () => { mounted = false; };
  }, []);

  const onHeroMove = (e) => {
    if (!heroRef.current) return;
    if (!window.matchMedia('(pointer:fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = heroRef.current.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width - 0.5;
    const my = (e.clientY - r.top) / r.height - 0.5;
    heroRef.current.querySelectorAll('[data-parallax]').forEach(el => {
      const d = parseFloat(el.dataset.parallax) || 1;
      el.style.translate = `${(mx * 26 * d).toFixed(1)}px ${(my * 18 * d).toFixed(1)}px`;
    });
  };

  const resultCount = `${list.length} ${list.length === 1 ? 'document' : 'documents'}`;
  const gridLabel = query ? 'Search results' : (activeChip === 'All' ? 'All documents' : `${activeChip} documents`);
  const inlineAccent = { color: 'var(--magenta-deep)', fontWeight: 700, textDecoration: 'underline' };

  return (
    <SiteShell current="resources" cta="join" title="Rotaract Resources | Zone 7 Rotaract 3292" css={pageCss}>
      <header className="hero" ref={heroRef} onMouseMove={onHeroMove}>
        <div className="aurora a1"></div>
        <div className="aurora a2"></div>
        <div className="aurora a3"></div>
        <div className="fshape shape-ring" data-parallax="1"></div>
        <div className="fshape shape-tri" data-parallax="-1"></div>
        <div className="fshape shape-dot" data-parallax="2"></div>
        <div className="fshape shape-dot2" data-parallax="-2"></div>
        <div className="fshape shape-sq" data-parallax="1.4"></div>
        <div className="wrap">
          <div className="eyebrow"><span className="dot"></span>District 3292 · Resource Library</div>
          <h1><span className="rword"><span>Rotaract</span></span> <span className="rword"><span>Resources.</span></span></h1>
          <p className="sub">Official templates, constitutions and planning guides from District 3292. Everything a Zone 7 club needs to run smoothly, in one place instead of scattered across old emails. Every file below is free to download.</p>
          <p className="note">Looking for the how-to side instead? The <Link to="/club-guides" style={inlineAccent}>Guides for Clubs</Link> page is the playbook, and the <Link to="/handbook" style={inlineAccent}>Handbook</Link> turns the district rules into chapters.</p>

          <div className="stat-strip">
            <Reveal className="stat-card"><div className="num" id="statDocs">{statDocs}</div><div className="lab">Documents, all free to download</div></Reveal>
            <Reveal className="stat-card" delay=".08s"><div className="num" id="statCats">{statCats}</div><div className="lab">Categories from governance to quiz prep</div></Reveal>
            <Reveal className="stat-card" delay=".16s"><div className="num" id="statClubs">{statClubs}</div><div className="lab">Clubs across the Kathmandu Valley using these</div></Reveal>
            <Reveal className="stat-card" delay=".24s"><div className="num">100%</div><div className="lab">Free &amp; sourced from District 3292</div></Reveal>
          </div>

          <div className="search-wrap">
            <input type="text" id="searchBox" placeholder="Search documents, e.g. constitution, membership, planning..." aria-label="Search documents" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <div className="search-meta">
            <span className="result-count" id="resultCount">{resultCount}</span>
            <div className="chip-row" id="chipRow">
              {chips.map(c => (
                <span key={c} className={`chip${c === activeChip ? ' active' : ''}`} onClick={() => setActiveChip(c)}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="wrap">
        <div className="section-label" id="gridLabel">{gridLabel}</div>
        <div className="guides-grid" id="guidesGrid">
          {list.map((g, i) => (
            <Reveal key={g.id} className="guide-card" data-cat={g.tag} style={{ '--d': `${(i % 4) * 0.06}s` }}>
              <div className="guide-top">
                <div className="guide-ico">{g.icon}</div>
                <span className="guide-tag">{g.tag}</span>
              </div>
              <h4>{g.title}</h4>
              <p className="desc">{g.desc}</p>
              {g.inside && g.inside.length ? (
                <ul className="guide-inside">
                  {g.inside.map(item => <li key={item}>{item}</li>)}
                </ul>
              ) : null}
              <div className="guide-foot">
                <div className="guide-meta">
                  <span className="meta-chip">{g.size || g.file.split('.').pop().toUpperCase()}</span>
                </div>
                <a className="dl-btn" href={g.file} download={g.fileName || ''}>Download ↓</a>
              </div>
            </Reveal>
          ))}
          {!list.length && <p className="empty">No documents match your search. Try another keyword.</p>}
        </div>

        <div className="cta-band">
          <div className="aurora a2" style={{ top: '-60px', right: '-60px', width: '300px', height: '300px', background: '#E11A6E' }}></div>
          <div>
            <h3>Read first, download later?</h3>
            <p>The Handbook explains how grants, twinship, projects and the health check actually work, with the exact rules from the 2025-26 district directory.</p>
          </div>
          <Link className="btn" to="/handbook">Open the Handbook →</Link>
        </div>
      </div>
    </SiteShell>
  );
}
