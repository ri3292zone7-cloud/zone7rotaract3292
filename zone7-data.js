/* ===================================================================
   Zone 7 Rotaract — shared data layer (Supabase-backed)
   Used by club.html, project.html, admin.html

   SETUP: fill in SUPABASE_URL and SUPABASE_ANON_KEY below, from your
   Supabase project's Settings → API page. Run supabase_schema.sql in
   the SQL Editor once before this will work.

   Every page only talks to ZONE7_DB below — this is the one file that
   changes if you ever swap backends.
=================================================================== */

const SUPABASE_URL = "https://pdlolyghlgztjrpxwytl.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_MNRC6w2H8lZ9OANmmntZaQ__OBFwqCj";

const CLUB_DIRECTORY = {
  balkumari:        { name:"Rotaract Club of Balkumari",              ig:"rac_balkumari",              logo:"logos/balkumari.jpg" },
  baneshwor:         { name:"Rotaract Club of Baneshwor",               ig:"racbaneshwor",                logo:"logos/baneshwor.jpg" },
  liberty:           { name:"Rotaract Club of Liberty College",         ig:"rotaractcluboflibertycollege", logo:"logos/liberty.jpg" },
  kathmanduwest:     { name:"Rotaract Club of Kathmandu West",          ig:"kathmanduwest",               logo:"logos/kathmanduwest.jpg" },
  kathmanduheight:   { name:"Rotaract Club of Kathmandu Height",        ig:"rackathmanduheight",          logo:"logos/kathmanduheight.jpg" },
  sankhu:            { name:"Rotaract Club of Sankhu",                  ig:"racsankhu",                   logo:"logos/sankhu.jpg" },
  newroadcity:       { name:"Rotaract Club of New Road City Kathmandu", ig:"racnewroadcity1",             logo:"logos/newroadcity.jpg" },
  sukedhara:         { name:"Rotaract Club of Sukedhara",               ig:"rac_sukedhara",               logo:"logos/sukedhara.jpg" },
  tripureswor:       { name:"Rotaract Club of Tripureswor",             ig:"ractripureswor",              logo:"logos/tripureswor.jpg" }
};

/* Demo login gate — front-end only. Anyone who reads this file can see
   these, so treat them as "keep casual visitors out," not real security.
   For real per-club security, move to Supabase Auth (happy to wire up
   if you want that later). */
/* Per-club letterhead defaults — used to auto-fill Meeting Minutes so
   secretaries don't retype sponsor/charter-date every time. Sourced from
   the same real club data shown on each club's public page. */
const CLUB_LETTERHEAD = {
  balkumari:       { sponsor:"Rotary Club of Butwal",         chartered:"18th October 2023" },
  baneshwor:       { sponsor:"Rotary Club of Baneshwor",      chartered:"13th October 2020" },
  liberty:         { sponsor:"Rotary Club of Nagarjun",       chartered:"1st May 2012" },
  kathmanduwest:   { sponsor:"Rotary Club of Kathmandu West", chartered:"10th September 2007" },
  kathmanduheight: { sponsor:"Rotary Club of Kathmandu Height", chartered:"6th January 2026" },
  sankhu:          { sponsor:"Rotary Club of Sankhu",         chartered:"25th June 2020" },
  newroadcity:     { sponsor:"Rotary Club of New Road City",  chartered:"1st September 2004" },
  sukedhara:       { sponsor:"Rotary Club of Nagarjun",       chartered:"1st July 2019" },
  tripureswor:     { sponsor:"Rotary Club of Tripureswor",    chartered:"24th November 2003" }
};

const CLUB_CREDENTIALS = {
  balkumari:       "balkumari2026",
  baneshwor:        "baneshwor2026",
  liberty:          "liberty2026",
  kathmanduwest:    "ktmwest2026",
  kathmanduheight:  "ktmheight2026",
  sankhu:           "sankhu2026",
  newroadcity:      "newroadcity2026",
  sukedhara:        "sukedhara2026",
  tripureswor:      "tripureswor2026"
};

/* Zonal team login — separate from club logins, used to manage the
   shared Guides for Clubs resource page. Same "front-end gate" caveat
   as club passwords above. */
const ZONAL_PASSWORD = "zone7admin2026";

/* Clubs that are University-Based (everyone else is Community-Based)
   — this decides which barometer a club sees in the admin dashboard. */
const UNIVERSITY_CLUBS = ["liberty"];

