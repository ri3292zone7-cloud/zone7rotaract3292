import { useMemo } from 'react';
import * as THREE from 'three';
import { useZone7Texture } from './zone7-texture';

/*
 * Zone 7 enamel badge — shallow domed face with a seamlessly projected
 * Zone 7 print (planar UVs, so no wrap seam ever slices the lettering),
 * a clear gloss shell floating over the crisp print, rope-twist gold
 * rim, inner bevel, and a slim round back plate. Clean medallion:
 * no pin post or clutch hardware. Faces +Z. Static: the showcase
 * rig rotates it.
 */

const DOME_R = 1.7; // gentle dome sphere radius
const DOME_TH = 0.36; // dome angular extent (footprint r ≈ 0.60)
const FACE_R = DOME_R * Math.sin(DOME_TH);

/* flat ring bent onto the dome — planar UVs, so the print never distorts */
function bentFace(radius, zoff) {
  const g = new THREE.RingGeometry(0.001, radius, 96, 28);
  const pos = g.attributes.position;
  const base = DOME_R * Math.cos(DOME_TH);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const q = Math.max(DOME_R * DOME_R - x * x - y * y, 0);
    pos.setZ(i, Math.sqrt(q) - base + zoff);
  }
  g.computeVertexNormals();
  return g;
}

export default function Badge({ color = '#E11A6E', accentDeep = '#A80F52' }) {
  const faceTex = useZone7Texture({ variant: 'emblem', size: 2048, accent: color, accentDeep });

  const mats = useMemo(
    () => ({
      gold: new THREE.MeshStandardMaterial({
        color: '#E8B93B',
        metalness: 0.95,
        roughness: 0.18,
        emissive: '#7A5A00',
        emissiveIntensity: 0.25,
        side: THREE.DoubleSide
      }),
      goldDeep: new THREE.MeshStandardMaterial({ color: '#B98F1E', metalness: 0.9, roughness: 0.3 }),
      underlay: new THREE.MeshStandardMaterial({ color: accentDeep, roughness: 0.5, metalness: 0.2 }),
      gloss: new THREE.MeshPhysicalMaterial({
        color: '#FFFFFF',
        transparent: true,
        opacity: 0.1,
        roughness: 0.32,
        metalness: 0,
        clearcoat: 0.6,
        clearcoatRoughness: 0.35,
        envMapIntensity: 0.7,
        depthWrite: false
      }),
      backPlate: new THREE.MeshStandardMaterial({ color: '#4A4238', metalness: 0.25, roughness: 0.75 }),
      cupBack: new THREE.MeshStandardMaterial({ color: '#33291F', metalness: 0.15, roughness: 0.85 })
    }),
    [accentDeep]
  );

  /* print + safety underlay + gloss shell, all riding the same dome */
  const layers = useMemo(
    () => ({
      under: bentFace(FACE_R, 0.02),
      print: bentFace(FACE_R, 0.026),
      gloss: bentFace(FACE_R, 0.032)
    }),
    []
  );

  /* rope-twist rim: helical wave around the ring = twisted rope look */
  const ropeGeo = useMemo(() => {
    const pts = [];
    const N = 160;
    const TWISTS = 26;
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI * 2;
      const r = 0.615 + 0.009 * Math.sin(TWISTS * a);
      pts.push(new THREE.Vector3(r * Math.cos(a), r * Math.sin(a), 0.009 * Math.cos(TWISTS * a)));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 420, 0.026, 10, true);
  }, []);

  return (
    <group>
      {/* gold cup behind the enamel — rough dark back cap so the studio
          softboxes can't mirror-streak across the back face */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.024]} material={[mats.gold, mats.gold, mats.cupBack]}>
        <cylinderGeometry args={[0.615, 0.6, 0.052, 96]} />
      </mesh>

      {/* crisp print, safety underlay, gloss shell */}
      <mesh geometry={layers.under} material={mats.underlay} />
      {faceTex && (
        <mesh geometry={layers.print}>
          <meshBasicMaterial map={faceTex} transparent alphaTest={0.35} toneMapped={false} />
        </mesh>
      )}
      <mesh geometry={layers.gloss} material={mats.gloss} />

      {/* rope-twist gold rim + inner bevel (both lie flat, facing +Z) */}
      <mesh geometry={ropeGeo} material={mats.gold} />
      <mesh position={[0, 0, 0.012]} material={mats.goldDeep}>
        <torusGeometry args={[0.582, 0.014, 10, 96]} />
      </mesh>

      {/* slim round back plate — closes the medallion; held 0.018 behind
          the gold cup so the two faces never z-fight */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.078]} material={mats.backPlate}>
        <cylinderGeometry args={[0.52, 0.52, 0.02, 72]} />
      </mesh>
    </group>
  );
}
