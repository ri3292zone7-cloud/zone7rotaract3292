/* Dynamic sitemap.xml — Vercel function.
   Queries Supabase for live projects, guides, and events so the
   sitemap always reflects the latest content the clubs have added.
   Falls back gracefully: if Supabase is unreachable, it still returns
   the static page list so search engines always get a valid sitemap. */

const SUPABASE_URL = "https://pdlolyghlgztjrpxwytl.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_MNRC6w2H8lZ9OANmmntZaQ__OBFwqCj";

const HEADERS = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

const SITE = "https://zone7rotaract3292.vercel.app";

const CLUB_SLUGS = [
  "balkumari", "baneshwor", "liberty", "kathmanduwest", "kathmanduheight",
  "sankhu", "newroadcity", "sukedhara", "tripureswor",
];

const STATIC_PAGES = [
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/about", priority: 0.8, changefreq: "monthly" },
  { path: "/join", priority: 0.9, changefreq: "monthly" },
  { path: "/gallery", priority: 0.7, changefreq: "weekly" },
  { path: "/guides", priority: 0.8, changefreq: "monthly" },
  { path: "/club-guides", priority: 0.8, changefreq: "monthly" },
  { path: "/rkt-quiz", priority: 0.8, changefreq: "weekly" },
  { path: "/tutorials", priority: 0.8, changefreq: "monthly" },
  { path: "/tutorial-meetings", priority: 0.7, changefreq: "monthly" },
  { path: "/tutorial-board", priority: 0.7, changefreq: "monthly" },
  { path: "/tutorial-assembly", priority: 0.7, changefreq: "monthly" },
  { path: "/tutorial-zrr", priority: 0.7, changefreq: "monthly" },
  { path: "/tutorial-drr", priority: 0.7, changefreq: "monthly" },
  { path: "/tutorial-blood", priority: 0.7, changefreq: "monthly" },
  { path: "/handbook", priority: 0.8, changefreq: "monthly" },
  { path: "/handbook-grants", priority: 0.7, changefreq: "monthly" },
  { path: "/handbook-twinship", priority: 0.7, changefreq: "monthly" },
  { path: "/handbook-newclub", priority: 0.7, changefreq: "monthly" },
  { path: "/handbook-projects", priority: 0.7, changefreq: "monthly" },
  { path: "/handbook-health", priority: 0.7, changefreq: "monthly" },
  { path: "/club", priority: 0.7, changefreq: "weekly" },
  { path: "/project", priority: 0.7, changefreq: "weekly" },
  { path: "/meetings", priority: 0.5, changefreq: "monthly" },
  { path: "/admin", priority: 0.4, changefreq: "monthly" },
  { path: "/merch", priority: 0.8, changefreq: "monthly" },
  { path: "/store", priority: 0.8, changefreq: "monthly" },
  { path: "/district-overview", priority: 0.6, changefreq: "monthly" },
  { path: "/pending-applications", priority: 0.4, changefreq: "monthly" },
  { path: "/club-tools", priority: 0.5, changefreq: "monthly" },
  { path: "/selftest", priority: 0.3, changefreq: "monthly" },
  { path: "/ne-about", priority: 0.6, changefreq: "monthly" },
  { path: "/vendor/paws-nepal", priority: 0.6, changefreq: "monthly" },
];

const CLUB_PAGES = CLUB_SLUGS.map((slug) => ({
  path: `/${slug}`,
  priority: 0.8,
  changefreq: "weekly",
}));

function esc(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function urlEntry(loc, lastmod, priority, changefreq) {
  return [
    "  <url>",
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}

async function fetchFromSupabase(table, select) {
  const rows = [];
  try {
    let offset = 0;
    const pageSize = 1000;
    for (;;) {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/${table}?select=${select}&limit=${pageSize}&offset=${offset}`,
        { headers: HEADERS }
      );
      if (!res.ok) return rows;
      const page = await res.json();
      rows.push(...page);
      if (page.length < pageSize) break;
      offset += pageSize;
    }
  } catch {
    return rows;
  }
  return rows;
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");

  const now = new Date().toISOString().slice(0, 10);

  const projects = await fetchFromSupabase("projects", "id,club_slug,updated");
  const guides = await fetchFromSupabase("guides", "id,updated");
  const events = await fetchFromSupabase("events", "updated");

  const projectEntries = [];
  for (const p of projects) {
    const slug = encodeURIComponent(p.club_slug);
    const id = encodeURIComponent(p.id);
    const lastmod = p.updated ? new Date(p.updated).toISOString().slice(0, 10) : now;
    projectEntries.push(
      urlEntry(`${SITE}/project?club=${slug}&id=${id}`, lastmod, 0.6, "monthly")
    );
  }

  const guideEntries = [];
  for (const g of guides) {
    const lastmod = g.updated ? new Date(g.updated).toISOString().slice(0, 10) : now;
    guideEntries.push(
      urlEntry(`${SITE}/guides#${encodeURIComponent(g.id)}`, lastmod, 0.6, "monthly")
    );
  }

  const eventEntries = [];
  for (const e of events) {
    const lastmod = e.updated ? new Date(e.updated).toISOString().slice(0, 10) : now;
    eventEntries.push(
      urlEntry(`${SITE}/#events`, lastmod, 0.5, "weekly")
    );
  }

  const allEntries = [
    ...STATIC_PAGES.map((p) => urlEntry(`${SITE}${p.path}`, now, p.priority, p.changefreq)),
    ...CLUB_PAGES.map((p) => urlEntry(`${SITE}${p.path}`, now, p.priority, p.changefreq)),
    ...projectEntries,
    ...guideEntries,
    ...eventEntries.slice(0, 1),
  ].slice(0, 50000);

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...allEntries,
    "</urlset>",
  ].join("\n");

  res.status(200).send(sitemap);
}
