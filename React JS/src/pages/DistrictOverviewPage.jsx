import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Chart from 'chart.js/auto';
import SiteShell from '../components/layout/SiteShell';
import pageCss from './district-overview.css?inline';

const COLORS = ["#E11A6E", "#A80F52", "#F2A900", "#1B1836", "#8a6300", "#1c8a4d", "#3a3170", "#c2185b"];

// ---- Budget data (from District Budget Plan RY 2026-27) ----
const income = {
  "Membership Dues": 1600000, "Multi District Dues": 100000, "District Team Contribution": 340000,
  "Corporate Sponsorships": 500000, "Merchandise Sales": 280000, "Rotary District Support": 200000,
  "Partner/Sponsorship Funds": 3000000, "Team Training Seminar": 50000, "Rotaract Sahayatra Fundraiser": 1800000
};
const expense = {
  "Administration": 484000, "Publication/Merchandise": 3110000, "Programs & Events": 1895000,
  "Training": 1150000, "Other Costs": 1576000, "Contingency": 255000
};
const totalIncome = Object.values(income).reduce((a, b) => a + b, 0);
const totalExpense = Object.values(expense).reduce((a, b) => a + b, 0);

// ---- Goals (from Vision/Mission/Goals RY 2026-27) ----
const GOALS = [
  "Strengthen Transparency & Accountability", "Adopt Club-Centric Governance", "Simplify Systems & Reporting",
  "Reform Training Models & Build Capacity", "Promote Ethical Leadership & Standards", "Drive Membership Growth & Inclusion",
  "Develop Certified Trainers & Quality Events", "Build Reliable Partnerships & Member Benefits",
  "Expand International Exposure & Global Linkages", "Ensure Club Stability & District Grant Support"
];

