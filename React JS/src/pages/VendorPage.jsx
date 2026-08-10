import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Reveal from '../components/ui/Reveal';
import IslandNav from '../components/island/IslandNav';
import StudioEnv from '../components/store/models/StudioEnv';
import { VENDORS } from '../data/vendors';
import './vendor-paws-nepal.css';

import img1 from '../vendors/paws-nepal/media/1.jpg';
import img2 from '../vendors/paws-nepal/media/2.jpg';
import vid1 from '../vendors/paws-nepal/media/1.mp4';
import vid2 from '../vendors/paws-nepal/media/2.mp4';
import dog01 from '../vendors/paws-nepal/media/dog-01.jpg';
import dog02 from '../vendors/paws-nepal/media/dog-02.jpg';
import dog03 from '../vendors/paws-nepal/media/dog-03.jpg';
import dog04 from '../vendors/paws-nepal/media/dog-04.jpg';
import dog05 from '../vendors/paws-nepal/media/dog-05.jpg';
import dog06 from '../vendors/paws-nepal/media/dog-06.jpg';
import dog07 from '../vendors/paws-nepal/media/dog-07.jpg';
import dog08 from '../vendors/paws-nepal/media/dog-08.jpg';

const VENDOR = VENDORS[0];

/* ── 3D: soft glow orbs drifting behind the pup ─────────────────── */
function GlowOrb({ position, color, scale = 1, speed = 0.25 }) {
  const ref = useRef(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * speed + position[0] * 0.7) * 0.35;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[0.6, 20, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.14} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

/* ── 3D: ghost paw prints floating in the dark ──────────────────── */
function PawPrint({ position, scale = 1, rotation = [0, 0, 0], color = '#F2A900', opacity = 0.3 }) {
  const ref = useRef(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.6 + position[0] * 2) * 0.22;
    ref.current.rotation.y += 0.003;
  });
  const m = (color) => ({ color, transparent: true, opacity, emissive: color, emissiveIntensity: 0.4 });
  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.42, 12, 10]} />
        <meshStandardMaterial {...m(color)} />
      </mesh>
      <mesh position={[-0.26, 0, -0.52]}>
        <sphereGeometry args={[0.15, 10, 8]} />
        <meshStandardMaterial {...m(color)} />
      </mesh>
      <mesh position={[-0.09, 0, -0.72]}>
        <sphereGeometry args={[0.15, 10, 8]} />
        <meshStandardMaterial {...m(color)} />
      </mesh>
      <mesh position={[0.09, 0, -0.72]}>
        <sphereGeometry args={[0.15, 10, 8]} />
        <meshStandardMaterial {...m(color)} />
      </mesh>
      <mesh position={[0.26, 0, -0.52]}>
        <sphereGeometry args={[0.15, 10, 8]} />
        <meshStandardMaterial {...m(color)} />
      </mesh>
      <mesh position={[0, 0.06, -0.12]} scale={[0.9, 0.5, 1.5]}>
        <sphereGeometry args={[0.34, 12, 10]} />
        <meshStandardMaterial {...m(color)} />
      </mesh>
    </group>
  );
}

function PawField() {
  const paws = [
    { position: [-4.4, 2.2, -3], scale: 1.15, color: '#F2A900' },
    { position: [-1.6, 0.6, -3.8], scale: 0.8, color: '#E11A6E' },
    { position: [2.2, 2.4, -3.2], scale: 1.3, color: '#F2A900' },
    { position: [4.9, 0.7, -3.9], scale: 0.9, color: '#E11A6E' },
    { position: [-2.6, -0.9, -5.2], scale: 1.25, color: '#F2A900' },
    { position: [0.4, -0.7, -5.4], scale: 1.0, color: '#E11A6E' },
    { position: [3.6, 2.6, -5.6], scale: 0.72, color: '#F2A900' },
    { position: [5.8, -0.4, -5.2], scale: 0.8, color: '#E11A6E' }
  ];
  return (
    <group>
      {paws.map((p, i) => (
        <PawPrint key={i} {...p} />
      ))}
    </group>
  );
}

