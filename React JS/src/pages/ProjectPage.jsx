import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SiteShell from '../components/layout/SiteShell';
import { ZONE7_DB, CLUB_DIRECTORY } from '../data/zone7-data';
import pageCss from './project.css?inline';

/* ------------------------------------------------------------------ *
 * parseStatsFromText — extracts numeric stats from project body text
 * when structured fields (attendees, volunteer_hours, duration,
 * expense) are absent. Falls back gracefully if nothing matches.
 * ------------------------------------------------------------------ */
function parseStatsFromText(text) {
  if (!text) return {};
  const s = {};

  // Rotaractors / attendees
  // "40 Rotaractors", "50 Rotaractors and 15 other visitors"
  const rotM = text.match(/(\d+(?:,\d+)?)\s+Rotaractors?/i);
  if (rotM) s.rotaractors = rotM[1];

  // Other visitors
  const visM = text.match(/(\d+(?:,\d+)?)\s+other\s+visitors?/i);
  if (visM) s.visitors = visM[1];

  // Rotarians
  const rotarianM = text.match(/(\d+(?:,\d+)?)\s+Rotarians?/i);
  if (rotarianM) s.rotarians = rotarianM[1];

  // Total attendees fallback (if no Rotaractor split found)
  if (!s.rotaractors) {
    const attM = text.match(/(\d+(?:,\d+)?)\s+(?:attendees?|participants?|people)/i);
    if (attM) s.attendees = attM[1];
  }

  // Duration: "over 2 hours", "4.5 hours", "for 3 hours"
  const durM = text.match(/(?:over|for|ran\s+for|spanning)\s+([\d.]+(?:\s*\.\s*\d+)?)\s+hours?/i)
    || text.match(/([\d.]+)\s+hours?\s+(?:long|duration)/i);
  if (durM) s.duration = durM[1] + ' hrs';

  // Volunteering hours: "contributing X volunteering hours"
  const volM = text.match(/contributing\s+([\d,]+(?:\.\d+)?)\s+(?:total\s+)?volunteering\s+hours?/i)
    || text.match(/([\d,]+(?:\.\d+)?)\s+(?:total\s+)?volunteer(?:ing)?\s+hours?/i);
  if (volM) s.vol_hours = volM[1];

  // Expense: "NRs. 2,000" / "NRs 5,000" / "NRs. 95.98" / "Rs. 2000"
  const expM = text.match(/NRs?\.?\s*([\d,]+(?:\.\d+)?)/i) || text.match(/Rs\.?\s*([\d,]+(?:\.\d+)?)/i);
  if (expM) s.expense = 'NRs ' + expM[1];

  // Trees planted
  const treeM = text.match(/(\d+(?:,\d+)?)\s+trees?\s+(?:were\s+)?planted/i);
  if (treeM) s.trees = treeM[1];

  // Blood pints
  const bloodM = text.match(/(\d+(?:,\d+)?)\s+pints?\s+of\s+blood/i);
  if (bloodM) s.blood_pints = bloodM[1];

  return s;
}

/* UN Sustainable Development Goals — keyword-matched from a project's
   category/title/body so every project page can show what it aligns with. */
const SDG_MAP = [
  { num: 3, name: 'Good Health & Well-Being', color: '#4C9F38', words: ['health', 'blood', 'hygiene', 'screening', 'donation', 'mental', 'dengue', 'cancer', 'vaccin', 'first aid', 'sick'] },
  { num: 4, name: 'Quality Education', color: '#C5192D', words: ['education', 'school', 'literacy', 'teach', 'student', 'uniform', 'child club', 'classroom'] },
  { num: 5, name: 'Gender Equality', color: '#FF3A21', words: ['women', 'girl', 'menstru', 'gbv', 'gender'] },
  { num: 6, name: 'Clean Water & Sanitation', color: '#26BDE2', words: ['water', 'sanitation', 'wash'] },
  { num: 10, name: 'Reduced Inequalities', color: '#DD1367', words: ['marginal', 'chepang', 'disability', 'brick factory', 'inclus'] },
  { num: 13, name: 'Climate Action', color: '#3F7E44', words: ['climate', 'environment', 'plantation', 'tree', 'clean-up', 'cleanup', 'recycl'] },
  { num: 17, name: 'Partnerships for the Goals', color: '#19486A', words: ['joint', 'exchange', 'twin', 'collaborat', 'together with', 'alliance'] }
];

