/* Zone 7 page transitions — seamless cross-fade between pages.

   How it works:
   - Every page carries a tiny inline <head> script that, BEFORE first paint,
     marks <html> with "pt-enter" and sets the cream veil. The page therefore
     never flashes white — it is born hidden, ready to dissolve in.
   - This file (defer) adds the opacity rules, then removes "pt-enter" once
     the page is actually painted (DOM ready + React root mounted), so the
     fade-in reveals real content, never an empty shell.
    - Clicking a same-origin cross-page link fades the current page out over
      the same cream, then navigates — both sides of the switch match, so the
      user never sees a cut. The shared navbar (#siteNav) never takes part in
      these fades: it is pixel-identical on every page, so it stays pinned
      while only the content beneath it dissolves.

   Safety: prefers-reduced-motion, new-tab/download/mailto/hash links, and
   bfcache restores (back button) are all handled; nothing can be stuck
   invisible.
*/
(function () {
  "use strict";
  if (window.__zone7PageTransition) return;
  window.addEventListener("unhandledrejection", function (e) {
    var r = e.reason;
    if (r && r.name === "AbortError" && /Transition was skipped/i.test(String(r.message || ""))) e.preventDefault();
  });
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  window.__zone7PageTransition = true;

  var EXIT_MS = 140;
  var ENTER_MS = 480;
  var leaving = false;
  var html = document.documentElement;
  // Progressive enhancement: Chromium browsers with the cross-document View
  // Transitions API handle the whole switch natively (nav included), so the
  // JS fade-out is skipped there. Everything else keeps the classic fade.
  var vtNative = (typeof document.startViewTransition === "function") &&
    /Chrome\/|Edg\/|Chromium\//.test(navigator.userAgent);

  var style = document.createElement("style");
  // The shared navbar (#siteNav) is deliberately EXCLUDED from every fade:
  // it paints identically on all pages (solid background, pre-hydrated
  // markup), so it stays pinned at full opacity while page content flows
  // beneath it. Only body content cross-fades — the nav never moves.
  style.textContent =
    "body>:not(#siteNav){transition:opacity " + ENTER_MS + "ms cubic-bezier(.25,.6,.35,1)}" +
    "html.pt-enter body>:not(#siteNav){opacity:0}";
  document.head.appendChild(style);

  function reveal() {
    if (leaving) return;
    var root = document.getElementById("root");
    var deadline = performance.now() + 1200;
    function check(now) {
      if (html.classList.contains("pt-enter") && (root && root.childElementCount === 0) && now < deadline) {
        requestAnimationFrame(check);
        return;
      }
      requestAnimationFrame(function () {
        html.classList.remove("pt-enter");
        html.style.background = "";
      });
    }
    requestAnimationFrame(check);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", reveal);
  } else {
    reveal();
  }

  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      leaving = false;
      html.classList.remove("pt-enter");
      clearSiblingFades();
    }
  });

  function pageBackground() {
    try {
      var c = getComputedStyle(document.body).backgroundColor;
      if (c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent") return c;
    } catch (e) {}
    try {
      var h = getComputedStyle(document.documentElement).backgroundColor;
      if (h && h !== "rgba(0, 0, 0, 0)" && h !== "transparent") return h;
    } catch (e) {}
    return document.documentElement.classList.contains("dark") ? "#0E0C1A" : "#FAFAFA";
  }

  function contentNodes() {
    return Array.prototype.filter.call(document.body.children, function (el) {
      return el.id !== "siteNav";
    });
  }
  function fadeSiblings(transition, opacity) {
    contentNodes().forEach(function (el) {
      el.style.transition = transition;
      el.style.opacity = opacity;
    });
  }
  function clearSiblingFades() {
    contentNodes().forEach(function (el) {
      el.style.transition = "";
      el.style.opacity = "";
    });
  }

  function leave(url) {
    if (leaving) return;
    leaving = true;
    html.classList.remove("pt-enter");
    html.style.background = pageBackground();
    fadeSiblings("opacity " + EXIT_MS + "ms cubic-bezier(.4,0,.6,1)", "0");
    var start = performance.now();
    function finish(now) {
      if (document.hidden) { location.assign(url); return; }
      if (now - start >= EXIT_MS) { location.assign(url); return; }
      requestAnimationFrame(finish);
    }
    requestAnimationFrame(finish);
  }

  document.addEventListener("click", function (e) {
    if (vtNative) return;
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    if (a.target && a.target !== "_self") return;
    if (a.hasAttribute("download") || a.hasAttribute("data-no-transition")) return;
    var href = a.getAttribute("href") || "";
    if (/^(mailto:|tel:|javascript:|#)/i.test(href)) return;
    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) return;
    e.preventDefault();
    leave(url.href);
  });
})();