/* ── 3D: flat paw decal used on the medallion ring ──────────────── */
function FlatPaw({ color = '#F2A900', opacity = 0.9 }) {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh scale={[1, 1, 0.3]}>
        <sphereGeometry args={[0.3, 12, 10]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} emissive={color} emissiveIntensity={0.55} />
      </mesh>
      {[[-0.22, -0.38], [-0.08, -0.54], [0.08, -0.54], [0.22, -0.38]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0, z]} scale={[1, 1, 0.32]}>
          <sphereGeometry args={[0.11, 10, 8]} />
          <meshStandardMaterial color={color} transparent opacity={opacity} emissive={color} emissiveIntensity={0.55} />
        </mesh>
      ))}
    </group>
  );
}

/* ── 3D: glossy pedestal + slow-turning paw medallion ───────────── */
function Pedestal() {
  const ring = useRef(null);
  useFrame((state) => {
    if (ring.current) ring.current.rotation.y = state.clock.elapsedTime * 0.28;
  });
  const paws = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2;
    return { x: Math.cos(a) * 2.12, z: Math.sin(a) * 2.12, rot: -a + 0.5 };
  });
  return (
    <group>
      {/* soft ground shadow */}
      <mesh position={[0, -0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.1, 48]} />
        <meshBasicMaterial color="#0B0914" transparent opacity={0.62} depthWrite={false} />
      </mesh>
      {/* dark glossy pedestal */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[1.92, 2.3, 0.24, 48]} />
        <meshStandardMaterial color="#221C3E" metalness={0.45} roughness={0.3} />
      </mesh>
      {/* gold rim */}
      <mesh position={[0, 0.015, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.85, 1.97, 72]} />
        <meshStandardMaterial color="#F2A900" emissive="#F2A900" emissiveIntensity={0.55} metalness={0.75} roughness={0.22} />
      </mesh>
      {/* orbiting paw medallion */}
      <group ref={ring} position={[0, 0.05, 0]} rotation={[-1.12, 0, 0]}>
        {paws.map((p, i) => (
          <group key={i} position={[p.x, 0, p.z]} rotation={[0, p.rot, 0]}>
            <FlatPaw color={i % 2 ? '#E11A6E' : '#F2A900'} opacity={0.85} />
          </group>
        ))}
      </group>
    </group>
  );
}

/* ── 3D: the PAWS pup — a fully rigged little character ────────── */
const FUR = '#E8B87E';
const FUR_DARK = '#C9914F';
const CREAM = '#FFF4DE';
const PUP_INK = '#251F3C';

