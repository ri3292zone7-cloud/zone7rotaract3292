import { forwardRef, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export const ROSE = '#E0475F';
export const ROSE_DEEP = '#A82F43';
export const GOLD = '#FFB86B';
export const CREAM = '#FFF1DC';
export const INK = '#241D4D';

/*
 * Hand-built low-poly club bird, facing +Z.
 * Parent owns the OUTER group (position / rotation / scale — the hop loop
 * and squash drive it imperatively). The INNER group owns idle bob, wing
 * flap and the celebratory flip, so the two never fight.
 */
const Bird = forwardRef(function Bird({ motionRef, flipKey = 0, calm = false, ...props }, ref) {
  const inner = useRef();
  const wingL = useRef();
  const wingR = useRef();
  const flip = useRef({ active: false, t: 0 });
  const prevKey = useRef(flipKey);

  useEffect(() => {
    if (flipKey !== prevKey.current) {
      prevKey.current = flipKey;
      if (flipKey > 0) flip.current = { active: true, t: 0 };
    }
  }, [flipKey]);

  useFrame((state, dt) => {
    const g = inner.current;
    if (!g) return;
    const d = Math.min(dt, 0.05);
    const t = state.clock.elapsedTime;
    const motion = motionRef?.current;
    const flapAmp = motion ? motion.flap : 1;

    let y = 0;
    if (!calm) {
      y = Math.sin(t * 2.2) * 0.06;
      const w = Math.sin(t * (4 + 6 * flapAmp)) * (0.15 + 0.5 * flapAmp);
      if (wingL.current) wingL.current.rotation.z = 0.35 + w;
      if (wingR.current) wingR.current.rotation.z = -0.35 - w;
    } else {
      if (wingL.current) wingL.current.rotation.z = 0.3;
      if (wingR.current) wingR.current.rotation.z = -0.3;
    }

    if (flip.current.active) {
      flip.current.t += d / 0.7;
      const k = Math.min(flip.current.t, 1);
      const e = 1 - Math.pow(1 - k, 3);
      g.rotation.y = e * Math.PI * 2;
      y += Math.sin(k * Math.PI) * 0.9;
      if (k >= 1) {
        flip.current.active = false;
        g.rotation.y = 0;
      }
    }
    g.position.y = y;
    /* Scroll-velocity lean, written by the parent each frame (0 when idle). */
    if (motion && typeof motion.lean === 'number') {
      g.rotation.z += (motion.lean - g.rotation.z) * Math.min(d * 8, 1);
    }
  });

  const feather = { color: ROSE, roughness: 0.6, flatShading: true };
  const deep = { color: ROSE_DEEP, roughness: 0.6, flatShading: true };
  const gold = { color: GOLD, roughness: 0.5, flatShading: true };
  const cream = { color: CREAM, roughness: 0.7, flatShading: true };
  const ink = { color: INK, roughness: 0.4 };

  return (
    <group ref={ref} {...props}>
      <group ref={inner}>
        {/* body */}
        <mesh scale={[1, 1.12, 0.88]}>
          <sphereGeometry args={[0.55, 7, 6]} />
          <meshStandardMaterial {...feather} />
        </mesh>
        {/* belly */}
        <mesh position={[0, -0.1, 0.3]} scale={[0.8, 0.95, 0.6]}>
          <sphereGeometry args={[0.38, 7, 6]} />
          <meshStandardMaterial {...cream} />
        </mesh>
        {/* eyes */}
        {[-0.2, 0.2].map((x) => (
          <group key={x} position={[x, 0.28, 0.42]}>
            <mesh>
              <sphereGeometry args={[0.13, 12, 12]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
            </mesh>
            <mesh position={[0, 0, 0.1]}>
              <sphereGeometry args={[0.06, 10, 10]} />
              <meshStandardMaterial {...ink} />
            </mesh>
            <mesh position={[0.03, 0.04, 0.14]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color="#FFFFFF" toneMapped={false} />
            </mesh>
          </group>
        ))}
        {/* blush */}
        {[-0.33, 0.33].map((x) => (
          <mesh key={x} position={[x, 0.05, 0.38]} scale={[1, 0.7, 0.5]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#F4A7B9" roughness={0.8} />
          </mesh>
        ))}
        {/* beak */}
        <mesh position={[0, 0.1, 0.56]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.11, 0.22, 8]} />
          <meshStandardMaterial {...gold} />
        </mesh>
        {/* head tuft */}
        <mesh position={[0, 0.72, -0.02]} rotation={[0, 0, 0.15]}>
          <coneGeometry args={[0.09, 0.28, 6]} />
          <meshStandardMaterial {...deep} />
        </mesh>
        {/* wings (pivot at shoulder) */}
        <group position={[-0.5, 0.12, 0]}>
          <group ref={wingL}>
            <mesh position={[-0.08, -0.22, 0]}>
              <boxGeometry args={[0.12, 0.5, 0.3]} />
              <meshStandardMaterial {...deep} />
            </mesh>
          </group>
        </group>
        <group position={[0.5, 0.12, 0]}>
          <group ref={wingR}>
            <mesh position={[0.08, -0.22, 0]}>
              <boxGeometry args={[0.12, 0.5, 0.3]} />
              <meshStandardMaterial {...deep} />
            </mesh>
          </group>
        </group>
        {/* tail */}
        <mesh position={[0, -0.42, -0.42]} rotation={[-Math.PI / 2 - 0.45, 0, 0]}>
          <coneGeometry args={[0.16, 0.4, 6]} />
          <meshStandardMaterial {...deep} />
        </mesh>
        {/* feet */}
        {[-0.18, 0.18].map((x) => (
          <mesh key={x} position={[x, -0.68, 0.05]}>
            <cylinderGeometry args={[0.06, 0.07, 0.14, 8]} />
            <meshStandardMaterial {...gold} />
          </mesh>
        ))}
      </group>
    </group>
  );
});

export default Bird;
