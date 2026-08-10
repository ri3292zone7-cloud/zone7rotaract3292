import { useEffect, useState } from 'react';
import SiteShell from '../components/layout/SiteShell';
import { ZONE7_DB } from '../data/zone7-data';
import pageCss from './pending-applications.css?inline';

function linesFromApp(app) {
  return Object.keys(app)
    .filter((k) => !k.startsWith('_'))
    .map((k) => k.replace(/_/g, ' ') + ': ' + app[k])
    .join('\n');
}

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  return isNaN(d) ? '' : d.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function PendingApplicationsPage() {
  /* ---- Local device queue (the original page's data source) ---- */
  const [apps, setApps] = useState([]);
  const [copied, setCopied] = useState(false);

  /* ---- Server-side applications from ZONE7_DB ---- */
  const [serverApps, setServerApps] = useState([]);
  const [serverLoading, setServerLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let raw = null;
    try { raw = localStorage.getItem('zone7_pending_applications'); } catch { raw = null; }
    let list = [];
    try { list = JSON.parse(raw || '[]'); } catch { list = []; }
    setApps(Array.isArray(list) ? list : []);
  }, []);

  useEffect(() => {
    let alive = true;
    ZONE7_DB.getMembershipApplications()
      .then((rows) => { if (alive) setServerApps(rows || []); })
      .catch(() => {})
      .finally(() => { if (alive) setServerLoading(false); });
    return () => { alive = false; };
  }, []);

  const pending = serverApps.filter((a) => (a.status || 'new') === 'new');

  const copyAll = () => {
    navigator.clipboard.writeText(JSON.stringify(apps, null, 2)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const clearAll = () => {
    localStorage.removeItem('zone7_pending_applications');
    setApps([]);
  };

  const setStatus = async (id, status) => {
    setBusyId(id);
    try {
      await ZONE7_DB.setMembershipApplicationStatus(id, status);
      setServerApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch (err) {
      console.error('Status update failed', err);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <SiteShell current="pending-applications" title="Pending Applications, Zone 7" css={pageCss}>
      <div className="wrap">
        <h1>Saved applications on this browser (device)</h1>
        <p className="hint">This page reads the local queue saved when the form could not send. If nothing shows here, your submission was actually sent to FormSubmit, so check ri3292zone7@gmail.com.</p>

        <div id="list">
          {apps.map((app, i) => (
            <div key={i} className="card">
              <h3>{i + 1}. {app.fullname || ('Application #' + (i + 1))}</h3>
              <pre>{linesFromApp(app)}</pre>
            </div>
          ))}
        </div>

        {!apps.length ? <div className="empty">No saved applications, the queue is empty.</div> : null}

        {apps.length ? (
          <>
            <button className="btn" onClick={copyAll}>{copied ? 'Copied!' : 'Copy all as JSON'}</button>
            <button className="btn ghost" onClick={clearAll}>Clear saved applications</button>
          </>
        ) : null}

        <hr className="pa-hr" />

        <h2 className="pa-title">Pending applications received (Supabase)</h2>
        <p className="hint">Membership applications that reached the Zone 7 database through the join form. Approve to mark a club contacted, or reject.</p>

        {serverLoading ? <p className="hint">Loading applications…</p> : null}

        {!serverLoading && !pending.length ? <div className="empty">No pending applications, the queue is empty.</div> : null}

        {!serverLoading && pending.map((a) => (
          <div key={a.id} className="card">
            <h3>{a.fullname || 'Unnamed applicant'} <span className="pa-status">{a.status || 'new'}</span></h3>
            <pre>{linesFromApp(a)}</pre>
            <p className="pa-meta">{a.email ? `${a.email} · ` : ''}Submitted {formatDate(a.created_at)}</p>
            <div className="pa-actions">
              <button className="btn approve" disabled={busyId === a.id} onClick={() => setStatus(a.id, 'contacted')}>
                {busyId === a.id ? 'Updating…' : 'Approve'}
              </button>
              <button className="btn reject" disabled={busyId === a.id} onClick={() => setStatus(a.id, 'rejected')}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </SiteShell>
  );
}
