/* Spotlight search for the Learn section - one engine for every entry point (subnav bar, toolbar button, Cmd/Ctrl-K).
   Broad index in learn-index.js; pages may add a deep index via window.LEARN_DEEP={page:"/x",items:[{t,d,icon,s,a,scroll}]}
   Ranking: exact title > title prefix > word-start > title contains > keyword/description, so the first row is the closest match.
   The searchable corpus is normalized once (and once more when live Supabase data lands) so a keystroke is a single scan, not a rebuild. */
(function () {
  if (!window.LEARN_INDEX && !window.SITE_INDEX) return;
  var root = document.getElementById("learnSearch");
  var trigger = root ? root.querySelector(".lb-open") : null;
  var overlay = document.createElement("div");
  overlay.id = "lspotlight";
  var spot = document.createElement("div");
  spot.id = "lbSpot";
  spot.className = "hide";
  spot.innerHTML =
    '<div class="lb-field"><span class="lb-ico">🔍</span>' +
    '<input type="text" id="learnSearchInput" placeholder="Search the whole site…" autocomplete="off" spellcheck="false" aria-label="Search the whole site">' +
    '<button type="button" class="lb-close" aria-label="Close search">✕</button></div>' +
    '<div id="learnSearchPanel" role="listbox" aria-label="Site search results"></div>';
  document.body.appendChild(overlay);
  document.body.appendChild(spot);
  var input = spot.querySelector("#learnSearchInput");
  var panel = spot.querySelector("#learnSearchPanel");
  var closeBtn = spot.querySelector(".lb-close");
  var nodes = [];
  var sel = -1;
  var CAP = 6;          // max rows per group - keeps the result DOM tiny so rendering stays instant
  var corpus = null;    // precomputed, normalized search entries (built once, invalidated when live data lands)
  var lastQuery = null; // skip re-rendering when the query has not changed

  function clean(s) { return String(s == null ? "" : s).replace(/\u2014/g, "-").replace(/\u00A0/g, " "); }

  function pageLabel(p) {
    return p === "/tutorials" ? "Learn hub" : (p === "/guides" ? "Resources" : "RotaQuiz");
  }

  function samePage(p) {
    var here = location.pathname.replace(/\/index\.html$/, "").replace(/\/$/, "") || "/";
    var there = String(p || "").replace(/\/$/, "") || "/";
    return here === there;
  }

  function statics() { return window.LEARN_INDEX || []; }

  function deeps() {
    var seen = {};
    statics().forEach(function (it) { seen[it.p + "|" + (it.a || "") + "|" + String(it.t).toLowerCase()] = 1; });
    var cands = [];
    var live = window.LEARN_DEEP;
    if (live && live.items && live.items.length) {
      live.items.forEach(function (it) {
        cands.push({ p: live.page, a: it.a, scroll: it.scroll || null, t: it.t, d: it.d || it.sub || "", s: it.s, icon: it.icon || "📄" });
      });
    }
    var stat = window.LEARN_DEEP_STATIC || {};
    Object.keys(stat).forEach(function (pg) {
      (stat[pg] || []).forEach(function (it) {
        cands.push({ p: pg, a: it.a, scroll: it.scroll || null, t: it.t, d: it.d || it.sub || "", s: it.s, icon: it.icon || "📄" });
      });
    });
    var out = [];
    cands.forEach(function (it) {
      var t = clean(it.t), sub = clean(it.d);
      var key = it.p + "|" + (it.a || "") + "|" + t.toLowerCase();
      if (seen[key]) return;
      seen[key] = 1;
      out.push({ p: it.p, a: it.a, scroll: it.scroll, t: t, d: sub, s: clean(it.s) || pageLabel(it.p), icon: it.icon, deep: true });
    });
    return out;
  }

  // Build the normalized corpus once. Every entry keeps a precomputed
  // lower-cased haystack so a keystroke is one scan - no re-merging the
  // index, no re-lowercasing hundreds of strings on every input event.
  function buildCorpus() {
    var out = [];
    var seen = {};
    function push(e) {
      var title = clean(e.t || "");
      var desc = clean(e.d || "");
      var href = e.h || (e.p + (e.a ? "#" + e.a : ""));
      var key = href + "|" + title.toLowerCase();
      if (seen[key]) return;
      seen[key] = 1;
      var k = (e.k && e.k.length) ? e.k.join(" ") : "";
      out.push({
        t: title,
        d: desc,
        s: e.s || "Results",
        icon: e.icon || "📄",
        h: href,
        tag: e.tag || "",
        p: e.p,
        a: e.a,
        scroll: e.scroll || null,
        hayT: title.toLowerCase(),
        hayK: k.toLowerCase(),
        hay: (title + " " + desc + " " + k).toLowerCase()
      });
    }
    statics().forEach(function (it) {
      push({ p: it.p, a: it.a, t: it.t, d: it.d, s: it.s, icon: it.icon });
    });
    if (window.SITE_INDEX) {
      window.SITE_INDEX.items().forEach(function (it) {
        push({ p: it.p, a: it.a, t: it.t, d: it.d, s: it.s, icon: it.icon, h: it.h, tag: it.tag, k: it.k });
      });
    }
    deeps().forEach(function (it) {
      push({ p: it.p, a: it.a, t: it.t, d: it.d, s: it.s, icon: it.icon, h: it.h, scroll: it.scroll });
    });
    corpus = out;
  }

  function wordStart(hay, term) {
    var idx = hay.indexOf(term);
    while (idx !== -1) {
      if (idx === 0 || !/[a-z0-9]/.test(hay.charAt(idx - 1))) return true;
      idx = hay.indexOf(term, idx + 1);
    }
    return false;
  }

  // Lower is better. -1 means "no match". Every query term must be present.
  function matchScore(e, terms, q) {
    for (var i = 0; i < terms.length; i++) {
      if (e.hay.indexOf(terms[i]) === -1) return -1;
    }
    var t = e.hayT;
    if (t === q) return 0;
    if (t.indexOf(q) === 0) return 1;
    var allWordStart = true;
    for (var j = 0; j < terms.length; j++) {
      if (!wordStart(t, terms[j])) { allWordStart = false; break; }
    }
    if (allWordStart) return 2;
    if (t.indexOf(q) !== -1) return 3;
    if (e.hayK && e.hayK.indexOf(q) === 0) return 3;
    return 4;
  }

  function open(prefill) {
    overlay.classList.add("on");
    spot.classList.remove("hide");
    document.body.classList.add("lspot");
    if (trigger) trigger.setAttribute("aria-expanded", "true");
    if (typeof prefill === "string" && prefill) { input.value = prefill; render(prefill.trim()); }
    if (window.SITE_INDEX) {
      window.SITE_INDEX.ensure(function () {
        corpus = null; lastQuery = null;
        if (overlay.classList.contains("on")) {
          var v = input.value.trim();
          if (v) render(v);
        }
      });
    }
    requestAnimationFrame(function () {
      input.focus();
      input.select();
    });
  }

  function collapse() {
    overlay.classList.remove("on");
    spot.classList.add("hide");
    document.body.classList.remove("lspot");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
    panel.classList.remove("open");
    panel.innerHTML = "";
    nodes = [];
    sel = -1;
    lastQuery = null;
    input.value = "";
    if (document.activeElement === input) {
      if (trigger) trigger.focus();
      else input.blur();
    }
  }

  function render(query) {
    var q = String(query == null ? "" : query).toLowerCase().replace(/\s+/g, " ").trim();
    if (!q) { sel = -1; nodes = []; lastQuery = null; panel.classList.remove("open"); panel.innerHTML = ""; return; }
    if (q === lastQuery) return;
    lastQuery = q;
    sel = -1;
    nodes = [];
    if (!corpus) buildCorpus();
    var terms = q.split(" ");
    var matched = [];
    for (var i = 0; i < corpus.length; i++) {
      var sc = matchScore(corpus[i], terms, q);
      if (sc >= 0) { corpus[i]._sc = sc; matched.push(corpus[i]); }
    }
    if (!matched.length) {
      panel.innerHTML = '<div class="lb-empty">No matches for that search</div>';
      panel.classList.add("open");
      return;
    }
    // Best match first overall; groups keep their first (best) appearance order.
    matched.sort(function (a, b) { return a._sc - b._sc || a.t.length - b.t.length; });
    var groups = {}, order = [], counts = {};
    matched.forEach(function (it) {
      var g = it.s || "Results";
      counts[g] = counts[g] || 0;
      if (counts[g] >= CAP) return;
      counts[g]++;
      if (!groups[g]) { groups[g] = []; order.push(g); }
      groups[g].push(it);
    });
    var html = "";
    order.forEach(function (sec) {
      html += '<div class="lb-group-title">' + sec + "</div>";
      groups[sec].forEach(function (it) {
        html += '<a class="lb-result" href="' + it.h + '"' +
          (it.scroll ? ' data-scroll="' + it.scroll + '"' : "") + ">" +
          '<span class="lb-ico-box">' + (it.icon || "📄") + "</span>" +
          "<span><h6>" + it.t + "</h6><p>" + (it.d || it.s) + "</p></span>" +
          '<span class="lb-tag">' + (it.tag || pageLabel(it.p)) + "</span></a>";
      });
    });
    panel.innerHTML = html;
    nodes = panel.querySelectorAll(".lb-result");
    panel.classList.add("open");
  }

  function scrollToTarget(id, tries) {
    if (!id) return;
    var el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    if (tries > 0) setTimeout(function () { scrollToTarget(id, tries - 1); }, 250);
  }

  function jumpDeep(a) {
    var scroll = a.getAttribute("data-scroll");
    var href = a.getAttribute("href") || "";
    var m = href.match(/^(.*?)(#.*)?$/);
    var p = m[1] || location.pathname, h = m[2] || "";
    try { if (scroll) sessionStorage.setItem("z7spot", scroll); } catch (e) {}
    collapse();
    if (scroll && samePage(p)) {
      if (h && h !== location.hash) location.hash = h;
      setTimeout(function () { scrollToTarget(scroll, 4); }, 60);
    } else {
      location.href = href;
    }
  }

  // Result click: scroll-target results are handled here; plain links navigate
  // immediately with the overlay closed first (so it never lingers over the
  // next page). Modifier/middle clicks keep native new-tab behaviour.
  panel.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a.lb-result") : null;
    if (!a) return;
    if (a.getAttribute("data-scroll")) { e.preventDefault(); jumpDeep(a); return; }
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    var href = a.getAttribute("href") || "";
    collapse();
    if (href) location.assign(href);
  });

  function consumeStoredScroll(tries) {
    var id = null;
    try { id = sessionStorage.getItem("z7spot"); } catch (e) {}
    if (!id) return;
    var el = document.getElementById(id);
    if (el) {
      try { sessionStorage.removeItem("z7spot"); } catch (e) {}
      setTimeout(function () { el.scrollIntoView({ block: "start" }); }, 120);
    } else if (tries > 0) {
      setTimeout(function () { consumeStoredScroll(tries - 1); }, 350);
    } else {
      try { sessionStorage.removeItem("z7spot"); } catch (e) {}
    }
  }

  function setSel(n) {
    if (!nodes.length) return;
    n = Math.max(0, Math.min(n, nodes.length - 1));
    if (sel >= 0) nodes[sel].classList.remove("sel");
    sel = n;
    nodes[sel].classList.add("sel");
    nodes[sel].scrollIntoView({ block: "nearest" });
  }

  // Enter routes to the closest match: the arrow-selected row, else the
  // top-ranked row (nodes[0]). The overlay closes before the navigation.
  function goSel() {
    var target = sel >= 0 ? nodes[sel] : nodes[0];
    if (!target) return;
    if (target.getAttribute("data-scroll")) { jumpDeep(target); return; }
    var href = target.getAttribute("href") || "";
    collapse();
    if (href) location.assign(href);
  }

  if (trigger) trigger.addEventListener("click", function () { open(); });
  closeBtn.addEventListener("click", collapse);
  overlay.addEventListener("click", collapse);
  input.addEventListener("input", function () { render(input.value); });
  input.addEventListener("focus", function () { if (input.value.trim()) render(input.value); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel(sel + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel(sel - 1); }
    else if (e.key === "Enter") { e.preventDefault(); goSel(); }
    else if (e.key === "Escape") collapse();
  });
  document.addEventListener("keydown", function (e) {
    var tag = e.target && e.target.tagName;
    if (e.key === "/" && !overlay.classList.contains("on") && tag !== "INPUT" && tag !== "TEXTAREA" && !(e.target && e.target.isContentEditable)) {
      e.preventDefault();
      open();
    } else if (e.key === "Escape" && overlay.classList.contains("on")) {
      collapse();
    }
  });

  window.LearnSpot = { open: open, collapse: collapse };
  setTimeout(function () { consumeStoredScroll(3); }, 400);
})();
