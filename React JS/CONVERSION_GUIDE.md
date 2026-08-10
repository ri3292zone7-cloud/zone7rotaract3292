# Zone 7 React Conversion Guide

You are converting static HTML pages of the Zone 7 Rotaract website into React components
inside the `React JS` Vite app. The original HTML files must NOT be modified. Everything you
produce lives under `React JS/src/pages/`.

## Working directories

- SOURCE HTML: `D:\6) Obsidian\Rotaract Zone 7\Website\zone7rotaract3292-main\zone7rotaract3292-main\`
  (e.g. `about.html`, `guides.html`, `tutorial-blood.html`, …)
- WRITE TO: `D:\6) Obsidian\Rotaract Zone 7\Website\zone7rotaract3292-main\zone7rotaract3292-main\React JS\src\pages\`
- Static assets (already copied to `public/`): `/images/…`, `/logos/…`, `/team/…`,
  `/ai-images/…`, `/guides/…`, `/icons/…`, `/favicon.png`, `/rotaract-logo.png`,
  `/zone7_logos.png`, `/zone7_join_hero.webp`, `/zone7_og_image.png`, `/zone7_cover.jpg`
- Shared data (ES module): `../../data/zone7-data` — exports `ZONE7_DB`, `CLUB_DIRECTORY`,
  `CLUB_LETTERHEAD`, `CLUB_CREDENTIALS`, `ZONAL_PASSWORD`, `UNIVERSITY_CLUBS`,
  `BAROMETER_*`, `zone7*` helper functions. Import like:
  `import { ZONE7_DB, CLUB_DIRECTORY } from '../data/zone7-data';`
- Available npm packages: `react`, `react-router-dom`, `gsap`, `chart.js`, `jspdf`,
  `lucide-react`, `three`, `page-flip`, `pdfjs-dist`.

## Per-page file structure

For each converted page you create **two files** in `src/pages/`:

1. `<Name>.jsx` — the React component.
2. `<name>.css` — the page's stylesheet.

### 1. CSS file

Copy the ENTIRE `<style>…</style>` content from the source HTML **verbatim** into `<name>.css`.
Do not edit selectors, values, or media queries. (The base tokens, resets and `.wrap`
duplicate the app's globals harmlessly.)

### 2. Component file

```jsx
import SiteShell from '../components/layout/SiteShell';
import pageCss from './about.css?inline';

