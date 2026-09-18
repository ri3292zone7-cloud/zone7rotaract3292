import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Bird, { GOLD } from './Bird';

const CONFETTI_COLORS = ['#E0475F', '#FFB86B', '#0FB5B1', '#FFF1DC', '#F2A900'];

/* 90 instanced paper bits, spawned on every flip, ballistic + fade by scale. */
function Burst({ burstKey }) {
  const ref = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const sim = useRef({ t: 99, parts: [] });

  useEffect(() => {
    if (burstKey <= 0) return;
    const parts = [];
    for (let i = 0; i < 90; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 1.6 + Math.random() * 2.6;
      parts.push({
        x: 0,
        y: 0.2,
        z: 0,
        vx: Math.cos(a) * sp,
        vy: 2.2 + Math.random() * 2.8,
        vz: (Math.random() - 0.5) * 2.4,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        sx: 3 + Math.random() * 6,
        sy: 3 + Math.random() * 6,
        c: CONFETTI_COLORS[i % CONFETTI_COLORS.length]
      });
    }
    sim.current = { t: 0, parts };
  }, [burstKey]);

  useFrame((_, rawDt) => {
    const mesh = ref.current;
    if (!mesh) return;
    const s = sim.current;
    const dt = Math.min(rawDt, 0.05);
    if (s.t > 1.7) {
      mesh.visible = false;
      return;
    }
    mesh.visible = true;
    s.t += dt;
    const fade = s.t > 1.2 ? Math.max(1 - (s.t - 1.2) / 0.5, 0.001) : 1;
    s.parts.forEach((p, i) => {
      p.vy -= 6.5 * dt;
      p.vx *= 1 - 0.9 * dt;
      p.vz *= 1 - 0.9 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      p.rx += p.sx * dt;
      p.ry += p.sy * dt;
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rx, p.ry, 0);
      dummy.scale.setScalar(fade);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, color.set(p.c));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 90]} visible={false} frustumCulled={false}>
      <planeGeometry args={[0.09, 0.14]} />
      <meshBasicMaterial toneMapped={false} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

export default function HeroScene({ flipKey, onFlip, calm, motionRef }) {
  const fallback = useRef({ flap: 1, squash: 1 });

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.4, 6.6], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <hemisphereLight args={['#FFF3E2', '#A82F43', 0.55]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} />

      <group
        onClick={(e) => {
          e.stopPropagation();
          onFlip();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = '';
        }}
      >
        <Bird motionRef={motionRef || fallback} flipKey={flipKey} calm={calm} />
      </group>

      <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1.4} position={[2.7, 0.9, -1]}>
        <mesh>
          <torusGeometry args={[0.32, 0.11, 10, 20]} />
          <meshStandardMaterial color={GOLD} roughness={0.35} flatShading />
        </mesh>
      </Float>
      <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2} position={[-2.8, 0.5, -1.2]}>
        <mesh scale={0.55}>
          <icosahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color="#0FB5B1" roughness={0.4} flatShading />
        </mesh>
      </Float>
      <Float speed={1.3} rotationIntensity={0.5} floatIntensity={1.6} position={[2.2, -1.1, -0.5]}>
        <mesh scale={0.4}>
          <octahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color="#FFF1DC" roughness={0.5} flatShading />
        </mesh>
      </Float>

      <Sparkles count={60} scale={[8, 5, 3]} size={3} speed={0.3} color="#FFD9A8" />
      <Burst burstKey={flipKey} />
      <ContactShadows position={[0, -1.55, 0]} opacity={0.28} scale={9} blur={2.4} />
    </Canvas>
  );
}
