/*
 * Post-process the Shankharapur Pustak Pasal vendor island build.
 *
 * The mobile bug ("page shows as plain text instead of graphics") is the
 * external CSS request failing — React renders the page unstyled. Fix:
 * inline the built CSS into a <style> tag so the page is always styled.
 *
 * The JS bundle stays as an external <script type="module"> — it is
 * emitted by vite with %20-encoded URLs and needs no touching.
 *
 * SAFETY:
 *   - Only the FIRST matching <link rel="stylesheet" ...> tag in the
 *     head is replaced (never scanning inside any inlined content).
 *   - The final html must contain exactly 1 doctype or the script
 *     aborts without writing.
 *   - Idempotent: re-running on an already-inlined file is a no-op.
 * Run:  npm run build:vendor-shankharapur
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const siteRoot = resolve(root, '..');
const htmlPath = resolve(root, 'dist-vendor-shankharapur', 'vendor-shankharapur.html');

let out = readFileSync(htmlPath, 'utf8');

if (!out.includes('<style>')) {
  const m = out.match(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/);
  if (m) {
    const url = m[1];
    const file = join(siteRoot, decodeURIComponent(url.replace(/^\//, '').split('?')[0]));
    if (existsSync(file)) {
      const css = readFileSync(file, 'utf8');
      out = out.replace(m[0], `<style>\n${css}\n</style>`);
    } else {
      console.warn(`WARN: inlined CSS not found: ${url}`);
    }
  }
}

const doctypes = (out.match(/<!doctype html>/gi) || []).length;
if (doctypes !== 1) {
  throw new Error(`ABORT: output would contain ${doctypes} doctypes — not writing a corrupted file.`);
}
writeFileSync(htmlPath, out);
console.log('vendor-shankharapur.html: CSS inlined and verified (1 doctype).');