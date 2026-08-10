import { useMemo } from 'react';
import { useGLTF, Decal } from '@react-three/drei';
import * as THREE from 'three';
import { useZone7Texture } from './zone7-texture';
import { getNoiseBumpTexture } from './procedural-textures';
import tshirtUrl from './tshirt.glb';

useGLTF.preload(tshirtUrl);

/*
 * The Zone 7 tee — high-quality draped t-shirt GLB (free asset, ~79KB),
 * tinted to the drop colour with the Z7 emblem decal on the chest and a
 * procedural woven-grain bump so the fabric reads real under the lights.
 * Size is normalised to a fixed height so the camera framing never shifts.
 */

export default function TShirtGLB({ color = '#17141F' }) {
  const { nodes, materials } = useGLTF(tshirtUrl);

  const emblem = useZone7Texture({ variant: 'emblem', size: 512 });
  const bump = useMemo(() => getNoiseBumpTexture(), []);

  const cloth = useMemo(() => {
    const m = materials.color.clone();
    m.color.set(color);
    m.roughness = 0.72;
    m.metalness = 0.02;
    m.bumpMap = bump;
    m.bumpScale = 0.02;
    m.envMapIntensity = 0.9;
    return m;
  }, [materials, color, bump]);

  const norm = useMemo(() => {
    const box = new THREE.Box3().setFromObject(nodes.tshirt);
    const size = box.getSize(new THREE.Vector3());
    const s = 2.35 / size.y;
    return {
      s,
      y: -((box.max.y + box.min.y) / 2) * s + 0.3
    };
  }, [nodes]);

  return (
    <group scale={norm.s} position={[0, norm.y, 0]}>
      <mesh geometry={nodes.tshirt.geometry} material={cloth} dispose={null}>
        {emblem && <Decal position={[0, 0.08, 0.13]} rotation={[0, 0, 0]} scale={0.13} map={emblem} depthTest />}
      </mesh>
    </group>
  );
}