function computeSdgs(project) {
  const text = ((project.category || '') + ' ' + (project.title || '') + ' ' + (project.summary || '') + ' ' + (project.body || '')).toLowerCase();
  return SDG_MAP.filter((g) => g.words.some((w) => text.includes(w)));
}

/* Splits a project's free-text body into tidy paragraphs and drops the
   boilerplate stats footer ("Date: ... | Duration: ... | Expense: ...")
   that clubs often append — that info is already shown in the meta row
   and stat pills above, so printing it again just looks cramped. */
function cleanProjectBody(text) {
  if (!text) return [];
  return String(text)
    .split(/\n\s*\n+/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter((p) => {
      if (!p) return false;
      if (/^Date\s*:\s*/i.test(p) && p.includes('|')) return false;
      return true;
    });
}

export default function ProjectPage() {
  const [searchParams] = useSearchParams();
  const clubSlug = searchParams.get('club');
  const projectId = searchParams.get('id');
  const club = CLUB_DIRECTORY[clubSlug];

  const [project, setProject] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [lb, setLb] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoaded(false);
    setProject(null);
    setLb(null);
    if (!clubSlug || !projectId) { setLoaded(true); return; }
    ZONE7_DB.getProject(clubSlug, projectId)
      .then((p) => { if (alive) setProject(p); })
      .catch(() => {})
      .finally(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, [clubSlug, projectId]);

  const shareUrl = useMemo(() => {
    if (!clubSlug || !project?.id) return '';
    return `${window.location.origin}/project?club=${encodeURIComponent(clubSlug)}&id=${encodeURIComponent(project.id)}`;
  }, [clubSlug, project]);

  const lbOpen = lb !== null;

  useEffect(() => {
    if (!lbOpen) return;
    document.body.style.overflow = 'hidden';
    const n = project && project.gallery ? project.gallery.length : 0;
    const onKey = (e) => {
      if (e.key === 'Escape') setLb(null);
      if (e.key === 'ArrowLeft') setLb((i) => (i - 1 + n) % n);
      if (e.key === 'ArrowRight') setLb((i) => (i + 1) % n);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [lbOpen, project]);

  const copyLink = () => {
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(done);
    } else {
      const ta = document.createElement('textarea');
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      done();
    }
  };

  let content;

  if (!loaded) {
    content = (
      <div className="empty-state wrap">
        <h2>Loading…</h2>
      </div>
    );
  } else if (project && club) {
    const dateStr = project.date ? new Date(project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Date not set';

    // Merge structured fields with text-parsed fallbacks
    const bodyText = project.body || project.summary || '';
    const parsed = parseStatsFromText(bodyText);
    const bodyParas = cleanProjectBody(bodyText);
    const hasSummary = !!(project.summary) && (project.summary.trim() !== bodyText.trim());

    const attendees = project.attendees || null;
    const volHours = project.volunteer_hours ? String(project.volunteer_hours) : (parsed.vol_hours || null);
    const duration = project.duration || (parsed.duration || null);
    const jointly = project.jointly_with || null;

    // Build pills array
    const pills = [];
    if (attendees) pills.push({ val: attendees, label: 'Attendees', style: '' });
    else if (parsed.rotaractors) {
      pills.push({ val: parsed.rotaractors, label: 'Rotaractors', style: 'accent' });
      if (parsed.rotarians) pills.push({ val: parsed.rotarians, label: 'Rotarians', style: '' });
      if (parsed.visitors) pills.push({ val: parsed.visitors, label: 'Other Visitors', style: '' });
    } else if (parsed.attendees) {
      pills.push({ val: parsed.attendees, label: 'Participants', style: '' });
    }
    if (duration) pills.push({ val: duration, label: 'Duration', style: '' });
    if (volHours) pills.push({ val: volHours, label: 'Volunteering Hours', style: 'accent' });
    if (parsed.trees) pills.push({ val: parsed.trees, label: 'Trees Planted', style: 'gold' });
    if (parsed.blood_pints) pills.push({ val: parsed.blood_pints, label: 'Pints of Blood', style: 'accent' });
    if (parsed.expense) pills.push({ val: parsed.expense, label: 'Total Expense', style: '' });

    const sdgs = computeSdgs(project);
    const gallery = project.gallery || [];

    content = (
      <>
        <header className="p-hero">
          {project.cover
            ? <img className="p-hero-img" src={project.cover} alt={project.title} width="1600" height="800" />
            : <div className="p-hero-img p-hero-img--grad" role="presentation" aria-hidden="true"></div>}
          <div className="p-hero-overlay">
            <div className="wrap p-hero-content">
              <span className="p-tag">{project.category || 'Club Project'}</span>
              <h1>{project.title}</h1>
              <div className="club-line">{club.name}</div>
              {sdgs.length ? (
                <div className="p-sdgs">
                  {sdgs.map((g) => (
                    <span key={g.num} className="p-sdg" style={{ '--sdg': g.color }}>SDG {g.num} · {g.name}</span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <section className="wrap">
          <div className="p-meta-row">
            <div className="p-meta"><b>{dateStr}</b><span>Project Date</span></div>
            <div className="p-meta"><b>{project.location || 'Kathmandu Valley'}</b><span>Location</span></div>
            <div className="p-meta"><b>{club.name}</b><span>Organized By</span></div>
          </div>

          <div className="p-share">
            <span className="share-label">Share</span>
            <a className="share-btn" href={`https://api.whatsapp.com/send?text=${encodeURIComponent(project.title + ' — ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.2-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.2 1.4 2.5 1.5.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2.1 1c.3.2.5.3.6.4 0 .2 0 .9-.2 1.5z" /></svg>
              WhatsApp
            </a>
            <a className="share-btn" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" /></svg>
              Facebook
            </a>
            <a className="share-btn" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(project.title)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.2l7.3-8.3L2.8 2h6.4l4.4 5.9L18.9 2zm-1.1 18.1h1.7L7.9 3.8H6l11.8 16.3z" /></svg>
              X
            </a>
            <button className="share-btn" type="button" onClick={copyLink}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              <span>{copied ? 'Copied ✓' : 'Copy Link'}</span>
            </button>
            <img className="share-qr" src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(shareUrl)}`} alt="QR code for this project" width="110" height="110" loading="lazy" />
          </div>

          {project.host_status ? <span className="p-host-badge">{project.host_status}</span> : null}

          {pills.length ? (
            <div className="p-stats-pills">
              {pills.map((p, i) => (
                <div key={i} className={`p-pill${p.style ? ' ' + p.style : ''}`}><b>{p.val}</b><span>{p.label}</span></div>
              ))}
            </div>
          ) : null}

          {jointly ? <div className="p-jointly">🤝 Jointly with: {jointly}</div> : null}

          {hasSummary ? <div className="p-summary">{project.summary}</div> : null}

          {bodyParas.length ? (
            <div className="p-body">
              {bodyParas.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          ) : (
            <div className="p-body">
              <p>{project.summary || 'No description provided for this project yet.'}</p>
            </div>
          )}
        </section>

        {gallery.length ? (
          <section className="wrap p-gallery">
            <h3>Gallery</h3>
            <div className="gal-grid" id="galGrid">
              {gallery.map((src, i) => (
                <img key={i} src={src} alt={`${project.title}, photo ${i + 1} of ${gallery.length}`} loading="lazy" width="600" height="600" onClick={() => setLb(i)} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="wrap p-cta">
          <Link className="btn btn-primary" to={`/club/${encodeURIComponent(clubSlug)}`}>← Back to {club.name.replace('Rotaract Club of ', '')}</Link>
          <Link className="btn btn-ghost" to="/#clubs">All Zone 7 Clubs</Link>
        </section>

        {lbOpen ? (
          <div className="lightbox open" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={(e) => { if (e.target === e.currentTarget) setLb(null); }}>
            <button className="lb-close" type="button" aria-label="Close photo viewer" onClick={() => setLb(null)}>✕</button>
            <span className="lb-count">{lb + 1} / {gallery.length}</span>
            <div className="lightbox-inner">
              <button className="lb-btn lb-prev" type="button" aria-label="Previous photo" onClick={() => setLb((i) => (i - 1 + gallery.length) % gallery.length)}>‹</button>
              <img src={gallery[lb]} alt={`${project.title}, photo ${lb + 1} of ${gallery.length}`} />
              <button className="lb-btn lb-next" type="button" aria-label="Next photo" onClick={() => setLb((i) => (i + 1) % gallery.length)}>›</button>
            </div>
          </div>
        ) : null}
      </>
    );
  } else {
    content = (
      <div className="empty-state wrap">
        <h2>Project not found</h2>
        <p>This project may have been removed, or the link is incorrect.</p>
        <Link className="btn btn-primary" to="/#clubs">Browse Zone 7 Clubs</Link>
      </div>
    );
  }

  return (
    <SiteShell
      current="clubs"
      cta="club"
      title={project && club ? `${project.title} | ${club.name}` : 'Project | Zone 7 Rotaract 3292'}
      css={pageCss}
    >
      {content}
    </SiteShell>
  );
}