/* ===================================================================
   DISTRICT 3292 BAROMETER — RY 2026-27
   Two variants: Community-Based Clubs & University-Based Clubs.
   Items 1-7, 9-23, 25-27, 29-31(ish), 33-40 are shared/near-identical;
   a handful of items differ in wording, points, or targets between the
   two club types (noted per item). Each item can optionally carry an
   "auto" key naming a rule zone7AutoCheck() knows how to evaluate from
   a club's uploaded projects — everything else is self-reported by the
   club and meant to be confirmed later by the ZRR / Recognition Committee.
=================================================================== */
const BAROMETER_THRESHOLDS = [
  { min:96, max:100, label:"Star Excellence" },
  { min:86, max:95,  label:"Diamond Excellence" },
  { min:71, max:85,  label:"Premier Excellence" },
  { min:60, max:70,  label:"Distinguished Excellence" }
];

function zone7BarometerCategory(score){
  for(const t of BAROMETER_THRESHOLDS){ if(score >= t.min) return t.label; }
  return "Not Yet Rated";
}

const BAROMETER_GROUPS = [
  { key:"governance", label:"Governance & Foundations", icon:"🏛️" },
  { key:"meetings",   label:"Meetings & Development",   icon:"🎓" },
  { key:"reporting",  label:"Reporting & Compliance",    icon:"📋" },
  { key:"projects",   label:"Projects & District Events", icon:"🤝" },
  { key:"service",    label:"Service & Recognition",      icon:"🏆" }
];
function zone7BarometerGroup(id){
  if(id <= 7) return "governance";
  if(id <= 16) return "meetings";
  if(id <= 24) return "reporting";
  if(id <= 31) return "projects";
  return "service";
}

const BAROMETER_COMMUNITY = [
  {id:1,  points:2, verifier:"Zonal Rotaract Representative", text:"Form a strategic planning team to create a strategic plan with vision, mission and aligned yearly goals, update it in district software, and submit it by July 30, 2026."},
  {id:2,  points:2, verifier:"Zonal Rotaract Representative", text:"Maintain and organize all club assets and records such as charter documents, collar, gong and gavel, attendance, minutes, reports, and official guidelines (Rotaract Handbook, Statement of Policy, Constitution and Standard Club Bylaws)."},
  {id:3,  points:3, verifier:"Recognition Committee", text:"Update members' demographic details in the Rotaract Nepal Software and RI portal, assign mentors and committee roles, and verify through updates in the Members section of both platforms."},
  {id:4,  points:2, verifier:"Zonal Rotaract Representative", text:"Update your Goal Mission in Rotary Central at My Rotary."},
  {id:5,  points:2, verifier:"Zonal Rotaract Representative", text:"Form and appoint club committee members and conduct committee meetings as per the Club By-laws."},
  {id:6,  points:2, verifier:"Zonal Rotaract Representative", text:"Establish financial guidelines to ensure transparent and responsible management of all club funds."},
  {id:7,  points:2, verifier:"Zonal Rotaract Representative", text:"Prepare a realistic annual club budget and review it with feedback during the club assembly."},
  {id:8,  points:3, verifier:"Zonal Rotaract Representative", text:"Conduct 24 General Meetings and 12 BOD Meetings."},
  {id:9,  points:2, verifier:"Zonal Rotaract Representative", text:"Conduct at least two club assemblies."},
  {id:10, points:2, verifier:"Zonal Rotaract Representative", text:"President Elect finalized within deadline."},
  {id:11, points:2, verifier:"Zonal Rotaract Representative", text:"Complete the club installation within August."},
  {id:12, points:2, verifier:"Zonal Rotaract Representative", text:"Increase membership by at least 20%."},
  {id:13, points:2, verifier:"Zonal Rotaract Representative", text:"Maintain member retention at up to 80%."},
  {id:14, points:1, verifier:"Zonal Rotaract Representative", text:"Participate in the PST Elect Learning Seminar."},
  {id:15, points:3, verifier:"Zonal Rotaract Representative", text:"Ensure at least 10% member participation in Zonal COTS."},
  {id:16, points:3, verifier:"Zonal Rotaract Representative", text:"Host a Club COTS."},
  {id:17, points:4, verifier:"Recognition Committee", text:"Submit quarterly reports to the Rotaract District."},
  {id:18, points:4, verifier:"Zonal Rotaract Representative", text:"Facilitate ZRR visits semi-annually."},
  {id:19, points:4, verifier:"Zonal Rotaract Representative", text:"Conduct the DRR visit."},
  {id:20, points:2, verifier:"Recognition Committee", text:"Achieve 100% access to My Rotary."},
  {id:21, points:2, verifier:"Zonal Rotaract Representative", text:"Intra District Twin Club Formation."},
  {id:22, points:4, verifier:"Zonal Rotaract Representative", text:"Payment of RI Dues + District Dues (within deadline, as per email)."},
  {id:23, points:2, verifier:"Recognition Committee", text:"Participate in the Grant Management Seminar."},
  {id:24, points:3, verifier:"Recognition Committee", text:"Invite experts from different sectors to speak at your meetings (minimum of 3 meetings)."},
  {id:25, points:2, verifier:"Recognition Committee", text:"Conduct a project supporting the DRR Theme."},
  {id:26, points:2, verifier:"Zonal Rotaract Representative", text:"Joint meeting and program with sponsoring/partner Rotary club."},
  {id:27, points:2, verifier:"Recognition Committee", text:"Implement a club signature project."},
  {id:28, points:3, verifier:"Recognition Committee", text:"Conduct at least two public fundraising events to support the club's activities."},
  {id:29, points:4, verifier:"Recognition Committee", text:"Celebrate World Rotaract Week for 7 days."},
  {id:30, points:5, verifier:"Recognition Committee", text:"Participate in five major district events."},
  {id:31, points:2, verifier:"Recognition Committee", text:"Host / Collaborate / Co-Host / Support any Rotaract District Event."},
  {id:32, points:2, verifier:"Recognition Committee", text:"Conduct the 13th Late Rtr. Sachin Memorial Nationwide Blood Donation, or at least one blood donation event during the year.", auto:"blood"},
  {id:33, points:2, verifier:"Recognition Committee", text:"Participate in the Late Rtr. Santosh Memorial ROTA Quiz."},
  {id:34, points:2, verifier:"Recognition Committee", text:"Participate in the Nationwide Futsal Tournament."},
  {id:35, points:2, verifier:"Recognition Committee", text:"Conduct a joint project with another organization (other than Rotaract)."},
  {id:36, points:4, verifier:"Recognition Committee", text:"Project based on Rotary's 7 Areas of Focus (at least projects across 4 focus areas).", auto:"focusareas"},
  {id:37, points:2, verifier:"Zonal Rotaract Representative", text:"Project based on the International Avenue (Twinship + Project)."},
  {id:38, points:2, verifier:"Recognition Committee", text:"Conduct a project focused on members' professional development."},
  {id:39, points:2, verifier:"Recognition Committee", text:"Collaboration with other organizations for privilege cards and benefits."},
  {id:40, points:2, verifier:"Recognition Committee", text:"Maintain the club's social media regularly."}
].map(item => ({...item, group: zone7BarometerGroup(item.id)}));

