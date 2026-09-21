/* Zone 7 site-wide search index - feeds the "/" spotlight so one search covers
   the whole site: static pages, the nine clubs, and live guides/events/projects
   from the Supabase-backed store (ZONE7_DB, same source as /search).
   learn-search.js merges SITE_INDEX.items() into the spotlight result list. */
window.SITE_INDEX = (function () {
  var PAGES = [
    { t: "About Zone 7", d: "Who we are, our nine clubs, ZRR team and how we serve the Kathmandu Valley.", h: "/about", k: ["about", "zone 7", "district", "zrr", "team", "who"] },
    { t: "Join a Club", d: "Ready to serve? See how to become a member of a Zone 7 Rotaract club.", h: "/join", k: ["join", "member", "membership", "apply", "form", "become"] },
    { t: "Gallery", d: "Photos from service projects, blood drives, plantations and events across Zone 7.", h: "/gallery", k: ["gallery", "photos", "pictures", "album"] },
    { t: "Guides & Resources", d: "Club constitutions, bylaws, templates, funding guides and quiz materials.", h: "/guides", k: ["guide", "constitution", "bylaw", "template", "funding", "quiz", "mou", "agenda", "attendance"] },
    { t: "Tutorials", d: "Step-by-step guides for meetings, board, assembly, ZRR, DRR and blood drive planning.", h: "/tutorials", k: ["tutorial", "meeting", "board", "assembly", "zrr", "drr", "blood", "training"] },
    { t: "Tutorial: General Meetings", d: "How to run a Rotaract general meeting: agenda, call to order, reports, motions and minutes.", h: "/tutorials#meetings", k: ["tutorial", "meeting", "general", "agenda", "motions", "minutes", "attendance"] },
    { t: "Tutorial: Board Meetings", d: "How to run a Rotaract board meeting: board seats, monthly rhythm, quorum, budget and handover.", h: "/tutorials#board", k: ["tutorial", "board", "quorum", "budget", "officers", "handover"] },
    { t: "Tutorial: Club Assemblies", d: "How to run a Rotaract club assembly: planning and education assemblies, facilitation and follow-up.", h: "/tutorials#assembly", k: ["tutorial", "assembly", "planning", "education", "facilitation", "goals"] },
    { t: "Tutorial: ZRR Visits", d: "What a Zonal Rotaract Representative visit is and how to host one that strengthens your club.", h: "/tutorials#zrr", k: ["tutorial", "zrr", "zonal", "visit", "district"] },
    { t: "Tutorial: DRR Visits", d: "How to host a District Rotaract Representative visit: recognition, coaching and district connection.", h: "/tutorials#drr", k: ["tutorial", "drr", "district", "visit", "recognition"] },
    { t: "Tutorial: Blood Donation", d: "The playbook for a safe, legal Rotaract blood donation camp: planning, donors, day-of flow and first aid.", h: "/tutorials#blood", k: ["tutorial", "blood", "donation", "donor", "camp", "first aid"] },
    { t: "RotaQuiz", d: "Practice the Rotary-Rotaract quiz with the full question bank and study materials.", h: "/rkt-quiz", k: ["quiz", "question", "study", "rotary", "rotaract", "practice"] },
    { t: "Handbook", d: "The Zone 7 club handbook - everything a club needs to run smoothly.", h: "/tutorials", k: ["handbook", "manual", "club"] },
    { t: "Handbook: Grants", d: "District fund (RDG) grant criteria, eligibility and application guidance.", h: "/tutorials#grants", k: ["grant", "rdg", "fund", "funding", "district fund", "apply"] },
    { t: "Handbook: New Clubs", d: "How to charter and grow a new Rotaract club in District 3292.", h: "/tutorials#newclub", k: ["new club", "charter", "start", "establish", "formation"] },
    { t: "Handbook: Projects", d: "Project planning, execution and reporting for clubs.", h: "/tutorials#projects", k: ["project", "planning", "service", "report"] },
    { t: "Handbook: Health", d: "Health and safety guidance for club activities and drives.", h: "/tutorials#health", k: ["health", "safety", "first aid", "blood"] },
    { t: "Handbook: Twinship", d: "Twin club partnerships and international fellowship.", h: "/tutorials#twinship", k: ["twinship", "twin", "international", "fellowship"] },
    { t: "Club Guides", d: "Tools and templates club leaders use for meetings, minutes and treasury.", h: "/tutorials", k: ["club guide", "minutes", "treasury", "secretary", "treasurer"] },
    { t: "Club Tools", d: "Meeting minutes and treasury tools for club admins.", h: "/club-tools", k: ["minutes", "treasury", "tool", "secretary", "treasurer", "finance"] },
    { t: "Store", d: "Zone 7 merchandise and partner store.", h: "/store", k: ["store", "shop", "merchandise", "merch", "buy"] },
    { t: "Flood Help & Emergency", d: "Rescue helplines, missing-person reports and the Rasuwa flood GIS map - a historical response record.", h: "/flood-help", k: ["flood", "emergency", "help", "missing", "rescue", "rasuwa", "1149", "100", "helpline"] },
    { t: "Rasuwa Flood GIS Map", d: "Interactive GIS record of the Sept 2026 Rasuwa flood: 51 affected local units, risk zones and settlements.", h: "/rasuwa-flood-map", k: ["map", "gis", "flood", "rasuwa", "satellite", "affected", "corridor", "settlement", "risk", "tour"] },
    { t: "Volunteer Registration", d: "Flood-relief volunteer registration for District 3292 - mobilised only via authorities when needed.", h: "/volunteers", k: ["volunteer", "register", "registration", "relief", "rescue", "rasuwa", "join", "help"] },
    { t: "Meetings", d: "Meeting guides - moved to the Tutorials section.", h: "/tutorials#meetings", k: ["meeting", "minutes", "agenda"] }
  ];

  function clubItems() {
    var out = [];
    try {
      if (typeof CLUB_DIRECTORY === "undefined" || !CLUB_DIRECTORY) return out;
      Object.keys(CLUB_DIRECTORY).forEach(function (slug) {
        var c = CLUB_DIRECTORY[slug];
        out.push({
          t: c.name,
          d: "Rotaract club in the Kathmandu Valley.",
          s: "Clubs",
          h: "/club?club=" + encodeURIComponent(slug),
          icon: "🏛",
          tag: "Club",
          k: ["club", slug, String(c.name).replace(/^Rotaract Club of /i, "")]
        });
      });
    } catch (e) {}
    return out;
  }

  var live = null;
  var loading = false;
  var cbs = [];

  function pageItems() {
    var out = [];
    PAGES.forEach(function (p) {
      out.push({ t: p.t, d: p.d, s: "Pages", h: p.h, icon: "📄", tag: "Page", k: p.k || [] });
    });
    return out;
  }

  function items() {
    var out = pageItems().concat(clubItems());
    if (live) {
      [].concat(live.guides || []).concat(live.events || []).concat(live.projects || [])
        .forEach(function (it) { out.push(it); });
    }
    return out;
  }

  function loadLive(done) {
    cbs.push(done);
    if (live) { var c0 = cbs.splice(0, cbs.length); c0.forEach(function (f) { try { f(live); } catch (e) {} }); return; }
    if (loading) return;
    loading = true;
    var guides = [], events = [], projects = [];
    var finished = false;
    function finalize() {
      if (finished) return;
      finished = true;
      try {
        var g = (guides || []).map(function (row) {
          return { t: row.title || "Guide", d: row.description || "", s: "Guides", h: "/guides#" + encodeURIComponent(row.id), icon: "📄", tag: row.tag || row.category || "Guide", k: [row.title, row.description, row.category, row.tag, row.file_name].filter(Boolean) };
        });
        var e = (events || []).map(function (row) {
          return { t: row.title || "Event", d: row.description || "", s: "Events", h: row.rsvp_link || "/#events", icon: "🎪", tag: "Event", k: [row.title, row.description, row.location].filter(Boolean) };
        });
        var pt = (projects || []).map(function (row) {
          return { t: row.title || "Project", d: row.summary || row.category || "", s: "Projects", h: "/project?club=" + encodeURIComponent(row.club_slug) + "&id=" + encodeURIComponent(row.id), icon: "🚧", tag: row.category || "Project", k: [row.title, row.category, row.club_slug, row.summary, row.body].filter(Boolean) };
        });
        live = { guides: g, events: e, projects: pt };
      } catch (err) {
        live = { guides: [], events: [], projects: [] };
      }
      var pending = cbs.splice(0, cbs.length);
      pending.forEach(function (f) { try { f(live); } catch (e) {} });
    }
    try {
      var db = (typeof ZONE7_DB !== "undefined") ? ZONE7_DB : null;
      var pr = [];
      if (db && db.getGuides) pr.push(db.getGuides().then(function (r) { guides = r || []; }));
      if (db && db.getEvents) pr.push(db.getEvents().then(function (r) { events = r || []; }));
      if (db && db.getAllProjects) pr.push(db.getAllProjects({ limit: 500 }).then(function (r) { projects = r || []; }));
      if (pr.length) Promise.all(pr).then(finalize).catch(finalize);
      else setTimeout(finalize, 0);
    } catch (e) { finalize(); }
  }

  return {
    pages: PAGES,
    items: items,
    ensure: loadLive,
    live: function () { return live; }
  };
})();