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
     user never sees a cut.

   Safety: prefers-reduced-motion, new-tab/download/mailto/hash links, and
   bfcache restores (back button) are all handled; nothing can be stuck
   invisible.
*/
(function () {
  "use strict";
  if (window.__zone7PageTransition) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  window.__zone7PageTransition = true;

  var EXIT_MS = 220;
  var ENTER_MS = 480;
  var leaving = false;
  var html = document.documentElement;

  var style = document.createElement("style");
  style.textContent =
    "body{transition:opacity " + ENTER_MS + "ms cubic-bezier(.25,.6,.35,1)}" +
    "html.pt-enter body{opacity:0}";
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
      document.body.style.transition = "";
      document.body.style.opacity = "";
    }
  });

  function pageBackground() {
    try {
      var c = getComputedStyle(document.body).backgroundColor;
      if (c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent") return c;
    } catch (e) {}
    return "#FFF8EF";
  }

  function leave(url) {
    if (leaving) return;
    leaving = true;
    html.classList.remove("pt-enter");
    html.style.background = pageBackground();
    document.body.style.transition = "opacity " + EXIT_MS + "ms cubic-bezier(.4,0,.6,1)";
    document.body.style.opacity = "0";
    var start = performance.now();
    function finish(now) {
      if (document.hidden) { location.assign(url); return; }
      if (now - start >= EXIT_MS) { location.assign(url); return; }
      requestAnimationFrame(finish);
    }
    requestAnimationFrame(finish);
  }

  document.addEventListener("click", function (e) {
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
