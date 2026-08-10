import { HOW_IT_WORKS, PAY_CHIPS } from '../../data/store';
import Reveal from '../ui/Reveal';

export default function HowItWorks() {
  return (
    <div className="how-wrap" id="how">
      <div className="section-label">How buying works</div>
      <div className="how-grid">
        {HOW_IT_WORKS.map((h, i) => (
          <Reveal className="how-card" key={h.num} delay={i * 0.08}>
            <div className="how-num">{h.num}</div>
            <div className="h-ico">{h.icon}</div>
            <h5>{h.title}</h5>
            <p>{h.desc}</p>
            {i === HOW_IT_WORKS.length - 1 && (
              <div className="pay-chips">
                {PAY_CHIPS.map((chip) => (
                  <span className="pay-chip" key={chip}>{chip.includes('·') ? chip.split(' · ').map((t, j) => j ? <b key={j}>· {t}</b> : t) : chip}</span>
                ))}
              </div>
            )}
          </Reveal>
        ))}
      </div>
    </div>
  );
}