function Puppy({ onPet }) {
  const root = useRef(null);
  const torso = useRef(null);
  const head = useRef(null);
  const eyes = useRef(null);
  const earL = useRef(null);
  const earR = useRef(null);
  const tail = useRef(null);
  const tag = useRef(null);
  const [hovered, setHovered] = useState(false);
  const bounce = useRef(0);
  const blink = useRef(0);

  const pet = (e) => {
    e.stopPropagation();
    bounce.current = 1;
    if (onPet) onPet();
  };

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (!root.current) return;
    bounce.current = Math.max(0, bounce.current - dt * 0.3);
    const b = bounce.current;
    const hop = Math.abs(Math.sin(t * 9)) * b * 0.5;
    root.current.position.y = hop + Math.sin(t * 1.4) * 0.025;

    if (torso.current) torso.current.scale.y = 1 + Math.sin(t * 2.4) * 0.016;
    if (tail.current) {
      tail.current.rotation.y = Math.sin(t * 13) * (hovered ? 0.85 : 0.5) + b * 1.2;
      tail.current.rotation.x = -0.1 + Math.sin(t * 2.1) * 0.05;
    }
    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, state.pointer.x * 0.26, 3, dt);
      head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, -state.pointer.y * 0.1 + Math.sin(t * 0.9) * 0.03, 3, dt);
    }
    if (eyes.current) {
      if (blink.current <= 0 && Math.random() < dt * 0.45) blink.current = 0.12;
      blink.current = Math.max(0, blink.current - dt);
      eyes.current.scale.y = 1 - blink.current * 0.88;
    }
    if (earL.current) {
      earL.current.rotation.z = -0.4 + Math.sin(t * 3 + 1) * 0.1 + b * 0.5;
      earL.current.rotation.x = 0.1 + b * 0.6;
    }
    if (earR.current) {
      earR.current.rotation.z = 0.4 - Math.sin(t * 3) * 0.1 - b * 0.5;
      earR.current.rotation.x = 0.1 + b * 0.6;
    }
    if (tag.current) tag.current.rotation.x = Math.sin(t * 2.4) * 0.12 + b * 0.9;
  });

  const cursor = (c) => ({
    onPointerOver: (e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = c; },
    onPointerOut: (e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }
  });

  return (
    <group ref={root} onClick={pet} {...cursor('pointer')}>

      {/* warm pool of light under the pup */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[1.1, 32]} />
        <meshBasicMaterial color="#F2A900" transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* hind haunches */}
      <mesh position={[-0.44, 0.52, -0.28]}>
        <sphereGeometry args={[0.34, 16, 12]} />
        <meshStandardMaterial color={FUR_DARK} />
      </mesh>
      <mesh position={[0.44, 0.52, -0.28]}>
        <sphereGeometry args={[0.34, 16, 12]} />
        <meshStandardMaterial color={FUR_DARK} />
      </mesh>

      {/* torso + belly */}
      <mesh ref={torso} position={[0, 1.02, -0.08]} scale={[1, 0.82, 1.12]}>
        <sphereGeometry args={[0.6, 18, 14]} />
        <meshStandardMaterial color={FUR} />
      </mesh>
      <mesh position={[0, 0.52, 0.16]} scale={[1, 0.55, 1.05]}>
        <sphereGeometry args={[0.32, 14, 12]} />
        <meshStandardMaterial color={CREAM} />
      </mesh>
      <mesh position={[0, 0.92, 0.34]} scale={[0.9, 0.78, 0.85]}>
        <sphereGeometry args={[0.34, 16, 12]} />
        <meshStandardMaterial color={CREAM} />
      </mesh>

      {/* front legs + paws */}
      <mesh position={[-0.32, 0.55, 0.26]} rotation={[0.12, 0, 0.05]}>
        <capsuleGeometry args={[0.14, 0.4, 4, 12]} />
        <meshStandardMaterial color={FUR} />
      </mesh>
      <mesh position={[0.32, 0.55, 0.26]} rotation={[0.12, 0, -0.05]}>
        <capsuleGeometry args={[0.14, 0.4, 4, 12]} />
        <meshStandardMaterial color={FUR} />
      </mesh>
      <mesh position={[-0.32, 0.17, 0.34]}>
        <sphereGeometry args={[0.15, 14, 12]} />
        <meshStandardMaterial color={CREAM} />
      </mesh>
      <mesh position={[0.32, 0.17, 0.34]}>
        <sphereGeometry args={[0.15, 14, 12]} />
        <meshStandardMaterial color={CREAM} />
      </mesh>
      {[-0.44, -0.32, -0.2].map((x, i) => (
        <mesh key={i} position={[x, 0.09, 0.44]}>
          <sphereGeometry args={[0.045, 8, 6]} />
          <meshStandardMaterial color={CREAM} />
        </mesh>
      ))}
      {[0.2, 0.32, 0.44].map((x, i) => (
        <mesh key={i} position={[x, 0.09, 0.44]}>
          <sphereGeometry args={[0.045, 8, 6]} />
          <meshStandardMaterial color={CREAM} />
        </mesh>
      ))}

      {/* wagging tail */}
      <group ref={tail} position={[0, 1.32, -0.58]}>
        <mesh position={[0, 0.16, -0.26]} rotation={[-1.15, 0, 0]}>
          <capsuleGeometry args={[0.105, 0.4, 4, 12]} />
          <meshStandardMaterial color={FUR} />
        </mesh>
        <mesh position={[0, 0.3, -0.55]} rotation={[-1.15, 0, 0]} scale={[0.85, 1.15, 0.85]}>
          <capsuleGeometry args={[0.09, 0.18, 4, 10]} />
          <meshStandardMaterial color={FUR_DARK} />
        </mesh>
      </group>

      {/* collar + jangling bone tag */}
      <mesh position={[0, 1.5, 0.16]} rotation={[1.3, 0, 0]}>
        <torusGeometry args={[0.32, 0.06, 10, 28]} />
        <meshStandardMaterial color="#F2A900" emissive="#F2A900" emissiveIntensity={0.5} metalness={0.7} roughness={0.3} />
      </mesh>
      <group ref={tag} position={[0, 1.45, 0.52]}>
        <mesh>
          <boxGeometry args={[0.16, 0.06, 0.035]} />
          <meshStandardMaterial color="#F2A900" emissive="#F2A900" emissiveIntensity={0.5} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[-0.09, 0, 0]}>
          <sphereGeometry args={[0.058, 10, 8]} />
          <meshStandardMaterial color="#F2A900" emissive="#F2A900" emissiveIntensity={0.5} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.09, 0, 0]}>
          <sphereGeometry args={[0.058, 10, 8]} />
          <meshStandardMaterial color="#F2A900" emissive="#F2A900" emissiveIntensity={0.5} metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* head */}
      <group ref={head} position={[0, 1.88, 0.16]}>
        {/* skull + cheeks */}
        <mesh position={[0, 0.02, 0.06]}>
          <sphereGeometry args={[0.46, 20, 16]} />
          <meshStandardMaterial color={FUR} />
        </mesh>
        <mesh position={[-0.32, -0.08, 0.3]} scale={[0.85, 1, 1]}>
          <sphereGeometry args={[0.2, 14, 12]} />
          <meshStandardMaterial color={FUR_DARK} />
        </mesh>
        <mesh position={[0.32, -0.08, 0.3]} scale={[0.85, 1, 1]}>
          <sphereGeometry args={[0.2, 14, 12]} />
          <meshStandardMaterial color={FUR_DARK} />
        </mesh>
        {/* muzzle */}
        <mesh position={[0, -0.14, 0.5]} scale={[1, 0.78, 1.3]}>
          <sphereGeometry args={[0.25, 16, 12]} />
          <meshStandardMaterial color={CREAM} />
        </mesh>
        {/* shiny nose + glint */}
        <mesh position={[0, -0.02, 0.74]}>
          <sphereGeometry args={[0.085, 12, 10]} />
          <meshStandardMaterial color={PUP_INK} metalness={0.35} roughness={0.28} />
        </mesh>
        <mesh position={[0.03, 0.04, 0.79]}>
          <sphereGeometry args={[0.026, 8, 6]} />
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.4} />
        </mesh>
        {/* smile */}
        <mesh position={[0, -0.25, 0.66]} rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.02, 0.16, 4, 8]} />
          <meshStandardMaterial color={PUP_INK} transparent opacity={0.8} />
        </mesh>
        {/* blinking eyes */}
        <group ref={eyes} position={[0, 0.12, 0.55]}>
          <mesh position={[-0.2, 0, 0]}>
            <sphereGeometry args={[0.08, 12, 10]} />
            <meshStandardMaterial color={PUP_INK} />
          </mesh>
          <mesh position={[0.2, 0, 0]}>
            <sphereGeometry args={[0.08, 12, 10]} />
            <meshStandardMaterial color={PUP_INK} />
          </mesh>
          <mesh position={[-0.215, 0.02, 0.065]}>
            <sphereGeometry args={[0.026, 8, 6]} />
            <meshStandardMaterial color="#fff" />
          </mesh>
          <mesh position={[0.185, 0.02, 0.065]}>
            <sphereGeometry args={[0.026, 8, 6]} />
            <meshStandardMaterial color="#fff" />
          </mesh>
        </group>
      </group>

      {/* floppy ears with cream inner ear */}
      <group ref={earL} position={[-0.42, 2.02, 0.08]} rotation={[-0.4, 0, -0.4]}>
        <mesh position={[0, -0.3, -0.02]} scale={[0.6, 1.5, 0.34]}>
          <sphereGeometry args={[0.24, 14, 12]} />
          <meshStandardMaterial color={FUR_DARK} />
        </mesh>
        <mesh position={[0, -0.26, 0.03]} scale={[0.5, 1.15, 0.45]}>
          <sphereGeometry args={[0.13, 12, 10]} />
          <meshStandardMaterial color={CREAM} />
        </mesh>
      </group>
      <group ref={earR} position={[0.42, 2.02, 0.08]} rotation={[0.4, 0, 0.4]}>
        <mesh position={[0, -0.3, -0.02]} scale={[0.6, 1.5, 0.34]}>
          <sphereGeometry args={[0.24, 14, 12]} />
          <meshStandardMaterial color={FUR_DARK} />
        </mesh>
        <mesh position={[0, -0.26, 0.03]} scale={[0.5, 1.15, 0.45]}>
          <sphereGeometry args={[0.13, 12, 10]} />
          <meshStandardMaterial color={CREAM} />
        </mesh>
      </group>
    </group>
  );
}

