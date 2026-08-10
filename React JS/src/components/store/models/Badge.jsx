import { useMemo } from 'react';
import * as THREE from 'three';
import { useZone7Texture } from './zone7-texture';

/*
 * Zone 7 enamel badge — gold-rimmed disc with the emblem face,
 * a pin post and clutch on the back. Static: the showcase rig rotates it.
 */

export default function Badge({ color = '#E11A6E', accentDeep = '#A80F52' }) {
  const faceTex = useZone7Texture({ variant: 'emblem', size: 1024, accent: color, accentDeep });

  const gold = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#E8B93B',
        metalness: 0.95,
        roughness: 0.18,
        emissive: '#7A5A00',
        emissiveIntensity: 0.25,
        side: THREE.DoubleSide
      }),
    []
  );

  const dark = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#4A4238', metalness: 0.75, roughness: 0.4 }),
    []
  );

  return (
    <group>
      {/* enamel disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.05, 64]} />
        <meshStandardMaterial color="#F7F3EA" roughness={0.16} metalness={0.18} side={THREE.DoubleSide} />
      </mesh>
      {/* gold rim ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.012]}>
        <torusGeometry args={[0.62, 0.034, 16, 64]} />
        <mesh material={gold} />
      </mesh>
      {/* knurled gold edge band */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.636, 0.636, 0.05, 64, 1, true]} />
        <meshStandardMaterial color="#E8B93B" metalness={0.95} roughness={0.22} side={THREE.DoubleSide} />
      </mesh>
      {/* bevel — inner shadow ring so the face reads recessed */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.014]}>
        <torusGeometry args={[0.598, 0.012, 10, 64]} />
        <meshStandardMaterial color="#B98F1E" metalness={0.9} roughness={0.3} />
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
        <mesh material={dark} />
      </mesh>
      {/* clutch */}
      <mesh position={[0, 0, -0.1]}>
        <cylinderGeometry args={[0.05, 0.05, 0.022, 20]} />
        <meshStandardMaterial color="#6E675E" metalness={0.7} roughness={0.38} />
      </mesh>
      {/* clutch spring ring */}
      <mesh position={[0, 0, -0.089]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.045, 0.006, 8, 20]} />
        <meshStandardMaterial color="#8A837A" metalness={0.85} roughness={0.3} />
      </mesh>
    </group>
  );
}