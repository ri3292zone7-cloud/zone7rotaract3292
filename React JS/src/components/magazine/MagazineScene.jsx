import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Sparkles } from '@react-three/drei';
import { loadPdf, renderPageToCanvas } from '../../lib/pdf';
import { composeCover, makeSurfaceCanvas, makeRoughnessCanvas } from '../../lib/cover-textures';
import { bookMotion } from '../../lib/bookMotion';

const COVER_RATIO = 842 / 595;
const BOOK_W = 1.0;
const BOOK_H = BOOK_W * COVER_RATIO;
const THICK = 0.09;
const YAW_LIMIT = 0.5;
const ZOOM_MIN = 0.7;
const ZOOM_MAX = 1.4;
const PITCH_LIMIT = 0.5;

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function makeFallbackCover() {
  const w = 512;
  const h = Math.round(w * COVER_RATIO);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#E11A6E');
  g.addColorStop(0.55, '#A80F52');
  g.addColorStop(1, '#1B1836');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(255,255,255,.18)';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, w - 20, h - 20);
  ctx.fillStyle = 'rgba(255,255,255,.85)';
  ctx.font = '700 22px Poppins, Inter, sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('ZONE 7', 40, 70);
  ctx.fillStyle = '#fff';
  ctx.font = '900 58px Poppins, Inter, sans-serif';
  ctx.fillText('Zonal', 40, 250);
  ctx.fillText('Magazine', 40, 320);
  ctx.fillStyle = '#F2A900';
  ctx.font = '800 24px Poppins, Inter, sans-serif';
  ctx.fillText('2024-25', 40, 390);
  return c;
}

const textureCache = new Map();

function buildTextures(sourceCanvas) {
  if (textureCache.has(sourceCanvas)) return textureCache.get(sourceCanvas);
  const composed = composeCover(sourceCanvas);
  const surface = makeSurfaceCanvas(sourceCanvas.width, sourceCanvas.height);
  const rough = makeRoughnessCanvas(surface);

  const map = new THREE.CanvasTexture(composed);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const bump = new THREE.CanvasTexture(surface);
  bump.colorSpace = THREE.NoColorSpace;
  bump.anisotropy = 8;
  const roughnessMap = new THREE.CanvasTexture(rough);
  roughnessMap.colorSpace = THREE.NoColorSpace;
  roughnessMap.anisotropy = 8;

  const tex = { map, bump, roughnessMap };
  textureCache.set(sourceCanvas, tex);
  return tex;
}

function useCoverTextures(pdfUrl) {
  const fallback = useMemo(() => makeFallbackCover(), []);
  const [textures, setTextures] = useState(() => buildTextures(fallback));

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { promise } = loadPdf(pdfUrl);
        const doc = await promise;
        if (!alive) { doc.destroy(); return; }
        const canvas = await renderPageToCanvas(doc, 1, 0.6);
        if (!alive) { doc.destroy(); return; }
        doc.destroy();
        setTextures(buildTextures(canvas));
      } catch (e) {
        console.warn('Cover render failed, using fallback:', e);
      }
    })();
    return () => { alive = false; };
  }, [pdfUrl]);

  return textures;
}

