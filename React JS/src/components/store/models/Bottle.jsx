import { useMemo } from 'react';
import * as THREE from 'three';
import { useZone7Texture } from './zone7-texture';

/*
 * Zone 7 steel bottle — lathe-profiled body, painted body colour,
 * wrapped Z7 lockup label band and a matte lid.
 */

const BODY_LEN = 1.34;

function makeBottleGeometry() {
  const profile = [
    [0.07, 0],
    [0.1, 0.035],
    [0.115, 0.13],
    [0.125, 0.42],
    [0.12, 0.68],
    [0.108, 0.87],
    [0.09, 0.94],
    [0.052, 1.02],
    [0.032, 1.08],
    [0.02, 1.13],
    [0.014, 1.19]
  ].map(([x, y]) => new THREE.Vector2(x, y / BODY_LEN));
  return new THREE.LatheGeometry(profile, 56);
}

export default function Bottle({ color = '#9AA5B1' }) {
  const labelTex = useZone7Texture({ variant: 'lockup', size: 192, accent: '#F2A900', fg: '#FFFFFF' });

  const bodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.32,
        metalness: 0.62
      }),
    [color]
  );

  const geometry = useMemo(() => makeBottleGeometry(), []);

  return (
    <group scale={[1.55, 1.55, 1.55]}>
      {/* body */}
      <mesh geometry={geometry} material={bodyMat} />
      {/* Z7 label band */}
      {labelTex && (
        <mesh position={[0, 0.46, 0]}>
          <cylinderGeometry args={[0.128, 0.128, 0.17, 56, 1, true]} />
          <meshStandardMaterial
            map={labelTex}
            transparent
            alphaTest={0.4}
            color="#ffffff"
            roughness={0.35}
            metalness={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      {/* lid */}
      <mesh position={[0, 1.32, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.06, 24]} />
        <meshStandardMaterial color="#232A2F" roughness={0.45} metalness={0.3} />
      </mesh>
      {/* lid cap top */}
      <mesh position={[0, 1.355, 0]}>
        <cylinderGeometry args={[0.026, 0.026, 0.012, 24]} />
        <meshStandardMaterial color="#171D21" roughness={0.5} />
      </mesh>
      {/* gold base ring */}
      <mesh position={[0, 0.005, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.075, 0.008, 10, 40]} />
        <meshStandardMaterial color="#F2A900" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}