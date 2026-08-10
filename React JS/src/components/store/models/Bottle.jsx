import { useMemo } from 'react';
import * as THREE from 'three';
import { useZone7Texture } from './zone7-texture';

/*
 * Zone 7 double-walled steel bottle — lathe-profiled body (base, tapered
 * body, shoulder, neck), fluted screw cap, dark label band with the
 * emblem face, gold accent rings. Steel shows metalness, painted
 * variants show satin colour. Static: the rig rotates it.
 */

export default function Bottle({ color = '#9AA5B1' }) {
  const emblem = useZone7Texture({ variant: 'emblem', size: 512, accent: '#E11A6E', accentDeep: '#A80F52' });

  const profile = useMemo(
    () =>
      [
        [0.46, 0],
        [0.462, 0.02],
        [0.455, 0.1],
        [0.44, 0.3],
        [0.43, 0.62],
        [0.415, 0.85],
        [0.375, 1.02],
        [0.3, 1.14],
        [0.25, 1.2],
        [0.24, 1.3],
        [0.242, 1.42]
      ].map(([r, y]) => new THREE.Vector2(r, y)),
    []
  );

  const bodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        metalness: color === '#9AA5B1' ? 0.88 : 0.32,
        roughness: color === '#9AA5B1' ? 0.26 : 0.4,
        envMapIntensity: 1.1
      }),
    [color]
  );

  const steel = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#8d93a0', metalness: 0.9, roughness: 0.3 }),
    []
  );

  return (
    <group>
      {/* body */}
      <mesh>
        <latheGeometry args={[profile, 48]} />
        <mesh material={bodyMat} />
      </mesh>

      {/* base + neck accent rings (steel) */}
      <mesh position={[0, 0.015, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.455, 0.014, 10, 48]} />
        <mesh material={steel} />
      </mesh>
      <mesh position={[0, 1.185, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.305, 0.01, 10, 40]} />
        <mesh material={steel} />
      </mesh>

      {/* gold rings flanking the label band */}
      <mesh position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.436, 0.008, 8, 48]} />
        <meshStandardMaterial color="#F2A900" metalness={0.85} roughness={0.3} emissive="#F2A900" emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[0, 0.79, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.421, 0.008, 8, 48]} />
        <meshStandardMaterial color="#F2A900" metalness={0.85} roughness={0.3} emissive="#F2A900" emissiveIntensity={0.15} />
      </mesh>

      {/* label band */}
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.429, 0.429, 0.36, 48, 1, true]} />
        <meshStandardMaterial color="#17141F" roughness={0.5} metalness={0.15} />
      </mesh>
      {emblem && (
        <mesh position={[0, 0.62, 0.432]}>
          <circleGeometry args={[0.155, 40]} />
          <meshBasicMaterial map={emblem} toneMapped={false} transparent />
        </mesh>
      )}

      {/* threaded screw cap */}
      <mesh position={[0, 1.445, 0]}>
        <cylinderGeometry args={[0.268, 0.275, 0.1, 32]} />
        <meshStandardMaterial color="#27243A" roughness={0.42} metalness={0.35} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.276, 1.445, Math.sin(a) * 0.276]}>
            <boxGeometry args={[0.022, 0.096, 0.52]} />
            <meshStandardMaterial color="#171330" roughness={0.55} />
          </mesh>
        );
      })}
    </group>
  );
}