/* ── 3D: the full stage — parallax, dust, pedestal, dog ─────────── */
function Stage({ onPet }) {
  const rig = useRef(null);
  useFrame((state, dt) => {
    if (!rig.current) return;
    const s = Math.min(1.15, Math.max(0.62, state.viewport.width / 6.4));
    rig.current.scale.x = THREE.MathUtils.damp(rig.current.scale.x, s, 2.6, dt);
    rig.current.scale.y = rig.current.scale.x;
    rig.current.scale.z = rig.current.scale.x;
    rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, state.pointer.x * 0.16, 2.5, dt);
    rig.current.rotation.x = THREE.MathUtils.damp(rig.current.rotation.x, -state.pointer.y * 0.06, 2.5, dt);
  });

  return (
    <group ref={rig}>
      <Sparkles count={130} scale={[12, 7, 9]} position={[0, 1.8, -1]} size={2.4} speed={0.3} opacity={0.5} color="#F6C453" />
      <GlowOrb position={[-4.4, 1.6, -3.2]} color="#E11A6E" scale={1.5} speed={0.25} />
      <GlowOrb position={[4.6, 0.8, -3.6]} color="#F2A900" scale={1.9} speed={0.2} />
      <GlowOrb position={[0, 2.6, -5]} color="#6C5CE7" scale={2.4} speed={0.18} />
      <Pedestal />
      <PawField />
      <Float speed={1.2} rotationIntensity={0.14} floatIntensity={0.4}>
        <Puppy onPet={onPet} />
      </Float>
    </group>
  );
}

