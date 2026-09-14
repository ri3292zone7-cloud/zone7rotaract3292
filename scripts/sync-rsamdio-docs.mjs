import fs from 'node:fs';
import path from 'node:path';
const outDir = "media/rsamdio-docs";
fs.mkdirSync(outDir, { recursive:true });
const list = JSON.parse(fs.readFileSync("data/rsamdio-documents.json","utf8"));
let ok=0;
for(const doc of list){
  const url = doc.file;
  if(url.includes("drive.google.com")){
    console.log(`skip drive ${doc.title}`);
    continue;
  }
  const fileName = url.split('/').pop().split('?')[0];
  const dest = path.join(outDir, fileName);
  if(fs.existsSync(dest)){ console.log(`exists ${fileName}`); doc.file = `${outDir}/${fileName}`; ok++; continue; }
  try{
    const r = await fetch(url);
    if(!r.ok){ console.log(`fail ${fileName}: ${r.status}`); continue; }
    const buf = Buffer.from(await r.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`downloaded ${fileName} (${buf.length})`);
    doc.file = `${outDir}/${fileName}`;
    ok++;
  }catch(e){ console.log(`error ${fileName}: ${e.message}`); }
}
fs.writeFileSync("data/rsamdio-documents.json", JSON.stringify(list,null,2));
console.log(`done ${ok}/${list.length} hosted locally`);
