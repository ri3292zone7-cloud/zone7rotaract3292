/*
 * Post-process the Shankharapur Pustak Pasal vendor island build so
 * asset URLs are percent-encoded (Vercel serves the "React JS" folder;
 * explicit %20 keeps every tool happy).
 * Run:  npm run build:vendor-shankharapur
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = resolve(root, 'dist-vendor-shankharapur', 'vendor-shankharapur.html');

const html = readFileSync(htmlPath, 'utf8');
const out = html.replaceAll('/React JS/', '/React%20JS/');
writeFileSync(htmlPath, out);
console.log('vendor-shankharapur.html asset URLs encoded → /React%20JS/dist-vendor-shankharapur/');