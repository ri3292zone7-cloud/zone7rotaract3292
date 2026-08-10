/*
 * Deploy the magazine (merch) island build to the static root site.
 *
 * The root site serves merch-react.html from /merch-react.html and /merch.
 * The React island is built into dist-merch with base '/', so:
 *   1. every file under dist-merch/assets/ is copied to <repo>/assets/
 *      (bundle .js/.css plus runtime deps like the pdfjs worker),
 *   2. merch-react.html is rewritten to reference the new hashed names.
 *
 * Run:  npm run build:merch && node scripts/deploy-merch.mjs
 *       (or just:  npm run deploy:merch)
 */
import { cp, readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const reactDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(reactDir, '..');
const distAssets = join(reactDir, 'dist-merch', 'assets');
const rootAssets = join(repoRoot, 'assets');
const merchHtml = join(repoRoot, 'merch-react.html');

const files = await readdir(distAssets);
if (files.length === 0) {
  console.error('dist-merch/assets is empty — run `npm run build:merch` first.');
  process.exit(1);
}

await cp(distAssets, rootAssets, { recursive: true });
console.log('Copied to root assets/:');
for (const f of files) console.log('  ' + f);

let html = await readFile(merchHtml, 'utf8');
const before = html;
const jsFile = files.find((f) => f.endsWith('.js'));
const cssFile = files.find((f) => f.endsWith('.css'));
html = html.replace(/src="\/assets\/merch-standalone-[^"]+\.js"/, `src="/assets/${jsFile}"`);
html = html.replace(/href="\/assets\/merch-standalone-[^"]+\.css"/, `href="/assets/${cssFile}"`);
if (html === before) {
  console.warn('merch-react.html did not change — refs already up to date?');
} else {
  await writeFile(merchHtml, html);
  console.log('Updated merch-react.html →');
  console.log('  /assets/' + jsFile);
  console.log('  /assets/' + cssFile);
}
