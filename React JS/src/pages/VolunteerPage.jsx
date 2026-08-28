import SiteShell from '../components/layout/SiteShell';
import pageCss from './volunteer.css?inline';
const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfgQ0YZ1CpaCx-9bfDcsPQ4FaEeYm15wIs-QyoyeMr6ZsQkZg/viewform';
export default function VolunteerPage() {
  const copy = async (text, e) => {
    try{ await navigator.clipboard.writeText(text); const b=e.currentTarget; const o=b.textContent; b.textContent='Copied ✓'; b.style.background='var(--ink)'; b.style.color='#fff'; setTimeout(()=>{b.textContent=o; b.style.background=''; b.style.color='';},1500);}catch{prompt('Copy link:',text)}
  };
  return (
    <SiteShell current="" cta="join" title="Volunteers Needed — Rasuwa Flood | District 3292" css={pageCss}>
      <div className="top-alert"><b>Emergency — Rasuwa</b> &nbsp; For rescue call <a href="tel:1149">1149</a> · Volunteer form only.</div>
      <div className="page-bg">
        <div className="hero-glow" />
        <div className="aurora a1" /><div className="aurora a2" /><div className="aurora a3" />
        <div className="fshape shape-ring" /><div className="fshape shape-tri" /><div className="fshape shape-dot" /><div className="fshape shape-dot2" /><div className="fshape shape-sq" />
        <div className="wrap narrow" style={{width:'100%', maxWidth:520}}>
          <div className="form-card">
            <div className="form-card-inner">
              <div className="eyebrow"><i /> District 3292 · Rasuwa Flood · Official</div>
              <h1>Volunteers Needed — <span>Rasuwa</span></h1>
              <div className="form-sub">2-minute <strong>Google Form</strong> · <strong style={{color:'var(--red)'}}>Coordinated via 1149</strong> · No solo deployment</div>
              <div className="icon-ring">📋</div>
              <a className="btn btn-primary" href={FORM_URL} target="_blank" rel="noopener">Open Registration Form →</a>
              <button className="btn btn-ghost" type="button" onClick={(e)=>copy(FORM_URL,e)}>Copy form link</button>
              <div className="trust-row"><span className="chip">Via 1149</span><span className="chip">2 min form</span><span className="chip">Contact only if needed</span></div>
              <code className="code" onClick={(e)=>copy(FORM_URL,e)}>{FORM_URL}</code>
              <div className="link-hint">Tap code to copy · Works on any phone</div>
              <details className="letter">
                <summary>Read full District 3292 appeal — verbatim</summary>
                <blockquote>
                  Dear Rotaract Leaders,<br />Greetings from Rotaract District 3292.<br /><br />
                  As our communities continue to face the devastating impact of the floods, many individuals are still waiting for rescue and urgent assistance. At this critical hour, we cannot simply stand and watch.<br /><br />
                  Rotaract District 3292 is committed to supporting the affected communities at <strong>any cost and through every possible means</strong>. From rescue coordination and volunteer mobilization to relief materials, blood, transportation and other emergency support, we are doing our very best from every possible aspect to reach those in need.<br /><br />
                  We now need YOU.<br /><br />
                  We are opening a Call for Rescue Volunteers for Rotaractors who are willing and capable of supporting rescue and emergency response efforts. Whether you can assist in the field, provide transportation, offer first aid or contribute in any other meaningful way, your willingness to serve can save a life.<br /><br />
                  <em>Please register only if you are genuinely willing and available to respond when required. Volunteers will be mobilised based on the situation and in coordination with the concerned rescue teams and authorities.</em><br /><br />
                  This is more than volunteering. This is our moment to stand together.<br />
                  One volunteer. One helping hand. One life saved.<br /><br />
                  With Solidarity and Hope,<br /><strong>Rotaract District 3292</strong>
                </blockquote>
              </details>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
