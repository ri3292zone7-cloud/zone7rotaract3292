import { useEffect, useState } from 'react';
import pageCss from './selftest.css?inline';

const TARGETS = [
  { label: "404.html", src: "/404", v: { w: 1360, h: 900 } },
  { label: "404.html", src: "/404", v: { w: 390, h: 844 } },
  { label: "project.html?club=sukedhara&id=sukedhara-library-2025", src: "/project?club=sukedhara&id=sukedhara-library-2025", v: { w: 390, h: 844 } },
  { label: "club-tools.html", src: "/club-tools", v: { w: 390, h: 844 } },
  { label: "gallery.html", src: "/gallery", v: { w: 1360, h: 900 } }
];

export default function SelftestPage() {
  const [out, setOut] = useState('running…');

  useEffect(() => {
    document.title = 'selftest-overflow';
    const el = document.createElement('style');
    el.setAttribute('data-page-css', 'true');
    el.textContent = pageCss;
    document.head.appendChild(el);
    let alive = true;

    (async () => {
      const results = [];
      for (const t of TARGETS) {
        const ifr = document.createElement('iframe');
        ifr.style.width = t.v.w + 'px';
        ifr.style.height = t.v.h + 'px';
        ifr.style.border = '0';
        document.body.appendChild(ifr);
        await new Promise((res) => {
          ifr.onload = () => setTimeout(() => {
            try {
              const d = ifr.contentDocument;
              const e = d.documentElement;
              const lines = [];
              lines.push(`== ${t.label} @ ${t.v.w}x${t.v.h} | scrollW=${e.scrollWidth} clientW=${e.clientWidth}`);
              const all = d.querySelectorAll('*');
              for (const el2 of all) {
                const r = el2.getBoundingClientRect();
                if (r.right > e.clientWidth + 2) {
                  const cls = (el2.className && el2.className.toString ? el2.className.toString() : '').slice(0, 60);
                  lines.push(`  OVER <${el2.tagName.toLowerCase()} class="${cls}" id="${el2.id || ''}"> right=${Math.round(r.right)}`);
                }
                if (r.left < -2) {
                  const cls = (el2.className && el2.className.toString ? el2.className.toString() : '').slice(0, 60);
                  lines.push(`  UNDER <${el2.tagName.toLowerCase()} class="${cls}" id="${el2.id || ''}"> left=${Math.round(r.left)}`);
                }
              }
              const brokenImgs = Array.from(d.images).filter((i) => i.getAttribute('src') && i.getAttribute('src').endsWith('gallery.html')).map((i) => {
                const p = i.parentElement;
                return '<' + (p ? p.tagName : '') + ' class=' + (p && p.className ? p.className : '') + ' src=' + i.getAttribute('src') + '>';
              });
              const backEl = d.querySelector('#siteNav .back');
              if (backEl) lines.push(`  .back display=${getComputedStyle(backEl).display}`);
              lines.push(`  gallerySrcImgs: ${JSON.stringify(brokenImgs.slice(0, 2))}`);
              results.push(lines.join('\n'));
            } catch (e) {
              results.push(`[ERR] ${e.message}`);
            }
            ifr.remove();
            res();
          }, 3000);
          ifr.src = t.src;
        });
        if (!alive) return;
        setOut(results.join('\n\n'));
      }
      if (alive) setOut(results.join('\n\n') + '\n\nDONE');
    })();

    return () => {
      alive = false;
      document.querySelectorAll('iframe').forEach((f) => f.remove());
      el.remove();
    };
  }, []);

  return (
    <div>
      <pre id="out">{out}</pre>
    </div>
  );
}