export default function AboutPage() {
  return (
    <SiteShell
      current="about"          // from the source page's <div id="siteNav" data-current="…">
      cta="join"               // from data-cta (one of join | home | club)
      title="About Zone 7 | Rotaract District 3292 Nepal-Bhutan"   // from <title>, drop the site suffix duplication if long
      css={pageCss}
    >
      …your page JSX (only the <body> content, wrapped in a fragment)…
    </SiteShell>
  );
}
```

`SiteShell` already provides: the classic sticky nav, footer, back-to-top button, RotaGPT
chat widget, page title, per-page CSS injection (removed on unmount), and fade-in.

## HTML → JSX conversion rules

- Remove all of: `<!DOCTYPE>`, `<html>`, `<head>` contents (meta, fonts, favicon, the
  `<script src="zone7-data.js">`, `<script src="site-nav.js">`, `<script src="rota-gpt…">`
  tags), `<body>` wrappers. Keep only the visible body content.
- The source page's `<div id="siteNav" data-current="…" data-cta="…"></div>` becomes the
  `current`/`cta` props above — do NOT render a nav inside the page.
- Attribute renames: `class`→`className`, `for`→`htmlFor`, `tabindex`→`tabIndex`,
  `autocomplete`→`autoComplete`, `readonly`→`readOnly`, `maxlength`→`maxLength`,
  `stroke-width`→`strokeWidth` (SVG camelCase), `aria-*` stays.
- Inline styles `style="…"` → `style={{ key: 'value', … }}` (camelCase keys; values quoted).
- Image/asset `src` / `href` that were relative (e.g. `images/foo.jpg`, `logos/x.jpg`,
  `ai images/y.png`, `guides/z.pdf`) become absolute: `/images/foo.jpg`, `/logos/x.jpg`,
  `/ai-images/y.png`, `/guides/z.pdf`.
- Internal links `<a href="about.html">` → `<Link to="/about">` (from `react-router-dom`).
- Hash links `<a href="#clubs">` → `<Link to="/#clubs">`.
- External links (http…, mailto:, tel:) stay plain `<a>` with `target="_blank" rel="noopener noreferrer"` where appropriate.
- Forms: add `onSubmit` handlers; inputs become controlled components
  (`value` + `onChange` + `useState`).
- Inline `<script>` logic becomes `useState`/`useEffect`/event handlers. Do NOT use
  `document.getElementById(...)` for new elements — use refs or state. `innerHTML`
  templating becomes JSX (or `dangerouslySetInnerHTML` only for trusted static HTML).
- The classic `site-nav.js` behaviors (dropdowns, mobile menu, skip link, back-to-top)
  are already handled by SiteShell/ClassicNav — do not reimplement.

## Route / link map

| HTML file | React route |
|---|---|
| `index.html` | `/` (already built — do not convert) |
| `about.html` | `/about` |
| `ne-about.html` | `/ne-about` |
| `join.html` | `/join` |
| `gallery.html` | `/gallery` |
| `district-overview.html` | `/district-overview` |
| `club.html?slug=X` | `/club/:slug` |
| `project.html?slug=X` | `/project` |
| `guides.html` | `/guides` |
| `club-guides.html` | `/club-guides` |
| `club-tools.html` | `/club-tools` |
| `handbook.html` | `/handbook` |
| `handbook-grants.html`, `handbook-health.html`, `handbook-newclub.html`, `handbook-projects.html`, `handbook-twinship.html` | `/handbook/:slug` (one `HandbookDetailPage`; read `useParams()` slug `grants|health|newclub|projects|twinship`) |
| `tutorials.html` | `/tutorials` |
| `tutorial-assembly.html`, `tutorial-blood.html`, `tutorial-board.html`, `tutorial-drr.html`, `tutorial-meetings.html`, `tutorial-zrr.html` | `/tutorial/:slug` (one `TutorialDetailPage`; slugs `assembly|blood|board|drr|meetings|zrr`) |
| `rkt-quiz.html` | `/quiz` |
| `admin.html` | `/admin` |
| `meetings.html` | `/meetings` |
| `selftest.html` | `/selftest` |
| `pending-applications.html` | `/pending-applications` |
| `merch.html` | `/merch` (now the **magazine React island** — see "Islands" below; `vercel.json` rewrites `/merch` → `merch-react.html`) |
| `404.html` | `*` fallback (already stubbed) |

**Do not edit `src/App.jsx`** — every route already exists and lazy-loads
`src/pages/<Name>.jsx` (default export). Your component file name must match exactly
(see table above: `AboutPage`, `NeAboutPage`, `JoinPage`, `GalleryPage`,
`DistrictOverviewPage`, `ClubPage`, `ProjectPage`, `GuidesPage`, `ClubGuidesPage`,
`ClubToolsPage`, `HandbookPage`, `HandbookDetailPage`, `TutorialsPage`,
`TutorialDetailPage`, `QuizPage`, `AdminPage`, `MeetingsPage`, `SelftestPage`,
`PendingApplicationsPage`, `NotFoundPage`).

For multi-slug pages (`HandbookDetailPage`, `TutorialDetailPage`): the source pages share
the same layout; convert each source page's CSS to `<slug>.css` files and import all of
them, then pick `css={…}` and content by slug. Content that differs only slightly between
pages can be unified with small data objects — keep ALL text content intact.

## Functional requirements

- Every link, button, form, filter, accordion, counter and chart that worked in the HTML
  must work in the React version.
- Charts: `import Chart from 'chart.js/auto';` then `new Chart(ctx, config)` inside
  `useEffect` with cleanup (`chart.destroy()`).
- PDF generation: `import { jsPDF } from 'jspdf';` (replaces the jspdf CDN `window.jspdf`).
- Supabase reads/writes go through `ZONE7_DB` (e.g. `await ZONE7_DB.getProjects(slug)`,
  `ZONE7_DB.getEvents()`, membership applications etc.). Do not call the REST endpoints
  directly.
- Keep the original design system (tokens `--ink/--magenta/--gold/--cream/--paper`,
  Poppins+Inter, `.wrap`, `.btn`, `.hlink` etc.). You MAY make tasteful improvements:
  scroll-reveal animations, hover micro-interactions, spacing polish — but never at the
  cost of functionality or readability.

## Store & magazine islands (exceptions to the rules above)

Two standalone React islands are deployed on the static site without touching the original
HTML pages. They are the ONLY places where the "Must NOT do" rules below are relaxed:

- **Store** (`/store`): `src/pages/StorePage.jsx`, `src/components/store/*`,
  `src/context/StoreCartProvider.jsx` (+ `store-cart-context.js`, `useStoreCart.js`),
  `src/data/merch-catalog.js`, `src/store-standalone.jsx`,
  `vite.store.config.js` → `dist-store/`, `scripts/encode-store.mjs`.
  Deploy: `npm run build:store` (output stays inside `dist-store/`, served by Vercel
  rewrite; the .js bundle is inlined into `dist-store/store-standalone.html`).
- **Magazine** (`/merch` + `/merch-react.html`): `src/pages/MerchPage.jsx`,
  `src/components/magazine/*` (CartDrawer renders on the island via `CartProvider`),
  `src/merch-standalone.jsx`, `vite.merch.config.js` → `dist-merch/`,
  `scripts/deploy-merch.mjs`. Deploy: `npm run deploy:merch` — builds with base
  `/assets/`, copies `dist-merch/assets/*` (bundle + pdfjs worker) into the repo-root
  `assets/`, and rewrites `merch-react.html` to the new hashed names. `dist-merch` is
  gitignored; the repo-root `assets/merch-standalone-*` files ARE committed.
- **Shared island data**: `src/data/store.js` (magazine cart products) and
  `src/data/merch-catalog.js` (store catalog) mirror each other — keep them in sync.
- `App.jsx` may be edited for the lazy `/store` route only.

## Must NOT do

- Never modify anything outside `React JS/src` (especially the original HTML/JS files),
  except via the island deploy scripts above (`scripts/*`, `vite.*.config.js`,
  repo-root `assets/`, `merch-react.html`).
- Never modify `App.jsx` (except the `/store` lazy route), `main.jsx`,
  `SiteShell.jsx`, `ClassicNav.jsx`, `ChatWidget.jsx`, `src/data/*` (except the island
  data files listed above), or `index.css`.
- Do not add new routes or new npm packages.
- Do not remove content, sections, or features from the source pages.

## Verification

After writing your pages, run from `React JS/`:

```
npm run lint
npm run build
```

Both must pass (existing `advancedChunks`/chunk-size warnings are acceptable). Fix any
errors and any lint warnings in YOUR files (the two `src/data/*.js` files are ignored).
Then report which pages you converted and any assumptions/deviations you made.
