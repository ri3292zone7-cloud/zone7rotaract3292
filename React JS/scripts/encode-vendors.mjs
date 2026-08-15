/*
 * Post-process the Support Local vendors landing build so asset URLs
 * are percent-encoded (Vercel serves the "React JS" folder; explicit
 * %20 keeps every tool happy).
 * Run:  npm run build:vendors
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = resolve(root, 'dist-vendors', 'vendors-react.html');

const html = readFileSync(htmlPath, 'utf8');
const out = html.replaceAll('/React JS/', '/React%20JS/');
writeFileSync(htmlPath, out);
console.log('vendors-react.html asset URLs encoded → /React%20JS/dist-vendors/');