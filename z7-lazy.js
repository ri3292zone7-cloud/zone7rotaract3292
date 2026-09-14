/* z7-lazy.js — takes the heavy feature JS off the initial load path.
   Two widget stacks, previously included via <script defer> on every page (~120 KB),
   are now fetched only when they can actually be used:
     - Spotlight site search (site-index, learn-index, learn-deep, learn-search)
     - RotaGPT chat (rota-gpt-data, rota-gpt)
   Loading triggers:
     1. The search UI is clicked, "/" or Ctrl/Cmd+K is pressed  -> load search now, replay intent
     2. Any first user interaction or a short idle gap          -> preload both in the background
   Script order matters (dependencies), so injection is sequential.
*/
(function () {
  "use strict";

  var SEARCH = ["site-index.js", "learn-index.js", "learn-deep.js", "learn-search.js"];
  var CHAT = ["rota-gpt-data.js", "rota-gpt.js"];

  var base = "";
  try {
    var src = (document.currentScript && document.currentScript.src) || "";
    if (!src && document.scripts && document.scripts.length) {
      var last = document.scripts[document.scripts.length - 1];
      if (last && last.src) src = last.src;
    }
    base = src.replace(/z7-lazy\.js[?#].*$/, "").replace(/z7-lazy\.js$/, "");
  } catch (e) {}

  var loading = { search: false, chat: false };
  var done = { search: false, chat: false };
  var pending = { search: false, chat: false };

  // Proxy so any early callers (site-nav's openSiteSearch, the inline openSpot()
  // used by tutorials/rkt-quiz) queue an open instead of failing while the
  // engines are still loading. learn-search.js replaces this once it runs.
  if (!window.LearnSpot) {
    window.LearnSpot = {
      open: function () {
        if (done.search) { openSearch(); return; }
        pending.search = true;
        inject(SEARCH, "search");
      }
    };
  }

  function inject(list, key) {
    if (loading[key] || done[key]) return;
    loading[key] = true;
    var i = 0;
    (function next() {
      if (i >= list.length) { loading[key] = false; done[key] = true; onReady(key); return; }
      var s = document.createElement("script");
      s.src = base + list[i++];
      s.async = false;
      s.onload = s.onerror = next;
      document.head.appendChild(s);
    })();
  }

  function openSearch() {
    if (window.LearnSpot && window.LearnSpot.open) window.LearnSpot.open();
    else location.assign("/search");
  }
  function openChat() {
    if (window.RotaGPT && window.RotaGPT.open) window.RotaGPT.open();
  }

  function onReady(key) {
    if (key === "search") {
      if (pending.search) { pending.search = false; openSearch(); }
    } else if (key === "chat") {
      var btn = document.getElementById("navRotaGpt");
      if (btn) btn.style.display = window.RotaGPT ? "" : "none";
      if (pending.chat) { pending.chat = false; openChat(); }
    }
  }

  function isSearchTrigger(t) {
    return !!(t && t.closest && t.closest("#navSearchBtn, #mmSearch, .lb-search .lb-open"));
  }

  // Capture-phase interception: stop site-nav's fallback redirect for search triggers
  // and the per-button handlers, then load the engines and open the spotlight ourselves.
  document.addEventListener("click", function (e) {
    if (!isSearchTrigger(e.target)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (e.target.closest("#mmSearch")) {
      var menu = document.getElementById("mobileMenu");
      var burger = document.getElementById("burgerBtn");
      if (menu) menu.classList.remove("open");
      if (burger) burger.setAttribute("aria-expanded", "false");
    }
    if (done.search) { openSearch(); return; }
    pending.search = true;
    inject(SEARCH, "search");
  }, true);

  document.addEventListener("keydown", function (e) {
    var t = e.target, tag = (t && t.tagName) || "";
    var typing = tag === "INPUT" || tag === "TEXTAREA" || (t && t.isContentEditable);
    var wantSearch =
      (!typing && e.key === "/") ||
      ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k");
    if (!wantSearch) return;
    e.preventDefault();
    if (done.search) { openSearch(); return; }
    pending.search = true;
    inject(SEARCH, "search");
  }, true);

  // First real interaction with the page: quietly fetch both stacks in the background.
  var kicked = false;
  function kick() {
    if (kicked) return;
    kicked = true;
    inject(SEARCH, "search");
    inject(CHAT, "chat");
  }
  ["pointerdown", "touchstart", "wheel", "keydown", "scroll"].forEach(function (ev) {
    window.addEventListener(ev, kick, { once: true, passive: true, capture: true });
  });

  // Background preload once the main thread is idle (~4 s cap) for passive readers.
  function idleLoad() { inject(SEARCH, "search"); inject(CHAT, "chat"); }
  if ("requestIdleCallback" in window) window.requestIdleCallback(idleLoad, { timeout: 4000 });
  else setTimeout(idleLoad, 4000);
})();

/* Mobile-only next-page prefetch: warms the cache for the static shell (nav renders
   in first paint), so the full page load that follows feels instant. Desktop keeps
   its original full-load behaviour. */
(function () {
  "use strict";
  if (!window.matchMedia || !matchMedia("(max-width:920px)").matches) return;
  var warmed = {};
  function warm(href) {
    var url = href.split("#")[0].split("?")[0];
    if (!url || url.charAt(0) !== "/" || warmed[url]) return;
    warmed[url] = 1;
    try {
      var check = ["/index", "/index.html"];
      if (check.indexOf(url) !== -1) url = "/";
      var l = document.createElement("link");
      l.rel = "prefetch";
      l.href = url;
      document.head.appendChild(l);
    } catch (e) {}
  }
  function onHoverOrTap(e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || a.target === "_blank" || a.download) return;
    warm(a.getAttribute("href") || "");
  }
  document.addEventListener("pointerover", onHoverOrTap, true);
  document.addEventListener("touchstart", onHoverOrTap, true);
  document.addEventListener("pointerdown", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || a.target === "_blank" || a.download) return;
    warm(a.getAttribute("href") || "");
  }, true);
})();