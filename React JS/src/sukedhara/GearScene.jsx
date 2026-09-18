import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const TEAL = '#2EA5AD';
const CORAL = '#E96D51';
const CLEAR = '#F4F7F4';
const LOGO_URL = '/media/logos/sukedhara.jpg';

/*
 * The club's own circular emblem, floating as a spinning medal.
 * - Constant slow spin, boosted by scroll velocity and click impulse.
 * - Gentle mouse tilt; framed and still when reduced-motion is on.
 */
function LogoWheel({ api, calm, onSpin }) {
  const tilt = useRef(null);
  const spin = useRef(null);
  const texture = useLoader(THREE.TextureLoader, LOGO_URL);

  useLayoutEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
    }
  }, [texture]);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const a = api.current;
    a.impulse += (0 - a.impulse) * Math.min(1, dt * 1.6);
    a.boost += (0 - a.boost) * Math.min(1, dt * 2.4);
    if (spin.current) spin.current.rotation.z += dt * (0.22 + a.boost + a.impulse);
    if (tilt.current && !calm) {
      const { x, y } = state.pointer;
      tilt.current.rotation.x += (y * 0.26 - tilt.current.rotation.x) * Math.min(1, dt * 3);
      tilt.current.rotation.y += (x * 0.42 - tilt.current.rotation.y) * Math.min(1, dt * 3);
    }
  });

  const kick = (e) => {
    e.stopPropagation();
    api.current.impulse += 5;
    onSpin?.();
  };

  return (
    <group ref={tilt}>
      <group ref={spin} onClick={kick}>
        {/* emblem disc (onclick surface) */}
        <mesh>
          <circleGeometry args={[2.15, 72]} />
          <meshBasicMaterial map={texture} side={THREE.DoubleSide} transparent />
        </mesh>
        {/* teal rim */}
        <mesh>
          <torusGeometry args={[2.15, 0.085, 24, 96]} />
          <meshStandardMaterial color={TEAL} metalness={0.65} roughness={0.28} />
        </mesh>
        {/* coral counterweight tag */}
        <mesh position={[0, -2.62, 0]}>
          <boxGeometry args={[0.34, 0.34, 0.34]} />
          <meshStandardMaterial color={CORAL} metalness={0.4} roughness={0.35} />
        </mesh>
        {/* soft white halo behind the medal */}
        <mesh position={[0, 0, -0.12]}>
          <circleGeometry args={[2.4, 72]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.55} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

function Rig({ api, calm, onSpin }) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 5, 6]} intensity={1.2} />
      <LogoWheel api={api} calm={calm} onSpin={onSpin} />
      <Sparkles count={calm ? 26 : 80} scale={[9, 6, 4]} size={3.2} speed={0.28} color={TEAL} opacity={0.7} />
      {!calm && (
        <>
          <Float speed={1.6} rotationIntensity={0.7} floatIntensity={1.4} position={[-3.1, 1.2, -1]}>
            <mesh>
              <icosahedronGeometry args={[0.3, 0]} />
              <meshStandardMaterial color={TEAL} metalness={0.3} roughness={0.35} />
            </mesh>
          </Float>
          <Float speed={2} rotationIntensity={0.9} floatIntensity={1.6} position={[3.2, -1.3, -0.6]}>
            <mesh>
              <torusGeometry args={[0.24, 0.08, 12, 32]} />
              <meshStandardMaterial color={CORAL} metalness={0.4} roughness={0.35} />
            </mesh>
          </Float>
        </>
      )}
    </>
  );
}

const GearScene = forwardRef(function GearScene({ calm = false, onSpin }, ref) {
  const api = useRef({ impulse: 0, boost: 0 });

  useImperativeHandle(ref, () => ({ spin: (n = 6) => { api.current.impulse += n; } }), []);

  useEffect(() => {
    if (calm) return;
    let last = window.scrollY;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const y = window.scrollY;
      const v = Math.abs(y - last);
      last = y;
      api.current.boost = Math.min(api.current.boost + v * 0.012, 3.2);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [calm]);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 7], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      <Rig api={api} calm={calm} onSpin={onSpin} />
    </Canvas>
  );
});

export default GearScene;