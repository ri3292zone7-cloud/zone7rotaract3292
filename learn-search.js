/* Spotlight search for the Learn section - one engine for every entry point (subnav bar, toolbar button, Cmd/Ctrl-K).
   Broad index in learn-index.js; pages may add a deep index via window.LEARN_DEEP={page:"/x",items:[{t,d,icon,s,a,scroll}]} */
(function () {
  var root = document.getElementById("learnSearch");
  if (!root || !window.LEARN_INDEX) return;
  var trigger = root.querySelector(".lb-open");
  var overlay = document.createElement("div");
  overlay.id = "lspotlight";
  var spot = document.createElement("div");
  spot.id = "lbSpot";
  spot.className = "hide";
  spot.innerHTML =
    '<div class="lb-field"><span class="lb-ico">🔍</span>' +
    '<input type="text" id="learnSearchInput" placeholder="Search the Learn section…" autocomplete="off" spellcheck="false" aria-label="Search the Learn section">' +
    '<button type="button" class="lb-close" aria-label="Close search">✕</button></div>' +
    '<div id="learnSearchPanel" role="listbox" aria-label="Learn section results"></div>';
  document.body.appendChild(overlay);
  document.body.appendChild(spot);
  var input = spot.querySelector("#learnSearchInput");
  var panel = spot.querySelector("#learnSearchPanel");
  var closeBtn = spot.querySelector(".lb-close");
  var nodes = [];
  var sel = -1;
  var DEEP_PER_GROUP = 6;

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

  function score(t, sub, q) {
    t = t.toLowerCase(); sub = (sub || "").toLowerCase();
    if (t.indexOf(q) === 0) return 0;
    if (t.indexOf(q) !== -1) return 1;
    return 2;
  }

  function open(prefill) {
    overlay.classList.add("on");
    spot.classList.remove("hide");
    document.body.classList.add("lspot");
    trigger.setAttribute("aria-expanded", "true");
    if (typeof prefill === "string" && prefill) { input.value = prefill; render(prefill.trim()); }
    requestAnimationFrame(function () {
      input.focus();
      input.select();
    });
  }

  function collapse() {
    overlay.classList.remove("on");
    spot.classList.add("hide");
    document.body.classList.remove("lspot");
    trigger.setAttribute("aria-expanded", "false");
    panel.classList.remove("open");
    panel.innerHTML = "";
    nodes = [];
    sel = -1;
    input.value = "";
  }

  function render(query) {
    sel = -1;
    nodes = [];
    if (!query) { panel.classList.remove("open"); return; }
    var q = query.toLowerCase();
    var groups = {};
    var order = [];
    function add(it) {
      if (it.t.toLowerCase().indexOf(q) === -1 && (it.d || "").toLowerCase().indexOf(q) === -1) return;
      if (!groups[it.s]) { groups[it.s] = []; order.push(it.s); }
      groups[it.s].push(it);
    }
    statics().forEach(add);
    var deep = [];
    deeps().forEach(function (it) {
      if (it.t.toLowerCase().indexOf(q) === -1 && (it.d || "").toLowerCase().indexOf(q) === -1) return;
      deep.push(it);
    });
    deep.sort(function (a, b) { return score(a.t, a.d, q) - score(b.t, b.d, q); });
    var perGroup = {};
    deep.forEach(function (it) {
      perGroup[it.s] = perGroup[it.s] || 0;
      if (perGroup[it.s] >= DEEP_PER_GROUP) return;
      perGroup[it.s]++;
      if (!groups[it.s]) { groups[it.s] = []; order.push(it.s); }
      groups[it.s].push(it);
    });
    var have = order.length > 0;
    if (!have) {
      panel.innerHTML = '<div class="lb-empty">No matches for that search</div>';
      panel.classList.add("open");
      return;
    }
    var html = "";
    order.forEach(function (sec) {
      html += '<div class="lb-group-title">' + sec + "</div>";
      groups[sec].forEach(function (it) {
        html += '<a class="lb-result" href="' + it.p + (it.a ? "#" + it.a : "") + '"' +
          (it.scroll ? ' data-scroll="' + it.scroll + '"' : "") + ">" +
          '<span class="lb-ico-box">' + it.icon + "</span>" +
          "<span><h6>" + it.t + "</h6><p>" + (it.d || it.s) + "</p></span>" +
          '<span class="lb-tag">' + pageLabel(it.p) + "</span></a>";
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

  panel.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a.lb-result") : null;
    if (!a || !a.getAttribute("data-scroll")) return;
    e.preventDefault();
    jumpDeep(a);
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

  function goSel() {
    var target = sel >= 0 ? nodes[sel] : nodes[0];
    if (!target) return;
    if (target.getAttribute("data-scroll")) jumpDeep(target);
    else target.click();
  }

  trigger.addEventListener("click", function () { open(); });
  closeBtn.addEventListener("click", collapse);
  overlay.addEventListener("click", collapse);
  input.addEventListener("input", function () { render(input.value.trim()); });
  input.addEventListener("focus", function () { if (input.value.trim()) render(input.value.trim()); });
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