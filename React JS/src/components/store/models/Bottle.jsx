import { useMemo } from 'react';
import * as THREE from 'three';
import { useZone7Texture } from './zone7-texture';

/*
 * Zone 7 vacuum flask — dense lathe-profiled body (128 segments,
 * spline-smoothed), powder-coat clearcoat physical material, wraparound
 * label band with a curved Zone 7 crest, gold pinstripes, volume ticks,
 * silicone base boot, steel neck ring, ribbed screw cap with a domed top
 * and a silicone carry loop. Steel colourway reads brushed metal;
 * magenta reads satin powder-coat. Static: the rig rotates it.
 */

const BAND_Y = 0.58;
const BAND_H = 0.34;

export default function Bottle({ color = '#9AA5B1' }) {
  const emblem = useZone7Texture({ variant: 'emblem', size: 1024, accent: '#E11A6E', accentDeep: '#A80F52' });
  const isSteel = color === '#9AA5B1';

  /* spline-smoothed body profile → high-poly lathe */
  const bodyGeo = useMemo(() => {
    const raw = [
      [0.02, 0.06],
      [0.3, 0.06],
      [0.42, 0.075],
      [0.455, 0.13],
      [0.46, 0.28],
      [0.452, 0.52],
      [0.442, 0.74],
      [0.428, 0.92],
      [0.398, 1.04],
      [0.348, 1.13],
      [0.29, 1.2],
      [0.256, 1.25],
      [0.25, 1.32]
    ].map(([r, y]) => new THREE.Vector2(r, y));
    const pts = new THREE.SplineCurve(raw).getPoints(120);
    const g = new THREE.LatheGeometry(pts, 128);
    g.computeVertexNormals();
    return g;
  }, []);

  const bodyMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color,
        metalness: isSteel ? 0.9 : 0.25,
        roughness: isSteel ? 0.27 : 0.38,
        clearcoat: isSteel ? 0.25 : 0.6,
        clearcoatRoughness: 0.25,
        envMapIntensity: 1.25
      }),
    [color, isSteel]
  );

  const mats = useMemo(
    () => ({
      steel: new THREE.MeshStandardMaterial({ color: '#9AA5B1', metalness: 0.92, roughness: 0.28, envMapIntensity: 1.2 }),
      darkSteel: new THREE.MeshStandardMaterial({ color: '#3A3F4B', metalness: 0.85, roughness: 0.4 }),
      silicone: new THREE.MeshStandardMaterial({ color: '#1B1836', roughness: 0.9, metalness: 0.0 }),
      band: new THREE.MeshStandardMaterial({ color: '#17141F', roughness: 0.45, metalness: 0.2, side: THREE.DoubleSide }),
      cap: new THREE.MeshStandardMaterial({ color: '#27243A', roughness: 0.42, metalness: 0.35 }),
      capRib: new THREE.MeshStandardMaterial({ color: '#171330', roughness: 0.55, metalness: 0.2 }),
      tick: new THREE.MeshBasicMaterial({ color: '#FFFFFF', transparent: true, opacity: 0.55 })
    }),
    []
  );

  /* volume ticks on the back, hugging the body taper */
  const ticks = useMemo(
    () =>
      [
        { y: 0.2, r: 0.459 },
        { y: 0.27, r: 0.46 },
        { y: 0.34, r: 0.458 },
        { y: 0.84, r: 0.434 },
        { y: 0.9, r: 0.43 }
      ].map(({ y, r }) => ({ y, z: -r - 0.002 })),
    []
  );

  /* tall-shelf stretch: height only, footprint untouched. The crest
     patch counter-squashes so the emblem stays perfectly round. */
  const TALL = 1.18;

  return (
    <group scale={[1, TALL, 1]}>
      {/* body */}
      <mesh geometry={bodyGeo} material={bodyMat} />

      {/* silicone base boot */}
      <mesh position={[0, 0.045, 0]} material={mats.silicone}>
        <cylinderGeometry args={[0.462, 0.448, 0.09, 96]} />
      </mesh>
      <mesh position={[0, 0.092, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.darkSteel}>
        <torusGeometry args={[0.455, 0.012, 10, 96]} />
      </mesh>

      {/* wraparound label band */}
      <mesh position={[0, BAND_Y, 0]} material={mats.band}>
        <cylinderGeometry args={[0.457, 0.457, BAND_H, 96, 1, true]} />
      </mesh>
      {/* curved crest on the band — hugs the cylinder, full Zone 7 mark */}
      {emblem && (
        <mesh position={[0, BAND_Y, 0]} scale={[1, 1 / TALL, 1]}>
          <cylinderGeometry args={[0.463, 0.463, 0.3, 48, 1, true, -0.325, 0.65]} />
          <meshStandardMaterial map={emblem} transparent alphaTest={0.35} roughness={0.4} metalness={0.2} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* volume ticks (back) */}
      {ticks.map((tk, i) => (
        <mesh key={i} position={[i % 2 ? 0.03 : -0.03, tk.y, tk.z]} material={mats.tick}>
          <boxGeometry args={[i % 2 ? 0.05 : 0.09, 0.008, 0.004]} />
        </mesh>
      ))}

      {/* steel neck ring */}
      <mesh position={[0, 1.245, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.steel}>
        <torusGeometry args={[0.252, 0.012, 10, 72]} />
      </mesh>

      {/* ribbed screw cap */}
      <mesh position={[0, 1.385, 0]} material={mats.cap}>
        <cylinderGeometry args={[0.27, 0.278, 0.16, 96]} />
      </mesh>
      {Array.from({ length: 36 }).map((_, i) => {
        const a = (i / 36) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.277, 1.385, Math.sin(a) * 0.277]} rotation={[0, Math.PI / 2 - a, 0]} material={mats.capRib}>
            <boxGeometry args={[0.02, 0.15, 0.014]} />
          </mesh>
        );
      })}
      {/* shallow domed cap top, rim flush with the cap wall */}
      <mesh position={[0, 0.887, 0]} material={mats.cap}>
        <sphereGeometry args={[0.6375, 64, 8, 0, Math.PI * 2, 0, 0.436]} />
      </mesh>

      {/* silicone carry loop on pivot nubs — arches over the dome */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.272, 1.42, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.silicone}>
          <cylinderGeometry args={[0.022, 0.022, 0.03, 16]} />
        </mesh>
      ))}
      <mesh position={[0, 1.42, 0]} material={mats.silicone}>
        <torusGeometry args={[0.28, 0.026, 14, 64, 0, Math.PI]} />
      </mesh>
    </group>
  );
}
