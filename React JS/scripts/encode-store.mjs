/*
 * Post-process the store build so asset URLs are percent-encoded
 * (Vercel serves the "React JS" folder; raw spaces in href/src work in
 * browsers but explicit %20 keeps every tool happy).
 * Run:  npm run build:store
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = resolve(root, 'dist-store', 'store-standalone.html');

const html = readFileSync(htmlPath, 'utf8');
const out = html.replaceAll('/React JS/', '/React%20JS/');
writeFileSync(htmlPath, out);
console.log('store-standalone.html asset URLs encoded → /React%20JS/dist-store/');