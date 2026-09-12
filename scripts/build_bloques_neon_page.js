const fs = require('fs');
const path = require('path');
const { getHeaderHtml, getHeaderCss } = require('./common_header');

function generateBloquesNeonHtml() {
  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Bloques Neón (Matriz Cuántica)',
    description: 'El clásico juego de caída de bloques y encaje geométrico reinventado con estética synthwave neón, 60 FPS, aceleración progresiva, reserva cuántica y sonido 8-bit.',
    url: 'https://tusdesvarios.com/juego-bloques-neon.html',
    genre: ['Arcade', 'Puzzle', 'Falling Blocks', 'Retro Arcade'],
    playMode: 'SinglePlayer',
    applicationCategory: 'Game',
    inLanguage: 'es',
    image: 'https://tusdesvarios.com/images/games/portada_bloques_neon.jpg',
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
        name: 'Bloques Neón',
        item: 'https://tusdesvarios.com/juego-bloques-neon.html'
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bloques Neón (Matriz Cuántica) — Puzle Arcade Retro Gratis | TusDesvarios.com</title>
  <meta name="description" content="Juega gratis a Bloques Neón: el clásico arcade de caída de bloques reinventado con 60 FPS, estética synthwave neón, reserva cuántica, partículas y sonido 8-bit.">
  <meta name="keywords" content="juego de bloques gratis, puzle de bloques online, bloques retro arcade, juego caida de bloques, bloques neon synthwave, tus desvarios">
  
  <link rel="canonical" href="https://tusdesvarios.com/juego-bloques-neon.html">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Bloques Neón (Matriz Cuántica) | Tus Desvaríos">
  <meta property="og:description" content="Alinea módulos geométricos, activa pulsos cuánticos y desafía a la gravedad en una cabina arcade retro.">
  <meta property="og:url" content="https://tusdesvarios.com/juego-bloques-neon.html">
  <meta property="og:image" content="images/games/portada_bloques_neon.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Bloques Neón — Puzle Arcade Retro Gratis">
  <meta name="twitter:description" content="El clásico arcade de caída de bloques con estética synthwave, 60 FPS y sonido 8-bit.">
  <meta name="twitter:image" content="images/games/portada_bloques_neon.jpg">

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
      --bg-dark: #070a12;
      --bg-surface: #0e1424;
      --bg-card: rgba(18, 24, 38, 0.88);
      --border-cyan: rgba(56, 189, 248, 0.35);
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --neon-cyan: #38bdf8;
      --neon-yellow: #facc15;
      --neon-green: #4ade80;
      --neon-rose: #f43f5e;
      --neon-purple: #c084fc;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: linear-gradient(180deg, var(--bg-dark) 0%, #0c1220 100%);
      color: var(--text-main);
      font-family: 'Inter', -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .game-page-container {
      max-width: 860px;
      margin: 0 auto;
      padding: 1.2rem 1rem 3rem;
      width: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .nav-bar {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .btn-nav {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 600;
      padding: 0.45rem 0.85rem;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      transition: all 0.2s;
    }
    .btn-nav:hover {
      background: rgba(56, 189, 248, 0.15);
      border-color: var(--neon-cyan);
      color: #fff;
    }

    .btn-tool {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: var(--text-muted);
      padding: 0.45rem 0.75rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.84rem;
      font-weight: 600;
      transition: all 0.2s;
    }
    .btn-tool:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .game-header {
      text-align: center;
      margin-bottom: 1.25rem;
    }
    .game-title {
      font-family: 'Cinzel', serif;
      font-size: clamp(1.5rem, 3.5vw, 2.2rem);
      font-weight: 800;
      color: var(--neon-cyan);
      text-shadow: 0 0 25px rgba(56, 189, 248, 0.4);
      margin-bottom: 0.25rem;
    }
    .game-subtitle {
      color: var(--text-muted);
      font-size: 0.88rem;
    }

    .game-layout {
      display: flex;
      gap: 1.2rem;
      align-items: flex-start;
      justify-content: center;
      flex-wrap: wrap;
      width: 100%;
    }

    .side-panel {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      width: 125px;
    }

    .panel-box {
      background: var(--bg-card);
      border: 1px solid var(--border-cyan);
      border-radius: 12px;
      padding: 0.75rem;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    }
    .panel-label {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .panel-value {
      font-size: 1.25rem;
      font-weight: 800;
      color: #fff;
      margin-top: 0.2rem;
    }

    .canvas-wrapper {
      position: relative;
      background: #0b0f19;
      border: 2px solid var(--border-cyan);
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 0 35px rgba(56, 189, 248, 0.25), inset 0 0 20px rgba(0,0,0,0.8);
    }

    #board-canvas {
      display: block;
    }

    .overlay-modal {
      position: absolute;
      inset: 0;
      background: rgba(7, 10, 18, 0.88);
      backdrop-filter: blur(6px);
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.8rem;
      padding: 1.5rem;
      text-align: center;
      z-index: 10;
    }

    .btn-cta {
      background: var(--neon-cyan);
      color: #070a12;
      border: none;
      padding: 0.7rem 1.6rem;
      border-radius: 9999px;
      font-weight: 800;
      cursor: pointer;
      font-size: 0.92rem;
      box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
      transition: transform 0.15s;
    }
    .btn-cta:hover {
      transform: scale(1.04);
    }

    .touch-controls {
      margin-top: 1.4rem;
      max-width: 440px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0 0.5rem;
    }
    .touch-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
    }
    .btn-touch {
      background: rgba(18, 24, 38, 0.9);
      border-radius: 10px;
      padding: 0.8rem 0.4rem;
      font-weight: 700;
      font-size: 0.84rem;
      cursor: pointer;
      touch-action: manipulation;
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #fff;
    }
    .btn-touch:active {
      transform: scale(0.96);
      background: rgba(56, 189, 248, 0.25);
    }

    .instructions-text {
      margin-top: 1.25rem;
      color: #64748b;
      font-size: 0.78rem;
      text-align: center;
      max-width: 560px;
      line-height: 1.5;
    }

    .modal-help-dialog {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(5px);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      z-index: 100;
    }
    .modal-help-content {
      background: #121826;
      border: 1px solid var(--border-cyan);
      border-radius: 16px;
      padding: 1.75rem;
      max-width: 480px;
      width: 100%;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
    }
  </style>
</head>
<body>
  ${getHeaderHtml('retro')}

  <div class="game-page-container">
    <div class="nav-bar">
      <a href="desvarios-retro.html" class="btn-nav">
        ← Volver a Arcade
      </a>
      <div style="display:flex; gap:0.5rem;">
        <button id="btn-sound" class="btn-tool" title="Sonido">🔊 Sonido</button>
        <button id="btn-help" class="btn-tool" title="Ayuda">❓ Reglas</button>
        <button id="btn-pause" class="btn-tool" title="Pausa">⏸️ Pausa</button>
      </div>
    </div>

    <header class="game-header">
      <h1 class="game-title">Bloques Neón: Matriz Cuántica</h1>
      <p class="game-subtitle">Alinea los módulos poliominós, desata combos cuánticos y pulveriza tu récord.</p>
    </header>

    <div class="game-layout">
      <!-- Panel Izquierdo -->
      <aside class="side-panel">
        <div class="panel-box">
          <span class="panel-label">Reserva [C]</span>
          <div style="display:flex; justify-content:center; margin-top:0.4rem;">
            <canvas id="hold-canvas" width="80" height="70" style="background:rgba(0,0,0,0.3); border-radius:6px;"></canvas>
          </div>
        </div>
        <div class="panel-box" style="border-color: rgba(250, 204, 21, 0.4);">
          <span class="panel-label" style="color:var(--neon-yellow);">🏆 RÉCORD</span>
          <div id="disp-highscore" class="panel-value">0</div>
        </div>
        <div class="panel-box">
          <span class="panel-label">NIVEL</span>
          <div id="disp-level" class="panel-value" style="color:var(--neon-cyan);">1</div>
        </div>
        <button id="btn-pulse" class="btn-cta" style="display:none; padding:0.55rem; font-size:0.75rem; width:100%; background:linear-gradient(135deg, #0284c7, #38bdf8);">
          ⚡ PULSO [Q]
        </button>
      </aside>

      <!-- Tablero Central -->
      <main class="canvas-wrapper">
        <canvas id="board-canvas" width="280" height="560"></canvas>

        <!-- Overlay Pausa -->
        <div id="overlay-pause" class="overlay-modal">
          <h2 style="font-size:1.6rem; color:var(--neon-yellow); font-weight:800;">PAUSA</h2>
          <button id="btn-resume" class="btn-cta">Reanudar</button>
        </div>

        <!-- Overlay Game Over -->
        <div id="overlay-gameover" class="overlay-modal">
          <span style="font-size:2.5rem;">💀</span>
          <h2 style="font-size:1.6rem; font-weight:800; color:var(--neon-rose);">MATRIZ SATURADA</h2>
          <p style="color:var(--text-muted); font-size:0.85rem;">Puntos conseguidos</p>
          <div id="gameover-score" style="font-size:2rem; font-weight:900; color:#fff;">0</div>
          <div id="new-record-msg" style="display:none; color:var(--neon-yellow); font-size:0.84rem; font-weight:700;">🌟 ¡Nuevo Récord Personal!</div>
          <button id="btn-restart" class="btn-cta" style="margin-top:0.4rem;">🔄 Jugar de Nuevo</button>
        </div>
      </main>

      <!-- Panel Derecho -->
      <aside class="side-panel">
        <div class="panel-box">
          <span class="panel-label">Siguiente</span>
          <div style="display:flex; justify-content:center; margin-top:0.4rem;">
            <canvas id="next-canvas" width="80" height="70" style="background:rgba(0,0,0,0.3); border-radius:6px;"></canvas>
          </div>
        </div>
        <div class="panel-box">
          <span class="panel-label">PUNTOS</span>
          <div id="disp-score" class="panel-value">0</div>
        </div>
        <div class="panel-box">
          <span class="panel-label">LÍNEAS</span>
          <div id="disp-lines" class="panel-value" style="color:var(--neon-green);">0</div>
        </div>
      </aside>
    </div>

    <!-- Controles Táctiles (Mobile) -->
    <div class="touch-controls">
      <div class="touch-row">
        <button id="touch-hold" class="btn-touch" style="color:var(--neon-purple); border-color:rgba(192, 132, 252, 0.4);">📥 Hold</button>
        <button id="touch-rotate" class="btn-touch" style="color:var(--neon-yellow); border-color:rgba(250, 204, 21, 0.4);">↻ Rotar</button>
        <button id="touch-harddrop" class="btn-touch" style="color:var(--neon-cyan); border-color:rgba(56, 189, 248, 0.4);">⚡ Drop</button>
      </div>
      <div class="touch-row">
        <button id="touch-left" class="btn-touch" style="color:#00f0ff;">◀ Izq</button>
        <button id="touch-down" class="btn-touch" style="color:var(--neon-green);">▼ Suave</button>
        <button id="touch-right" class="btn-touch" style="color:#00f0ff;">Der ▶</button>
      </div>
    </div>

    <div class="instructions-text">
      ⌨️ <strong>Teclado:</strong> [← / →] Mover · [↑ / W] Rotar · [↓ / S] Caída suave · [Espacio] Caída rápida · [C] Reservar pieza · [P] Pausa
    </div>
  </div>

  <!-- Modal Ayuda -->
  <div id="modal-help" class="modal-help-dialog" onclick="document.getElementById('modal-help').style.display='none'">
    <div class="modal-help-content" onclick="event.stopPropagation()">
      <h3 style="font-size:1.3rem; color:var(--neon-cyan); margin-bottom:0.8rem; font-weight:800;">
        Reglas de Bloques Neón
      </h3>
      <ul style="font-size:0.88rem; color:#cbd5e1; line-height:1.6; padding-left:1.2rem; margin-bottom:1.2rem;">
        <li><strong>Objetivo:</strong> Completa líneas horizontales enteras para desintegrarlas antes de que alcancen el techo de la matriz.</li>
        <li><strong>Módulo Bomba:</strong> Cada 18 piezas aparece un núcleo rojo que explota en un área de 3x3 al tocar el fondo.</li>
        <li><strong>Reserva [C]:</strong> Guarda un módulo para usarlo en el momento más oportuno.</li>
        <li><strong>Pulso Cuántico [Q]:</strong> Al subir de nivel obtienes un pulso que destruye la línea inferior más saturada.</li>
      </ul>
      <button onclick="document.getElementById('modal-help').style.display='none'" class="btn-cta" style="width:100%;">¡Entendido!</button>
    </div>
  </div>

  <script>
    (function() {
      const COLS = 10;
      const ROWS = 20;
      const BLOCK_SIZE = 28;

      const PIECES = [
        { name: 'I', shape: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], color: '#00f0ff', glow: 'rgba(0, 240, 255, 0.7)' },
        { name: 'O', shape: [[1,1],[1,1]], color: '#facc15', glow: 'rgba(250, 204, 21, 0.7)' },
        { name: 'T', shape: [[0,1,0],[1,1,1],[0,0,0]], color: '#c084fc', glow: 'rgba(192, 132, 252, 0.7)' },
        { name: 'S', shape: [[0,1,1],[1,1,0],[0,0,0]], color: '#4ade80', glow: 'rgba(74, 222, 128, 0.7)' },
        { name: 'Z', shape: [[1,1,0],[0,1,1],[0,0,0]], color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.7)' },
        { name: 'J', shape: [[1,0,0],[1,1,1],[0,0,0]], color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.7)' },
        { name: 'L', shape: [[0,0,1],[1,1,1],[0,0,0]], color: '#fb923c', glow: 'rgba(251, 146, 60, 0.7)' },
        { name: 'BOMB', shape: [[2]], color: '#e11d48', glow: 'rgba(225, 29, 72, 0.95)', isBomb: true }
      ];

      let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
      let activePiece = null;
      let nextPiece = PIECES[0];
      let holdPiece = null;
      let canHold = true;
      let piecesCount = 0;
      let score = 0;
      let highScore = 0;
      let lines = 0;
      let level = 1;
      let isGameOver = false;
      let isPaused = false;
      let soundEnabled = true;
      let dropCounter = 0;
      let lastTime = 0;
      let particles = [];
      let audioCtx = null;
      let pulseReady = false;

      const boardCanvas = document.getElementById('board-canvas');
      const bCtx = boardCanvas.getContext('2d');
      const holdCanvas = document.getElementById('hold-canvas');
      const nextCanvas = document.getElementById('next-canvas');

      try {
        const saved = localStorage.getItem('desvarios_bloques_neon_highscore');
        if (saved) {
          highScore = parseInt(saved, 10);
          document.getElementById('disp-highscore').textContent = highScore;
        }
      } catch(e){}

      function playSound(type) {
        if (!soundEnabled) return;
        try {
          if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          if (audioCtx.state === 'suspended') audioCtx.resume();
          const now = audioCtx.currentTime;

          if (type === 'move') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(280, now + 0.03);
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.03);
          } else if (type === 'rotate') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(660, now + 0.05);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.05);
          } else if (type === 'drop') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.06);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.06);
          } else if (type === 'clear') {
            [523.25, 659.25, 783.99].forEach((freq, idx) => {
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.type = 'triangle';
              osc.frequency.setValueAtTime(freq, now + idx * 0.04);
              gain.gain.setValueAtTime(0.1, now + idx * 0.04);
              gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.15);
              osc.connect(gain); gain.connect(audioCtx.destination);
              osc.start(now + idx * 0.04); osc.stop(now + idx * 0.04 + 0.15);
            });
          }
        } catch(e){}
      }

      function getRandomPiece() {
        piecesCount++;
        if (piecesCount % 18 === 0) return PIECES[7];
        const std = PIECES.slice(0, 7);
        return std[Math.floor(Math.random() * std.length)];
      }

      function checkCollision(shape, offsetX, offsetY) {
        for (let r = 0; r < shape.length; r++) {
          for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] !== 0) {
              const tx = offsetX + c;
              const ty = offsetY + r;
              if (tx < 0 || tx >= COLS || ty >= ROWS) return true;
              if (ty >= 0 && grid[ty][tx] !== null) return true;
            }
          }
        }
        return false;
      }

      function rotateMatrix(mat) {
        const N = mat.length;
        const res = Array.from({ length: N }, () => Array(N).fill(0));
        for (let r = 0; r < N; r++) {
          for (let c = 0; c < N; c++) {
            res[c][N - 1 - r] = mat[r][c];
          }
        }
        return res;
      }

      function createExplosion(x, y, color, count = 14) {
        for (let i = 0; i < count; i++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = Math.random() * 4 + 1.5;
          particles.push({
            x: x * BLOCK_SIZE + BLOCK_SIZE / 2,
            y: y * BLOCK_SIZE + BLOCK_SIZE / 2,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            color: color,
            alpha: 1,
            size: Math.random() * 3 + 2
          });
        }
      }

      function lockPiece() {
        if (!activePiece) return;

        if (activePiece.definition.isBomb) {
          playSound('clear');
          const cx = activePiece.x;
          const cy = activePiece.y;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const tx = cx + dx;
              const ty = cy + dy;
              if (tx >= 0 && tx < COLS && ty >= 0 && ty < ROWS) {
                if (grid[ty][tx] !== null) {
                  createExplosion(tx, ty, '#e11d48', 8);
                  grid[ty][tx] = null;
                }
              }
            }
          }
          score += 350;
        } else {
          for (let r = 0; r < activePiece.shape.length; r++) {
            for (let c = 0; c < activePiece.shape[r].length; c++) {
              if (activePiece.shape[r][c] !== 0) {
                const ty = activePiece.y + r;
                const tx = activePiece.x + c;
                if (ty >= 0 && ty < ROWS && tx >= 0 && tx < COLS) {
                  grid[ty][tx] = activePiece.definition.color;
                }
              }
            }
          }
          playSound('drop');
        }

        let cleared = 0;
        for (let r = ROWS - 1; r >= 0; r--) {
          if (grid[r].every(c => c !== null)) {
            cleared++;
            for (let c = 0; c < COLS; c++) {
              createExplosion(c, r, grid[r][c] || '#00f0ff', 4);
            }
            grid.splice(r, 1);
            grid.unshift(Array(COLS).fill(null));
            r++;
          }
        }

        if (cleared > 0) {
          playSound('clear');
          if (cleared >= 4 && window.confetti) {
            confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
          }
          const pts = [0, 100, 300, 500, 800];
          score += (pts[cleared] || cleared * 200) * level;
          lines += cleared;
          const nextLvl = Math.floor(lines / 10) + 1;
          if (nextLvl !== level) {
            level = nextLvl;
            pulseReady = true;
            document.getElementById('btn-pulse').style.display = 'block';
          }
        }

        document.getElementById('disp-score').textContent = score;
        document.getElementById('disp-lines').textContent = lines;
        document.getElementById('disp-level').textContent = level;

        canHold = true;
        const next = nextPiece;
        const sx = Math.floor((COLS - next.shape[0].length) / 2);

        if (checkCollision(next.shape, sx, 0)) {
          isGameOver = true;
          document.getElementById('gameover-score').textContent = score;
          if (score > highScore) {
            highScore = score;
            try { localStorage.setItem('desvarios_bloques_neon_highscore', highScore); } catch(e){}
            document.getElementById('disp-highscore').textContent = highScore;
            document.getElementById('new-record-msg').style.display = 'block';
          }
          document.getElementById('overlay-gameover').style.display = 'flex';
          return;
        }

        activePiece = { definition: next, shape: next.shape, x: sx, y: 0 };
        nextPiece = getRandomPiece();
      }

      function moveLeft() {
        if (isPaused || isGameOver || !activePiece) return;
        if (!checkCollision(activePiece.shape, activePiece.x - 1, activePiece.y)) {
          activePiece.x--;
          playSound('move');
        }
      }

      function moveRight() {
        if (isPaused || isGameOver || !activePiece) return;
        if (!checkCollision(activePiece.shape, activePiece.x + 1, activePiece.y)) {
          activePiece.x++;
          playSound('move');
        }
      }

      function moveDown() {
        if (isPaused || isGameOver || !activePiece) return;
        if (!checkCollision(activePiece.shape, activePiece.x, activePiece.y + 1)) {
          activePiece.y++;
          score += 1;
          document.getElementById('disp-score').textContent = score;
        } else {
          lockPiece();
        }
      }

      function rotate() {
        if (isPaused || isGameOver || !activePiece || activePiece.definition.isBomb) return;
        const rot = rotateMatrix(activePiece.shape);
        let off = 0;
        if (checkCollision(rot, activePiece.x, activePiece.y)) {
          if (!checkCollision(rot, activePiece.x - 1, activePiece.y)) off = -1;
          else if (!checkCollision(rot, activePiece.x + 1, activePiece.y)) off = 1;
          else if (!checkCollision(rot, activePiece.x - 2, activePiece.y)) off = -2;
          else if (!checkCollision(rot, activePiece.x + 2, activePiece.y)) off = 2;
          else return;
        }
        activePiece.x += off;
        activePiece.shape = rot;
        playSound('rotate');
      }

      function hardDrop() {
        if (isPaused || isGameOver || !activePiece) return;
        let d = 0;
        while (!checkCollision(activePiece.shape, activePiece.x, activePiece.y + d + 1)) {
          d++;
        }
        activePiece.y += d;
        score += d * 2;
        document.getElementById('disp-score').textContent = score;
        lockPiece();
      }

      function triggerHold() {
        if (isPaused || isGameOver || !canHold || !activePiece) return;
        canHold = false;
        playSound('move');
        if (!holdPiece) {
          holdPiece = activePiece.definition;
          const next = nextPiece;
          activePiece = { definition: next, shape: next.shape, x: Math.floor((COLS - next.shape[0].length) / 2), y: 0 };
          nextPiece = getRandomPiece();
        } else {
          const temp = holdPiece;
          holdPiece = activePiece.definition;
          activePiece = { definition: temp, shape: temp.shape, x: Math.floor((COLS - temp.shape[0].length) / 2), y: 0 };
        }
      }

      function triggerPulse() {
        if (!pulseReady || isPaused || isGameOver) return;
        pulseReady = false;
        document.getElementById('btn-pulse').style.display = 'none';
        playSound('clear');
        for (let r = ROWS - 1; r >= 0; r--) {
          if (grid[r].some(c => c !== null)) {
            for (let c = 0; c < COLS; c++) createExplosion(c, r, '#38bdf8', 6);
            grid.splice(r, 1);
            grid.unshift(Array(COLS).fill(null));
            score += 500;
            document.getElementById('disp-score').textContent = score;
            break;
          }
        }
      }

      function restart() {
        grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
        particles = [];
        piecesCount = 0;
        score = 0;
        lines = 0;
        level = 1;
        isGameOver = false;
        isPaused = false;
        holdPiece = null;
        canHold = true;
        pulseReady = false;

        document.getElementById('disp-score').textContent = 0;
        document.getElementById('disp-lines').textContent = 0;
        document.getElementById('disp-level').textContent = 1;
        document.getElementById('btn-pulse').style.display = 'none';
        document.getElementById('overlay-pause').style.display = 'none';
        document.getElementById('overlay-gameover').style.display = 'none';
        document.getElementById('new-record-msg').style.display = 'none';

        const fst = getRandomPiece();
        nextPiece = getRandomPiece();
        activePiece = { definition: fst, shape: fst.shape, x: Math.floor((COLS - fst.shape[0].length) / 2), y: 0 };
      }

      function drawNeonBlock(ctx, x, y, color, isBomb = false) {
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = color;
        ctx.fillRect(x + 2, y + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);

        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.fillRect(x + 2, y + 2, BLOCK_SIZE - 4, 3);
        ctx.fillRect(x + 2, y + 2, 3, BLOCK_SIZE - 4);

        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(x + 2, y + BLOCK_SIZE - 5, BLOCK_SIZE - 4, 3);
        ctx.fillRect(x + BLOCK_SIZE - 5, y + 2, 3, BLOCK_SIZE - 4);

        if (isBomb) {
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(x + BLOCK_SIZE / 2, y + BLOCK_SIZE / 2, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      function renderMini(canvas, piece) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!piece) return;

        const sz = 18;
        const shp = piece.shape;
        const ox = (canvas.width - shp[0].length * sz) / 2;
        const oy = (canvas.height - shp.length * sz) / 2;

        for (let r = 0; r < shp.length; r++) {
          for (let c = 0; c < shp[r].length; c++) {
            if (shp[r][c] !== 0) {
              ctx.save();
              ctx.fillStyle = piece.color;
              ctx.shadowColor = piece.color;
              ctx.shadowBlur = 6;
              ctx.fillRect(ox + c * sz + 1, oy + r * sz + 1, sz - 2, sz - 2);
              ctx.restore();
            }
          }
        }
      }

      function gameLoop(time) {
        requestAnimationFrame(gameLoop);
        const dt = time - lastTime;
        lastTime = time;

        const interval = Math.max(100, 800 - (level - 1) * 65);

        if (!isPaused && !isGameOver) {
          dropCounter += dt;
          if (dropCounter > interval) {
            dropCounter = 0;
            if (activePiece) {
              if (!checkCollision(activePiece.shape, activePiece.x, activePiece.y + 1)) {
                activePiece.y++;
              } else {
                lockPiece();
              }
            }
          }
        }

        bCtx.fillStyle = '#0b0f19';
        bCtx.fillRect(0, 0, boardCanvas.width, boardCanvas.height);

        bCtx.strokeStyle = 'rgba(255,255,255,0.04)';
        bCtx.lineWidth = 1;
        for (let c = 0; c <= COLS; c++) {
          bCtx.beginPath(); bCtx.moveTo(c * BLOCK_SIZE, 0); bCtx.lineTo(c * BLOCK_SIZE, ROWS * BLOCK_SIZE); bCtx.stroke();
        }
        for (let r = 0; r <= ROWS; r++) {
          bCtx.beginPath(); bCtx.moveTo(0, r * BLOCK_SIZE); bCtx.lineTo(COLS * BLOCK_SIZE, r * BLOCK_SIZE); bCtx.stroke();
        }

        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            if (grid[r][c]) drawNeonBlock(bCtx, c * BLOCK_SIZE, r * BLOCK_SIZE, grid[r][c]);
          }
        }

        if (activePiece && !isGameOver) {
          let gd = 0;
          while (!checkCollision(activePiece.shape, activePiece.x, activePiece.y + gd + 1)) gd++;
          if (gd > 0) {
            bCtx.save();
            bCtx.strokeStyle = activePiece.definition.glow;
            bCtx.lineWidth = 1.5;
            bCtx.setLineDash([3, 3]);
            for (let r = 0; r < activePiece.shape.length; r++) {
              for (let c = 0; c < activePiece.shape[r].length; c++) {
                if (activePiece.shape[r][c] !== 0) {
                  bCtx.strokeRect((activePiece.x + c) * BLOCK_SIZE + 2, (activePiece.y + gd + r) * BLOCK_SIZE + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
                }
              }
            }
            bCtx.restore();
          }

          for (let r = 0; r < activePiece.shape.length; r++) {
            for (let c = 0; c < activePiece.shape[r].length; c++) {
              if (activePiece.shape[r][c] !== 0) {
                drawNeonBlock(bCtx, (activePiece.x + c) * BLOCK_SIZE, (activePiece.y + r) * BLOCK_SIZE, activePiece.definition.color, activePiece.definition.isBomb);
              }
            }
          }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx; p.y += p.vy; p.alpha -= 0.025;
          if (p.alpha <= 0) particles.splice(i, 1);
          else {
            bCtx.save();
            bCtx.globalAlpha = p.alpha;
            bCtx.fillStyle = p.color;
            bCtx.beginPath(); bCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2); bCtx.fill();
            bCtx.restore();
          }
        }

        renderMini(nextCanvas, nextPiece);
        renderMini(holdCanvas, holdPiece);
      }

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
          isPaused = !isPaused;
          document.getElementById('overlay-pause').style.display = isPaused ? 'flex' : 'none';
          return;
        }
        if (isPaused || isGameOver) return;
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { e.preventDefault(); moveLeft(); }
        else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { e.preventDefault(); moveRight(); }
        else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { e.preventDefault(); moveDown(); }
        else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { e.preventDefault(); rotate(); }
        else if (e.key === ' ') { e.preventDefault(); hardDrop(); }
        else if (e.key === 'c' || e.key === 'C' || e.key === 'Shift') { e.preventDefault(); triggerHold(); }
        else if (e.key === 'q' || e.key === 'Q') { triggerPulse(); }
      });

      document.getElementById('btn-sound').onclick = () => {
        soundEnabled = !soundEnabled;
        document.getElementById('btn-sound').textContent = soundEnabled ? '🔊 Sonido' : '🔇 Mudo';
      };
      document.getElementById('btn-help').onclick = () => {
        document.getElementById('modal-help').style.display = 'flex';
      };
      document.getElementById('btn-pause').onclick = () => {
        isPaused = !isPaused;
        document.getElementById('overlay-pause').style.display = isPaused ? 'flex' : 'none';
      };
      document.getElementById('btn-resume').onclick = () => {
        isPaused = false;
        document.getElementById('overlay-pause').style.display = 'none';
      };
      document.getElementById('btn-restart').onclick = restart;
      document.getElementById('btn-pulse').onclick = triggerPulse;

      document.getElementById('touch-left').onclick = moveLeft;
      document.getElementById('touch-right').onclick = moveRight;
      document.getElementById('touch-down').onclick = moveDown;
      document.getElementById('touch-rotate').onclick = rotate;
      document.getElementById('touch-harddrop').onclick = hardDrop;
      document.getElementById('touch-hold').onclick = triggerHold;

      restart();
      requestAnimationFrame(gameLoop);
    })();
  </script>
</body>
</html>`;
}

// 1. Generate root HTML
const rootOut = path.join(__dirname, '..', 'juego-bloques-neon.html');
const pubOut = path.join(__dirname, '..', 'public', 'juego-bloques-neon.html');
const html = generateBloquesNeonHtml();

fs.writeFileSync(rootOut, html, 'utf8');
fs.writeFileSync(pubOut, html, 'utf8');
console.log('Successfully generated juego-bloques-neon.html in root and public!');

module.exports = { generateBloquesNeonHtml };
