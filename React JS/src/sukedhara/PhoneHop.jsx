import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import Bird from './Bird';
import { CLUB } from './data';

/* Positions the bird between phone anchors; parent drives position, squash and flap. */
function HopBird({ hopRef }) {
  const outer = useRef();
  const motion = useRef({ flap: 0.8, squash: 1 });
  useFrame(() => {
    const h = hopRef.current;
    const g = outer.current;
    if (!h || !g) return;
    motion.current.flap = h.flap;
    g.position.set(h.x, h.y, 0);
    g.rotation.y = h.face;
    g.scale.set(2 - h.squash, h.squash, 1);
  });
  return <Bird ref={outer} motionRef={motion} calm={false} />;
}

function Scene({ hopRef }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6.6], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent', pointerEvents: 'none' }}
    >
      <hemisphereLight args={['#FFF3E2', '#A82F43', 0.55]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} />
      <HopBird hopRef={hopRef} />
    </Canvas>
  );
}

const PHONES = [
  {
    id: 'serve',
    tab: 'Serve',
    title: 'A week with Sukedhara',
    caption: 'Sample week — real projects rotate all year.',
    lines: ['Blood donation drive · Sat', 'School painting day', 'Community food drive'],
    foot: '21 events logged'
  },
  {
    id: 'fellowship',
    tab: 'Belong',
    title: 'Saturdays at 10 AM',
    caption: CLUB.venue,
    lines: ['Meetup · every Saturday', '20 active members', 'Fellowships & football'],
    foot: 'Visitors welcome'
  },
  {
    id: 'join',
    tab: 'Join',
    title: 'Say hi, then show up',
    caption: `@${CLUB.ig} · ${CLUB.emails[0]}`,
    lines: ['Follow the Instagram', 'Mail us — we reply fast', 'Walk into any meetup'],
    foot: 'No forms. Just people.'
  }
];

function Phone({ phone, active, phoneRef }) {
  return (
    <div
      ref={phoneRef}
      className={`relative mx-auto w-32 shrink-0 snap-center rounded-[1.6rem] border-[3px] bg-[#241D4D] p-1.5 shadow-[0_20px_45px_-20px_rgba(36,29,77,.55)] transition-all duration-500 sm:w-40 md:w-48 ${
        active ? 'scale-100 border-[#E0475F]' : 'scale-95 border-[#241D4D]/80 opacity-80'
      }`}
    >
      <div className="overflow-hidden rounded-[1.15rem] bg-[#FFF9F1]">
        <div className="flex justify-center bg-[#241D4D] pt-1 pb-1.5">
          <span className="h-1 w-10 rounded-full bg-white/40" />
        </div>
        <div className="space-y-1.5 p-2.5 sm:p-3">
          <p className="text-[9px] font-black tracking-wide text-[#A82F43] uppercase sm:text-[10px]">{phone.title}</p>
          {phone.lines.map((line) => (
            <div key={line} className="flex items-center gap-1.5 rounded-lg bg-white px-1.5 py-1 text-left shadow-sm">
              <span className="size-1.5 shrink-0 rounded-full bg-[#0FB5B1]" />
              <span className="truncate text-[8px] font-semibold text-[#4A3F63] sm:text-[9px]">{line}</span>
            </div>
          ))}
          <p className="hidden pt-0.5 text-[8px] font-bold text-[#0B7C7A] sm:block">{phone.foot}</p>
        </div>
      </div>
    </div>
  );
}

