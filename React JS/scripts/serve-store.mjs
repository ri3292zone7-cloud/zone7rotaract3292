/*
 * Local preview server for the Zone 7 Store build (React JS/dist-store).
 * Mirrors the production rewrite: /store serves dist-store/store-standalone.html.
 * The server is rooted at the repo root so absolute asset URLs
 * (/React%20JS/dist-store/assets/...) resolve exactly like Vercel.
 *
 * Run:  npm run serve:store   →  http://localhost:8001/store
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, dirname, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PORT = Number(process.argv[2]) || 8001;

const REWRITES = {
  '/store': '/React JS/dist-store/store-standalone.html',
  '/store-react.html': '/React JS/dist-store/store-standalone.html',
  '/merch': '/React JS/dist-merch/merch-standalone.html',
  '/merch-react.html': '/React JS/dist-merch/merch-standalone.html',
  '/vendor/paws-nepal': '/React JS/dist-vendor-pawsnepal/vendor-pawsnepal.html'
};

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.json': 'application/json'
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const decoded = decodeURIComponent(url.pathname);
    let rel = REWRITES[decoded] || decoded;
    if (rel.endsWith('/')) rel += 'index.html';
    let file = normalize(resolve(repoRoot, '.' + rel));
    if (!file.startsWith(repoRoot)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    if (!extname(file)) {
      const alt = file + '.html';
      const hasAlt = await readFile(alt).then(() => true).catch(() => false);
      if (hasAlt) file = alt;
    }
    const data = await readFile(file);
    res.writeHead(200, {
      'Content-Type': MIME[extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 — not found</h1><p>File missing. Rebuild first: <code>npm run build:store</code></p>');
  }
});

server.listen(PORT, () => {
  console.log('Zone 7 island preview server running:');
  console.log(`  http://localhost:${PORT}/store`);
  console.log(`  http://localhost:${PORT}/merch`);
  console.log(`  http://localhost:${PORT}/vendor/paws-nepal`);
  console.log('(mirrors Vercel — /store → dist-store, /merch → dist-merch, /vendor/paws-nepal → dist-vendor-pawsnepal)');
  console.log('Press Ctrl+C to stop.');
});