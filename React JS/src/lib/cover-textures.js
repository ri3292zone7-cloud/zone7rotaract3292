function makeNoise(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = 128 + (Math.random() - 0.5) * 60;
    d[i] = v;
    d[i + 1] = v;
    d[i + 2] = v;
    d[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

function getCtx(c) {
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  return ctx;
}

/*
 * Layers a set of procedurally generated textures on top of the real cover
 * image: soft film grain, spine/edge creases, hinge shadow, vignette + corner
 * wear and a glossy sheen. Output is a brand-new canvas ready for a texture.
 */
export function composeCover(source) {
  const w = source.width;
  const h = source.height;
  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const ctx = getCtx(out);

  ctx.drawImage(source, 0, 0);

  // ── soft film grain ────────────────────────────────────────────
  const grain = makeNoise(Math.max(8, Math.floor(w / 3)), Math.max(8, Math.floor(h / 3)));
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = 0.32;
  ctx.drawImage(grain, 0, 0, w, h);
  ctx.globalAlpha = 1;

  // ── creases from handling / folding ────────────────────────────
  ctx.filter = 'blur(3px)';
  ctx.globalCompositeOperation = 'multiply';
  const crease = (x, y, ww, hh, a) => {
    ctx.globalAlpha = a;
    ctx.fillStyle = '#000';
    ctx.fillRect(x, y, ww, hh);
  };
  crease(Math.floor(w * 0.052), 0, Math.max(3, w * 0.012), h, 0.5);
  crease(Math.floor(w * 0.115), 0, 2, h, 0.3);
  crease(0, Math.floor(h * 0.155), w, 2, 0.24);
  crease(Math.floor(w * 0.84), Math.floor(h * 0.07), 2, Math.floor(h * 0.5), 0.16);
  crease(0, Math.floor(h * 0.93), Math.floor(w * 0.3), 2, 0.18);

  // ── hinge shadow along the spine ───────────────────────────────
  ctx.globalAlpha = 1;
  const spine = ctx.createLinearGradient(0, 0, w * 0.13, 0);
  spine.addColorStop(0, 'rgba(0,0,0,0.55)');
  spine.addColorStop(0.35, 'rgba(0,0,0,0.2)');
  spine.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = spine;
  ctx.fillRect(0, 0, w * 0.13, h);

  // ── edge vignette ──────────────────────────────────────────────
  const v = ctx.createRadialGradient(w * 0.5, h * 0.45, Math.min(w, h) * 0.4, w * 0.5, h * 0.5, Math.max(w, h) * 0.74);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(1, 'rgba(0,0,0,0.32)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, w, h);

  // ── worn corner (bottom-right handled most) ────────────────────
  const cg = ctx.createRadialGradient(w * 1.02, h * 1.04, 0, w * 1.02, h * 1.04, w * 0.44);
  cg.addColorStop(0, 'rgba(20, 14, 30, 0.42)');
  cg.addColorStop(1, 'rgba(20, 14, 30, 0)');
  ctx.fillStyle = cg;
  ctx.fillRect(0, 0, w, h);
  const cg2 = ctx.createRadialGradient(w * -0.02, h * -0.02, 0, w * -0.02, h * -0.02, w * 0.34);
  cg2.addColorStop(0, 'rgba(20, 14, 30, 0.34)');
  cg2.addColorStop(1, 'rgba(20, 14, 30, 0)');
  ctx.fillStyle = cg2;
  ctx.fillRect(0, 0, w, h);

  // ── glossy sheen (laminated cover highlight) ───────────────────
  ctx.filter = 'blur(6px)';
  ctx.globalCompositeOperation = 'screen';
  const sheen = ctx.createLinearGradient(0, 0, w, h);
  sheen.addColorStop(0, 'rgba(255,255,255,0)');
  sheen.addColorStop(0.3, 'rgba(255,255,255,0.1)');
  sheen.addColorStop(0.48, 'rgba(255,255,255,0.03)');
  sheen.addColorStop(0.62, 'rgba(255,255,255,0)');
  sheen.addColorStop(0.82, 'rgba(255,255,255,0.08)');
  sheen.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);

  ctx.filter = 'none';
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  return out;
}

/*
 * Grayscale height map: soft surface noise + indented creases and worn edges.
 * Used as the bump map (and as the base for the roughness map).
 */
export function makeSurfaceCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = getCtx(c);

  ctx.fillStyle = '#8f8f8f';
  ctx.fillRect(0, 0, w, h);

  const grain = makeNoise(Math.max(8, Math.floor(w / 4)), Math.max(8, Math.floor(h / 4)));
  ctx.globalAlpha = 0.85;
  ctx.filter = 'blur(2px)';
  ctx.drawImage(grain, 0, 0, w, h);
  ctx.globalAlpha = 1;

  ctx.filter = 'blur(3px)';
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(Math.floor(w * 0.05), 0, Math.max(3, w * 0.014), h);
  ctx.fillRect(Math.floor(w * 0.115), 0, 2, h);
  ctx.fillRect(0, Math.floor(h * 0.155), w, 2);

  const v = ctx.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.4, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
  v.addColorStop(0, 'rgba(90,90,90,0)');
  v.addColorStop(1, 'rgba(50,50,50,0.5)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, w, h);

  ctx.filter = 'none';
  ctx.globalAlpha = 1;
  return c;
}

/*
 * Roughness map: bright where the cover is worn smooth (spine, creases,
 * handled corners), mid where it is matte.
 */
export function makeRoughnessCanvas(heightCanvas) {
  const w = heightCanvas.width;
  const h = heightCanvas.height;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = getCtx(c);

  ctx.fillStyle = '#ababab';
  ctx.fillRect(0, 0, w, h);

  ctx.globalAlpha = 0.5;
  ctx.globalCompositeOperation = 'difference';
  ctx.drawImage(heightCanvas, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  return c;
}
