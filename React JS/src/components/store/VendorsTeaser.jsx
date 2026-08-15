import Reveal from '../ui/Reveal';
import { VENDORS } from '../../data/vendors';

/*
 * "Support Local" teaser — the full vendor directory moved to its own
 * page (/vendors). Keeps the #vendors anchor so old links still land.
 */
export default function VendorsTeaser() {
  return (
    <section className="st-section st-teaser" id="vendors">
      <span className="st-big7" aria-hidden="true">V</span>
      <div className="wrap">
        <Reveal className="st-teaser-inner">
          <div className="st-teaser-copy">
            <span className="st-tag">Community first</span>
            <h2>Support local vendors</h2>
            <p className="st-sub">
              The store is powered by {VENDORS.length} business{VENDORS.length === 1 ? '' : 'es'} from right
              inside Zone 7 — pet care, fresh flowers and more. Meet them on their
              own pages, with photos, videos and the story behind the craft.
            </p>
          </div>
          <a className="st-teaser-btn" href="/vendors">
            Visit Support Local →
          </a>
        </Reveal>
      </div>
    </section>
  );
}