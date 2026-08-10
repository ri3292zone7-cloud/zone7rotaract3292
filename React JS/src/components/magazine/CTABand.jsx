import { SITE } from '../../data/store';

export default function CTABand() {
  return (
    <div className="cta-band">
      <div className="aurora a2" style={{ top: -60, right: -60, width: 300, height: 300, background: '#E11A6E' }}></div>
      <div>
        <h3>Want the documents behind the stories?</h3>
        <p>The Resource Library holds every constitution, template and planning guide from District 3292 — free to download.</p>
      </div>
      <a className="btn" href={SITE.resourcesUrl} target="_blank" rel="noreferrer">Open Resources →</a>
    </div>
  );
}
