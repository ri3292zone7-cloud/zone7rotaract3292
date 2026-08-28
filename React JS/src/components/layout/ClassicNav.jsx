import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CLUB_DIRECTORY } from '../../data/zone7-data';

const LEARN_ITEMS = [
  { path: '/tutorials', icon: '🎓', title: 'Tutorials', desc: 'Monthly steps, board, assembly, ZRR, DRR and blood drive – step by step', key: 'tutorials' },
  { path: '/handbook', icon: '📘', title: 'Handbook', desc: 'District rules made simple: grants, twins, projects, health', key: 'handbook' },
  { path: '/guides', icon: '📄', title: 'Resources', desc: 'Official documents, constitutions and downloadable forms', key: 'resources' },
  { path: '/club-guides', icon: '📚', title: 'Guides for Clubs', desc: 'The playbook for running a great club all year', key: 'guides' },
  { path: '/quiz', icon: '🧠', title: 'RKT Practice Quiz', desc: 'Test your Rotaract knowledge in 2 minutes', key: 'quiz' }
];

const LEARN_CURRENT = ['tutorials', 'handbook', 'resources', 'guides', 'quiz'];

function Chevron() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M1.5 3.5L5 7L8.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ClassicNav({ current = '', cta = 'join' }) {
  const [openDrop, setOpenDrop] = useState(null);
  const [menu, setMenu] = useState(false);
  const navRef = useRef(null);
  const clubs = Object.entries(CLUB_DIRECTORY || {});
  const learnActive = LEARN_CURRENT.includes(current);
  const clubsActive = current === 'clubs';

  useEffect(() => {
    const onDoc = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenDrop(null);
    };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setOpenDrop(null);
      setMenu(false);
    };
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const toggle = (name) => setOpenDrop((v) => (v === name ? null : name));
  const closeAll = () => {
    setOpenDrop(null);
    setMenu(false);
  };

  return (
    <nav id="siteNav" aria-label="Main navigation" ref={navRef}>
      <div className="wrap">
        <Link to="/" aria-label="Zone 7 Rotaract home" onClick={closeAll} className="brand">
          <span className="z">7</span> Zone 7 Rotaract
        </Link>

        <div className="navlinks">
          <Link to="/about" className={current === 'about' ? 'current' : ''} onClick={closeAll}>
            About
          </Link>
          <div className={`nav-drop ${openDrop === 'clubs' ? 'open' : ''}`}>
            <button
              type="button"
              className="nav-drop-trigger"
              aria-haspopup="true"
              aria-expanded={openDrop === 'clubs'}
              style={clubsActive ? { opacity: 1, color: '#A80F52' } : undefined}
              onClick={() => toggle('clubs')}
            >
              Clubs <Chevron />
            </button>
            <div className="nav-drop-panel clubs-drop-panel">
              <div className="clubs-drop-grid">
                {clubs.map(([slug, c]) => (
                  <Link key={slug} to={`/club/${encodeURIComponent(slug)}`} className="clubs-drop-item" onClick={closeAll}>
                    {c.logo ? (
                      <img src={`/${c.logo}`} alt={c.name} loading="lazy" />
                    ) : (
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(225,26,110,.12)', flexShrink: 0 }} />
                    )}
                    <span>{c.name.replace('Rotaract Club of ', '')}</span>
                  </Link>
                ))}
              </div>
              <div className="clubs-drop-foot">
                <span>{clubs.length} clubs in Zone 7</span>
                <Link to="/#clubs" onClick={closeAll}>All clubs on the homepage →</Link>
              </div>
            </div>
          </div>
          <div className={`nav-drop ${openDrop === 'learn' ? 'open' : ''}`}>
            <button
              type="button"
              className="nav-drop-trigger"
              aria-haspopup="true"
              aria-expanded={openDrop === 'learn'}
              style={learnActive ? { opacity: 1, color: '#A80F52' } : undefined}
              onClick={() => toggle('learn')}
            >
              Learn <Chevron />
            </button>
            <div className="nav-drop-panel learn-drop-panel">
              {LEARN_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`res-drop-item ${current === item.key ? 'current' : ''}`}
                  onClick={closeAll}
                >
                  <div className="res-drop-ico">{item.icon}</div>
                  <div>
                    <h5>{item.title}</h5>
                    <p>{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <Link to="/gallery" className={current === 'gallery' ? 'current' : ''} onClick={closeAll}>
            Gallery
          </Link>
          <Link to="/merch" className={current === 'merch' ? 'current' : ''} onClick={closeAll}>
            Merch
          </Link>
          <Link to="/volunteers" style={{background:'linear-gradient(120deg,#E11A6E,#F2A900)', color:'#fff', padding:'7px 14px', borderRadius:100, fontWeight:800, fontSize:'.80rem', display:'inline-flex', gap:6, alignItems:'center', whiteSpace:'nowrap', boxShadow:'0 6px 14px rgba(225,26,110,.22)', textDecoration:'none'}} onClick={closeAll}>🚨 Volunteers</Link>
          <Link to="/flood-help" style={{background:'rgba(255,140,26,0.12)', color:'#9a4a00', border:'1px solid rgba(255,140,26,0.22)', padding:'7px 12px', borderRadius:100, fontWeight:800, fontSize:'.80rem', display:'inline-flex', gap:6, alignItems:'center', whiteSpace:'nowrap'}} onClick={closeAll}>🛟 Flood <span style={{background:'#FF8C1A', color:'#fff', padding:'2px 7px', borderRadius:100, fontSize:'.66rem'}}>13</span></Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/admin" className="nav-admin" onClick={closeAll}>
            Club Admin
          </Link>
          {cta === 'home' ? (
            <Link to="/" className="btn nav-cta" onClick={closeAll}>← Back Home</Link>
          ) : cta === 'club' ? (
            <>
              <Link to="/" className="back" onClick={closeAll}>← Back to Club</Link>
              <Link to="/join" className="btn nav-cta" onClick={closeAll}>Join Us</Link>
            </>
          ) : (
            <Link to="/join" className="btn nav-cta" onClick={closeAll}>Join Us</Link>
          )}
          <button
            type="button"
            className="burger"
            aria-label={menu ? 'Close menu' : 'Open menu'}
            aria-expanded={menu}
            onClick={() => setMenu((v) => !v)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${menu ? 'open' : ''}`}>
        <Link to="/about" className={current === 'about' ? 'current' : ''} onClick={closeAll}>About</Link>
        <div className="mm-group">Clubs</div>
        <Link to="/#clubs" onClick={closeAll}>All 9 Clubs in Zone 7</Link>
        <div className="mm-group">Learn</div>
        <Link to="/tutorials" onClick={closeAll}>Tutorials</Link>
        <Link to="/handbook" onClick={closeAll}>Handbook</Link>
        <Link to="/guides" onClick={closeAll}>Resources &amp; Documents</Link>
        <Link to="/club-guides" onClick={closeAll}>Guides for Clubs</Link>
        <Link to="/quiz" onClick={closeAll}>RKT Practice Quiz</Link>
        <div className="mm-group">Community</div>
        <Link to="/volunteers" style={{background:'linear-gradient(120deg,#E11A6E,#F2A900)', color:'#fff', borderRadius:12, padding:'12px 14px', fontWeight:800, display:'flex', justifyContent:'space-between', alignItems:'center'}} onClick={closeAll}><span>🚨 Volunteers Needed</span><span style={{background:'rgba(255,255,255,.22)', color:'#fff', padding:'3px 8px', borderRadius:100, fontSize:'.72rem'}}>Register →</span></Link>
        <Link to="/flood-help" style={{background:'rgba(255,140,26,0.12)', border:'1px solid rgba(255,140,26,0.22)', borderRadius:12, padding:'10px 14px', fontWeight:800, color:'#9a4a00', display:'flex', justifyContent:'space-between', alignItems:'center'}} onClick={closeAll}><span>🛟 Flood Help</span><span style={{background:'#FF8C1A', color:'#fff', padding:'3px 8px', borderRadius:100, fontSize:'.72rem'}}>13 missing</span></Link>
        <Link to="/gallery" onClick={closeAll}>Gallery</Link>
        <Link to="/merch" onClick={closeAll}>Merch · Zonal Magazine</Link>
        <Link to="/join" onClick={closeAll}>Join Us</Link>
        <Link to="/admin" onClick={closeAll}>Club Admin</Link>
        <Link to="/join" className="mm-cta" onClick={closeAll}>Fill the Form, Become a Rotaractor →</Link>
      </div>
    </nav>
  );
}