/* University-based variant — same numbering, differences vs. Community
   noted inline (items 8, 12, 13, 24, 28, 29, 30, 31, 35 differ). */
const BAROMETER_UNIVERSITY = BAROMETER_COMMUNITY.map(item => ({...item})).map(item => {
  const overrides = {
    8:  {points:4, text:"Conduct 18 General Meetings and 12 BOD Meetings."},
    12: {text:"Increase membership by at least 50%."},
    13: {text:"Maintain member retention at up to 40%."},
    24: {points:4},
    28: {points:2, text:"Conduct at least one public fundraising event to support the club's activities."},
    29: {points:4, verifier:"Zonal Rotaract Representative", text:"Conduct at least two Goodwill Visits with Rotaract Clubs."},
    30: {points:4, text:"Participate in any four major district events."},
    31: {text:"Conduct a project based on Maternal Health or Child Health."},
    35: {text:"Conduct a project based on Basic Education and TEACH."}
  };
  return overrides[item.id] ? {...item, ...overrides[item.id]} : item;
});

function zone7GetBarometer(clubSlug){
  return UNIVERSITY_CLUBS.includes(clubSlug) ? BAROMETER_UNIVERSITY : BAROMETER_COMMUNITY;
}

/* Rotary's 7 Areas of Focus — used to auto-tally item 36. Matched loosely
   against a project's category/title/summary/body text. */
const ROTARY_FOCUS_AREAS = {
  "Peacebuilding & Conflict Prevention": ["peace","conflict"],
  "Disease Prevention & Treatment": ["disease","health camp","medical","vaccination"],
  "Water, Sanitation & Hygiene": ["water","sanitation","hygiene","wash"],
  "Maternal & Child Health": ["maternal","child health","mother","newborn"],
  "Basic Education & Literacy": ["education","literacy","school","teach"],
  "Community Economic Development": ["economic","livelihood","entrepreneur","income"],
  "Environment": ["environment","tree","plantation","clean-up","cleanup","climate"]
};

/* Is a project's date within Rotary Year 2026-27 (1 Jul 2026 – 30 Jun 2027)? */
function zone7InRY2627(dateStr){
  if(!dateStr) return false;
  const d = new Date(dateStr);
  if(isNaN(d)) return false;
  return d >= new Date('2026-07-01') && d <= new Date('2027-06-30T23:59:59');
}