function PawScene({ onPet }) {
  return (
    <Canvas
      camera={{ position: [0, 1.35, 7.6], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.8]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <StudioEnv />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} color="#FFE3B3" />
      <pointLight position={[-5, 3, 2.5]} intensity={10} distance={9} color="#FF6AA0" />
      <pointLight position={[5, 1.5, 3.5]} intensity={8} distance={8} color="#F2A900" />
      <pointLight position={[0, 4, 6]} intensity={6} distance={12} color="#9B8CFF" />
      <Stage onPet={onPet} />
    </Canvas>
  );
}

/* ── Lazy 3D hero canvas (mounts only when visible) ────────────── */
function Hero3D({ onPet }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) {
        setOn(true);
        io.disconnect();
      }
    }, { threshold: 0.05 });
    io.observe(document.getElementById('vendor-hero'));
    return () => io.disconnect();
  }, []);
  return on ? <PawScene onPet={onPet} /> : null;
}

/* ── Marquee ticker ────────────────────────────────────────────── */
const TICKER = [
  'Day care', 'Sleepover', 'Short stays', 'Long stays',
  'A home away from home', 'Play & Stay', 'Kathmandu', 'Wag more, worry less'
];

function Ticker() {
  const row = [...TICKER, ...TICKER];
  return (
    <div className="vp-ticker" aria-hidden="true">
      <div className="vp-ticker-track">
        {row.map((t, i) => (
          <span className="vp-ticker-item" key={i}><span className="vp-paw">🐾</span> {t}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Sections ──────────────────────────────────────────────────── */
const SERVICES = [
  {
    icon: '🏡',
    title: 'Day care',
    desc: 'Drop your pup off for the day — playtime, naps and company while you work, travel or run errands.'
  },
  {
    icon: '🌙',
    title: 'Sleepover',
    desc: 'A cosy night away from home with bedtime routines, morning walks and someone who checks on them all night.'
  },
  {
    icon: '📅',
    title: 'Short stays',
    desc: 'Weekends away, holidays and quick trips — your pet gets a mini-vacation of their own.'
  },
  {
    icon: '🧳',
    title: 'Long stays',
    desc: 'Extended care for months away or life transitions — stability, routine and plenty of love.'
  }
];

const GALLERY = [
  { img: img1, span: 'tall' },
  { img: dog01, span: '' },
  { img: dog02, span: '' },
  { video: vid1, span: 'wide' },
  { img: dog03, span: '' },
  { img: dog04, span: 'tall' },
  { img: dog05, span: '' },
  { video: vid2, span: 'wide' },
  { img: dog06, span: '' },
  { img: img2, span: 'tall' },
  { img: dog07, span: '' },
  { img: dog08, span: '' }
];

export default function VendorPage() {
  const [bark, setBark] = useState(0);
  useEffect(() => {
    document.title = 'PAWS — Play & Stay | Zone 7 Local Vendor';
  }, []);

  const petPup = () => setBark((b) => b + 1);

  return (
    <div className="vp-page">
      <IslandNav current="vendor" context="PAWS — Play & Stay" />
      {/* ── HERO ── */}
      <header className="vp-hero" id="vendor-hero">
        <div className="vp-aurora a1"></div>
        <div className="vp-aurora a2"></div>
        <Hero3D onPet={petPup} />
        {bark > 0 && (
          <div className="vp-bark" key={bark} role="status">Woof! <span className="vp-bark-heart">♥</span></div>
        )}
        <div className="vp-hero-inner">
          <span className="vp-eyebrow">Zone 7 · Local Vendor</span>
          <h1 className="vp-title">PAWS <span className="vp-em">— Play &amp; Stay</span></h1>
          <p className="vp-tagline">
            A home away from home for your four-legged family.
            <br />Pet boarding &amp; day care in Kathmandu.
          </p>
          <div className="vp-cta-row">
            <a className="vp-btn vp-btn-gold" href={VENDOR.site} target="_blank" rel="noreferrer">Visit pawsnepal.com →</a>
            <a className="vp-btn vp-btn-glass" href={VENDOR.instagram} target="_blank" rel="noreferrer">Follow @pawsnepal</a>
          </div>
          <a className="vp-scroll-cue" href="#story">Meet the pack <span className="vp-cue-arrow">↓</span></a>
        </div>
        <div className="vp-pup-hint">🐾 tap the pup</div>
      </header>

      <Ticker />

      {/* ── STORY ── */}
      <section className="vp-story" id="story">
        <div className="vp-wrap vp-story-grid">
          <Reveal className="vp-story-copy">
            <span className="vp-kicker">Why Paws</span>
            <h2>The dogs make the house a home.</h2>
            <p>
              When you leave town, someone has to keep the routines, the walks and the
              treats flowing. PAWS — Play &amp; Stay exists for exactly that: a clean,
              quiet and comfortable second home where your pet is the guest of honour.
            </p>
            <p>
              Every stay is built around your pet's rhythm — feeding times, nap spots,
              favourite toys and a soft bed that smells like them. No cages, no crowds,
              no stress. Just a house full of tails that won't stop wagging.
            </p>
            <div className="vp-chips">
              <span className="vp-chip">24/7 care</span>
              <span className="vp-chip">Daily walks</span>
              <span className="vp-chip">Owner updates</span>
              <span className="vp-chip">Clean &amp; quiet</span>
            </div>
          </Reveal>
          <Reveal className="vp-story-media" delay={0.12}>
            <img src={dog01} alt="A happy dog enjoying life" loading="lazy" />
            <img className="vp-stacked" src={img2} alt="A dog at PAWS" loading="lazy" />
          </Reveal>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="vp-services">
        <div className="vp-wrap">
          <Reveal className="vp-center-head">
            <span className="vp-kicker light">Stays &amp; care</span>
            <h2>Every kind of stay, one kind of love.</h2>
            <p>From a single day to a season away — each stay is tailored to your pet.</p>
          </Reveal>
          <div className="vp-service-grid">
            {SERVICES.map((s, i) => (
              <Reveal className="vp-service-card" key={s.title} delay={i * 0.07}>
                <span className="vp-service-icon" aria-hidden="true">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <a className="vp-service-link" href={VENDOR.site} target="_blank" rel="noreferrer">Book this stay →</a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE LIFE OF DOGS ── */}
      <section className="vp-life">
        <div className="vp-wrap">
          <Reveal className="vp-center-head">
            <span className="vp-kicker">The life of dogs</span>
            <h2>They eat. They play. They sleep like royalty.</h2>
            <p>A glimpse of the everyday at PAWS — naps in sunbeams, zoomies in the yard and dinner-time chaos.</p>
          </Reveal>
        </div>
        <div className="vp-gallery">
          {GALLERY.map((g, i) => (
            <Reveal className={`vp-cell ${g.span || ''}`} key={i} delay={(i % 4) * 0.05}>
              {g.video ? (
                <video src={g.video} muted loop playsInline autoPlay preload="metadata" aria-label="Video of a dog at PAWS" />
              ) : (
                <img src={g.img} alt="A dog living its best life at PAWS" loading="lazy" />
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section className="vp-quote">
        <div className="vp-aurora a3"></div>
        <Reveal className="vp-quote-inner">
          <span className="vp-quote-mark" aria-hidden="true">“</span>
          <p className="vp-quote-text">
            Every guest arrives with a story — and leaves as family.
          </p>
          <span className="vp-quote-by">— The pack at PAWS, Play &amp; Stay</span>
        </Reveal>
      </section>

      {/* ── CTA ── */}
      <section className="vp-cta">
        <div className="vp-wrap vp-cta-inner">
          <Reveal>
            <span className="vp-kicker">Book a stay</span>
            <h2>Planning a trip?<br />Your pup's holiday starts here.</h2>
            <p>Reach out to PAWS directly to check availability and book your pet's home away from home.</p>
            <div className="vp-cta-row">
              <a className="vp-btn vp-btn-gold" href={VENDOR.site} target="_blank" rel="noreferrer">Visit pawsnepal.com →</a>
              <a className="vp-btn vp-btn-dark" href={VENDOR.instagram} target="_blank" rel="noreferrer">Follow @pawsnepal</a>
            </div>
          </Reveal>
          <a className="vp-store-link" href="/store">← Back to the Zone 7 Store</a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="vp-footer">
        <div className="vp-wrap vp-footer-inner">
          <span><span className="vp-paw">🐾</span> {VENDOR.name}</span>
          <span>Pet boarding &amp; day care · Kathmandu, Nepal</span>
          <span>A <a href="/store">Zone 7 Local Vendor</a> · <a href="/">Home</a> · Rotaract District 3292</span>
        </div>
      </footer>
    </div>
  );
}
