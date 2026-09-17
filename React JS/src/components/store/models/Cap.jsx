import { useMemo } from 'react';
import * as THREE from 'three';
import { useZone7Texture } from './zone7-texture';
import { getNoiseBumpTexture } from './procedural-textures';

/*
 * Zone 7 six-panel snapback — structured crown with six raised gold
 * seams, metal eyelets, a domed embroidered crest patch up front,
 * curved two-tone brim (magenta over gold) with stitch rows, and a
 * snapback strap at the back. Navy wears full Zone 7 Rotaract theme;
 * black stays tone-on-tone. Static: the rig rotates it.
 */

const R = 0.62; // crown radius
const SY = 0.78; // crown squash (structured, slightly tall)
const THETA_MAX = Math.PI * 0.6; // crown opening
const SEAMS = 6;

const THEME = {
  seam: '#F2A900',
  eyelet: '#F2A900',
  button: '#F2A900',
  band: '#A80F52',
  binding: '#1B1836',
  brimTop: '#E11A6E',
  brimUnder: '#F2A900',
  stitch: '#FFD76A',
  strap: '#1B1836',
  snap: '#F2A900',
  emblemAccent: '#E11A6E',
  emblemDeep: '#A80F52'
};

const STEALTH = {
  seam: '#7A7390',
  eyelet: '#8f88a3',
  button: '#8f88a3',
  band: '#26222E',
  binding: '#14111C',
  brimTop: '#26222E',
  brimUnder: '#14111C',
  stitch: '#8f88a3',
  strap: '#1B1836',
  snap: '#B9B3C7',
  emblemAccent: '#57506B',
  emblemDeep: '#232030'
};

function surfPoint(a, theta, lift = 0) {
  const s = Math.sin(theta);
  const p = new THREE.Vector3(R * s * Math.cos(a), SY * R * Math.cos(theta), R * s * Math.sin(a));
  if (lift) {
    const n = new THREE.Vector3(p.x, p.y / (SY * SY), p.z).normalize();
    p.addScaledVector(n, lift);
  }
  return p;
}

/* bend a flat (XZ) ring downward toward the front + sides, like a worn brim */
function bendBrim(geo) {
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const t = Math.max(0, (z - 0.05) / 0.6);
    let y = pos.getY(i) - 0.17 * t * t;
    y -= 0.035 * Math.pow(Math.abs(x) / 0.56, 2);
    pos.setY(i, y);
  }
  geo.computeVertexNormals();
  return geo;
}

