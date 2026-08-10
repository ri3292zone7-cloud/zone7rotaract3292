import { useMemo } from 'react';
import * as THREE from 'three';
import { useZone7Texture } from './zone7-texture';

/*
 * Zone 7 enamel badge — gold-rimmed disc with the emblem face,
 * a pin post and clutch on the back. Static: the showcase rig rotates it.
 */

export default function Badge() {
  const faceTex = useZone7Texture({ variant: 'emblem', size: 1024 });

  const gold = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#E8B93B',
        metalness: 0.95,
        roughness: 0.22,
        side: THREE.DoubleSide
      }),
    []
  );

  return (
    <group>
      {/* enamel disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.05, 64]} />
        <meshStandardMaterial color="#F7F3EA" roughness={0.18} metalness={0.15} side={THREE.DoubleSide} />
      </mesh>
      {/* gold rim ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.012]}>
        <torusGeometry args={[0.62, 0.034, 16, 64]} />
        <mesh material={gold} />
      </mesh>
      {/* gold edge band */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.636, 0.636, 0.05, 64, 1, true]} />
        <meshStandardMaterial color="#E8B93B" metalness={0.95} roughness={0.25} side={THREE.DoubleSide} />
      </mesh>
      {/* emblem face */}
      {faceTex && (
        <mesh position={[0, 0, 0.028]} rotation={[0, 0, 0]}>
          <circleGeometry args={[0.588, 64]} />
          <meshBasicMaterial map={faceTex} toneMapped={false} />
        </mesh>
      )}
      {/* pin post on the back */}
      <mesh position={[0, 0, -0.045]}>
        <cylinderGeometry args={[0.018, 0.018, 0.1, 16]} />
        <meshStandardMaterial color="#8A837A" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* clutch */}
      <mesh position={[0, 0, -0.1]}>
        <cylinderGeometry args={[0.045, 0.045, 0.02, 20]} />
        <meshStandardMaterial color="#6E675E" metalness={0.7} roughness={0.4} />
      </mesh>
    </group>
  );
}