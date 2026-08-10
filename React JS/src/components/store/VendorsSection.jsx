import Reveal from '../ui/Reveal';
import { VENDORS, VENDOR_SLOTS } from '../../data/vendors';
import pawsPhoto from '../../vendors/paws-nepal/media/1.jpg';

/*
 * "Our Local Vendors" — partner businesses across Zone 7. Each card links to
 * the vendor's dedicated page (a standalone island build). Ghost cards leave
 * room for the next partners to join.
 */
export default function VendorsSection() {
  return (
    <section className="st-section st-vendors" id="vendors">
      <span className="st-big7" aria-hidden="true">V</span>
      <div className="wrap">
        <div className="st-head">
          <div>
            <span className="st-tag">Community first</span>
            <h2>Our Local Vendors</h2>
            <p className="st-sub">
              The store is powered by businesses from right inside Zone 7.
              Meet the people behind the products — and the good work your
              purchases help carry forward.
            </p>
          </div>
          <div className="st-count">{VENDORS.length} vendor{VENDORS.length === 1 ? '' : 's'} · growing</div>
        </div>

        <div className="st-vendor-grid">
          {VENDORS.map((v, i) => (
            <Reveal className="vendor-card" key={v.id} delay={i * 0.08}>
              <a className="vc-link" href={v.page}>
                <div className="vc-media">
                  <img src={pawsPhoto} alt={v.shortName} loading="lazy" />
                  <span className="vc-badge">{v.category}</span>
                  <span className="vc-emoji" aria-hidden="true">{v.emoji}</span>
                </div>
                <div className="vc-body">
                  <h3>{v.name}</h3>
                  <p className="vc-desc">{v.tagline}</p>
                  <div className="vc-meta">
                    <span className="vc-pin">📍 {v.location}</span>
                    <span className="vc-more">Visit vendor →</span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}

          {Array.from({ length: VENDOR_SLOTS }).map((_, i) => (
            <Reveal className="vendor-card ghost" key={`slot-${i}`} delay={(VENDORS.length + i) * 0.08}>
              <div className="vc-link">
                <div className="vc-media">
                  <span className="vc-plus" aria-hidden="true">+</span>
                </div>
                <div className="vc-body">
                  <h3>Your business here</h3>
                  <p className="vc-desc">Run a shop, studio or service in Zone 7? Partner with the store and get your own page.</p>
                  <div className="vc-meta">
                    <span className="vc-pin">Zone 7 · Kathmandu Valley</span>
                    <span className="vc-more">Coming soon</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