function DragController({ ctl, onFirstGrab }) {
  const gl = useThree((s) => s.gl);
  const grabbed = useRef(false);

  useEffect(() => {
    const el = gl.domElement;
    const pointers = new Map();
    let pinchDist = 0;
    el.style.cursor = 'grab';

    const down = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      el.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY });
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchDist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      } else if (pointers.size === 1) {
        ctl.dragging = true;
        el.style.cursor = 'grabbing';
        if (!grabbed.current && onFirstGrab) {
          grabbed.current = true;
          onFirstGrab();
        }
      }
    };

    const move = (e) => {
      if (!pointers.has(e.pointerId)) return;
      if (pointers.size === 1) {
        const prev = pointers.get(e.pointerId);
        const dx = e.clientX - prev.clientX;
        const dy = e.clientY - prev.clientY;
        if (ctl.dragging && (dx || dy)) {
          ctl.yaw = clamp(ctl.yaw + dx * 0.005, -YAW_LIMIT, YAW_LIMIT);
          ctl.pitch = clamp(ctl.pitch + dy * 0.005, -PITCH_LIMIT, PITCH_LIMIT);
          ctl.velY = dx * 0.02;
          ctl.velX = dy * 0.02;
        }
        pointers.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY });
      } else if (pointers.size === 2) {
        pointers.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY });
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        if (pinchDist > 0) ctl.zoom = clamp(ctl.zoom * (d / pinchDist), ZOOM_MIN, ZOOM_MAX);
        pinchDist = d;
      }
    };

    const end = (e) => {
      pointers.delete(e.pointerId);
      pinchDist = 0;
      if (pointers.size === 0) {
        ctl.dragging = false;
        el.style.cursor = 'grab';
      }
    };

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', end);
      el.removeEventListener('pointercancel', end);
    };
  }, [gl, ctl, onFirstGrab]);

  return null;
}

