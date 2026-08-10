import { useEffect, useMemo, useState } from 'react';
import SiteShell from '../components/layout/SiteShell';
import { jsPDF } from 'jspdf';
import { ZONE7_DB, CLUB_DIRECTORY, CLUB_LETTERHEAD } from '../data/zone7-data';
import pageCss from './club-tools.css?inline';

const CLUBS = Object.keys(CLUB_DIRECTORY);

const FALLBACK_CLUB_NAME = slug => 'Rotaract Club of ' + slug.charAt(0).toUpperCase() + slug.slice(1);

const clubNameOf = slug => (CLUB_DIRECTORY[slug] ? CLUB_DIRECTORY[slug].name : FALLBACK_CLUB_NAME(slug));

const emptyMinutes = () => ({
  title: '', date: '', day: '', venue: '', start: '', end: '',
  chair: '', secretary: '',
  open: [], happy: [], agenda: [],
  apologies: '', prevApproval: '',
  disc: [], remarks: [], info: [],
  thanks: '', saa: '',
  aGen: '0', aBoard: '0', aGuest: '0', aVisRac: '0', aVisRot: '0', aDist: '0',
  sSpecial: '', sTotal: '', next: '', adjourn: '',
  id: null
});

const STR_PLACEHOLDER = {
  open: 'e.g. SAA notified attendees the meeting has started.',
  happy: 'e.g. Rtr. X was happy to attend after 4 months.',
  agenda: 'e.g. Club Activities Review and Updates',
  info: 'e.g. ID cards have arrived at the club.'
};

