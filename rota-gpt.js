/* RotaGPT — the Zone 7 chatbot widget.
   Answers from the local knowledge base (rota-gpt-data.js) appear instantly.
   Then, when a model is reachable, the same bubble is upgraded in place:
   1) the serverless /api/rota-gpt endpoint (needs a configured key), or
   2) the anonymous public Pollinations endpoint called directly from the
      browser. No API key is required on the client. */
(function () {
  if (window.__rotaGptLoaded) return;
  window.__rotaGptLoaded = true;

  var KB = (window.ROTA_KB || []).slice();

  var CSS = [
    "#rgpt-veil{position:fixed;inset:0;z-index:9989;background:rgba(27,24,54,.38);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);opacity:0;visibility:hidden;transition:opacity .25s,visibility .25s}",
    "#rgpt-veil.open{opacity:1;visibility:visible}",
    "#rgpt-panel{position:fixed;right:20px;bottom:20px;z-index:9990;width:min(400px,calc(100vw - 40px));height:min(680px,calc(100dvh - 40px));background:#FFFDF9;border:1px solid rgba(27,24,54,.1);border-radius:20px;box-shadow:0 24px 64px rgba(27,24,54,.28);display:flex;flex-direction:column;overflow:hidden;font-family:'Inter',sans-serif;opacity:0;visibility:hidden;transform:translateY(16px) scale(.98);transition:opacity .22s,transform .22s cubic-bezier(.32,.72,.24,1),visibility .22s}",
    "#rgpt-panel.open{opacity:1;visibility:visible;transform:none}",
    "@keyframes rgptSpin{to{transform:rotate(360deg)}}",
    "#rgpt-head{background:#FFFDF9;color:#1B1836;padding:14px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(27,24,54,.08)}",
    "#rgpt-head .rgpt-avatar{width:36px;height:36px;border-radius:12px;background:#E11A6E;display:flex;align-items:center;justify-content:center;flex-shrink:0}",
    "#rgpt-head .rgpt-avatar svg{width:22px;height:22px;animation:rgptSpin 8s linear infinite}",
    "#rgpt-head h3{font-family:'Poppins',sans-serif;font-size:1rem;font-weight:800;margin:0;color:#1B1836}",
    "#rgpt-head p{font-size:.74rem;color:rgba(27,24,54,.6);margin:1px 0 0}",
    "#rgpt-head .rgpt-dot{width:8px;height:8px;border-radius:50%;background:#22C55E;margin-right:6px;display:inline-block;vertical-align:middle}",
    "#rgpt-close{margin-left:auto;background:rgba(27,24,54,.06);border:none;color:#1B1836;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:.9rem;line-height:1;transition:background .15s}",
    "#rgpt-close:hover{background:rgba(27,24,54,.12)}",
    "#rgpt-msgs{flex:1;overflow-y:auto;padding:18px 16px;display:flex;flex-direction:column;gap:14px;background:#FFFDF9}",
    ".rgpt-msg{max-width:100%;font-size:.9rem;line-height:1.65;word-wrap:break-word;color:#1B1836}",
    ".rgpt-msg.user{align-self:flex-end;max-width:85%;background:#E11A6E;color:#fff;padding:10px 14px;border-radius:16px;border-bottom-right-radius:4px}",
    ".rgpt-msg.bot{align-self:flex-start;padding:2px}",
    ".rgpt-msg.bot b{color:#A80F52}",
    ".rgpt-msg.bot ul{margin:8px 0 2px;padding-left:20px}",
    ".rgpt-msg.bot li{margin:4px 0}",
    ".rgpt-msg .rgpt-links{margin-top:10px;display:flex;flex-wrap:wrap;gap:6px}",
    ".rgpt-msg .rgpt-links a{display:inline-flex;align-items:center;gap:5px;background:rgba(225,26,110,.08);color:#A80F52;font-size:.78rem;font-weight:700;padding:6px 12px;border-radius:100px;text-decoration:none}",
    ".rgpt-msg .rgpt-links a:hover{background:rgba(225,26,110,.16)}",
    ".rgpt-msg .rgpt-src{font-size:.68rem;color:rgba(27,24,54,.45);margin-top:8px}",
    ".rgpt-typing{display:flex;gap:4px;padding:8px 2px}",
    ".rgpt-typing span{width:7px;height:7px;border-radius:50%;background:#E11A6E;animation:rgptBlink 1.2s infinite}",
    ".rgpt-typing span:nth-child(2){animation-delay:.2s}.rgpt-typing span:nth-child(3){animation-delay:.4s}",
    "@keyframes rgptBlink{0%,80%,100%{opacity:.25}40%{opacity:1}}",
    "#rgpt-sugg{display:flex;gap:8px;padding:10px 14px 0;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}",
    "#rgpt-sugg::-webkit-scrollbar{display:none}",
    "#rgpt-sugg button{flex-shrink:0;font-size:.74rem;font-weight:600;color:#A80F52;background:rgba(225,26,110,.08);border:1px solid rgba(225,26,110,.18);border-radius:100px;padding:6px 12px;cursor:pointer;transition:background .15s}",
    "#rgpt-sugg button:hover{background:rgba(225,26,110,.16)}",
    "#rgpt-inputrow{position:relative;display:flex;align-items:center;padding:12px 14px 14px;background:#FFFDF9}",
    "#rgpt-input{flex:1;border:1.5px solid rgba(27,24,54,.14);border-radius:18px;padding:12px 52px 12px 16px;font-family:'Inter',sans-serif;font-size:.9rem;outline:none;background:#fff;color:#1B1836;transition:border-color .15s,box-shadow .15s}",
    "#rgpt-input:focus{border-color:#E11A6E;box-shadow:0 0 0 3px rgba(225,26,110,.12)}",
    "#rgpt-send{position:absolute;right:22px;width:34px;height:34px;border-radius:50%;border:none;background:#E11A6E;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .15s,background .15s}",
    "#rgpt-send:hover{transform:scale(1.06);background:#A80F52}",
    "@media (max-width:520px){#rgpt-panel{left:12px;right:12px;bottom:12px;width:auto;height:min(620px,calc(100dvh - 24px))}}"
  ].join("\n");

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function linkify(text) {
    return esc(text)
      .replace(/\[\[([^\]]+)\]\]/g, function (m, label) {
        var slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        var url = "/#" + slug;
        return '<a href="' + url + '" style="color:#A80F52;font-weight:700">' + esc(label) + "</a>";
      })
      .replace(/(\b(?:https?:\/\/)?[a-z0-9-]+\.(?:rotary\.org|vercel\.app)[^\s]*)/g, function (m) {
        var u = m.indexOf("http") === 0 ? m : "https://" + m;
        return '<a href="' + u + '" target="_blank" rel="noopener" style="color:#A80F52;font-weight:700">' + esc(m) + "</a>";
      });
  }

  var style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);

  var GEAR = '<svg viewBox="0 0 24 24" fill="none"><path d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" stroke="#fff" stroke-width="1.6"/><path d="M12 2.8v2.2M12 19v2.2M2.8 12H5M19 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/></svg>';

  document.body.insertAdjacentHTML("beforeend",
    '<div id="rgpt-veil" aria-hidden="true"></div>' +
    '<div id="rgpt-panel" role="dialog" aria-modal="true" aria-label="RotaGPT chat">' +
    '<div id="rgpt-head"><div class="rgpt-avatar">' + GEAR + "</div>" +
    "<div><h3>RotaGPT</h3><p><span class='rgpt-dot'></span>Zone 7 guide · answers from the district directory</p></div>" +
    '<button id="rgpt-close" aria-label="Close chat">✕</button></div>' +
    '<div id="rgpt-msgs"></div>' +
    '<div id="rgpt-sugg"></div>' +
    '<div id="rgpt-inputrow"><input id="rgpt-input" type="text" placeholder="Ask about grants, meetings, clubs..." autocomplete="off">' +
    '<button id="rgpt-send" aria-label="Send">' + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 11l18-8-8 18-2.5-7.5L3 11z" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg></button></div>' +
    "</div>");

  var panel = document.getElementById("rgpt-panel");
  var msgs = document.getElementById("rgpt-msgs");
  var input = document.getElementById("rgpt-input");
  var sugg = document.getElementById("rgpt-sugg");
  var veil = document.getElementById("rgpt-veil");
  var sendBtn = document.getElementById("rgpt-send");
  var closeBtn = document.getElementById("rgpt-close");

  var open = false;
  function setOpen(v) {
    open = v;
    panel.classList.toggle("open", v);
    veil.classList.toggle("open", v);
    if (v) { input.focus(); if (!msgs.children.length) welcome(); }
  }
  window.RotaGPT = {
    open: function () { setOpen(true); },
    close: function () { setOpen(false); },
    toggle: function () { setOpen(!open); }
  };
  window.__rotaGptOpen = window.RotaGPT.open;
  closeBtn.addEventListener("click", function () { setOpen(false); });
  veil.addEventListener("click", function () { setOpen(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && open) setOpen(false);
  });

  function scrollBottom() {
    msgs.scrollTo({ top: msgs.scrollHeight, behavior: "smooth" });
  }
  function addMsg(html, who) {
    var d = document.createElement("div");
    d.className = "rgpt-msg " + who;
    d.innerHTML = html;
    msgs.appendChild(d);
    scrollBottom();
    return d;
  }
  function addTyping() {
    var d = document.createElement("div");
    d.className = "rgpt-msg bot rgpt-typing";
    d.innerHTML = "<span></span><span></span><span></span>";
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  var SUGGESTIONS = [
    "Which clubs are in Zone 7?",
    "How do I apply for a Global Grant?",
    "What is a twinship?",
    "How do I start a new club?",
    "How does the Club Health Check work?",
    "Where can I download documents?"
  ];
  function renderSugg() {
    sugg.innerHTML = SUGGESTIONS.map(function (s) {
      return '<button type="button" data-q="' + esc(s) + '">' + esc(s) + "</button>";
    }).join("");
    sugg.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () { send(b.getAttribute("data-q")); });
    });
  }
  renderSugg();

  function welcome() {
    addMsg("Namaste! I'm <b>RotaGPT</b>, the Zone 7 guide. Ask me anything about the clubs, grants, twinship, meetings, projects or the district rules. I answer straight from the site and the 2025-26 district directory.", "bot");
  }

  /* ------- local knowledge engine ------- */
  function tokens(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  }
  function scoreEntry(e, qWords, qText) {
    var hay = e.k.join(" ").toLowerCase();
    var score = 0;
    if (hay.indexOf(qText) !== -1) score += 60;
    qWords.forEach(function (w) {
      if (hay.indexOf(w) !== -1) score += 3;
      if (w.length > 3 && hay.indexOf(w.slice(0, -1)) !== -1) score += 1;
    });
    return score;
  }
  function localAnswer(q) {
    var qText = q.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
    var qWords = tokens(q);
    var best = KB.map(function (e) { return { e: e, s: scoreEntry(e, qWords, qText) }; })
      .filter(function (x) { return x.s > 0; })
      .sort(function (a, b) { return b.s - a.s; });
    if (!best.length) {
      return {
        text: "I couldn't find that in the zone's documents, but I can help with club info, grants, twinship, meetings, tutorials and the district rules. Try one of the suggestions below.",
        links: [{ label: "Tutorials", url: "/tutorials" }, { label: "Handbook", url: "/handbook" }, { label: "Guides for Clubs", url: "/club-guides" }],
        src: "Site knowledge base"
      };
    }
    var top = best[0].e;
    var extra = "";
    if (best.length > 1 && best[1].s >= best[0].s * 0.5) {
      var alt = best[1].e;
      extra = " Also related: <b>" + esc(alt.k[0]) + "</b> – " + alt.a;
    }
    return {
      text: top.a + extra,
      links: top.links || [],
      src: "Site knowledge base"
    };
  }

  /* ------- top-3 knowledge context for the model ------- */
  function topContext(q) {
    var qWords = tokens(q);
    var qText = q.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
    return KB.slice()
      .map(function (e) { return { e: e, s: scoreEntry(e, qWords, qText) }; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 3)
      .map(function (x) { return "- " + x.e.a; })
      .join("\n") || "No matching knowledge base entries.";
  }

  /* ------- LLM answers: serverless first, then direct anonymous ------- */
  function buildSystem(ctx) {
    return "You are RotaGPT, a friendly assistant for the Zone 7 Rotaract website (Rotaract District 3292, Nepal-Bhutan). " +
      "Answer from the knowledge base context below. Be warm, brief and specific. Use short paragraphs and simple lists when useful. " +
      "If the context does not cover the question, say you are not sure and suggest the website sections. " +
      "Never invent club names, amounts or rules. Only Zone 7 clubs exist: Balkumari, Baneshwor, Liberty, Kathmandu West, " +
      "Kathmandu Heights, Sankhu, New Road City, Sukedhara, Tripureswor.\n\nKnowledge base:\n" + String(ctx || "").slice(0, 6000);
  }
  function parseOpenAI(json) {
    var m = json && json.choices && json.choices[0] && json.choices[0].message && json.choices[0].message.content;
    return m ? m.trim() : null;
  }
  function fetchJson(url, options, ms) {
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, ms || 20000);
    return fetch(url, Object.assign({}, options, { signal: ctrl.signal }))
      .then(function (r) { return r.json(); })
      .finally(function () { clearTimeout(t); });
  }
  function serverlessAnswer(ctx, history) {
    return fetchJson("api/rota-gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history.slice(-8), kb: ctx })
    }, 8000).then(function (j) {
      return (j && j.engine === "llm" && j.answer) ? j.answer : null;
    }).catch(function () { return null; });
  }
  function directAnswer(sys, history) {
    return fetchJson("https://gen.pollinations.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "openai", messages: [{ role: "system", content: sys }].concat(history.slice(-8)), max_tokens: 400 })
    }, 30000).then(parseOpenAI).catch(function () { return null; });
  }

  function renderAnswer(bubble, ans) {
    var links = (ans.links || []).map(function (l) {
      return '<a href="' + esc(l.url) + '">' + (l.url.indexOf("http") === 0 ? "↗ " : "→ ") + esc(l.label) + "</a>";
    }).join("");
    bubble.innerHTML = ans.text +
      (links ? '<div class="rgpt-links">' + links + "</div>" : "") +
      '<div class="rgpt-src">Answer from the ' + esc(ans.src || "Zone 7 knowledge base") + "</div>";
    scrollBottom();
  }

  var history = [];
  var turnSeq = 0;

  /* Render the local answer instantly, then UPGRADE the same bubble in place
     with an AI answer whenever one arrives — never discard it late. */
  function send(q) {
    q = (q || "").trim();
    if (!q) return;
    input.value = "";                       // clear the box so the chat stays readable
    addMsg(esc(q), "user");
    history.push({ role: "user", content: q });
    var seq = ++turnSeq;

    var local = localAnswer(q);
    var bubble = addMsg("", "bot");
    renderAnswer(bubble, local);
    input.focus();

    function upgrade(text) {
      if (!text) return;                    // no AI reply yet — keep local answer
      if (turnSeq !== seq) return;         // a newer question replaced this turn
      if (!document.body.contains(bubble)) return;
      renderAnswer(bubble, { text: text, links: [], src: "RotaGPT AI" });
    }

    var ctx = topContext(q);
    var sys = buildSystem(ctx);
    serverlessAnswer(ctx, history).then(function (up) {
      if (up) { upgrade(up); return; }
      directAnswer(sys, history).then(upgrade);
    });
  }

  function key(e) { if (e.key === "Enter") send(input.value); }
  input.addEventListener("keydown", key);
  sendBtn.addEventListener("click", function () { send(input.value); });
})();