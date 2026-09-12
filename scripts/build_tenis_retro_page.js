const fs = require('fs');
const path = require('path');
const { getHeaderHtml, getHeaderCss } = require('./common_header');

function generateTenisRetroHtml() {
  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Tenis Retro 1972: Duelo de Palas',
    description: 'El legendario enfrentamiento arcade de palas y pelota de 1972 que inició la era del videojuego comercial, fielmente recreado a 60 FPS con física de rebote angular, aceleración por peloteo, modo 1P vs IA (3 dificultades), modo 2P local y sonido procedural 8-bit.',
    url: 'https://tusdesvarios.com/juego-tenis-retro.html',
    genre: ['Arcade', 'Sports', 'Table Tennis', 'Retro Arcade'],
    playMode: ['SinglePlayer', 'MultiPlayer'],
    applicationCategory: 'Game',
    inLanguage: 'es',
    image: 'https://tusdesvarios.com/images/games/portada_tenis_retro.jpg',
    publisher: {
      '@type': 'Organization',
      name: 'Tus Desvaríos',
      url: 'https://tusdesvarios.com'
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: 'https://tusdesvarios.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Desvaríos Retro',
        item: 'https://tusdesvarios.com/desvarios-retro.html'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Tenis Retro 1972',
        item: 'https://tusdesvarios.com/juego-tenis-retro.html'
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tenis Retro 1972 (Duelo de Palas) — Arcade Clásico Gratis | TusDesvarios.com</title>
  <meta name="description" content="Juega gratis a Tenis Retro 1972: el mítico arcade de palas y pelota en blanco y negro a 60 FPS con modos 1P vs IA y 2P local, física angular y sonido 8-bit.">
  <meta name="keywords" content="juego estilo pong antiguo gratis, juego de tenis retro 1972, juego de palas arcade, tenis retro dos jugadores, juego clasico blanco y negro, tus desvarios">
  
  <link rel="canonical" href="https://tusdesvarios.com/juego-tenis-retro.html">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Tenis Retro 1972 (Duelo de Palas) | Tus Desvaríos">
  <meta property="og:description" content="El legendario arcade de palas y pelota de 1972 a 60 FPS. Juega gratis en tu navegador.">
  <meta property="og:url" content="https://tusdesvarios.com/juego-tenis-retro.html">
  <meta property="og:image" content="images/games/portada_tenis_retro.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Tenis Retro 1972 — Arcade Clásico Gratis">
  <meta name="twitter:description" content="Duelo de palas y pelota en blanco y negro a 60 FPS con física angular y sonido procedural.">
  <meta name="twitter:image" content="images/games/portada_tenis_retro.jpg">

  <script type="application/ld+json">
${JSON.stringify(gameSchema, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(breadcrumbSchema, null, 2)}
  </script>

  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>

  <style>
    ${getHeaderCss()}

    :root {
      --bg-dark: #05070d;
      --bg-surface: #0e1424;
      --bg-card: rgba(18, 24, 38, 0.88);
      --border-slate: rgba(148, 163, 184, 0.25);
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .main-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 1.5rem 1rem 3rem;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .game-header {
      text-align: center;
      margin-bottom: 1.2rem;
    }

    .game-title {
      font-family: 'Cinzel', serif;
      font-size: clamp(1.8rem, 4vw, 2.4rem);
      font-weight: 900;
      letter-spacing: 1px;
      color: #ffffff;
      margin-bottom: 0.3rem;
    }

    .game-subtitle {
      color: var(--text-muted);
      font-size: 0.86rem;
    }

    .toolbar {
      width: 100%;
      max-width: 640px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
      background: var(--bg-card);
      border: 1px solid var(--border-slate);
      border-radius: 12px;
      padding: 0.6rem 1rem;
      margin-bottom: 0.75rem;
      box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    }

    .btn-tool {
      background: #1e293b;
      border: 1px solid rgba(255,255,255,0.15);
      color: #f8fafc;
      font-size: 0.78rem;
      font-weight: 700;
      padding: 0.4rem 0.65rem;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      transition: all 0.15s ease;
    }
    .btn-tool:hover {
      background: #334155;
    }

    .canvas-wrapper {
      position: relative;
      background: #000000;
      border: 2px solid #334155;
      border-radius: 14px;
      overflow: hidden;
      width: 100%;
      max-width: 640px;
      aspect-ratio: 16 / 10;
      box-shadow: 0 10px 30px rgba(0,0,0,0.7);
      touch-action: none;
      cursor: ns-resize;
    }

    #board-canvas {
      width: 100%;
      height: 100%;
      display: block;
    }

    .overlay-modal {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.82);
      backdrop-filter: blur(4px);
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.8rem;
      z-index: 20;
      text-align: center;
      padding: 1.5rem;
    }

    .btn-cta {
      background: #ffffff;
      color: #000000;
      font-weight: 800;
      padding: 0.65rem 1.4rem;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      font-size: 0.92rem;
      transition: all 0.2s ease;
    }
    .btn-cta:hover {
      background: #e2e8f0;
      transform: translateY(-1px);
    }

    .instructions-text {
      font-size: 0.76rem;
      color: var(--text-muted);
      text-align: center;
      margin-top: 0.8rem;
      max-width: 640px;
      line-height: 1.5;
    }

    /* Modal Reglas */
    .modal-help-dialog {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.75);
      backdrop-filter: blur(4px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 100;
      padding: 1rem;
    }
    .modal-help-content {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 16px;
      max-width: 440px;
      width: 100%;
      padding: 1.5rem;
      box-shadow: 0 10px 40px rgba(0,0,0,0.8);
    }
  </style>
</head>
<body>
  ${getHeaderHtml()}

  <div class="main-container">
    <div class="game-header">
      <h1 class="game-title">Tenis Retro 1972</h1>
      <p class="game-subtitle">El mítico enfrentamiento arcade de palas y pelota que dio origen al videojuego</p>
    </div>

    <!-- Barra de Herramientas -->
    <div class="toolbar">
      <div style="display:flex; align-items:center; gap:0.4rem;">
        <a href="desvarios-retro.html" class="btn-tool" style="text-decoration:none;">⬅ Arcade</a>
        <span style="font-size:0.8rem; color:#475569;">|</span>
        <span style="font-size:0.75rem; font-family:monospace; color:#4ade80; font-weight:700;">
          PELOTEO: <span id="disp-rally">0</span>
        </span>
      </div>

      <div style="display:flex; align-items:center; gap:0.4rem;">
        <!-- Selector 1P / 2P -->
        <button id="btn-mode" class="btn-tool" title="Cambiar modo de juego">👤 1P</button>
        <!-- Selector Dificultad -->
        <button id="btn-diff" class="btn-tool" style="color:#fde047;" title="Dificultad IA">Arcade</button>
        <!-- Selector Paleta CRT -->
        <button id="btn-palette" class="btn-tool" style="color:#38bdf8;" title="Monitor CRT">📺 B/N 1972</button>
        <!-- Sonido -->
        <button id="btn-sound" class="btn-tool" title="Sonido">🔊</button>
        <!-- Pausa -->
        <button id="btn-pause" class="btn-tool" title="Pausa">⏸</button>
        <!-- Reglas -->
        <button id="btn-help" class="btn-tool" title="Reglas">❓</button>
      </div>
    </div>

    <!-- Canvas y Modales -->
    <main class="canvas-wrapper">
      <canvas id="board-canvas" width="640" height="400"></canvas>

      <!-- Overlay Pausa -->
      <div id="overlay-pause" class="overlay-modal">
        <h2 style="font-size:1.6rem; color:#facc15; font-weight:800; font-family:monospace;">PAUSA</h2>
        <p style="color:#94a3b8; font-size:0.85rem;">Presiona [P] o [Espacio] para reanudar</p>
        <button id="btn-resume" class="btn-cta">Reanudar</button>
      </div>

      <!-- Overlay Game Over -->
      <div id="overlay-gameover" class="overlay-modal">
        <span style="font-size:2.8rem;">🏆</span>
        <h2 id="winner-title" style="font-size:1.6rem; font-weight:900; font-family:monospace; color:#ffffff;">¡VICTORIA!</h2>
        <p id="winner-score" style="color:#cbd5e1; font-size:1.1rem; font-family:monospace; font-weight:700;">7 — 3</p>
        <p id="winner-rally" style="color:#4ade80; font-size:0.8rem; font-family:monospace;">Peloteo más largo: 14 golpes</p>
        <button id="btn-restart" class="btn-cta" style="margin-top:0.5rem;">🔄 Jugar Otra Partida</button>
      </div>
    </main>

    <!-- Barra inferior: Objetivo y Reinicio -->
    <div style="width:100%; max-width:640px; display:flex; justify-content:space-between; align-items:center; margin-top:0.6rem; padding:0 0.2rem;">
      <div style="display:flex; align-items:center; gap:0.4rem; font-size:0.75rem; color:#94a3b8; font-weight:700;">
        <span>Objetivo:</span>
        <button id="tgt-5" class="btn-tool" style="padding:0.2rem 0.5rem;">5 pts</button>
        <button id="tgt-7" class="btn-tool" style="padding:0.2rem 0.5rem; background:#ffffff; color:#000;">7 pts</button>
        <button id="tgt-11" class="btn-tool" style="padding:0.2rem 0.5rem;">11 pts</button>
      </div>
      <button id="btn-restart-bottom" class="btn-tool">🔄 Reiniciar</button>
    </div>

    <div class="instructions-text">
      ⌨️ <strong>Teclado:</strong> J1: [W / S] · J2 (en 2P): [Flecha Arriba / Abajo] · [Espacio/P]: Pausa · 🖱️ <strong>Ratón:</strong> Mueve el cursor arriba/abajo sobre la pantalla para controlar la pala · 📱 <strong>Táctil:</strong> Desliza el dedo verticalmente.
    </div>
  </div>

  <!-- Modal Ayuda -->
  <div id="modal-help" class="modal-help-dialog" onclick="document.getElementById('modal-help').style.display='none'">
    <div class="modal-help-content" onclick="event.stopPropagation()">
      <h3 style="font-size:1.25rem; color:#ffffff; margin-bottom:0.8rem; font-weight:800; font-family:monospace;">
        🏓 Reglas de Tenis Retro 1972
      </h3>
      <ul style="font-size:0.86rem; color:#cbd5e1; line-height:1.6; padding-left:1.2rem; margin-bottom:1.2rem;">
        <li><strong>Física Angular:</strong> Golpear la pelota con los extremos superior o inferior de la pala produce un tiro con ángulo agudo; golpearla con el centro produce un tiro directo y veloz.</li>
        <li><strong>Aceleración por Peloteo:</strong> Cada devolución incrementa gradualmente la velocidad de la bola, aumentando la tensión en cada punto.</li>
        <li><strong>Modos de Juego:</strong> 1 Jugador contra la IA (3 dificultades ajustables) o 2 Jugadores local compartiendo teclado o pantalla táctil.</li>
        <li><strong>Monitores CRT:</strong> Cambia de estilo entre Blanco y Negro 1972, Fósforo Verde, Fósforo Ámbar y Ciber Neón.</li>
      </ul>
      <button onclick="document.getElementById('modal-help').style.display='none'" class="btn-cta" style="width:100%;">¡Entendido!</button>
    </div>
  </div>

  <script>
    (function() {
      const WIDTH = 640;
      const HEIGHT = 400;
      const PADDLE_WIDTH = 12;
      const PADDLE_HEIGHT = 64;
      const BALL_SIZE = 12;

      const PALETTES = {
        classic: { label: '📺 B/N 1972', bg: '#05070d', p1: '#ffffff', p2: '#ffffff', ball: '#ffffff', net: 'rgba(255,255,255,0.45)' },
        green: { label: '📺 Fósforo Verde', bg: '#021206', p1: '#4ade80', p2: '#4ade80', ball: '#86efac', net: 'rgba(34,197,94,0.45)' },
        amber: { label: '📺 Fósforo Ámbar', bg: '#140a02', p1: '#fbbf24', p2: '#fbbf24', ball: '#fde68a', net: 'rgba(245,158,11,0.45)' },
        neon: { label: '📺 Ciber Neón', bg: '#070a14', p1: '#38bdf8', p2: '#f43f5e', ball: '#facc15', net: 'rgba(56,189,248,0.35)' }
      };

      let currentPalette = 'classic';
      let gameMode = '1P';
      let difficulty = 'arcade';
      let targetScore = 7;
      let score1 = 0;
      let score2 = 0;
      let rallyCount = 0;
      let maxRally = 0;
      let isPaused = false;
      let isGameOver = false;
      let soundEnabled = true;
      let audioCtx = null;

      const p1 = { x: 28, y: HEIGHT / 2 - PADDLE_HEIGHT / 2, speed: 6.5 };
      const p2 = { x: WIDTH - 28 - PADDLE_WIDTH, y: HEIGHT / 2 - PADDLE_HEIGHT / 2, speed: 6.5 };
      const ball = { x: WIDTH / 2 - BALL_SIZE / 2, y: HEIGHT / 2 - BALL_SIZE / 2, vx: 5.0, vy: 2.0, speed: 5.2, serving: true, serveTimer: 45 };
      const keys = {};
      let particles = [];

      const canvas = document.getElementById('board-canvas');
      const ctx = canvas.getContext('2d');

      try {
        const savedRally = localStorage.getItem('desvarios_tenis_retro_max_rally');
        if (savedRally) maxRally = parseInt(savedRally, 10);
      } catch(e) {}

      function playSound(type) {
        if (!soundEnabled) return;
        try {
          if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContextClass();
          }
          if (audioCtx.state === 'suspended') audioCtx.resume();
          const now = audioCtx.currentTime;

          if (type === 'hitPaddle') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(240, now);
            osc.frequency.exponentialRampToValueAtTime(160, now + 0.05);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.05);
          } else if (type === 'hitWall') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(460, now);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.04);
          } else if (type === 'score') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(140, now);
            gain.gain.setValueAtTime(0.14, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.25);
          } else if (type === 'win') {
            [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.type = 'square';
              osc.frequency.setValueAtTime(freq, now + idx * 0.08);
              gain.gain.setValueAtTime(0.12, now + idx * 0.08);
              gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.16);
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.start(now + idx * 0.08);
              osc.stop(now + idx * 0.08 + 0.16);
            });
          }
        } catch(e) {}
      }

      function resetBall(towardsPlayer) {
        const angle = (Math.random() * 0.6 - 0.3);
        const dir = towardsPlayer === 1 ? -1 : 1;
        const initialSpeed = 5.2;

        ball.x = WIDTH / 2 - BALL_SIZE / 2;
        ball.y = HEIGHT / 2 - BALL_SIZE / 2;
        ball.vx = Math.cos(angle) * initialSpeed * dir;
        ball.vy = Math.sin(angle) * initialSpeed;
        ball.speed = initialSpeed;
        ball.serving = true;
        ball.serveTimer = 45;

        rallyCount = 0;
        document.getElementById('disp-rally').textContent = rallyCount;
      }

      function restartGame() {
        score1 = 0;
        score2 = 0;
        isGameOver = false;
        isPaused = false;
        particles = [];
        p1.y = HEIGHT / 2 - PADDLE_HEIGHT / 2;
        p2.y = HEIGHT / 2 - PADDLE_HEIGHT / 2;
        document.getElementById('overlay-pause').style.display = 'none';
        document.getElementById('overlay-gameover').style.display = 'none';
        resetBall(1);
      }

      function createSparks(x, y, color, count) {
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = Math.random() * 3 + 1;
          particles.push({
            x, y,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            color,
            alpha: 1,
            size: Math.random() * 2.5 + 1.5
          });
        }
      }

      // Teclado
      window.addEventListener('keydown', (e) => {
        if (e.key === 'p' || e.key === 'P' || e.key === 'Escape' || e.key === ' ') {
          isPaused = !isPaused;
          document.getElementById('overlay-pause').style.display = isPaused ? 'flex' : 'none';
          return;
        }
        keys[e.key] = true;
      });

      window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
      });

      // Ratón
      canvas.addEventListener('mousemove', (e) => {
        if (isPaused || isGameOver) return;
        const rect = canvas.getBoundingClientRect();
        const scaleY = HEIGHT / rect.height;
        const mouseY = (e.clientY - rect.top) * scaleY;
        p1.y = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, mouseY - PADDLE_HEIGHT / 2));
      });

      // Táctil
      canvas.addEventListener('touchmove', (e) => {
        if (isPaused || isGameOver) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = WIDTH / rect.width;
        const scaleY = HEIGHT / rect.height;

        for (let i = 0; i < e.touches.length; i++) {
          const touch = e.touches[i];
          const touchX = (touch.clientX - rect.left) * scaleX;
          const touchY = (touch.clientY - rect.top) * scaleY;

          if (touchX < WIDTH / 2) {
            p1.y = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, touchY - PADDLE_HEIGHT / 2));
          } else if (gameMode === '2P') {
            p2.y = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, touchY - PADDLE_HEIGHT / 2));
          }
        }
      }, { passive: true });

      // Botones Toolbar
      document.getElementById('btn-mode').addEventListener('click', () => {
        gameMode = gameMode === '1P' ? '2P' : '1P';
        document.getElementById('btn-mode').textContent = gameMode === '1P' ? '👤 1P' : '👥 2P';
        document.getElementById('btn-diff').style.display = gameMode === '1P' ? 'inline-flex' : 'none';
        restartGame();
      });

      document.getElementById('btn-diff').addEventListener('click', () => {
        if (difficulty === 'novato') difficulty = 'arcade';
        else if (difficulty === 'arcade') difficulty = 'maestro';
        else difficulty = 'novato';
        document.getElementById('btn-diff').textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
      });

      document.getElementById('btn-palette').addEventListener('click', () => {
        const palKeys = Object.keys(PALETTES);
        const nextIdx = (palKeys.indexOf(currentPalette) + 1) % palKeys.length;
        currentPalette = palKeys[nextIdx];
        document.getElementById('btn-palette').textContent = PALETTES[currentPalette].label;
      });

      document.getElementById('btn-sound').addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        document.getElementById('btn-sound').textContent = soundEnabled ? '🔊' : '🔇';
      });

      document.getElementById('btn-pause').addEventListener('click', () => {
        isPaused = !isPaused;
        document.getElementById('overlay-pause').style.display = isPaused ? 'flex' : 'none';
      });

      document.getElementById('btn-resume').addEventListener('click', () => {
        isPaused = false;
        document.getElementById('overlay-pause').style.display = 'none';
      });

      document.getElementById('btn-help').addEventListener('click', () => {
        document.getElementById('modal-help').style.display = 'flex';
      });

      document.getElementById('btn-restart').addEventListener('click', restartGame);
      document.getElementById('btn-restart-bottom').addEventListener('click', restartGame);

      // Botones de Objetivo
      [5, 7, 11].forEach(pts => {
        document.getElementById('tgt-' + pts).addEventListener('click', () => {
          targetScore = pts;
          [5, 7, 11].forEach(p => {
            const el = document.getElementById('tgt-' + p);
            if (p === pts) {
              el.style.background = '#ffffff';
              el.style.color = '#000000';
            } else {
              el.style.background = '#1e293b';
              el.style.color = '#f8fafc';
            }
          });
          restartGame();
        });
      });

      // Loop Principal a 60 FPS
      function gameLoop() {
        requestAnimationFrame(gameLoop);

        const colors = PALETTES[currentPalette];

        if (!isPaused && !isGameOver) {
          // Movimiento teclado P1
          if (keys['w'] || keys['W']) p1.y = Math.max(0, p1.y - p1.speed);
          if (keys['s'] || keys['S']) p1.y = Math.min(HEIGHT - PADDLE_HEIGHT, p1.y + p1.speed);

          // Movimiento P2
          if (gameMode === '2P') {
            if (keys['ArrowUp']) p2.y = Math.max(0, p2.y - p2.speed);
            if (keys['ArrowDown']) p2.y = Math.min(HEIGHT - PADDLE_HEIGHT, p2.y + p2.speed);
          } else {
            const p2Center = p2.y + PADDLE_HEIGHT / 2;
            const ballCenter = ball.y + BALL_SIZE / 2;
            let targetY = ballCenter;

            let aiSpeed = 4.2;
            let reactionDist = WIDTH * 0.35;

            if (difficulty === 'novato') {
              aiSpeed = 3.6;
              reactionDist = WIDTH * 0.45;
              targetY += Math.sin(Date.now() * 0.003) * 16;
            } else if (difficulty === 'arcade') {
              aiSpeed = 5.2;
              reactionDist = WIDTH * 0.25;
              targetY += Math.sin(Date.now() * 0.002) * 6;
            } else {
              aiSpeed = 7.0;
              reactionDist = 0;
              if (ball.vx > 0) {
                const timeToReach = (p2.x - ball.x) / ball.vx;
                let predictedY = ball.y + ball.vy * timeToReach;
                while (predictedY < 0 || predictedY > HEIGHT - BALL_SIZE) {
                  if (predictedY < 0) predictedY = -predictedY;
                  else if (predictedY > HEIGHT - BALL_SIZE) predictedY = 2 * (HEIGHT - BALL_SIZE) - predictedY;
                }
                targetY = predictedY + BALL_SIZE / 2;
              }
            }

            if (ball.vx > 0 || ball.x > reactionDist) {
              const diff = targetY - p2Center;
              if (Math.abs(diff) > 4) {
                const move = Math.min(aiSpeed, Math.abs(diff)) * Math.sign(diff);
                p2.y = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, p2.y + move));
              }
            }
          }

          // Saque
          if (ball.serving) {
            ball.serveTimer--;
            if (ball.serveTimer <= 0) ball.serving = false;
          } else {
            ball.x += ball.vx;
            ball.y += ball.vy;

            // Paredes superior e inferior
            if (ball.y <= 0) {
              ball.y = 0;
              ball.vy = Math.abs(ball.vy);
              playSound('hitWall');
              createSparks(ball.x + BALL_SIZE / 2, 0, colors.p1, 6);
            } else if (ball.y + BALL_SIZE >= HEIGHT) {
              ball.y = HEIGHT - BALL_SIZE;
              ball.vy = -Math.abs(ball.vy);
              playSound('hitWall');
              createSparks(ball.x + BALL_SIZE / 2, HEIGHT, colors.p1, 6);
            }

            // Impacto Pala 1
            if (
              ball.vx < 0 &&
              ball.x <= p1.x + PADDLE_WIDTH &&
              ball.x + BALL_SIZE >= p1.x &&
              ball.y + BALL_SIZE >= p1.y &&
              ball.y <= p1.y + PADDLE_HEIGHT
            ) {
              const hitOffset = (ball.y + BALL_SIZE / 2) - (p1.y + PADDLE_HEIGHT / 2);
              const normalizedHit = hitOffset / (PADDLE_HEIGHT / 2);
              const maxAngle = Math.PI / 3.4;
              const bounceAngle = normalizedHit * maxAngle;

              ball.speed = Math.min(13.0, ball.speed + 0.28);
              ball.vx = Math.cos(bounceAngle) * ball.speed;
              ball.vy = Math.sin(bounceAngle) * ball.speed;
              ball.x = p1.x + PADDLE_WIDTH + 1;

              rallyCount++;
              document.getElementById('disp-rally').textContent = rallyCount;
              if (rallyCount > maxRally) {
                maxRally = rallyCount;
                try { localStorage.setItem('desvarios_tenis_retro_max_rally', maxRally.toString()); } catch(e) {}
              }

              playSound('hitPaddle');
              createSparks(ball.x, ball.y + BALL_SIZE / 2, colors.p1, 10);
            }

            // Impacto Pala 2
            if (
              ball.vx > 0 &&
              ball.x + BALL_SIZE >= p2.x &&
              ball.x <= p2.x + PADDLE_WIDTH &&
              ball.y + BALL_SIZE >= p2.y &&
              ball.y <= p2.y + PADDLE_HEIGHT
            ) {
              const hitOffset = (ball.y + BALL_SIZE / 2) - (p2.y + PADDLE_HEIGHT / 2);
              const normalizedHit = hitOffset / (PADDLE_HEIGHT / 2);
              const maxAngle = Math.PI / 3.4;
              const bounceAngle = normalizedHit * maxAngle;

              ball.speed = Math.min(13.0, ball.speed + 0.28);
              ball.vx = -Math.cos(bounceAngle) * ball.speed;
              ball.vy = Math.sin(bounceAngle) * ball.speed;
              ball.x = p2.x - BALL_SIZE - 1;

              rallyCount++;
              document.getElementById('disp-rally').textContent = rallyCount;
              if (rallyCount > maxRally) {
                maxRally = rallyCount;
                try { localStorage.setItem('desvarios_tenis_retro_max_rally', maxRally.toString()); } catch(e) {}
              }

              playSound('hitPaddle');
              createSparks(ball.x + BALL_SIZE, ball.y + BALL_SIZE / 2, colors.p2, 10);
            }

            // Puntos
            if (ball.x < -BALL_SIZE) {
              playSound('score');
              score2++;
              if (score2 >= targetScore) {
                isGameOver = true;
                playSound('win');
                document.getElementById('winner-title').textContent = gameMode === '1P' ? 'DERROTA ANTE LA IA' : '¡JUGADOR 2 GANA!';
                document.getElementById('winner-score').textContent = score1 + ' — ' + score2;
                document.getElementById('winner-rally').textContent = 'Peloteo más largo: ' + maxRally + ' golpes';
                document.getElementById('overlay-gameover').style.display = 'flex';
              } else {
                resetBall(1);
              }
            } else if (ball.x > WIDTH) {
              playSound('score');
              score1++;
              if (score1 >= targetScore) {
                isGameOver = true;
                playSound('win');
                if (window.confetti) confetti({ particleCount: 70, spread: 90, origin: { y: 0.6 } });
                document.getElementById('winner-title').textContent = gameMode === '1P' ? '¡VICTORIA ARROLLADORA!' : '¡JUGADOR 1 GANA!';
                document.getElementById('winner-score').textContent = score1 + ' — ' + score2;
                document.getElementById('winner-rally').textContent = 'Peloteo más largo: ' + maxRally + ' golpes';
                document.getElementById('overlay-gameover').style.display = 'flex';
              } else {
                resetBall(2);
              }
            }
          }
        }

        // Renderizado
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // Red central
        ctx.strokeStyle = colors.net;
        ctx.lineWidth = 6;
        ctx.setLineDash([12, 12]);
        ctx.beginPath();
        ctx.moveTo(WIDTH / 2, 0);
        ctx.lineTo(WIDTH / 2, HEIGHT);
        ctx.stroke();
        ctx.setLineDash([]);

        // Marcador digital
        ctx.fillStyle = colors.p1;
        ctx.font = '900 54px "Courier New", Courier, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(score1.toString(), WIDTH / 2 - 80, 24);

        ctx.fillStyle = colors.p2;
        ctx.fillText(score2.toString(), WIDTH / 2 + 80, 24);

        // Palas
        ctx.fillStyle = colors.p1;
        ctx.fillRect(p1.x, p1.y, PADDLE_WIDTH, PADDLE_HEIGHT);

        ctx.fillStyle = colors.p2;
        ctx.fillRect(p2.x, p2.y, PADDLE_WIDTH, PADDLE_HEIGHT);

        // Pelota
        ctx.fillStyle = colors.ball;
        ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);

        // Partículas
        for (let i = particles.length - 1; i >= 0; i--) {
          const part = particles[i];
          part.x += part.vx;
          part.y += part.vy;
          part.alpha -= 0.04;
          if (part.alpha <= 0) {
            particles.splice(i, 1);
          } else {
            ctx.save();
            ctx.globalAlpha = part.alpha;
            ctx.fillStyle = part.color;
            ctx.fillRect(part.x, part.y, part.size, part.size);
            ctx.restore();
          }
        }
      }

      requestAnimationFrame(gameLoop);
      resetBall(1);
    })();
  </script>
</body>
</html>`;
}

const rootOut = path.join(__dirname, '..', 'juego-tenis-retro.html');
const pubOut = path.join(__dirname, '..', 'public', 'juego-tenis-retro.html');

const htmlContent = generateTenisRetroHtml();
fs.writeFileSync(rootOut, htmlContent, 'utf8');
fs.writeFileSync(pubOut, htmlContent, 'utf8');

console.log('Successfully generated juego-tenis-retro.html in root and public!');
