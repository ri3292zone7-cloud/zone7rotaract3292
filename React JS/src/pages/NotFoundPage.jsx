import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SiteShell from '../components/layout/SiteShell';
import pageCss from './404.css?inline';

export default function NotFoundPage() {
  const canvasRef = useRef(null);
  const scoreRef = useRef(null);
  const bestNowRef = useRef(null);
  const bestValRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 820, H = 300, GROUND = H - 46;
    let best = +(localStorage.getItem('z7gearBest') || 0);
    if (bestValRef.current) bestValRef.current.textContent = best;
    if (bestNowRef.current) bestNowRef.current.textContent = best;

    let state = 'idle'; // idle | play | dead
    const gear = { x: 120, y: GROUND - 34, w: 34, h: 34, vy: 0, angle: 0, onGround: true };
    const GRAV = 0.7, JUMP = -12.5;
    let obstacles = [];
    let speed = 3.6, baseSpeed = 3.6;
    let dist = 0;
    let spawnT = 0;
    let clouds = [], dust = [], coins = [];
    let t = 0, coinSpawnT = 0, coinsGot = 0;

    function reset() {
      state = 'play';
      gear.y = GROUND - 34; gear.vy = 0; gear.onGround = true; gear.angle = 0;
      obstacles = []; coins = []; speed = baseSpeed; dist = 0; spawnT = 0; coinSpawnT = 0; coinsGot = 0;
    }

    function jump() {
      if (state === 'idle') reset();
      if (state === 'play' && gear.onGround) {
        gear.vy = JUMP; gear.onGround = false;
      }
    }

    function spawn() {
      const r = Math.random();
      if (r < 0.62) { // paperwork stack
        obstacles.push({ type: 'paper', x: W + 30, y: GROUND - 24, w: 22, h: 24 });
      } else { // chai cup
        obstacles.push({ type: 'chai', x: W + 30, y: GROUND - 18, w: 18, h: 18 });
      }
    }

    function rectsHit(a, b) {
      return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    function drawBackground() {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#FFE9D6'); grad.addColorStop(0.52, '#FFD9B8'); grad.addColorStop(0.53, '#F7C48F'); grad.addColorStop(1, '#C98F52');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

      // distant hills
      ctx.fillStyle = 'rgba(201,143,82,.35)';
      ctx.beginPath(); ctx.moveTo(0, GROUND);
      ctx.quadraticCurveTo(W * 0.2, GROUND - 70, W * 0.42, GROUND - 28);
      ctx.quadraticCurveTo(W * 0.6, GROUND + 6, W * 0.78, GROUND - 46);
      ctx.quadraticCurveTo(W, GROUND - 12, W, GROUND);
      ctx.fill();

      // stupa silhouette
      ctx.fillStyle = 'rgba(120,80,50,.3)';
      const sx = W * 0.82;
      ctx.beginPath();
      ctx.arc(sx, GROUND - 34, 18, Math.PI, 0);
      ctx.fillRect(sx - 22, GROUND - 34, 44, 10);
      ctx.fillRect(sx - 10, GROUND - 52, 20, 20);
      ctx.fillRect(sx - 3, GROUND - 64, 6, 14);
      ctx.fill();

      // clouds
      clouds.forEach((c) => {
        ctx.fillStyle = 'rgba(255,255,255,.75)';
        ctx.beginPath();
        ctx.arc(c.x, c.y, 14, 0, 7);
        ctx.arc(c.x + 16, c.y - 6, 11, 0, 7);
        ctx.arc(c.x + 32, c.y, 13, 0, 7);
        ctx.fill();
        c.x -= c.s;
        if (c.x < -60) { c.x = W + 60; c.y = 24 + Math.random() * 70; }
      });

      // ground strip
      ctx.fillStyle = '#8a5a2e'; ctx.fillRect(0, GROUND + 10, W, H - GROUND);
      ctx.fillStyle = '#a5713a'; ctx.fillRect(0, GROUND, W, 10);
      ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 1;
      for (let gx = 0; gx < W; gx += 40) {
        const off = (t * speed * 0.9) % 40;
        ctx.beginPath(); ctx.moveTo(gx - off, GROUND + 4); ctx.lineTo(gx - off + 16, GROUND + 4); ctx.stroke();
      }
    }

    function drawGear(x, y, size, angle, squashed) {
      ctx.save();
      ctx.translate(x + size / 2, y + size / 2);
      ctx.rotate(angle);
      if (squashed) ctx.scale(1.25, 0.55);
      ctx.fillStyle = '#1B1836';
      ctx.strokeStyle = '#1B1836'; ctx.lineWidth = 6;
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 / 8) * i;
        ctx.save(); ctx.rotate(a);
        ctx.fillRect(-4, -size * 0.62, 8, size * 0.24);
        ctx.restore();
      }
      ctx.beginPath(); ctx.arc(0, 0, size / 2 - 3, 0, 7); ctx.fill();
      ctx.fillStyle = '#E11A6E';
      ctx.beginPath(); ctx.arc(0, 0, size / 2 - 11, 0, 7); ctx.fill();
      ctx.fillStyle = '#FFF8EF';
      ctx.beginPath(); ctx.arc(0, 0, size / 2 - 16, 0, 7); ctx.fill();
      ctx.fillStyle = '#1B1836';
      ctx.beginPath(); ctx.arc(-5, -4, 2.6, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(5, -4, 2.6, 0, 7); ctx.fill();
      ctx.strokeStyle = '#1B1836'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(0, 2, 4.5, 0.25, Math.PI - 0.25); ctx.stroke();
      ctx.restore();
    }

    function drawObstacle(o) {
      if (o.type === 'paper') {
        ctx.fillStyle = '#FFFDF9'; ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.strokeStyle = '#A80F52'; ctx.lineWidth = 1.5;
        ctx.strokeRect(o.x, o.y, o.w, o.h);
        ctx.strokeStyle = 'rgba(168,15,82,.5)';
        ctx.beginPath();
        ctx.moveTo(o.x + 3, o.y + 7); ctx.lineTo(o.x + o.w - 3, o.y + 7);
        ctx.moveTo(o.x + 3, o.y + 13); ctx.lineTo(o.x + o.w - 3, o.y + 13);
        ctx.moveTo(o.x + 3, o.y + 19); ctx.lineTo(o.x + o.w - 3, o.y + 19);
        ctx.stroke();
      } else {
        ctx.fillStyle = '#E11A6E';
        ctx.beginPath();
        ctx.moveTo(o.x, o.y + o.h); ctx.lineTo(o.x + 4, o.y); ctx.lineTo(o.x + o.w - 4, o.y); ctx.lineTo(o.x + o.w, o.y + o.h);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#A80F52'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(o.x + 2, o.y + 3); ctx.lineTo(o.x + o.w - 2, o.y + 3); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,.8)';
        ctx.beginPath(); ctx.moveTo(o.x + 5, o.y + 5); ctx.quadraticCurveTo(o.x + o.w / 2, o.y - 7, o.x + o.w - 5, o.y + 5); ctx.fill();
      }
    }

    function drawDust() {
      dust.forEach((d) => {
        ctx.fillStyle = d.g ? 'rgba(242,169,0,.85)' : 'rgba(139,90,46,.25)';
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 7); ctx.fill();
        d.x -= d.v; d.y -= 0.4; d.r *= 0.97;
      });
      dust = dust.filter((d) => d.r > 0.6);
    }

    function drawCoins() {
      coins.forEach((c) => {
        const s = 1 + Math.sin(c.t) * 0.18;
        ctx.fillStyle = '#F2A900';
        ctx.beginPath(); ctx.arc(c.x, c.y, c.r * s, 0, 7); ctx.fill();
        ctx.strokeStyle = '#A87908'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(c.x, c.y, c.r * s, 0, 7); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,.6)';
        ctx.beginPath(); ctx.arc(c.x, c.y, c.r * s * 0.45, 0, 7); ctx.fill();
        ctx.fillStyle = '#A87908';
        ctx.font = '800 10px Poppins, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('7', c.x, c.y + 0.5);
        ctx.textBaseline = 'alphabetic';
      });
    }

    function drawHud() {
      ctx.fillStyle = 'rgba(27,24,54,.75)';
      ctx.font = '700 15px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText((coinsGot > 0 ? '🪙 ' + coinsGot + '  ' : '') + '🏃 ' + Math.floor(dist) + ' m', W - 16, 28);
      if (state === 'idle') {
        ctx.fillStyle = 'rgba(27,24,54,.85)';
        ctx.font = '700 17px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Press space or tap to run!', W / 2, 40);
      }
      if (state === 'dead') {
        ctx.fillStyle = 'rgba(27,24,54,.72)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#FFF8EF';
        ctx.font = '800 26px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Buried by paperwork!', W / 2, H / 2 - 26);
        ctx.font = '600 15px Inter, sans-serif';
        ctx.fillText('You ran ' + Math.floor(dist) + ' m, best ' + best + ' m', W / 2, H / 2 + 4);
        ctx.fillText('Press space, tap or click to run again', W / 2, H / 2 + 30);
      }
    }

    function step() {
      t += 1;
      if (clouds.length < 4 && Math.random() < 0.02) {
        clouds.push({ x: W + 40, y: 24 + Math.random() * 80, s: 0.3 + Math.random() * 0.4 });
      }

      if (state === 'play') {
        speed = baseSpeed + dist * 0.006;
        dist += speed * 0.16;
        if (Math.floor(dist) > best) {
          best = Math.floor(dist);
          localStorage.setItem('z7gearBest', best);
          if (bestValRef.current) bestValRef.current.textContent = best;
          if (bestNowRef.current) bestNowRef.current.textContent = best;
        }
        if (scoreRef.current) scoreRef.current.textContent = Math.floor(dist);

        gear.vy += GRAV;
        gear.y += gear.vy;
        gear.angle += 0.16;
        if (gear.y >= GROUND - gear.h) { gear.y = GROUND - gear.h; gear.vy = 0; gear.onGround = true; }
        if (gear.onGround && Math.random() < 0.12) dust.push({ x: gear.x + 6, y: GROUND + 4, r: 4 + Math.random() * 4, v: 1.2 });

        spawnT -= 1;
        if (spawnT <= 0) { spawn(); spawnT = 60 + Math.random() * 55; }

        coinSpawnT -= 1;
        if (coinSpawnT <= 0 && coins.length < 3) { coins.push({ x: W + 30, y: GROUND - 50 - Math.random() * 45, r: 9, t: Math.random() * 7 }); coinSpawnT = 70 + Math.random() * 60; }

        obstacles.forEach((o) => { o.x -= speed; });
        obstacles = obstacles.filter((o) => o.x > -40);

        coins.forEach((c) => { c.x -= speed; c.t += 0.2; });
        coins = coins.filter((c) => c.x > -20);

        const gb = { x: gear.x + 6, y: gear.y + 5, w: gear.w - 12, h: gear.h - 10 };
        obstacles.forEach((o) => {
          const ob = { x: o.x + 3, y: o.y + 3, w: o.w - 6, h: o.h - 3 };
          if (rectsHit(gb, ob)) state = 'dead';
        });
        coins.forEach((c) => {
          if (Math.abs(c.x - (gear.x + gear.w / 2)) < 22 && Math.abs(c.y - (gear.y + gear.h / 2)) < 26) {
            c.got = true;
            coinsGot++;
            dist += 25;
            let n = 8;
            while (n--) dust.push({ x: c.x + (Math.random() * 10 - 5), y: c.y + (Math.random() * 10 - 5), r: 4 + Math.random() * 4, v: -2.2, g: true });
          }
        });
        coins = coins.filter((c) => !c.got);
      }

      drawBackground();
      drawCoins();
      drawDust();
      obstacles.forEach(drawObstacle);
      if (state === 'idle') drawGear(gear.x, gear.y - Math.sin(t * 0.12) * 4, gear.w, Math.sin(t * 0.08) * 0.15, false);
      else drawGear(gear.x, gear.y, gear.w, gear.angle, state === 'dead');
      drawHud();
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = 820 * dpr;
      canvas.height = 300 * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    let raf = 0;
    function drawLoop() { step(); raf = requestAnimationFrame(drawLoop); }

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) step();
    else drawLoop();

    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        if (state === 'dead') reset();
        jump();
      }
    };
    const onPointer = () => {
      if (state === 'dead') reset();
      jump();
    };
    const onRestart = () => reset();

    document.addEventListener('keydown', onKey);
    canvas.addEventListener('pointerdown', onPointer);
    window.addEventListener('resize', resize);
    resize();
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) restartBtn.addEventListener('click', onRestart);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      canvas.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('resize', resize);
      if (restartBtn) restartBtn.removeEventListener('click', onRestart);
    };
  }, []);

  return (
    <SiteShell
      current=""
      cta="home"
      title="404 | Page Not Found | Zone 7 Rotaract 3292"
      css={pageCss}
    >
      <div className="blob b1"></div>
      <div className="blob b2"></div>
      <main>
        <div className="code">404</div>
        <h1>This page got buried in paperwork.</h1>
        <p className="sub">Not all heroes avoid the paperwork pile. Help the Rotaract gear jump over it and run home. Press space, tap, or click to jump.</p>

        <div className="game-card">
          <div className="game-hint">
            <span><b>Jump</b> the paperwork, grab the 🪙 coins</span>
            <span>Score <b id="scoreNow" ref={scoreRef}>0</b> · Best <b id="bestNow" ref={bestNowRef}>0</b></span>
          </div>
          <canvas id="game" width="820" height="300" ref={canvasRef} aria-label="Jumping gear game"></canvas>
          <div className="game-foot">
            <span className="best">🏆 Best run: <span id="bestVal" ref={bestValRef}>0</span>m</span>
            <button className="restart" id="restartBtn">Run again</button>
          </div>
        </div>

        <div className="links">
          <Link className="btn primary" to="/">Back Home</Link>
          <Link className="btn ghost" to="/tutorials">Tutorials</Link>
          <Link className="btn ghost" to="/handbook">Handbook</Link>
          <Link className="btn ghost" to="/club-guides">Guides for Clubs</Link>
        </div>
        <div id="redirecting">Taking you to the right page...</div>
      </main>
      <footer>© 2026 Zone 7, Rotaract District 3292 Nepal-Bhutan. The zone is right here; the page just wasn't.</footer>
    </SiteShell>
  );
}
