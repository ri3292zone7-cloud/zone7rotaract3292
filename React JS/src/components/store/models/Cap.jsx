import { useMemo } from 'react';
import * as THREE from 'three';
import { useZone7Texture } from './zone7-texture';
import { getNoiseBumpTexture } from './procedural-textures';

/*
 * Zone 7 five-panel cap — domed crown, half-disc brim, button top,
 * embroidered-look emblem front and an adjustable strap at the back.
 * Static: the showcase rig rotates it.
 */

export default function Cap({ color = '#232A4E' }) {
  const emblemTex = useZone7Texture({ variant: 'emblem', size: 512, accent: '#E11A6E', accentDeep: '#A80F52' });
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

  const brimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: color === '#17141F' ? '#26222E' : color,
        roughness: 0.75,
        metalness: 0.05,
        side: THREE.DoubleSide
      }),
    [color]
  );

  return (
    <group>
      {/* crown — squashed hemisphere */}
      <mesh scale={[1, 0.72, 1]}>
        <sphereGeometry args={[0.62, 40, 18, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
        <mesh material={cloth} />
      </mesh>
      {/* button top */}
      <mesh position={[0, 0.62 * 0.72 + 0.04, 0]}>
        <sphereGeometry args={[0.045, 16, 12]} />
        <meshStandardMaterial color="#191622" roughness={0.5} />
      </mesh>
      {/* panel seams — five stitch lines over the crown */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[0, 0.24, 0]} rotation={[Math.PI / 2, 0, a]}>
            <torusGeometry args={[0.62, 0.004, 6, 48, Math.PI * 0.66]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.12} />
          </mesh>
        );
      })}
      {/* eyelets */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const a = (deg * Math.PI) / 180;
        return (
          <mesh key={deg} position={[Math.cos(a) * 0.42, 0.3, Math.sin(a) * 0.42]} rotation={[Math.PI / 2, 0, a + Math.PI / 2]}>
            <torusGeometry args={[0.028, 0.008, 8, 14]} />
            <meshStandardMaterial color="#1B1836" roughness={0.6} metalness={0.3} />
          </mesh>
        );
      })}
      {/* brim — flat half disc, forward */}
      <group position={[0, -0.03, 0.34]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, 0.03, 32, 1, true, -Math.PI / 2, Math.PI]} />
          <mesh material={brimMat} />
        </mesh>
        {/* brim rim */}
        <mesh position={[0, 0, 0.016]}>
          <torusGeometry args={[0.5, 0.013, 10, 40, Math.PI]} />
          <meshStandardMaterial color="#14111C" roughness={0.6} />
        </mesh>
        {/* brim edge stitching */}
        <mesh position={[0, 0, 0.012]}>
          <torusGeometry args={[0.47, 0.0035, 6, 40, Math.PI]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.18} />
        </mesh>
      </group>
      {/* embroidered emblem front */}
      {emblemTex && (
        <mesh position={[0, 0.24, 0.535]} rotation={[-0.42, 0, 0]}>
          <planeGeometry args={[0.34, 0.34]} />
          <meshStandardMaterial
            map={emblemTex}
            transparent
            alphaTest={0.35}
            roughness={0.6}
            metalness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      {/* back adjustment strap + slider buckle */}
      <group position={[0, 0.28, -0.56]} rotation={[0.32, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.16, 0.1, 0.015]} />
          <meshStandardMaterial color="#1B1836" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.045, -0.012]}>
          <boxGeometry args={[0.1, 0.026, 0.008]} />
          <meshStandardMaterial color="#14111C" roughness={0.5} metalness={0.4} />
        </mesh>
        <mesh position={[0, -0.06, 0]}>
          <boxGeometry args={[0.12, 0.035, 0.014]} />
          <meshStandardMaterial color="#2B2555" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.06, -0.01]}>
          <boxGeometry args={[0.1, 0.022, 0.01]} />
          <meshStandardMaterial color="#8f88a3" metalness={0.6} roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
}