export default function PhoneHop({ calm }) {
  const wrapRef = useRef(null);
  const phoneRefs = useRef([]);
  const hop = useRef({ x: 0, y: 0, face: 0, flap: 0.8, squash: 1 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (calm) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    let raf = 0;
    let prevAnchor = 0;
    let prevT = performance.now();

    const camZ = 6.6;
    const halfH = camZ * Math.tan((42 * Math.PI) / 360);

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - prevT) / 1000, 0.05);
      prevT = now;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const p = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;

      const vw = window.innerWidth;
      const halfW = halfH * (vw / vh);
      const toWorld = (cx, cyTop) => ({
        x: (cx / vw - 0.5) * halfW * 2,
        y: (0.5 - cyTop / vh) * halfH * 2
      });

      const rects = phoneRefs.current.map((el) => el?.getBoundingClientRect()).filter(Boolean);
      if (rects.length === 0) return;

      /* Continuous anchor: interpolate across phone tops as progress grows. */
      const segs = rects.length - 1;
      const f = p * segs;
      const i0 = Math.min(Math.floor(f), Math.max(segs - 1, 0));
      const i1 = Math.min(i0 + 1, rects.length - 1);
      const k = segs > 0 ? f - i0 : 0;
      const a = rects[i0];
      const b = rects[i1];
      const cx = a.left + a.width / 2 + (b.left + b.width / 2 - (a.left + a.width / 2)) * k;
      /* Arc height peaks mid-hop between two phones. */
      const arc = segs > 0 ? Math.sin(k * Math.PI) * Math.min(vh * 0.16, 150) : 0;
      const topY = a.top + (b.top - a.top) * k - arc - 46;
      const w = toWorld(cx, topY);

      const h = hop.current;
      const dx = w.x - h.x;
      /* Critically-damped-ish smoothing toward the anchor. */
      const s = 1 - Math.exp(-10 * dt);
      h.x += dx * s;
      h.y += (w.y - h.y) * s;
      const speed = Math.abs(dx) / Math.max(dt, 0.001);
      const targetFlap = Math.min(0.7 + speed * 0.9, 3.2);
      h.flap += (targetFlap - h.flap) * (1 - Math.exp(-6 * dt));

      /* Face travel direction, ease back to forward. */
      const wantFace = Math.abs(dx) > 0.004 ? Math.sign(dx) * 0.55 : 0;
      h.face += (wantFace - h.face) * (1 - Math.exp(-8 * dt));

      /* Squash & stretch: stretch while rising, squash right after landing. */
      const vy = (w.y - h.y) / Math.max(dt, 0.001);
      let wantSquash = 1 + Math.max(Math.min(vy * 0.05, 0.22), -0.18);
      if (segs > 0) {
        const nearLanding = k > 0.86 || k < 0.02;
        if (nearLanding) wantSquash = 0.82;
      }
      h.squash += (wantSquash - h.squash) * (1 - Math.exp(-12 * dt));

      /* Victory spin once fully through. */
      if (p >= 0.999) h.face += dt * 6;

      const seg = Math.round(p * segs);
      if (seg !== prevAnchor) {
        prevAnchor = seg;
        setActive(seg);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [calm]);

  return (
    <section ref={wrapRef} className="relative" style={{ height: calm ? 'auto' : '340vh' }}>
      <div className={calm ? 'px-4 py-6 md:px-8' : 'sticky top-0 h-screen overflow-y-auto px-4 md:px-8'}>
        <div className="m-auto w-full py-4">
        <p className="text-center text-xs font-bold tracking-[0.2em] text-[#0FB5B1] uppercase">Scroll with the bird</p>
        <h2 className="mt-2 text-center text-2xl font-black text-[#241D4D] md:text-4xl">
          Hop through the club
        </h2>

        <div className="relative mx-auto mt-4 w-full max-w-4xl md:mt-6">
          {!calm && (
            <div className="pointer-events-none absolute inset-0 z-10">
              <Scene hopRef={hop} />
            </div>
          )}
          <div className="relative z-0 flex snap-x snap-mandatory items-start justify-start gap-3 overflow-x-auto px-6 py-8 sm:justify-center md:gap-6">
            {PHONES.map((phone, i) => (
              <Phone
                key={phone.id}
                phone={phone}
                active={calm || active === i}
                phoneRef={(el) => {
                  phoneRefs.current[i] = el;
                }}
              />
            ))}
          </div>
        </div>

        <div className="mx-auto mt-2 grid w-full max-w-4xl gap-2 sm:grid-cols-3 md:mt-4 md:gap-3">
          {PHONES.map((phone, i) => (
            <div
              key={phone.id}
              className={`rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
                calm || active === i
                  ? 'border-[#E0475F] bg-white shadow-[0_14px_35px_-20px_rgba(224,71,95,.6)]'
                  : 'border-[#F0D9BE] bg-white/60'
              }`}
            >
              <p className="text-sm font-extrabold text-[#241D4D]">
                <span className="mr-2 inline-block rounded-full bg-[#E0475F]/10 px-2 py-0.5 text-[10px] font-black text-[#A82F43] uppercase">
                  {phone.tab}
                </span>
                {phone.title}
              </p>
              <p className="mt-1 truncate text-xs text-[#6B5B73]">{phone.caption}</p>
            </div>
          ))}
        </div>

        {!calm && (
          <div className="mt-4 flex items-center justify-center gap-2 md:mt-5">
            {PHONES.map((phone, i) => (
              <span
                key={phone.id}
                className={`h-2 rounded-full transition-all duration-300 ${
                  active === i ? 'w-8 bg-[#E0475F]' : 'w-2 bg-[#E0475F]/25'
                }`}
              />
            ))}
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
