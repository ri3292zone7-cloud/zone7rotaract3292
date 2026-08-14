import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { jsPDF } from 'jspdf';
import SiteShell from '../components/layout/SiteShell';
import pageCss from './admin.css?inline';
import {
  ZONE7_DB, CLUB_DIRECTORY, CLUB_LETTERHEAD, CLUB_CREDENTIALS, ZONAL_PASSWORD,
  UNIVERSITY_CLUBS, BAROMETER_GROUPS, BAROMETER_THRESHOLDS,
  zone7GetBarometer, zone7AutoCheck, zone7BarometerCategory,
  zone7UploadImage, zone7ReadImage, zone7ReadFile, zone7PrefersClub, zone7Slugify, zone7Esc
} from '../data/zone7-data';

const ADMIN_SESSION_KEY = 'zone7_admin_session';
const PROJ_PAGE_SIZE = 25;
const ZONAL_ONLY = ['guides', 'zrr', 'leadership'];

/* ---- Barometer constants (mirror admin.html) ---- */
const BARO_NEEDS_PROJECT = new Set([9,14,16,18,19,21,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38]);
const BARO_MULTI_PROJECT = { 9:2, 18:2, 29:7, 30:5 };
const BARO_NEEDS_DOC = new Set([9]);
const BARO_OPTIONAL_DOC = new Set([1,6,7]);
const BARO_DOC_LABEL = {
  9: 'Meeting Minutes', 1: 'Strategic Plan Document', 6: 'Financial Guidelines Document', 7: 'Annual Budget Document'
};
const baroMinFor = id => BARO_MULTI_PROJECT[id] || 1;

const CHART_PALETTE = ['#E11A6E','#A80F52','#F2A900','#1B1836','#8a6300','#1c8a4d','#3a3170','#c2185b','#5b4fd1','#d9822b'];
const PS_NET_ROWS = [
  { label: 'Baseline 600', val: -5.47, color: 'rgba(225,26,110,.45)' },
  { label: 'Target 650', val: -5.93, color: 'rgba(225,26,110,.6)' },
  { label: 'Target+ 700', val: -6.39, color: 'rgba(225,26,110,.75)' },
  { label: 'Full house 800', val: -7.31, color: 'rgba(225,26,110,.9)' }
];

function readAdminSession() {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s) return null;
    if (s.type === 'zonal') return { type: 'zonal' };
    if (s.type === 'club' && s.slug && CLUB_DIRECTORY[s.slug]) return { type: 'club', slug: s.slug };
    return null;
  } catch { return null; }
}

const emptyProjectForm = () => ({ title: '', category: '', date: '', location: '', summary: '', body: '' });

const emptyEventForm = () => ({ id: '', title: '', date: '', desc: '', link: '' });

const emptyGuestForm = () => ({ id: '', name: '', years: '', club: '', bio: '', photo: '', isCurrent: false });

const emptyLeaderForm = () => ({ id: '', role: '', roleFull: '', name: '', club: '', bio: '', photo: '' });

const emptyMinutes = () => ({
  sponsor: '', chartered: '', district: '3292 Nepal and Bhutan', motto: '', ry: '2026-27',
  title: '', date: '', day: '', venue: '', start: '', end: '',
  chair: '', secretary: '',
  open: [], happy: [], agenda: [], info: [],
  apologies: '', prevApproval: '',
  disc: [], remarks: [],
  thanks: '', saa: '',
  aGen: '0', aBoard: '0', aGuest: '0', aVisRac: '0', aVisRot: '0', aDist: '0',
  sSpecial: '', sTotal: '', next: '', adjourn: ''
});

const MM_STR_PLACEHOLDER = {
  open: 'e.g. SAA Rtr. X notified all attendees the meeting has started.',
  happy: 'e.g. Rtr. X was happy to attend the meeting after 4 months and see new faces.',
  agenda: 'e.g. Club Activities Review and Updates',
  info: 'e.g. Rotaract ID cards have arrived at the club.'
};

