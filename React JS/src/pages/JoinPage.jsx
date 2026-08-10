import { Fragment, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteShell from '../components/layout/SiteShell';
import { ZONE7_DB } from '../data/zone7-data';
import pageCss from './join.css?inline';

const STEP_LABELS = ['About you', 'Why Rotaract', 'Club & submit'];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Not sure yet'];

const INTERESTS = [
  'Community Service',
  'Leadership Development',
  'Professional Development',
  'International Service',
  'Club Service & Fellowship',
  'Health & Blood Donation Drives'
];

const CLUB_OPTIONS = [
  'Rotaract Club of Balkumari',
  'Rotaract Club of Baneshwor',
  'Rotaract Club of Kathmandu Height',
  'Rotaract Club of Kathmandu West',
  'Rotaract Club of Liberty College',
  'Rotaract Club of New Road City Kathmandu',
  'Rotaract Club of Sankhu',
  'Rotaract Club of Sukedhara',
  'Rotaract Club of Tripureswor'
];

const initialForm = {
  fullname: '', email: '', phone: '', dob: '', bloodgroup: '', occupation: '', institution: '',
  interests: [], reason: '', contribution: '', prior_experience: '', referral: '', preferred_club: ''
};

export default function JoinPage() {
  const [step, setStep] = useState(0);
  const [f, setF] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const honeyRef = useRef(null);
  const botRef = useRef(null);

  const [g, setG] = useState({ fullname: '', email: '', club: '', phone: '', message: '' });
  const [gStatus, setGStatus] = useState(null);
  const [gSending, setGSending] = useState(false);
  const gHoneyRef = useRef(null);

  const setField = (key, value) => {
    setF((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const toggleInterest = (value) => {
    setF((prev) => {
      const has = prev.interests.includes(value);
      return { ...prev, interests: has ? prev.interests.filter((x) => x !== value) : [...prev.interests, value] };
    });
    setErrors((prev) => {
      if (!('interests' in prev)) return prev;
      const next = { ...prev };
      delete next.interests;
      return next;
    });
  };

  const validateStep = (i) => {
    const errs = {};

    if (i === 0) {
      if (!f.fullname.trim()) errs.fullname = 'Please enter your full name.';
      if (!f.email.trim()) errs.email = 'Please enter your email address.';
      else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.trim())) errs.email = 'Please enter a valid email address.';
      if (!f.phone.trim()) errs.phone = 'Please enter your phone / WhatsApp number.';
      else if (!/^\d{7,15}$/.test(f.phone.replace(/[\s+-]/g, ''))) errs.phone = 'Please enter a valid phone / WhatsApp number.';
      if (!f.dob) errs.dob = 'Please enter your date of birth.';
      else {
        const born = new Date(f.dob + 'T00:00:00');
        const age = Math.floor((Date.now() - born.getTime()) / (365.25 * 24 * 3600 * 1000));
        if (isNaN(age) || age < 18 || age > 30) errs.dob = 'Rotaract membership is for ages 18\u201330.';
      }
      if (!f.bloodgroup) errs.bloodgroup = 'Please select your blood group.';
      if (!f.occupation.trim()) errs.occupation = 'Please enter your current occupation.';
    }

    if (i === 1) {
      if (!f.interests.length) errs.interests = 'Please pick at least one area of service.';
      if (!f.reason.trim()) errs.reason = 'Please tell us why you want to join.';
      if (!f.prior_experience) errs.prior_experience = 'Please select Yes or No.';
    }

    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const next = () => {
    if (!validateStep(step)) return;
    if (step < 2) setStep(step + 1);
    else submitForm();
  };

  const submitForm = async () => {
    if (honeyRef.current?.value || botRef.current?.value) return; // honeypot — let bots through
    setSubmitting(true);
    setStatus(null);

    const payload = {
      fullname: f.fullname.trim(),
      email: f.email.trim(),
      phone: f.phone.trim(),
      age: (function () {
        const born = new Date((f.dob || '') + 'T00:00:00');
        if (isNaN(born)) return null;
        let a = new Date().getFullYear() - born.getFullYear();
        const m = new Date().getMonth() - born.getMonth();
        if (m < 0 || (m === 0 && new Date().getDate() < born.getDate())) a--;
        return (a >= 18 && a <= 30) ? a : null;
      })(),
      dob: f.dob.trim() || null,
      bloodgroup: f.bloodgroup.trim() || null,
      occupation: f.occupation.trim(),
      institution: f.institution.trim() || null,
      preferred_club: f.preferred_club.trim() || null,
      interests: f.interests.join(', ') || null,
      reason: f.reason.trim(),
      contribution: f.contribution.trim() || null,
      prior_experience: f.prior_experience.trim() || null,
      referral: f.referral.trim() || null
    };

    try {
      await ZONE7_DB.submitMembershipApplication(payload);
      fetch('/api/notify-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'application', data: payload })
      }).catch(() => {});
      setDone(true);
    } catch (err) {
      console.error('Membership application failed', err);
      const queue = JSON.parse(localStorage.getItem('zone7_pending_applications') || '[]');
      queue.push(payload);
      localStorage.setItem('zone7_pending_applications', JSON.stringify(queue));

      const lines = Object.keys(payload)
        .filter((k) => payload[k])
        .map((k) => k.replace(/_/g, ' ') + ': ' + payload[k])
        .join('\n');
      const mailto = 'mailto:ri3292zone7@gmail.com?subject=' +
        encodeURIComponent('Zone 7 Membership Application – ' + (payload.fullname || 'new member')) +
        '&body=' + encodeURIComponent(lines);

      setStatus({
        type: 'error',
        content: (
          <span>
            Your application was saved on this device, but sending failed. Please retry, or{' '}
            <a href={mailto}>email it to ri3292zone7@gmail.com</a> and we&rsquo;ll get you set up directly.
          </span>
        )
      });
    } finally {
      setSubmitting(false);
    }
  };

  const guestSubmit = async (e) => {
    e.preventDefault();
    setGStatus(null);
    if (gHoneyRef.current?.value) return;
    setGSending(true);

    const payload = {
      fullname: g.fullname.trim(),
      email: g.email.trim(),
      preferred_club: g.club.trim() || null,
      phone: g.phone.trim() || null,
      message: g.message.trim() || null
    };

    if (!payload.fullname || !payload.email) {
      setGSending(false);
      setGStatus({ type: 'error', text: 'Please add your name and email.' });
      return;
    }

    try {
      await ZONE7_DB.submitGuestRequest(payload);
      fetch('/api/notify-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'guest', data: payload })
      }).catch(() => {});
      setG({ fullname: '', email: '', club: '', phone: '', message: '' });
      setGStatus({ type: 'ok', text: 'Request sent! A Zone 7 coordinator will match you with a club meeting soon.' });
    } catch (err) {
      console.error('Guest request failed', err);
      setGStatus({ type: 'error', text: "Couldn't send right now, please try again, or email ri3292zone7@gmail.com directly." });
    } finally {
      setGSending(false);
    }
  };

  const progressPct = Math.round(((step + 1) / STEP_LABELS.length) * 100);

  const err = (key) => (errors[key] ? <div className="field-err">{errors[key]}</div> : null);
  const invalid = (key) => (errors[key] ? ' invalid' : '');

  return (
    <SiteShell current="" cta="home" title="Join Us | Zone 7 Rotaract" css={pageCss}>
      <header className="hero">
        <div className="hero-bg" aria-hidden="true">
          <span className="blob b1"></span>
          <span className="blob b2"></span>
          <span className="blob b3"></span>
          <svg className="deco d-gear" viewBox="0 0 24 24" fill="none"><path d="M12 2l1.4 3.2 3.4-.8 1.2 3.3 3.4 1-.8 3.4L24 12l-3.4 1.9.8 3.4-3.4 1-1.2 3.3-3.4-.8L12 24l-1.4-3.2-3.4.8-1.2-3.3-3.4-1 .8-3.4L0 12l3.4-1.9-.8-3.4 3.4-1L7.2 2.4l3.4.8L12 2z" fill="currentColor" /></svg>
          <svg className="deco d-spark1" viewBox="0 0 24 24" fill="none"><path d="M12 0l2.2 9.8L24 12l-9.8 2.2L12 24l-2.2-9.8L0 12l9.8-2.2L12 0z" fill="currentColor" /></svg>
          <svg className="deco d-spark2" viewBox="0 0 24 24" fill="none"><path d="M12 0l2.2 9.8L24 12l-9.8 2.2L12 24l-2.2-9.8L0 12l9.8-2.2L12 0z" fill="currentColor" /></svg>
          <svg className="deco d-heart" viewBox="0 0 24 24" fill="none"><path d="M12 20s-7-4.6-9.3-9C1.2 8.3 3 5 6.2 5c2 0 3.3 1.1 4 2.4h3.6C14.5 6.1 15.8 5 17.8 5 21 5 22.8 8.3 21.3 11c-2.3 4.4-9.3 9-9.3 9z" fill="currentColor" /></svg>
          <svg className="deco d-dot1" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="currentColor" /></svg>
          <svg className="deco d-dot2" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="currentColor" /></svg>
        </div>
        <div className="wrap">
          <div className="hero-grid">
            <div className="hero-text">
              <div className="eyebrow"><span className="dot"></span>Membership · Zone 7, District 3292</div>
              <h1>Fill this form, and you're <span className="hl">officially a Rotaractor.</span></h1>
              <p className="lead">There's no long application process. Tell us a bit about yourself, including your age and a little about your health, and share why you want to serve, and a Zone 7 club will welcome you in as a member.</p>
            </div>
            <div className="hero-art">
              <div className="hero-art-frame">
                <img src="/zone7_join_hero.webp" alt="Illustration of young Nepali Rotaractors planting a tree, holding a blood donation bag and books" width="900" height="615" fetchPriority="high" decoding="async" />
              </div>
              <div className="art-badge"><span className="ab-ico">❤️</span><span><b>5500+ Rotaractors</b> · 9 clubs in District 3292</span></div>
            </div>
          </div>

          <div className="why-grid">
            <div className="why-card c1">
              <div className="ico"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3l2.1 5.6 6 .6-4.5 4 1.3 5.9L12 16.4 7.1 19.1l1.3-5.9-4.5-4 6-.6L12 3z" fill="currentColor" /></svg></div>
              <h4>Real leadership, early</h4>
              <p>Run projects, manage budgets and lead teams while still in college or early career, gaining experience most people don't get for years.</p>
            </div>
            <div className="why-card c2">
              <div className="ico"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 20s-7-4.6-9.3-9C1.2 8.3 3 5 6.2 5c2 0 3.3 1.1 4 2.4h3.6C14.5 6.1 15.8 5 17.8 5 21 5 22.8 8.3 21.3 11c-2.3 4.4-9.3 9-9.3 9z" fill="currentColor" /></svg></div>
              <h4>Service that matters</h4>
              <p>Join hands-on community projects in health, education and the environment across the Kathmandu Valley.</p>
            </div>
            <div className="why-card c3">
              <div className="ico"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" /><path d="M3.5 12h17M12 3.5c2.5 2.3 3.8 5.2 3.8 8.5s-1.3 6.2-3.8 8.5c-2.5-2.3-3.8-5.2-3.8-8.5s1.3-6.2 3.8-8.5z" stroke="currentColor" strokeWidth="1.8" /></svg></div>
              <h4>A lifelong network</h4>
              <p>Connect with 5,500+ Rotaractors across District 3292, and Rotarians and Rotaractors worldwide.</p>
            </div>
          </div>
        </div>
      </header>

      <section className="form-section">
        <div className="wrap">
          <div className="form-card">
            {!done ? (
              <div id="form-wrap">
                <h2>Zone 7 Rotaract Membership Form</h2>
                <p className="intro">Rotaract membership is open to young adults aged 18&ndash;30. Fields marked <span className="req">*</span> are required. Your information is only used by Zone 7 and its clubs to process your membership, and it is never sold or shared externally.</p>

                <form id="joinForm" noValidate onSubmit={(e) => { e.preventDefault(); }}>
                  <p style={{ position: 'absolute', left: -9999 }}>
                    <label htmlFor="honey">Don't fill this out if you're human: <input id="honey" name="_honey" ref={honeyRef} /></label>
                    <input name="bot-field" tabIndex={-1} autoComplete="off" ref={botRef} />
                  </p>

                  <div className="step-progress" aria-label="Form progress">
                    <div className="step-progress-bar"><i style={{ width: `${progressPct}%` }}></i></div>
                    <div className="step-dots">
                      {STEP_LABELS.map((label, i) => (
                        <Fragment key={label}>
                          <span className={`step-dot${step === i ? ' active' : ''}${step > i ? ' done' : ''}`} data-step={i + 1}>{i + 1}</span>
                          {i < STEP_LABELS.length - 1 ? <span className="step-line"></span> : null}
                        </Fragment>
                      ))}
                    </div>
                    <div className="step-labels">
                      {STEP_LABELS.map((label, i) => (
                        <span key={label} data-label={i + 1} className={step === i ? 'on' : ''}>{label}</span>
                      ))}
                    </div>
                  </div>

                  <div className={`form-step${step === 0 ? ' active' : ''}`} data-step="1">
                    <div className="form-group">
                      <label htmlFor="fullname">Full Name <span className="req">*</span></label>
                      <input type="text" id="fullname" name="fullname" required placeholder="As per your citizenship / ID" value={f.fullname} onChange={(e) => setField('fullname', e.target.value)} className={invalid('fullname')} />
                      {err('fullname')}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="email">Email Address <span className="req">*</span></label>
                        <input type="email" id="email" name="email" required placeholder="you@example.com" value={f.email} onChange={(e) => setField('email', e.target.value)} className={invalid('email')} />
                        {err('email')}
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone">Phone / WhatsApp Number <span className="req">*</span></label>
                        <input type="tel" id="phone" name="phone" required placeholder="98XXXXXXXX" value={f.phone} onChange={(e) => setField('phone', e.target.value)} className={invalid('phone')} />
                        {err('phone')}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="dob">Date of Birth <span className="req">*</span><span className="hint">Rotaract membership is open to ages 18&ndash;30</span></label>
                        <input type="date" id="dob" name="dob" required value={f.dob} onChange={(e) => setField('dob', e.target.value)} className={invalid('dob')} />
                        {err('dob')}
                      </div>
                      <div className="form-group">
                        <label htmlFor="bloodgroup">Blood Group <span className="req">*</span><span className="hint">Used for club blood-donation drives &amp; emergencies</span></label>
                        <select id="bloodgroup" name="bloodgroup" required value={f.bloodgroup} onChange={(e) => setField('bloodgroup', e.target.value)} className={invalid('bloodgroup')}>
                          <option value="" disabled>Select your blood group</option>
                          {BLOOD_GROUPS.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                        {err('bloodgroup')}
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="occupation">Current Occupation <span className="req">*</span></label>
                      <input type="text" id="occupation" name="occupation" required placeholder="Student, working professional, etc." value={f.occupation} onChange={(e) => setField('occupation', e.target.value)} className={invalid('occupation')} />
                      {err('occupation')}
                    </div>

                    <div className="form-group">
                      <label htmlFor="institution">College / Workplace</label>
                      <input type="text" id="institution" name="institution" placeholder="Name of your college or organization" value={f.institution} onChange={(e) => setField('institution', e.target.value)} />
                    </div>
                  </div>

                  <div className={`form-step${step === 1 ? ' active' : ''}`} data-step="2">
                    <div className="form-group">
                      <fieldset>
                        <legend>Which areas of service interest you? <span className="req">*</span></legend>
                        <div className="check-grid">
                          {INTERESTS.map((interest) => (
                            <label key={interest} className="check-item">
                              <input
                                type="checkbox"
                                name="interests[]"
                                value={interest}
                                checked={f.interests.includes(interest)}
                                onChange={() => toggleInterest(interest)}
                              /> {interest}
                            </label>
                          ))}
                        </div>
                        {err('interests')}
                      </fieldset>
                    </div>

                    <div className="form-group">
                      <label htmlFor="reason">Why do you want to join Rotaract? <span className="req">*</span><span className="hint">Tell us what draws you to service, leadership, or the Rotaract community, and be as specific as you like</span></label>
                      <textarea id="reason" name="reason" required placeholder="e.g. I want to give back to my community, build leadership skills, meet like-minded young people, and take on real responsibility outside the classroom..." value={f.reason} onChange={(e) => setField('reason', e.target.value)} className={invalid('reason')}></textarea>
                      {err('reason')}
                    </div>

                    <div className="form-group">
                      <label htmlFor="contribution">What skills or experience could you bring to a club?</label>
                      <textarea id="contribution" name="contribution" placeholder="e.g. event planning, design, fundraising, teaching, medical background, social media..." value={f.contribution} onChange={(e) => setField('contribution', e.target.value)}></textarea>
                    </div>

                    <div className="form-group">
                      <fieldset>
                        <legend>Have you been part of Interact, Rotaract, or Rotary before?</legend>
                        <div className="radio-row">
                          <label className="radio-item"><input type="radio" name="prior_experience" value="Yes" required checked={f.prior_experience === 'Yes'} onChange={() => setField('prior_experience', 'Yes')} /> Yes</label>
                          <label className="radio-item"><input type="radio" name="prior_experience" value="No" required checked={f.prior_experience === 'No'} onChange={() => setField('prior_experience', 'No')} /> No</label>
                        </div>
                        {err('prior_experience')}
                      </fieldset>
                    </div>

                    <div className="form-group">
                      <label htmlFor="referral">How did you hear about Zone 7 Rotaract?</label>
                      <input type="text" id="referral" name="referral" placeholder="Friend, Instagram, a club event, etc." value={f.referral} onChange={(e) => setField('referral', e.target.value)} />
                    </div>
                  </div>

                  <div className={`form-step${step === 2 ? ' active' : ''}`} data-step="3">
                    <div className="form-group">
                      <label htmlFor="preferred_club">Preferred Zone 7 Club <span className="hint">Pick the club you'd like to join; not sure yet? Leave "Help me match" and the zone team will place you</span></label>
                      <select id="preferred_club" name="preferred_club" value={f.preferred_club} onChange={(e) => setField('preferred_club', e.target.value)}>
                        <option value="">Not sure yet — help me match</option>
                        {CLUB_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="next-strip">
                      <h4>What happens after you apply?</h4>
                      <ol>
                        <li><span className="n">1</span><span><b>We receive your form</b> &mdash; it goes straight to the Zone 7 team.</span></li>
                        <li><span className="n">2</span><span><b>Your club reaches out</b> &mdash; the club you picked (or a matched one) contacts you.</span></li>
                        <li><span className="n">3</span><span><b>You join a meeting</b> &mdash; meet the members, and if you love it, your membership begins.</span></li>
                      </ol>
                    </div>

                    <p className="social-proof"><b>Join 5500+ Rotaractors</b> across 9 clubs in District 3292 &mdash; no fees, no prior experience needed.</p>

                    {status ? <div className={`form-status ${status.type}`} id="formStatus">{status.content}</div> : null}
                  </div>

                  <div className="step-nav">
                    {step > 0 ? (
                      <button type="button" className="btn-back" aria-label="Go back" onClick={() => setStep(step - 1)}>&#8592; Back</button>
                    ) : null}
                    <button type="button" className="btn-next" id="stepNext" disabled={submitting} onClick={next}>
                      {submitting ? 'Submitting...' : (step === STEP_LABELS.length - 1 ? 'Submit & Become a Rotaractor' : 'Continue →')}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="success-panel" id="successPanel" style={{ display: 'block' }}>
                <div className="mark">✓</div>
                <img src="/zone7_join_hero_b.webp" alt="Illustration of young Rotaractors celebrating" width="900" height="615" loading="lazy" decoding="async" className="success-art" />
                <h2>Welcome, Rotaractor!</h2>
                <p>Thank you for filling out the form, you've officially taken the first step to becoming a Rotaractor. A Zone 7 club will be in touch with you shortly to complete your onboarding.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="comm-section">
        <div className="wrap">
          <span className="section-tag">Where You'll Fit</span>
          <h2 style={{ fontFamily: "'Poppins'", fontSize: 'clamp(1.7rem,3vw,2.3rem)', maxWidth: 620 }}>Every member serves through a committee.</h2>
          <p className="sub" style={{ color: 'rgba(27,24,54,0.65)', fontSize: '1rem', maxWidth: 640, lineHeight: 1.7, margin: '14px 0 36px' }}>New members join one of five committees, each with its own goals and projects for the year. Pick based on what you actually enjoy.</p>
          <div className="comm-grid">
            <Link className="comm-card" to="/club-guides" style={{ '--ac': '#E11A6E' }}>
              <span className="comm-ico">🎉</span>
              <h4>Club Service</h4>
              <p>Keeps the club alive: meetings, orientation, fellowship events, installations and membership growth.</p>
            </Link>
            <Link className="comm-card" to="/club-guides" style={{ '--ac': '#059669' }}>
              <span className="comm-ico">🩸</span>
              <h4>Community Service</h4>
              <p>The projects people see: blood drives, health camps, school support, environment and awareness campaigns.</p>
            </Link>
            <Link className="comm-card" to="/club-guides" style={{ '--ac': '#2563EB' }}>
              <span className="comm-ico">🌍</span>
              <h4>International Service</h4>
              <p>Twinship, letterhead exchanges, youth exchanges and joint events with clubs abroad.</p>
            </Link>
            <Link className="comm-card" to="/club-guides" style={{ '--ac': '#F2A900' }}>
              <span className="comm-ico">🎓</span>
              <h4>Professional Development</h4>
              <p>Skills that outlast Rotaract: public speaking, resume clinics, first-aid training, video editing, podcasting.</p>
            </Link>
            <Link className="comm-card" to="/club-guides" style={{ '--ac': '#1B1836' }}>
              <span className="comm-ico">💰</span>
              <h4>Finance</h4>
              <p>Budgets, dues, fundraising and transparent money management, the club's trust backbone.</p>
            </Link>
            <Link className="comm-card comm-quiz" to="/quiz" style={{ '--ac': '#A80F52' }}>
              <span className="comm-ico">🧠</span>
              <h4>Think you know Rotaract?</h4>
              <p>Take the 2-minute knowledge quiz and see where you stand before your first meeting.</p>
              <span className="comm-go">Start the quiz →</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="try-band">
        <div className="wrap">
          <div className="try-grid">
            <div className="try-card try-meet">
              <span className="section-tag">Try It First</span>
              <h3>Show up before you sign up.</h3>
              <p className="try-lead">Every Zone 7 club runs on the standard Rotaract rhythm of meetings and fellowship. You're welcome as a guest at any of it. No form required, no commitment.</p>
              <ul className="rhythm-list">
                <li><b>Regular meetings</b><span>the club's heartbeat. Clubs aim for 24 a year, guests welcome any week</span></li>
                <li><b>Board meetings</b><span>run by each club's elected officers. The monthly planning engine</span></li>
                <li><b>2 club assemblies</b><span>a year, where members vote on the club's direction</span></li>
                <li><b>Fellowships</b><span>hikes, picnics, festival nights and birthday celebrations</span></li>
              </ul>
              <p className="try-foot">Contact the club you're interested in (every profile has an email button) and ask which meeting to drop into.</p>
            </div>
            <div className="try-card try-guest">
              <div className="guest-head">
                <span className="guest-ico">👋</span>
                <div>
                  <h3>Request a guest visit</h3>
                  <p className="try-lead">Not sure which club fits? Tell the zone and we'll match you with the right meeting to attend.</p>
                </div>
              </div>
              <form id="guestForm" noValidate onSubmit={guestSubmit}>
                <p style={{ position: 'absolute', left: -9999 }}>
                  <label htmlFor="gHoney">Don't fill this out if you're human: <input id="gHoney" name="_honey" ref={gHoneyRef} /></label>
                </p>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="gfullname">Full name <span className="req">*</span></label>
                    <input type="text" id="gfullname" name="fullname" required placeholder="Your name" value={g.fullname} onChange={(e) => setG((p) => ({ ...p, fullname: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gemail">Email <span className="req">*</span></label>
                    <input type="email" id="gemail" name="email" required placeholder="you@example.com" value={g.email} onChange={(e) => setG((p) => ({ ...p, email: e.target.value }))} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="gclub">Preferred club</label>
                    <select id="gclub" name="preferred_club" value={g.club} onChange={(e) => setG((p) => ({ ...p, club: e.target.value }))}>
                      <option value="">Any club is fine</option>
                      {CLUB_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="gphone">Phone <span className="hint">optional</span></label>
                    <input type="tel" id="gphone" name="phone" placeholder="98XXXXXXXX" value={g.phone} onChange={(e) => setG((p) => ({ ...p, phone: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="gmsg">Anything you'd like to know?</label>
                  <textarea id="gmsg" name="message" rows="3" placeholder="e.g. Is there a meeting this week? Do I need to be a member first?" value={g.message} onChange={(e) => setG((p) => ({ ...p, message: e.target.value }))}></textarea>
                </div>
                <div className="guest-perks">
                  <span>No fees</span><span>No commitment</span><span>Meet members first</span>
                </div>
                <button type="submit" className="guest-btn" id="guestBtn" disabled={gSending}>{gSending ? 'Sending...' : <><span>Request a Guest Visit</span> <span aria-hidden="true">&#8594;</span></>}</button>
                {gStatus ? <p className={`form-status ${gStatus.type}`} id="guestStatus" aria-live="polite">{gStatus.text}</p> : null}
              </form>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
