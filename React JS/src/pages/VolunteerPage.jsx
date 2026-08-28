import SiteShell from '../components/layout/SiteShell';
import pageCss from './volunteer.css?inline';

const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfgQ0YZ1CpaCx-9bfDcsPQ4FaEeYm15wIs-QyoyeMr6ZsQkZg/viewform';

export default function VolunteerPage() {
  const copy = async (text, e) => {
    try { await navigator.clipboard.writeText(text); const o=e.currentTarget.textContent; e.currentTarget.textContent='Copied ✓'; setTimeout(()=>e.currentTarget.textContent=o,1500); } catch { prompt('Copy link:', text); }
  };
  const share = async (e) => {
    e.preventDefault();
    const url = window.location.href;
    if (navigator.share) { try { await navigator.share({ title: document.title, text: 'Join District 3292 rescue volunteers for Rasuwa', url }); return; } catch {}
    }
    copy(url, e);
  };
  return (
    <SiteShell current="" cta="join" title="Volunteers Needed — Rasuwa Flood | Rotaract District 3292" css={pageCss}>
      <div className="top-alert">
        <b>Emergency — Rasuwa Flood</b> &nbsp; For immediate rescue call <a href="tel:1149">1149</a> / <a href="tel:100">100</a> · This page is volunteer registration only.
      </div>
      <div className="wrap narrow">
        <div className="hero">
          <div className="eyebrow"><i /> Rotaract District 3292 · Nepal-Bhutan</div>
          <h1>Volunteers Needed — <span>Rasuwa Flood</span></h1>
          <p className="lead">Many are still waiting for rescue. District 3292 is mobilising volunteers for <strong>field support, transport, first aid, blood &amp; relief</strong>. <strong>Register in 2 minutes.</strong> You will be called <strong>only when needed</strong>, coordinated with authorities.</p>
        </div>

        <div className="form-card" id="register">
          <div className="form-card-head">
            <div><b>Volunteer Registration Form</b><br /><span>District official · Google Forms · opens in new tab</span></div>
            <div style={{display:'flex', gap:8, flexWrap:'wrap', flex:1, justifyContent:'flex-end', maxWidth:360, width:'100%'}}>
              <a className="btn btn-primary" href={FORM_URL} target="_blank" rel="noopener">Open form →</a>
              <button className="btn btn-ghost" type="button" onClick={(e)=>copy(FORM_URL, e)}>Copy link</button>
            </div>
          </div>
          <div style={{padding:'28px 20px', textAlign:'center', background:'linear-gradient(180deg,#fff 0%, #FFF8EF 100%)'}}>
            <div style={{width:56, height:56, borderRadius:16, background:'linear-gradient(135deg,var(--magenta),#F2A900)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', margin:'0 auto 14px'}}>📋</div>
            <div style={{fontFamily:'Poppins', fontWeight:800, fontSize:'1.15rem', marginBottom:6}}>Google Form — 2 minutes</div>
            <div style={{fontSize:'.88rem', color:'rgba(27,24,54,.62)', lineHeight:1.6, maxWidth:420, margin:'0 auto 18px'}}>Tap the button below. It opens the official District 3292 form in a new tab. If it asks for Google sign-in, please sign in and continue.</div>
            <a className="btn btn-primary" href={FORM_URL} target="_blank" rel="noopener" style={{fontSize:'1.02rem', padding:'16px 32px', minWidth:260, boxShadow:'0 14px 28px rgba(225,26,110,.25)'}}>Open Registration Form →</a>
            <div style={{marginTop:14, fontSize:'.78rem', color:'rgba(27,24,54,.55)'}}>Embed is blocked by Google (401). Direct open is the fastest way.</div>
            <div style={{marginTop:16, background:'#FFF8EF', border:'1px solid var(--line)', borderRadius:12, padding:12, fontSize:'.82rem', color:'rgba(27,24,54,.68)', textAlign:'left', maxWidth:480, marginLeft:'auto', marginRight:'auto'}}>
              <b style={{color:'var(--ink)'}}>Link not working?</b> Copy and paste:<br />
              <span style={{wordBreak:'break-all', fontSize:'.78rem', background:'#fff', border:'1px solid var(--line)', padding:'6px 8px', borderRadius:8, display:'inline-block', marginTop:6, width:'100%'}}>{FORM_URL}</span>
            </div>
          </div>
        </div>

        <p className="tiny">Please register only if genuinely willing &amp; reachable. By registering you consent to be contacted for this response only.<br />
          Trouble loading? <a href={FORM_URL} target="_blank" rel="noopener">Open form in new tab →</a> · Share: <a href="#" onClick={share}>Share ↗</a>
        </p>

        <details className="letter">
          <summary>Read full District 3292 appeal (verbatim)</summary>
          <blockquote>
            Dear Rotaract Leaders,<br />Greetings from Rotaract District 3292.<br /><br />
            As our communities continue to face the devastating impact of the floods, many individuals are still waiting for rescue and urgent assistance. At this critical hour, we cannot simply stand and watch.<br /><br />
            Rotaract District 3292 is committed to supporting the affected communities at any cost and through every possible means. From rescue coordination and volunteer mobilization to relief materials, blood, transportation and other emergency support, we are doing our very best from every possible aspect to reach those in need.<br /><br />
            We now need YOU.<br /><br />
            We are opening a Call for Rescue Volunteers for Rotaractors who are willing and capable of supporting rescue and emergency response efforts. Whether you can assist in the field, provide transportation, offer first aid or contribute in any other meaningful way, your willingness to serve can save a life.<br /><br />
            <em>Please register only if you are genuinely willing and available to respond when required. Volunteers will be mobilised based on the situation and in coordination with the concerned rescue teams and authorities.</em><br /><br />
            This is more than volunteering. This is our moment to stand together.<br />
            One volunteer. One helping hand. One life saved.<br /><br />
            With Solidarity and Hope,<br /><strong>Rotaract District 3292</strong>
          </blockquote>
        </details>
      </div>
    </SiteShell>
  );
}
