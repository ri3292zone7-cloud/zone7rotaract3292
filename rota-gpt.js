/* RotaGPT v3 — the Zone 7 chatbot widget.
   v3 improvements: full page content extraction, fuzzy typo matching,
   conversation memory, "did you mean?" suggestions, page-aware context,
   score confidence display. */
(function () {
  if (window.__rotaGptLoaded) return;
  window.__rotaGptLoaded = true;

  var KB = (window.ROTA_KB || []).slice();

  /* ===================== STEMMING + SYNONYMS ===================== */
  var STEMS = {
    club:"club",clubs:"club",
    meeting:"meeting",meetings:"meeting",met:"meeting",
    member:"member",members:"member",membership:"member",
    project:"project",projects:"project",
    grant:"grant",grants:"grant",granting:"grant",
    twin:"twinship",twins:"twinship",twinning:"twinship",twinship:"twinship",
    install:"installation",installed:"installation",installing:"installation",
    charter:"charter",chartering:"charter",chartered:"charter",
    elect:"elect",elected:"elect",electing:"elect",
    fundraiser:"fundraising",fundraise:"fundraising",fundraising:"fundraising",
    blood:"blood donation",donate:"blood donation",donation:"blood donation",
    health:"health check",checkup:"health check",
    training:"training",train:"training",trained:"training",
    attend:"attendance",attendance:"attendance",attended:"attendance",
    finance:"finance",financial:"finance",treasury:"finance",
    public:"public image",image:"public image",branding:"public image",
    environment:"environment",environmental:"environment",climate:"environment",
    education:"education",educational:"education",school:"education",literacy:"education",
    water:"water",wash:"water",sanitation:"water",
    international:"international",abroad:"international",global:"international",
    district:"district",ri:"rotary international",
    expert:"expert speaker",speaker:"expert speaker",guest:"expert speaker",
    social:"social media",media:"social media",instagram:"social media",
    retention:"retention",retain:"retention",
    mentor:"mentoring",mentoring:"mentoring",mentorship:"mentoring",
    strategic:"strategic plan",plan:"strategic plan",planning:"strategic plan",
    assembly:"assembly",assemble:"assembly",
    board:"board",bod:"board",
    futsal:"futsal",quiz:"quiz",rota:"quiz",
    signature:"signature project",flagship:"signature project",
    joint:"joint project",collaborate:"joint project",collaboration:"joint project",
    privilege:"privilege card",benefits:"privilege card",
    report:"reporting",reports:"reporting",quarterly:"reporting",
    publish:"publication",publication:"publication",
    good:"goodwill",goodwill:"goodwill",
    roadway:"new road city",road:"new road city",
    bane:"baneshwor",suke:"sukedhara",tripu:"tripureswor",
    balku:"balkumari",sankhu:"sankhu",liberty:"liberty"
  };

  var SYNONYMS = {
    "twin":"twinship","twinning":"twinship","sister club":"twinship","partnership":"twinship",
    "start a club":"new club","start club":"new club","new rotaract club":"new club",
    "charter ceremony":"new club","chartering":"new club",
    "how to join":"join","membership form":"join","sign up":"join","become a member":"join",
    "who are you":"rota gpt","what can you do":"rota gpt","help":"rota gpt",
    "how old":"age","age limit":"age","age requirement":"age","minimum age":"age",
    "board meeting":"board","executive meeting":"board","board of directors":"board",
    "president role":"officer","secretary role":"officer","treasurer role":"officer",
    "guest speaker":"expert speaker","invite experts":"expert speaker",
    "maintain social media":"social media","instagram":"social media",
    "my rotary":"my rotary","rotary account":"my rotary",
    "ri dues":"ri dues","district dues":"ri dues","pay dues":"ri dues",
    "nationwide blood":"blood donation","blood drive":"blood donation","blood camp":"blood donation",
    "privilege card":"privilege card","organizational collaboration":"privilege card",
    "professional development":"professional development","career":"professional development",
    "strategic plan":"strategic plan","vision":"strategic plan","mission":"strategic plan",
    "wellbeing":"wellbeing","mental health":"wellbeing","club culture":"wellbeing",
    "digital tools":"digital tools","technology":"digital tools","apps":"digital tools",
    "rotary year":"rotary year","fiscal year":"rotary year",
    "nepal":"zone 7","bhutan":"zone 7","kathmandu":"zone 7","valley":"zone 7",
    "contact":"contact","email":"contact","reach out":"contact",
    "store":"store","merch":"store","shop":"store","buy":"store","t-shirt":"store"
  };

  function stemWord(w) {
    if (STEMS[w]) return STEMS[w];
    if (w.length > 5 && STEMS[w.slice(0, -1)]) return STEMS[w.slice(0, -1)];
    if (w.length > 6 && STEMS[w.slice(0, -2)]) return STEMS[w.slice(0, -2)];
    return w;
  }

  function expandSynonyms(words) {
    var expanded = words.slice();
    var text = words.join(" ");
    Object.keys(SYNONYMS).forEach(function (key) {
      if (text.indexOf(key) !== -1) {
        var syn = SYNONYMS[key];
        if (expanded.indexOf(syn) === -1) expanded.push(syn);
      }
    });
    return expanded;
  }

  var STOP = {what:1,is:1,are:1,the:1,a:1,an:1,how:1,do:1,does:1,did:1,can:1,could:1,would:1,should:1,i:1,you:1,we:1,to:1,for:1,of:1,in:1,on:1,about:1,tell:1,me:1,please:1,give:1,show:1,explain:1,why:1,when:1,where:1,who:1,which:1,that:1,this:1,it:1,be:1,am:1,was:1,were:1,has:1,have:1,had:1,with:1,by:1,at:1,from:1,as:1,or:1,and:1,if:1,so:1,my:1,your:1,our:1,us:1,are:1};
  function tokenize(s, keepStop) {
    var arr = String(s).toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(function (w) { return w.length > 1; })
      .map(stemWord);
    if (keepStop) return arr;
    return arr.filter(function (w) { return !STOP[w]; });
  }

  /* ===================== FUZZY / TYPO MATCHING ===================== */
  function levenshtein(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    var matrix = [];
    for (var i = 0; i <= b.length; i++) matrix[i] = [i];
    for (var j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (i = 1; i <= b.length; i++) {
      for (j = 1; j <= a.length; j++) {
        var cost = b.charAt(i - 1) === a.charAt(j - 1) ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    return matrix[b.length][a.length];
  }

  function fuzzyMatch(word, candidates, maxDist) {
    maxDist = maxDist || 2;
    var best = null, bestDist = maxDist + 1;
    for (var i = 0; i < candidates.length; i++) {
      var d = levenshtein(word, candidates[i]);
      if (d < bestDist) { bestDist = d; best = candidates[i]; }
    }
    return bestDist <= maxDist ? best : null;
  }

  /* Build a unique list of all KB keywords for fuzzy lookup */
  var _allKwCache = null;
  function getAllKeywords() {
    if (_allKwCache) return _allKwCache;
    var seen = {};
    KB.forEach(function (e) {
      e.k.forEach(function (kw) {
        kw.split(/\s+/).forEach(function (w) {
          if (w.length > 2) seen[w] = true;
        });
      });
    });
    _allKwCache = Object.keys(seen);
    return _allKwCache;
  }

  function fuzzyExpand(words) {
    var allKw = getAllKeywords();
    var expanded = words.slice();
    words.forEach(function (w) {
      if (w.length < 3) return;
      var match = fuzzyMatch(w, allKw, 2);
      if (match && match !== w && expanded.indexOf(match) === -1) {
        expanded.push(match);
      }
    });
    return expanded;
  }

  /* ===================== SCORING ENGINE ===================== */
  function scoreEntry(e, qWords, qText, qRaw, pageBoost) {
    var hay = e.k.join(" ").toLowerCase();
    var hayWords = tokenize(hay, true);
    var score = 0;

    /* Exact phrase match in keywords */
    if (qText && hay.indexOf(qText) !== -1) score += 80;

    /* Exact phrase match in answer */
    var ansLower = (e.a || "").toLowerCase();
    if (ansLower.indexOf(qText) !== -1) score += 20;

    /* Per-keyword scoring */
    var matchedCount = 0;
    qWords.forEach(function (w) {
      if (w.length < 2) return;
      if (hay.indexOf(w) !== -1) { score += 4; matchedCount++; return; }
      if (hayWords.some(function (hw) { return hw === w || hw.indexOf(w) !== -1 || w.indexOf(hw) !== -1; })) {
        score += 3; matchedCount++;
      }
      if (w.length > 3 && hay.indexOf(w.slice(0, -1)) !== -1) { score += 1.5; matchedCount++; }
    });

    /* Coverage bonus */
    var coverage = qWords.length > 0 ? matchedCount / qWords.length : 0;
    score *= (1 + coverage * 0.4);

    /* Richer entry bonus */
    score += Math.min(e.k.length * 0.3, 3);

    /* Raw query keyword match bonus */
    var rawLower = qRaw.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();
    e.k.forEach(function (kw) {
      if (kw === rawLower || rawLower.indexOf(kw) !== -1 || kw.indexOf(rawLower) !== -1) {
        score += 10;
      }
    });

    /* Page-aware boost: if the entry has a link matching the current page, boost it */
    if (pageBoost && e.links) {
      e.links.forEach(function (l) {
        if (l.url && l.url.indexOf(pageBoost) !== -1) score += 25;
      });
    }

    /* Conversation context boost */
    if (score > 0) score += 1;

    return score;
  }

  /* ===================== CONVERSATION MEMORY ===================== */
  var conversationMemory = {
    topics: [],      /* detected topic keywords from recent questions */
    lastQuestion: "",
    lastAnswer: "",
    followUpHints: {} /* topic -> next likely questions */
  };

  var FOLLOW_UP_MAP = {
    "grant": { "apply":"grant", "how":"grant", "next":"grant", "step":"grant", "when":"grant", "deadline":"grant" },
    "twinship": { "how":"twinship", "find":"twinship", "partner":"twinship", "moa":"twinship", "agreement":"twinship" },
    "meeting": { "run":"meeting", "conduct":"meeting", "minutes":"meeting", "agenda":"meeting" },
    "club": { "about":"club", "tell":"club", "which":"club", "list":"club", "join":"club" },
    "project": { "start":"project", "ideas":"project", "what":"project", "plan":"project" },
    "barometer": { "score":"barometer", "points":"barometer", "rating":"barometer", "level":"barometer" },
    "health": { "sections":"health", "items":"health", "run":"health", "check":"health" },
    "blood": { "organize":"blood", "drive":"blood", "camp":"blood", "supplies":"blood" },
    "officer": { "roles":"officer", "president":"officer", "secretary":"officer", "install":"officer" }
  };

  function updateConversationMemory(q) {
    var lower = q.toLowerCase();
    conversationMemory.lastQuestion = q;

    /* Detect and store topic */
    var topic = "";
    for (var t in FOLLOW_UP_MAP) {
      if (lower.indexOf(t) !== -1) { topic = t; break; }
    }
    if (topic) {
      conversationMemory.topics.push(topic);
      if (conversationMemory.topics.length > 5) conversationMemory.topics.shift();
    }

    /* Detect follow-up intent */
    var words = lower.split(/\s+/);
    var lastTopic = conversationMemory.topics.length > 0 ? conversationMemory.topics[conversationMemory.topics.length - 1] : "";
    if (lastTopic && FOLLOW_UP_MAP[lastTopic]) {
      for (var i = 0; i < words.length; i++) {
        if (FOLLOW_UP_MAP[lastTopic][words[i]]) {
          return lastTopic; /* return the topic this follow-up relates to */
        }
      }
    }
    return topic;
  }

  function getConversationContext() {
    if (conversationMemory.topics.length < 2) return "";
    var recent = conversationMemory.topics.slice(-3);
    return "Previous questions covered: " + recent.join(", ") + ". ";
  }

  /* ===================== NORMAL CONVERSATION (small talk) ===================== */
  function smallTalkReply(raw) {
    var t = String(raw || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
    if (!t) return null;
    var isShort = t.split(/\s+/).length <= 4 && raw.length <= 30;
    // greeting + real question: let KB handle ("hi, how do I join?" / "sup which clubs...")
    var m = t.match(/^(hi|hey|hello|yo|sup|wassup|whats up|namaste|good morning|good afternoon|good evening)[, ]+(.+)$/);
    if (m && m[2] && m[2].length > 8) return null;
    // sup / yo / wassup — only for short standalone slang
    if ((/^(sup|wass?up|whats up|yo|yoo+|ayo|hey yo)\b/.test(t) || t === "sup") && isShort) {
      var a = ["yo — sup! \uD83D\uDE0A I'm good, just hanging around Zone 7. What you wanna know?",
               "heyy! All good here — ready to help with clubs, projects, or how to join. What's up with you?",
               "sup sup! \uD83D\uDE4F I'm chill. Ask me anything about Zone 7."];
      return a[Math.floor(Math.random()*a.length)];
    }
    if (/^(hi|hey|hello|hola|namaste|good (morning|afternoon|evening))\b/.test(t) && isShort) {
      return "hey there! \uD83D\uDC4B I'm RotaGPT — your Zone 7 guide. How can I help today?";
    }
    if ((/\bhow (are|r) (you|u)\b/.test(t) || /\bhow ru\b/.test(t) || t === "hru" || t === "wbu") && isShort) {
      return "I'm great, thanks for asking! \uD83D\uDC99 Here to help you navigate Zone 7 — clubs, events, grants, whatever you need. What you thinking?";
    }
    if ((/^(thanks|thank you|thankyou|ty|thx|tysm|dhanyabad)\b/.test(t) || /\bthanks\b/.test(t)) && isShort) {
      return "anytime! \uD83D\uDE4C Hit me up whenever you need Zone 7 stuff.";
    }
    if (/^(bye|goodbye|see you|cya|good night|goodnite)\b/.test(t) && isShort) {
      return "see ya! \uD83D\uDC4B Come back anytime you need Zone 7 info.";
    }
    if (/\b(who are you|what are you|whats your name|who r u)\b/.test(t)) {
      return "I'm <b>RotaGPT</b> — the Zone 7 guide for Rotaract District 3292 (Nepal-Bhutan). I answer straight from the site + district directory — clubs, projects, meetings, grants, barometer, all of it.";
    }
    if (/\b(what can you do|help me|what do you do)\b/.test(t) && t.split(/\s+/).length <= 6) {
      return "I can help with Zone 7 clubs, projects, meetings, twinship, grants, health check, barometer, RKT quiz, and how to join. Just ask — e.g. <i>which clubs are in Zone 7?</i> or <i>how do I start a new club?</i>";
    }
    if (/^(lol|haha|hehe|lmao|nice|cool|great|awesome|ok|okay|alright|bet)\b/.test(t) && isShort) {
      return "haha \uD83D\uDE04 — cool cool. Want to explore something Zone 7 while you're here?";
    }
    return null;
  }

  /* ===================== "DID YOU MEAN?" SUGGESTIONS ===================== */
  var TOPIC_LINKS = {
    "grant": { label: "Grants chapter", url: "/tutorials#grants" },
    "twinship": { label: "Twinship chapter", url: "/tutorials#twinship" },
    "meeting": { label: "Meetings tutorial", url: "/tutorials#meetings" },
    "club": { label: "All clubs", url: "/#clubs" },
    "project": { label: "Projects chapter", url: "/tutorials#projects" },
    "barometer": { label: "About Zone 7", url: "/about" },
    "health": { label: "Health Check chapter", url: "/tutorials#health" },
    "blood": { label: "Blood donation tutorial", url: "/tutorials#blood" },
    "officer": { label: "Board tutorial", url: "/tutorials#board" },
    "join": { label: "Join Us", url: "/join" },
    "zrr": { label: "ZRR tutorial", url: "/tutorials#zrr" },
    "drr": { label: "DRR tutorial", url: "/tutorials#drr" },
    "assembly": { label: "Assembly tutorial", url: "/tutorials#assembly" },
    "charter": { label: "New Club chapter", url: "/tutorials#newclub" },
    "installation": { label: "New Club chapter", url: "/tutorials#newclub" }
  };

  function didYouMean(q) {
    var lower = q.toLowerCase();
    var suggestions = [];
    for (var topic in TOPIC_LINKS) {
      if (lower.indexOf(topic) !== -1 || levenshtein(topic, lower) <= 3) {
        suggestions.push(TOPIC_LINKS[topic]);
      }
    }
    if (!suggestions.length) {
      suggestions = [
        { label: "Learn hub", url: "/tutorials" },
        { label: "All clubs", url: "/#clubs" },
        { label: "Resources", url: "/guides" }
      ];
    }
    return suggestions;
  }

  /* ===================== PAGE-AWARE CONTEXT ===================== */
  function detectPage() {
    try {
      var nav = document.getElementById("siteNav");
      if (nav) return nav.getAttribute("data-current") || "";
    } catch (e) {}
    return "";
  }

  var PAGE_KB_MAP = {
    tutorials: ["tutorials", "tutorial", "learn", "how to"],
    guides: ["resources", "documents", "download", "templates"],
    gallery: ["gallery", "photos", "projects"],
    join: ["join", "membership", "guest", "age"],
    about: ["zone 7", "district 3292", "zrr", "about"],
    clubs: ["club", "balkumari", "baneshwor", "liberty", "kathmandu", "sankhu", "new road", "sukedhara", "tripureswor"],
    quiz: ["quiz", "rkt", "test", "knowledge"],
    merch: ["store", "merch", "shop"]
  };

  function getPageBoostTerms(page) {
    return PAGE_KB_MAP[page] || [];
  }

  /* ===================== FULL PAGE CONTENT EXTRACTION ===================== */
  var PAGE_CONTENT_CACHE = {};
  var PAGES_TO_FETCH = [
    "/tutorials", "/guides", "/about",
    "/tutorials#meetings", "/tutorials#board", "/tutorials#assembly",
    "/tutorials#zrr", "/tutorials#drr", "/tutorials#blood",
    "/tutorials#grants", "/tutorials#twinship", "/tutorials#newclub",
    "/tutorials#projects", "/tutorials#health"
  ];

  function extractTextFromHtml(html) {
    var div = document.createElement("div");
    div.innerHTML = html;
    /* Remove scripts, styles, nav, footer */
    div.querySelectorAll("script,style,nav,footer,#siteNav,#rotaryPreloader,.hero,.mosaic-popup").forEach(function (el) { el.remove(); });
    var text = div.textContent || div.innerText || "";
    return text.replace(/\s+/g, " ").trim().slice(0, 2000);
  }

  var pageContentLoaded = false;
  function loadPageContent() {
    if (pageContentLoaded) return Promise.resolve();
    pageContentLoaded = true;

    return Promise.all(PAGES_TO_FETCH.map(function (path) {
      var url = path.split("#")[0];
      if (PAGE_CONTENT_CACHE[url]) return Promise.resolve();
      return fetch(url).then(function (r) { return r.text(); }).then(function (html) {
        PAGE_CONTENT_CACHE[url] = extractTextFromHtml(html);
      }).catch(function () {});
    })).then(function () {
      /* Add extracted page content as KB entries */
      Object.keys(PAGE_CONTENT_CACHE).forEach(function (url) {
        var text = PAGE_CONTENT_CACHE[url];
        if (!text || text.length < 100) return;
        var slug = url.replace(/^\//, "").replace(/[^a-z0-9]/g, " ").trim();
        KB.push({
          k: [slug + " page content", slug + " full text", slug + " detailed"],
          a: text.slice(0, 1500),
          links: [{ label: "Open " + slug, url: url }],
          _pageContent: true
        });
      });
    });
  }

  /* ===================== LIVE DATA INJECTION ===================== */
  var liveDataReady = null;

  function injectLiveData() {
    if (liveDataReady) return liveDataReady;
    liveDataReady = (function () {
      try {
        if (typeof ZONE7_DB === "undefined") return Promise.resolve();
        return Promise.all([
          ZONE7_DB.getAllProjects({ limit: 50 }).catch(function () { return []; }),
          ZONE7_DB.getEvents().catch(function () { return []; })
        ]).then(function (results) {
          var projects = results[0] || [];
          var events = results[1] || [];

          if (projects.length) {
            var projectSummary = projects.slice(0, 20).map(function (p) {
              var club = (typeof CLUB_DIRECTORY !== "undefined" && CLUB_DIRECTORY[p.club_slug])
                ? CLUB_DIRECTORY[p.club_slug].name.replace("Rotaract Club of ", "") : p.club_slug;
              return club + ": " + (p.title || "Untitled") + (p.category ? " (" + p.category + ")" : "") + (p.date ? " — " + p.date : "");
            }).join("\n");
            KB.push({
              k: ["recent projects", "latest projects", "zone projects", "what projects have been done", "project list", "recent activity", "current projects"],
              a: "Recent Zone 7 projects uploaded by clubs:\n" + projectSummary,
              links: [{ label: "See all projects", url: "/gallery" }]
            });
          }

          if (events.length) {
            var eventSummary = events.slice(0, 10).map(function (ev) {
              return (ev.title || "Event") + (ev.event_date ? " on " + ev.event_date : "") + (ev.location ? " at " + ev.location : "");
            }).join("\n");
            KB.push({
              k: ["upcoming events", "events", "what events", "event list", "calendar", "what is happening", "schedule"],
              a: "Upcoming and recent Zone 7 events:\n" + eventSummary,
              links: [{ label: "District calendar", url: "/" }]
            });
          }
        });
      } catch (e) { return Promise.resolve(); }
    })();
    return liveDataReady;
  }

  /* ===================== SYSTEM PROMPT BUILDER ===================== */
  function buildSystem(ctx) {
    var clubList = "";
    try {
      if (typeof CLUB_DIRECTORY !== "undefined") {
        clubList = Object.entries(CLUB_DIRECTORY).map(function (e) {
          var slug = e[0], c = e[1];
          var letterhead = (typeof CLUB_LETTERHEAD !== "undefined" && CLUB_LETTERHEAD[slug]) ? CLUB_LETTERHEAD[slug] : null;
          var sponsor = letterhead ? letterhead.sponsor : "unknown";
          var chartered = letterhead ? letterhead.chartered : "unknown";
          return "- " + (c.name || slug) + " | Sponsor: " + sponsor + " | Chartered: " + chartered + " | IG: @" + (c.ig || "");
        }).join("\n");
      }
    } catch (e) {}

    return "You are RotaGPT, a friendly, knowledgeable assistant for the Zone 7 Rotaract website (Rotaract District 3292, Nepal-Bhutan).\n\n" +
      "RULES:\n" +
      "1. Answer from the knowledge base context below. Be warm, specific, and helpful.\n" +
      "2. Use short paragraphs, bullet points, and clear structure when useful.\n" +
      "3. Always include relevant links when the KB provides them.\n" +
      "4. If the context does not cover the question, say you are not sure and suggest the most relevant website section.\n" +
      "5. Never invent club names, amounts, rules, or dates. Only cite information from the context.\n" +
      "6. Only Zone 7 clubs exist: Balkumari, Baneshwor, Liberty, Kathmandu West, Kathmandu Heights, Sankhu, New Road City, Sukedhara, Tripureswor.\n" +
      "7. Format responses with **bold** for key terms and use line breaks for readability.\n" +
      getConversationContext() + "\n" +
      "CLUB DIRECTORY:\n" + (clubList || "Balkumari, Baneshwor, Liberty, Kathmandu West, Kathmandu Heights, Sankhu, New Road City, Sukedhara, Tripureswor.") + "\n\n" +
      "BAROMETER SCORING:\n" +
      "- Star Excellence: 96-100 points\n" +
      "- Diamond Excellence: 86-95 points\n" +
      "- Premier Excellence: 71-85 points\n" +
      "- Distinguished Excellence: 60-70 points\n" +
      "- 40 items across 5 groups: Governance (1-7), Meetings (8-16), Reporting (17-24), Projects (25-31), Service (32-40)\n" +
      "- Community clubs: 24 GMs + 12 BODs, 20% membership growth, 80% retention\n" +
      "- University clubs: 18 GMs + 12 BODs, 50% membership growth, 40% retention\n\n" +
      "KNOWLEDGE BASE:\n" + (ctx || "No matching knowledge base entries.");
  }

  /* ===================== TOP CONTEXT ===================== */
  function topContext(q, pageBoost) {
    var qWords = tokenize(q);
    qWords = expandSynonyms(qWords);
    qWords = fuzzyExpand(qWords);
    var qText = tokenize(q).join(" ");
    return KB.slice()
      .map(function (e) { return { e: e, s: scoreEntry(e, qWords, qText, q, pageBoost) }; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 5)
      .map(function (x) { return "- " + x.e.k[0] + ": " + x.e.a; })
      .join("\n\n") || "No matching knowledge base entries.";
  }

  /* ===================== CONFIDENCE DISPLAY ===================== */
  function getConfidence(score, bestScore) {
    if (bestScore >= 45) return { level: "high", label: "High confidence", color: "#22C55E" };
    if (bestScore >= 20) return { level: "medium", label: "Good match", color: "#F2A900" };
    if (bestScore >= 8) return { level: "low", label: "Partial match", color: "#FB923C" };
    return { level: "none", label: "No direct match", color: "#9CA3AF" };
  }

  /* ===================== UI ===================== */
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
    ".rgpt-msg .rgpt-confidence{display:inline-flex;align-items:center;gap:5px;font-size:.68rem;font-weight:700;padding:3px 8px;border-radius:100px;margin-top:6px}",
    ".rgpt-msg .rgpt-didyoumean{margin-top:10px;padding:10px 12px;background:rgba(242,169,0,.08);border:1px solid rgba(242,169,0,.2);border-radius:12px;font-size:.82rem;color:rgba(27,24,54,.7)}",
    ".rgpt-msg .rgpt-didyoumean b{color:#A80F52}",
    ".rgpt-msg .rgpt-didyoumean a{color:#A80F52;font-weight:700;text-decoration:underline;text-underline-offset:2px}",
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
    if (v) {
      input.focus();
      if (!msgs.children.length) welcome();
      injectLiveData();
      loadPageContent();
    }
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

  /* ===================== CONTEXT-AWARE SUGGESTIONS ===================== */
  var SUGGESTIONS_DEFAULT = [
    "Which clubs are in Zone 7?",
    "How do I apply for a Global Grant?",
    "What is a twinship?",
    "How do I start a new club?",
    "How does the Club Health Check work?",
    "What is the barometer?"
  ];

  var PAGE_SUGGESTIONS = {
    about: ["Who is the current ZRR?", "What are the 7 Areas of Focus?", "How many clubs are in Zone 7?"],
    tutorials: ["How do I run a meeting?", "What is the blood donation process?", "How does the ZRR visit work?"],
    guides: ["Where can I download the constitution?", "What documents are available?", "How do I get the MOU template?"],
    gallery: ["What projects have been done recently?", "Which clubs are most active?", "What events are coming up?"],
    join: ["What are the age requirements?", "How do I request a guest visit?", "Which club is near me?"],
    clubs: ["Tell me about Sukedhara", "Which club is oldest?", "Who sponsors each club?"],
    quiz: ["How does the RKT work?", "What should I study for the quiz?", "Is there practice material?"],
    merch: ["What merchandise is available?", "How do I order?"],
    admin: ["How do I add a project?", "How do I access the admin panel?"],
    health: ["What are the 75 health check items?", "How often should we run the health check?"],
    grants: ["What is the difference between RDG and Global Grants?", "How do I apply for a grant?"]
  };

  var CONTEXT_SUGGESTIONS = {
    "twinship": ["How do I find a twin club?", "What is an MOU?", "How many joint projects are required?"],
    "grant": ["What is the minimum budget for a Global Grant?", "How long does grant reporting take?", "What is the RDG grant?"],
    "meeting": ["How many meetings are required per year?", "What goes in the minutes?", "How do motions work?"],
    "club": ["Tell me about each Zone 7 club", "Which clubs are oldest?", "How do I join?"],
    "project": ["What project ideas are available?", "How do I start a project?", "What is a signature project?"],
    "barometer": ["What are the rating levels?", "How many points do I need?", "What items can I auto-check?"],
    "health": ["What are the 5 sections?", "How do I run the health check?", "What if a section fails?"],
    "blood": ["How do I organize a blood drive?", "What is the nationwide blood donation?", "What supplies do I need?"],
    "officer": ["What are the officer roles?", "When is installation?", "How does the board work?"]
  };

  var lastTopic = "";

  function detectTopic(q) {
    var lower = q.toLowerCase();
    for (var topic in CONTEXT_SUGGESTIONS) {
      if (lower.indexOf(topic) !== -1) return topic;
    }
    return "";
  }

  function renderSugg() {
    var topic = lastTopic;
    var page = detectPage();
    var items;

    if (topic && CONTEXT_SUGGESTIONS[topic]) {
      items = CONTEXT_SUGGESTIONS[topic];
    } else if (page && PAGE_SUGGESTIONS[page]) {
      items = PAGE_SUGGESTIONS[page];
    } else {
      items = SUGGESTIONS_DEFAULT;
    }

    sugg.innerHTML = items.map(function (s) {
      return '<button type="button" data-q="' + esc(s) + '">' + esc(s) + "</button>";
    }).join("");
    sugg.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () { send(b.getAttribute("data-q")); });
    });
  }
  renderSugg();

  function welcome() {
    addMsg("Namaste! I'm <b>RotaGPT</b>, the Zone 7 guide. Ask me anything about the clubs, grants, twinship, meetings, projects, the barometer, or district rules. I answer straight from the site and the 2025-26 district directory.", "bot");
  }

  /* ===================== LLM ANSWERS ===================== */
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
      body: JSON.stringify({ model: "openai", messages: [{ role: "system", content: sys }].concat(history.slice(-8)), max_tokens: 600, temperature: 0.3 })
    }, 30000).then(parseOpenAI).catch(function () { return null; });
  }

  function renderAnswer(bubble, ans, confidence) {
    var links = (ans.links || []).map(function (l) {
      return '<a href="' + esc(l.url) + '">' + (l.url.indexOf("http") === 0 ? "↗ " : "→ ") + esc(l.label) + "</a>";
    }).join("");

    var confidenceHtml = "";
    if (confidence && confidence.level !== "none") {
      confidenceHtml = '<div class="rgpt-confidence" style="color:' + confidence.color + ';background:' + confidence.color + '15;">' +
        '<span style="width:6px;height:6px;border-radius:50%;background:' + confidence.color + ';display:inline-block;"></span>' +
        confidence.label + '</div>';
    }

    /* "Did you mean?" when confidence is low */
    var didYouMeanHtml = "";
    if (confidence && confidence.level === "none" && ans.text.indexOf("couldn't find") !== -1) {
      var suggestions = didYouMean(ans._query || "");
      didYouMeanHtml = '<div class="rgpt-didyoumean"><b>Did you mean:</b> ' +
        suggestions.map(function (s) { return '<a href="' + esc(s.url) + '">' + esc(s.label) + '</a>'; }).join(" · ") +
        '</div>';
    }

    bubble.innerHTML = ans.text +
      (links ? '<div class="rgpt-links">' + links + "</div>" : "") +
      confidenceHtml +
      didYouMeanHtml +
      '<div class="rgpt-src">Answer from the ' + esc(ans.src || "Zone 7 knowledge base") + "</div>";
    scrollBottom();
  }

  var history = [];
  var turnSeq = 0;

  function send(q) {
    q = (q || "").trim();
    if (!q) return;
    input.value = "";
    addMsg(esc(q), "user");
    history.push({ role: "user", content: q });
    var seq = ++turnSeq;

    /* Update topic tracking for suggestions */
    lastTopic = detectTopic(q);
    renderSugg();

    /* Update conversation memory */
    var followUpTopic = updateConversationMemory(q);

    /* Normal conversation handler — short chat replies for greetings/small talk */
    var small = smallTalkReply(q);
    if (small) {
      var bubble = addMsg("", "bot");
      bubble.innerHTML = small + '<div class="rgpt-src">RotaGPT · chat</div>';
      history.push({ role: "assistant", content: small });
      scrollBottom();
      input.focus();
      return;
    }

    /* Ensure live data + page content are loaded before answering */
    Promise.all([injectLiveData(), loadPageContent()]).then(function () {
      if (turnSeq !== seq) return;

      var page = detectPage();
      var pageBoost = page ? ("/" + page) : "";

      /* Build scoring context with page awareness */
      var qWords = tokenize(q);
      qWords = expandSynonyms(qWords);
      qWords = fuzzyExpand(qWords);
      var qText = tokenize(q).join(" ");

      var scored = KB.map(function (e) {
        return { e: e, s: scoreEntry(e, qWords, qText, q, pageBoost) };
      }).filter(function (x) { return x.s > 0; })
        .sort(function (a, b) { return b.s - a.s; });

      var bestScore = scored.length ? scored[0].s : 0;
      var confidence = getConfidence(0, bestScore);

      var typing = addTyping();
      var delay = 380 + Math.min(q.length * 9, 650) + Math.random()*220;
      setTimeout(function(){
        if (turnSeq !== seq) { try{typing.remove();}catch(e){} return; }
        typing.remove();
        var local = localAnswer(q, scored, confidence);
        local._query = q;
        var bubble = addMsg("", "bot");
        renderAnswer(bubble, local, confidence);
        input.focus();

        function upgrade(text) {
          if (!text) return;
          if (turnSeq !== seq) return;
          if (!document.body.contains(bubble)) return;
          renderAnswer(bubble, { text: text, links: [], src: "RotaGPT AI" }, { level: "high", label: "AI enhanced", color: "#22C55E" });
        }

        var ctx = topContext(q, pageBoost);
        var sys = buildSystem(ctx);
        serverlessAnswer(ctx, history).then(function (up) {
          if (up) { upgrade(up); return; }
          directAnswer(sys, history).then(upgrade);
        });
      }, delay);
    });
  }

  function localAnswer(q, scored, confidence) {
    if (!scored || !scored.length || scored[0].s < 8) {
      return {
        text: "I don't have a direct entry for that, but I can point you right — try one of these:<br>• <b>Clubs</b> — which 9 clubs are in Zone 7?<br>• <b>Twinship</b> — how to find a partner club<br>• <b>Grants</b> — RDG vs Global Grant rules<br>Ask me like <i>tell me about twinship</i> and I'll pull the exact directory text.",
        links: [{ label: "Learn hub", url: "/tutorials" }, { label: "All clubs", url: "/#clubs" }, { label: "Resources", url: "/guides" }],
        src: "Site knowledge base"
      };
    }
    var top = scored[0].e;
    var introPool = [
      "Here's the Zone 7 take on that — ",
      "Great question! Based on the 2025-26 directory — ",
      "Found it in the Zone 7 docs — ",
      "From the district handbook — "
    ];
    var intro = introPool[Math.floor(Math.random()*introPool.length)];
    var extras = [];
    if (scored.length > 1 && scored[1].s >= scored[0].s * 0.35) {
      extras.push("<b>" + esc(scored[1].e.k[0]) + "</b> — " + scored[1].e.a);
    }
    if (scored.length > 2 && scored[2].s >= scored[0].s * 0.28) {
      extras.push("<b>" + esc(scored[2].e.k[0]) + "</b> — " + scored[2].e.a);
    }
    var confNote = "";
    if (confidence && confidence.level === "low") confNote = "<br><br><i>I'm not 100% sure this is the closest match — tell me more if you want me to narrow it.</i>";
    var follow = "<br><br><i>Want me to show you the page or break it into steps?</i>";
    var fullText = intro + top.a;
    if (extras.length) {
      fullText += "<br><br><b>Also related:</b><br>" + extras.join("<br><br>");
    }
    fullText += confNote + follow;
    return {
      text: fullText,
      links: top.links || [],
      src: "Site knowledge base"
    };
  }

  function key(e) { if (e.key === "Enter") send(input.value); }
  input.addEventListener("keydown", key);
  sendBtn.addEventListener("click", function () { send(input.value); });
})();