const initials = (name) => name.replace(/^Rtr\.\s*/, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

const ADRR = [
  ["Zone I,II,VII,VIII", "Rtr. Bappa Shah", "Corporate Partnership Chair"],
  ["Zone III,XIII,XIV,XV", "Rtr. Amit Sharma", "IT & Data Management Chair"],
  ["Zone IV,V,IX,X", "Rtr. Sheikh Dilnawaz Ali", "CSR Projects Coordinator"],
  ["Zone VI,XI,XII,XVI", "Rtr. Sabin Raut", "Grant Management Chair"],
  ["Zone XVII-XX", "Rtr. Nirajan Aryal", "Regional Rotaract Coordinator"]
];

const RRC = [
  ["Zone I, II", "Rtr. Chandan Kumar Mahato"],
  ["Zone IV, V, VI", "Rtr. Anuj Giri"],
  ["Zone VII, VIII, IX", "Rtr. Sunisha Dhungana"],
  ["Zone X, XI, XII, XIII", "Rtr. Sandip Chhetri"],
  ["Zone XV, XVI, XX", "Rtr. Kushal Baral"]
];

export default function DistrictOverviewPage() {
  const [params] = useSearchParams();
  const embed = params.get('embed') === '1';
  const incomeRef = useRef(null);
  const expenseRef = useRef(null);
  const compareRef = useRef(null);

  useEffect(() => {
    const charts = [];
    if (incomeRef.current) {
      charts.push(new Chart(incomeRef.current, {
        type: "doughnut",
        data: { labels: Object.keys(income), datasets: [{ data: Object.values(income), backgroundColor: COLORS }] },
        options: { plugins: { legend: { position: "bottom", labels: { font: { size: 9 } } } } }
      }));
    }
    if (expenseRef.current) {
      charts.push(new Chart(expenseRef.current, {
        type: "doughnut",
        data: { labels: Object.keys(expense), datasets: [{ data: Object.values(expense), backgroundColor: COLORS }] },
        options: { plugins: { legend: { position: "bottom", labels: { font: { size: 9 } } } } }
      }));
    }
    if (compareRef.current) {
      charts.push(new Chart(compareRef.current, {
        type: "bar",
        data: {
          labels: ["Income", "Expenses"],
          datasets: [{ label: "NPR", data: [totalIncome, totalExpense], backgroundColor: ["#E11A6E", "#1B1836"], borderRadius: 8 }]
        },
        options: { indexAxis: "y", plugins: { legend: { display: false } } }
      }));
    }
    return () => charts.forEach((c) => c.destroy());
  }, []);

  useEffect(() => {
    if (!embed) return;
    const prev = document.body.style.background;
    document.body.style.background = 'transparent';
    return () => { document.body.style.background = prev; };
  }, [embed]);

  return (
    <SiteShell
      current="about"
      cta="home"
      title="District 3292 Overview | Zone 7 Rotaract"
      css={pageCss}
    >
      <nav id="districtNav" style={embed ? { display: 'none' } : undefined}>
        <div className="wrap">
          <Link to="/"><div className="brand"><span className="z">7</span>Zone 7 Rotaract</div></Link>
          <Link to="/admin" className="back">← Back to Admin</Link>
        </div>
      </nav>

      <header className="hero wrap" id="districtHero" style={embed ? { paddingTop: 8 } : undefined}>
        <div className="eyebrow">Rotaract District 3292 · RY 2026–27</div>
        <h1>Vision, Goals &amp; Budget at a Glance.</h1>
        <p>A visual snapshot of the district's income &amp; expense plan, strategic goals, and leadership structure for the year, sourced directly from the official district documents.</p>
      </header>

      <div className="wrap">
        <div className="quote">
          <p>"The Vision is Clear. The Mission is Ours. The Future is Together."</p>
          <span>Rotaract District 3292 · Nepal &amp; Bhutan</span>
        </div>

        <div className="grid g4">
          <div className="stat"><b>NPR {(totalIncome / 1e6).toFixed(2)}M</b><span>Total Projected Income</span></div>
          <div className="stat"><b>NPR {(totalExpense / 1e6).toFixed(2)}M</b><span>Total Projected Expenses</span></div>
          <div className="stat"><b>180+</b><span>Clubs Districtwide</span></div>
          <div className="stat"><b>5,500+</b><span>Rotaractors, D3292</span></div>
        </div>

        <div className="grid g2">
          <div className="card"><h3>Income Sources (NPR)</h3><canvas ref={incomeRef}></canvas></div>
          <div className="card"><h3>Expense Breakdown (NPR)</h3><canvas ref={expenseRef}></canvas></div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="card"><h3>Income vs Expenses by Category</h3><canvas ref={compareRef} style={{ maxHeight: 320 }}></canvas></div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="card">
            <h3>10 Strategic Goals, RY 2026–27</h3>
            <div className="grid g2" style={{ margin: '6px 0 0' }}>
              {GOALS.map((g, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'var(--cream)', border: '1px solid var(--line)', borderRadius: 12, padding: '12px 16px' }}>
                  <div style={{ fontFamily: "'Poppins'", fontWeight: 800, color: COLORS[i % COLORS.length], fontSize: '1.1rem', minWidth: 26 }}>{String(i + 1).padStart(2, '0')}</div>
                  <div style={{ fontSize: '0.87rem', fontWeight: 600 }}>{g}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="card">
            <h3>District Leadership Chain</h3>
            <div className="org-chart">
              <div className="org-top-row">
                <div className="org-node flank">IPDRR</div>
                <div className="org-node drr"><b>DRR</b><span>District Rotaract Representative</span></div>
                <div className="org-node flank">DRR Elect</div>
              </div>
              <div className="org-stem"></div>
              <div className="org-branches">

                <div className="org-branch">
                  <div className="org-stem-top"></div>
                  <div className="org-branch-card">
                    <div className="role">District Finance Chair (DFC)</div>
                    <div className="org-arrow-down">↓</div>
                    <div className="org-chain-item">District Finance Officer (DFO)</div>
                    <div className="org-chain-item">District Publication Chair</div>
                  </div>
                </div>

                <div className="org-branch">
                  <div className="org-stem-top"></div>
                  <div className="org-branch-card">
                    <div className="role">District Secretary (DS)</div>
                    <div className="org-arrow-down">↓</div>
                    <div className="org-cols-3">
                      <div>
                        <div className="org-subcol-label">&nbsp;</div>
                        <div className="org-chain-item small">ZRR</div>
                        <div className="org-arrow-down">↓</div>
                        <div className="org-chain-item small">Clubs</div>
                      </div>
                      <div>
                        <div className="org-subcol-label">&nbsp;</div>
                        <div className="org-chain-item small">District Membership Development Director (DMDD)</div>
                      </div>
                      <div>
                        <div className="org-subcol-label">DAO</div>
                        <div className="org-chain-item small">District Governance &amp; Compliance Officer (DGCO)</div>
                        <div className="org-chain-item small">District Service Project Chair (DSPC)</div>
                        <div className="org-chain-item small">District International Relation Chair (DIRC)</div>
                        <div className="org-chain-item small">District Women Empowerment Chair (DWEC)</div>
                        <div className="org-chain-item small">Chief Protocol &amp; Ceremonial Officer (CPCO)</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="org-branch">
                  <div className="org-stem-top"></div>
                  <div className="org-branch-card">
                    <div className="role">District Leadership Development Director (DLDD)</div>
                    <div className="org-arrow-down">↓</div>
                    <div className="org-chain-item">District Training Development Officer (DTDO)</div>
                    <div className="org-chain-item">Rotaract Training Team (RTT)</div>
                  </div>
                </div>

                <div className="org-branch">
                  <div className="org-stem-top"></div>
                  <div className="org-branch-card">
                    <div className="role">ADRR</div>
                    <div className="org-arrow-down">↓</div>
                    <div className="org-cols-2">
                      <div>
                        <div className="org-chain-item small">District Grant Management Chair (DGMC)</div>
                        <div className="org-chain-item small">District Corporate Partnership Chair</div>
                        <div className="org-chain-item small">District CSR Projects Coordinator</div>
                        <div className="org-chain-item small">District IT &amp; Data Management Chair</div>
                      </div>
                      <div>
                        <div className="org-chain-item small">Regional Rotaract Coordinator (RRC)</div>
                        <div className="org-arrow-down">↓</div>
                        <div className="org-chain-item small">ZRR</div>
                        <div className="org-arrow-down">↓</div>
                        <div className="org-chain-item small">Clubs</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <p className="org-note">IPDRR and DRR Elect flank the DRR; each branch runs district-wide committees down to Zone Rotaract Representatives and clubs. Source: Rotaract District 3292 Communication Channel, RY 2026–27.</p>
          </div>
        </div>

        <div className="grid g2">
          <div className="card">
            <h3>ADRR Zone Assignments</h3>
            <div className="zoneperson-list">
              {ADRR.map(([z, n, r], i) => (
                <div className="zoneperson" key={n}>
                  <div className="zp-avatar" style={{ background: COLORS[i % COLORS.length] }}>{initials(n)}</div>
                  <div className="zp-info">
                    <div className="zp-name">{n}</div>
                    <div className="zp-role">{r}</div>
                  </div>
                  <span className="zp-zone">{z}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3>RRC Zone Assignments</h3>
            <div className="zoneperson-list">
              {RRC.map(([z, n], i) => (
                <div className="zoneperson" key={n}>
                  <div className="zp-avatar" style={{ background: COLORS[(i + 3) % COLORS.length] }}>{initials(n)}</div>
                  <div className="zp-info">
                    <div className="zp-name">{n}</div>
                    <div className="zp-role">Regional Rotaract Coordinator (RRC)</div>
                  </div>
                  <span className="zp-zone">{z}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
