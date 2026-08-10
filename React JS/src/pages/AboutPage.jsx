import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SiteShell from '../components/layout/SiteShell';
import { ZONE7_DB, CLUB_DIRECTORY } from '../data/zone7-data';
import pageCss from './about.css?inline';

function initials(name) {
  return String(name || '').replace(/^Rtr\.\s*/, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function AboutPage() {
  const [zrrs, setZrrs] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const rootRef = useRef(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [z, l] = await Promise.all([
        ZONE7_DB.getZRRs().catch(() => []),
        ZONE7_DB.getLeadership().catch(() => [])
      ]);
      if (!alive) return;
      setZrrs(z || []);
      setLeaders(l || []);
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray([
        '.hero-grid', '.hero-photo',
        '.rot-explain .wrap', '.pullquote-card',
        '.do-grid', '.interact-band .wrap',
        '.purpose-grid', '.journey-head', '.journey-track',
        '.clubs-grid', '.join-card'
      ]).forEach((el) => {
        gsap.from(el, {
          y: 30, opacity: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%' }
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <SiteShell
      current="about"
      cta="join"
      title="About Zone 7 | Rotaract District 3292 Nepal-Bhutan"
      css={pageCss}
    >
      <div ref={rootRef}>
        <header className="hero">
          <div className="wrap">
            <div className="hero-grid">
              <div>
                <div className="eyebrow"><span className="dot"></span>Rotaract District 3292 · Nepal-Bhutan</div>
                <h1>Nine clubs, one valley,<br /><span className="hl">one purpose: service.</span></h1>
                <p className="lead">Zone 7 is the zonal home for Rotaract clubs across the Kathmandu Valley. Young leaders, aged 18 to 30, run their own clubs, fund their own projects, and show up for their communities without waiting to be told how.</p>
                <div className="hero-stats">
                  <div className="stat"><b>9</b><span>Clubs in Zone 7</span></div>
                  <div className="stat"><b>180+</b><span>Clubs districtwide</span></div>
                  <div className="stat"><b>5,500+</b><span>Rotaractors, D3292</span></div>
                  <div className="stat"><b>6</b><span>ZRRs since 2021-22</span></div>
                </div>
                <div className="hero-links">
                  <Link className="hlink primary" to="/join">Become a Member →</Link>
                  <Link className="hlink ghost" to="/about#allclubs">Meet the Nine Clubs</Link>
                </div>
              </div>
              <div className="hero-team-card">
                <span className="hero-team-label">RY 2026–27</span>
                <h4>This year's Zone 7 team</h4>
                <div className="hero-team-list">
                  {leaders.length
                    ? leaders.map((p, i) => (
                        <Link key={p.id || i} className="hero-team-row" to="/#leadership">
                          <div className="hero-team-avatar">
                            {p.photo
                              ? <img src={`/${p.photo}`} alt={p.name} loading="lazy" />
                              : initials(p.name)}
                          </div>
                          <div className="hero-team-info">
                            <h5>{p.name}</h5>
                            <div className="role">{p.role} · {p.role_full || ''}</div>
                            {p.club ? <div className="club">{p.club}</div> : null}
                          </div>
                        </Link>
                      ))
                    : <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Team info will appear here once added by the zone team.</div>}
                </div>
                <div className="hero-team-foot">Guiding all nine clubs through the current Rotary year.</div>
              </div>
            </div>
          </div>
        </header>

        <div className="hero-photo">
          <div className="frame">
            <img src="/zone7_cover.jpg" alt="Rotaractors from Zone 7 clubs out in the Kathmandu Valley" width="1180" height="560" fetchPriority="high" />
            <span className="hp-chip hp1">🩸 Blood drives</span>
            <span className="hp-chip hp2">🌳 Plantations</span>
            <span className="hp-chip hp3">🤝 Fellowship</span>
          </div>
        </div>

        <section className="section rot-explain">
          <div className="wrap">
            <span className="section-tag">The Basics</span>
            <h2>What Rotaract actually is.</h2>
            <div className="rot-grid">
              <div className="rot-copy">
                <p>Rotaract is Rotary International's club for young adults, sponsored by a local Rotary club for mentorship and credibility. But the members plan it, fund it and run it themselves. Nobody hands a Rotaract club its agenda.</p>
                <p>That's why a 21-year-old college student can run a district-recognized blood donation drive, and a Rotaractor in their first job can manage a club's annual budget. It's a leadership training ground that happens to run on real community service.</p>
                <div className="rot-chips">
                  <span className="rot-chip c1">🎂 Ages 18–30</span>
                  <span className="rot-chip c2">🚀 Self-run, self-funded</span>
                  <span className="rot-chip c3">🔓 Independent since 2020</span>
                </div>
              </div>
              <div className="pillars">
                <div className="pillar p1"><span className="num">01</span>
                  <div className="ico">🤝</div>
                  <div><h4>Run by members, for members</h4><p>Every officer, from President to Secretary to Treasurer, is a Rotaractor elected by the club for a one-year term.</p></div>
                </div>
                <div className="pillar p2"><span className="num">02</span>
                  <div className="ico">🎓</div>
                  <div><h4>Service <em>and</em> skill-building</h4><p>Projects double as leadership practice. Budgeting, public speaking, negotiation, event execution. All of it learned by doing.</p></div>
                </div>
                <div className="pillar p3"><span className="num">03</span>
                  <div className="ico">🌏</div>
                  <div><h4>Locally rooted, globally connected</h4><p>Every club sits inside a Rotary district and a worldwide network of twin clubs and shared values.</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pullquote wrap">
          <div className="pullquote-card">
            <p>"The Vision is Clear. The Mission is Ours. The Future is Together."</p>
            <span>Rotaract District 3292 · Nepal &amp; Bhutan, RY 2026–27</span>
          </div>
        </section>

        <section className="section" id="whatwedo">
          <div className="wrap">
            <span className="section-tag">What Zone 7 Does</span>
            <h2>Real projects, run by real clubs, every week of the year.</h2>
            <p className="sub">Across Zone 7's nine clubs, service work spans a wide range of causes. Every event gets logged, reported and counted toward District 3292's official club-excellence barometer. This is what a Rotary year in Zone 7 actually looks like on the ground.</p>
            <div className="do-grid">
              <div className="do-card"><span className="ico">🩸</span><h4>Health &amp; Blood Donation</h4><p>Blood drives run with the Nepal Red Cross Society, health camps, and hygiene-awareness sessions for schoolchildren.</p></div>
              <div className="do-card"><span className="ico">📚</span><h4>Education &amp; Literacy</h4><p>Literacy drives, school workshops, and mentorship programs under Rotaract's Basic Education &amp; Literacy focus area.</p></div>
              <div className="do-card"><span className="ico">🌳</span><h4>Environment</h4><p>Tree plantations run alongside sponsoring Rotary clubs, from Tarkeshwor Nagarpalika to river and neighborhood clean-ups.</p></div>
              <div className="do-card"><span className="ico">🎓</span><h4>Professional Development</h4><p>Career talks, entrepreneurship bootcamps and skill workshops. It's Rotaract's fourth Avenue of Service, and one of the most valued.</p></div>
              <div className="do-card"><span className="ico">🌍</span><h4>International Service</h4><p>Twin-club partnerships and joint online sessions with clubs abroad. The international avenue runs on friendships, not just formality.</p></div>
              <div className="do-card"><span className="ico">🤝</span><h4>Fellowship &amp; Fundraising</h4><p>Installation ceremonies, goodwill visits between clubs, and public fundraisers like carnivals and comedy nights for local causes.</p></div>
              <div className="do-card"><span className="ico">🏛️</span><h4>Club Administration</h4><p>DRR visits, club assemblies, and governance work that keeps all nine clubs compliant with District 3292's standards.</p></div>
              <div className="do-card"><span className="ico">📣</span><h4>Public Image</h4><p>Documenting and sharing every project so the work reaches beyond the people in the room. Social media, photography, storytelling.</p></div>
            </div>
          </div>
        </section>

        <section className="interact-band">
          <div className="wrap">
            <div className="interact-card">
              <div className="interact-copy">
                <span className="section-tag" style={{ color: 'var(--gold)' }}>Interact · Ages 12–18</span>
                <h2>Service starts younger.</h2>
                <p>Interact is Rotary's school-based program for students aged 12 to 18, and Rotaract clubs are natural mentors. They share projects, coach student boards and run joint drives with school clubs, so the next generation of service leaders is already growing up.</p>
                <p className="interact-how">Is your school interested in starting an Interact club? Email <a href="mailto:ri3292zone7@gmail.com">ri3292zone7@gmail.com</a> and Zone 7 will connect you with a Rotaract club that can support and guide you.</p>
              </div>
              <div className="interact-badge">
                <img src="/images/interact-logo.png" alt="Interact In Action logo" className="interact-logo" />
                <p>Interaction in Action</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section purpose">
          <div className="wrap">
            <span className="section-tag">About Us</span>
            <h2 style={{ marginBottom: 0 }}>Why Zone 7 exists.</h2>
            <div className="purpose-grid" style={{ marginTop: 44 }}>
              <div className="purpose-copy">
                <p>District 3292 spans Nepal and Bhutan and is split into zones so that clubs get support at a scale that actually works. Close enough for a Zonal Rotaract Representative to know every club president by name. Small enough that a shared calendar and a WhatsApp group can hold it together. Yet connected enough to plug into 180+ clubs and 5,500+ Rotaractors districtwide.</p>
                <p><b>Zone 7 is that layer for the Kathmandu Valley.</b> It exists to do three things well: keep nine independently-run clubs coordinated instead of siloed, carry district standards and opportunities down to club level, and carry club achievements back up so they get recognized.</p>
                <div className="purpose-list">
                  <div className="purpose-item"><span className="n">01</span><div><h5>Coordinate, don't control</h5><p>Each club sets its own goals and runs its own projects. Zone 7's job is to connect them, not direct them.</p></div></div>
                  <div className="purpose-item"><span className="n">02</span><div><h5>Raise the floor</h5><p>Shared training (COTS), shared events, and a shared barometer mean even the newest club can hit district standards fast.</p></div></div>
                  <div className="purpose-item"><span className="n">03</span><div><h5>Make the work visible</h5><p>From this site's project mosaic to the DRR visit reports, Zone 7 makes sure what clubs actually do doesn't stay invisible.</p></div></div>
                </div>
              </div>
              <div className="purpose-card">
                <span className="k">RY 2026–27 District Theme</span>
                <h3>10 Strategic Goals, One District</h3>
                <p>District 3292's year runs on ten goals, from strengthening transparency and adopting club-centric governance, to driving membership growth and expanding international exposure. Every Zone 7 club's barometer score ties back to this same list. So a project logged in Baneshwor and a project logged in Sankhu are working toward the exact same district-wide picture.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="journey wrap" id="journey">
          <div className="journey-head">
            <span className="section-tag">A Line of Leadership</span>
            <h2>Zone 7's journey, told through its ZRRs.</h2>
            <p className="sub" style={{ margin: '0 auto' }}>Every Rotary year, one Rotaractor takes on the Zonal Rotaract Representative role. That person holds Zone 7's nine clubs together for that year. Here's who's carried it so far.</p>
          </div>
          <div className="journey-track">
            {zrrs.length
              ? zrrs.map((z, i) => (
                  <Link key={z.id || i} className={`journey-item${z.is_current ? ' current' : ''}`} to="/#leadership">
                    <div className="journey-avatar">
                      {z.photo
                        ? <img src={`/${z.photo}`} alt={z.name} loading="lazy" />
                        : initials(z.name)}
                    </div>
                    <div className="journey-body">
                      <div className="journey-meta">
                        <span className="journey-years">RY 20{String(z.years || '').replace('-', '–20')}</span>
                        {z.is_current ? <span className="journey-tag">Current ZRR</span> : null}
                      </div>
                      <h4>Rtr. {z.name}</h4>
                      {z.club ? <div className="journey-club">{z.club}</div> : null}
                      <p className="bio">{z.bio || (z.is_current
                        ? "Currently serving as Zone 7's Rotaract Representative, guiding the zone's nine clubs through this year's goals and events."
                        : "Served as Zone 7's Rotaract Representative, guiding the zone's clubs through that Rotary year.")}</p>
                    </div>
                  </Link>
                ))
              : <div style={{ textAlign: 'center', color: 'rgba(27,24,54,0.4)', fontSize: '0.9rem', padding: '30px 0' }}>ZRR history will appear here once added by the zone team.</div>}
          </div>
        </section>

        <section className="section" id="allclubs">
          <div className="wrap">
            <span className="section-tag">The Nine</span>
            <h2>Every club that makes up Zone 7.</h2>
            <p className="sub">Each one independently run, each one chartered in a different year, all nine reporting into the same zone. Tap any club to see its full profile and project history.</p>
            <div className="clubs-grid">
              {Object.entries(CLUB_DIRECTORY).map(([slug, c]) => (
                <Link key={slug} className="club-card" to={`/club/${encodeURIComponent(slug)}`}>
                  <div className="club-mark"><img src={`/${c.logo}`} alt={`${c.name} logo`} loading="lazy" /></div>
                  <div><h4>{c.name.replace('Rotaract Club of ', '')}</h4><p>@{c.ig}</p></div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="join-cta wrap">
          <div className="join-card">
            <h2>Want to be part of the next chapter?</h2>
            <p>Membership is open to anyone aged 18–30 in the Kathmandu Valley. Fill out one short form and a Zone 7 club will welcome you in.</p>
            <Link to="/join" className="btn btn-primary">Fill the Join Form →</Link>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