/* Deterministic 4-digit confirmation code per club+barometer-item, so a
   club can "fill in the code" to confirm a criterion instead of just
   self-ticking a box. Not real security — same front-end-gate caveat as
   the rest of this file — just a lightweight confirm-to-check step. */
function zone7ItemCode(clubSlug, itemId){
  const str = `${clubSlug}-${itemId}-zone7`;
  let h = 0;
  for(let i=0;i<str.length;i++){ h = (h*31 + str.charCodeAt(i)) >>> 0; }
  return String(1000 + (h % 9000));
}

/* Given a club's project list, auto-evaluate the handful of barometer
   items that can be reasonably inferred from project data. Only projects
   dated within RY 2026-27 count. Returns a Set of item ids that should
   be considered satisfied. */
function zone7AutoCheck(allProjects){
  const projects = allProjects.filter(p => zone7InRY2627(p.date));
  const satisfied = new Set();
  const blob = p => `${p.title||""} ${p.category||""} ${p.summary||""} ${p.body||""}`.toLowerCase();

  // item 32 — any project mentioning blood donation
  if(projects.some(p => blob(p).includes("blood"))){
    satisfied.add(32);
  }

  // item 36 — projects touching at least 4 of Rotary's 7 Areas of Focus
  const matchedAreas = new Set();
  projects.forEach(p => {
    const text = blob(p);
    Object.entries(ROTARY_FOCUS_AREAS).forEach(([area, keywords]) => {
      if(keywords.some(k => text.includes(k))) matchedAreas.add(area);
    });
  });
  if(matchedAreas.size >= 4){
    satisfied.add(36);
  }

  return satisfied;
}

const CLUB_PROFILES_URL = `${SUPABASE_URL}/rest/v1/club_profiles`;
const BAROMETER_URL = `${SUPABASE_URL}/rest/v1/barometer`;
const LEADERSHIP_URL = `${SUPABASE_URL}/rest/v1/leadership`;

