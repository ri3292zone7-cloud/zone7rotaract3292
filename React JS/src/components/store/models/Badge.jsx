import { useMemo } from 'react';
import * as THREE from 'three';
import { useZone7Texture } from './zone7-texture';

/*
 * Zone 7 enamel badge — shallow domed face with a seamlessly projected
 * Zone 7 print (planar UVs, so no wrap seam ever slices the lettering),
 * a clear gloss shell floating over the crisp print, rope-twist gold
 * rim, inner bevel, and a slim round back plate with cross-form clutch
 * bars. Faces +Z. Static: the showcase rig rotates it.
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
        roughness: 0.05,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        envMapIntensity: 1.6,
        depthWrite: false
      }),
      backPlate: new THREE.MeshStandardMaterial({ color: '#4A4238', metalness: 0.75, roughness: 0.4 }),
      clutch: new THREE.MeshStandardMaterial({ color: '#6E675E', metalness: 0.7, roughness: 0.38 }),
      spring: new THREE.MeshStandardMaterial({ color: '#8A837A', metalness: 0.85, roughness: 0.3 })
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
      {/* gold cup behind the enamel */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.024]} material={mats.gold}>
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

      {/* rope-twist gold rim + inner bevel */}
      <mesh geometry={ropeGeo} material={mats.gold} />
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.012]} material={mats.goldDeep}>
        <torusGeometry args={[0.582, 0.014, 10, 96]} />
      </mesh>

      {/* slim round back plate */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.06]} material={mats.backPlate}>
        <cylinderGeometry args={[0.52, 0.52, 0.02, 72]} />
      </mesh>

      {/* pin post */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.115]} material={mats.backPlate}>
        <cylinderGeometry args={[0.014, 0.014, 0.11, 16]} />
      </mesh>

      {/* cross-form clutch: barrel + two crossing bars + spring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.165]} material={mats.clutch}>
        <cylinderGeometry args={[0.03, 0.03, 0.05, 20]} />
      </mesh>
      {[Math.PI / 4, -Math.PI / 4].map((rz) => (
        <mesh key={rz} position={[0, 0, -0.165]} rotation={[0, 0, rz]} material={mats.clutch}>
          <boxGeometry args={[0.17, 0.028, 0.014]} />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.148]} material={mats.spring}>
        <torusGeometry args={[0.038, 0.007, 8, 28]} />
      </mesh>
    </group>
  );
}
