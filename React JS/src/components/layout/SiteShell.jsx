import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ClassicNav from './ClassicNav';
import ChatWidget from '../chat/ChatWidget';
import { CLUB_DIRECTORY } from '../../data/zone7-data';

function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      id="backTop"
      type="button"
      aria-label="Back to top"
      className={show ? 'show' : ''}
      onClick={() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      }}
    >
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 13V3M3.5 7.5L8 3L12.5 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function ClassicFooter() {
  const clubs = Object.entries(CLUB_DIRECTORY || {});
  return (
    <footer id="siteFooter">
      <div className="wrap">
        <div className="sf-brand">
          <span className="z">7</span>
          <h5>Zone 7 Rotaract</h5>
          <p>
            Nine Rotaract clubs across the Kathmandu Valley, united under Rotaract District 3292
            Nepal-Bhutan — serving to change lives.
          </p>
        </div>
        <div>
          <h5>Explore</h5>
          <div className="sf-links">
            <Link to="/about">About</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/merch">Merch · Magazine</Link>
            <Link to="/join">Join Us</Link>
            <Link to="/district-overview">District Overview</Link>
          </div>
        </div>
        <div>
          <h5>Learn</h5>
          <div className="sf-links">
            <Link to="/tutorials">Tutorials</Link>
            <Link to="/handbook">Handbook</Link>
            <Link to="/guides">Resources</Link>
            <Link to="/quiz">RKT Quiz</Link>
          </div>
        </div>
        <div>
          <h5>Clubs</h5>
          <div className="sf-links">
            {clubs.slice(0, 5).map(([slug, c]) => (
              <Link key={slug} to={`/club/${encodeURIComponent(slug)}`}>
                {c.name.replace('Rotaract Club of ', '')}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="sf-bottom">
        <div className="wrap">
          <span>© 2026 Zone 7, Rotaract District 3292 Nepal-Bhutan.</span>
          <span>
            <Link to="/admin">Club Admin</Link> · <a href="https://rotary.org" target="_blank" rel="noopener noreferrer">Rotary International</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default function SiteShell({ current = '', cta = 'join', title, css, children }) {
  useEffect(() => {
    if (title) document.title = title;
    if (css) {
      const el = document.createElement('style');
      el.setAttribute('data-page-css', 'true');
      el.textContent = css;
      document.head.appendChild(el);
      return () => el.remove();
    }
  }, [title, css]);

  return (
    <>
      <a className="skip-link" href="#siteMain">Skip to content</a>
      <ClassicNav current={current} cta={cta} />
      <main id="siteMain" className="site-main" tabIndex={-1}>
        {children}
      </main>
      <ClassicFooter />
      <BackToTop />
      <ChatWidget />
    </>
  );
}
