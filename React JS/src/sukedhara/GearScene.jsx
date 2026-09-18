import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';

const GOLD = '#F2A900';
const ROSE = '#E0475F';
const ROSE_DEEP = '#A82F43';
const TEAL = '#0FB5B1';

/*
 * A Rotaract-style gear in gold + rose, floating over a particle field.
 * - Constant slow spin, boosted by scroll velocity (the faster you scroll,
 *   the harder the wheel turns) and by click impulse.
 * - Gentle mouse tilt for depth; still framed when reduced-motion is on.
 */
function GearWheel({ api, calm, onSpin }) {
  const tilt = useRef(null);
  const spin = useRef(null);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const a = api.current;
    a.impulse += (0 - a.impulse) * Math.min(1, dt * 1.6);
    a.boost += (0 - a.boost) * Math.min(1, dt * 2.4);
    if (spin.current) spin.current.rotation.z += dt * (0.28 + a.boost + a.impulse);
    if (tilt.current && !calm) {
      const { x, y } = state.pointer;
      tilt.current.rotation.x += (y * 0.26 - tilt.current.rotation.x) * Math.min(1, dt * 3);
      tilt.current.rotation.y += (x * 0.38 - tilt.current.rotation.y) * Math.min(1, dt * 3);
    }
  });

  const teeth = Array.from({ length: 18 }, (_, i) => (i / 18) * Math.PI * 2);
  const spokes = Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI);

  const kick = (e) => {
    e.stopPropagation();
    api.current.impulse += 5;
    onSpin?.();
  };

  return (
    <group ref={tilt}>
      <group ref={spin} onClick={kick}>
        {/* outer ring */}
        <mesh>
          <torusGeometry args={[1.5, 0.12, 16, 72]} />
          <meshStandardMaterial color={GOLD} metalness={0.75} roughness={0.28} />
        </mesh>
        {/* teeth */}
        {teeth.map((a) => (
          <mesh key={a} position={[Math.cos(a) * 1.66, Math.sin(a) * 1.66, 0]} rotation={[0, 0, a]}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial color={GOLD} metalness={0.75} roughness={0.3} />
          </mesh>
        ))}
        {/* six rose spokes */}
        {spokes.map((a) => (
          <mesh key={a} rotation={[0, 0, a]}>
            <boxGeometry args={[0.17, 2.72, 0.17]} />
            <meshStandardMaterial color={ROSE} metalness={0.45} roughness={0.4} />
          </mesh>
        ))}
        {/* glowing inner ring */}
        <mesh>
          <torusGeometry args={[0.98, 0.045, 12, 64]} />
          <meshStandardMaterial color={ROSE_DEEP} emissive={ROSE} emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
        {/* hub */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.44, 0.44, 0.3, 32]} />
          <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial color={ROSE} emissive={ROSE} emissiveIntensity={1.1} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function Rig({ api, calm, onSpin }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 5, 6]} intensity={1.6} />
      <pointLight position={[-5, -1, 3]} intensity={30} color={ROSE} />
      <pointLight position={[5, 2, 2]} intensity={24} color={GOLD} />
      <GearWheel api={api} calm={calm} onSpin={onSpin} />
      <Sparkles count={calm ? 30 : 90} scale={[9, 6, 4]} size={3.2} speed={0.28} color={GOLD} opacity={0.75} />
      {!calm && (
        <>
          <Float speed={1.6} rotationIntensity={0.7} floatIntensity={1.4} position={[-3.1, 1.2, -1]}>
            <mesh>
              <icosahedronGeometry args={[0.32, 0]} />
              <meshStandardMaterial color={TEAL} metalness={0.4} roughness={0.4} />
            </mesh>
          </Float>
          <Float speed={2} rotationIntensity={0.9} floatIntensity={1.6} position={[3.2, -1.3, -0.6]}>
            <mesh>
              <torusGeometry args={[0.26, 0.09, 12, 32]} />
              <meshStandardMaterial color={ROSE} metalness={0.5} roughness={0.35} />
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

  /* Scroll velocity feeds the wheel: fast scrolls spin it harder. */
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