export default function ClubToolsPage() {
  const [view, setView] = useState('login');
  const [loginMode, setLoginMode] = useState('club');
  const [loginClub, setLoginClub] = useState(CLUBS[0]);
  const [loginPw, setLoginPw] = useState('');
  const [clubErr, setClubErr] = useState(false);
  const [zonalPw, setZonalPw] = useState('');
  const [zonalErr, setZonalErr] = useState(false);
  const [club, setClub] = useState(CLUBS[0]);
  const [isZonal, setIsZonal] = useState(false);
  const [tab, setTab] = useState('minutes');

  const [ci, setCi] = useState({ sponsor: '', chartered: '', district: '3292 Nepal and Bhutan', motto: '', ry: '' });
  const [m, setM] = useState(emptyMinutes());
  const [savedMinutes, setSavedMinutes] = useState([]);
  const [tx, setTx] = useState([]);
  const [txForm, setTxForm] = useState({ date: '', type: 'income', amount: '', category: '', desc: '' });

  const key = (slug, name) => `ct_${slug}_${name}`;
  const lsGet = (slug, name, def) => {
    try { return JSON.parse(localStorage.getItem(key(slug, name))) || def; } catch (e) { console.warn('ct ls read failed', e); return def; }
  };
  const lsSet = (slug, name, val) => localStorage.setItem(key(slug, name), JSON.stringify(val));

  const loadAll = (slug) => {
    let savedCi = lsGet(slug, 'clubinfo', {}) || {};
    if (!savedCi.sponsor && !savedCi.chartered && CLUB_LETTERHEAD[slug]) {
      savedCi = {
        sponsor: CLUB_LETTERHEAD[slug].sponsor,
        chartered: CLUB_LETTERHEAD[slug].chartered,
        district: '3292 Nepal and Bhutan'
      };
    }
    setCi({ sponsor: '', chartered: '', district: '3292 Nepal and Bhutan', motto: '', ry: '', ...savedCi });
    setM(emptyMinutes());
    setSavedMinutes(lsGet(slug, 'minutes', []));
    setTx(lsGet(slug, 'tx', []));
  };

  const enterDashboard = (slug, zonal) => {
    setIsZonal(!!zonal);
    setClub(slug);
    setView('dashboard');
    setTab('minutes');
    loadAll(slug);
  };

  useEffect(() => {
    if (ZONE7_DB.isZonal()) { enterDashboard(CLUBS[0], true); return; }
    const c = ZONE7_DB.currentClub();
    if (c && CLUB_DIRECTORY[c]) enterDashboard(c, false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const doClubLogin = () => {
    if (ZONE7_DB.login(loginClub, loginPw)) { setClubErr(false); enterDashboard(loginClub, false); }
    else setClubErr(true);
  };

  const doZonalLogin = () => {
    if (ZONE7_DB.loginZonal(zonalPw)) { setZonalErr(false); enterDashboard(CLUBS[0], true); }
    else setZonalErr(true);
  };

  const doLogout = () => {
    ZONE7_DB.logout();
    ZONE7_DB.logoutZonal();
    setView('login');
    setLoginPw('');
    setZonalPw('');
    setClubErr(false);
    setZonalErr(false);
  };

  const onClubPick = (e) => {
    const slug = e.target.value;
    setClub(slug);
    loadAll(slug);
  };

  const onCiChange = (field, value) => {
    const next = { ...ci, [field]: value };
    setCi(next);
    lsSet(club, 'clubinfo', next);
  };

  const setField = (field, value) => setM(prev => ({ ...prev, [field]: value }));

  const setStrItem = (k, i, val) => setM(prev => {
    const arr = [...prev[k]];
    arr[i] = val;
    return { ...prev, [k]: arr };
  });

  const setDiscField = (i, f, val) => setM(prev => ({
    ...prev,
    disc: prev.disc.map((d, j) => (j === i ? { ...d, [f]: val } : d))
  }));

  const setRemarkField = (i, f, val) => setM(prev => ({
    ...prev,
    remarks: prev.remarks.map((r, j) => (j === i ? { ...r, [f]: val } : r))
  }));

  const addItem = (k) => {
    if (k === 'disc') setM(prev => ({ ...prev, disc: [...prev.disc, { t: '', d: '' }] }));
    else if (k === 'remark') setM(prev => ({ ...prev, remarks: [...prev.remarks, { who: '', text: '' }] }));
    else setM(prev => ({ ...prev, [k]: [...prev[k], ''] }));
  };

  const removeItem = (k, i) => setM(prev => ({ ...prev, [k]: prev[k].filter((_, j) => j !== i) }));

  const collectMinutes = () => ({
    title: m.title, date: m.date, day: m.day, venue: m.venue, start: m.start, end: m.end,
    chair: m.chair, secretary: m.secretary,
    open: m.open.filter(Boolean), happy: m.happy.filter(Boolean), agenda: m.agenda.filter(Boolean),
    apologies: m.apologies, prevApproval: m.prevApproval,
    disc: m.disc.filter(d => d.t || d.d), remarks: m.remarks.filter(r => r.who || r.text), info: m.info.filter(Boolean),
    thanks: m.thanks, saa: m.saa,
    aGen: m.aGen, aBoard: m.aBoard, aGuest: m.aGuest, aVisRac: m.aVisRac, aVisRot: m.aVisRot, aDist: m.aDist,
    sSpecial: m.sSpecial, sTotal: m.sTotal, next: m.next, adjourn: m.adjourn
  });

  const fillMinutes = (mm) => {
    setM({
      ...emptyMinutes(),
      title: mm.title || '', date: mm.date || '', day: mm.day || '', venue: mm.venue || '',
      start: mm.start || '', end: mm.end || '', chair: mm.chair || '', secretary: mm.secretary || '',
      open: mm.open || [], happy: mm.happy || [], agenda: mm.agenda || [], info: mm.info || [],
      apologies: mm.apologies || '', prevApproval: mm.prevApproval || '',
      disc: mm.disc || [], remarks: mm.remarks || [],
      thanks: mm.thanks || '', saa: mm.saa || '',
      aGen: mm.aGen || 0, aBoard: mm.aBoard || 0, aGuest: mm.aGuest || 0,
      aVisRac: mm.aVisRac || 0, aVisRot: mm.aVisRot || 0, aDist: mm.aDist || 0,
      sSpecial: mm.sSpecial || '', sTotal: mm.sTotal || '', next: mm.next || '', adjourn: mm.adjourn || '',
      id: mm.id || null
    });
  };

  const saveMin = () => {
    const list = lsGet(club, 'minutes', []);
    const collected = collectMinutes();
    const id = m.id || Date.now().toString(36);
    collected.id = id;
    setM(prev => ({ ...prev, id }));
    const idx = list.findIndex(x => x.id === id);
    if (idx > -1) list[idx] = collected;
    else list.unshift(collected);
    lsSet(club, 'minutes', list);
    setSavedMinutes(list);
    window.alert('Draft saved.');
  };

  const deleteMin = (id) => {
    const list = savedMinutes.filter(x => x.id !== id);
    lsSet(club, 'minutes', list);
    setSavedMinutes(list);
  };

  const genPdf = () => {
    const mm = collectMinutes();
    const ciInfo = ci;
    const clubName = clubNameOf(club);
    const doc = new jsPDF();
    const W = 182;
    let y = 16;
    const h = (txt, size = 11) => {
      if (y > 278) { doc.addPage(); y = 16; }
      doc.setFontSize(size);
      doc.setFont(undefined, 'bold');
      doc.text(txt, 14, y);
      y += size * 0.6;
    };
    const p = (txt, size = 9.5, bold = false) => {
      if (!txt) return;
      doc.setFontSize(size);
      doc.setFont(undefined, bold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(txt, W);
      lines.forEach(l => {
        if (y > 280) { doc.addPage(); y = 16; }
        doc.text(l, 14, y);
        y += size * 0.55;
      });
      y += 1.5;
    };
    const label = (k, v) => {
      if (!v) return;
      doc.setFontSize(9.5);
      doc.setFont(undefined, 'bold');
      doc.text(k, 20, y);
      doc.setFont(undefined, 'normal');
      const lines = doc.splitTextToSize(v, 140);
      doc.text(lines, 55, y);
      y += Math.max(5, lines.length * 5);
    };

    doc.setFontSize(9); doc.setFont(undefined, 'italic'); doc.text(ciInfo.motto || '', 105, y, { align: 'center' }); y += 5;
    doc.setFontSize(12); doc.setFont(undefined, 'bold'); doc.text(clubName.toUpperCase(), 105, y, { align: 'center' }); y += 6;
    doc.setFontSize(9); doc.setFont(undefined, 'normal');
    if (ciInfo.sponsor) { doc.text('Sponsored by: ' + ciInfo.sponsor, 105, y, { align: 'center' }); y += 5; }
    if (ciInfo.chartered) { doc.text('Chartered on ' + ciInfo.chartered, 105, y, { align: 'center' }); y += 5; }
    doc.text('RI District: ' + (ciInfo.district || '3292 Nepal and Bhutan'), 105, y, { align: 'center' }); y += 5;
    doc.setLineWidth(0.5); doc.line(14, y, 196, y); y += 8;

    label('Minutes', mm.title || '-'); label('Date', (mm.date || '-') + (mm.day ? ' (' + mm.day + ')' : '')); label('Venue', mm.venue || '-');
    label('Time', (mm.start || '-') + ' to ' + (mm.end || '-')); y += 4;

    p(`The meeting was chaired by ${mm.chair || 'the President'} on the above details.`, 9.5, false);
    if (mm.open.length) { mm.open.forEach((o, i) => p(String.fromCharCode(97 + i) + '. ' + o)); y += 2; }

    if (mm.happy.length) { h('Happy Moments Sharing:'); mm.happy.forEach(t => p('• ' + t)); y += 2; }
    if (mm.agenda.length) { h('Agenda of the Meeting:'); mm.agenda.forEach((a, i) => p((i + 1) + '. ' + a)); y += 2; }
    if (mm.apologies) { h('Apologies:'); p(mm.apologies); }
    if (mm.prevApproval) { h('Previous Meeting Minutes Approval:'); p(mm.prevApproval); }

    if (mm.disc.length) { h('Meeting Discussions & Decisions:'); mm.disc.forEach((d, i) => { p((i + 1) + '. ' + (d.t || ''), 9.5, true); p(d.d || ''); }); }
    if (mm.remarks.length) { h('Remarks:'); mm.remarks.forEach(r => { p(r.who || '', 9.5, true); p(r.text || ''); }); }
    if (mm.info.length) { h('Information Sharing:'); mm.info.forEach(t => p('❖ ' + t)); }
    if (mm.thanks) { h('Vote of Thanks:'); p(mm.thanks); }
    if (mm.saa) { h('Sergeant-at-Arms Announcement:'); p(mm.saa); }

    const total = [mm.aGen, mm.aBoard, mm.aGuest, mm.aVisRac, mm.aVisRot, mm.aDist].reduce((s, v) => s + (Number(v) || 0), 0);
    h('Attendance:');
    p(`General members: ${mm.aGen || 0}   Board members: ${mm.aBoard || 0}   Guests: ${mm.aGuest || 0}`);
    p(`Visiting Rotaractors: ${mm.aVisRac || 0}   Visiting Rotarians: ${mm.aVisRot || 0}   District Officials: ${mm.aDist || 0}`);
    p(`Total attendees: ${total}`, 9.5, true);
    if (mm.sSpecial || mm.sTotal) { y += 2; if (mm.sSpecial) p('Special Sunshine: ' + mm.sSpecial); if (mm.sTotal) p('Total Sunshine Collected: ' + mm.sTotal); }

    y += 3;
    if (mm.next) { h('Secretary Announcement:'); p(mm.next); }
    p(`The meeting was formally adjourned at ${mm.adjourn || '-'}.`);

    y += 16; if (y > 260) { doc.addPage(); y = 30; }
    doc.setFont(undefined, 'normal'); doc.setFontSize(9.5);
    doc.text('_____________________', 20, y); doc.text('_____________________', 120, y); y += 6;
    doc.setFont(undefined, 'bold');
    doc.text(mm.secretary || 'Secretary', 20, y); doc.text(mm.chair || 'President', 120, y); y += 5;
    doc.setFont(undefined, 'normal');
    doc.text('Secretary, RY ' + (ciInfo.ry || ''), 20, y); doc.text('President, RY ' + (ciInfo.ry || ''), 120, y);

    doc.save(`${club}-minutes-${mm.date || 'draft'}.pdf`);
  };

  const totals = useMemo(() => {
    const income = tx.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount || 0), 0);
    const expense = tx.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount || 0), 0);
    return { income, expense, balance: income - expense };
  }, [tx]);

  const addTx = () => {
    const amount = Number(txForm.amount);
    if (!amount) { window.alert('Enter an amount.'); return; }
    const list = [...tx];
    list.unshift({ date: txForm.date, type: txForm.type, amount, category: txForm.category, desc: txForm.desc });
    lsSet(club, 'tx', list);
    setTx(list);
    setTxForm({ date: '', type: 'income', amount: '', category: '', desc: '' });
  };

  const deleteTx = (i) => {
    const list = [...tx];
    list.splice(i, 1);
    lsSet(club, 'tx', list);
    setTx(list);
  };

  const exportCsv = () => {
    let csv = 'Date,Type,Category,Description,Amount\n';
    tx.forEach(t => {
      csv += `${t.date},${t.type},${t.category},"${(t.desc || '').replace(/"/g, '""')}",${t.amount}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${club}-ledger.csv`;
    a.click();
  };

  const exportPdf = () => {
    const clubName = clubNameOf(club);
    const doc = new jsPDF();
    let y = 18;
    doc.setFontSize(14); doc.setFont(undefined, 'bold'); doc.text(`${clubName} — Financial Ledger`, 14, y); y += 8;
    doc.setFontSize(9); doc.setFont(undefined, 'normal');
    tx.forEach(t => {
      if (y > 280) { doc.addPage(); y = 18; }
      doc.text(`${(t.date || '-').padEnd(10)} ${t.type.padEnd(9)} ${(t.category || '-').slice(0, 16).padEnd(18)} ${(t.desc || '-').slice(0, 32).padEnd(34)} ${t.type === 'income' ? '+' : '-'}${Number(t.amount || 0).toLocaleString()}`, 14, y);
      y += 5;
    });
    y += 6; doc.setFont(undefined, 'bold');
    doc.text(`Total Income: NRs ${totals.income.toLocaleString()}   Total Expense: NRs ${totals.expense.toLocaleString()}   Balance: NRs ${totals.balance.toLocaleString()}`, 14, y);
    doc.save(`${club}-ledger.pdf`);
  };

  return (
    <SiteShell current="club-tools" title="Club Administration — Minutes & Treasury | Zone 7 Rotaract" css={pageCss}>
      {view === 'login' && (
        <div className="login-wrap" id="loginView" style={{ display: 'flex' }}>
          {loginMode === 'club' ? (
            <div className="login-card" id="clubLoginCard">
              <h2>Club Administration Login</h2>
              <p className="sub">Sign in as your club to access Meeting Minutes &amp; Treasury tools.</p>
              <label>Select Your Club</label>
              <select id="loginClubSelect" value={loginClub} onChange={e => setLoginClub(e.target.value)}>
                {CLUBS.map(c => <option key={c} value={c}>{CLUB_DIRECTORY[c].name}</option>)}
              </select>
              <label>Password</label>
              <input type="password" id="loginPassword" placeholder="Club password" value={loginPw} onChange={e => setLoginPw(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') doClubLogin(); }} />
              {clubErr && <div className="login-err" id="clubLoginErr" style={{ display: 'block' }}>Incorrect password for that club.</div>}
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 14 }} id="clubLoginBtn" onClick={doClubLogin}>Log In</button>
              <p style={{ marginTop: 16, fontSize: '.78rem', textAlign: 'center', color: 'rgba(27,24,54,.5)' }}>Zone team? <a href="#" id="toZonal" style={{ color: 'var(--magenta-deep)', fontWeight: 700 }} onClick={e => { e.preventDefault(); setLoginMode('zonal'); }}>Log in here →</a></p>
            </div>
          ) : (
            <div className="login-card" id="zonalLoginCard">
              <h2>Zone Team Login</h2>
              <p className="sub">Zonal access can view &amp; manage tools for any club.</p>
              <label>Password</label>
              <input type="password" id="zonalPassword" placeholder="Zone team password" value={zonalPw} onChange={e => setZonalPw(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') doZonalLogin(); }} />
              {zonalErr && <div className="login-err" id="zonalLoginErr" style={{ display: 'block' }}>Incorrect password.</div>}
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 14 }} id="zonalLoginBtn" onClick={doZonalLogin}>Log In</button>
              <p style={{ marginTop: 16, fontSize: '.78rem', textAlign: 'center' }}><a href="#" id="toClub" style={{ color: 'var(--magenta-deep)', fontWeight: 700 }} onClick={e => { e.preventDefault(); setLoginMode('club'); }}>← Back to Club Login</a></p>
            </div>
          )}
        </div>
      )}

      {view === 'dashboard' && (
        <div className="wrap" id="dashboardWrap" style={{ display: 'block' }}>
          <div className="logout-bar">
            <h1 style={{ fontSize: '1.3rem' }}>Club Administration</h1>
            <span id="whoami">{isZonal ? `Zone Team — viewing ${clubNameOf(club)}` : clubNameOf(club)}</span>
            <button className="btn btn-ghost small" id="logoutBtn" onClick={doLogout}>Log Out</button>
          </div>
          <p className="sub">Meeting minutes &amp; treasury — written and generated directly on the site, saved per club to this browser.</p>

          <label style={{ maxWidth: 280 }}>Club</label>
          <select id="clubPick" style={{ maxWidth: 280, marginBottom: 18 }} value={club} onChange={onClubPick} disabled={!isZonal}>
            {CLUBS.map(c => <option key={c} value={c}>{CLUB_DIRECTORY[c].name}</option>)}
          </select>

          <div className="tabs">
            <div className={`tab${tab === 'minutes' ? ' active' : ''}`} data-t="minutes" onClick={() => setTab('minutes')}>📝 Meeting Minutes</div>
            <div className={`tab${tab === 'finance' ? ' active' : ''}`} data-t="finance" onClick={() => setTab('finance')}>💰 Treasury</div>
          </div>

          {tab === 'minutes' && (
            <div className="panel active" id="p-minutes">
              <div className="card">
                <div className="sec-title">Club Letterhead Info (saved once, reused every minutes)</div>
                <div className="row3">
                  <div><label>Sponsoring Rotary Club</label><input id="ciSponsor" placeholder="Rotary Club of ..." value={ci.sponsor} onChange={e => onCiChange('sponsor', e.target.value)} /></div>
                  <div><label>Chartered On</label><input id="ciChartered" placeholder="e.g. 5th November 1997" value={ci.chartered} onChange={e => onCiChange('chartered', e.target.value)} /></div>
                  <div><label>RI District</label><input id="ciDistrict" value={ci.district} onChange={e => onCiChange('district', e.target.value)} /></div>
                </div>
                <div className="row2">
                  <div><label>Club Motto</label><input id="ciMotto" placeholder='e.g. "Unleashing possibilities"' value={ci.motto} onChange={e => onCiChange('motto', e.target.value)} /></div>
                  <div><label>Rotary Year</label><input id="ciRY" placeholder="e.g. 2026-27" value={ci.ry} onChange={e => onCiChange('ry', e.target.value)} /></div>
                </div>

                <div className="sec-title">Meeting Details</div>
                <div className="row3">
                  <div><label>Meeting No. / Title</label><input id="mTitle" placeholder="Regular Meeting #674" value={m.title} onChange={e => setField('title', e.target.value)} /></div>
                  <div><label>Date</label><input type="date" id="mDate" value={m.date} onChange={e => setField('date', e.target.value)} /></div>
                  <div><label>Day</label><input id="mDay" placeholder="e.g. Sunday" value={m.day} onChange={e => setField('day', e.target.value)} /></div>
                </div>
                <div className="row3">
                  <div><label>Venue</label><input id="mVenue" value={m.venue} onChange={e => setField('venue', e.target.value)} /></div>
                  <div><label>Time Started</label><input type="time" id="mStart" value={m.start} onChange={e => setField('start', e.target.value)} /></div>
                  <div><label>Time Ended</label><input type="time" id="mEnd" value={m.end} onChange={e => setField('end', e.target.value)} /></div>
                </div>
                <div className="row2">
                  <div><label>Chaired By (President)</label><input id="mChair" placeholder="President Rtr. ..." value={m.chair} onChange={e => setField('chair', e.target.value)} /></div>
                  <div><label>Recorded By (Secretary)</label><input id="mSecretary" value={m.secretary} onChange={e => setField('secretary', e.target.value)} /></div>
                </div>

                <div className="sec-title">Opening (lettered notes — SAA, quorum, silence, guests acknowledged)</div>
                <div id="openList">
                  {m.open.map((v, i) => (
                    <div className="dyn-row" key={i}>
                      <textarea rows="1" data-k="open" data-i={i} className="str-inp" placeholder={STR_PLACEHOLDER.open} value={v} onChange={e => setStrItem('open', i, e.target.value)}></textarea>
                      <button className="rm" onClick={() => removeItem('open', i)}>✕</button>
                    </div>
                  ))}
                </div>
                <button className="btn btn-ghost small" onClick={() => addItem('open')}>+ Add Opening Note</button>

                <div className="sec-title">Happy Moments Sharing</div>
                <div id="happyList">
                  {m.happy.map((v, i) => (
                    <div className="dyn-row" key={i}>
                      <textarea rows="1" data-k="happy" data-i={i} className="str-inp" placeholder={STR_PLACEHOLDER.happy} value={v} onChange={e => setStrItem('happy', i, e.target.value)}></textarea>
                      <button className="rm" onClick={() => removeItem('happy', i)}>✕</button>
                    </div>
                  ))}
                </div>
                <button className="btn btn-ghost small" onClick={() => addItem('happy')}>+ Add Happy Moment</button>

                <div className="sec-title">Agenda of the Meeting</div>
                <div id="agendaList">
                  {m.agenda.map((v, i) => (
                    <div className="dyn-row" key={i}>
                      <textarea rows="1" data-k="agenda" data-i={i} className="str-inp" placeholder={STR_PLACEHOLDER.agenda} value={v} onChange={e => setStrItem('agenda', i, e.target.value)}></textarea>
                      <button className="rm" onClick={() => removeItem('agenda', i)}>✕</button>
                    </div>
                  ))}
                </div>
                <button className="btn btn-ghost small" onClick={() => addItem('agenda')}>+ Add Agenda Item</button>

                <div className="row2" style={{ marginTop: 14 }}>
                  <div><label>Apologies</label><textarea id="mApologies" placeholder="Apologies received from ... due to ..." value={m.apologies} onChange={e => setField('apologies', e.target.value)}></textarea></div>
                  <div><label>Previous Minutes Approval</label><textarea id="mPrevApproval" placeholder="Minutes of meeting no. X were circulated and passed by members present." value={m.prevApproval} onChange={e => setField('prevApproval', e.target.value)}></textarea></div>
                </div>

                <div className="sec-title">Meeting Discussions &amp; Decisions (numbered, one per agenda topic)</div>
                <div id="discList">
                  {m.disc.map((it, i) => (
                    <div className="dyn-row" key={i}>
                      <div style={{ flex: 1 }}>
                        <input placeholder="Topic (e.g. Charter's Day Celebration)" value={it.t} onChange={e => setDiscField(i, 't', e.target.value)} style={{ marginBottom: 6 }} />
                        <textarea placeholder="Full discussion / decision text" rows="3" value={it.d} onChange={e => setDiscField(i, 'd', e.target.value)}></textarea>
                      </div>
                      <button className="rm" onClick={() => removeItem('disc', i)}>✕</button>
                    </div>
                  ))}
                </div>
                <button className="btn btn-ghost small" onClick={() => addItem('disc')}>+ Add Discussion Item</button>

                <div className="sec-title">Remarks (guests / officials, e.g. ZRR, DRR, mentor)</div>
                <div id="remarkList">
                  {m.remarks.map((r, i) => (
                    <div className="dyn-row" key={i}>
                      <div style={{ flex: 1 }}>
                        <input placeholder="Name &amp; role (e.g. ZRR Rtr. Sunil Shahi)" value={r.who} onChange={e => setRemarkField(i, 'who', e.target.value)} style={{ marginBottom: 6 }} />
                        <textarea placeholder="What they said" rows="2" value={r.text} onChange={e => setRemarkField(i, 'text', e.target.value)}></textarea>
                      </div>
                      <button className="rm" onClick={() => removeItem('remarks', i)}>✕</button>
                    </div>
                  ))}
                </div>
                <button className="btn btn-ghost small" onClick={() => addItem('remark')}>+ Add Remark</button>

                <div className="sec-title">Information Sharing</div>
                <div id="infoList">
                  {m.info.map((v, i) => (
                    <div className="dyn-row" key={i}>
                      <textarea rows="1" data-k="info" data-i={i} className="str-inp" placeholder={STR_PLACEHOLDER.info} value={v} onChange={e => setStrItem('info', i, e.target.value)}></textarea>
                      <button className="rm" onClick={() => removeItem('info', i)}>✕</button>
                    </div>
                  ))}
                </div>
                <button className="btn btn-ghost small" onClick={() => addItem('info')}>+ Add Info Item</button>

                <div className="row2" style={{ marginTop: 14 }}>
                  <div><label>Vote of Thanks</label><textarea id="mThanks" placeholder="Joint Secretary / Sergeant-at-Arms acknowledged the presence of..." value={m.thanks} onChange={e => setField('thanks', e.target.value)}></textarea></div>
                  <div><label>Sergeant-at-Arms Announcement</label><textarea id="mSaa" placeholder="Presented by Acting SAA Rtr. ..." value={m.saa} onChange={e => setField('saa', e.target.value)}></textarea></div>
                </div>

                <div className="sec-title">Attendance</div>
                <div className="row4">
                  <div><label>General Members</label><input type="number" id="aGen" value={m.aGen} onChange={e => setField('aGen', e.target.value)} /></div>
                  <div><label>Board Members</label><input type="number" id="aBoard" value={m.aBoard} onChange={e => setField('aBoard', e.target.value)} /></div>
                  <div><label>Guests</label><input type="number" id="aGuest" value={m.aGuest} onChange={e => setField('aGuest', e.target.value)} /></div>
                  <div><label>Visiting Rotaractors</label><input type="number" id="aVisRac" value={m.aVisRac} onChange={e => setField('aVisRac', e.target.value)} /></div>
                </div>
                <div className="row4">
                  <div><label>Visiting Rotarians</label><input type="number" id="aVisRot" value={m.aVisRot} onChange={e => setField('aVisRot', e.target.value)} /></div>
                  <div><label>District Officials</label><input type="number" id="aDist" value={m.aDist} onChange={e => setField('aDist', e.target.value)} /></div>
                  <div><label>Special Sunshine</label><input id="sSpecial" placeholder="Rs. 3000/- (name)" value={m.sSpecial} onChange={e => setField('sSpecial', e.target.value)} /></div>
                  <div><label>Total Sunshine Collected</label><input id="sTotal" placeholder="Rs. 3300/-" value={m.sTotal} onChange={e => setField('sTotal', e.target.value)} /></div>
                </div>

                <div className="sec-title">Closing</div>
                <div className="row2">
                  <div><label>Next Meeting No. &amp; Date</label><input id="mNext" placeholder="Meeting no. 675 will be held on ..." value={m.next} onChange={e => setField('next', e.target.value)} /></div>
                  <div><label>Adjourned At</label><input type="time" id="mAdjourn" value={m.adjourn} onChange={e => setField('adjourn', e.target.value)} /></div>
                </div>

                <div className="actions">
                  <button className="btn btn-primary" id="genPdf" onClick={genPdf}>Download PDF</button>
                  <button className="btn btn-ghost" id="saveMin" onClick={saveMin}>Save Draft</button>
                  <button className="btn btn-ghost" id="clearMin" onClick={() => fillMinutes({})}>Clear Form</button>
                </div>
              </div>
              <div className="card">
                <h3>Saved Minutes</h3>
                <div className="saved-list" id="savedMinutesList">
                  {savedMinutes.length ? savedMinutes.map(sm => (
                    <div className="saved-item" key={sm.id}>
                      <span className="loadmin" onClick={() => fillMinutes(sm)}>{sm.title || 'Untitled'} — {sm.date || 'no date'}</span>
                      <button className="rm" onClick={() => deleteMin(sm.id)}>Delete</button>
                    </div>
                  )) : <p style={{ fontSize: '.82rem', color: 'rgba(27,24,54,.5)' }}>No saved drafts yet.</p>}
                </div>
              </div>
            </div>
          )}

          {tab === 'finance' && (
            <div className="panel active" id="p-finance">
              <div className="card">
                <div className="stat-row">
                  <div className="stat"><b className="in" id="fIncome">NRs {totals.income.toLocaleString()}</b><span>Total Income</span></div>
                  <div className="stat"><b className="out" id="fExpense">NRs {totals.expense.toLocaleString()}</b><span>Total Expense</span></div>
                  <div className="stat"><b id="fBalance">NRs {totals.balance.toLocaleString()}</b><span>Balance</span></div>
                </div>
                <div className="row3">
                  <div><label>Date</label><input type="date" id="txDate" value={txForm.date} onChange={e => setTxForm(f => ({ ...f, date: e.target.value }))} /></div>
                  <div><label>Type</label><select id="txType" value={txForm.type} onChange={e => setTxForm(f => ({ ...f, type: e.target.value }))}><option value="income">Income</option><option value="expense">Expense</option></select></div>
                  <div><label>Amount (NRs)</label><input type="number" id="txAmount" placeholder="0" value={txForm.amount} onChange={e => setTxForm(f => ({ ...f, amount: e.target.value }))} /></div>
                </div>
                <div className="row2">
                  <div><label>Category</label><input id="txCategory" placeholder="e.g. Project, Dues, Fundraiser, Admin" value={txForm.category} onChange={e => setTxForm(f => ({ ...f, category: e.target.value }))} /></div>
                  <div><label>Description</label><input id="txDesc" placeholder="e.g. Blood donation banner printing" value={txForm.desc} onChange={e => setTxForm(f => ({ ...f, desc: e.target.value }))} /></div>
                </div>
                <div className="actions">
                  <button className="btn btn-primary" id="addTx" onClick={addTx}>Add Entry</button>
                  <button className="btn btn-ghost" id="exportCsv" onClick={exportCsv}>Export CSV</button>
                  <button className="btn btn-ghost" id="exportPdf" onClick={exportPdf}>Export PDF</button>
                </div>
              </div>
              <div className="card">
                <h3>Ledger</h3>
                <table id="ledgerTable">
                  <thead><tr><th>Date</th><th>Type</th><th>Category</th><th>Description</th><th>Amount</th><th></th></tr></thead>
                  <tbody>
                    {tx.map((t, i) => (
                      <tr key={i}>
                        <td>{t.date || ''}</td>
                        <td className={t.type === 'income' ? 'in' : 'out'}>{t.type}</td>
                        <td>{t.category || ''}</td>
                        <td>{t.desc || ''}</td>
                        <td className={t.type === 'income' ? 'in' : 'out'}>{t.type === 'income' ? '+' : '-'}NRs {Number(t.amount || 0).toLocaleString()}</td>
                        <td><button className="rm" onClick={() => deleteTx(i)}>✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </SiteShell>
  );
}
