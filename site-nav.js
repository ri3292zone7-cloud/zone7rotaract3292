/* Zone 7 shared navigation — injected into every content page via <div id="siteNav">
   Usage: <div id="siteNav" data-current="about|clubs|tutorials|handbook|resources|guides|gallery|join" data-cta="join|home|club"></div>
   Requires zone7-data.js (CLUB_DIRECTORY) loaded beforehand. Falls back gracefully without it.
*/
(function () {
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

  var NAV_CSS = [
    "#siteNav{position:sticky;top:0;z-index:100;background:rgba(255,253,249,.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid rgba(27,24,54,.1)}",
    "#siteNav .wrap{max-width:1080px;margin:0 auto;padding:0 28px;display:flex;align-items:center;justify-content:space-between;height:72px;gap:22px}",
    "#siteNav .brand{display:flex;align-items:center;gap:10px;font-family:'Poppins',sans-serif;font-weight:800;font-size:1.05rem;color:#1B1836;white-space:nowrap}",
    "#siteNav .brand .z{background:#E11A6E;color:#fff;width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:'Poppins',sans-serif}",
    "#siteNav .navlinks{display:flex;gap:26px;font-weight:600;font-size:.92rem;align-items:center}",
    "#siteNav .navlinks>a{position:relative;padding:4px 0;color:#1B1836;opacity:.75;transition:opacity .2s}",
    "#siteNav .navlinks>a:hover,#siteNav .navlinks>a.current{opacity:1}",
    "#siteNav .navlinks>a.current{color:#A80F52}",
    "#siteNav .nav-drop{position:relative}",
    "#siteNav .nav-drop-trigger{display:flex;align-items:center;gap:5px;background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-weight:600;font-size:.92rem;color:#1B1836;opacity:.75;padding:4px 0;transition:opacity .2s}",
    "#siteNav .nav-drop-trigger svg{transition:transform .2s}",
    "#siteNav .nav-drop:hover .nav-drop-trigger,#siteNav .nav-drop.open .nav-drop-trigger{opacity:1}",
    "#siteNav .nav-drop.open .nav-drop-trigger svg{transform:rotate(180deg)}",
    "#siteNav .nav-drop-panel{position:absolute;top:100%;left:50%;transform:translateX(-50%) translateY(6px);background:#FFFDF9;border:1px solid rgba(27,24,54,.1);border-radius:18px;box-shadow:0 24px 48px rgba(27,24,54,.14);padding:14px 12px 12px;opacity:0;pointer-events:none;transition:opacity .18s,transform .18s;z-index:60}",
    "#siteNav .nav-drop:hover .nav-drop-panel,#siteNav .nav-drop.open .nav-drop-panel{opacity:1;pointer-events:auto;transform:translateX(-50%) translateY(0)}",
    "#siteNav .nav-drop-panel::before{content:'';position:absolute;top:7px;left:50%;transform:translateX(-50%) rotate(45deg);width:12px;height:12px;background:#FFFDF9;border-left:1px solid rgba(27,24,54,.1);border-top:1px solid rgba(27,24,54,.1)}",
    "#siteNav .clubs-drop-panel{width:440px}",
    "#siteNav .clubs-drop-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px}",
    "#siteNav .clubs-drop-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:12px;transition:background .15s}",
    "#siteNav .clubs-drop-item:hover{background:rgba(225,26,110,.07)}",
    "#siteNav .clubs-drop-item img{width:28px;height:28px;border-radius:8px;object-fit:contain;background:#fff;border:1px solid rgba(27,24,54,.1);padding:3px;flex-shrink:0}",
    "#siteNav .clubs-drop-item span{font-size:.82rem;font-weight:600;color:#1B1836;line-height:1.25}",
    "#siteNav .clubs-drop-foot{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:10px;padding-top:10px;border-top:1px solid rgba(27,24,54,.1)}",
    "#siteNav .clubs-drop-foot span{font-size:.74rem;color:rgba(27,24,54,.45)}",
    "#siteNav .clubs-drop-foot a{font-size:.8rem;font-weight:700;color:#A80F52}",
    "#siteNav .learn-drop-panel{width:350px}",
    "#siteNav .res-drop-item{display:flex;gap:12px;padding:11px 10px;border-radius:12px;transition:background .15s;align-items:flex-start}",
    "#siteNav .res-drop-item:hover,#siteNav .res-drop-item.current{background:rgba(225,26,110,.07)}",
    "#siteNav .res-drop-item.current h5{color:#A80F52}",
    "#siteNav .res-drop-ico{width:36px;height:36px;border-radius:10px;background:rgba(225,26,110,.09);color:#A80F52;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1rem}",
    "#siteNav .res-drop-item h5{font-size:.86rem;font-weight:700;color:#1B1836;margin-bottom:2px}",
    "#siteNav .res-drop-item p{font-size:.74rem;color:rgba(27,24,54,.5);line-height:1.4;margin:0}",
    "#siteNav .back{font-weight:700;font-size:.86rem;color:#A80F52;white-space:nowrap}",
    "#siteNav .nav-admin{font-weight:700;font-size:.84rem;color:#A80F52;opacity:.85;transition:opacity .2s;white-space:nowrap}",
    "#siteNav .nav-admin:hover{opacity:1}",
    "#siteNav .nav-cta{background:#1B1836;color:#fff !important;padding:10px 20px;border-radius:100px;font-weight:700;font-size:.85rem;white-space:nowrap}",
    "#siteNav .nav-cta:hover{background:#A80F52}",
    "#siteNav .burger{display:none;background:none;border:none;cursor:pointer;padding:6px}",
    "#siteNav .burger span{display:block;width:22px;height:2px;background:#1B1836;margin:5px 0;border-radius:2px}",
    "#siteNav .mobile-menu{display:none;position:fixed;top:72px;left:0;right:0;background:#FFFDF9;border-bottom:1px solid rgba(27,24,54,.1);z-index:99;padding:14px 28px 26px;flex-direction:column;max-height:calc(100vh - 72px);overflow-y:auto}",
    "#siteNav .mobile-menu.open{display:flex}",
    "#siteNav .mobile-menu a{font-weight:600;font-size:1rem;color:#1B1836;padding:10px 0;border-bottom:1px solid rgba(27,24,54,.06)}",
    "#siteNav .mobile-menu a:last-child{border-bottom:none}",
    "#siteNav .mobile-menu .mm-group{font-size:.66rem;font-weight:800;text-transform:uppercase;letter-spacing:.09em;color:rgba(27,24,54,.42);margin:14px 0 2px}",
    "#siteNav .mobile-menu a.mm-cta{background:#1B1836;color:#fff;border-radius:100px;text-align:center;padding:13px;border:none;margin-top:14px}",
    "@media (max-width:920px){#siteNav .navlinks,#siteNav .nav-admin,#siteNav .nav-cta{display:none}#siteNav .burger{display:block}}",
    ".skip-link{position:fixed;top:-70px;left:16px;z-index:300;background:#A80F52;color:#fff;padding:11px 20px;border-radius:0 0 12px 12px;font-weight:700;font-size:.85rem;box-shadow:0 12px 28px rgba(27,24,54,.25);transition:top .2s}",
    ".skip-link:focus{top:0}",
    "#backTop{position:fixed;left:22px;bottom:26px;z-index:94;width:46px;height:46px;border-radius:50%;border:none;cursor:pointer;background:#1B1836;color:#fff;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transform:translateY(12px);transition:opacity .25s,transform .25s,background .2s;box-shadow:0 12px 28px rgba(27,24,54,.3)}",
    "#backTop.show{opacity:1;pointer-events:auto;transform:translateY(0)}",
    "#backTop:hover{background:#A80F52}"
  ].join("\n");

  var CHEV = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 3.5L5 7L8.5 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

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
    learnItem("/tutorials", "🎓", "Tutorials", "Meetings, board, assembly, ZRR, DRR and blood drive – step by step", "tutorials") +
    learnItem("/handbook", "📘", "Handbook", "District rules made simple: grants, twinship, projects, health", "handbook") +
    learnItem("/guides", "📄", "Resources", "Official documents, constitutions and downloadable forms", "resources") +
    learnItem("/club-guides", "📚", "Guides for Clubs", "The playbook for running a great club all year", "guides") +
    learnItem("/rkt-quiz", "🧠", "RKT Practice Quiz", "Test your Rotaract knowledge in 2 minutes", "quiz");

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
    '<button type="button" class="nav-drop-trigger" aria-haspopup="true" aria-expanded="false"' + (current === "tutorials" || current === "handbook" || current === "resources" || current === "guides" || current === "quiz" ? ' style="opacity:1;color:#A80F52"' : "") + '>Learn ' + CHEV + "</button>" +
    '<div class="nav-drop-panel learn-drop-panel">' + learnItems + "</div>" +
    "</div>" +
    item("/gallery", "Gallery", "gallery") +
    "</div>" +
    '<div style="display:flex;align-items:center;gap:16px;">' +
    '<a href="/admin" class="nav-admin">Club Admin</a>' +
    ctaHtml +
    '<button class="burger" id="burgerBtn" aria-label="Open menu"><span></span><span></span><span></span></button>' +
    "</div>" +
    "</div>" +
    '<div class="mobile-menu" id="mobileMenu">' +
    item("/about", "About", "about") +
    '<div class="mm-group">Clubs</div>' +
    '<a href="/#clubs">All 9 Clubs in Zone 7</a>' +
    '<div class="mm-group">Learn</div>' +
    '<a href="/tutorials">Tutorials</a>' +
    '<a href="/handbook">Handbook</a>' +
    '<a href="/guides">Resources &amp; Documents</a>' +
    '<a href="/club-guides">Guides for Clubs</a>' +
    '<a href="/rkt-quiz">RKT Practice Quiz</a>' +
    '<div class="mm-group">Community</div>' +
    item("/gallery", "Gallery", "gallery") +
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

  var skip = document.createElement("a");
  skip.href = "#siteMain";
  skip.className = "skip-link";
  skip.textContent = "Skip to content";
  document.body.insertBefore(skip, document.body.firstChild);
  var mainTarget = document.querySelector("main, #content, .hero, .game-wrap");
  if (mainTarget) {
    if (!mainTarget.id) mainTarget.id = "siteMain";
    mainTarget.setAttribute("tabindex", "-1");
  }

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
})();
