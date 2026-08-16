#!/usr/bin/env node
/* Local preview server that mimics Vercel: applies vercel.json rewrites,
   so pretty URLs like /vendor/shankharapur-pustak-pasal work locally
   exactly as they do in production. Run:  node serve-preview.mjs [port]  */
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)));
const PORT = Number(process.argv[2]) || 8900;
const { rewrites } = JSON.parse(await readFile(join(ROOT, 'vercel.json'), 'utf8'));

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.mp4': 'video/mp4', '.webm': 'video/webm'
};

function applyRewrite(pathname) {
  for (const { source, destination } of rewrites) {
    const wild = ':path*';
    if (source.endsWith(wild)) {
      const prefix = source.slice(0, -wild.length);
      if (pathname.startsWith(prefix)) {
        return decodeURIComponent(destination.replace(wild, pathname.slice(prefix.length)));
      }
    } else if (pathname === source) {
      return decodeURIComponent(destination);
    }
  }
  return null;
}

async function serve(res, rel, status = 200) {
  const abs = normalize(join(ROOT, rel));
  if (!abs.startsWith(ROOT) || !existsSync(abs) || !statSync(abs).isFile()) return false;
  const ext = extname(abs).toLowerCase();
  res.writeHead(status, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  res.end(await readFile(abs));
  return true;
}

const server = http.createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const target = applyRewrite(urlPath) || urlPath;
    let rel = target.startsWith('/') ? target.slice(1) : target;
    rel = rel.split('?')[0];
    if (rel === '' || rel.endsWith('/')) rel += 'index.html';
    if (!(await serve(res, rel))) {
      if (!(await serve(res, '404.html', 404))) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 — not found');
      }
    }
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('500 — ' + err.message);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Preview server (Vercel rewrites applied): http://127.0.0.1:${PORT}`);
});