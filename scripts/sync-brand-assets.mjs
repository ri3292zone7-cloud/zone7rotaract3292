import fs from 'node:fs';
import path from 'node:path';
const base = "https://library.rsamdio.org";
const outDir = "media/brand-assets/rsamdio";
const dataPath = "data/brand-assets.json";

const brandAssets = [
  // Rotaract Visual Identity Kit
  { title:"Rotaract Cranberry", file:"Rotaract-R_CMYK-C.png", cat:"Rotaract" },
  { title:"Rotaract Black", file:"rotaract_black.png", cat:"Rotaract" },
  { title:"Rotaract White", file:"Rotaract-R_REV.png", cat:"Rotaract" },
  { title:"Rotaract Cranberry Simplified", file:"rotaract_simple.png", cat:"Rotaract" },
  { title:"Rotaract Black Simplified", file:"Rotaract-Simple_Black.png", cat:"Rotaract" },
  { title:"Rotaract White Simplified", file:"rotaract_simple_white.png", cat:"Rotaract" },
  // Rotary Visual Identity Kit
  { title:"Rotary Standard", file:"rotary.png", cat:"Rotary" },
  { title:"Rotary Black", file:"rotary_black.png", cat:"Rotary" },
  { title:"Rotaract White", file:"rotary_white.png", cat:"Rotary" }, // duplicate name but rotary white
  { title:"Rotary White Gold", file:"rotary_white_gold.png", cat:"Rotary" },
  { title:"Rotary Azure", file:"rotary_azure.png", cat:"Rotary" },
  { title:"Rotary Simplified", file:"rotary_simple.png", cat:"Rotary" },
  { title:"Rotary Black Simplified", file:"rotary_simple_black.png", cat:"Rotary" },
  { title:"Rotary White Simplified", file:"rotary_simple_white.png", cat:"Rotary" },
  { title:"Rotary While Gold Simplified", file:"rotary_simple_white_gold.png", cat:"Rotary" },
  { title:"Rotary Azure Simplified", file:"rotary_simple_azure.png", cat:"Rotary" },
  { title:"Rotary Mark of Excellence", file:"markofexcellence.png", cat:"Rotary" },
  { title:"Rotary Mark of Excellence Black", file:"markofexcellence_black.png", cat:"Rotary" },
  { title:"Rotary Mark of Excellence White", file:"markofexcellence_white.png", cat:"Rotary" },
  { title:"Rotary Mark of Excellence Azure", file:"markofexcellence_azure.png", cat:"Rotary" },
  // CMYK
  { title:"Rotaract Cranberry CMYK", file:"Rotaract-R_CMYK-C.png", cat:"CMYK" },
  { title:"Rotary Standard CMYK", file:"RotaryMBS-R_CMYK-C.png", cat:"CMYK" },
];

fs.mkdirSync(outDir, { recursive:true });
fs.mkdirSync(path.dirname(dataPath), { recursive:true });

let done = 0;
for (const a of brandAssets) {
  const url = `${base}/resources/${encodeURIComponent(a.file)}`;
  const dest = path.join(outDir, a.file);
  if (fs.existsSync(dest)) { console.log(`exists ${a.file}`); done++; continue; }
  try {
    const r = await fetch(url);
    if (!r.ok) { console.log(`fail ${a.file}: ${r.status}`); continue; }
    const buf = Buffer.from(await r.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`downloaded ${a.file} (${buf.length})`);
    done++;
  } catch(e){ console.log(`error ${a.file}: ${e.message}`); }
}
const json = brandAssets.map(a=> ({
  id: a.file.replace(/[^a-z0-9]/gi,'_').toLowerCase(),
  title: a.title,
  file: `${outDir}/${a.file}`,
  fileName: a.file,
  category: a.cat,
  source: "RSAMDIO Library",
  sourceUrl: `${base}/rotaract-brand-assets/`
}));
fs.writeFileSync(dataPath, JSON.stringify(json, null, 2));
console.log(`wrote ${dataPath} with ${json.length} entries, ${done} files present`);
