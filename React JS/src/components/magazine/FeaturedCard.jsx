import { useEffect, useRef, useState } from 'react';
import { getCoverCanvas } from '../../lib/pdf';
import { MAGAZINE } from '../../data/store';
import Reveal from '../ui/Reveal';

export default function FeaturedCard() {
  const coverRef = useRef(null);
  const [coverReady, setCoverReady] = useState(false);

  useEffect(() => {
    let alive = true;
    getCoverCanvas(MAGAZINE.file)
      .then((canvas) => {
        if (!alive || !coverRef.current) return;
        coverRef.current.appendChild(canvas);
        setCoverReady(true);
      })
      .catch((e) => console.warn('Cover fallback in use:', e));
    return () => { alive = false; };
  }, []);

  return (
    <section className="featured" aria-label="Featured drop">
      <Reveal className="featured-card">
        <div className="feat-media">
          <div className="aurora a1" style={{ width: 300, height: 300, background: '#E11A6E', top: -60, left: -60, opacity: 0.3 }}></div>
          <div className="aurora a2" style={{ width: 260, height: 260, background: '#F2A900', bottom: -50, right: -40, opacity: 0.25 }}></div>
          <span className="feat-tag"><span className="pulse"></span>{MAGAZINE.badge}</span>
          <div className="cover3d">
            <div className="cover" ref={coverRef}>
              {!coverReady && (
                <div className="cov-fallback">
                  <span>Zone 7</span>Zonal<br />Magazine
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="feat-info">
          <div className="feat-badge">Zonal Magazine · {MAGAZINE.edition}</div>
          <h2>{MAGAZINE.name}</h2>
          <div className="feat-edition">{MAGAZINE.desc}</div>
          <div className="feat-price">
            <div className="price">{MAGAZINE.priceLabel}</div>
            <div className="price-note">{MAGAZINE.priceNote}</div>
          </div>
          <ul className="feat-bullets">
            {MAGAZINE.bullets.map((b) => <li key={b}>{b}</li>)}
          </ul>
          <div className="feat-actions">
            <a className="btn btn-primary" href="#reader">📖&nbsp; Read the flip book</a>
            <a className="btn btn-dark" href={MAGAZINE.file} download={MAGAZINE.pdfName}>⬇&nbsp; Download PDF</a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