function Book({ textures, pointerRef, ctl }) {
  const group = useRef(null);
  const content = useRef(null);
  const zoomSmooth = useRef(1);
  const spin = useRef({ rotY: -0.55, rotX: -0.28, rotZ: 0, x: 1.7, y: -0.05, scale: 1 });

  useFrame((state, delta) => {
    const t = bookMotion;
    const damp = 1 - Math.pow(0.001, delta);
    spin.current.rotY = lerp(spin.current.rotY, t.rotY, damp);
    spin.current.rotX = lerp(spin.current.rotX, t.rotX, damp);
    spin.current.rotZ = lerp(spin.current.rotZ, t.rotZ, damp);
    spin.current.x = lerp(spin.current.x, t.x, damp);
    spin.current.y = lerp(spin.current.y, t.y, damp);
    spin.current.scale = lerp(spin.current.scale, t.scale, damp);

    const narrow = typeof window !== 'undefined' && window.innerWidth < 900;
    const nx = narrow ? 0.5 : 1;
    const ny = narrow ? 0.8 : 1;
    const ns = narrow ? 0.62 : 1;
    const posX = spin.current.x * nx;
    const posY = spin.current.y * ny;
    const scale = spin.current.scale * t.intro.scale * ns;

    // ── interaction: drag rotates within a front-only range ──
    const dt = Math.min(delta, 0.05);
    if (!ctl.dragging) {
      const decay = Math.pow(0.0001, dt);
      ctl.velY *= decay;
      ctl.velX *= decay;
      ctl.yaw = clamp(ctl.yaw + ctl.velY * dt, -YAW_LIMIT, YAW_LIMIT);
      ctl.pitch = clamp(ctl.pitch + ctl.velX * dt, -PITCH_LIMIT, PITCH_LIMIT);
    }
    ctl.pitch = clamp(ctl.pitch, -PITCH_LIMIT, PITCH_LIMIT);
    zoomSmooth.current = lerp(zoomSmooth.current, ctl.zoom, damp);

    const pointer = pointerRef.current || { x: 0, y: 0 };
    const par = ctl.dragging ? 0 : 1;

    const g = group.current;
    if (!g) return;
    g.rotation.y = spin.current.rotY + ctl.yaw + pointer.x * 0.18 * par;
    g.rotation.x = spin.current.rotX + ctl.pitch + pointer.y * 0.14 * par;
    g.rotation.z = spin.current.rotZ;
    g.position.x = posX + pointer.x * 0.2 * par;
    g.position.y = posY - pointer.y * 0.18 * par;
    g.scale.setScalar(scale * zoomSmooth.current);

    // gentle idle bob
    const bob = Math.sin(state.clock.elapsedTime * 1.3) * 0.075;
    const wob = Math.sin(state.clock.elapsedTime * 0.9) * 0.03;
    if (content.current) {
      content.current.position.y = bob;
      content.current.rotation.z = wob;
    }
  });

  const coverMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({
      map: textures.map,
      bumpMap: textures.bump,
      bumpScale: 0.018,
      roughnessMap: textures.roughnessMap,
      roughness: 0.62,
      metalness: 0.06,
      clearcoat: 0.35,
      clearcoatRoughness: 0.5
    }),
    [textures]
  );
  const backMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: '#2A2350',
      roughness: 0.5,
      metalness: 0.25,
      bumpMap: textures.bump,
      bumpScale: 0.01
    }),
    [textures]
  );
  const pagesMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#F4F0E8', roughness: 0.9 }),
    []
  );
  const inkMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#1B1836', roughness: 0.7 }),
    []
  );
  const goldMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#F2A900', roughness: 0.35, metalness: 0.6 }),
    []
  );

  return (
    <group ref={group} position={[1.7, -0.05, 0]} rotation={[-0.28, -0.55, 0]}>
      <group ref={content}>
        {/* page block */}
        <mesh material={pagesMat} position={[0, 0, 0]}>
          <boxGeometry args={[BOOK_W * 0.96, BOOK_H * 0.965, THICK * 0.88]} />
        </mesh>
        {/* front cover — procedural maps composited over the real cover page */}
        <mesh material={coverMat} position={[0, 0, THICK / 2 + 0.002]}>
          <planeGeometry args={[BOOK_W, BOOK_H]} />
        </mesh>
        {/* back cover */}
        <mesh material={backMat} position={[0, 0, -THICK / 2 - 0.002]}>
          <planeGeometry args={[BOOK_W, BOOK_H]} />
        </mesh>
        {/* spine */}
        <mesh material={inkMat} position={[-BOOK_W / 2, 0, 0]}>
          <boxGeometry args={[0.018, BOOK_H, THICK]} />
        </mesh>
        {/* gold spine highlight */}
        <mesh material={goldMat} position={[-BOOK_W / 2 + 0.012, 0, 0]}>
          <boxGeometry args={[0.006, BOOK_H, THICK]} />
        </mesh>
        {/* page edge (right) */}
        <mesh material={pagesMat} position={[BOOK_W / 2 - 0.01, 0, 0]}>
          <boxGeometry args={[0.012, BOOK_H * 0.965, THICK * 0.88]} />
        </mesh>
      </group>
      {/* ambient ring */}
      <mesh position={[0, 0.1, -1.7]} rotation={[1.42, 0, 0]}>
        <torusGeometry args={[2.25, 0.006, 8, 120]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.09} />
      </mesh>
      <mesh position={[0, -0.2, -1.9]} rotation={[1.5, 0, 0]}>
        <torusGeometry args={[1.6, 0.005, 8, 120]} />
        <meshBasicMaterial color="#F2A900" transparent opacity={0.07} />
      </mesh>
      {/* magical sparkles — gold halo + soft magenta mist */}
      <Sparkles count={70} scale={[6, 3.6, 4]} size={1.8} speed={0.32} color="#F2A900" opacity={0.5} />
      <Sparkles count={40} scale={[4.4, 2.8, 3]} size={2.2} speed={0.24} color="#FF5C9D" opacity={0.35} />
      <ContactShadows position={[0, -1.3, 0]} opacity={0.42} scale={5.2} blur={2.6} far={2.4} />
    </group>
  );
}

export default function MagazineScene({ pdfUrl, pointerRef, onFirstGrab }) {
  const textures = useCoverTextures(pdfUrl);
  const ctlRef = useRef({ yaw: 0, pitch: 0, velY: 0, velX: 0, zoom: 1, dragging: false });

  return (
    <Canvas
      camera={{ position: [0, 0.15, 5.4], fov: 40 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1.25} />
      <pointLight position={[-3.2, 1.2, 2.4]} intensity={22} distance={9} color="#FF5C9D" />
      <pointLight position={[3.4, -1.4, 2.2]} intensity={18} distance={9} color="#F2A900" />
      <DragController ctl={ctlRef.current} onFirstGrab={onFirstGrab} />
      <Book textures={textures} pointerRef={pointerRef} ctl={ctlRef.current} />
    </Canvas>
  );
}
