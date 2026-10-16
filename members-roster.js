/* Zone 7 shared members roster — injected below #board on custom club pages.
 * Usage: <script src="/members-roster.js" data-club="sankhu" defer></script>
 * Data: /data/members-zone7.json (privacy-safe: name, photo, role, club, join year).
 * No framework, no rebuild needed — works on hand-built pages and React dist shells.
 */
(function () {
  var SLUGS = ["balkumari","baneshwor","liberty","kathmanduwest","kathmanduheight","sankhu","newroadcity","sukedhara","tripureswor"];

  function clubSlug() {
    try {
      var s = document.querySelector('script[data-club]');
      if (s && s.getAttribute("data-club")) return s.getAttribute("data-club").toLowerCase();
      var q = new URLSearchParams(location.search).get("club");
      if (q && SLUGS.indexOf(q.toLowerCase()) > -1) return q.toLowerCase();
      var seg = (location.pathname || "/").split("/").filter(Boolean)[0] || "";
      seg = seg.toLowerCase().replace(/\.html$/, "");
      if (SLUGS.indexOf(seg) > -1) return seg;
    } catch (e) {}
    return null;
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* Per-club accent: matches each custom page's own brand, so the injected
     roster reads as part of that page instead of default Zone 7 pink.
     club.html-routed clubs already theme via CLUB_THEMES; this covers the
     hand-built + React shells where the roster is injected. */
  var CLUB_ACCENT = {
    balkumari: "#12633a",
    baneshwor: "#d43d3d",
    liberty: "#ff4757",
    kathmanduwest: "#5c4300",
    kathmanduheight: "#6C63FF",
    sankhu: "#7C3AED",
    newroadcity: "#8a1538",
    sukedhara: "#a82f43",
    tripureswor: "#0052FF"
  };

  function injectCSS() {
    if (document.getElementById("z7m-style")) return;
    var css = [
      "#z7-members{max-width:1100px;margin:0 auto;padding:28px 24px 64px;font-family:inherit;}",
      "#z7-members .z7m-kicker{display:inline-block;font-weight:700;font-size:.72rem;line-height:1;letter-spacing:.14em;text-transform:uppercase;color:var(--z7m-accent,#A80F52);background:var(--z7m-soft,rgba(225,26,110,.09));padding:8px 14px;border-radius:100px;margin-bottom:12px;font-family:inherit;}",
      "#z7-members h2{font-weight:800;font-size:clamp(1.4rem,3vw,2rem);line-height:1.15;letter-spacing:-.02em;color:inherit;margin:0 0 6px;font-family:inherit;}",
      "#z7-members .z7m-count{font-weight:600;font-size:.85rem;line-height:1.5;opacity:.6;margin:0 0 20px;font-family:inherit;}",
      "#z7-members .z7m-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px;}",
      "#z7-members .z7m-card{background:#fff;border:1px solid rgba(27,24,54,.1);border-radius:18px;overflow:hidden;transition:transform .2s,box-shadow .2s;}",
      "#z7-members .z7m-card:hover{transform:translateY(-4px);box-shadow:0 16px 32px rgba(27,24,54,.12);}",
      "#z7-members .z7m-ph{aspect-ratio:1/1;background:var(--z7m-soft,rgba(225,26,110,.12));display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.5rem;line-height:1;color:var(--z7m-accent,#A80F52);overflow:hidden;font-family:inherit;}",
      "#z7-members .z7m-ph img{width:100%;height:100%;object-fit:cover;display:block;}",
      "#z7-members .z7m-info{padding:12px 14px 16px;}",
      "#z7-members .z7m-info h5{font-weight:700;font-size:.9rem;line-height:1.3;color:#1B1836;margin:0 0 2px;font-family:inherit;}",
      "#z7-members .z7m-role{font-weight:700;font-size:.74rem;line-height:1.4;color:var(--z7m-accent,#A80F52);display:block;font-family:inherit;}",
      "#z7-members .z7m-meta{font-weight:600;font-size:.7rem;line-height:1.4;color:rgba(27,24,54,.5);margin-top:4px;font-family:inherit;}",
      "#z7-members .z7m-link{display:inline-block;margin-top:16px;font-weight:700;font-size:.82rem;line-height:1;color:var(--z7m-accent,#A80F52);font-family:inherit;}",
      "#z7-members .z7m-empty{padding:40px 20px;text-align:center;opacity:.55;font-weight:500;font-size:.9rem;line-height:1.5;font-family:inherit;}",
      "/* Baneshwor sketch page: pencil borders, hard offset shadow, post-it initials. */",
      '#z7-members[data-club=\"baneshwor\"] .z7m-card{border:2.5px solid #2d2d2d;border-radius:14px 18px 15px 19px;box-shadow:4px 4px 0 0 #2d2d2d;}',
      '#z7-members[data-club=\"baneshwor\"] .z7m-card:nth-child(odd){transform:rotate(-.5deg);}',
      '#z7-members[data-club=\"baneshwor\"] .z7m-card:hover{transform:rotate(0deg) translateY(-3px);}',
      '#z7-members[data-club=\"baneshwor\"] .z7m-ph{background:#fff9c4;}',
      "/* Tripureswor neo page: sharper geometry like its own cards. */",
      '#z7-members[data-club=\"tripureswor\"] .z7m-card{border-radius:12px;}'
    ].join("\n");
    var st = document.createElement("style");
    st.id = "z7m-style";
    st.textContent = css;
    document.head.appendChild(st);
  }

  function initials(name) {
    return String(name || "").replace(/^Rtr\.\s*/i, "").trim().split(/\s+/).map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase() || "–";
  }

  function roleLabel(r) { return (!r || r === "N/A") ? "Member" : r; }

  function render(list, slug) {
    injectCSS();
    if (document.getElementById("z7-members")) return;
    var sec = document.createElement("section");
    sec.id = "z7-members";
    sec.setAttribute("aria-label", "All members of this club");
    if (slug) {
      sec.setAttribute("data-club", slug);
      /* Paint the roster in the host page's own club colour. */
      var accent = CLUB_ACCENT[slug];
      if (accent) {
        sec.style.setProperty("--z7m-accent", accent);
        sec.style.setProperty("--z7m-soft", accent + "1A");
      }
    }
    var cards = list.slice().sort(function (a, b) {
      return String(a.name).localeCompare(String(b.name));
    }).map(function (m) {
      var photo = m.photo ? '<img loading="lazy" decoding="async" src="/' + esc(m.photo) + '" alt="' + esc(m.name) + '" onerror="this.remove()">' : esc(initials(m.name));
      var joined = m.join_year ? "Joined " + esc(String(m.join_year)) : esc(m.joined || "");
      return '<div class="z7m-card"><div class="z7m-ph">' + photo + '</div>' +
        '<div class="z7m-info"><h5>' + esc(m.name) + '</h5>' +
        '<span class="z7m-role">' + esc(roleLabel(m.role)) + '</span>' +
        (joined ? '<div class="z7m-meta">' + joined + '</div>' : "") + '</div></div>';
    }).join("");
    sec.innerHTML =
      '<span class="z7m-kicker">Roster</span>' +
      '<h2>All members of this club.</h2>' +
      '<p class="z7m-count">' + (list.length ? list.length + " member" + (list.length === 1 ? "" : "s") + " · from district roster" : "No roster entries yet for this club.") + '</p>' +
      (cards ? '<div class="z7m-grid">' + cards + '</div>' : '<div class="z7m-empty">No roster entries yet for this club.</div>') +
      '<a class="z7m-link" href="/members' + (slug ? "?club=" + encodeURIComponent(slug) : "") + '">View Zone 7 directory →</a>';
    var board = document.getElementById("board");
    if (board && board.parentNode) {
      board.parentNode.insertBefore(sec, board.nextSibling);
    } else {
      var root = document.getElementById("root") || document.querySelector("main") || document.body;
      root.appendChild(sec);
    }
  }

  function load(slug) {
    fetch("/data/members-zone7.json", { cache: "force-cache" }).then(function (r) {
      if (!r.ok) throw new Error("http " + r.status);
      return r.json();
    }).then(function (all) {
      render(all.filter(function (m) { return m.club_slug === slug; }), slug);
    }).catch(function (e) {
      if (window.console && console.warn) console.warn("z7 members roster failed:", e);
    });
  }

  function boot() {
    var slug = clubSlug();
    if (!slug) return;
    // React shells render #board asynchronously — poll briefly, then render anyway.
    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      if (document.getElementById("board") || tries >= 25) {
        clearInterval(timer);
        load(slug);
      }
    }, 200);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
