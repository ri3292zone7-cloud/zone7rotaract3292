import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Orbs() {
  const g1 = useRef();
  const g2 = useRef();
  const g3 = useRef();
  const torus = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (g1.current) {
      g1.current.position.y = 1.0 + Math.sin(t * 0.9) * 0.55;
      g1.current.rotation.y += 0.003;
      g1.current.rotation.x += 0.0015;
    }
    if (g2.current) {
      g2.current.position.y = -0.6 + Math.cos(t * 0.8) * 0.45;
      g2.current.rotation.y -= 0.004;
    }
    if (g3.current) {
      g3.current.position.y = 2.2 + Math.sin(t * 1.1 + 1.2) * 0.35;
    }
    if (torus.current) torus.current.rotation.z += 0.0009;
  });
  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight color="#FFD6A0" intensity={0.9} position={[6, 8, 6]} />
      <pointLight color="#E11A6E" intensity={1.15} distance={30} position={[-6, 2, 4]} />
      <pointLight color="#F2A900" intensity={0.95} distance={26} position={[7, -2, 3]} />
      <mesh ref={g1} position={[-4.2, 1.0, -2.5]}>
        <icosahedronGeometry args={[1.35, 2]} />
        <meshStandardMaterial color="#FFF8EF" metalness={0.08} roughness={0.32} emissive="#E11A6E" emissiveIntensity={0.07} transparent opacity={0.92} />
      </mesh>
      <mesh ref={g2} position={[5.0, -0.6, -1.2]}>
        <icosahedronGeometry args={[1.05, 2]} />
        <meshStandardMaterial color="#FFD8E8" metalness={0.06} roughness={0.34} emissive="#F2A900" emissiveIntensity={0.06} transparent opacity={0.88} />
      </mesh>
      <mesh ref={g3} position={[2.4, 2.2, -3.2]}>
        <icosahedronGeometry args={[0.72, 1]} />
        <meshStandardMaterial color="#FFE8B8" metalness={0.07} roughness={0.3} transparent opacity={0.82} />
      </mesh>
      <mesh ref={torus} position={[0.6, -1.1, -2.8]} rotation={[Math.PI * 0.52, 0, 0]}>
        <torusGeometry args={[3.2, 0.055, 16, 120]} />
        <meshStandardMaterial color="#F2A900" metalness={0.25} roughness={0.5} transparent opacity={0.55} />
      </mesh>
      <gridHelper args={[26, 26, 0xffffff, 0xffffff]} position={[0, -4.2, 0]}>
        {/* opacity handled via material */}
      </gridHelper>
    </>
  );
}

function Particles() {
  const pointsRef = useRef();
  const { positions, velocities } = useMemo(() => {
    const count = 900;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 28;
      pos[i * 3 + 1] = Math.random() * 18 - 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
      vel[i] = 0.015 + Math.random() * 0.045;
    }
    return { positions: pos, velocities: vel };
  }, []);
  useFrame(() => {
    if (!pointsRef.current) return;
    const attr = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < velocities.length; i++) {
      attr.array[i * 3 + 1] += velocities[i];
      if (attr.array[i * 3 + 1] > 9) {
        attr.array[i * 3 + 1] = -7 - Math.random() * 2;
        attr.array[i * 3 + 0] = (Math.random() - 0.5) * 28;
        attr.array[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
      }
    }
    attr.needsUpdate = true;
  });
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.055} color="#ffffff" transparent opacity={0.5} depthWrite={false} sizeAttenuation />
    </points>
  );
}

export default function VolunteerHeroScene() {
  if (typeof window !== 'undefined') {
    if (window.matchMedia('(max-width:760px)').matches) return null;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  }
  return (
    <div className="vol-canvas" aria-hidden="true">
      <Canvas camera={{ position: [0, 1.2, 14], fov: 58 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }} style={{ background: 'transparent' }}>
        <Orbs />
        <Particles />
      </Canvas>
    </div>
  );
}
