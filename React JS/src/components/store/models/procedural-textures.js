import * as THREE from 'three';

/*
 * Procedural micro-texture for fabric/cloth — a soft grayscale grain used
 * as a bump map so surfaces read as woven/brushed under the studio light.
 * Generated once, cached, no network.
 */

let bumpCache = null;

export function getNoiseBumpTexture() {
  if (bumpCache) return bumpCache;
  const S = 256;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(S, S);
  const data = img.data;

  for (let i = 0; i < S * S; i++) {
    const v = 118 + Math.floor(Math.random() * 40);
    const o = i * 4;
    data[o] = data[o + 1] = data[o + 2] = v;
    data[o + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);

  // soften into a woven grain
  ctx.filter = 'blur(1.2px)';
  ctx.drawImage(c, 0, 0);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(7, 7);
  bumpCache = tex;
  return tex;
}