/* ---- Analytics charts (module-level so hook order is stable) ---- */
function AnalyticsCharts({ visible, data, myClub }) {
  const clubRef = useRef(null);
  const categoryRef = useRef(null);
  const trendRef = useRef(null);

  useEffect(() => {
    if (!visible || !data) return undefined;
    const charts = [];
    try {
      const all = data.all || [];
      const counts = data.counts || {};

      const clubRows = Object.keys(CLUB_DIRECTORY)
        .map(slug => ({ slug, name: CLUB_DIRECTORY[slug].name.replace('Rotaract Club of ', ''), count: counts[slug] || 0 }))
        .sort((a, b) => a.count - b.count);
      const clubColors = clubRows.map(r => r.slug === myClub ? '#E11A6E' : '#A80F52');
      charts.push(new Chart(clubRef.current, {
        type: 'bar',
        data: {
          labels: clubRows.map(r => r.name),
          datasets: [{ data: clubRows.map(r => r.count), backgroundColor: clubColors, borderRadius: 6, barThickness: 18 }]
        },
        options: {
          indexAxis: 'y', responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.raw} project${c.raw === 1 ? '' : 's'}` } } },
          scales: { x: { beginAtZero: true, ticks: { precision: 0 } } }
        }
      }));

      const catCounts = {};
      all.forEach(p => {
        const c = (p.category || '').trim() || 'Uncategorized';
        catCounts[c] = (catCounts[c] || 0) + 1;
      });
      const catEntries = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
      if (catEntries.length) {
        charts.push(new Chart(categoryRef.current, {
          type: 'doughnut',
          data: {
            labels: catEntries.map(e => e[0]),
            datasets: [{ data: catEntries.map(e => e[1]), backgroundColor: CHART_PALETTE, borderWidth: 2, borderColor: '#fff' }]
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } } }
        }));
      }

      const now = new Date();
      const ryStartYear = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
      const monthLabels = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'];
      const monthCounts = new Array(12).fill(0);
      all.forEach(p => {
        if (!p.date) return;
        const d = new Date(p.date);
        if (isNaN(d)) return;
        const y = d.getFullYear(), m = d.getMonth();
        const idx = m >= 6 ? m - 6 : m + 6;
        const yearForIdx = m >= 6 ? y : y - 1;
        if (yearForIdx === ryStartYear) monthCounts[idx]++;
      });
      charts.push(new Chart(trendRef.current, {
        type: 'line',
        data: {
          labels: monthLabels.map((l, i) => `${l} ${i < 6 ? ryStartYear : ryStartYear + 1}`),
          datasets: [{
            data: monthCounts, borderColor: '#E11A6E', backgroundColor: 'rgba(225,26,110,0.12)',
            fill: true, tension: 0.35, pointRadius: 4, pointBackgroundColor: '#A80F52'
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
        }
      }));
    } catch (err) {
      console.warn('chart render failed:', err);
    }
    return () => charts.forEach(c => c.destroy());
  }, [visible, data, myClub]);

  return (
    <>
      <div className="a-chart-grid">
        <div className="a-chart-card wide">
          <h4 className="a-subhead">Projects by Club</h4>
          <div className="a-chart-wrap" style={{ height: 340 }}><canvas ref={clubRef}></canvas></div>
        </div>
        <div className="a-chart-card">
          <h4 className="a-subhead">Projects by Category</h4>
          <div className="a-chart-wrap" style={{ height: 340 }}><canvas ref={categoryRef}></canvas></div>
        </div>
      </div>
      <div className="a-chart-card" style={{ marginTop: 18 }}>
        <h4 className="a-subhead">Monthly Trend <span style={{ fontWeight: 500, fontSize: '0.72rem', color: 'rgba(27,24,54,0.45)', textTransform: 'none', letterSpacing: 0 }}>(projects added this Rotary year, Jul&ndash;Jun)</span></h4>
        <div className="a-chart-wrap" style={{ height: 280 }}><canvas ref={trendRef}></canvas></div>
      </div>
    </>
  );
}

/* ---- District Events & Bidding: static content (mirrors admin.html) ---- */
function DistEventsPanel({ psMode, setPsMode, psNetShown, setPsNetShown }) {
  const onPsTab = (mode) => {
    setPsMode(mode);
    if (mode === 'exec') setPsNetShown(true);
  };
  const maxAbs = Math.max(...PS_NET_ROWS.map(r => Math.abs(r.val)));

  return (
    <div className="panel" style={{ paddingBottom: 34 }}>
      <div className="de-kicker">🏟️ District Events · RY 2026-27</div>
      <h3 style={{ fontSize: '1.4rem' }}>Hosting a District Event? It Starts With a Bid.</h3>
      <p className="de-lead">Twice a Rotary year, Rotaract District 3292 hands one of its big signature events to a member club to organise: the <b>1st President&ndash;Secretary Meet</b> and the <b>President Night</b>. Hosting isn&rsquo;t an assignment &mdash; it&rsquo;s a <b>competitive bid</b>: any club (or co-host clubs) can apply, and the Rotaract District Committee (RDC) picks the strongest proposal. The event budget, logistics, food, venue and hospitality are the host club&rsquo;s job; the RDC runs the agenda, speakers and official programme.</p>
      <div className="de-steps" style={{ marginTop: 24 }}>
        <div className="de-step"><div className="n">1</div><b>Read the document</b><span>Understand exactly what the event demands before you commit.</span></div>
        <div className="de-step"><div className="n">2</div><b>Get club approval</b><span>Pass the hosting decision in a general meeting and keep signed minutes.</span></div>
        <div className="de-step"><div className="n">3</div><b>Build your bid</b><span>EOI letter + completed bidding form + venue proposal with photos &amp; a location map.</span></div>
        <div className="de-step"><div className="n">4</div><b>Submit in time</b><span>Send the full bid as a PDF to both district emails before 11:59 PM on the deadline.</span></div>
        <div className="de-step"><div className="n">5</div><b>Present &amp; win</b><span>Bidders may present to the RDC; the best plan gets the hosting rights.</span></div>
      </div>

      <div className="de-event" style={{ '--de-c': '#E11A6E' }}>
        <div className="de-hero">
          <img className="de-hero-img" src="media/images/dist-events-psmeet.jpg" alt="1st President–Secretary Meet illustration" loading="lazy" />
          <div className="de-hero-inner">
            <span className="de-hero-tag">Event 1 · RY 2026-27</span>
            <h3>1st President&ndash;Secretary Meet</h3>
            <p>Rotaract 3292&rsquo;s formal annual summit of club Presidents and Secretaries &mdash; resolutions, updates and leadership, all in one day.</p>
          </div>
        </div>
        <div className="de-body">
          <div className="baro-mode-tabs" style={{ margin: '0 0 18px' }}>
            <span className={'bmt' + (psMode === 'guide' ? ' active' : '')} onClick={() => onPsTab('guide')}>📋 Bid Guide</span>
            <span className={'bmt' + (psMode === 'exec' ? ' active' : '')} onClick={() => onPsTab('exec')}>🏗️ Bid Execution</span>
          </div>
          {psMode === 'guide' && (
            <div>
              <div className="de-facts">
                <div className="de-fact"><b>📅 Proposed date</b><span>21 November 2026</span></div>
                <div className="de-fact"><b>⏱️ Duration</b><span>1 day · 8:00 AM &ndash; 8:00 PM</span></div>
                <div className="de-fact"><b>👥 Expected turnout</b><span>Approx. 500&ndash;800 participants</span></div>
                <div className="de-fact"><b>🏢 Venue needed</b><span>Two air-conditioned halls (400 + 350&ndash;450 seats)</span></div>
              </div>

              <div className="de-sec">
                <h4>What is it, in plain words</h4>
                <p>The 1st PS Meet is the district&rsquo;s official get-together for the people steering every club &mdash; the <b>President</b> and <b>Secretary</b> of each Rotaract Club in District 3292. One of two PS Meets held every Rotary year, this edition sits in the first half of the year. Clubs and the district bring their key issues forward, everything is deliberated openly, and resolutions are reached together &mdash; so every club ends the meet knowing the district is moving in one direction. It&rsquo;s also a rare chance for leaders to swap ideas and build networks across clubs.</p>
              </div>

              <div className="de-sec">
                <h4>How the one day breaks down</h4>
                <div className="de-seg">
                  <div className="seg"><b>🗳️ Formal Meeting</b><span>Run strictly by the RDC and chaired by the DRR, with the District Secretary facilitating. Pre-circulated agendas are deliberated. Only Presidents, Secretaries (or an authorised rep with a signed consent letter on club letterhead) take part.</span></div>
                  <div className="seg"><b>🎓 General Session (parallel)</b><span>Runs at the same time in the second hall: results and capacity-building sessions by experienced resource persons &mdash; the Rotary&ndash;Rotaract framework, policy updates, grants and leadership.</span></div>
                  <div className="seg"><b>🤝 Fellowship &amp; Interaction</b><span>The second half goes informal &mdash; networking, collaboration and fun, designed together by the RDC and the host club.</span></div>
                </div>
              </div>

              <div className="de-sec">
                <h4>What your club must arrange (the logistics checklist)</h4>
                <div className="de-checks">
                  <div className="de-check">Two fully air-conditioned halls (Hall 1 ≈800, Hall 2 ≈300&ndash;400, theatre seating)</div>
                  <div className="de-check">Stage setup: podiums with desktop mics, and a dais for 6&ndash;8 officials</div>
                  <div className="de-check">At least 2 volunteers at the entrance for delegate verification</div>
                  <div className="de-check">Branding: banners, selfie standee, checkerboard backdrop, photo stand &amp; welcome gate</div>
                  <div className="de-check">Hall 1: LED display screen with a dedicated technician</div>
                  <div className="de-check">Hall 2: projector + HDMI/Type-C cables, presenter pointer and power</div>
                  <div className="de-check">Sound: 4&ndash;6 wireless + 2 desk mics (Hall 1); 2 wireless + 1 desk mic (Hall 2)</div>
                  <div className="de-check">Lighting and continuous, uninterrupted power all day</div>
                  <div className="de-check">Professional photographer / videographer for full coverage</div>
                  <div className="de-check">Delegate kit: ID card + lanyard, schedule, food coupons, diary &amp; pen, kit bag</div>
                  <div className="de-check">Catering: breakfast, lunch, hi-tea and dinner (non-veg included at least once)</div>
                  <div className="de-check">On-theme stage and venue decoration (balloons, floral, official theme)</div>
                </div>
              </div>

              <div className="de-sec">
                <h4>Who does what &mdash; RDC vs Host Club</h4>
                <table className="de-table">
                  <thead><tr><th>Responsibility area</th><th className="de-rdc">RDC</th><th className="de-host">Host club</th></tr></thead>
                  <tbody>
                    <tr><td>Venue, delegate kit, food, hospitality</td><td className="de-rdc">&mdash;</td><td className="de-host">✅</td></tr>
                    <tr><td>Event schedule &amp; agenda</td><td className="de-rdc">✅</td><td className="de-host">&mdash;</td></tr>
                    <tr><td>Speakers, facilitators &amp; sessions</td><td className="de-rdc">✅</td><td className="de-host">&mdash;</td></tr>
                    <tr><td>Master of ceremony</td><td className="de-rdc">✅</td><td className="de-host">✅</td></tr>
                    <tr><td>Social media &amp; promotions</td><td className="de-rdc">✅</td><td className="de-host">✅</td></tr>
                    <tr><td>Every other logistics (listed above)</td><td className="de-rdc">&mdash;</td><td className="de-host">✅</td></tr>
                    <tr><td>Finances (fundraising to cover expenses)</td><td className="de-rdc">Pre-approved program cost</td><td className="de-host">Everything else</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="de-sec">
                <h4>What to put in your bid</h4>
                <ul className="de-submit">
                  <li><span><b>Expression of Interest (EOI)</b> on your official club letterhead</span></li>
                  <li><span><b>Minutes of the general meeting</b> where the club decided to host, signed by President and Secretary</span></li>
                  <li><span>Your <b>completed bidding form</b> with registration slabs, food menu &amp; pricing, accommodation and venue details</span></li>
                  <li><span><b>Venue proposal</b> with photographs and a location map, plus the venue&rsquo;s authorization letter</span></li>
                  <li><span><b>Contact person</b> details for coordination, and a written bid in PDF format</span></li>
                </ul>
              </div>

              <div className="de-cta">
                <div className="emails">
                  <b>Deadline: 23 August 2026, 11:59 PM</b><br />
                  Submit PDF to <a href="mailto:rtrprakash3292@gmail.com">rtrprakash3292@gmail.com</a> &amp; <a href="mailto:rtrsurajbhandari@gmail.com">rtrsurajbhandari@gmail.com</a>
                </div>
                <div className="dl">
                  <a className="de-dl-btn" href="media/guides/1st%20PS%20Meet%20Bidding%20document.pdf" download>📄 Bidding Document (PDF)</a>
                  <a className="de-dl-btn" href="media/guides/Bidding%20Form.docx" download>📝 Bidding Form (DOCX)</a>
                </div>
              </div>
            </div>
          )}

          {psMode === 'exec' && (
            <div id="psExec">
              <div className="de-hero">
                <img className="de-hero-img" src="media/images/dist-exec-hero.jpg" alt="PS Meet at full capacity" loading="lazy" />
                <div className="de-hero-inner">
                  <span className="de-hero-tag">The Winning Formula · Bid Execution</span>
                  <h3>Hosting isn&rsquo;t a lottery. It&rsquo;s arithmetic.</h3>
                  <p>Clicking President/Secretary Meet is the easy part. Winning the right to host it is a different game, and this section is the playbook.</p>
                </div>
              </div>
              <div className="de-body">
                <p className="de-lead">Here&rsquo;s the honest version. Every number below sits at the approved Rs 600 to Rs 1,400 registration ceiling. Registrations cover about a third of the real bill. The partner engine covers another third, and the last third is the gap this bid must close: roughly Rs 5.9 L at the 650-delegate target. Short sentences, real math, no surprises.</p>

                <div className="de-facts">
                  <div className="de-fact"><b>🍽️ Food per guest</b><span>≈ Rs 1,700: breakfast, lunch, 2 teas, non-veg dinner</span></div>
                  <div className="de-fact"><b>🏢 Hosting format</b><span>Zone 7 consortium. One lead club, co-hosts, collaborators</span></div>
                  <div className="de-fact"><b>🤝 Sponsor gap at Target</b><span>≈ Rs 5.9 L. The partner engine&rsquo;s whole job</span></div>
                  <div className="de-fact"><b>⏳ Winning deadline</b><span>23 August 2026. Exactly two weeks from today</span></div>
                </div>

                <div className="de-sec">
                  <h4>The financial model, in lakhs (Rs 100,000)</h4>
                  <p>Run the math at 650 delegates with a 4-tier ceiling of Rs 1,400 and the average ticket lands near Rs 1,030. That covers about a third of the real bill. Co-hosts, collaborators and the district program roughly cover another third, and the venue covers its own rent in exchange for the Hosting-Partner title plus naming rights on the second hall. A small trade. It saves lakhs.</p>
                  <p>Now the part every guest actually remembers: the food. A good buffet dinner, a proper breakfast and two rounds of tea and hi-tea will cost roughly Rs 1,700 per head at honest Kathmandu banquet rates. At 650 guests that single line lands near <b>Rs 11 lakh</b> before the crew and crockery, and about <b>Rs 12.25 lakh</b> all-in. It is close to 60% of everything the day spends. Everything else, from the LED wall to the welcome gate, hangs off it. The full breakdown is two sections down.</p>
                </div>

                <div className="de-sec">
                  <h4>Projected income and expenditure, scenario by scenario</h4>
                  <div className="ps-matrix">
                    <div>
                      <div className="de-tbl-scroll">
                        <table className="de-table">
                          <thead><tr><th>Scenario</th><th>Delegates</th><th className="de-rdc">Income</th><th className="de-host">Cost</th><th>Gap to fund</th></tr></thead>
                          <tbody>
                            <tr><td>Baseline</td><td>600</td><td>14.13</td><td>19.60</td><td style={{ color: '#A80F52', fontWeight: 800 }}>&minus;5.47</td></tr>
                            <tr><td>Target</td><td>650</td><td>14.65</td><td>20.58</td><td style={{ color: '#A80F52', fontWeight: 800 }}>&minus;5.93</td></tr>
                            <tr><td>Target+</td><td>700</td><td>15.16</td><td>21.55</td><td style={{ color: '#A80F52', fontWeight: 800 }}>&minus;6.39</td></tr>
                            <tr><td>Full house</td><td>800</td><td>16.19</td><td>23.50</td><td style={{ color: '#A80F52', fontWeight: 800 }}>&minus;7.31</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div>
                      {psNetShown && PS_NET_ROWS.map(r => (
                        <div className="a-bar-row" key={r.label}>
                          <span className="a-bar-label">{r.label}</span>
                          <div className="a-bar-track"><div className="a-bar-fill" style={{ width: (Math.abs(r.val) / maxAbs) * 100 + '%', background: r.color }}></div></div>
                          <span className="a-bar-count" style={{ fontSize: '0.78rem', fontWeight: 800, color: '#A80F52' }}>{r.val > 0 ? '+' : ''}{r.val} L</span>
                        </div>
                      ))}
                      <p style={{ fontSize: '.78rem', color: 'rgba(27,24,54,.55)', marginTop: 8 }}>Bars show the funding gap in lakhs at today&rsquo;s partner engine. Every bar is the work the bid must sell.</p>
                    </div>
                  </div>
                </div>

                <div className="de-sec">
                  <h4>The ticket ladder: four tiers, never above Rs 1,400</h4>
                  <div className="de-tbl-scroll">
                    <table className="de-table">
                      <thead><tr><th>Tier</th><th>Price</th><th>Window</th></tr></thead>
                      <tbody>
                        <tr><td>Launch</td><td>Rs 600</td><td>Announcement to 30 Jun</td></tr>
                        <tr><td>Early Bird</td><td>Rs 900</td><td>1 Aug to 30 Sep</td></tr>
                        <tr><td>Standard</td><td>Rs 1,200</td><td>1 Oct to 25 Oct</td></tr>
                        <tr><td>Late / Walk-in</td><td>Rs 1,400</td><td>26 Oct to event day</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="de-sec">
                  <h4>Where every lakh comes from (650-delegate target)</h4>
                  <div className="de-seg">
                    <div className="seg"><b>🎟️ Tickets</b><span>650 × ~1,030 avg<br /><b style={{ color: 'var(--de-c,#E11A6E)' }}>6.7</b></span></div>
                    <div className="seg"><b>🤝 Co-host clubs</b><span>7 × 0.1 (Rs 10K each)<br /><b style={{ color: 'var(--de-c,#E11A6E)' }}>0.7</b></span></div>
                    <div className="seg"><b>🏛️ Collaborator clubs</b><span>8 × 0.5 (Rs 50K each)<br /><b style={{ color: 'var(--de-c,#E11A6E)' }}>4.0</b></span></div>
                    <div className="seg"><b>💰 Title + sponsors</b><span>1×2.0 + 2×0.5 gold<br /><b style={{ color: 'var(--de-c,#E11A6E)' }}>3.0</b></span></div>
                    <div className="seg"><b>📋 District program</b><span>Official RDC program cost<br /><b style={{ color: 'var(--de-c,#E11A6E)' }}>0.25</b></span></div>
                    <div className="seg"><b>🏢 In-kind venue</b><span>Hosting-Partner balance. Not cash<br /><b style={{ color: 'var(--de-c,#E11A6E)' }}>~2.0</b></span></div>
                  </div>
                  <p style={{ fontSize: '.8rem', color: 'rgba(27,24,54,.55)', marginTop: 10 }}><b>Total cash build ≈ 14.65 L</b> (incl. venue-in-kind value ≈ 16.65 L) &nbsp;·&nbsp; full cost with food ≈ 20.6 L &nbsp;·&nbsp; sponsor gap <b style={{ color: '#A80F52' }}>≈ Rs 5.9 L</b> (Target).</p>
                </div>

                <div className="de-sec">
                  <h4>Where every rupee goes: the cost ledger, food first (650-delegate target)</h4>
                  <p>Guests come for the agenda, but they judge on the buffet. So meals were priced first, at honest Kathmandu banquet rates, and every other line was built around them. The ledger below adds up to the <b>Rs 2,057,500</b> this day actually costs to run.</p>
                  <div className="de-tbl-scroll">
                    <table className="de-table">
                      <thead><tr><th>Expense</th><th>Basis</th><th>Amount</th></tr></thead>
                      <tbody>
                        <tr><td>Buffet breakfast</td><td>650 guests × Rs 300</td><td>Rs 195,000</td></tr>
                        <tr><td>Buffet lunch, non-veg included</td><td>650 × Rs 550</td><td>Rs 357,500</td></tr>
                        <tr><td>Tea &amp; hi-tea (2 breaks, sides incl.)</td><td>650 × Rs 150</td><td>Rs 97,500</td></tr>
                        <tr><td>Buffet dinner, non-veg included</td><td>650 × Rs 700</td><td>Rs 455,000</td></tr>
                        <tr><td>Cooked-food crew, service &amp; crockery</td><td>Outside caterer</td><td>Rs 120,000</td></tr>
                        <tr><td style={{ color: 'rgba(27,24,54,.9)', fontWeight: 800 }}>Food &amp; refreshments subtotal</td><td></td><td style={{ color: '#A80F52', fontWeight: 800 }}>Rs 1,225,000</td></tr>
                        <tr><td>Sound, LED screen, mics &amp; technician</td><td>Hall kit + operator</td><td>Rs 180,000</td></tr>
                        <tr><td>Stage, dais, backdrop, décor &amp; branding</td><td>Banners, welcome gate, photo point</td><td>Rs 200,000</td></tr>
                        <tr><td>Delegate kits, ID, schedule &amp; printing</td><td>650 × Rs 250 + batch print</td><td>Rs 162,500</td></tr>
                        <tr><td>Photographer + videographer</td><td>Full-day coverage</td><td>Rs 90,000</td></tr>
                        <tr><td>Power backup, drinking water, first aid</td><td>Genset, 100 L, stand-by</td><td>Rs 90,000</td></tr>
                        <tr><td>Contingency buffer</td><td>~7% of the build</td><td>Rs 110,000</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p style={{ fontSize: '.8rem', color: 'rgba(27,24,54,.55)', marginTop: 10 }}><b>Total ≈ Rs 2,057,500 (Rs 20.6 L).</b> Food alone is <b style={{ color: '#A80F52' }}>Rs 1,225,000</b>, about 60% of everything spent. Close the Rs 5.9 L gap with twelve more collaborators at Rs 50K each, one title sponsor at Rs 6 L, or a venue that throws in lunch and dinner. That&rsquo;s the honest shape of hosting: the plate is the biggest line, and the light, sound and banners are what&rsquo;s left. The venue stays in-kind, roughly Rs 2 L of value but zero cash.</p>
                </div>

                <div className="de-sec">
                  <h4>The 15-day bid sprint</h4>
                  <div className="de-tbl-scroll">
                    <table className="de-table">
                      <thead><tr><th>Window</th><th>Action</th></tr></thead>
                      <tbody>
                        <tr><td>6 to 8 Aug</td><td>Zone energy call. Pick your lead club and finance committee</td></tr>
                        <tr><td>11 to 14 Aug</td><td>Venue LOI, 3 quotes and the authorization letter. All required in the bid</td></tr>
                        <tr><td>15 to 19 Aug</td><td>Recruit co-hosts (Rs 10K) and collaborators (Rs 50K). Target: 7 + 8</td></tr>
                        <tr><td>20 to 22 Aug</td><td>Build the package: bidding form, budget, fundraising plan, photos and map</td></tr>
                        <tr><td><b>23 Aug</b></td><td><b>Submit the PDF to both emails before 11:59 PM</b></td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="de-sec">
                  <h4>Venue shortlist for Kathmandu (two-hall capacity)</h4>
                  <div className="de-tbl-scroll">
                    <table className="de-table">
                      <thead><tr><th>Venue</th><th>Fit</th><th>Estimate</th></tr></thead>
                      <tbody>
                        <tr><td>Everest Hotel (Baneshwor)</td><td>Primary bid, in-kind pitch</td><td>Rs 150,000&ndash;250,000</td></tr>
                        <tr><td>Radisson KTM (Lazimpat)</td><td>Reserve, central</td><td>Rs 200,000&ndash;300,000</td></tr>
                        <tr><td>Yak &amp; Yeti ICC</td><td>Prestige swing</td><td>Rs 300,000&ndash;400,000</td></tr>
                        <tr><td>Banquet hall (Alfa Beta / Krishna Pavilion)</td><td>Lean value backup</td><td>Rs 120,000&ndash;180,000</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="de-cta">
                  <div className="emails">
                    <b>This &ldquo;social proof&rdquo; is Zone 7&rsquo;s edge.</b><br />
                    The largest cluster of clubs in the district. A proven city network. A budget with every rupee priced, including the food. And a committee that has already done the homework. Walk in with this plan, and present with confidence.
                  </div>
                  <div className="dl">
                    <a className="de-dl-btn" href="media/guides/1st%20PS%20Meet%20Bidding%20document.pdf" download>📄 Re-read the bid terms</a>
                  </div>
                </div>

                <div className="de-sec" style={{ marginTop: 18 }}>
                  <h4>Picture it: the confetti, the applause, the banner with your club&rsquo;s logo</h4>
                  <div className="de-hero" style={{ height: 250 }}><img className="de-hero-img" src="media/images/dist-exec-trophy.jpg" alt="Zone 7 PS Meet victory moment" loading="lazy" /></div>
                  <p style={{ fontSize: '.8rem', color: 'rgba(27,24,54,.55)', marginTop: 10 }}>Every club that hosts walks away with district-wide recognition, and this is what it feels like. The board approves. The partners pitch in. Your club history page gets its flagship event.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="de-event" style={{ '--de-c': '#0E7490' }}>
        <div className="de-hero">
          <img className="de-hero-img" src="media/images/dist-events-pnight.jpg" alt="President Night illustration" loading="lazy" />
          <div className="de-hero-inner">
            <span className="de-hero-tag">Event 2 · RY 2026-27</span>
            <h3>President Night</h3>
            <p>The district&rsquo;s two-day leadership retreat under the stars &mdash; bonding, team games and honest reflection for presidents and the RDC.</p>
          </div>
        </div>
        <div className="de-body">
          <div className="de-facts">
            <div className="de-fact"><b>📅 Proposed dates</b><span>25&ndash;26 September 2026</span></div>
            <div className="de-fact"><b>⏱️ Duration</b><span>1 night · 2 days</span></div>
            <div className="de-fact"><b>👥 Expected turnout</b><span>Approx. 250&ndash;300 participants</span></div>
            <div className="de-fact"><b>🏞️ Venue vibe</b><span>A safe, eco-friendly resort, hotel or campsite</span></div>
          </div>

          <div className="de-sec">
            <h4>What is it, in plain words</h4>
            <p>Away from the formality of meetings, <b>President Night</b> is the district&rsquo;s flagship fellowship retreat for <b>all club Presidents together with the Rotaract District Committee</b>. The goal is simple, though it may be the part of leadership nobody else teaches: relaxed time to bond, laugh and recharge, so the people leading clubs actually trust each other. Expect icebreakers, team games, a cultural fellowship evening around the campfire &mdash; then a calm morning activity and a leadership reflection session before everyone heads home.</p>
          </div>

          <div className="de-sec">
            <h4>Day-by-day breakdown</h4>
            <div className="de-seg">
              <div className="seg"><b>🌅 Day 1 &mdash; Arrival &amp; fun</b><span>Arrival and registration, opening ceremony, icebreakers, team-building games, then the President Night cultural fellowship, followed by overnight stay.</span></div>
              <div className="seg"><b>🌄 Day 2 &mdash; Reflect &amp; close</b><span>Early-morning outdoor activity, a leadership reflection session, breakfast, closing ceremony and departure.</span></div>
              <div className="seg"><b>🍽️ Food plan</b><span>Five meals in total &mdash; Day 1: hi-tea, fellowship snacks and dinner; Day 2: breakfast and lunch. Non-veg included at least once, drinking water always available.</span></div>
            </div>
          </div>

          <div className="de-sec">
            <h4>What your club must arrange</h4>
            <div className="de-checks">
              <div className="de-check">A safe, clean, eco-friendly resort, hotel or campsite</div>
              <div className="de-check">A hall for 250&ndash;300 people (theater-style or round tables)</div>
              <div className="de-check">Spaces for both indoor sessions and outdoor games</div>
              <div className="de-check">Registration &amp; welcome desk on arrival</div>
              <div className="de-check">Campfire or evening gathering space</div>
              <div className="de-check">Power backup and uninterrupted lighting</div>
              <div className="de-check">Branding: banners, selfie standee, backdrop, photo stand &amp; welcome gate</div>
              <div className="de-check">LED display screen with a technician, plus a sound system (2 wireless + 2 desk mics)</div>
              <div className="de-check">Professional photographer / videographer</div>
              <div className="de-check">Overnight shared accommodation plus all 5 meals &amp; safe drinking water</div>
              <div className="de-check">Delegate kit: ID card + lanyard, schedule, notebook &amp; pen, badge or ribbon</div>
              <div className="de-check">Theme-consistent stage and venue decoration</div>
            </div>
          </div>

          <div className="de-sec">
            <h4>Who does what &mdash; RDC vs Host Club</h4>
            <table className="de-table">
              <thead><tr><th>Responsibility area</th><th className="de-rdc">RDC</th><th className="de-host">Host club</th></tr></thead>
              <tbody>
                <tr><td>Venue, food, accommodation, delegate kits</td><td className="de-rdc">&mdash;</td><td className="de-host">✅</td></tr>
                <tr><td>Event schedule, agenda &amp; Leadership Circle sessions</td><td className="de-rdc">✅</td><td className="de-host">&mdash;</td></tr>
                <tr><td>Guests &amp; session coordination</td><td className="de-rdc">✅</td><td className="de-host">&mdash;</td></tr>
                <tr><td>Registration, hospitality &amp; on-site support</td><td className="de-rdc">&mdash;</td><td className="de-host">✅</td></tr>
                <tr><td>Fundraising &amp; event budgeting</td><td className="de-rdc">Guides</td><td className="de-host">Leads</td></tr>
                <tr><td>Co-hosting club management</td><td className="de-rdc">Supervises</td><td className="de-host">Runs</td></tr>
                <tr><td>All other logistics</td><td className="de-rdc">&mdash;</td><td className="de-host">✅</td></tr>
              </tbody>
            </table>
          </div>

          <div className="de-sec">
            <h4>What to submit</h4>
            <ul className="de-submit">
              <li><span><b>Expression of Interest (EOI)</b> on your official club letterhead</span></li>
              <li><span><b>Minutes of the general meeting</b> confirming the hosting decision, signed by President and Secretary</span></li>
              <li><span>Your <b>completed bidding form</b> plus a <b>detailed budget proposal</b> and a fundraising plan</span></li>
              <li><span><b>Venue proposal</b> with photographs and a location map, plus the venue&rsquo;s authorization letter</span></li>
              <li><span><b>Contact person</b> details, and the final bid in PDF format</span></li>
            </ul>
          </div>

          <div className="de-cta">
            <div className="emails">
              <b>Deadline: 25 June 2026, 11:59 PM</b><br />
              Submit PDF to <a href="mailto:rtrprakash3292@gmail.com, rtrsurajbhandari@gmail.com">rtrprakash3292@gmail.com</a> &amp; <a href="mailto:rtrsurajbhandari@gmail.com">rtrsurajbhandari@gmail.com</a>
            </div>
            <div className="dl">
              <a className="de-dl-btn" href="media/guides/President%20Night%20Bidding%20document.pdf" download>📄 Bidding Document (PDF)</a>
              <a className="de-dl-btn" href="media/guides/Bidding%20Form%20(1).docx" download>📝 Bidding Form (DOCX)</a>
            </div>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 28 }}>
        <h3>Ground rules that apply to every bid</h3>
        <div className="de-rules-grid">
          <div className="de-rule"><b>📜 Venue permission letter</b>Every bid must include an authorization letter from the venue confirming it is available and cleared for the event.</div>
          <div className="de-rule"><b>🤝 You own your promises</b>The bidding club is individually responsible for every commitment made in its proposal.</div>
          <div className="de-rule"><b>🚫 No silent changes</b>Venue, date, schedule, budget, food, speakers or fees cannot change without prior written RDC approval.</div>
          <div className="de-rule"><b>🛡️ Safe &amp; suitable venue</b>The venue must be safe, hygienic and accessible; the RDC can inspect it or ask for evidence before final approval.</div>
          <div className="de-rule"><b>🍽️ Hospitality standards</b>Food must be hygienic, meals served on time, and dietary requirements accommodated where feasible.</div>
          <div className="de-rule"><b>⚠️ Non-compliance costs</b>Warnings, restriction or disqualification from hosting future district events follow until matters are fixed.</div>
        </div>
        <h3 style={{ marginTop: 28 }}>Bidding documents &amp; forms</h3>
        <p className="de-lead" style={{ marginBottom: 16 }}>Official files every club admin can access anytime &mdash; same documents live in the <i>guides</i> folder.</p>
        <div className="de-files">
          <a className="de-file" href="media/guides/1st%20PS%20Meet%20Bidding%20document.pdf" download><span className="ic">📄</span><span><b>1st PS Meet &mdash; Bidding Document</b><span>PDF · full criteria, logistics &amp; terms</span></span></a>
          <a className="de-file" href="media/guides/Bidding%20Form.docx" download><span className="ic">📝</span><span><b>1st PS Meet &mdash; Bidding Form</b><span>DOCX · fill-in form for your proposal</span></span></a>
          <a className="de-file" href="media/guides/President%20Night%20Bidding%20document.pdf" download><span className="ic">📄</span><span><b>President Night &mdash; Bidding Document</b><span>PDF · full criteria &amp; requirements</span></span></a>
          <a className="de-file" href="media/guides/Bidding%20Form%20(1).docx" download><span className="ic">📝</span><span><b>President Night &mdash; Bidding Form</b><span>DOCX · fill-in form with budget tables</span></span></a>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  /* ---- Session ---- */
  const [session, setSession] = useState(readAdminSession);
  const [loginTab, setLoginTab] = useState('club');
  const [clubSelect, setClubSelect] = useState(Object.keys(CLUB_DIRECTORY)[0]);
  const [clubPw, setClubPw] = useState('');
  const [zonalPw, setZonalPw] = useState('');
  const [clubErr, setClubErr] = useState(false);
  const [zonalErr, setZonalErr] = useState(false);
  const [view, setView] = useState(() => {
    const s = readAdminSession();
    return s && s.type === 'zonal' ? 'guides' : 'projects';
  });
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  const isZonal = !!(session && session.type === 'zonal');
  const currentClub = session && session.type === 'club' ? session.slug : null;

  const showToast = useCallback((msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  }, []);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  /* body class for the fixed sidebar */
  useEffect(() => {
    if (session) document.body.classList.add('has-sidebar');
    else document.body.classList.remove('has-sidebar');
    return () => document.body.classList.remove('has-sidebar');
  }, [session]);

  /* ---- Auth ---- */
  const doLogin = (s) => {
    try { localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(s)); } catch (e) { console.warn('session save failed', e); }
    setSession(s);
    setView(s.type === 'zonal' ? 'guides' : 'projects');
    setClubPw(''); setZonalPw(''); setClubErr(false); setZonalErr(false);
  };

  const onClubLogin = (e) => {
    e.preventDefault();
    if (CLUB_CREDENTIALS[clubSelect] && CLUB_CREDENTIALS[clubSelect] === clubPw) {
      doLogin({ type: 'club', slug: clubSelect });
    } else {
      setClubErr(true);
    }
  };

  const onZonalLogin = () => {
    if (zonalPw === ZONAL_PASSWORD) {
      doLogin({ type: 'zonal' });
    } else {
      setZonalErr(true);
    }
  };

  const doLogout = () => {
    try { localStorage.removeItem(ADMIN_SESSION_KEY); } catch { /* ignore */ }
    setSession(null);
    setView('projects');
    setClubPw(''); setZonalPw(''); setClubErr(false); setZonalErr(false);
  };

  /* ---- Projects ---- */
  const [projects, setProjects] = useState([]);
  const [projTotal, setProjTotal] = useState(0);
  const [projPage, setProjPage] = useState(0);
  const [projSearch, setProjSearch] = useState('');
  const [projLoading, setProjLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [pf, setPf] = useState(emptyProjectForm());
  const [cover, setCover] = useState({ src: '', value: '', code: '' });
  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const formPanelRef = useRef(null);

  const renderProjectList = useCallback(async () => {
    if (!currentClub) return;
    setProjLoading(true);
    const q = projSearch.trim().toLowerCase();
    let rows, total;
    if (q) {
      const all = await ZONE7_DB.getProjects(currentClub, { limit: 500 });
      rows = all.filter(p => `${p.title} ${p.project_code} ${p.category}`.toLowerCase().includes(q));
      total = rows.length;
    } else {
      const page = await ZONE7_DB.getProjectsPage(currentClub, projPage * PROJ_PAGE_SIZE, PROJ_PAGE_SIZE);
      rows = page.rows;
      total = page.total;
    }
    setProjects(rows);
    setProjTotal(total);
    setProjLoading(false);
  }, [currentClub, projSearch, projPage]);

  useEffect(() => { if (currentClub) renderProjectList(); }, [currentClub, renderProjectList]);

  const resetForm = useCallback(() => {
    setEditingId(null);
    setSelectedId(null);
    setGalleryImages([]);
    setPf(emptyProjectForm());
    setCover({ src: '', value: '', code: '' });
  }, []);

  const loadProjectIntoForm = async (id) => {
    const p = await ZONE7_DB.getProject(currentClub, id);
    if (!p) return;
    setEditingId(id);
    setSelectedId(id);
    setGalleryImages([...(p.gallery || [])]);
    setPf({ title: p.title || '', category: p.category || '', date: p.date || '', location: p.location || '', summary: p.summary || '', body: p.body || '' });
    setCover({ src: p.cover || '', value: p.cover || '', code: p.project_code || '' });
    if (formPanelRef.current) window.scrollTo({ top: formPanelRef.current.offsetTop - 90, behavior: 'smooth' });
  };

  const onCoverFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    setCover(prev => ({ ...prev, src: URL.createObjectURL(file) }));
    try {
      const url = await zone7UploadImage(file, 'covers', 1600, 0.82);
      setCover(prev => ({ ...prev, src: url, value: url }));
    } catch (err) {
      console.error(err);
      showToast('Cover upload failed, try again.');
      setCover(prev => ({ ...prev, src: '', value: '' }));
    }
  };

  const onGalleryFiles = async (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    e.target.value = '';
    for (const file of files) {
      try {
        const url = await zone7UploadImage(file, 'gallery', 1200, 0.78);
        setGalleryImages(prev => [...prev, url]);
      } catch (err) {
        console.error(err);
        showToast(`Upload failed for ${file.name}, skipped.`);
      }
    }
  };

  const removeGallery = (i) => setGalleryImages(prev => prev.filter((_, idx) => idx !== i));

  const onProjectSubmit = async (e) => {
    e.preventDefault();
    const title = pf.title.trim();
    if (!title) return;
    const uid = crypto.randomUUID ? crypto.randomUUID().replace(/-/g, '').slice(0, 16) : Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const id = editingId || (zone7Slugify(title) + '-' + uid);
    const project = {
      id, title,
      category: pf.category.trim(),
      date: pf.date,
      location: pf.location.trim(),
      summary: pf.summary.trim(),
      body: pf.body.trim(),
      cover: cover.value || '',
      gallery: galleryImages,
      project_code: cover.code || ''
    };
    try {
      if (!editingId) {
        let attempts = 0;
        while (true) {
          project.project_code = await ZONE7_DB.nextProjectCode(currentClub);
          try {
            await ZONE7_DB.saveProject(currentClub, project);
            break;
          } catch (err) {
            if (attempts++ < 3 && /409|duplicate/i.test(err.message)) continue;
            throw err;
          }
        }
      } else {
        await ZONE7_DB.saveProject(currentClub, project);
      }
      showToast(`Project saved ✓ (${project.project_code})`);
      await renderProjectList();
      resetForm();
    } catch (err) {
      console.error(err);
      showToast('Save failed, check your Supabase setup.');
    }
  };

  const onDeleteProject = async () => {
    if (!editingId) return;
    if (confirm("Delete this project? This can't be undone.")) {
      try {
        await ZONE7_DB.deleteProject(currentClub, editingId);
        showToast('Project deleted');
        await renderProjectList();
        resetForm();
      } catch (err) {
        console.error(err);
        showToast('Delete failed, check your Supabase setup.');
      }
    }
  };

  /* ---- Club Page: BOD + About/Vision/Goals ---- */
  const [cpBoard, setCpBoard] = useState([]);
  const [cpGoals, setCpGoals] = useState([]);
  const [cpAbout, setCpAbout] = useState('');
  const [cpVision, setCpVision] = useState('');
  const [cpSaving, setCpSaving] = useState(false);
  const boardPhotoIdx = useRef(null);
  const boardPhotoInputRef = useRef(null);

  const loadClubPage = useCallback(async () => {
    if (!currentClub) return;
    const p = await ZONE7_DB.getClubProfile(currentClub);
    setCpBoard((p && p.board) || []);
    setCpGoals((p && p.goals) || []);
    setCpAbout((p && p.about) || '');
    setCpVision((p && p.vision) || '');
  }, [currentClub]);

  useEffect(() => { if (currentClub) loadClubPage(); }, [currentClub, loadClubPage]);

  const onBoardPhoto = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file || boardPhotoIdx.current == null) return;
    const idx = boardPhotoIdx.current;
    try {
      const dataUrl = await zone7ReadImage(file, 500, 0.85);
      setCpBoard(prev => prev.map((m, i) => i === idx ? { ...m, photo: dataUrl } : m));
    } catch (err) {
      console.error(err);
      showToast('Photo upload failed, try again.');
    }
  };

  const onCpSave = async () => {
    setCpSaving(true);
    try {
      await ZONE7_DB.saveClubProfile(currentClub, {
        board: cpBoard, goals: cpGoals,
        about: cpAbout.trim(), vision: cpVision.trim()
      });
      showToast('Club page saved ✓');
    } catch (err) {
      console.error(err);
      showToast('Save failed, check your Supabase setup.');
    } finally {
      setCpSaving(false);
    }
  };

  /* ---- District Barometer ---- */
  const [baroMode, setBaroMode] = useState('serious');
  const [baroCheckedItems, setBaroCheckedItems] = useState([]);
  const [baroLinkedProjects, setBaroLinkedProjects] = useState({});
  const [baroDocuments, setBaroDocuments] = useState({});
  const [baroQuickChecked, setBaroQuickChecked] = useState([]);
  const [baroCriteria, setBaroCriteria] = useState([]);
  const [baroClubProjects, setBaroClubProjects] = useState([]);
  const [baroAutoIds, setBaroAutoIds] = useState(new Set());
  const [baroAccOpen, setBaroAccOpen] = useState({});
  const [baroSaving, setBaroSaving] = useState(false);
  const baroDocRefs = useRef({});

  const loadBarometer = useCallback(async () => {
    if (!currentClub) return;
    setBaroCriteria(zone7GetBarometer(currentClub));
    try {
      const [row, projects] = await Promise.all([
        ZONE7_DB.getBarometer(currentClub),
        ZONE7_DB.getProjects(currentClub, { limit: 500, full: true })
      ]);
      setBaroClubProjects(projects);
      const checked = [];
      const linked = {};
      const docs = {};
      const raw = (row && row.checked_items) || [];
      raw.forEach(entry => {
        if (typeof entry === 'object' && entry !== null) {
          checked.push(Number(entry.id));
          if (entry.projects && entry.projects.length) linked[entry.id] = entry.projects;
          else if (entry.projId) linked[entry.id] = [{ id: entry.projId, title: entry.projTitle || '', code: entry.projCode || '' }];
          if (entry.doc) docs[entry.id] = entry.doc;
          else if (entry.minutes) docs[entry.id] = entry.minutes;
        } else {
          checked.push(Number(entry));
        }
      });
      setBaroCheckedItems(checked);
      setBaroLinkedProjects(linked);
      setBaroDocuments(docs);
      setBaroQuickChecked((row && row.checked_items_quick) ? row.checked_items_quick.map(Number) : []);
      setBaroAutoIds(zone7AutoCheck(projects));
    } catch (err) {
      console.warn('barometer data load failed:', err);
    }
  }, [currentClub]);

  useEffect(() => { if (currentClub) loadBarometer(); }, [currentClub, loadBarometer]);

  const baroIsDone = useCallback((id) => {
    if (baroAutoIds.has(id)) return true;
    if (baroMode === 'quick') return baroQuickChecked.includes(id);
    if (BARO_NEEDS_PROJECT.has(id)) {
      const linked = baroLinkedProjects[id] || [];
      if (linked.length < baroMinFor(id)) return false;
      if (BARO_NEEDS_DOC.has(id) && !baroDocuments[id]) return false;
      return true;
    }
    return baroCheckedItems.includes(id);
  }, [baroAutoIds, baroMode, baroQuickChecked, baroLinkedProjects, baroDocuments, baroCheckedItems]);

  const baroScore = useMemo(() => {
    const allChecked = new Set(baroCriteria.filter(item => baroIsDone(item.id)).map(item => item.id));
    const total = baroCriteria.reduce((sum, item) => sum + (allChecked.has(item.id) ? item.points : 0), 0);
    const maxTotal = baroCriteria.reduce((sum, item) => sum + item.points, 0);
    const pct = maxTotal ? Math.round((total / maxTotal) * 100) : 0;
    return { total, maxTotal, allChecked, pct, badge: zone7BarometerCategory(pct) };
  }, [baroCriteria, baroIsDone]);

  const toggleQuick = (id) => setBaroQuickChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleSelf = (id) => setBaroCheckedItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const onProjSelect = (id, value) => {
    if (value) {
      const p = baroClubProjects.find(x => x.id === value);
      setBaroLinkedProjects(prev => ({ ...prev, [id]: [{ id: value, title: p ? p.title : '', code: p ? (p.project_code || '') : '' }] }));
    } else {
      setBaroLinkedProjects(prev => {
        const n = { ...prev };
        delete n[id];
        return n;
      });
    }
  };

  const toggleMulti = (id, p) => {
    setBaroLinkedProjects(prev => {
      const cur = [...(prev[id] || [])];
      const entry = { id: p.id, title: p.title, code: p.project_code || '' };
      const idx = cur.findIndex(l => l.id === entry.id);
      if (idx > -1) cur.splice(idx, 1); else cur.push(entry);
      const n = { ...prev };
      if (cur.length) n[id] = cur; else delete n[id];
      return n;
    });
  };

  const toggleAcc = (id) => setBaroAccOpen(prev => ({ ...prev, [id]: !prev[id] }));

  const onBaroDocFile = async (id, e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const dataUrl = await zone7ReadFile(file);
      setBaroDocuments(prev => ({ ...prev, [id]: { name: file.name, data: dataUrl } }));
    } catch (err) {
      console.error(err);
      showToast('Document read failed.');
    }
  };

  const removeBaroDoc = (id) => setBaroDocuments(prev => {
    const n = { ...prev };
    delete n[id];
    return n;
  });

  const onBaroSave = async () => {
    setBaroSaving(true);
    try {
      if (baroMode === 'quick') {
        await ZONE7_DB.saveBarometerQuick(currentClub, [...new Set(baroQuickChecked)]);
      } else {
        const ids = new Set([
          ...baroCheckedItems,
          ...Object.keys(baroLinkedProjects).map(Number),
          ...Object.keys(baroDocuments).map(Number)
        ]);
        const toSave = [...ids].map(id => {
          const entry = { id };
          if (baroLinkedProjects[id]) entry.projects = baroLinkedProjects[id];
          if (baroDocuments[id]) entry.doc = baroDocuments[id];
          return entry;
        });
        await ZONE7_DB.saveBarometer(currentClub, toSave);
      }
      showToast(`${baroMode === 'quick' ? 'Quick' : 'Full'} barometer saved ✓`);
    } catch (err) {
      console.error(err);
      showToast('Save failed, check your Supabase setup.');
    } finally {
      setBaroSaving(false);
    }
  };

  const onBaroPdf = () => {
    const { total, maxTotal, allChecked, badge } = baroScore;
    const clubName = CLUB_DIRECTORY[currentClub] ? CLUB_DIRECTORY[currentClub].name : currentClub;
    const isUni = UNIVERSITY_CLUBS.includes(currentClub);

    const rows = BAROMETER_GROUPS.map(grp => {
      const items = baroCriteria.filter(item => item.group === grp.key);
      if (!items.length) return '';
      const groupRows = items.map(item => {
        const linked = baroMode === 'quick' ? [] : (baroLinkedProjects[item.id] || []);
        const doc = baroMode === 'quick' ? null : baroDocuments[item.id];
        const done = allChecked.has(item.id);
        const proof = [
          linked.length ? `🔗 ${linked.map(l => zone7Esc(l.code || l.title)).join(', ')}` : '',
          doc ? `📄 ${zone7Esc(doc.name)}` : ''
        ].filter(Boolean).join('<br>');
        return `
        <tr>
          <td style="text-align:center;">${item.id}</td>
          <td>${zone7Esc(item.text)}${proof ? `<br><span style="font-size:0.75rem; color:#A80F52; font-weight:600;">${proof}</span>` : ''}</td>
          <td style="text-align:center;">${item.points}</td>
          <td style="text-align:center;">${done ? '✓' : ''}</td>
          <td style="font-size:0.78rem; color:#555;">${zone7Esc(item.verifier)}</td>
        </tr>`;
      }).join('');
      return `<tr><td colspan="5" style="background:#FFF8EF; font-weight:700; color:#A80F52;">${grp.icon} ${grp.label}</td></tr>${groupRows}`;
    }).join('');

    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>${clubName}, District Barometer</title>
      <style>
        html{font-family:Arial,Helvetica,sans-serif; padding:30px; color:#1B1836;}
        h1{font-size:1.4rem; margin-bottom:2px;}
        h2{font-size:1rem; font-weight:600; color:#A80F52; margin-bottom:18px;}
        table{width:100%; border-collapse:collapse; font-size:0.82rem;}
        th,td{border:1px solid #ccc; padding:7px 9px; vertical-align:top;}
        th{background:#1B1836; color:#fff; text-align:left;}
        .summary{margin:14px 0 20px; padding:14px 18px; background:#FFF8EF; border:1px solid #eee; border-radius:8px;}
        .summary b{color:#A80F52;}
        @media print{ .noprint{display:none;} }
      </style>
      </head><body>
      <h1>Rotaract District 3292, Nepal-Bhutan</h1>
      <h2>Barometer for ${isUni ? 'University' : 'Community'} Based Clubs, RY 2026-27, ${zone7Esc(clubName)} (${baroMode === 'quick' ? 'Quick Check' : 'Full Barometer'})</h2>
      <div class="summary">
        <b>${total} / ${maxTotal} points</b>, Projected Recognition Category: <b>${badge}</b><br>
        Generated ${new Date().toLocaleDateString()} · Self-reported by the club; subject to ZRR / Recognition Committee verification.
      </div>
      <table>
        <tr><th>#</th><th>Criteria</th><th>Points</th><th>Done</th><th>Verified By</th></tr>
        ${rows}
      </table>
      <p class="noprint" style="margin-top:22px;"><button onclick="window.print()">Print / Save as PDF</button></p>
      </body></html>
    `);
    win.document.close();
  };

  /* ---- Dues Calculator ---- */
  const [duesMembers, setDuesMembers] = useState('');
  const [duesRate, setDuesRate] = useState('133.5');
  const dues = useMemo(() => {
    const isUni = UNIVERSITY_CLUBS.includes(currentClub);
    const rate = isUni ? 5 : 8;
    const parseNum = (v) => {
      const cleaned = String(v).replace(/[^\d.-]/g, '');
      return cleaned === '' ? NaN : parseFloat(cleaned);
    };
    const n = Math.max(0, Math.round(parseNum(duesMembers)) || 0);
    const fx = Math.max(0, parseNum(duesRate) || 0);
    const ri = n * rate;
    const riNpr = Math.round(ri * fx);
    const dist = n * 200;
    return { isUni, rate, n, ri, riNpr, dist };
  }, [currentClub, duesMembers, duesRate]);

  /* ---- Zone Events ---- */
  const [events, setEvents] = useState([]);
  const [evForm, setEvForm] = useState(emptyEventForm());
  const [evEditing, setEvEditing] = useState(false);
  const editingEventId = evForm.id || null;

  const renderEventList = useCallback(async () => {
    const rows = await ZONE7_DB.getEvents();
    setEvents(rows);
  }, []);

  useEffect(() => { renderEventList(); }, [renderEventList]);

  const onEvClick = (ev) => {
    setEvEditing(true);
    setEvForm({
      id: ev.id || '',
      title: ev.title || '',
      date: (ev.event_date && ev.event_date !== 'TBD') ? ev.event_date : '',
      desc: ev.description || '',
      link: ev.rsvp_link || ''
    });
  };

  const resetEventForm = () => { setEvEditing(false); setEvForm(emptyEventForm()); };

  const onSaveEvent = async () => {
    const title = evForm.title.trim();
    if (!title) return showToast('Event title is required');
    const id = editingEventId || (zone7Slugify(title) + '-' + Date.now().toString(36));
    try {
      await ZONE7_DB.saveEvent({
        id, title,
        event_date: evForm.date || 'TBD',
        description: evForm.desc.trim(),
        rsvp_link: evForm.link.trim()
      });
      showToast('Event saved ✓');
      await renderEventList();
      resetEventForm();
    } catch (err) {
      console.error(err);
      showToast('Save failed, check your Supabase setup.');
    }
  };

  const onDeleteEvent = async () => {
    if (!editingEventId) return;
    if (confirm('Delete this event?')) {
      try {
        await ZONE7_DB.deleteEvent(editingEventId);
        showToast('Event deleted');
        await renderEventList();
        resetEventForm();
      } catch (err) {
        console.error(err);
        showToast('Delete failed, check your Supabase setup.');
      }
    }
  };

  /* ---- Guides (zonal) ---- */
  const [guides, setGuides] = useState([]);
  const [gForm, setGForm] = useState({ title: '', category: '', desc: '' });
  const [gUploadMsg, setGUploadMsg] = useState(null);

  const renderGuideList = useCallback(async () => {
    const rows = await ZONE7_DB.getGuides();
    setGuides(rows);
  }, []);

  useEffect(() => { if (isZonal) renderGuideList(); }, [isZonal, renderGuideList]);

  const onGuideDelete = async (id) => {
    if (confirm('Delete this guide?')) {
      await ZONE7_DB.deleteGuide(id);
      showToast('Guide deleted');
      renderGuideList();
    }
  };

  const onGuideUpload = async () => {
    const title = gForm.title.trim();
    const file = gFileRef.current && gFileRef.current.files[0];
    if (!title || !file) {
      setGUploadMsg({ text: 'Title and a file are required.', color: 'var(--magenta-deep)' });
      return;
    }
    setGUploadMsg({ text: 'Uploading…', color: 'inherit' });
    try {
      const fileUrl = await ZONE7_DB.uploadGuideFile(file);
      const uid = crypto.randomUUID ? crypto.randomUUID().replace(/-/g, '').slice(0, 16) : Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      const id = zone7Slugify(title) + '-' + uid;
      await ZONE7_DB.saveGuide({
        id, title,
        category: gForm.category.trim() || 'Other',
        description: gForm.desc.trim(),
        file_name: file.name,
        file_url: fileUrl
      });
      setGForm({ title: '', category: '', desc: '' });
      if (gFileRef.current) gFileRef.current.value = '';
      setGUploadMsg({ text: 'Uploaded ✓', color: '#1c8a4d' });
      showToast('Guide uploaded ✓');
      renderGuideList();
    } catch (err) {
      console.error(err);
      setGUploadMsg({ text: 'Upload failed, check your Supabase setup.', color: 'var(--magenta-deep)' });
    }
  };
  const gFileRef = useRef(null);

  /* ---- ZRR History (zonal) ---- */
  const [zrrs, setZrrs] = useState([]);
  const [zrrForm, setZrrForm] = useState(emptyGuestForm());
  const [zrrPhoto, setZrrPhoto] = useState('');
  const [zrrSaving, setZrrSaving] = useState(false);
  const editingZrrId = zrrForm.id || null;
  const [zrrEditing, setZrrEditing] = useState(false);
  const zrrPhotoInputRef = useRef(null);

  const renderZRRList = useCallback(async () => {
    const rows = await ZONE7_DB.getZRRs();
    setZrrs(rows);
  }, []);

  useEffect(() => { if (isZonal) renderZRRList(); }, [isZonal, renderZRRList]);

  const loadZrrIntoForm = (z) => {
    setZrrEditing(true);
    setZrrForm({ id: z.id || '', name: z.name || '', years: z.years || '', club: z.club || '', bio: z.bio || '', isCurrent: !!z.is_current });
    setZrrPhoto(z.photo || '');
  };

  const resetZrrForm = () => { setZrrForm(emptyGuestForm()); setZrrPhoto(''); setZrrEditing(false); };

  const onZrrPhoto = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      setZrrPhoto(await zone7ReadImage(file, 500, 0.85));
    } catch (err) {
      console.error(err);
      showToast('Photo upload failed.');
    }
  };

  const onZrrSave = async () => {
    const name = zrrForm.name.trim();
    const years = zrrForm.years.trim();
    if (!name || !years) { showToast('Name and Rotary Year are required'); return; }
    setZrrSaving(true);
    try {
      const existing = await ZONE7_DB.getZRRs();
      const id = editingZrrId || (zone7Slugify(name) + '-' + Date.now().toString(36));
      const isCurrent = !!zrrForm.isCurrent;
      if (isCurrent) {
        for (const z of existing) {
          if (z.id !== id && z.is_current) {
            await ZONE7_DB.saveZRR({ ...z, is_current: false });
          }
        }
      }
      const maxOrder = existing.reduce((m, z) => Math.max(m, z.sort_order || 0), 0);
      const sortOrder = editingZrrId
        ? (existing.find(z => z.id === id)?.sort_order ?? maxOrder + 1)
        : maxOrder + 1;
      await ZONE7_DB.saveZRR({
        id, name, years, is_current: isCurrent,
        club: zrrForm.club.trim(),
        bio: zrrForm.bio.trim(),
        photo: zrrPhoto,
        sort_order: sortOrder
      });
      showToast('ZRR saved ✓');
      await renderZRRList();
      resetZrrForm();
    } catch (err) {
      console.error(err);
      showToast('Save failed, check your Supabase setup.');
    } finally {
      setZrrSaving(false);
    }
  };

  const onZrrDelete = async () => {
    if (!editingZrrId) return;
    if (confirm("Remove this ZRR from the timeline? This can't be undone.")) {
      try {
        await ZONE7_DB.deleteZRR(editingZrrId);
        showToast('ZRR removed');
        await renderZRRList();
        resetZrrForm();
      } catch (err) {
        console.error(err);
        showToast('Delete failed, check your Supabase setup.');
      }
    }
  };

  /* ---- Zonal Team / Leadership (zonal) ---- */
  const [leaders, setLeaders] = useState([]);
  const [leaderForm, setLeaderForm] = useState(emptyLeaderForm());
  const [leaderPhoto, setLeaderPhoto] = useState('');
  const [leaderSaving, setLeaderSaving] = useState(false);
  const editingLeaderId = leaderForm.id || null;
  const [leaderEditing, setLeaderEditing] = useState(false);
  const leaderPhotoInputRef = useRef(null);

  const renderLeaderList = useCallback(async () => {
    const rows = await ZONE7_DB.getLeadership();
    setLeaders(rows);
  }, []);

  useEffect(() => { if (isZonal) renderLeaderList(); }, [isZonal, renderLeaderList]);

  const loadLeaderIntoForm = (l) => {
    setLeaderEditing(true);
    setLeaderForm({ id: l.id || '', role: l.role || '', roleFull: l.role_full || '', name: l.name || '', club: l.club || '', bio: l.bio || '' });
    setLeaderPhoto(l.photo || '');
  };

  const resetLeaderForm = () => { setLeaderForm(emptyLeaderForm()); setLeaderPhoto(''); setLeaderEditing(false); };

  const onLeaderPhoto = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      setLeaderPhoto(await zone7ReadImage(file, 500, 0.85));
    } catch (err) {
      console.error(err);
      showToast('Photo upload failed.');
    }
  };

  const onLeaderSave = async () => {
    const name = leaderForm.name.trim();
    const role = leaderForm.role.trim();
    if (!name || !role) { showToast('Name and role code are required'); return; }
    setLeaderSaving(true);
    try {
      const existing = await ZONE7_DB.getLeadership();
      const id = editingLeaderId || ('leader-' + zone7Slugify(role) + '-' + Date.now().toString(36));
      const maxOrder = existing.reduce((m, l) => Math.max(m, l.sort_order || 0), 0);
      const sortOrder = editingLeaderId
        ? (existing.find(l => l.id === id)?.sort_order ?? maxOrder + 1)
        : maxOrder + 1;
      await ZONE7_DB.saveLeader({
        id, role,
        role_full: leaderForm.roleFull.trim(),
        name,
        club: leaderForm.club.trim(),
        bio: leaderForm.bio.trim(),
        photo: leaderPhoto,
        sort_order: sortOrder
      });
      showToast('Team member saved ✓');
      await renderLeaderList();
      resetLeaderForm();
    } catch (err) {
      console.error(err);
      showToast('Save failed, check your Supabase setup.');
    } finally {
      setLeaderSaving(false);
    }
  };

  const onLeaderDelete = async () => {
    if (!editingLeaderId) return;
    if (confirm('Remove this team member?')) {
      try {
        await ZONE7_DB.deleteLeader(editingLeaderId);
        showToast('Member removed');
        await renderLeaderList();
        resetLeaderForm();
      } catch (err) {
        console.error(err);
        showToast('Delete failed, check your Supabase setup.');
      }
    }
  };

  /* ---- Join Requests: guests + membership apps ---- */
  const [guests, setGuests] = useState([]);
  const [apps, setApps] = useState([]);

  const renderGuestList = useCallback(async () => {
    try {
      let requests = await ZONE7_DB.getGuestRequests();
      if (currentClub) requests = requests.filter(r => zone7PrefersClub(r.preferred_club, currentClub));
      setGuests(requests);
    } catch { setGuests([]); }
  }, [currentClub]);

  const renderApplicationsList = useCallback(async () => {
    try {
      let list = await ZONE7_DB.getMembershipApplications();
      if (currentClub) list = list.filter(a => zone7PrefersClub(a.preferred_club, currentClub));
      setApps(list);
    } catch { setApps([]); }
  }, [currentClub]);

  useEffect(() => {
    if (session) { renderGuestList(); renderApplicationsList(); }
  }, [session, renderGuestList, renderApplicationsList]);

  const onGuestStatus = async (id, status) => {
    try {
      await ZONE7_DB.setGuestRequestStatus(id, status);
      showToast('Request marked ' + status);
      renderGuestList();
      renderApplicationsList();
    } catch { showToast('Update failed, check your Supabase setup.'); }
  };

  const onGuestDelete = async (id) => {
    if (!confirm('Delete this guest request?')) return;
    try {
      await ZONE7_DB.deleteGuestRequest(id);
      showToast('Request deleted');
      renderGuestList();
      renderApplicationsList();
    } catch { showToast('Delete failed, check your Supabase setup.'); }
  };

  const onAppStatus = async (id, status) => {
    try {
      await ZONE7_DB.setMembershipApplicationStatus(id, status);
      showToast('Application marked ' + status);
      renderApplicationsList();
      renderGuestList();
    } catch { showToast('Update failed, check your Supabase setup.'); }
  };

  const onAppDelete = async (id) => {
    if (!confirm('Delete this application?')) return;
    try {
      await ZONE7_DB.deleteMembershipApplication(id);
      showToast('Application deleted');
      renderApplicationsList();
      renderGuestList();
    } catch { showToast('Delete failed, check your Supabase setup.'); }
  };

  const STATUS_STYLE = {
    new: ['#fff', '#E1196E'],
    contacted: ['#FFF4E0', '#B26A00'],
    matched: ['#E6F4EA', '#1E7D46'],
    onboarded: ['#E6F4EA', '#1E7D46']
  };

  /* ---- Analytics ---- */
  const [analyticsData, setAnalyticsData] = useState(null);

  const loadAnalytics = useCallback(async () => {
    try {
      const { rows: all, total } = await ZONE7_DB.getAllProjects({ withCount: true });
      const counts = {};
      Object.keys(CLUB_DIRECTORY).forEach(s => { counts[s] = 0; });
      all.forEach(p => { if (counts[p.club_slug] !== undefined) counts[p.club_slug]++; });
      const eventsRows = await ZONE7_DB.getEvents();
      setAnalyticsData({ all, total: total ?? all.length, counts, events: eventsRows.length });
    } catch (err) {
      console.warn('analytics load failed:', err);
    }
  }, []);

  useEffect(() => { if (session) loadAnalytics(); }, [session, loadAnalytics]);

  /* ---- Meeting Minutes ---- */
  const [mm, setMm] = useState(emptyMinutes());
  const [mmStrLists, setMmStrLists] = useState({ open: [], happy: [], agenda: [], info: [] });
  const [mmDiscItems, setMmDiscItems] = useState([]);
  const [mmRemarks, setMmRemarks] = useState([]);
  const [mmEditId, setMmEditId] = useState(null);
  const [mmSaved, setMmSaved] = useState([]);
  const [mmDayAuto, setMmDayAuto] = useState(true);
  const [mmSaving, setMmSaving] = useState(false);

  const renderMMSaved = useCallback(async () => {
    if (!currentClub) return;
    const rows = await ZONE7_DB.getMinutes(currentClub);
    setMmSaved(rows);
  }, [currentClub]);

  const prefillMMLetterhead = useCallback(async () => {
    if (!currentClub || mmEditId) return;
    try {
      const rows = await ZONE7_DB.getMinutes(currentClub);
      const latest = rows[0];
      const lh = CLUB_LETTERHEAD[currentClub] || {};
      const profile = await ZONE7_DB.getClubProfile(currentClub);
      const board = (profile && profile.board) || [];
      const president = board.find(b => /president/i.test(b.role || '') && !/vice/i.test(b.role || ''));
      const secretary = board.find(b => /secretary/i.test(b.role || '') && !/joint/i.test(b.role || ''));
      setMm(prev => ({
        ...prev,
        sponsor: (latest && latest.data.sponsor) || lh.sponsor || '',
        chartered: (latest && latest.data.chartered) || lh.chartered || '',
        district: (latest && latest.data.district) || '3292 Nepal and Bhutan',
        motto: (latest && latest.data.motto) || '',
        ry: (latest && latest.data.ry) || '2026-27',
        chair: (latest && latest.data.chair) || (president ? `President Rtr. ${president.name}` : ''),
        secretary: (latest && latest.data.secretary) || (secretary ? `Rtr. ${secretary.name}` : '')
      }));
      setMmDayAuto(true);
    } catch (err) {
      console.warn('minutes letterhead prefill failed:', err);
    }
  }, [currentClub, mmEditId]);

  useEffect(() => { if (currentClub) { renderMMSaved(); prefillMMLetterhead(); } }, [currentClub, renderMMSaved, prefillMMLetterhead]);

  const fillMM = useCallback((id, m) => {
    setMmEditId(id);
    setMm({
      sponsor: m.sponsor || '', chartered: m.chartered || '', district: m.district || '3292 Nepal and Bhutan',
      motto: m.motto || '', ry: m.ry || '2026-27',
      title: m.title || '', date: m.date || '', day: m.day || '',
      venue: m.venue || '', start: m.start || '', end: m.end || '',
      chair: m.chair || '', secretary: m.secretary || '',
      open: m.open || [], happy: m.happy || [], agenda: m.agenda || [], info: m.info || [],
      apologies: m.apologies || '', prevApproval: m.prevApproval || '',
      disc: m.disc || [], remarks: m.remarks || [],
      thanks: m.thanks || '', saa: m.saa || '',
      aGen: m.aGen || '0', aBoard: m.aBoard || '0', aGuest: m.aGuest || '0',
      aVisRac: m.aVisRac || '0', aVisRot: m.aVisRot || '0', aDist: m.aDist || '0',
      sSpecial: m.sSpecial || '', sTotal: m.sTotal || '', next: m.next || '', adjourn: m.adjourn || ''
    });
    setMmStrLists({ open: m.open || [], happy: m.happy || [], agenda: m.agenda || [], info: m.info || [] });
    setMmDiscItems(m.disc || []);
    setMmRemarks(m.remarks || []);
  }, []);

  const onMMDateChange = (date) => {
    setMm(prev => ({ ...prev, date }));
    if (!mmDayAuto) return;
    const d = new Date(date + 'T00:00:00');
    if (!isNaN(d)) {
      setMm(prev => ({ ...prev, day: d.toLocaleDateString('en-US', { weekday: 'long' }) }));
      setMmDayAuto(true);
    }
  };

  const onMMDayInput = (day) => {
    setMmDayAuto(false);
    setMm(prev => ({ ...prev, day }));
  };

  const mmAddStr = (k) => setMmStrLists(prev => ({ ...prev, [k]: [...prev[k], ''] }));
  const mmSetStr = (k, i, v) => setMmStrLists(prev => {
    const arr = [...prev[k]];
    arr[i] = v;
    return { ...prev, [k]: arr };
  });
  const mmRmStr = (k, i) => setMmStrLists(prev => ({ ...prev, [k]: prev[k].filter((_, idx) => idx !== i) }));

  const mmAddDisc = () => setMmDiscItems(prev => [...prev, { t: '', d: '' }]);
  const mmSetDisc = (i, f, v) => setMmDiscItems(prev => prev.map((it, idx) => idx === i ? { ...it, [f]: v } : it));
  const mmRmDisc = (i) => setMmDiscItems(prev => prev.filter((_, idx) => idx !== i));

  const mmAddRemark = () => setMmRemarks(prev => [...prev, { who: '', text: '' }]);
  const mmSetRemark = (i, f, v) => setMmRemarks(prev => prev.map((r, idx) => idx === i ? { ...r, [f]: v } : r));
  const mmRmRemark = (i) => setMmRemarks(prev => prev.filter((_, idx) => idx !== i));

  const collectMM = () => ({
    ...mm,
    open: mmStrLists.open.filter(Boolean),
    happy: mmStrLists.happy.filter(Boolean),
    agenda: mmStrLists.agenda.filter(Boolean),
    info: mmStrLists.info.filter(Boolean),
    disc: mmDiscItems.filter(d => d.t || d.d),
    remarks: mmRemarks.filter(r => r.who || r.text)
  });

  const onMmClear = () => {
    fillMM(null, {});
    setMmDayAuto(true);
    prefillMMLetterhead();
  };

  const onMmSave = async () => {
    const m = collectMM();
    const id = mmEditId || ('min-' + Date.now().toString(36));
    setMmSaving(true);
    try {
      await ZONE7_DB.saveMinutes(currentClub, id, m);
      setMmEditId(id);
      showToast('Draft saved ✓');
      renderMMSaved();
    } catch (err) {
      console.error(err);
      showToast('Save failed, check your Supabase setup.');
    } finally {
      setMmSaving(false);
    }
  };

  const onMmDelete = async (id) => {
    if (confirm('Delete this draft?')) {
      await ZONE7_DB.deleteMinutes(id);
      showToast('Draft deleted');
      renderMMSaved();
    }
  };

  const onMmPdf = () => {
    const m = collectMM();
    const clubName = CLUB_DIRECTORY[currentClub].name.toUpperCase();
    const doc = new jsPDF();
    const W = 182; let y = 16;

    const h = (t, s = 11) => {
      if (y > 278) { doc.addPage(); y = 16; }
      doc.setFontSize(s); doc.setFont(undefined, 'bold'); doc.text(t, 14, y); y += s * 0.65;
    };
    const p = (t, s = 9.7, bold = false) => {
      if (!t) return;
      doc.setFontSize(s); doc.setFont(undefined, bold ? 'bold' : 'normal');
      doc.splitTextToSize(t, W).forEach(l => {
        if (y > 280) { doc.addPage(); y = 16; }
        doc.text(l, 14, y); y += s * 0.55;
      });
      y += 2;
    };
    const letterList = (items) => {
      items.forEach((it, i) => {
        doc.setFontSize(9.7); doc.setFont(undefined, 'normal');
        const letter = String.fromCharCode(97 + i) + '. ';
        const lines = doc.splitTextToSize(letter + it, W - 4);
        lines.forEach((l, li) => {
          if (y > 280) { doc.addPage(); y = 16; }
          doc.text(l, li === 0 ? 14 : 19, y); y += 5.3;
        });
      });
      y += 1.5;
    };
    const bulletList = (items, sym = '\u2794') => {
      items.forEach(it => {
        const lines = doc.splitTextToSize(sym + ' ' + it, W - 4);
        lines.forEach((l, li) => {
          if (y > 280) { doc.addPage(); y = 16; }
          doc.text(l, li === 0 ? 14 : 19, y); y += 5.3;
        });
      });
      y += 1.5;
    };
    const numList = (items) => {
      items.forEach((it, i) => {
        const lines = doc.splitTextToSize((i + 1) + '. ' + it, W - 4);
        lines.forEach((l, li) => {
          if (y > 280) { doc.addPage(); y = 16; }
          doc.text(l, li === 0 ? 14 : 19, y); y += 5.3;
        });
      });
      y += 1.5;
    };
    const label = (k, v) => {
      if (!v) return;
      if (y > 278) { doc.addPage(); y = 16; }
      doc.setFontSize(9.7); doc.setFont(undefined, 'bold'); doc.text(k, 20, y);
      doc.setFont(undefined, 'normal');
      const lines = doc.splitTextToSize(v, 140);
      doc.text(lines, 55, y); y += Math.max(5.3, lines.length * 5.3);
    };

    doc.setFontSize(10); doc.setFont(undefined, 'bolditalic');
    doc.text(m.motto ? `"${m.motto}"` : '', 105, y, { align: 'center' }); y += 5.5;
    doc.setFontSize(12.5); doc.setFont(undefined, 'bold');
    doc.text('ROTARACT CLUB OF ' + clubName.replace(/^ROTARACT CLUB OF /i, ''), 105, y, { align: 'center' }); y += 6.5;
    doc.setFontSize(9.5); doc.setFont(undefined, 'normal');
    if (m.sponsor) { doc.text('Sponsored by: ' + m.sponsor, 105, y, { align: 'center' }); y += 5; }
    if (m.chartered) { doc.text('Chartered on ' + m.chartered, 105, y, { align: 'center' }); y += 5; }
    doc.text('RI District: ' + (m.district || '3292 Nepal and Bhutan'), 105, y, { align: 'center' }); y += 6;
    doc.setLineWidth(0.6); doc.line(14, y, 196, y); y += 9;

    label('Minutes', m.title || '-');
    label('Date', (m.date || '-') + (m.day ? ' (' + m.day + ')' : ''));
    label('Venue', m.venue || '-');
    label('Time', (m.start || '-') + ' to ' + (m.end || '-'));
    y += 4;

    p(`The meeting was chaired by ${m.chair || 'the President'} on the above details.`);
    if (m.open.length) letterList(m.open);

    if (m.happy.length) { h('Happy moments sharing:'); p('The general meeting geared up with happy moments sharing:'); bulletList(m.happy); }
    if (m.agenda.length) { h('Agenda of the meeting:'); numList(m.agenda); }
    if (m.apologies) { h('Apologies:'); p(m.apologies); }
    if (m.prevApproval) { h('Previous meeting minutes approval:'); p(m.prevApproval); }

    if (m.disc.length) {
      h('Meeting discussions and decisions:');
      m.disc.forEach((d, i) => { p((i + 1) + '. ' + (d.t || ''), 9.7, true); p(d.d || ''); });
    }
    if (m.remarks.length) {
      h('Remarks:');
      m.remarks.forEach(r => { p(r.who || '', 9.7, true); p(r.text || ''); });
    }
    if (m.info.length) { h('Information Sharing:'); bulletList(m.info, '\u2756'); }
    if (m.thanks) { h('Vote of thanks:'); p(m.thanks); }
    if (m.saa) { h('Sergeant-at-arms announcement:'); p(m.saa); }

    const total = [m.aGen, m.aBoard, m.aGuest, m.aVisRac, m.aVisRot, m.aDist].reduce((s, v) => s + (Number(v) || 0), 0);
    h('Sergeant-at-arms statistics:');
    p(`General members: ${m.aGen || 0}   Board members: ${m.aBoard || 0}   Guests: ${m.aGuest || 0}`);
    p(`Visiting Rotaractors: ${m.aVisRac || 0}   Visiting Rotarians: ${m.aVisRot || 0}   District Officials: ${m.aDist || 0}`);
    p(`Total attendees: ${total}`, 9.7, true);
    if (m.sSpecial || m.sTotal) {
      y += 1;
      if (m.sSpecial) p('Special Sunshine: ' + m.sSpecial);
      if (m.sTotal) p('Total Sunshine collected: ' + m.sTotal);
    }

    y += 2;
    if (m.next) { h('Secretary announcement:'); p(m.next); }
    p(`The meeting was formally adjourned at ${m.adjourn || '-'}.`);

    y += 16; if (y > 258) { doc.addPage(); y = 30; }
    doc.setFont(undefined, 'normal'); doc.setFontSize(9.5);
    doc.text('_____________________', 20, y); doc.text('_____________________', 120, y); y += 6;
    doc.setFont(undefined, 'bold');
    doc.text(m.secretary || 'Secretary', 20, y); doc.text(m.chair || 'President', 120, y); y += 5;
    doc.setFont(undefined, 'normal');
    doc.text('Secretary, RY ' + (m.ry || ''), 20, y); doc.text('President, RY ' + (m.ry || ''), 120, y);

    doc.save(`${currentClub}-minutes-${m.date || 'draft'}.pdf`);
  };

  /* ---- Treasury ---- */
  const [tx, setTx] = useState([]);
  const [txForm, setTxForm] = useState({ date: '', type: 'income', amount: '', category: '', desc: '' });

  const renderLedger = useCallback(async () => {
    if (!currentClub) return;
    const rows = await ZONE7_DB.getTransactions(currentClub);
    setTx(rows);
  }, [currentClub]);

  useEffect(() => { if (currentClub) renderLedger(); }, [currentClub, renderLedger]);

  const txTotals = useMemo(() => {
    const income = tx.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount || 0), 0);
    const expense = tx.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount || 0), 0);
    return { income, expense, balance: income - expense };
  }, [tx]);

  const onTxAdd = async () => {
    const amount = Number(txForm.amount);
    if (!amount) return showToast('Enter an amount.');
    try {
      await ZONE7_DB.saveTransaction(currentClub, {
        date: txForm.date, type: txForm.type,
        category: txForm.category, desc: txForm.desc, amount
      });
      setTxForm({ date: '', type: 'income', amount: '', category: '', desc: '' });
      showToast('Entry added ✓');
      renderLedger();
    } catch (err) {
      console.error(err);
      showToast('Save failed, check your Supabase setup.');
    }
  };

  const onTxDelete = async (id) => {
    await ZONE7_DB.deleteTransaction(id);
    showToast('Entry deleted');
    renderLedger();
  };

  const onTxCsv = async () => {
    let csv = 'Date,Type,Category,Description,Amount\n';
    tx.forEach(t => csv += `${t.date},${t.type},${t.category},"${(t.description || '').replace(/"/g, '""')}",${t.amount}\n`);
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${currentClub}-ledger.csv`;
    a.click();
  };

  const onTxPdf = () => {
    const doc = new jsPDF();
    let y = 18;
    doc.setFontSize(13); doc.setFont(undefined, 'bold');
    doc.text(`${CLUB_DIRECTORY[currentClub].name}, Financial Ledger`, 14, y); y += 8;
    doc.setFontSize(9); doc.setFont(undefined, 'normal');
    tx.forEach(t => {
      if (y > 280) { doc.addPage(); y = 18; }
      doc.text(`${(t.date || '-').padEnd(10)} ${t.type.padEnd(9)} ${(t.category || '-').slice(0, 16).padEnd(18)} ${(t.description || '-').slice(0, 32).padEnd(34)} ${t.type === 'income' ? '+' : '-'}${Number(t.amount || 0).toLocaleString()}`, 14, y);
      y += 5;
    });
    y += 6; doc.setFont(undefined, 'bold');
    doc.text(`Total Income: NRs ${txTotals.income.toLocaleString()}   Total Expense: NRs ${txTotals.expense.toLocaleString()}   Balance: NRs ${txTotals.balance.toLocaleString()}`, 14, y);
    doc.save(`${currentClub}-ledger.pdf`);
  };

  /* ---- District events tabs (PS) ---- */
  const [psMode, setPsMode] = useState('guide');
  const [psNetShown, setPsNetShown] = useState(false);

  /* ---- View helpers ---- */
  const switchView = (name) => {
    if (ZONAL_ONLY.includes(name) && !isZonal) name = 'projects';
    setView(name);
  };

  const pages = Math.max(1, Math.ceil(projTotal / PROJ_PAGE_SIZE));
  const isUni = UNIVERSITY_CLUBS.includes(currentClub);

  return (
    <SiteShell current="admin" title="Club Admin | Zone 7 Rotaract 3292" css={pageCss}>
      {!session && (
        <div className="login-wrap" style={{ minHeight: 'calc(100vh - 76px)' }}>
          <div className="login-card" style={loginTab === 'zonal' ? { display: 'none' } : undefined}>
            <h2>Club Admin Login</h2>
            <p className="sub">Sign in as your club to add, edit, or remove project posts shown on your club page.</p>
            <form onSubmit={onClubLogin}>
              <label htmlFor="clubSelect">Select Your Club</label>
              <select id="clubSelect" value={clubSelect} onChange={e => setClubSelect(e.target.value)}>
                {Object.keys(CLUB_DIRECTORY).map(slug => (
                  <option key={slug} value={slug}>{CLUB_DIRECTORY[slug].name}</option>
                ))}
              </select>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Enter club password" value={clubPw} onChange={e => setClubPw(e.target.value)} />
              <div className="login-error" style={clubErr ? { display: 'block' } : undefined}>Incorrect password for that club. Please try again.</div>
              <button type="submit" className="btn btn-primary">Log In</button>
            </form>
            <div className="demo-note">Each club has its own login. Everything you save here (projects, barometer, minutes, treasury, club page) syncs live to the shared Supabase database, so it appears on the public website immediately.</div>
            <div style={{ marginTop: 18, textAlign: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'rgba(27,24,54,0.4)' }}>Zone team? <a href="#" style={{ color: 'var(--magenta-deep)', fontWeight: 700 }} onClick={e => { e.preventDefault(); setLoginTab('zonal'); }}>Log in here →</a></span>
            </div>
          </div>

          <div className="login-card" style={loginTab === 'club' ? { display: 'none' } : undefined}>
            <h2>Zone Team Login</h2>
            <p className="sub">For the ZRR and zone team, manage guides and zone-wide resources.</p>
            <label htmlFor="zonalPassword">Password</label>
            <input type="password" id="zonalPassword" placeholder="Enter zone team password" value={zonalPw} onChange={e => setZonalPw(e.target.value)} />
            <div className="login-error" style={zonalErr ? { display: 'block' } : undefined}>Incorrect password. Please try again.</div>
            <button type="button" className="btn btn-primary" onClick={onZonalLogin}>Log In</button>
            <div style={{ marginTop: 18, textAlign: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'rgba(27,24,54,0.4)' }}><a href="#" style={{ color: 'var(--magenta-deep)', fontWeight: 700 }} onClick={e => { e.preventDefault(); setLoginTab('club'); }}>← Back to Club Login</a></span>
            </div>
          </div>
        </div>
      )}

      {session && (
        <div id="dashboard">
          <nav className="admin-sidebar" id="adminSidebar">
            <div className="sb-label">Club</div>
            {[
              { v: 'projects', ic: '🗂️', label: 'Projects' },
              { v: 'clubpage', ic: '🌐', label: 'Club Page (BOD & About)' },
              { v: 'barometer', ic: '📊', label: 'District Barometer' },
              { v: 'dues', ic: '💳', label: 'RI & District Dues' },
              { v: 'events', ic: '📅', label: 'Zone Events' },
              { v: 'analytics', ic: '📈', label: 'Analytics' }
            ].map(item => (
              <div key={item.v} className={'sb-item' + (view === item.v ? ' active' : '')} onClick={() => switchView(item.v)}>
                <span className="ic">{item.ic}</span>{item.label}
              </div>
            ))}
            <div className="sb-label">Club Administration</div>
            {[
              { v: 'minutes', ic: '📝', label: 'Meeting Minutes' },
              { v: 'finance', ic: '💰', label: 'Treasury' },
              { v: 'guides', ic: '📚', label: 'Guides (Zonal)', zonal: true },
              { v: 'zrr', ic: '🏛️', label: 'ZRR History (Zonal)', zonal: true },
              { v: 'leadership', ic: '👥', label: 'Zonal Team (Zonal)', zonal: true },
              { v: 'guests', ic: '✉️', label: 'Join Requests (Zonal)' }
            ].map(item => {
              if (item.zonal && !isZonal) return null;
              if (!item.zonal && isZonal) return null;
              return (
                <div key={item.v} className={'sb-item' + (view === item.v ? ' active' : '')} onClick={() => switchView(item.v)}>
                  <span className="ic">{item.ic}</span>{item.label}
                </div>
              );
            })}
            <div className="sb-label">Explore</div>
            {[
              { v: 'district', ic: '🌍', label: 'District Overview' },
              { v: 'distevents', ic: '🏟️', label: 'District Events & Bidding' }
            ].map(item => (
              <div key={item.v} className={'sb-item' + (view === item.v ? ' active' : '')} onClick={() => switchView(item.v)}>
                <span className="ic">{item.ic}</span>{item.label}
              </div>
            ))}
          </nav>

          <div className="wrap">
            <div className="dash-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {currentClub && CLUB_DIRECTORY[currentClub].logo && (
                  <img src={CLUB_DIRECTORY[currentClub].logo} alt="" style={{ width: 48, height: 48, borderRadius: 12, border: '1px solid var(--line)', objectFit: 'contain', padding: 6, background: '#fff' }} />
                )}
                <div>
                  <h2>{currentClub ? `${CLUB_DIRECTORY[currentClub].name}, Dashboard` : 'Zone 7 Team, Dashboard'}</h2>
                  <p>{currentClub ? 'Manage the projects shown on your club\'s page.' : 'Manage guides, ZRR history and zone-wide resources.'}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {currentClub && <Link className="btn btn-ghost" to={`/club/${currentClub}`}>View Club Page →</Link>}
                <button className="btn btn-ghost" onClick={doLogout}>Log Out</button>
              </div>
            </div>

            <div className="dash-body view" style={view === 'projects' ? { display: 'block' } : undefined}>
              <div className="panel">
                <h3>Your Projects</h3>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                  <input type="search" placeholder="Search title, code, category…" value={projSearch} onChange={e => { setProjSearch(e.target.value); setProjPage(0); }} style={{ flex: 1, padding: '8px 12px', border: '1px solid rgba(27,24,54,0.15)', borderRadius: 8, font: 'inherit', fontSize: '0.85rem' }} />
                </div>
                <div className="proj-list">
                  {projLoading && <div className="no-projects">Loading projects…</div>}
                  {!projLoading && !projects.length && (
                    <div className="no-projects">{projSearch ? `No projects match "${projSearch}".` : 'No projects yet, add your first one on the right.'}</div>
                  )}
                  {!projLoading && projects.map(p => (
                    <div key={p.id} className={'proj-item' + (selectedId === p.id ? ' selected' : '')} onClick={() => loadProjectIntoForm(p.id)}>
                      <img src={p.cover || ''} alt="" />
                      <div className="info">
                        <h4>{p.title}</h4>
                        <span>{p.project_code || '—'} · {p.category || 'Uncategorized'} · {p.date || 'No date'}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {!projSearch && (
                  <div className="proj-pager" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, gap: 10 }}>
                    <button className="btn btn-ghost" disabled={projPage <= 0} onClick={() => setProjPage(p => p - 1)}>← Prev</button>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(27,24,54,0.55)' }}>Page {projPage + 1} of {pages} · {projTotal} projects</span>
                    <button className="btn btn-ghost" disabled={projPage >= pages - 1} onClick={() => setProjPage(p => p + 1)}>Next →</button>
                  </div>
                )}
                <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={resetForm}>+ New Project</button>
              </div>

              <div className="panel" ref={formPanelRef}>
                <h3 id="formTitle">{editingId ? 'Edit Project' : 'New Project'}</h3>
                {editingId && (
                  <div className="editing-banner">
                    <span>Editing: {pf.title || 'project'}</span>
                    <button type="button" onClick={resetForm}>Clear / New Project</button>
                  </div>
                )}
                <form onSubmit={onProjectSubmit}>
                  <label>Cover Image</label>
                  {cover.src && <img className="cover-preview" src={cover.src} alt="" style={{ display: 'block' }} />}
                  <div className="img-upload" onClick={() => coverInputRef.current && coverInputRef.current.click()}>
                    <span>Click to upload a cover image (auto-resized)</span>
                  </div>
                  <input type="file" ref={coverInputRef} accept="image/*" style={{ display: 'none' }} onChange={onCoverFile} />

                  <label htmlFor="pTitle">Project Title</label>
                  <input type="text" id="pTitle" placeholder="e.g. Blood Donation Drive 2026" value={pf.title} onChange={e => setPf(prev => ({ ...prev, title: e.target.value }))} required />

                  <div className="field-row">
                    <div>
                      <label htmlFor="pCategory">Category</label>
                      <input type="text" id="pCategory" placeholder="e.g. Health, Education, Environment" value={pf.category} onChange={e => setPf(prev => ({ ...prev, category: e.target.value }))} />
                    </div>
                    <div>
                      <label htmlFor="pDate">Project Date</label>
                      <input type="date" id="pDate" value={pf.date} onChange={e => setPf(prev => ({ ...prev, date: e.target.value }))} />
                    </div>
                  </div>

                  <label htmlFor="pLocation">Location</label>
                  <input type="text" id="pLocation" placeholder="e.g. Baneshwor, Kathmandu" value={pf.location} onChange={e => setPf(prev => ({ ...prev, location: e.target.value }))} />

                  <label htmlFor="pSummary">Short Summary <span style={{ fontWeight: 500, color: 'rgba(27,24,54,0.5)' }}>(shown on the club page card)</span></label>
                  <textarea id="pSummary" rows="2" placeholder="One or two sentences about the project" value={pf.summary} onChange={e => setPf(prev => ({ ...prev, summary: e.target.value }))}></textarea>

                  <label htmlFor="pBody">Full Story <span style={{ fontWeight: 500, color: 'rgba(27,24,54,0.5)' }}>(shown on the project's detail page)</span></label>
                  <textarea id="pBody" rows="7" placeholder="Write the full project story here: background, what was done, impact, and any highlights." value={pf.body} onChange={e => setPf(prev => ({ ...prev, body: e.target.value }))}></textarea>

                  <label>Gallery Photos</label>
                  {galleryImages.length > 0 && (
                    <div className="gallery-preview">
                      {galleryImages.map((src, i) => (
                        <div className="g-item" key={i}><img src={src} alt="" /><div className="rm" onClick={() => removeGallery(i)}>✕</div></div>
                      ))}
                    </div>
                  )}
                  <div className="img-upload" onClick={() => galleryInputRef.current && galleryInputRef.current.click()}>
                    <span>Click to add gallery photos</span>
                  </div>
                  <input type="file" ref={galleryInputRef} accept="image/*" multiple style={{ display: 'none' }} onChange={onGalleryFiles} />

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Save Project</button>
                    <button type="button" className="btn btn-ghost" onClick={resetForm}>Clear Form</button>
                    {editingId && <button type="button" className="btn btn-danger" onClick={onDeleteProject}>Delete</button>}
                  </div>
                </form>
              </div>
            </div>

            <div className="view" style={view === 'clubpage' ? { display: 'block' } : undefined}>
              <div className="panel">
                <h3>Board of Directors <span style={{ fontWeight: 500, fontSize: '0.78rem', color: 'rgba(27,24,54,0.5)' }}>(shown on your club page)</span></h3>
                <div className="proj-list" style={{ marginBottom: 14 }}>
                  {cpBoard.length === 0 && <div className="no-projects">No board members added yet.</div>}
                  {cpBoard.map((m, i) => (
                    <div className="proj-item" style={{ cursor: 'default' }} key={i}>
                      {m.photo && <img src={m.photo} alt="" style={{ borderRadius: 10 }} />}
                      <div className="img-upload" style={m.photo ? { margin: 0, padding: '8px 10px', display: 'none' } : { margin: 0, padding: '8px 10px' }} onClick={() => { boardPhotoIdx.current = i; if (boardPhotoInputRef.current) boardPhotoInputRef.current.click(); }}>
                        <span style={{ fontSize: '0.75rem' }}>+ Photo</span>
                      </div>
                      <div className="info" style={{ flex: 1 }}>
                        <input type="text" placeholder="Name" value={m.name || ''} onChange={e => setCpBoard(prev => prev.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} style={{ marginBottom: 6 }} />
                        <input type="text" placeholder="Role (e.g. President)" value={m.role || ''} onChange={e => setCpBoard(prev => prev.map((x, idx) => idx === i ? { ...x, role: e.target.value } : x))} />
                      </div>
                      <button className="btn btn-danger" style={{ padding: '8px 12px', fontSize: '0.78rem' }} onClick={() => setCpBoard(prev => prev.filter((_, idx) => idx !== i))}>✕</button>
                    </div>
                  ))}
                </div>
                <input type="file" ref={boardPhotoInputRef} accept="image/*" style={{ display: 'none' }} onChange={onBoardPhoto} />
                <button className="btn btn-ghost" type="button" onClick={() => setCpBoard(prev => [...prev, { name: '', role: '', photo: '' }])}>+ Add Board Member</button>

                <h3 style={{ marginTop: 32 }}>About &amp; Vision</h3>
                <label htmlFor="cpAbout">About Text</label>
                <textarea id="cpAbout" rows="5" placeholder="Paragraph shown in the club's 'About' section" value={cpAbout} onChange={e => setCpAbout(e.target.value)}></textarea>
                <label htmlFor="cpVision">Vision Statement</label>
                <input type="text" id="cpVision" placeholder="Your club's vision statement" value={cpVision} onChange={e => setCpVision(e.target.value)} />

                <h3 style={{ marginTop: 32 }}>Club Goals</h3>
                <div className="proj-list" style={{ marginBottom: 14 }}>
                  {cpGoals.length === 0 && <div className="no-projects">No goals added yet.</div>}
                  {cpGoals.map((g, i) => (
                    <div className="proj-item" style={{ cursor: 'default', gap: 10 }} key={i}>
                      <input type="text" placeholder="Goal text" value={g.t || ''} onChange={e => setCpGoals(prev => prev.map((x, idx) => idx === i ? { ...x, t: e.target.value } : x))} style={{ flex: 1 }} />
                      <select value={g.s || 'inprogress'} onChange={e => setCpGoals(prev => prev.map((x, idx) => idx === i ? { ...x, s: e.target.value } : x))} style={{ width: 130, margin: 0 }}>
                        <option value="inprogress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="canceled">Canceled</option>
                      </select>
                      <button className="btn btn-danger" style={{ padding: '8px 12px', fontSize: '0.78rem' }} onClick={() => setCpGoals(prev => prev.filter((_, idx) => idx !== i))}>✕</button>
                    </div>
                  ))}
                </div>
                <button className="btn btn-ghost" type="button" onClick={() => setCpGoals(prev => [...prev, { t: '', s: 'inprogress' }])}>+ Add Goal</button>

                <div className="form-actions" style={{ marginTop: 26 }}>
                  <button className="btn btn-primary" type="button" onClick={onCpSave} disabled={cpSaving}>{cpSaving ? 'Saving…' : 'Save Club Page'}</button>
                </div>
              </div>
            </div>

            <div className="view" style={view === 'analytics' ? { display: 'block' } : undefined}>
              <div className="panel">
                <h3>Zone 7 Analytics <span style={{ fontWeight: 500, fontSize: '0.78rem', color: 'rgba(27,24,54,0.5)' }}>(zone-wide, live from Supabase)</span></h3>
                {!analyticsData ? (
                  <div className="no-projects">Loading analytics…</div>
                ) : (
                  <div className="analytics-stats">
                    <div className="a-stat"><b>{analyticsData.total}</b><span>Total Projects, Zone-wide</span></div>
                    <div className="a-stat"><b>{analyticsData.counts[currentClub] || 0}</b><span>Your Club's Projects</span></div>
                    <div className="a-stat"><b>{analyticsData.events}</b><span>Zone Events Posted</span></div>
                  </div>
                )}
                <AnalyticsCharts visible={view === 'analytics'} data={analyticsData} myClub={currentClub} />
              </div>
            </div>

            <div className="view" style={view === 'barometer' ? { display: 'block' } : undefined}>
              <div className="panel" id="barometerPanel">
                <h3 id="baroTitle">District Barometer <span style={{ fontWeight: 500, fontSize: '0.78rem', color: 'rgba(27,24,54,0.5)' }}>({isUni ? 'University-Based Clubs' : 'Community-Based Clubs'} · RY 2026-27, self-tracked)</span></h3>
                <div className="baro-mode-tabs" id="baroModeTabs">
                  <span className={'bmt' + (baroMode === 'serious' ? ' active' : '')} onClick={() => setBaroMode('serious')}>📊 Full Barometer</span>
                  <span className={'bmt' + (baroMode === 'quick' ? ' active' : '')} onClick={() => setBaroMode('quick')}>⚡ Quick Check</span>
                </div>
                <p className="baro-mode-note" id="baroModeNote">{baroMode === 'quick'
                  ? 'Quick mode: same criteria, just tick what\'s done. No projects or documents required; use this for a fast self-score, then switch back to Full Barometer when you\'re ready to submit real proof.'
                  : 'Full mode requires proof, with linked projects and, for a few items, an uploaded document, verified later by the ZRR / Recognition Committee.'}</p>
                <div className="baro-summary">
                  <div className="baro-score-card">
                    <div>
                      <b>{baroScore.total} / {baroScore.maxTotal}</b>
                      <span>Score so far</span>
                    </div>
                  </div>
                  <div className="baro-badge-card">
                    <div>
                      <b>{baroScore.badge}</b>
                      <span>Recognition category</span>
                    </div>
                  </div>
                  <div className="baro-progress-card">
                    <span className="baro-pct-label">{baroScore.pct}%</span>
                    <div className="baro-progress-track"><div className="baro-progress-fill" style={{ width: Math.min(100, baroScore.pct) + '%' }}></div></div>
                  </div>
                </div>
                <div className="baro-thresholds" style={{ marginBottom: 14 }}>
                  {BAROMETER_THRESHOLDS.slice().reverse().map(t => (
                    <span key={t.label} className={baroScore.pct >= t.min ? 'hit' : ''}>{t.label} {t.min}–{t.max}</span>
                  ))}
                </div>
                <div className="baro-toolbar">
                  <p className="note">Switch modes above anytime, your progress in each is saved separately.</p>
                  <div className="baro-actions">
                    <button className="btn btn-ghost" type="button" onClick={onBaroPdf}>PDF ↓</button>
                    <button className="btn btn-primary" type="button" onClick={onBaroSave} disabled={baroSaving}>{baroSaving ? 'Saving…' : 'Save'}</button>
                  </div>
                </div>

                <div className="baro-list">
                  {BAROMETER_GROUPS.map(grp => {
                    const items = baroCriteria.filter(item => item.group === grp.key);
                    if (!items.length) return null;
                    const doneCount = items.filter(item => baroIsDone(item.id)).length;
                    return (
                      <div className="baro-group" key={grp.key}>
                        <div className="baro-group-head">
                          <span className="baro-group-icon">{grp.icon}</span>
                          <span className="baro-group-title">{grp.label}</span>
                          <span className="baro-group-count">{doneCount}/{items.length}</span>
                        </div>
                        <div className="baro-list">
                          {items.map(item => {
                            const isAuto = item.auto && baroAutoIds.has(item.id);
                            const isChecked = baroIsDone(item.id);
                            const needsProj = BARO_NEEDS_PROJECT.has(item.id) && !isAuto;
                            const isMulti = needsProj && baroMinFor(item.id) > 1;
                            const needsDoc = BARO_NEEDS_DOC.has(item.id) && !isAuto;
                            const hasOptionalDoc = BARO_OPTIONAL_DOC.has(item.id) && !isAuto;
                            const linked = baroLinkedProjects[item.id] || [];
                            const doc = baroDocuments[item.id];
                            const accOpen = !!baroAccOpen[item.id];

                            let checkHtml;
                            const badges = [];
                            let bodyExtra = null;

                            if (isAuto) {
                              checkHtml = <input type="checkbox" className="baro-check" checked disabled readOnly />;
                              badges.push(<span className="baro-tag auto-tag" key="a">✓ Auto</span>);
                            } else if (needsProj) {
                              checkHtml = <input type="checkbox" className="baro-check" checked={isChecked} disabled readOnly />;
                              badges.push(isMulti
                                ? <span className="baro-tag proj-tag" key="p">🔗 {baroMinFor(item.id)} projects required</span>
                                : <span className="baro-tag proj-tag" key="p">🔗 Project required</span>);
                              if (needsDoc) badges.push(<span className="baro-tag min-tag" key="d">📄 {zone7Esc(BARO_DOC_LABEL[item.id] || 'Document')} required</span>);

                              if (isMulti) {
                                bodyExtra = (
                                  <>
                                    <button type="button" className={'baro-acc-toggle' + (accOpen ? ' open' : '')} onClick={() => toggleAcc(item.id)}>
                                      <span>{linked.length} / {baroMinFor(item.id)} projects selected, choose projects</span>
                                      <span className="baro-acc-chevron">▾</span>
                                    </button>
                                    {accOpen && (
                                      <div className="baro-acc-body">
                                        <div className="baro-multi-list">
                                          {baroClubProjects.length === 0 ? <span className="a-empty">No projects uploaded yet.</span> : baroClubProjects.map(p => (
                                            <label className="baro-multi-item" key={p.id}>
                                              <input type="checkbox" checked={linked.some(l => l.id === p.id)} onChange={() => toggleMulti(item.id, p)} />
                                              {p.project_code || '—'} · {p.title}{p.date ? ' (' + p.date + ')' : ''}
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </>
                                );
                              } else {
                                bodyExtra = (
                                  <select className={'baro-proj-select' + (linked.length ? ' linked' : '')} value={linked.length ? linked[0].id : ''} onChange={e => onProjSelect(item.id, e.target.value)}>
                                    <option value="">— select the project that fulfils this —</option>
                                    {baroClubProjects.map(p => (
                                      <option key={p.id} value={p.id}>{p.project_code || '—'} · {p.title}{p.date ? ' (' + p.date + ')' : ''}</option>
                                    ))}
                                  </select>
                                );
                              }
                            } else {
                              checkHtml = baroMode === 'quick'
                                ? <input type="checkbox" className="baro-check baro-quick-check" checked={isChecked} onChange={() => toggleQuick(item.id)} />
                                : <input type="checkbox" className="baro-check baro-self-check" checked={isChecked} onChange={() => toggleSelf(item.id)} />;
                            }

                            if (needsDoc || hasOptionalDoc) {
                              const label = BARO_DOC_LABEL[item.id] || 'Document';
                              if (hasOptionalDoc) badges.push(<span className="baro-tag" key="o">📄 {zone7Esc(label)} (optional)</span>);
                              bodyExtra = (
                                <div className="baro-doc-row">
                                  {doc
                                    ? <span className="baro-doc-file">📄 {zone7Esc(doc.name)} <button type="button" className="baro-doc-rm" onClick={() => removeBaroDoc(item.id)}>✕</button></span>
                                    : <button type="button" className="baro-doc-upload" onClick={() => baroDocRefs.current[item.id] && baroDocRefs.current[item.id].click()}>+ Upload {zone7Esc(label)}</button>}
                                  <input type="file" className="baro-doc-input" accept=".pdf,.doc,.docx,.xls,.xlsx,image/*" style={{ display: 'none' }} ref={el => { baroDocRefs.current[item.id] = el; }} onChange={e => onBaroDocFile(item.id, e)} />
                                </div>
                              );
                            }

                            return (
                              <div key={item.id} className={'baro-item' + (isChecked ? ' checked' : '') + (isAuto ? ' auto' : '') + (needsProj && linked.length ? ' proj-linked' : '')}>
                                <div className="baro-check-col">{checkHtml}</div>
                                <div className="baro-text-col">
                                  <div className="baro-text"><span className="num">{item.id}.</span>{zone7Esc(item.text)}{badges}</div>
                                  {bodyExtra}
                                </div>
                                <div className="baro-meta-col">
                                  <span className="baro-pts">{item.points} pt{item.points > 1 ? 's' : ''}</span>
                                  {linked.length
                                    ? <span className="baro-codes">{linked.map(l => zone7Esc(l.code || '—')).join(', ')}</span>
                                    : <span className="baro-verifier">{zone7Esc(item.verifier)}</span>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="view" style={view === 'dues' ? { display: 'block' } : undefined}>
              <div className="panel">
                <h3>RI &amp; District Dues Calculator <span style={{ fontWeight: 500, fontSize: '0.78rem', color: 'rgba(27,24,54,0.5)' }}>(RY 2026-27 · collection opens 1 July)</span></h3>
                <div className="baro-toolbar" style={{ marginBottom: 24 }}>
                  <p className="note">Rotary International charges <strong>${dues.rate}</strong>/member for your club type. Rotaract District 3292 charges a flat <strong>NRs 200</strong>/member. The NPR figure for RI dues is an estimate, since banks apply their own conversion rate on the day you actually pay. Both are due before the district's payment deadline.</p>
                </div>

                <div className="field-row" style={{ marginTop: 22, maxWidth: 460 }}>
                  <div>
                    <label htmlFor="duesMembers">Number of Paying Members</label>
                    <div className="dues-input-wrap"><span className="dues-input-ico">👥</span><input type="text" inputMode="numeric" autoComplete="off" id="duesMembers" placeholder="e.g. 22" value={duesMembers} onChange={e => setDuesMembers(e.target.value)} /></div>
                  </div>
                  <div>
                    <label htmlFor="duesRate">USD → NPR Rate</label>
                    <div className="dues-input-wrap"><span className="dues-input-ico">💱</span><input type="text" inputMode="decimal" autoComplete="off" id="duesRate" value={duesRate} onChange={e => setDuesRate(e.target.value)} /></div>
                  </div>
                </div>

                <div className="analytics-stats" style={{ marginTop: 10 }}>
                  <div className="a-stat"><b>{dues.isUni ? 'University' : 'Community'}</b><span>Club Type</span></div>
                  <div className="a-stat"><b>${dues.ri}</b><span>RI Dues (USD)</span></div>
                  <div className="a-stat"><b>NRs {dues.riNpr.toLocaleString()}</b><span>RI Dues (≈ NPR)</span></div>
                  <div className="a-stat"><b>NRs {dues.dist.toLocaleString()}</b><span>District Dues (NPR)</span></div>
                </div>

                <div className="editing-banner" style={{ marginTop: 6 }}>
                  <span>Total to remit: <b>${dues.ri} / ≈NRs {dues.riNpr.toLocaleString()} (RI) + NRs {dues.dist.toLocaleString()} (District) = ≈NRs {(dues.riNpr + dues.dist).toLocaleString()} total, for {dues.n} member{dues.n === 1 ? '' : 's'}</b></span>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'rgba(27,24,54,0.5)', marginTop: 18, lineHeight: 1.6 }}>
                  RI Dues rate: <strong>University-based clubs pay $5/member</strong> · <strong>Community-based clubs pay $8/member</strong> to Rotary International.
                  District Dues: <strong>NRs 200/member</strong> to Rotaract District 3292. Figures here are for planning only, so always confirm final amounts against the official district invoice.
                </p>
              </div>
            </div>

            <div className="view" style={view === 'minutes' ? { display: 'block' } : undefined}>
              <div className="panel">
                <h3>Meeting Minutes <span style={{ fontWeight: 500, fontSize: '0.78rem', color: 'rgba(27,24,54,0.5)' }}>(builds the full official Rotaract minutes format, section by section)</span></h3>

                <div className="sec-title">Club Letterhead <span style={{ fontWeight: 500, color: 'rgba(27,24,54,0.5)', textTransform: 'none', letterSpacing: 0 }}>(saved once, reused every time)</span></div>
                <div className="row3">
                  <div><label>Sponsoring Rotary Club</label><input type="text" placeholder="Rotary Club of ..." value={mm.sponsor} onChange={e => setMm(prev => ({ ...prev, sponsor: e.target.value }))} /></div>
                  <div><label>Chartered On</label><input type="text" placeholder="e.g. 5th November 1997" value={mm.chartered} onChange={e => setMm(prev => ({ ...prev, chartered: e.target.value }))} /></div>
                  <div><label>RI District</label><input type="text" value={mm.district} onChange={e => setMm(prev => ({ ...prev, district: e.target.value }))} /></div>
                </div>
                <div className="row2">
                  <div><label>Club Motto</label><input type="text" placeholder='e.g. "Unleashing possibilities"' value={mm.motto} onChange={e => setMm(prev => ({ ...prev, motto: e.target.value }))} /></div>
                  <div><label>Rotary Year</label><input type="text" value={mm.ry} onChange={e => setMm(prev => ({ ...prev, ry: e.target.value }))} /></div>
                </div>

                <div className="sec-title">Meeting Details</div>
                <div className="row3">
                  <div><label>Minutes Title</label><input type="text" placeholder="Regular Meeting #674" value={mm.title} onChange={e => setMm(prev => ({ ...prev, title: e.target.value }))} /></div>
                  <div><label>Date</label><input type="date" value={mm.date} onChange={e => onMMDateChange(e.target.value)} /></div>
                  <div><label>Day</label><input type="text" placeholder="e.g. Sunday" value={mm.day} onChange={e => onMMDayInput(e.target.value)} /></div>
                </div>
                <div className="row3">
                  <div><label>Venue</label><input type="text" value={mm.venue} onChange={e => setMm(prev => ({ ...prev, venue: e.target.value }))} /></div>
                  <div><label>Time Started</label><input type="time" value={mm.start} onChange={e => setMm(prev => ({ ...prev, start: e.target.value }))} /></div>
                  <div><label>Time Ended</label><input type="time" value={mm.end} onChange={e => setMm(prev => ({ ...prev, end: e.target.value }))} /></div>
                </div>
                <div className="row2">
                  <div><label>Chaired By (President)</label><input type="text" placeholder="President Rtr. ..." value={mm.chair} onChange={e => setMm(prev => ({ ...prev, chair: e.target.value }))} /></div>
                  <div><label>Recorded By (Secretary)</label><input type="text" value={mm.secretary} onChange={e => setMm(prev => ({ ...prev, secretary: e.target.value }))} /></div>
                </div>

                <div className="sec-title">Opening <span style={{ fontWeight: 500, color: 'rgba(27,24,54,0.5)', textTransform: 'none', letterSpacing: 0 }}>(lettered a, b, c...; SAA, quorum, silence, guests acknowledged)</span></div>
                <div id="mmOpenList">
                  {mmStrLists.open.map((v, i) => (
                    <div className="dyn-row" key={i}>
                      <textarea rows="2" placeholder={MM_STR_PLACEHOLDER.open} value={v} onChange={e => mmSetStr('open', i, e.target.value)}></textarea>
                      <button type="button" className="rm-x" onClick={() => mmRmStr('open', i)}>✕</button>
                    </div>
                  ))}
                </div>
                <button className="btn btn-ghost small" type="button" onClick={() => mmAddStr('open')}>+ Add Opening Note</button>

                <div className="sec-title">Happy Moments Sharing</div>
                <div id="mmHappyList">
                  {mmStrLists.happy.map((v, i) => (
                    <div className="dyn-row" key={i}>
                      <textarea rows="2" placeholder={MM_STR_PLACEHOLDER.happy} value={v} onChange={e => mmSetStr('happy', i, e.target.value)}></textarea>
                      <button type="button" className="rm-x" onClick={() => mmRmStr('happy', i)}>✕</button>
                    </div>
                  ))}
                </div>
                <button className="btn btn-ghost small" type="button" onClick={() => mmAddStr('happy')}>+ Add Happy Moment</button>

                <div className="sec-title">Agenda of the Meeting</div>
                <div id="mmAgendaList">
                  {mmStrLists.agenda.map((v, i) => (
                    <div className="dyn-row" key={i}>
                      <textarea rows="2" placeholder={MM_STR_PLACEHOLDER.agenda} value={v} onChange={e => mmSetStr('agenda', i, e.target.value)}></textarea>
                      <button type="button" className="rm-x" onClick={() => mmRmStr('agenda', i)}>✕</button>
                    </div>
                  ))}
                </div>
                <button className="btn btn-ghost small" type="button" onClick={() => mmAddStr('agenda')}>+ Add Agenda Item</button>

                <div className="row2" style={{ marginTop: 16 }}>
                  <div><label>Apologies</label><textarea rows="2" placeholder="Apologies received from ... due to ..." value={mm.apologies} onChange={e => setMm(prev => ({ ...prev, apologies: e.target.value }))}></textarea></div>
                  <div><label>Previous Minutes Approval</label><textarea rows="2" placeholder="Minutes of meeting no. X were circulated and passed by members present." value={mm.prevApproval} onChange={e => setMm(prev => ({ ...prev, prevApproval: e.target.value }))}></textarea></div>
                </div>

                <div className="sec-title">Meeting Discussions &amp; Decisions <span style={{ fontWeight: 500, color: 'rgba(27,24,54,0.5)', textTransform: 'none', letterSpacing: 0 }}>(numbered, one per topic)</span></div>
                <div id="mmDiscList">
                  {mmDiscItems.map((it, i) => (
                    <div className="dyn-row" key={i}>
                      <div style={{ flex: 1 }}>
                        <input type="text" placeholder="Topic (e.g. Charter's Day Celebration)" value={it.t || ''} onChange={e => mmSetDisc(i, 't', e.target.value)} style={{ marginBottom: 6 }} />
                        <textarea placeholder="Full discussion / decision text" rows="3" value={it.d || ''} onChange={e => mmSetDisc(i, 'd', e.target.value)}></textarea>
                      </div>
                      <button type="button" className="rm-x" onClick={() => mmRmDisc(i)}>✕</button>
                    </div>
                  ))}
                </div>
                <button className="btn btn-ghost small" type="button" onClick={mmAddDisc}>+ Add Discussion Item</button>

                <div className="sec-title">Remarks <span style={{ fontWeight: 500, color: 'rgba(27,24,54,0.5)', textTransform: 'none', letterSpacing: 0 }}>(guests / officials; ZRR, DRR, mentor)</span></div>
                <div id="mmRemarkList">
                  {mmRemarks.map((r, i) => (
                    <div className="dyn-row" key={i}>
                      <div style={{ flex: 1 }}>
                        <input type="text" placeholder="Name & role (e.g. ZRR Rtr. Sunil Shahi)" value={r.who || ''} onChange={e => mmSetRemark(i, 'who', e.target.value)} style={{ marginBottom: 6 }} />
                        <textarea placeholder="What they said" rows="2" value={r.text || ''} onChange={e => mmSetRemark(i, 'text', e.target.value)}></textarea>
                      </div>
                      <button type="button" className="rm-x" onClick={() => mmRmRemark(i)}>✕</button>
                    </div>
                  ))}
                </div>
                <button className="btn btn-ghost small" type="button" onClick={mmAddRemark}>+ Add Remark</button>

                <div className="sec-title">Information Sharing</div>
                <div id="mmInfoList">
                  {mmStrLists.info.map((v, i) => (
                    <div className="dyn-row" key={i}>
                      <textarea rows="2" placeholder={MM_STR_PLACEHOLDER.info} value={v} onChange={e => mmSetStr('info', i, e.target.value)}></textarea>
                      <button type="button" className="rm-x" onClick={() => mmRmStr('info', i)}>✕</button>
                    </div>
                  ))}
                </div>
                <button className="btn btn-ghost small" type="button" onClick={() => mmAddStr('info')}>+ Add Info Item</button>

                <div className="row2" style={{ marginTop: 16 }}>
                  <div><label>Vote of Thanks</label><textarea rows="2" placeholder="Joint Secretary / SAA acknowledged the presence of..." value={mm.thanks} onChange={e => setMm(prev => ({ ...prev, thanks: e.target.value }))}></textarea></div>
                  <div><label>Sergeant-at-Arms Announcement</label><textarea rows="2" placeholder="Presented by Acting SAA Rtr. ..." value={mm.saa} onChange={e => setMm(prev => ({ ...prev, saa: e.target.value }))}></textarea></div>
                </div>

                <div className="sec-title">Attendance</div>
                <div className="row4">
                  <div><label>General Members</label><input type="number" value={mm.aGen} onChange={e => setMm(prev => ({ ...prev, aGen: e.target.value }))} /></div>
                  <div><label>Board Members</label><input type="number" value={mm.aBoard} onChange={e => setMm(prev => ({ ...prev, aBoard: e.target.value }))} /></div>
                  <div><label>Guests</label><input type="number" value={mm.aGuest} onChange={e => setMm(prev => ({ ...prev, aGuest: e.target.value }))} /></div>
                  <div><label>Visiting Rotaractors</label><input type="number" value={mm.aVisRac} onChange={e => setMm(prev => ({ ...prev, aVisRac: e.target.value }))} /></div>
                </div>
                <div className="row4">
                  <div><label>Visiting Rotarians</label><input type="number" value={mm.aVisRot} onChange={e => setMm(prev => ({ ...prev, aVisRot: e.target.value }))} /></div>
                  <div><label>District Officials</label><input type="number" value={mm.aDist} onChange={e => setMm(prev => ({ ...prev, aDist: e.target.value }))} /></div>
                  <div><label>Special Sunshine</label><input type="text" placeholder="Rs. 3000/- (name)" value={mm.sSpecial} onChange={e => setMm(prev => ({ ...prev, sSpecial: e.target.value }))} /></div>
                  <div><label>Total Sunshine Collected</label><input type="text" placeholder="Rs. 3300/-" value={mm.sTotal} onChange={e => setMm(prev => ({ ...prev, sTotal: e.target.value }))} /></div>
                </div>

                <div className="sec-title">Closing</div>
                <div className="row2">
                  <div><label>Next Meeting No. &amp; Date</label><input type="text" placeholder="Meeting no. 675 will be held on ..." value={mm.next} onChange={e => setMm(prev => ({ ...prev, next: e.target.value }))} /></div>
                  <div><label>Adjourned At</label><input type="time" value={mm.adjourn} onChange={e => setMm(prev => ({ ...prev, adjourn: e.target.value }))} /></div>
                </div>

                <div className="form-actions">
                  <button className="btn btn-primary" type="button" onClick={onMmPdf}>Download PDF</button>
                  <button className="btn btn-ghost" type="button" onClick={onMmSave} disabled={mmSaving}>{mmSaving ? 'Saving…' : 'Save Draft'}</button>
                  <button className="btn btn-ghost" type="button" onClick={onMmClear}>Clear Form</button>
                </div>
                <h3 style={{ marginTop: 30 }}>Saved Minutes</h3>
                <div className="proj-list">
                  {mmSaved.length === 0 && <div className="no-projects">No saved drafts yet.</div>}
                  {mmSaved.map(r => (
                    <div className="proj-item" key={r.id} onClick={() => fillMM(r.id, r.data)}>
                      <div className="info"><h4>{r.data.title || 'Untitled'}</h4><span>{r.data.date || 'No date'}</span></div>
                      <button className="btn btn-danger" style={{ marginLeft: 'auto', padding: '8px 12px', fontSize: '0.78rem' }} onClick={e => { e.stopPropagation(); onMmDelete(r.id); }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="view" style={view === 'finance' ? { display: 'block' } : undefined}>
              <div className="panel">
                <h3>Treasury Ledger <span style={{ fontWeight: 500, fontSize: '0.78rem', color: 'rgba(27,24,54,0.5)' }}>(club cash book — income and expenses)</span></h3>
                <div className="baro-toolbar" style={{ marginBottom: 20 }}>
                  <p className="note">Record income and expenses as they happen. Totals and balance update automatically; you can download the ledger as PDF or CSV anytime.</p>
                </div>

                <div className="row2" style={{ marginBottom: 18 }}>
                  <div>
                    <label htmlFor="txDesc">Description</label>
                    <input type="text" id="txDesc" placeholder="e.g. Membership dues (22 members)" value={txForm.desc} onChange={e => setTxForm(f => ({ ...f, desc: e.target.value }))} />
                  </div>
                  <div>
                    <label htmlFor="txAmount">Amount (NRs)</label>
                    <input type="number" id="txAmount" placeholder="e.g. 4500" value={txForm.amount} onChange={e => setTxForm(f => ({ ...f, amount: e.target.value }))} />
                  </div>
                </div>
                <div className="row3" style={{ marginBottom: 18 }}>
                  <div>
                    <label htmlFor="txDate">Date</label>
                    <input type="date" id="txDate" value={txForm.date} onChange={e => setTxForm(f => ({ ...f, date: e.target.value }))} />
                  </div>
                  <div>
                    <label htmlFor="txType">Type</label>
                    <select id="txType" value={txForm.type} onChange={e => setTxForm(f => ({ ...f, type: e.target.value }))}>
                      <option value="income">Income (+)</option>
                      <option value="expense">Expense (−)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="txCat">Category</label>
                    <input type="text" id="txCat" placeholder="e.g. Dues / Projects / Meeting" value={txForm.category} onChange={e => setTxForm(f => ({ ...f, category: e.target.value }))} />
                  </div>
                </div>
                <div className="form-actions" style={{ marginBottom: 26 }}>
                  <button className="btn btn-primary" type="button" onClick={onTxAdd}>Add Transaction</button>
                  <button className="btn btn-ghost" type="button" onClick={onTxCsv}>Download CSV ↓</button>
                  <button className="btn btn-ghost" type="button" onClick={onTxPdf}>Download PDF ↓</button>
                </div>

                <div className="analytics-stats" style={{ marginBottom: 22 }}>
                  <div className="a-stat"><b>NRs {txTotals.income.toLocaleString()}</b><span>Total Income</span></div>
                  <div className="a-stat"><b>NRs {txTotals.expense.toLocaleString()}</b><span>Total Expenses</span></div>
                  <div className="a-stat"><b style={{ color: txTotals.balance < 0 ? '#b3261e' : '#1f845a' }}>NRs {txTotals.balance.toLocaleString()}</b><span>Current Balance</span></div>
                </div>

                <div className="ledger-wrap">
                  {tx.length === 0 && <div className="no-projects">No transactions yet — add your first income or expense above.</div>}
                  {tx.map(r => (
                    <div className="ledger-row" key={r.id}>
                      <div className="lr-date">{r.date || '—'}</div>
                      <div className="lr-desc">
                        <b>{zone7Esc(r.description || r.desc || '—')}</b>
                        <span>{zone7Esc(r.category || '')}</span>
                      </div>
                      <div className={'lr-amt ' + (r.type === 'expense' ? 'neg' : 'pos')}>
                        {r.type === 'expense' ? '−' : '+'}{' '}
                        {r.amount ? Number(r.amount).toLocaleString() : '0'}
                      </div>
                      <button className="btn btn-danger" style={{ padding: '6px 10px', fontSize: '0.72rem' }} onClick={() => onTxDelete(r.id)}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="view" style={view === 'events' ? { display: 'block' } : undefined}>
              <div className="panel">
                <h3>Club Events <span style={{ fontWeight: 500, fontSize: '0.78rem', color: 'rgba(27,24,54,0.5)' }}>(posted to the public events board)</span></h3>

                {!evEditing ? (
                  <>
                    <div className="baro-toolbar" style={{ marginBottom: 20 }}>
                      <p className="note">These appear on the website's Events board, in chronological order. Everyone can see what you've posted here.</p>
                    </div>
                    <div className="proj-list">
                      {events.length === 0 && <div className="no-projects">No events posted yet.</div>}
                      {events.map(ev => (
                        <div className="proj-item" key={ev.id} onClick={() => onEvClick(ev)}>
                          <div className="info"><h4>{zone7Esc(ev.title)}</h4><span>{ev.event_date && ev.event_date !== 'TBD' ? ev.event_date : 'Date TBD'}</span></div>
                          {ev.location && <span className="proj-code" style={{ marginLeft: 'auto' }}>{zone7Esc(ev.location)}</span>}
                        </div>
                      ))}
                    </div>
                    <div className="form-actions"><button className="btn btn-primary" type="button" onClick={() => { setEvEditing(true); setEvForm(emptyEventForm()); }}>+ New Event</button></div>
                  </>
                ) : (
                  <>
                    <div className="row2">
                      <div><label>Event Title</label><input type="text" placeholder="e.g. Diya-Style Gala" value={evForm.title} onChange={e => setEvForm(f => ({ ...f, title: e.target.value }))} /></div>
                      <div><label>Date</label><input type="date" value={evForm.date} onChange={e => setEvForm(f => ({ ...f, date: e.target.value }))} /></div>
                    </div>
                    <div style={{ marginBottom: 12 }}><label>Description</label><textarea rows="4" placeholder="What's this event about?" value={evForm.desc} onChange={e => setEvForm(f => ({ ...f, desc: e.target.value }))}></textarea></div>
                    <div style={{ marginBottom: 12 }}><label>RSVP Link (optional)</label><input type="url" placeholder="https://forms.gle/..." value={evForm.link} onChange={e => setEvForm(f => ({ ...f, link: e.target.value }))} /></div>
                    <div className="form-actions">
                      <button className="btn btn-primary" type="button" onClick={onSaveEvent}>Save Event</button>
                      <button className="btn btn-danger" type="button" onClick={onDeleteEvent}>Delete</button>
                      <button className="btn btn-ghost" type="button" onClick={resetEventForm}>Cancel</button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="view" style={view === 'guides' ? { display: 'block' } : undefined}>
              <div className="panel">
                <h3>Guides &amp; Document Repository <span style={{ fontWeight: 500, fontSize: '0.78rem', color: 'rgba(27,24,54,0.5)' }}>(hosted on the public website)</span></h3>
                <div className="baro-toolbar" style={{ marginBottom: 20 }}>
                  <p className="note">District guides and handbooks live on the public guides page. Upload a file and it appears there instantly.</p>
                </div>
                <div className="row2" style={{ marginBottom: 14 }}>
                  <div><label>Guide Title</label><input type="text" placeholder="e.g. Club Setup Handbook" value={gForm.title} onChange={e => setGForm(f => ({ ...f, title: e.target.value }))} /></div>
                  <div><label>Category</label><input type="text" placeholder="e.g. Governance / Events" value={gForm.category} onChange={e => setGForm(f => ({ ...f, category: e.target.value }))} /></div>
                </div>
                <div style={{ marginBottom: 12 }}><label>Description</label><textarea rows="2" placeholder="Short description shown on the guides page" value={gForm.desc} onChange={e => setGForm(f => ({ ...f, desc: e.target.value }))}></textarea></div>
                <div className="form-actions" style={{ marginBottom: 16 }}>
                  <button className="btn btn-ghost" type="button" onClick={() => gFileRef.current && gFileRef.current.click()}>📎 Choose File</button>
                  <button className="btn btn-primary" type="button" onClick={onGuideUpload}>+ Upload Guide</button>
                  <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,image/*" style={{ display: 'none' }} ref={gFileRef} onChange={() => {}} />
                </div>
                {gUploadMsg && <p className="note" style={{ color: gUploadMsg.color, marginBottom: 14 }}>{gUploadMsg.text}</p>}
                <div className="proj-list">
                  {guides.length === 0 && <div className="no-projects">No guides uploaded yet.</div>}
                  {guides.map(g => (
                    <div className="proj-item" key={g.id}>
                      <div className="info"><h4>{zone7Esc(g.title)}</h4><span>{g.category ? zone7Esc(g.category) + ' · ' : ''}{zone7Esc(g.file_name || '')}</span></div>
                      <a className="btn btn-ghost" style={{ marginLeft: 'auto', textDecoration: 'none' }} href={g.file_url} target="_blank" rel="noreferrer">View ↗</a>
                      <button className="btn btn-danger" onClick={() => onGuideDelete(g.id)}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="view" style={view === 'zrr' ? { display: 'block' } : undefined}>
              <div className="panel">
                <h3>Zonal Representatives (ZRRs) <span style={{ fontWeight: 500, fontSize: '0.78rem', color: 'rgba(27,24,54,0.5)' }}>(one per zone, shown on the public page)</span></h3>

                {!zrrEditing ? (
                  <>
                    <div className="baro-toolbar" style={{ marginBottom: 20 }}>
                      <p className="note">Each zone needs exactly one ZRR marked <b>current</b>. When you add a new one, the previous automatically steps down.</p>
                    </div>
                    <div className="proj-list">
                      {zrrs.length === 0 && <div className="no-projects">No ZRRs on file yet.</div>}
                      {zrrs.map(z => (
                        <div className="proj-item" key={z.id} onClick={() => loadZrrIntoForm(z)}>
                          <div className="info">
                            <h4>{zone7Esc(z.name)} {z.is_current ? <span className="baro-tag auto-tag">Current</span> : null}</h4>
                            <span>RY {z.years || '—'} · {zone7Esc(z.club || '')}</span>
                          </div>
                          {z.photo && <img src={z.photo} alt={zone7Esc(z.name)} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', marginLeft: 'auto' }} />}
                        </div>
                      ))}
                    </div>
                    <div className="form-actions"><button className="btn btn-primary" type="button" onClick={() => { setZrrEditing(true); setZrrForm(emptyGuestForm()); setZrrPhoto(''); }}>+ Add ZRR</button></div>
                  </>
                ) : (
                  <>
                    <div className="row2">
                      <div><label>Full Name</label><input type="text" placeholder="Rtr. Firstname Lastname" value={zrrForm.name} onChange={e => setZrrForm(f => ({ ...f, name: e.target.value }))} /></div>
                      <div><label>Rotary Year(s)</label><input type="text" placeholder="e.g. 26-27" value={zrrForm.years} onChange={e => setZrrForm(f => ({ ...f, years: e.target.value }))} /></div>
                    </div>
                    <div className="row2">
                      <div><label>Home Club</label><input type="text" placeholder="Rotaract Club of ..." value={zrrForm.club} onChange={e => setZrrForm(f => ({ ...f, club: e.target.value }))} /></div>
                      <div><label>Short Bio (optional)</label><input type="text" placeholder="One-liner for the timeline" value={zrrForm.bio} onChange={e => setZrrForm(f => ({ ...f, bio: e.target.value }))} /></div>
                    </div>
                    <label className="baro-multi-item" style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="checkbox" checked={!!zrrForm.isCurrent} onChange={e => setZrrForm(f => ({ ...f, isCurrent: e.target.checked }))} />
                      Mark as <b>current ZRR</b> (previous current steps down automatically)
                    </label>
                    <div style={{ marginTop: 14 }}><label>Photo</label>
                      <div className="photo-row">
                        {zrrPhoto && <img src={zrrPhoto} alt="ZRR" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover' }} />}
                        <button className="btn btn-ghost" type="button" onClick={() => zrrPhotoInputRef.current && zrrPhotoInputRef.current.click()}>Upload Photo</button>
                        <input type="file" accept="image/*" style={{ display: 'none' }} ref={zrrPhotoInputRef} onChange={onZrrPhoto} />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button className="btn btn-primary" type="button" onClick={onZrrSave}>{zrrSaving ? 'Saving…' : 'Save ZRR'}</button>
                      <button className="btn btn-danger" type="button" onClick={onZrrDelete}>Delete</button>
                      <button className="btn btn-ghost" type="button" onClick={resetZrrForm}>Cancel</button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="view" style={view === 'leadership' ? { display: 'block' } : undefined}>
              <div className="panel">
                <h3>District Leadership <span style={{ fontWeight: 500, fontSize: '0.78rem', color: 'rgba(27,24,54,0.5)' }}>(ZRR, Secretary, committee chairs — shown on the public page)</span></h3>

                {!leaderEditing ? (
                  <>
                    <div className="baro-toolbar" style={{ marginBottom: 20 }}>
                      <p className="note">Order here controls the order they appear on the website — edit and re-save entries to reorder.</p>
                    </div>
                    <div className="proj-list">
                      {leaders.length === 0 && <div className="no-projects">No leadership entries yet.</div>}
                      {leaders.map(l => (
                        <div className="proj-item" key={l.id} onClick={() => loadLeaderIntoForm(l)}>
                          <div className="info">
                            <h4>{zone7Esc(l.name)} <span className="baro-tag">{zone7Esc(l.role) || 'Leader'}</span></h4>
                            <span>{zone7Esc(l.role_full || '')}{l.club ? ' · ' + zone7Esc(l.club) : ''}</span>
                          </div>
                          {l.photo && <img src={l.photo} alt={zone7Esc(l.name)} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', marginLeft: 'auto' }} />}
                        </div>
                      ))}
                    </div>
                    <div className="form-actions"><button className="btn btn-primary" type="button" onClick={() => { setLeaderEditing(true); setLeaderForm(emptyLeaderForm()); setLeaderPhoto(''); }}>+ Add Leader</button></div>
                  </>
                ) : (
                  <>
                    <div className="row2">
                      <div><label>Full Name</label><input type="text" placeholder="Rtr. Firstname Lastname" value={leaderForm.name} onChange={e => setLeaderForm(f => ({ ...f, name: e.target.value }))} /></div>
                      <div><label>Role Code</label><input type="text" placeholder="e.g. ZRR / ZS / ZFC / ZPIC" value={leaderForm.role} onChange={e => setLeaderForm(f => ({ ...f, role: e.target.value }))} /></div>
                    </div>
                    <div className="row2">
                      <div><label>Full Role Title</label><input type="text" placeholder="e.g. Zonal Rotaract Representative" value={leaderForm.roleFull} onChange={e => setLeaderForm(f => ({ ...f, roleFull: e.target.value }))} /></div>
                      <div><label>Home Club</label><input type="text" placeholder="Rotaract Club of ..." value={leaderForm.club} onChange={e => setLeaderForm(f => ({ ...f, club: e.target.value }))} /></div>
                    </div>
                    <div style={{ marginBottom: 12 }}><label>Bio (optional)</label><textarea rows="2" placeholder="Short bio shown with their photo" value={leaderForm.bio} onChange={e => setLeaderForm(f => ({ ...f, bio: e.target.value }))}></textarea></div>
                    <div><label>Photo</label>
                      <div className="photo-row">
                        {leaderPhoto && <img src={leaderPhoto} alt="Leader" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover' }} />}
                        <button className="btn btn-ghost" type="button" onClick={() => leaderPhotoInputRef.current && leaderPhotoInputRef.current.click()}>Upload Photo</button>
                        <input type="file" accept="image/*" style={{ display: 'none' }} ref={leaderPhotoInputRef} onChange={onLeaderPhoto} />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button className="btn btn-primary" type="button" onClick={onLeaderSave}>{leaderSaving ? 'Saving…' : 'Save Leader'}</button>
                      <button className="btn btn-danger" type="button" onClick={onLeaderDelete}>Delete</button>
                      <button className="btn btn-ghost" type="button" onClick={resetLeaderForm}>Cancel</button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="view" style={view === 'guests' ? { display: 'block' } : undefined}>
              <div className="panel">
                <h3>Guest Requests &amp; Membership Applications <span style={{ fontWeight: 500, fontSize: '0.78rem', color: 'rgba(27,24,54,0.5)' }}>(everything sent through the website's contact forms)</span></h3>

                <div className="sec-title">Guest Requests <span style={{ fontWeight: 500, color: 'rgba(27,24,54,0.5)', textTransform: 'none', letterSpacing: 0 }}>({guests.length} total)</span></div>
                <div className="proj-list">
                  {guests.length === 0 && <div className="no-projects">No guest requests yet.</div>}
                  {guests.map(g => (
                    <div className="proj-item" key={g.id}>
                      <div className="info">
                        <h4>{zone7Esc(g.name)} <span className="baro-tag" style={STATUS_STYLE[g.status] || {}}>{zone7Esc(g.status || 'new')}</span></h4>
                        <span>{zone7Esc(g.email || '')}{g.phone ? ' · ' + zone7Esc(g.phone) : ''} · {zone7Esc(g.club || '') || '—'}{g.wants_visit ? ' · Wants club visit' : ''}</span>
                        {g.message && <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: 'rgba(27,24,54,0.65)' }}>{zone7Esc(g.message)}</p>}
                      </div>
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
                        <select className="guest-status-select" value={g.status || 'new'} onChange={e => onGuestStatus(g.id, e.target.value)}>
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="attended">Attended</option>
                          <option value="declined">Declined</option>
                        </select>
                        <button className="btn btn-danger" onClick={() => onGuestDelete(g.id)}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sec-title" style={{ marginTop: 28 }}>Membership Applications <span style={{ fontWeight: 500, color: 'rgba(27,24,54,0.5)', textTransform: 'none', letterSpacing: 0 }}>({apps.length} total)</span></div>
                <div className="proj-list">
                  {apps.length === 0 && <div className="no-projects">No membership applications yet.</div>}
                  {apps.map(a => (
                    <div className="proj-item" key={a.id}>
                      <div className="info">
                        <h4>{zone7Esc(a.name)} <span className="baro-tag" style={STATUS_STYLE[a.status] || {}}>{zone7Esc(a.status || 'new')}</span></h4>
                        <span>{zone7Esc(a.email || '')}{a.phone ? ' · ' + zone7Esc(a.phone) : ''} · {zone7Esc(a.club || '') || '—'}</span>
                        {a.message && <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: 'rgba(27,24,54,0.65)' }}>{zone7Esc(a.message)}</p>}
                      </div>
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
                        <select className="guest-status-select" value={a.status || 'new'} onChange={e => onAppStatus(a.id, e.target.value)}>
                          <option value="new">New</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="approved">Approved</option>
                          <option value="declined">Declined</option>
                        </select>
                        <button className="btn btn-danger" onClick={() => onAppDelete(a.id)}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="view" style={view === 'district' ? { display: 'block' } : undefined}>
              <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
                <iframe src="/district-overview?embed=1" title="District 3292 Overview" style={{ width: '100%', height: 2850, border: 'none', display: 'block', background: 'var(--cream)' }} loading="lazy"></iframe>
              </div>
            </div>

            <div className="view" style={view === 'distevents' ? { display: 'block' } : undefined}>
              <DistEventsPanel psMode={psMode} setPsMode={setPsMode} psNetShown={psNetShown} setPsNetShown={setPsNetShown} />
            </div>
          </div>
        </div>
      )}
      <div className={'toast' + (toast ? ' show' : '')}>{toast}</div>
    </SiteShell>
  );
}
/* __END__ */
