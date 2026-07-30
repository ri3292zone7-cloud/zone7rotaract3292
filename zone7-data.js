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

const GUIDES_URL = `${SUPABASE_URL}/rest/v1/guides`;
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
      updated: row.updated
    };
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

function zone7Slugify(str){
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') || ('project-' + Date.now());
}
