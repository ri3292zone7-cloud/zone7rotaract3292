/* Zone 7 shared navigation — injected into every content page via <div id="siteNav">
   Usage: <div id="siteNav" data-current="about|clubs|tutorials|handbook|resources|guides|gallery|merch|vendors|join|flood-help" data-cta="join|home|club"></div>
   Requires zone7-data.js (CLUB_DIRECTORY) loaded beforehand. Falls back gracefully without it.
*/
(function () {
  // --- Fix: "Request Desktop Site" on mobile forces a wide (~980px) layout
  // viewport and ignores our <meta name="viewport"> tag, which is why content
  // can appear to hug/overflow the left edge on a phone with desktop mode on.
  // Detect that mismatch and re-lock the viewport to the real screen width.
  try {
    var vpMeta = document.querySelector('meta[name="viewport"]');
    if (vpMeta && window.screen && window.screen.width &&
        document.documentElement.clientWidth > window.screen.width + 5) {
      vpMeta.setAttribute("content", "width=" + window.screen.width + ", initial-scale=1.0");
    }
  } catch (e) {}

  // --- Fix: mobile browsers paint the plain white <html> background during
  // rubber-band/elastic overscroll (pulling past the top/bottom of the page),
  // which shows as a block of blank white space beyond the real content.
  // Match html's background to whatever this page's body background actually
  // is (pages use different --cream/--paper tones), and calm the bounce.
  var scrollFix = document.createElement("style");
  scrollFix.textContent = "html{min-height:100%;} body{min-height:100%;overscroll-behavior-y:none;}";
  document.head.appendChild(scrollFix);
  window.addEventListener("DOMContentLoaded", function () {
    try {
      var bg = getComputedStyle(document.body).backgroundColor;
      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
        document.documentElement.style.background = bg;
      }
    } catch (e) {}
  });
  if (document.readyState === "interactive" || document.readyState === "complete") {
    try {
      var bg2 = getComputedStyle(document.body).backgroundColor;
      if (bg2 && bg2 !== "rgba(0, 0, 0, 0)" && bg2 !== "transparent") {
        document.documentElement.style.background = bg2;
      }
    } catch (e) {}
  }

  var manifestLink = document.createElement("link");
  manifestLink.rel = "manifest";
  manifestLink.href = "/site.webmanifest";
  document.head.appendChild(manifestLink);
  var themeColor = document.createElement("meta");
  themeColor.name = "theme-color";
  themeColor.content = "#FFF8EF";
  document.head.appendChild(themeColor);

  var host = document.getElementById("siteNav");
  if (!host) return;
  var current = host.getAttribute("data-current") || "";
  var ctaMode = host.getAttribute("data-cta") || "join";

  // === Crisis Mode ===
  // When a district/zone emergency is active, set active:true and redeploy.
  // This restores the top alert banner, mobile bottom quick-action bar,
  // desktop nav pills, and mobile-menu crisis cards on every page
  // (except the flood/volunteer pages themselves to avoid self-linking).
  // Peace time: active:false → nothing renders anywhere.
  var ZONE7_CRISIS = {
    active: false,
    endsOn: null, // optional "YYYY-MM-DD" safety net — the banner auto-expires past this date
    badge: "🚨 Rasuwa • Volunteers Needed",
    message: 'District 3292 call — register as rescue volunteer. For immediate rescue call <a href="tel:1149" style="color:#A80F52; font-weight:700; text-decoration:underline; text-underline-offset:2px;">1149</a>. <span style="display:none;" class="flood-banner-long">Mobilised only via authorities.</span>',
    volunteerUrl: "/volunteers",
    volunteerLabel: "Register as Volunteer →",
    helpUrl: "/flood-help",
    helpLabel: "Flood Help",
    helpCount: "13", // small count badge; "" hides it
    bottomHelpLabel: "🛟 Flood Help",
    bottomVolLabel: "🚨 Volunteer",
    mobileHelpTitle: "🛟 Flood Help — Rescue & Missing",
    mobileVolTitle: "🚨 Volunteer for Flood Relief"
  };

  function crisisActive(){
    if(!ZONE7_CRISIS.active) return false;
    if(ZONE7_CRISIS.endsOn){
      try{ if(new Date() > new Date(ZONE7_CRISIS.endsOn + "T23:59:59+05:45")) return false; }catch(e){}
    }
    return true;
  }

  function crisisExcluded(){
    var p = location.pathname.replace(/\/+$/, "");
    return p === "/flood-help" || p === "/volunteers" || p === "/volunteer" ||
      p === "/rasuwa-volunteers" || p === "/rasuwa" || p === "/rasuwa-flood-map" || p === "/flood-map";
  }

  // inject global crisis banner once per page (visible everywhere, not just index)
  (function injectFloodBanner(){
    if(!crisisActive() || crisisExcluded()) return;
    if(document.getElementById("zone7FloodBanner")) return;
    var b = document.createElement("div");
    b.id = "zone7FloodBanner";
    b.setAttribute("role", "alert");
    b.style.cssText = "background:linear-gradient(90deg, #FFF3E6 0%, #FFF8EF 100%); border-bottom:1px solid rgba(255,140,26,0.22); padding:10px 0; font-family:'Inter',sans-serif; font-size:0.82rem; line-height:1.5; position:relative; z-index:101;";
    b.innerHTML = '<div class="wrap" style="max-width:1080px; margin:0 auto; padding:0 28px; display:flex; gap:12px; align-items:center; flex-wrap:wrap;">'
      + '<b style="background:#E11A6E; color:#fff; padding:5px 12px; border-radius:100px; font-size:0.70rem; letter-spacing:0.06em; text-transform:uppercase; flex-shrink:0;">' + ZONE7_CRISIS.badge + '</b>'
      + '<span style="color:#1B1836;">' + ZONE7_CRISIS.message + '</span>'
      + '<span style="margin-left:auto; display:flex; gap:8px; align-items:center; flex-wrap:wrap; flex-shrink:0;">'
      + '<a href="' + ZONE7_CRISIS.volunteerUrl + '" style="background:#E11A6E; color:#fff; padding:8px 16px; border-radius:100px; font-weight:700; font-size:0.82rem; white-space:nowrap; text-decoration:none;">' + ZONE7_CRISIS.volunteerLabel + '</a>'
      + '<a href="' + ZONE7_CRISIS.helpUrl + '" style="background:#fff; color:var(--ink, #1B1836); border:1px solid rgba(27,24,54,.12); padding:8px 14px; border-radius:100px; font-weight:700; font-size:0.78rem; white-space:nowrap; text-decoration:none;">' + ZONE7_CRISIS.helpLabel + '</a>'
      + '</span>'
      + '<button aria-label="Dismiss" onclick="this.parentElement.parentElement.remove()" style="background:none; border:none; cursor:pointer; font-size:1.1rem; line-height:1; color:rgba(27,24,54,0.45); padding:4px 6px; flex-shrink:0;">×</button>'
      + '</div>';
    // insert before siteNav so sticky nav stays below it
    var host = document.getElementById("siteNav");
    if(host && host.parentNode) host.parentNode.insertBefore(b, host);
    else document.body.insertBefore(b, document.body.firstChild);
    // reveal long text on wider screens
    if(window.innerWidth > 640){
      var el = b.querySelector(".flood-banner-long");
      if(el) el.style.display = "inline";
    }
  })();
  (function injectBottomBar(){
    if(!crisisActive() || crisisExcluded()) return;
    if(document.getElementById("zone7BottomBar")) return;
    var helpTxt = ZONE7_CRISIS.bottomHelpLabel + (ZONE7_CRISIS.helpCount ? " • " + ZONE7_CRISIS.helpCount : "");
    var bar = document.createElement("div");
    bar.id = "zone7BottomBar";
    bar.setAttribute("role", "navigation");
    bar.setAttribute("aria-label", "Quick emergency actions");
    bar.innerHTML = '<a href="' + ZONE7_CRISIS.helpUrl + '" style="background:#E11A6E; color:#fff; flex:1; padding:12px 14px; border-radius:100px; font-weight:700; font-size:0.84rem; display:flex; gap:6px; align-items:center; justify-content:center; text-decoration:none; white-space:nowrap;">' + helpTxt + '</a>'
      + '<a href="' + ZONE7_CRISIS.volunteerUrl + '" style="background:#fff; color:#E11A6E; border:1.5px solid #E11A6E; flex:1; padding:12px 14px; border-radius:100px; font-weight:700; font-size:0.84rem; display:flex; gap:6px; align-items:center; justify-content:center; text-decoration:none; white-space:nowrap;">' + ZONE7_CRISIS.bottomVolLabel + '</a>';
    document.body.appendChild(bar);
    function setPad(){
      if(window.innerWidth <= 920){
        document.body.style.paddingBottom = "72px";
      } else {
        document.body.style.paddingBottom = "";
      }
    }
    setPad();
    window.addEventListener("resize", setPad);
  })();

  var NAV_CSS = [
    ":root{--nav-bg:rgba(255,253,249,.92);--nav-surface:#FFFDF9;--nav-border:rgba(27,24,54,.1);--nav-border-soft:rgba(27,24,54,.06);--nav-ink:#1B1836;--nav-ink-soft:rgba(27,24,54,.52);--nav-ink-dim:rgba(27,24,54,.45);--nav-brand:#A80F52;--nav-brand-strong:#E11A6E;--nav-tint:rgba(225,26,110,.07);--nav-tint2:rgba(225,26,110,.09);--nav-shadow:0 24px 48px rgba(27,24,54,.14)}",
    ":root.dark{--nav-bg:rgba(21,19,39,.92);--nav-surface:#151327;--nav-border:rgba(233,231,247,.12);--nav-border-soft:rgba(233,231,247,.08);--nav-ink:#E9E7F7;--nav-ink-soft:rgba(233,231,247,.62);--nav-ink-dim:rgba(233,231,247,.45);--nav-brand:#f0488f;--nav-brand-strong:#f0488f;--nav-tint:rgba(225,26,110,.16);--nav-tint2:rgba(225,26,110,.2);--nav-shadow:0 24px 48px rgba(0,0,0,.5)}",
    "@view-transition{navigation:auto}",
    "::view-transition-old(root),::view-transition-new(root){mix-blend-mode:normal}",
    "::view-transition-old(root){animation:z7vo .22s cubic-bezier(.4,0,.6,1) both}",
    "::view-transition-new(root){animation:z7vi .26s cubic-bezier(.25,.6,.35,1) both}",
    "@keyframes z7vo{to{opacity:0}}",
    "@keyframes z7vi{from{opacity:0}}",
    "@media (prefers-reduced-motion:reduce){::view-transition-old(root),::view-transition-new(root){animation-duration:.01ms}}",
    "html{scrollbar-gutter:stable}",
    "html,body{overflow-x:hidden;overflow-x:clip}html{overscroll-behavior-x:none}body{position:relative}",
    "#siteNav{position:sticky;top:0;z-index:100;background:var(--nav-bg);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--nav-border);view-transition-name:z7nav}",
    "::view-transition-group(z7nav){animation-duration:0ms!important}",
    "::view-transition-old(z7nav),::view-transition-new(z7nav){mix-blend-mode:normal}",
    "#siteNav a,#siteNav a:hover{text-decoration:none}",
    "#siteNav .wrap{padding:0 28px;display:flex;align-items:center;justify-content:space-between;height:72px;gap:22px;overflow:visible;max-width:none;margin:0;width:auto}",
    "#siteNav .brand{display:flex;align-items:center;gap:10px;font-family:'Poppins',sans-serif;font-weight:800;font-size:1.05rem;color:var(--nav-ink);white-space:nowrap}",
    "#siteNav .brand .z{background:#E11A6E;color:#fff;width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:'Poppins',sans-serif}",
    "#siteNav .navlinks{display:flex;gap:26px;font-weight:600;font-size:.92rem;align-items:center}",
    "#siteNav .navlinks>a{position:relative;padding:4px 0;color:var(--nav-ink);opacity:.75;transition:opacity .2s}",
    "#siteNav .navlinks>a:hover,#siteNav .navlinks>a.current{opacity:1}",
    "#siteNav .navlinks>a.current{color:var(--nav-brand)}",
    "#siteNav .learn-subnav{display:none;border-top:1px solid var(--nav-border-soft);background:var(--nav-bg);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}",
    "#siteNav .learn-subnav.show{display:block}",
    "#siteNav .learn-subnav-inner{padding:0 28px;display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:8px;align-items:center;overflow-x:auto;scrollbar-width:none}",
    "#siteNav .learn-subnav-inner::-webkit-scrollbar{display:none}",
    "#siteNav .learn-tabs{display:flex;gap:4px;align-items:center;min-width:0;overflow-x:auto;scrollbar-width:none;-webkit-mask-image:linear-gradient(to right,#000 calc(100% - 24px),transparent);mask-image:linear-gradient(to right,#000 calc(100% - 24px),transparent)}",
    "#siteNav .learn-tabs::-webkit-scrollbar{display:none}",
    "#siteNav .learn-subnav a{flex-shrink:0;font-size:.82rem;font-weight:500;color:var(--nav-ink-soft);padding:11px 13px;margin:3px 0;white-space:nowrap;border-radius:100px;transition:color .15s,background .15s}",
    "#siteNav .learn-subnav a:hover{color:var(--nav-ink);background:rgba(127,127,127,.1)}",
    "#siteNav .learn-subnav a.current{color:var(--nav-ink);font-weight:700;background:var(--nav-tint2)}",
    "#siteNav .learn-chapters{display:none;align-items:center;justify-content:center;background:none;border:none;color:var(--nav-ink-soft);cursor:pointer;font-size:1.05rem;padding:6px 9px;border-radius:8px;margin:6px 0;flex-shrink:0;justify-self:end;transition:color .15s,background .15s}",
    "html.learn-hub #siteNav .learn-chapters,html.learn-quiz #siteNav .learn-chapters{display:inline-flex}",
    "#siteNav .learn-chapters:hover{color:var(--nav-ink);background:rgba(127,127,127,.1)}",
    "#siteNav .lb-search{justify-self:center;min-width:0}",
    "#siteNav .lb-search .lb-open{display:flex;align-items:center;gap:9px;background:var(--nav-surface);border:1px solid var(--nav-border);color:var(--nav-ink-soft);cursor:pointer;font-family:'Inter',sans-serif;font-size:.83rem;font-weight:600;padding:0 10px 0 16px;height:38px;border-radius:100px;width:min(380px,44vw);white-space:nowrap;transition:background .15s,border-color .15s}",
    "#siteNav .lb-search .lb-open:hover{background:rgba(127,127,127,.06)}",
    "#siteNav .lb-search .lb-ico{display:inline-flex;color:var(--nav-ink-dim);font-size:.95rem}",
    "#siteNav .lb-search .lb-ph{flex:1;text-align:left;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    "#siteNav .lb-search .lb-kbd{display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:20px;border:1px solid var(--nav-border);border-bottom-width:2px;border-radius:6px;color:var(--nav-ink-dim);font-size:.68rem;font-weight:700}",
    "body.lspot{overflow:hidden}",
    "#lspotlight{position:fixed;inset:0;z-index:900;background:rgba(24,22,44,.34);backdrop-filter:blur(18px) saturate(1.25);-webkit-backdrop-filter:blur(18px) saturate(1.25);opacity:0;pointer-events:none;transition:opacity .18s ease}",
    "#lspotlight.on{opacity:1;pointer-events:auto}",
    "#lbSpot{position:fixed;top:24vh;left:50%;transform:translateX(-50%);width:min(640px,92vw);background:var(--nav-surface);border:1px solid var(--nav-border);border-radius:20px;box-shadow:0 24px 60px rgba(0,0,0,.28);z-index:901;padding:10px;box-sizing:border-box;font-family:'Inter',sans-serif;transition:transform .18s ease,opacity .16s ease}",
    "#lbSpot.hide{transform:translateX(-50%) translateY(-6px) scale(.98);opacity:0;pointer-events:none}",
    "#lbSpot .lb-field{display:flex;align-items:center;gap:12px;padding:6px 6px 6px 18px;border:1.5px solid transparent;border-radius:14px;transition:border-color .15s,box-shadow .15s}",
    "#lbSpot .lb-field:focus-within{border-color:var(--nav-border);box-shadow:0 0 0 4px rgba(127,127,127,.12)}",
    "#lbSpot .lb-field .lb-ico{font-size:1.05rem}",
    "#lbSpot input#learnSearchInput{flex:1;background:none;border:none;outline:none;color:var(--nav-ink);font-family:'Inter',sans-serif;font-size:1.02rem;font-weight:600;height:34px;padding:0}",
    "#lbSpot input#learnSearchInput::placeholder{color:var(--nav-ink-dim)}",
    "#lbSpot .lb-close{background:none;border:none;cursor:pointer;color:var(--nav-ink-dim);font-size:.95rem;padding:6px 10px;border-radius:10px;flex-shrink:0}",
    "#lbSpot .lb-close:hover{color:var(--nav-ink);background:rgba(127,127,127,.1)}",
    "#lbSpot #learnSearchPanel{display:none;margin-top:8px;border-top:1px solid var(--nav-border);padding-top:6px;max-height:min(46vh,520px);overflow-y:auto;overscroll-behavior:contain}",
    "#lbSpot #learnSearchPanel.open{display:block}",
    "#lbSpot .lb-group-title{font-size:.6rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--nav-ink-dim);padding:10px 12px 4px}",
    "#lbSpot .lb-result{display:flex;gap:12px;align-items:center;padding:10px 12px;border-radius:12px;text-decoration:none;transition:background .12s}",
    "#lbSpot .lb-result:hover,#lbSpot .lb-result.sel{background:rgba(127,127,127,.1)}",
    "#lbSpot .lb-ico-box{width:34px;height:34px;border-radius:10px;background:var(--nav-tint2);color:var(--nav-brand);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1rem}",
    "#lbSpot .lb-result h6{font-size:.88rem;font-weight:700;color:var(--nav-ink);margin:0}",
    "#lbSpot .lb-result p{font-size:.74rem;color:var(--nav-ink-soft);margin:0;line-height:1.35}",
    "#lbSpot .lb-tag{font-size:.62rem;font-weight:800;color:var(--nav-ink-soft);background:var(--nav-tint2);padding:2px 8px;border-radius:100px;margin-left:8px;flex-shrink:0}",
    "#lbSpot .lb-empty{padding:20px 14px;font-size:.86rem;color:var(--nav-ink-dim);text-align:center}",
    "@media (max-width:600px){#siteNav .lb-search .lb-open{width:40px;padding:0;justify-content:center}#siteNav .lb-search .lb-ph,#siteNav .lb-search .lb-kbd{display:none}}",
    "@media (prefers-reduced-motion:reduce){#lspotlight,#lbSpot,#lbSpot.hide{transition:none}}",
    "html.has-subnav #siteNav .mobile-menu{top:120px;max-height:calc(100vh - 120px)}",
    "#siteNav .nav-drop{position:relative}",
    "#siteNav .nav-drop-trigger{display:flex;align-items:center;gap:5px;background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-weight:600;font-size:.92rem;color:var(--nav-ink);opacity:.75;padding:4px 0;transition:opacity .2s}",
    "#siteNav .nav-drop-trigger svg{transition:transform .2s}",
    "#siteNav .nav-drop:hover .nav-drop-trigger,#siteNav .nav-drop.open .nav-drop-trigger{opacity:1}",
    "#siteNav .nav-drop.open .nav-drop-trigger svg{transform:rotate(180deg)}",
    "#siteNav .nav-drop-panel{position:absolute;top:100%;left:50%;transform:translateX(-50%) translateY(6px);background:var(--nav-surface);border:1px solid var(--nav-border);border-radius:18px;box-shadow:var(--nav-shadow);padding:14px 12px 12px;opacity:0;pointer-events:none;transition:opacity .18s,transform .18s;z-index:60}",
    "#siteNav .nav-drop:hover .nav-drop-panel,#siteNav .nav-drop.open .nav-drop-panel{opacity:1;pointer-events:auto;transform:translateX(-50%) translateY(0)}",
    "#siteNav .nav-drop-panel::before{content:'';position:absolute;top:7px;left:50%;transform:translateX(-50%) rotate(45deg);width:12px;height:12px;background:var(--nav-surface);border-left:1px solid var(--nav-border);border-top:1px solid var(--nav-border)}",
    "#siteNav .clubs-drop-panel{width:440px}",
    "#siteNav .clubs-drop-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px}",
    "#siteNav .clubs-drop-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:12px;transition:background .15s}",
    "#siteNav .clubs-drop-item:hover{background:var(--nav-tint)}",
    "#siteNav .clubs-drop-item img{width:28px;height:28px;border-radius:8px;object-fit:contain;background:#fff;border:1px solid rgba(27,24,54,.1);padding:3px;flex-shrink:0}",
    "#siteNav .clubs-drop-item span{font-size:.82rem;font-weight:600;color:var(--nav-ink);line-height:1.25}",
    "#siteNav .clubs-drop-foot{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:10px;padding-top:10px;border-top:1px solid var(--nav-border)}",
    "#siteNav .clubs-drop-foot span{font-size:.74rem;color:var(--nav-ink-dim)}",
    "#siteNav .clubs-drop-foot a{font-size:.8rem;font-weight:700;color:var(--nav-brand)}",
    "#siteNav .learn-drop-panel{width:350px}",
    "#siteNav .res-drop-item{display:flex;gap:12px;padding:11px 10px;border-radius:12px;transition:background .15s;align-items:flex-start}",
    "#siteNav .res-drop-item:hover,#siteNav .res-drop-item.current{background:var(--nav-tint)}",
    "#siteNav .res-drop-item.current h5{color:var(--nav-brand)}",
    "#siteNav .res-drop-ico{width:36px;height:36px;border-radius:10px;background:var(--nav-tint2);color:var(--nav-brand);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1rem}",
    "#siteNav .res-drop-item h5{font-size:.86rem;font-weight:700;color:var(--nav-ink);margin-bottom:2px}",
    "#siteNav .res-drop-item p{font-size:.74rem;color:var(--nav-ink-soft);line-height:1.4;margin:0}",
    "#siteNav .back{font-weight:700;font-size:.86rem;color:var(--nav-brand);white-space:nowrap}",
    "#siteNav .nav-admin{font-weight:700;font-size:.84rem;color:var(--nav-brand);opacity:.85;transition:opacity .2s;white-space:nowrap}",
    "#siteNav .nav-admin:hover{opacity:1}",
    "#siteNav .nav-cta{background:#1B1836;color:#fff !important;padding:10px 20px;border-radius:100px;font-weight:700;font-size:.85rem;white-space:nowrap}",
    "#siteNav .nav-cta:hover{background:#A80F52}",
    "#siteNav .nav-rgpt{display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;border:1.5px solid var(--nav-border);background:var(--nav-surface);color:var(--nav-ink);cursor:pointer;transition:border-color .2s,color .2s,background .2s,transform .2s;flex-shrink:0}",
    "#siteNav .nav-rgpt:hover{border-color:var(--nav-brand-strong);color:var(--nav-brand-strong);background:var(--nav-tint)}",
    "#siteNav .nav-rgpt:active{transform:scale(.94)}",
    "#siteNav .burger{display:none;background:none;border:none;cursor:pointer;padding:6px}",
    "#siteNav .burger span{display:block;width:22px;height:2px;background:#1B1836;margin:5px 0;border-radius:2px}",
    "#siteNav .nav-emergency{display:flex;gap:8px;align-items:center;flex-shrink:0}",
    "#siteNav .nav-emergency a{padding:7px 12px;border-radius:100px;font-weight:800;font-size:.78rem;display:inline-flex;gap:6px;align-items:center;white-space:nowrap;text-decoration:none;line-height:1}",
    "#siteNav .mobile-menu{display:none;position:fixed;top:72px;left:0;right:0;background:var(--nav-surface);border-bottom:1px solid var(--nav-border);z-index:99;padding:14px 28px 26px;flex-direction:column;max-height:calc(100vh - 72px);overflow-y:auto}",
    "#siteNav .mobile-menu.open{display:flex}",
    "#siteNav .mobile-menu a{font-weight:600;font-size:1rem;color:var(--nav-ink);padding:10px 0;border-bottom:1px solid var(--nav-border-soft)}",
    "#siteNav .mobile-menu a:last-child{border-bottom:none}",
    "#siteNav .mobile-menu .mm-group{font-size:.66rem;font-weight:800;text-transform:uppercase;letter-spacing:.09em;color:var(--nav-ink-dim);margin:14px 0 2px}",
    "#siteNav .mobile-menu a.mm-cta{background:#1B1836;color:#fff;border-radius:100px;text-align:center;padding:13px;border:none;margin-top:14px}",
    "@media (max-width:920px){#siteNav .navlinks,#siteNav .nav-admin,#siteNav .nav-cta,#siteNav .back,#siteNav .nav-emergency{display:none}#siteNav .burger{display:block} #siteNav .wrap{gap:10px; padding:0 14px} #siteNav .brand{font-size:.95rem} #siteNav .brand .z{width:30px;height:30px;font-size:.95rem}}",
    "@media (max-width:380px){#siteNav .nav-emergency{gap:5px} #siteNav .nav-emergency a{padding:5px 8px;font-size:.68rem} #siteNav .nav-emergency a .hide-sm{display:none}}",
    "#backTop{position:fixed;left:22px;bottom:26px;z-index:94;width:46px;height:46px;border-radius:50%;border:none;cursor:pointer;background:#1B1836;color:#fff;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transform:translateY(12px);transition:opacity .25s,transform .25s,background .2s;box-shadow:0 12px 28px rgba(27,24,54,.3)}",
    "#backTop.show{opacity:1;pointer-events:auto;transform:translateY(0)}",
    "#backTop:hover{background:#A80F52}",
    "#zone7BottomBar{position:fixed;bottom:0;left:0;right:0;z-index:102;background:var(--nav-surface);border-top:1px solid var(--nav-border);padding:10px 14px calc(10px + env(safe-area-inset-bottom));display:none;gap:8px;align-items:center;box-shadow:0 -8px 24px rgba(27,24,54,.08)}",
    "#zone7BottomBar a{transition:transform .2s,background .2s,box-shadow .2s}",
    "#zone7BottomBar a:active{transform:scale(0.96)}",
    "#zone7BottomBar a:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(225,26,110,.2)}",
    "#zone7BottomBar .btn{flex:1; min-height:44px; justify-content:center; font-weight:700; font-size:0.84rem;}",
    "@media (max-width:920px){#zone7BottomBar{display:flex}}",
    "@media (min-width:921px){#zone7BottomBar{display:none !important} body{padding-bottom:0 !important}}",
    "@media (max-width:920px){#backTop{bottom:84px}}"
  ].join("\n");

  var CHEV = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 3.5L5 7L8.5 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var STAR = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1.5c.6 4.6 2.4 7.4 10.5 10.5C14.4 15.1 12.6 17.9 12 22.5c-.6-4.6-2.4-7.4-10.5-10.5C9.6 8.9 11.4 6.1 12 1.5z"/></svg>';

  function item(path, label, key, extra) {
    return '<a href="' + path + '"' + (current === key ? ' class="current"' : "") + extra + ">" + label + "</a>";
  }

  function learnItem(path, icon, title, desc, key) {
    return (
      '<a class="res-drop-item' + (current === key ? " current" : "") + '" href="' + path + '">' +
      '<div class="res-drop-ico">' + icon + "</div>" +
      "<div><h5>" + title + "</h5><p>" + desc + "</p></div></a>"
    );
  }

  var learnItems =
    learnItem("/tutorials", "🧭", "Learn hub", "Tutorials, the district handbook and the officer playbook all in one place", "tutorials") +
    learnItem("/rkt-quiz", "🧠", "RotaQuiz", "Test your Rotaract knowledge in 2 minutes", "quiz") +
    learnItem("/guides", "📄", "Resources", "Official documents, constitutions and downloadable forms", "resources");

  var learnKeys = ["tutorials", "resources", "quiz"];
  var isLearn = learnKeys.indexOf(current) !== -1;
  var subnavHtml = "";
  if (isLearn) {
    document.documentElement.classList.add("has-subnav");
    if (current === "tutorials") document.documentElement.classList.add("learn-hub");
    if (current === "quiz") document.documentElement.classList.add("learn-quiz");
    var chaptersLabel = current === "quiz" ? "Open RotaQuiz menu" : "Open Learn hub chapters";
    subnavHtml =
      '<div class="learn-subnav show"><div class="learn-subnav-inner">' +
      '<div class="learn-tabs">' +
      item("/tutorials", "Learn hub", "tutorials") +
      item("/rkt-quiz", "RotaQuiz", "quiz") +
      item("/guides", "Resources", "resources") +
      "</div>" +
      '<div class="lb-search" id="learnSearch">' +
      '<button type="button" class="lb-open" aria-expanded="false" aria-haspopup="dialog" aria-label="Search the Learn section">' +
      '<span class="lb-ico">🔍</span><span class="lb-ph">Search the Learn section</span><span class="lb-kbd">/</span>' +
      "</button></div>" +
      '<button type="button" class="learn-chapters" id="learnChaptersBtn" aria-label="' + chaptersLabel + '">☰</button>' +
      "</div></div>";
  }

  // Crisis-mode UI: rendered only while ZONE7_CRISIS.active is true
  // (and not on the crisis pages themselves).
  var inCrisis = crisisActive() && !crisisExcluded();
  var crisisPills = "";
  var crisisCards = "";
  if (inCrisis) {
    var helpPillCount = ZONE7_CRISIS.helpCount
      ? '<span style="background:#FF8C1A; color:#fff; padding:2px 6px; border-radius:100px; font-size:.62rem; margin-left:2px;">' + ZONE7_CRISIS.helpCount + "</span>"
      : "";
    crisisPills =
      '<div class="nav-emergency">'
      + '<a href="' + ZONE7_CRISIS.volunteerUrl + '" style="background:linear-gradient(120deg,#DC2626,#E11A6E); color:#fff; box-shadow:0 6px 14px rgba(220,38,38,.18);"><span>🚨</span><span class="hide-sm"> Volunteers</span><span style="background:rgba(255,255,255,.22); color:#fff; padding:2px 6px; border-radius:100px; font-size:.62rem; margin-left:2px;">NEW</span></a>'
      + '<a href="' + ZONE7_CRISIS.helpUrl + '" style="background:#FFF8EF; color:#9a4a00; border:1.5px solid rgba(255,140,26,.22);"><span>🛟</span><span class="hide-sm"> Flood</span>' + helpPillCount + "</a>"
      + "</div>";
    crisisCards =
      '<a href="' + ZONE7_CRISIS.helpUrl + '" style="background:linear-gradient(135deg,#FF8C1A,#E11A6E); color:#fff; border:none; border-radius:14px; padding:14px 16px; font-weight:800; font-size:1.0rem; display:flex; justify-content:space-between; align-items:center; box-shadow:0 8px 20px rgba(225,26,110,0.18); margin-bottom:10px;"><span>' + ZONE7_CRISIS.mobileHelpTitle + "</span>" + (ZONE7_CRISIS.helpCount ? '<span style="background:#fff; color:#E11A6E; padding:4px 10px; border-radius:100px; font-size:0.74rem; font-weight:900;">' + ZONE7_CRISIS.helpCount + "</span>" : "") + "</a>"
      + '<a href="' + ZONE7_CRISIS.volunteerUrl + '" style="background:#E11A6E; color:#fff; border:none; border-radius:14px; padding:12px 16px; font-weight:700; font-size:0.95rem; display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;"><span>' + ZONE7_CRISIS.mobileVolTitle + '</span><span style="background:#fff; color:#E11A6E; padding:3px 8px; border-radius:100px; font-size:0.70rem; font-weight:700;">Join</span></a>';
  }

  var ctaHtml = "";
  if (ctaMode === "home") {
    ctaHtml = '<a href="/" class="btn nav-cta">← Back Home</a>';
  } else if (ctaMode === "club") {
    ctaHtml = '<a href="#" id="clubBackLink" class="back">← Back to Club</a><a href="/join" class="btn nav-cta">Join Us</a>';
  } else {
    ctaHtml = '<a href="/join" class="btn nav-cta">Join Us</a>';
  }

  var html =
    '<nav id="siteNav" aria-label="Main navigation">' +
    '<div class="wrap">' +
    '<a href="/" aria-label="Zone 7 Rotaract home"><div class="brand"><span class="z">7</span> Zone 7 Rotaract</div></a>' +
    '<div class="navlinks">' +
    item("/about", "About", "about") +
    '<div class="nav-drop" id="clubsDrop">' +
    '<button type="button" class="nav-drop-trigger" aria-haspopup="true" aria-expanded="false"' + (current === "clubs" ? ' style="opacity:1;color:#A80F52"' : "") + '>Clubs ' + CHEV + "</button>" +
    '<div class="nav-drop-panel clubs-drop-panel"><div class="clubs-drop-grid" id="clubsDropGrid"></div>' +
    '<div class="clubs-drop-foot"><span id="clubCount">9 clubs in Zone 7</span><a href="/#clubs">All clubs on the homepage →</a></div></div>' +
    "</div>" +
    '<div class="nav-drop" id="learnDrop">' +
    '<button type="button" class="nav-drop-trigger" aria-haspopup="true" aria-expanded="false"' + (current === "tutorials" || current === "resources" || current === "quiz" ? ' style="opacity:1;color:#A80F52"' : "") + '>Learn ' + CHEV + "</button>" +
    '<div class="nav-drop-panel learn-drop-panel">' + learnItems + "</div>" +
    "</div>" +
    item("/gallery", "Gallery", "gallery") +
    item("/store", "Store", "merch") +
    "</div>" +
    crisisPills +
    '<div style="display:flex;align-items:center;gap:16px;">' +
    '<a href="/admin" class="nav-admin">Club Admin</a>' +
    ctaHtml +
    '<button type="button" id="navRotaGpt" class="nav-rgpt" aria-label="Open RotaGPT chat" title="RotaGPT chat">' + STAR + "</button>" +
    '<button class="burger" id="burgerBtn" aria-label="Open menu"><span></span><span></span><span></span></button>' +
    "</div>" +
    "</div>" +
    subnavHtml +
    '<div class="mobile-menu" id="mobileMenu">' +
    crisisCards +
    item("/about", "About", "about") +
    '<div class="mm-group">Clubs</div>' +
    '<a href="/#clubs">All 9 Clubs in Zone 7</a>' +
    '<div class="mm-group">Learn</div>' +
'<a href="/tutorials">Learn hub</a>' +
    '<a href="/rkt-quiz">RotaQuiz</a>' +
    '<a href="/guides">Resources &amp; Documents</a>' +
    '<div class="mm-group">Community</div>' +
    item("/gallery", "Gallery", "gallery") +
    item("/store", "Store", "merch") +
    '<a href="/join">Join Us</a>' +
    '<a href="/admin">Club Admin</a>' +
    '<a class="mm-cta" href="/join">Fill the Form, Become a Rotaractor →</a>' +
    "</div>" +
    "</nav>";

  var style = document.createElement("style");
  style.textContent = NAV_CSS;
  document.head.appendChild(style);
  host.outerHTML = html;

  var nav = document.getElementById("siteNav");
  if (!nav) return;

  var grid = nav.querySelector("#clubsDropGrid");
  var count = nav.querySelector("#clubCount");
  if (grid) {
    try {
      var clubs = (typeof CLUB_DIRECTORY !== "undefined" && CLUB_DIRECTORY) ? Object.entries(CLUB_DIRECTORY) : [];
      if (clubs.length) {
        grid.innerHTML = clubs.map(function (e) {
          var slug = e[0], c = e[1];
          var logo = (c && c.logo) ? c.logo : "";
          var name = c && c.name ? c.name.replace("Rotaract Club of ", "") : slug;
          var src = logo ? '<img src="' + logo + '" alt="' + name + '" loading="lazy">' : '<div style="width:28px;height:28px;border-radius:8px;background:rgba(225,26,110,.12);flex-shrink:0"></div>';
          return '<a class="clubs-drop-item" href="/' + encodeURIComponent(slug) + '">' + src + "<span>" + name + "</span></a>";
        }).join("");
        if (count) count.textContent = clubs.length + " clubs in Zone 7";
      }
    } catch (err) { /* keep the empty grid harmless */ }
  }

  nav.querySelectorAll(".nav-drop-trigger").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var drop = btn.closest(".nav-drop");
      var wasOpen = drop.classList.contains("open");
      nav.querySelectorAll(".nav-drop").forEach(function (d) { d.classList.remove("open"); });
      if (!wasOpen) drop.classList.add("open");
      nav.querySelectorAll(".nav-drop-trigger").forEach(function (t) {
        t.setAttribute("aria-expanded", t.closest(".nav-drop").classList.contains("open") ? "true" : "false");
      });
    });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest("#siteNav .nav-drop")) {
      nav.querySelectorAll(".nav-drop").forEach(function (d) { d.classList.remove("open"); });
    }
  });

  var burger = nav.querySelector("#burgerBtn");
  var menu = nav.querySelector("#mobileMenu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); });
    });
  }

  var chaptersBtn = nav.querySelector("#learnChaptersBtn");
  if (chaptersBtn) {
    chaptersBtn.addEventListener("click", function () {
      var open = window.openSidebar;
      if (open) open();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var openDrop = nav.querySelector(".nav-drop.open");
    if (openDrop) {
      openDrop.classList.remove("open");
      var trig = openDrop.querySelector(".nav-drop-trigger");
      if (trig) { trig.setAttribute("aria-expanded", "false"); trig.focus(); }
    }
    if (menu && menu.classList.contains("open")) {
      menu.classList.remove("open");
      if (burger) burger.setAttribute("aria-expanded", "false");
    }
  });

  var backTop = document.createElement("button");
  backTop.type = "button";
  backTop.id = "backTop";
  backTop.setAttribute("aria-label", "Back to top");
  backTop.innerHTML = '<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M8 13V3M3.5 7.5L8 3L12.5 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  backTop.addEventListener("click", function () {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });
  document.body.appendChild(backTop);
  function onScroll() {
    if (window.scrollY > 600) backTop.classList.add("show");
    else backTop.classList.remove("show");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var rgptBtn = nav.querySelector("#navRotaGpt");
  if (rgptBtn) {
    rgptBtn.addEventListener("click", function () {
      if (window.RotaGPT) window.RotaGPT.open();
    });
    function syncRgpt() {
      var show = !!window.RotaGPT;
      rgptBtn.style.display = show ? "" : "none";
    }
    syncRgpt();
    window.addEventListener("load", syncRgpt);
  }
})();