export default function Cap({ color = '#232A4E' }) {
  const t = color === '#17141F' ? STEALTH : THEME;
  const emblemTex = useZone7Texture({ variant: 'emblem', size: 512, accent: t.emblemAccent, accentDeep: t.emblemDeep });
  const bump = useMemo(() => getNoiseBumpTexture(), []);

  const cloth = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.78,
        metalness: 0.02,
        bumpMap: bump,
        bumpScale: 0.012,
        side: THREE.DoubleSide
      }),
    [color, bump]
  );

  const mats = useMemo(
    () => ({
      seam: new THREE.MeshStandardMaterial({ color: t.seam, roughness: 0.55, metalness: 0.15 }),
      gold: new THREE.MeshStandardMaterial({ color: t.eyelet, roughness: 0.3, metalness: 0.8 }),
      button: new THREE.MeshStandardMaterial({ color: t.button, roughness: 0.32, metalness: 0.75 }),
      band: new THREE.MeshStandardMaterial({ color: t.band, roughness: 0.8, side: THREE.DoubleSide }),
      binding: new THREE.MeshStandardMaterial({ color: t.binding, roughness: 0.65 }),
      brimTop: new THREE.MeshStandardMaterial({ color: t.brimTop, roughness: 0.72, side: THREE.DoubleSide }),
      brimUnder: new THREE.MeshStandardMaterial({ color: t.brimUnder, roughness: 0.7, side: THREE.DoubleSide }),
      stitch: new THREE.MeshBasicMaterial({ color: t.stitch }),
      strap: new THREE.MeshStandardMaterial({ color: t.strap, roughness: 0.75 }),
      snap: new THREE.MeshStandardMaterial({ color: t.snap, roughness: 0.3, metalness: 0.7 }),
      dark: new THREE.MeshStandardMaterial({ color: '#0E0C14', roughness: 0.9 }),
      inner: new THREE.MeshStandardMaterial({ color: '#14111C', roughness: 0.95, side: THREE.BackSide })
    }),
    [t]
  );

  /* six raised seam cords, hugging the crown from button to base */
  const seamGeos = useMemo(() => {
    const geos = [];
    for (let k = 0; k < SEAMS; k++) {
      const a = (k / SEAMS) * Math.PI * 2;
      const pts = [];
      for (let i = 0; i <= 11; i++) {
        const th = 0.1 + (THETA_MAX * 0.985 - 0.1) * (i / 11);
        pts.push(surfPoint(a, th, 0.002));
      }
      geos.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.006, 6, false));
    }
    return geos;
  }, []);

  /* six metal eyelets riding the crown surface between the seams */
  const eyelets = useMemo(() => {
    const out = [];
    for (let k = 0; k < SEAMS; k++) {
      const a = ((k + 0.5) / SEAMS) * Math.PI * 2;
      const th = 0.62;
      const p = surfPoint(a, th, 0.004);
      const n = new THREE.Vector3(p.x, p.y / (SY * SY), p.z).normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
      out.push({ p, q });
    }
    return out;
  }, []);

  /* curved brim + underbrim + two stitch rows, all sharing one bend */
  const brim = useMemo(() => {
    const top = bendBrim(new THREE.RingGeometry(0.14, 0.56, 64, 10, Math.PI, Math.PI).rotateX(-Math.PI / 2));
    const under = bendBrim(new THREE.RingGeometry(0.14, 0.555, 64, 4, Math.PI, Math.PI).rotateX(-Math.PI / 2));
    under.translate(0, -0.014, 0);
    const rows = [0.4, 0.475].map((r) => {
      const g = bendBrim(new THREE.RingGeometry(r - 0.004, r + 0.004, 64, 1, Math.PI, Math.PI).rotateX(-Math.PI / 2));
      g.translate(0, 0.004, 0);
      return g;
    });
    return { top, under, rows };
  }, []);

  return (
    <group>
      <group scale={[1, SY, 1]}>
        {/* crown */}
        <mesh material={cloth}>
          <sphereGeometry args={[R, 64, 32, 0, Math.PI * 2, 0, THETA_MAX]} />
        </mesh>
        {/* finished inner shell */}
        <mesh material={mats.inner}>
          <sphereGeometry args={[R - 0.015, 48, 24, 0, Math.PI * 2, 0, THETA_MAX]} />
        </mesh>
        {/* domed embroidered crest — hugs the crown, full Zone 7 mark */}
        {emblemTex && (
          <mesh>
            <sphereGeometry args={[R + 0.014, 64, 24, Math.PI / 2 - 0.31, 0.62, 0.92, 0.52]} />
            <meshStandardMaterial
              map={emblemTex}
              transparent
              alphaTest={0.35}
              roughness={0.55}
              metalness={0.15}
            />
          </mesh>
        )}
      </group>

      {/* raised panel seams */}
      {seamGeos.map((g, i) => (
        <mesh key={i} geometry={g} material={mats.seam} />
      ))}

      {/* eyelets */}
      {eyelets.map((e, i) => (
        <mesh key={i} position={e.p} quaternion={e.q} material={mats.gold}>
          <torusGeometry args={[0.026, 0.009, 8, 20]} />
        </mesh>
      ))}

      {/* top button */}
      <mesh position={[0, SY * R + 0.012, 0]} material={mats.button}>
        <sphereGeometry args={[0.05, 20, 14]} />
      </mesh>

      {/* sweatband tape + bottom binding */}
      <mesh position={[0, -0.095, 0]} material={mats.band}>
        <cylinderGeometry args={[0.612, 0.612, 0.1, 48, 1, true]} />
      </mesh>
      <mesh position={[0, -0.148, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.binding}>
        <torusGeometry args={[0.59, 0.018, 10, 64]} />
      </mesh>

      {/* curved two-tone brim */}
      <group position={[0, -0.07, 0.16]}>
        <mesh geometry={brim.top} material={mats.brimTop} />
        <mesh geometry={brim.under} material={mats.brimUnder} />
        {brim.rows.map((g, i) => (
          <mesh key={i} geometry={g} material={mats.stitch} />
        ))}
      </group>

      {/* snapback: dark opening, strap, gold snaps */}
      <group position={[0, 0.07, -0.6]} rotation={[0.22, 0, 0]}>
        <mesh position={[0, 0.05, 0]} material={mats.dark}>
          <boxGeometry args={[0.26, 0.14, 0.06]} />
        </mesh>
        <mesh position={[0, -0.05, -0.028]} material={mats.strap}>
          <boxGeometry args={[0.22, 0.055, 0.025]} />
        </mesh>
        {[-0.075, -0.045, -0.015, 0.015, 0.045, 0.075].map((x) => (
          <mesh key={x} position={[x, -0.05, -0.043]} rotation={[Math.PI / 2, 0, 0]} material={mats.snap}>
            <cylinderGeometry args={[0.012, 0.012, 0.01, 12]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
