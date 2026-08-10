import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';

/*
 * Zone 7 emblem factory — everything is drawn on a canvas, so the store
 * never depends on a single asset file. The real logo lockup is layered in
 * when it loads; a procedural "Z7" emblem always guarantees a clean mark.
 */

let logoLockupPromise = null;
function loadLogoLockup() {
  if (!logoLockupPromise) {
    logoLockupPromise = new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = '/zone7_logos.png';
      setTimeout(() => resolve(null), 4000);
    });
  }
  return logoLockupPromise;
}

const FONT = 'Poppins, Inter, Arial, sans-serif';

function centerText(ctx, text, y, font, fill) {
  ctx.font = font;
  ctx.fillStyle = fill;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, ctx.canvas.width / 2, y);
}

function arcText(ctx, text, radius, startAngle, endAngle, opts = {}) {
  const { font = '600 26px ' + FONT, fill = 'rgba(255,255,255,.85)' } = opts;
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = fill;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const cx = ctx.canvas.width / 2;
  const cy = ctx.canvas.height / 2;
  const step = (endAngle - startAngle) / Math.max(text.length, 1);
  text.split('').forEach((ch, i) => {
    const a = startAngle + step * (i + 0.5);
    ctx.save();
    ctx.translate(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
    ctx.rotate(a + Math.PI / 2);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  });
  ctx.restore();
}

function drawEmblem(ctx, opts) {
  const S = ctx.canvas.width;
  const cx = S / 2;
  const cy = S / 2;
  ctx.clearRect(0, 0, S, S);

  // gold rim
  const rim = ctx.createLinearGradient(0, 0, S, S);
  rim.addColorStop(0, '#FFD76A');
  rim.addColorStop(0.5, '#F2A900');
  rim.addColorStop(1, '#B97E00');
  ctx.beginPath();
  ctx.arc(cx, cy, S * 0.46, 0, Math.PI * 2);
  ctx.fillStyle = rim;
  ctx.fill();

  // enamel disc
  const disc = ctx.createLinearGradient(0, 0, S, S);
  disc.addColorStop(0, opts.accent || '#E11A6E');
  disc.addColorStop(1, opts.accentDeep || '#A80F52');
  ctx.beginPath();
  ctx.arc(cx, cy, S * 0.41, 0, Math.PI * 2);
  ctx.fillStyle = disc;
  ctx.fill();

  // inner ring
  ctx.beginPath();
  ctx.arc(cx, cy, S * 0.41, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,.35)';
  ctx.lineWidth = S * 0.012;
  ctx.stroke();

  // big 7
  const g = ctx.createLinearGradient(0, cy - S * 0.2, 0, cy + S * 0.2);
  g.addColorStop(0, '#FFFFFF');
  g.addColorStop(1, '#F2A900');
  centerText(ctx, '7', cy + S * 0.02, '800 ' + S * 0.44 + 'px ' + FONT, g);

  // arcs
  arcText(ctx, 'ROTARACT', S * 0.30, Math.PI * 0.94, Math.PI * 1.56, {});
  arcText(ctx, 'DISTRICT 3292', S * 0.30, Math.PI * 1.64, Math.PI * 2.1);
  arcText(ctx, 'ZONE SEVEN', S * 0.30, Math.PI * 0.06, Math.PI * 0.44, { fill: 'rgba(242,169,0,.95)' });

  if (opts.logo) {
    // lockup sits below the 7 when space allows (tee/chest variant)
    const lw = S * 0.52;
    const lh = lw * (opts.logo.height / opts.logo.width);
    ctx.drawImage(opts.logo, cx - lw / 2, cy + S * 0.2, lw, lh);
  }
}

function drawLockup(ctx, opts) {
  const S = ctx.canvas.width;
  const W = S * 2;
  const H = S;
  ctx.clearRect(0, 0, W, H);
  if (opts.logo) {
    const lw = H * 0.72;
    const lh = lw * (opts.logo.height / opts.logo.width);
    ctx.drawImage(opts.logo, W / 2 - lw / 2, H / 2 - lh / 2, lw, lh);
    return;
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = opts.fg || '#FFFFFF';
  ctx.font = '800 ' + H * 0.4 + 'px ' + FONT;
  ctx.fillText('ZONE 7', W / 2, H * 0.42);
  ctx.font = '600 ' + H * 0.15 + 'px ' + FONT;
  ctx.letterSpacing = '4px';
  ctx.fillStyle = opts.accent || '#F2A900';
  ctx.fillText('DISTRICT 3292 · NEPAL-BHUTAN', W / 2, H * 0.78);
}

function buildCanvas(opts) {
  const { variant = 'emblem', size = 512, accent, accentDeep, fg, logo } = opts;
  const c = document.createElement('canvas');
  if (variant === 'lockup') {
    c.width = size * 2;
    c.height = size;
  } else {
    c.width = size;
    c.height = size;
  }
  const ctx = c.getContext('2d');
  if (variant === 'lockup') drawLockup(ctx, { fg, accent, logo });
  else drawEmblem(ctx, { accent, accentDeep, logo });
  return c;
}

const canvasCache = new Map();

function canvasTextures(key, make) {
  if (canvasCache.has(key)) return canvasCache.get(key);
  const canvas = make();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  canvasCache.set(key, tex);
  return tex;
}

export function useZone7Texture({ variant = 'emblem', size = 512, accent, accentDeep, fg } = {}) {
  const [logo, setLogo] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    loadLogoLockup().then((img) => {
      if (alive) setLogo(img);
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  return useMemo(() => {
    if (!ready) return null;
    const key = [variant, size, accent, accentDeep, fg, logo ? 'png' : 'proc'].join('|');
    return canvasTextures(key, () =>
      buildCanvas({ variant, size, accent, accentDeep, fg, logo })
    );
  }, [variant, size, accent, accentDeep, fg, logo, ready]);
}