const GUIDES_URL = `${SUPABASE_URL}/rest/v1/guides`;
const ZRRS_URL = `${SUPABASE_URL}/rest/v1/zrrs`;
const GUEST_URL = `${SUPABASE_URL}/rest/v1/guest_requests`;
const APP_URL = `${SUPABASE_URL}/rest/v1/membership_applications`;
const REST_URL = `${SUPABASE_URL}/rest/v1/projects`;
const EVENTS_URL = `${SUPABASE_URL}/rest/v1/events`;
const REST_HEADERS = {
  "apikey": SUPABASE_ANON_KEY,
  "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

const ZONE7_DB = {
  _sessionKey: "zone7_admin_session",
  _cache: {}, // clubSlug -> [projects], fallback if a fetch fails

  async getEvents(){
    try{
      const res = await fetch(`${EVENTS_URL}?order=event_date.asc`, { headers: REST_HEADERS });
      if(!res.ok) throw new Error("Fetch failed: " + res.status);
      return await res.json();
    } catch(e){
      console.error("ZONE7_DB.getEvents error", e);
      return this._eventsCache || [];
    }
  },

  async saveEvent(event){
    event.updated = Date.now();
    const res = await fetch(`${EVENTS_URL}?on_conflict=id`, {
      method: "POST",
      headers: { ...REST_HEADERS, "Prefer": "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(event)
    });
    if(!res.ok){
      const errText = await res.text();
      throw new Error("Save failed: " + res.status + " " + errText);
    }
    return true;
  },

  async deleteEvent(id){
    const res = await fetch(`${EVENTS_URL}?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: REST_HEADERS
    });
    if(!res.ok) throw new Error("Delete failed: " + res.status);
    return true;
  },

  async getAllProjects(){
    try{
      const res = await fetch(`${REST_URL}?select=id,club_slug,title,category,date,updated`, { headers: REST_HEADERS });
      if(!res.ok) throw new Error("Fetch failed: " + res.status);
      const rows = await res.json();
      this._allCache = rows;
      return rows;
    } catch(e){
      console.error("ZONE7_DB.getAllProjects error", e);
      return this._allCache || [];
    }
  },

  async getProjects(clubSlug){
    try{
      const res = await fetch(`${REST_URL}?club_slug=eq.${encodeURIComponent(clubSlug)}&order=updated.desc`, {
        headers: REST_HEADERS
      });
      if(!res.ok) throw new Error("Fetch failed: " + res.status);
      const rows = await res.json();
      const projects = rows.map(this._fromRow);
      this._cache[clubSlug] = projects;
      return projects;
    } catch(e){
      console.error("ZONE7_DB.getProjects error", e);
      return this._cache[clubSlug] || [];
    }
  },

  async getProject(clubSlug, id){
    try{
      const res = await fetch(`${REST_URL}?club_slug=eq.${encodeURIComponent(clubSlug)}&id=eq.${encodeURIComponent(id)}`, {
        headers: REST_HEADERS
      });
      if(!res.ok) throw new Error("Fetch failed: " + res.status);
      const rows = await res.json();
      return rows.length ? this._fromRow(rows[0]) : null;
    } catch(e){
      console.error("ZONE7_DB.getProject error", e);
      return null;
    }
  },

  async saveProject(clubSlug, project){
    project.updated = Date.now();
    const row = {
      id: project.id,
      club_slug: clubSlug,
      title: project.title,
      category: project.category || "",
      date: project.date || "",
      location: project.location || "",
      summary: project.summary || "",
      body: project.body || "",
      cover: project.cover || "",
      gallery: project.gallery || [],
      attendees: project.attendees !== "" && project.attendees != null ? Number(project.attendees) : null,
      volunteer_hours: project.volunteer_hours !== "" && project.volunteer_hours != null ? Number(project.volunteer_hours) : null,
      duration: project.duration || "",
      jointly_with: project.jointly_with || "",
      host_status: project.host_status || "",
      project_code: project.project_code || "",
      updated: project.updated
    };
    const res = await fetch(`${REST_URL}?on_conflict=id`, {
      method: "POST",
      headers: { ...REST_HEADERS, "Prefer": "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(row)
    });
    if(!res.ok){
      const errText = await res.text();
      throw new Error("Save failed: " + res.status + " " + errText);
    }
    return true;
  },

  async deleteProject(clubSlug, id){
    const res = await fetch(`${REST_URL}?club_slug=eq.${encodeURIComponent(clubSlug)}&id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: REST_HEADERS
    });
    if(!res.ok) throw new Error("Delete failed: " + res.status);
    return true;
  },

  _fromRow(row){
    return {
      id: row.id,
      title: row.title,
      category: row.category,
      date: row.date,
      location: row.location,
      summary: row.summary,
      body: row.body,
      cover: row.cover,
      gallery: row.gallery || [],
      attendees: row.attendees ?? null,
      volunteer_hours: row.volunteer_hours ?? null,
      duration: row.duration || "",
      jointly_with: row.jointly_with || "",
      host_status: row.host_status || "",
      project_code: row.project_code || "",
      updated: row.updated
    };
  },

  /* ---- club profile (BOD + editable about/vision/goals) ---- */
  async getClubProfile(clubSlug){
    try{
      const res = await fetch(`${CLUB_PROFILES_URL}?club_slug=eq.${encodeURIComponent(clubSlug)}`, { headers: REST_HEADERS });
      if(!res.ok) throw new Error("Fetch failed: " + res.status);
      const rows = await res.json();
      return rows.length ? rows[0] : null;
    } catch(e){
      console.error("ZONE7_DB.getClubProfile error", e);
      return null;
    }
  },

  async saveClubProfile(clubSlug, data){
    const row = { club_slug: clubSlug, board: data.board || [], about: data.about || "", vision: data.vision || "", goals: data.goals || [], updated: Date.now() };
    const res = await fetch(`${CLUB_PROFILES_URL}?on_conflict=club_slug`, {
      method: "POST",
      headers: { ...REST_HEADERS, "Prefer": "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(row)
    });
    if(!res.ok){ const t = await res.text(); throw new Error("Save failed: " + res.status + " " + t); }
    return true;
  },

  /* ---- barometer (District 3292 club excellence checklist) ---- */
  async getBarometer(clubSlug){
    try{
      const res = await fetch(`${BAROMETER_URL}?club_slug=eq.${encodeURIComponent(clubSlug)}`, { headers: REST_HEADERS });
      if(!res.ok) throw new Error("Fetch failed: " + res.status);
      const rows = await res.json();
      return rows.length ? rows[0] : { club_slug: clubSlug, checked_items: [], checked_items_quick: [] };
    } catch(e){
      console.error("ZONE7_DB.getBarometer error", e);
      return this._barometerCache && this._barometerCache[clubSlug] || { club_slug: clubSlug, checked_items: [], checked_items_quick: [] };
    }
  },

  async saveBarometer(clubSlug, checkedItems){
    const row = { club_slug: clubSlug, checked_items: checkedItems, updated: Date.now() };
    this._barometerCache = this._barometerCache || {};
    this._barometerCache[clubSlug] = { ...(this._barometerCache[clubSlug]||{}), ...row };
    const res = await fetch(`${BAROMETER_URL}?on_conflict=club_slug`, {
      method: "POST",
      headers: { ...REST_HEADERS, "Prefer": "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(row)
    });
    if(!res.ok){
      const errText = await res.text();
      throw new Error("Save failed: " + res.status + " " + errText);
    }
    return true;
  },

  async saveBarometerQuick(clubSlug, checkedItems){
    const row = { club_slug: clubSlug, checked_items_quick: checkedItems, updated: Date.now() };
    this._barometerCache = this._barometerCache || {};
    this._barometerCache[clubSlug] = { ...(this._barometerCache[clubSlug]||{}), ...row };
    const res = await fetch(`${BAROMETER_URL}?on_conflict=club_slug`, {
      method: "POST",
      headers: { ...REST_HEADERS, "Prefer": "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(row)
    });
    if(!res.ok){
      const errText = await res.text();
      throw new Error("Save failed: " + res.status + " " + errText);
    }
    return true;
  },

  /* ---- guides (Guides for Clubs resource page) ---- */
  async getGuides(){
    try{
      const res = await fetch(`${GUIDES_URL}?order=updated.desc`, { headers: REST_HEADERS });
      if(!res.ok) throw new Error("Fetch failed: " + res.status);
      return await res.json();
    } catch(e){
      console.error("ZONE7_DB.getGuides error", e);
      return this._guidesCache || [];
    }
  },

  async saveGuide(guide){
    guide.updated = Date.now();
    const res = await fetch(`${GUIDES_URL}?on_conflict=id`, {
      method: "POST",
      headers: { ...REST_HEADERS, "Prefer": "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(guide)
    });
    if(!res.ok){
      const errText = await res.text();
      throw new Error("Save failed: " + res.status + " " + errText);
    }
    return true;
  },

  async deleteGuide(id){
    const res = await fetch(`${GUIDES_URL}?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: REST_HEADERS
    });
    if(!res.ok) throw new Error("Delete failed: " + res.status);
    return true;
  },

  /* ---- guest visit requests (join.html) ---- */
  async submitGuestRequest(row){
    const res = await fetch(GUEST_URL, {
      method: "POST",
      headers: { ...REST_HEADERS, "Prefer": "return=representation" },
      body: JSON.stringify(row)
    });
    if(!res.ok){
      const errText = await res.text();
      throw new Error("Save failed: " + res.status + " " + errText);
    }
    return true;
  },

  async getGuestRequests(){
    const res = await fetch(`${GUEST_URL}?order=created_at.desc&limit=100`, { headers: REST_HEADERS });
    if(!res.ok) throw new Error("Fetch failed: " + res.status);
    return await res.json();
  },

  async setGuestRequestStatus(id, status){
    const res = await fetch(`${GUEST_URL}?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { ...REST_HEADERS, "Prefer": "return=representation" },
      body: JSON.stringify({ status: status })
    });
    if(!res.ok) throw new Error("Update failed: " + res.status);
    return true;
  },

  async deleteGuestRequest(id){
    const res = await fetch(`${GUEST_URL}?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: REST_HEADERS
    });
    if(!res.ok) throw new Error("Delete failed: " + res.status);
    return true;
  },

  /* ---- membership applications (join.html) ---- */
  async submitMembershipApplication(row){
    const res = await fetch(APP_URL, {
      method: "POST",
      headers: { ...REST_HEADERS, "Prefer": "return=representation" },
      body: JSON.stringify(row)
    });
    if(!res.ok){
      const errText = await res.text();
      throw new Error("Save failed: " + res.status + " " + errText);
    }
    return true;
  },

  async getMembershipApplications(){
    const res = await fetch(`${APP_URL}?order=created_at.desc&limit=100`, { headers: REST_HEADERS });
    if(!res.ok) throw new Error("Fetch failed: " + res.status);
    return await res.json();
  },

  async setMembershipApplicationStatus(id, status){
    const res = await fetch(`${APP_URL}?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { ...REST_HEADERS, "Prefer": "return=representation" },
      body: JSON.stringify({ status: status })
    });
    if(!res.ok) throw new Error("Update failed: " + res.status);
    return true;
  },

  async deleteMembershipApplication(id){
    const res = await fetch(`${APP_URL}?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: REST_HEADERS
    });
    if(!res.ok) throw new Error("Delete failed: " + res.status);
    return true;
  },

  /* ---- ZRR history (Line of Leadership timeline on index.html) ---- */
  _zrrFallback: [
    { id:"zrr-2122", name:"Binaya Maharjan", years:"21-22", sort_order:1, is_current:false, club:"Rotaract Club of Liberty College", photo:"team/Binaya.png" },
    { id:"zrr-2223", name:"Ankush Adhikari", years:"22-23", sort_order:2, is_current:false, club:"Rotaract Club of Tripureswor", photo:"team/Ankush.jpg" },
    { id:"zrr-2324", name:"Gopal Shah", years:"23-24", sort_order:3, is_current:false, club:"Rotaract Club of Baneshwor", photo:"team/Gopal-Shah.jpg" },
    { id:"zrr-2425", name:"Subina Kuickel", years:"24-25", sort_order:4, is_current:false, club:"Rotaract Club of Sankhu", photo:"team/Subina.jpg" },
    { id:"zrr-2526", name:"Nitesh Thakur", years:"25-26", sort_order:5, is_current:false, club:"Rotaract Club of Balkumari", photo:"team/Nitesh.png" },
    { id:"zrr-2627", name:"Rajay Bajracharya", years:"26-27", sort_order:6, is_current:true, club:"Rotaract Club of Sukedhara" }
  ],

  async getZRRs(){
    try{
      const res = await fetch(`${ZRRS_URL}?order=sort_order.asc`, { headers: REST_HEADERS });
      if(!res.ok) throw new Error("Fetch failed: " + res.status);
      const rows = await res.json();
      if(rows.length){ this._zrrCache = rows; return rows; }
      // Seed the fallback history into Supabase so it persists
      for(const z of this._zrrFallback){
        await this.saveZRR({...z});
      }
      this._zrrCache = this._zrrFallback;
      return this._zrrFallback;
    } catch(e){
      console.error("ZONE7_DB.getZRRs error", e);
      return this._zrrCache || this._zrrFallback;
    }
  },

  async saveZRR(zrr){
    zrr.updated = Date.now();
    const res = await fetch(`${ZRRS_URL}?on_conflict=id`, {
      method: "POST",
      headers: { ...REST_HEADERS, "Prefer": "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(zrr)
    });
    if(!res.ok){
      const errText = await res.text();
      throw new Error("Save failed: " + res.status + " " + errText);
    }
    return true;
  },

  async deleteZRR(id){
    const res = await fetch(`${ZRRS_URL}?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: REST_HEADERS
    });
    if(!res.ok) throw new Error("Delete failed: " + res.status);
    return true;
  },

  /* ---- current zonal team / leadership (editable from admin) ---- */
  _leadershipFallback: [
    { id:"leader-zrr",  role:"ZRR",  role_full:"Zonal Rotaract Representative", name:"Rajay Bajracharya", club:"Rotaract Club of Sukedhara",         bio:"Rajay Bajracharya serves as Zone 7's Rotaract Representative for RY 2026–27, guiding the zone's clubs and coordinating between Zone 7 and the wider District 3292 leadership.", photo:"", sort_order:1 },
    { id:"leader-zs",   role:"ZS",   role_full:"Zonal Secretary",               name:"Peshal Basnet",     club:"Rotaract Club of Liberty College",   bio:"Peshal Basnet serves as Zone 7's Secretary for RY 2026–27, supporting the zone's administration, communication and record-keeping across its clubs.", photo:"team/Peshal.jpg", sort_order:2 },
    { id:"leader-zfc",  role:"ZFC",  role_full:"Zonal Fellowship Chair",         name:"Samrat Pandey",    club:"Rotaract Club of Tripureswor",       bio:"Samrat Pandey serves as Zone 7's Fellowship Chair for RY 2026–27, organizing fellowship activities that bring Zone 7's clubs together.", photo:"team/Samrat.jpg", sort_order:3 },
    { id:"leader-zpic", role:"ZPIC", role_full:"Zonal Public Image Chair",       name:"Rishav Thapa",     club:"Rotaract Club of Kathmandu Height",  bio:"Rishav Thapa serves as Zone 7's Public Image Chair for RY 2026–27, leading how the zone and its clubs are represented publicly.", photo:"team/Rishav.jpg", sort_order:4 }
  ],

  async getLeadership(){
    try{
      const res = await fetch(`${LEADERSHIP_URL}?order=sort_order.asc`, { headers: REST_HEADERS });
      if(!res.ok) throw new Error("Fetch failed: " + res.status);
      const rows = await res.json();
      if(rows.length){ this._leadershipCache = rows; return rows; }
      // Seed fallback
      for(const l of this._leadershipFallback){ await this.saveLeader({...l}); }
      this._leadershipCache = this._leadershipFallback;
      return this._leadershipFallback;
    } catch(e){
      console.error("ZONE7_DB.getLeadership error", e);
      return this._leadershipCache || this._leadershipFallback;
    }
  },

  async saveLeader(leader){
    leader.updated = Date.now();
    const res = await fetch(`${LEADERSHIP_URL}?on_conflict=id`, {
      method: "POST",
      headers: { ...REST_HEADERS, "Prefer": "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(leader)
    });
    if(!res.ok){ const t = await res.text(); throw new Error("Save failed: " + res.status + " " + t); }
    return true;
  },

  async deleteLeader(id){
    const res = await fetch(`${LEADERSHIP_URL}?id=eq.${encodeURIComponent(id)}`, { method:"DELETE", headers: REST_HEADERS });
    if(!res.ok) throw new Error("Delete failed: " + res.status);
    return true;
  },

  /* ---- Meeting Minutes ---- */
  async getMinutes(clubSlug){
    try{
      const res = await fetch(`${SUPABASE_URL}/rest/v1/club_minutes?club_slug=eq.${encodeURIComponent(clubSlug)}&order=updated.desc`, { headers: REST_HEADERS });
      if(!res.ok) throw new Error("Fetch failed: " + res.status);
      return await res.json();
    } catch(e){ console.error("getMinutes error", e); return []; }
  },
  async saveMinutes(clubSlug, id, data){
    const row = { id, club_slug: clubSlug, data, updated: Date.now() };
    const res = await fetch(`${SUPABASE_URL}/rest/v1/club_minutes?on_conflict=id`, {
      method: "POST",
      headers: { ...REST_HEADERS, "Prefer": "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(row)
    });
    if(!res.ok){ const t = await res.text(); throw new Error("Save failed: " + res.status + " " + t); }
    return true;
  },
  async deleteMinutes(id){
    const res = await fetch(`${SUPABASE_URL}/rest/v1/club_minutes?id=eq.${encodeURIComponent(id)}`, { method:"DELETE", headers: REST_HEADERS });
    if(!res.ok) throw new Error("Delete failed: " + res.status);
    return true;
  },

  /* ---- Treasury / Transactions ---- */
  async getTransactions(clubSlug){
    try{
      const res = await fetch(`${SUPABASE_URL}/rest/v1/club_transactions?club_slug=eq.${encodeURIComponent(clubSlug)}&order=date.desc`, { headers: REST_HEADERS });
      if(!res.ok) throw new Error("Fetch failed: " + res.status);
      return await res.json();
    } catch(e){ console.error("getTransactions error", e); return []; }
  },
  async saveTransaction(clubSlug, tx){
    const row = { id: tx.id || (Date.now().toString(36)), club_slug: clubSlug, date: tx.date||"", type: tx.type||"expense", category: tx.category||"", description: tx.desc||"", amount: Number(tx.amount)||0, updated: Date.now() };
    const res = await fetch(`${SUPABASE_URL}/rest/v1/club_transactions?on_conflict=id`, {
      method: "POST",
      headers: { ...REST_HEADERS, "Prefer": "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(row)
    });
    if(!res.ok){ const t = await res.text(); throw new Error("Save failed: " + res.status + " " + t); }
    return true;
  },
  async deleteTransaction(id){
    const res = await fetch(`${SUPABASE_URL}/rest/v1/club_transactions?id=eq.${encodeURIComponent(id)}`, { method:"DELETE", headers: REST_HEADERS });
    if(!res.ok) throw new Error("Delete failed: " + res.status);
    return true;
  },

  /* ---- zonal team session (separate from club login) ---- */
  loginZonal(password){
    if(password === ZONAL_PASSWORD){
      sessionStorage.setItem("zone7_zonal_session", "1");
      return true;
    }
    return false;
  },
  logoutZonal(){
    sessionStorage.removeItem("zone7_zonal_session");
  },
  isZonal(){
    return sessionStorage.getItem("zone7_zonal_session") === "1";
  },

  /* ---- auth (still a front-end password gate — see note above) ---- */
  login(clubSlug, password){
    if(CLUB_CREDENTIALS[clubSlug] && CLUB_CREDENTIALS[clubSlug] === password){
      sessionStorage.setItem(this._sessionKey, clubSlug);
      return true;
    }
    return false;
  },
  logout(){
    sessionStorage.removeItem(this._sessionKey);
  },
  currentClub(){
    return sessionStorage.getItem(this._sessionKey);
  }
};

/* Resize + compress an uploaded image to a base64 string before it's
   stored in the database, so photos don't bloat rows unnecessarily. */
function zone7ReadImage(file, maxWidth = 1400, quality = 0.82){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* Read any file (docx, pdf, etc.) to a base64 data URL as-is, no resizing.
   Used for Guides for Clubs uploads. Keep guide files reasonably small
   (a few MB) since they're stored directly as text in Supabase. */
function zone7ReadFile(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function zone7Esc(str){
  return String(str ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

/* Does a join-request "preferred_club" string point at a given club slug?
   Normalizes both sides (lowercase, no spaces/punctuation) so
   "Rotaract Club of Kathmandu Height" matches slug kathmanduheight. */
function zone7PrefersClub(pref, slug){
  if(!pref) return false;
  return String(pref).toLowerCase().replace(/[^a-z0-9]/g, "").includes(slug);
}

function zone7Slugify(str){
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') || ('project-' + Date.now());
}
