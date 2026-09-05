const fs = require('fs');
const path = require('path');

const excusasRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'humor', 'excusas.json'), 'utf8'));
const oraculoRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'humor', 'oraculo.json'), 'utf8'));
const leyesRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'humor', 'leyes.json'), 'utf8'));
const pildorasRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'humor', 'pildoras.json'), 'utf8'));

function generateRobustHumorHtml() {
  const excusasJson = JSON.stringify(excusasRaw);
  const oraculoJson = JSON.stringify(oraculoRaw);
  const leyesJson = JSON.stringify(leyesRaw);
  const pildorasJson = JSON.stringify(pildorasRaw);

  // 1. Pre-render Excusas buttons (Single column, full width, readable font)
  let ambitosHtml = '';
  excusasRaw.ambitos.forEach((a, i) => {
    ambitosHtml += `<button id="amb-btn-${a.id}" onclick="setAmbito('${a.id}')" style="width:100%; text-align:left; font-size:0.92rem; padding:0.6rem 0.95rem; border-radius:var(--radius-sm); background:${i === 0 ? 'rgba(236, 72, 153, 0.25)' : 'rgba(255,255,255,0.03)'}; border:1.5px solid ${i === 0 ? '#ec4899' : 'rgba(255,255,255,0.08)'}; color:${i === 0 ? '#ffffff' : 'var(--text-secondary)'}; font-weight:${i === 0 ? '700' : '500'}; cursor:pointer; display:flex; align-items:center; gap:0.65rem; transition:all 0.16s ease; ${i === 0 ? 'box-shadow:0 0 14px rgba(236,72,153,0.35);' : ''}"><span style="font-size:1.15rem;">${a.icono}</span> <span>${a.nombre}</span></button>`;
  });

  let gravedadesHtml = '';
  excusasRaw.gravedades.forEach((g, i) => {
    gravedadesHtml += `<button id="grav-btn-${g.id}" onclick="setGravedad('${g.id}')" style="width:100%; text-align:left; font-size:0.92rem; padding:0.6rem 0.95rem; border-radius:var(--radius-sm); border:1.5px solid ${i === 0 ? g.color : 'rgba(255,255,255,0.08)'}; background:${i === 0 ? g.color + '25' : 'rgba(255,255,255,0.03)'}; color:${i === 0 ? '#ffffff' : 'var(--text-secondary)'}; font-weight:${i === 0 ? '700' : '500'}; cursor:pointer; display:flex; align-items:center; gap:0.65rem; transition:all 0.16s ease; ${i === 0 ? 'box-shadow:0 0 14px ' + g.color + '40;' : ''}"><span style="font-size:1.15rem;">${g.icono}</span> <span>${g.nombre}</span></button>`;
  });

  let tonosHtml = '';
  excusasRaw.tonos.forEach((t, i) => {
    tonosHtml += `<button id="tono-btn-${t.id}" onclick="setTono('${t.id}')" style="width:100%; text-align:left; font-size:0.92rem; padding:0.6rem 0.95rem; border-radius:var(--radius-sm); border:1.5px solid ${i === 0 ? '#f472b6' : 'rgba(255,255,255,0.08)'}; background:${i === 0 ? 'rgba(236,72,153,0.25)' : 'rgba(255,255,255,0.03)'}; color:${i === 0 ? '#ffffff' : 'var(--text-secondary)'}; font-weight:${i === 0 ? '700' : '500'}; cursor:pointer; display:flex; align-items:center; gap:0.65rem; transition:all 0.16s ease; ${i === 0 ? 'box-shadow:0 0 14px rgba(236,72,153,0.35);' : ''}"><span style="font-size:1.15rem;">${t.icono}</span> <span>${t.nombre}</span></button>`;
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Desvaríos de Humor — Consola Interactiva del Absurdo | Tus Desvaríos</title>
  <meta name="description" content="Generador de excusas infalible con medidor de credibilidad, oráculo del desvarío, leyes del caos y pensamientos de ducha.">
  <meta name="keywords" content="desvarios de humor, generador de excusas, oraculo del desvario, pensamientos de ducha, leyes de murphy, leyes del caos, satira cotidiana, tus desvarios">
  
  <link rel="canonical" href="https://tusdesvarios.com/desvarios-de-humor">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Desvaríos de Humor — Consola Interactiva del Absurdo">
  <meta property="og:description" content="Herramientas dinámicas de sátira con generador de excusas, oráculo de predicciones cósmicas, leyes del caos y pensamientos de ducha.">
  <meta property="og:url" content="https://tusdesvarios.com/desvarios-de-humor">
  <meta property="og:image" content="images/categories/desvarios-humor.jpg">

  <!-- Favicon & Touch Icons -->
  <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="images/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-main: #0b0f19;
      --bg-surface: rgba(18, 24, 38, 0.78);
      --bg-surface-elevated: rgba(26, 34, 52, 0.88);
      --bg-glass: rgba(12, 17, 28, 0.85);

      --border-subtle: rgba(255, 255, 255, 0.12);
      --border-medium: rgba(255, 255, 255, 0.22);

      --text-primary: #f8fafc;
      --text-secondary: #cbd5e1;
      --text-muted: #94a3b8;

      --accent-pink: #ec4899;
      --accent-purple: #a855f7;
      --accent-cyan: #06b6d4;
      --accent-amber: #f59e0b;
      --accent-emerald: #10b981;

      --font-display: 'Cinzel', serif;
      --font-ui: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --radius-full: 9999px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg-main);
      color: var(--text-primary);
      font-family: var(--font-ui);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      line-height: 1.6;
      overflow-x: hidden;
    }

    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      width: 100%;
    }

    .site-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(11, 15, 25, 0.85);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--border-subtle);
    }
    .site-header-inner {
      max-width: 1280px;
      width: 100%;
      margin: 0 auto;
      padding: 0.85rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    .logo-link {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      text-decoration: none;
      color: var(--text-primary);
      font-family: var(--font-display, 'Cinzel', serif);
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .logo-image {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid rgba(255, 255, 255, 0.25);
      box-shadow: 0 0 14px rgba(168, 85, 247, 0.35);
    }
    .header-nav {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      flex-wrap: nowrap;
      overflow-x: auto;
      padding-bottom: 2px;
    }
    .nav-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.85rem;
      border-radius: var(--radius-full, 9999px);
      font-size: 0.84rem;
      font-weight: 600;
      color: var(--text-muted, #94a3b8);
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      text-decoration: none;
      transition: all 0.18s ease;
      white-space: nowrap;
    }
    .nav-link:hover {
      color: var(--text-primary, #f8fafc);
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.22);
    }
    .active-portal {
      color: #c084fc !important;
      background: rgba(168, 85, 247, 0.15) !important;
      border-color: rgba(168, 85, 247, 0.45) !important;
      box-shadow: 0 0 14px rgba(168, 85, 247, 0.25);
      font-weight: 700 !important;
    }
    .active-crea {
      color: #34d399 !important;
      background: rgba(16, 185, 129, 0.15) !important;
      border-color: rgba(16, 185, 129, 0.45) !important;
      box-shadow: 0 0 14px rgba(16, 185, 129, 0.25);
      font-weight: 700 !important;
    }
    .active-retro {
      color: #fbbf24 !important;
      background: rgba(245, 158, 11, 0.15) !important;
      border-color: rgba(245, 158, 11, 0.45) !important;
      box-shadow: 0 0 14px rgba(245, 158, 11, 0.25);
      font-weight: 700 !important;
    }
    .active-mental {
      color: #38bdf8 !important;
      background: rgba(6, 182, 212, 0.15) !important;
      border-color: rgba(6, 182, 212, 0.45) !important;
      box-shadow: 0 0 14px rgba(6, 182, 212, 0.25);
      font-weight: 700 !important;
    }
    .active-humor {
      color: #f472b6 !important;
      background: rgba(236, 72, 153, 0.15) !important;
      border-color: rgba(236, 72, 153, 0.45) !important;
      box-shadow: 0 0 14px rgba(236, 72, 153, 0.25);
      font-weight: 700 !important;
    }
    @media (max-width: 768px) {
      .site-header-inner {
        padding: 0.65rem 0.85rem;
      }
      .header-nav {
        gap: 0.3rem;
      }
      .nav-link {
        padding: 0.38rem 0.65rem;
        font-size: 0.78rem;
      }
    }

    /* Main Content Container & Layout Margins */
    .main-content {
      flex: 1;
      width: 100%;
      max-width: 1060px;
      margin: 0 auto;
      padding: 2rem 1.25rem 5rem;
    }

    .portal-hero {
      text-align: center;
      padding: 1.5rem 1rem 2.25rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.35rem 0.95rem;
      border-radius: var(--radius-full);
      background: rgba(236, 72, 153, 0.12);
      border: 1px solid rgba(236, 72, 153, 0.35);
      color: #f472b6;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 1.25rem;
      box-shadow: 0 0 16px rgba(236, 72, 153, 0.2);
    }

    .portal-title {
      font-family: var(--font-display, 'Cinzel', serif);
      font-size: clamp(2.2rem, 5vw, 3.4rem);
      font-weight: 900;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 1rem;
      color: #ffffff;
      line-height: 1.15;
      text-align: center;
    }

    .portal-description {
      font-size: 1.05rem;
      color: var(--text-secondary);
      max-width: 680px;
      margin: 0 auto 1.5rem;
      line-height: 1.6;
      text-align: center;
    }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.85rem;
      border-radius: var(--radius-sm);
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 500;
      transition: all 0.2s ease;
      cursor: pointer;
      text-decoration: none;
    }

    .btn-secondary:hover {
      background: var(--bg-surface-hover, rgba(34, 45, 68, 0.95));
      color: var(--text-primary);
      border-color: var(--border-medium);
    }

    .machine-grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
      margin-bottom: 2.25rem;
    }

    @media (max-width: 900px) {
      .machine-grid-3 {
        grid-template-columns: 1fr;
      }
    }

    .site-footer {
      margin-top: auto;
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      padding: 2rem 1.5rem;
      text-align: center;
      font-size: 0.9rem;
      color: var(--text-muted);
    }
  </style>
</head>
<body>
  <div class="app-container">
    <!-- Header -->
    <header class="site-header">
      <div class="site-header-inner">
        <a href="index.html" class="logo-link" title="Ir a la portada de Tus Desvaríos">
          <img src="images/logo-icon.png" alt="Tus Desvaríos Logo" class="logo-image">
          <span>Tus Desvaríos</span>
        </a>
        <nav class="header-nav">
          <a href="crea-tu-historia.html" class="nav-link " title="Novelas y Ficción Interactiva">
            <span>📖</span>
            <span class="nav-link-text">Crea tus Desvaríos</span>
          </a>
          <a href="desvarios-retro.html" class="nav-link " title="Arcade, Juegos Clásicos y El Ahorcado">
            <span>🕹️</span>
            <span class="nav-link-text">Desvaríos Retro</span>
          </a>
          <a href="desvarios-mentales.html" class="nav-link " title="Tests, Enigmas y Retos Psicológicos">
            <span>🧪</span>
            <span class="nav-link-text">Desvaríos Mentales</span>
          </a>
          <a href="desvarios-de-humor.html" class="nav-link active-humor" title="Sátira, Generador de Excusas y Pensamientos de Ducha">
            <span>🎭</span>
            <span class="nav-link-text">Desvaríos de Humor</span>
          </a>
          <a href="index.html" class="nav-link " title="Portada Principal">
            <span>🏛️</span>
            <span class="nav-link-text">Portal</span>
          </a>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Hero Section -->
      <section class="portal-hero">
        <div class="hero-badge">
          <span>✨</span> <span>Consola Interactiva del Absurdo & Sátira Cotidiana</span>
        </div>
        <h1 class="portal-title">
          Desvaríos de <span style="color:#ec4899; text-shadow:0 0 35px rgba(236,72,153,0.55);">Humor</span>
        </h1>
        <p class="portal-description">
          Configura tus parámetros y pulsa los generadores para calcular coartadas, consultar predicciones cósmicas, descubrir las leyes del caos y reflexionar con pensamientos de ducha.
        </p>

        <!-- Machine Navigation Tabs (Centered & Balanced) -->
        <div id="machine-tabs" style="display:flex; flex-wrap:wrap; justify-content:center; gap:0.65rem; margin-top:1rem;">
          <button onclick="switchHumorTab('excusas')" id="tab-btn-excusas" style="padding:0.65rem 1.3rem; border-radius:var(--radius-full); border:2px solid #ec4899; background:rgba(236,72,153,0.25); color:#fff; font-weight:800; font-size:0.95rem; cursor:pointer; display:inline-flex; align-items:center; gap:0.5rem; box-shadow:0 0 20px rgba(236,72,153,0.4); transform:scale(1.02); transition:all 0.18s ease;">
            <span style="font-size:1.2rem;">🎩</span> <span>Máquina de Excusas</span>
          </button>
          <button onclick="switchHumorTab('oraculo')" id="tab-btn-oraculo" style="padding:0.65rem 1.3rem; border-radius:var(--radius-full); border:1.5px solid var(--border-subtle); background:rgba(255,255,255,0.04); color:var(--text-secondary); font-weight:600; font-size:0.95rem; cursor:pointer; display:inline-flex; align-items:center; gap:0.5rem; transition:all 0.18s ease;">
            <span style="font-size:1.2rem;">🔮</span> <span>Oráculo del Desvarío</span>
          </button>
          <button onclick="switchHumorTab('leyes')" id="tab-btn-leyes" style="padding:0.65rem 1.3rem; border-radius:var(--radius-full); border:1.5px solid var(--border-subtle); background:rgba(255,255,255,0.04); color:var(--text-secondary); font-weight:600; font-size:0.95rem; cursor:pointer; display:inline-flex; align-items:center; gap:0.5rem; transition:all 0.18s ease;">
            <span style="font-size:1.2rem;">📜</span> <span>Leyes del Caos</span>
          </button>
          <button onclick="switchHumorTab('pensamientos')" id="tab-btn-pensamientos" style="padding:0.65rem 1.3rem; border-radius:var(--radius-full); border:1.5px solid var(--border-subtle); background:rgba(255,255,255,0.04); color:var(--text-secondary); font-weight:600; font-size:0.95rem; cursor:pointer; display:inline-flex; align-items:center; gap:0.5rem; transition:all 0.18s ease;">
            <span style="font-size:1.2rem;">🚿</span> <span>Pensamientos de Ducha</span>
          </button>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════
          MÁQUINA 1: EXCUSAS (3 COLUMNAS BALANCEADAS)
      ═══════════════════════════════════════════════════════════ -->
      <section id="sec-excusas" class="machine-section machine-section-active" style="padding:2.25rem 2rem; background:linear-gradient(180deg, rgba(28, 18, 36, 0.94) 0%, rgba(15, 18, 30, 0.96) 100%); border:1.5px solid rgba(236,72,153,0.4); border-radius:var(--radius-lg); box-shadow:0 16px 50px rgba(0,0,0,0.6), 0 0 35px rgba(236,72,153,0.18);">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1.75rem; padding-bottom:1.25rem; border-bottom:1px solid rgba(255,255,255,0.08);">
          <div style="display:flex; align-items:center; gap:0.85rem;">
            <div style="display:inline-flex; align-items:center; justify-content:center; width:56px; height:56px; border-radius:50%; background:rgba(236, 72, 153, 0.15); border:1.5px solid rgba(236, 72, 153, 0.5); box-shadow:0 0 18px rgba(236,72,153,0.35);">
              <span style="font-size:2rem;">🎩</span>
            </div>
            <div>
              <h2 style="font-size:1.55rem; font-weight:800; color:#ffffff; margin:0; letter-spacing:-0.01em;">La Máquina de Excusas</h2>
              <p style="font-size:0.92rem; color:var(--text-secondary); margin:0.2rem 0 0;">Configura tus 3 parámetros clave y pulsa el botón para calcular una coartada infalible</p>
            </div>
          </div>
          <button onclick="randomExcusa()" class="btn-secondary" style="font-size:0.88rem; padding:0.5rem 1rem; gap:0.45rem;">
            <span style="color:#ec4899;">🔀</span> <span>Ruleta Aleatoria</span>
          </button>
        </div>

        <!-- 3-Column Clean Uniform Grid -->
        <div class="machine-grid-3">
          <!-- 1. Ámbitos (Vertical Column) -->
          <div style="background:rgba(255,255,255,0.02); padding:1.15rem; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.06);">
            <label style="display:flex; align-items:center; gap:0.45rem; font-size:0.86rem; font-weight:800; color:#f472b6; text-transform:uppercase; margin-bottom:0.75rem; letter-spacing:0.06em;">
              <span>1. Ámbito de la Crisis</span>
              <span style="font-size:0.75rem; background:rgba(236,72,153,0.18); padding:0.12rem 0.45rem; border-radius:var(--radius-full);">${excusasRaw.ambitos.length}</span>
            </label>
            <div style="display:flex; flex-direction:column; gap:0.45rem;">
              ${ambitosHtml}
            </div>
          </div>

          <!-- 2. Gravedad (Vertical Column) -->
          <div style="background:rgba(255,255,255,0.02); padding:1.15rem; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.06);">
            <label style="display:flex; align-items:center; gap:0.45rem; font-size:0.86rem; font-weight:800; color:#38bdf8; text-transform:uppercase; margin-bottom:0.75rem; letter-spacing:0.06em;">
              <span>2. Nivel de Gravedad</span>
              <span style="font-size:0.75rem; background:rgba(56,189,248,0.18); padding:0.12rem 0.45rem; border-radius:var(--radius-full);">${excusasRaw.gravedades.length}</span>
            </label>
            <div style="display:flex; flex-direction:column; gap:0.45rem;">
              ${gravedadesHtml}
            </div>
          </div>

          <!-- 3. Tono (Vertical Column) -->
          <div style="background:rgba(255,255,255,0.02); padding:1.15rem; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.06);">
            <label style="display:flex; align-items:center; gap:0.45rem; font-size:0.86rem; font-weight:800; color:#c084fc; text-transform:uppercase; margin-bottom:0.75rem; letter-spacing:0.06em;">
              <span>3. Tono Retórico</span>
              <span style="font-size:0.75rem; background:rgba(192,132,252,0.18); padding:0.12rem 0.45rem; border-radius:var(--radius-full);">${excusasRaw.tonos.length}</span>
            </label>
            <div style="display:flex; flex-direction:column; gap:0.45rem;">
              ${tonosHtml}
            </div>
          </div>
        </div>

        <!-- GENERATE BUTTON -->
        <div style="text-align:center; margin-bottom:2rem;">
          <button onclick="generateExcusa()" style="padding:0.9rem 2.75rem; border-radius:var(--radius-full); border:none; background:linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%); color:#ffffff; font-size:1.15rem; font-weight:900; cursor:pointer; display:inline-flex; align-items:center; gap:0.75rem; box-shadow:0 8px 30px rgba(236,72,153,0.5); transition:all 0.2s ease;">
            <span style="font-size:1.3rem;">✨</span> <span>Generar Coartada</span>
          </button>
        </div>

        <!-- RESULT CARD -->
        <div id="excusa-result-box" style="display:none; padding:2rem 1.75rem; border-radius:var(--radius-md); background:linear-gradient(135deg, rgba(236,72,153,0.1) 0%, rgba(168,85,247,0.08) 100%); border:1.5px solid rgba(236,72,153,0.35); box-shadow:0 10px 30px rgba(0,0,0,0.4);">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1.25rem;">
            <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;" id="excusa-tags">
              <!-- Dynamically inserted badges -->
            </div>
            <div style="display:flex; align-items:center; gap:0.6rem;">
              <button onclick="generateExcusa()" class="btn-secondary" style="font-size:0.85rem; padding:0.45rem 0.85rem; gap:0.35rem;">
                <span>🔄</span> <span>Otra Variante</span>
              </button>
              <button onclick="copyExcusa()" class="btn-secondary" id="btn-copy-excusa" style="font-size:0.85rem; padding:0.45rem 0.85rem; gap:0.35rem; color:#ec4899;">
                <span>📋</span> <span>Copiar Coartada</span>
              </button>
            </div>
          </div>

          <div style="margin-bottom:1.5rem;">
            <p id="excusa-quote" style="font-size:1.35rem; font-weight:600; font-style:italic; color:#ffffff; line-height:1.6; margin:0 0 1rem;"></p>
            
            <!-- Credibility Meter -->
            <div style="background:rgba(0,0,0,0.35); padding:1rem 1.25rem; border-radius:var(--radius-sm); border:1px solid rgba(255,255,255,0.08); margin-bottom:1rem;">
              <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:700; margin-bottom:0.45rem;">
                <span style="color:var(--text-secondary);">Índice de Verosimilitud Estimado</span>
                <span id="excusa-cred-val" style="color:#10b981;">85%</span>
              </div>
              <div style="width:100%; height:10px; border-radius:5px; background:rgba(255,255,255,0.1); overflow:hidden;">
                <div id="excusa-cred-bar" style="width:85%; height:100%; border-radius:5px; background:linear-gradient(90deg, #ec4899, #10b981); transition:width 0.6s ease;"></div>
              </div>
            </div>

            <!-- Survival Advice -->
            <div style="padding:0.9rem 1.15rem; border-radius:var(--radius-sm); background:rgba(245,158,11,0.08); border-left:3px solid #f59e0b; display:flex; align-items:flex-start; gap:0.75rem;">
              <span style="font-size:1.2rem;">💡</span>
              <div>
                <strong style="color:#fbbf24; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.04em;">Consejo de Ejecución:</strong>
                <p id="excusa-consejo" style="font-size:0.92rem; color:var(--text-secondary); margin:0.2rem 0 0;"></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════
          MÁQUINA 2: ORÁCULO DEL DESVARÍO
      ═══════════════════════════════════════════════════════════ -->
      <section id="sec-oraculo" class="machine-section" style="display:none; padding:2.5rem 2rem; background:linear-gradient(180deg, rgba(26, 18, 42, 0.94) 0%, rgba(13, 15, 28, 0.96) 100%); border:1.5px solid rgba(168,85,247,0.4); border-radius:var(--radius-lg); box-shadow:0 16px 50px rgba(0,0,0,0.6), 0 0 35px rgba(168,85,247,0.18); text-align:center;">
        <div style="display:inline-flex; align-items:center; justify-content:center; width:80px; height:80px; border-radius:50%; background:rgba(168, 85, 247, 0.15); border:2px solid rgba(168, 85, 247, 0.5); box-shadow:0 0 25px rgba(168,85,247,0.4); margin-bottom:1.25rem;">
          <span style="font-size:2.8rem;">🔮</span>
        </div>
        <h2 style="font-size:1.85rem; font-weight:900; color:#ffffff; margin:0 0 0.5rem; letter-spacing:-0.01em;">El Oráculo del Desvarío</h2>
        <p style="font-size:1.02rem; color:var(--text-secondary); max-width:620px; margin:0 auto 2rem;">
          La sabiduría cósmica responde a tus mayores dilemas cotidianos. Pulsa la esfera para recibir una revelación astrológica inapelable.
        </p>

        <button onclick="revealOraculo()" style="padding:0.95rem 3rem; border-radius:var(--radius-full); border:none; background:linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #7e22ce 100%); color:#ffffff; font-size:1.15rem; font-weight:900; cursor:pointer; display:inline-flex; align-items:center; gap:0.75rem; box-shadow:0 8px 30px rgba(168,85,247,0.5); transition:all 0.2s ease;">
          <span style="font-size:1.3rem;">🔮</span> <span>Revelar Predicción Cósmica</span>
        </button>

        <div id="oraculo-result-box" style="display:none; text-align:left; max-width:760px; margin:2.5rem auto 0; padding:2rem 1.75rem; border-radius:var(--radius-md); background:linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(6,182,212,0.08) 100%); border:1.5px solid rgba(168,85,247,0.35); box-shadow:0 10px 30px rgba(0,0,0,0.4);">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
            <span id="oraculo-titulo" style="font-size:1.15rem; font-weight:800; color:#c084fc;"></span>
            <span id="oraculo-prob" style="font-size:0.85rem; color:#38bdf8; background:rgba(6,182,212,0.15); padding:0.2rem 0.6rem; border-radius:var(--radius-full); font-weight:700;"></span>
          </div>
          <div style="background:rgba(0,0,0,0.3); padding:1rem 1.25rem; border-radius:var(--radius-sm); border:1px solid rgba(255,255,255,0.06); margin-bottom:1.25rem;">
            <p style="font-size:0.85rem; color:var(--text-muted); margin:0 0 0.25rem; text-transform:uppercase; font-weight:700;">Dilema Terrenal:</p>
            <p id="oraculo-dilema" style="font-size:1.15rem; color:#ffffff; font-weight:600; margin:0;"></p>
          </div>
          <div style="padding:1.25rem; border-radius:var(--radius-sm); background:rgba(168,85,247,0.15); border:1px solid rgba(168,85,247,0.3); margin-bottom:1.25rem;">
            <p style="font-size:0.85rem; color:#c084fc; margin:0 0 0.35rem; text-transform:uppercase; font-weight:800;">Sentencia del Cosmos:</p>
            <p id="oraculo-veredicto" style="font-size:1.28rem; color:#ffffff; font-weight:800; line-height:1.5; margin:0 0 0.5rem;"></p>
            <p id="oraculo-razon" style="font-size:0.95rem; color:var(--text-secondary); line-height:1.6; margin:0;"></p>
          </div>
          <div style="padding:0.9rem 1.15rem; border-radius:var(--radius-sm); background:rgba(245,158,11,0.08); border-left:3px solid #f59e0b; display:flex; align-items:flex-start; gap:0.75rem; margin-bottom:1rem;">
            <span style="font-size:1.2rem;">✨</span>
            <div>
              <strong style="color:#fbbf24; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.04em;">Consejo Divino:</strong>
              <p id="oraculo-consejo" style="font-size:0.92rem; color:var(--text-secondary); margin:0.2rem 0 0;"></p>
            </div>
          </div>
          <div style="font-size:0.85rem; color:var(--text-muted); text-align:right;">
            <span>Afinidad astral: </span><strong id="oraculo-afin" style="color:#ffffff;"></strong>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════
          MÁQUINA 3: LEYES DEL CAOS
      ═══════════════════════════════════════════════════════════ -->
      <section id="sec-leyes" class="machine-section" style="display:none; padding:2.5rem 2rem; background:linear-gradient(180deg, rgba(32, 24, 16, 0.94) 0%, rgba(15, 18, 28, 0.96) 100%); border:1.5px solid rgba(245,158,11,0.4); border-radius:var(--radius-lg); box-shadow:0 16px 50px rgba(0,0,0,0.6), 0 0 35px rgba(245,158,11,0.18); text-align:center;">
        <div style="display:inline-flex; align-items:center; justify-content:center; width:80px; height:80px; border-radius:50%; background:rgba(245, 158, 11, 0.15); border:2px solid rgba(245, 158, 11, 0.5); box-shadow:0 0 25px rgba(245,158,11,0.4); margin-bottom:1.25rem;">
          <span style="font-size:2.8rem;">📜</span>
        </div>
        <h2 style="font-size:1.85rem; font-weight:900; color:#ffffff; margin:0 0 0.5rem; letter-spacing:-0.01em;">Las Leyes del Caos Cotidiano</h2>
        <p style="font-size:1.02rem; color:var(--text-secondary); max-width:620px; margin:0 auto 2rem;">
          Principios inmutables de la física de Murphy que explican por qué la tostada cae siempre del lado de la mantequilla.
        </p>

        <button onclick="revealLey()" style="padding:0.95rem 3rem; border-radius:var(--radius-full); border:none; background:linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%); color:#ffffff; font-size:1.15rem; font-weight:900; cursor:pointer; display:inline-flex; align-items:center; gap:0.75rem; box-shadow:0 8px 30px rgba(245,158,11,0.5); transition:all 0.2s ease;">
          <span style="font-size:1.3rem;">📜</span> <span>Revelar Ley del Caos</span>
        </button>

        <div id="ley-result-box" style="display:none; text-align:left; max-width:760px; margin:2.5rem auto 0; padding:2rem 1.75rem; border-radius:var(--radius-md); background:linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(236,72,153,0.06) 100%); border:1.5px solid rgba(245,158,11,0.35); box-shadow:0 10px 30px rgba(0,0,0,0.4);">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span id="ley-num" style="font-size:0.85rem; font-weight:800; color:#fbbf24; background:rgba(245,158,11,0.2); padding:0.2rem 0.6rem; border-radius:var(--radius-full);"></span>
              <span id="ley-cat" style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;"></span>
            </div>
            <span id="ley-prob" style="font-size:0.85rem; color:#10b981; font-weight:700;"></span>
          </div>
          <h3 id="ley-nombre" style="font-size:1.4rem; font-weight:800; color:#ffffff; margin:0 0 1rem; line-height:1.4;"></h3>
          <p id="ley-desc" style="font-size:1.05rem; color:var(--text-secondary); line-height:1.7; margin:0 0 1.25rem;"></p>
          <div style="padding:0.9rem 1.15rem; border-radius:var(--radius-sm); background:rgba(16,185,129,0.08); border-left:3px solid #10b981; display:flex; align-items:flex-start; gap:0.75rem;">
            <span style="font-size:1.2rem;">🛡️</span>
            <div>
              <strong style="color:#34d399; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.04em;">Consejo de Supervivencia:</strong>
              <p id="ley-consejo" style="font-size:0.92rem; color:var(--text-secondary); margin:0.2rem 0 0;"></p>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════
          MÁQUINA 4: PENSAMIENTOS DE DUCHA
      ═══════════════════════════════════════════════════════════ -->
      <section id="sec-pensamientos" class="machine-section" style="display:none; padding:2.5rem 2rem; background:linear-gradient(180deg, rgba(16, 32, 28, 0.94) 0%, rgba(12, 18, 28, 0.96) 100%); border:1.5px solid rgba(16,185,129,0.4); border-radius:var(--radius-lg); box-shadow:0 16px 50px rgba(0,0,0,0.6), 0 0 35px rgba(16,185,129,0.18); text-align:center;">
        <div style="display:inline-flex; align-items:center; justify-content:center; width:80px; height:80px; border-radius:50%; background:rgba(16, 185, 129, 0.15); border:2px solid rgba(16, 185, 129, 0.5); box-shadow:0 0 25px rgba(16,185,129,0.4); margin-bottom:1.25rem;">
          <span style="font-size:2.8rem;">🚿</span>
        </div>
        <h2 style="font-size:1.85rem; font-weight:900; color:#ffffff; margin:0 0 0.5rem; letter-spacing:-0.01em;">Pensamientos de Ducha</h2>
        <p style="font-size:1.02rem; color:var(--text-secondary); max-width:620px; margin:0 auto 2rem;">
          Paradojas existenciales y epifanías filosóficas que solo ocurren bajo el agua caliente a las siete de la mañana.
        </p>

        <button onclick="revealPensamiento()" style="padding:0.95rem 3rem; border-radius:var(--radius-full); border:none; background:linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%); color:#ffffff; font-size:1.15rem; font-weight:900; cursor:pointer; display:inline-flex; align-items:center; gap:0.75rem; box-shadow:0 8px 30px rgba(16,185,129,0.5); transition:all 0.2s ease;">
          <span style="font-size:1.3rem;">🚿</span> <span>Revelar Pensamiento de Ducha</span>
        </button>

        <div id="pensamiento-result-box" style="display:none; text-align:left; max-width:760px; margin:2.5rem auto 0; padding:2rem 1.75rem; border-radius:var(--radius-md); background:linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.06) 100%); border:1.5px solid rgba(16,185,129,0.35); box-shadow:0 10px 30px rgba(0,0,0,0.4);">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
            <span id="pens-autor" style="font-size:0.85rem; color:#34d399; text-transform:uppercase; font-weight:800; background:rgba(16,185,129,0.15); padding:0.2rem 0.6rem; border-radius:var(--radius-full);"></span>
            <button onclick="copyPensamiento()" class="btn-secondary" id="btn-copy-pens" style="font-size:0.82rem; padding:0.35rem 0.75rem; gap:0.35rem; color:#34d399;">
              <span>📋</span> <span>Copiar</span>
            </button>
          </div>
          <h3 id="pens-titulo" style="font-size:1.35rem; font-weight:800; color:#ffffff; margin:0 0 1rem; line-height:1.4;"></h3>
          <p id="pens-contenido" style="font-size:1.15rem; font-style:italic; color:#ffffff; line-height:1.7; margin:0;"></p>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <p>© 2026 Tus Desvaríos — Portal de Ocio Digital y Sátira Cotidiana</p>
    </footer>
  </div>

  <script>
    const excusasData = ${excusasJson};
    const oraculoData = ${oraculoJson};
    const leyesData = ${leyesJson};
    const pildorasData = ${pildorasJson};

    let curAmbito = excusasData.ambitos[0].id;
    let curGravedad = excusasData.gravedades[0].id;
    let curTono = excusasData.tonos[0].id;
    let curVariantIdx = 0;
    let curExcusa = null;

    function switchHumorTab(tabId) {
      const tabs = ['excusas', 'oraculo', 'leyes', 'pensamientos'];
      const colors = { excusas: '#ec4899', oraculo: '#a855f7', leyes: '#f59e0b', pensamientos: '#10b981' };
      
      tabs.forEach(t => {
        const sec = document.getElementById('sec-' + t);
        const btn = document.getElementById('tab-btn-' + t);
        if (sec && btn) {
          if (t === tabId) {
            sec.style.display = 'block';
            btn.style.border = '2px solid ' + colors[t];
            btn.style.background = colors[t] + '25';
            btn.style.color = '#ffffff';
            btn.style.fontWeight = '800';
            btn.style.boxShadow = '0 0 20px ' + colors[t] + '40';
            btn.style.transform = 'scale(1.02)';
          } else {
            sec.style.display = 'none';
            btn.style.border = '1.5px solid var(--border-subtle)';
            btn.style.background = 'rgba(255,255,255,0.04)';
            btn.style.color = 'var(--text-secondary)';
            btn.style.fontWeight = '600';
            btn.style.boxShadow = 'none';
            btn.style.transform = 'scale(1)';
          }
        }
      });
    }

    function setAmbito(id) {
      curAmbito = id;
      excusasData.ambitos.forEach(a => {
        const btn = document.getElementById('amb-btn-' + a.id);
        if (btn) {
          const isAct = a.id === id;
          btn.style.background = isAct ? 'rgba(236,72,153,0.25)' : 'rgba(255,255,255,0.03)';
          btn.style.border = isAct ? '1.5px solid #ec4899' : '1.5px solid rgba(255,255,255,0.08)';
          btn.style.color = isAct ? '#ffffff' : 'var(--text-secondary)';
          btn.style.fontWeight = isAct ? '700' : '500';
          btn.style.boxShadow = isAct ? '0 0 14px rgba(236,72,153,0.35)' : 'none';
        }
      });
    }

    function setGravedad(id) {
      curGravedad = id;
      excusasData.gravedades.forEach(g => {
        const btn = document.getElementById('grav-btn-' + g.id);
        if (btn) {
          const isAct = g.id === id;
          btn.style.background = isAct ? g.color + '25' : 'rgba(255,255,255,0.03)';
          btn.style.border = isAct ? '1.5px solid ' + g.color : '1.5px solid rgba(255,255,255,0.08)';
          btn.style.color = isAct ? '#ffffff' : 'var(--text-secondary)';
          btn.style.fontWeight = isAct ? '700' : '500';
          btn.style.boxShadow = isAct ? '0 0 14px ' + g.color + '40' : 'none';
        }
      });
    }

    function setTono(id) {
      curTono = id;
      excusasData.tonos.forEach(t => {
        const btn = document.getElementById('tono-btn-' + t.id);
        if (btn) {
          const isAct = t.id === id;
          btn.style.background = isAct ? 'rgba(236,72,153,0.25)' : 'rgba(255,255,255,0.03)';
          btn.style.border = isAct ? '1.5px solid #f472b6' : '1.5px solid rgba(255,255,255,0.08)';
          btn.style.color = isAct ? '#ffffff' : 'var(--text-secondary)';
          btn.style.fontWeight = isAct ? '700' : '500';
          btn.style.boxShadow = isAct ? '0 0 14px rgba(236,72,153,0.35)' : 'none';
        }
      });
    }

    function generateExcusa() {
      const matches = excusasData.catalogo.filter(e => e.ambito === curAmbito && e.gravedad === curGravedad && e.tono === curTono);
      const pool = matches.length > 0 ? matches : excusasData.catalogo.filter(e => e.ambito === curAmbito && e.gravedad === curGravedad);
      const safePool = pool.length > 0 ? pool : excusasData.catalogo;
      
      curVariantIdx = (curVariantIdx + 1) % safePool.length;
      curExcusa = safePool[curVariantIdx];

      const resBox = document.getElementById('excusa-result-box');
      const quote = document.getElementById('excusa-quote');
      const credVal = document.getElementById('excusa-cred-val');
      const credBar = document.getElementById('excusa-cred-bar');
      const consejo = document.getElementById('excusa-consejo');
      const tags = document.getElementById('excusa-tags');

      quote.textContent = '“' + curExcusa.texto + '”';
      credVal.textContent = curExcusa.credibilidad + '%';
      credBar.style.width = curExcusa.credibilidad + '%';
      consejo.textContent = curExcusa.consejo;

      const ambObj = excusasData.ambitos.find(a => a.id === curExcusa.ambito);
      const gravObj = excusasData.gravedades.find(g => g.id === curExcusa.gravedad);
      const tonoObj = excusasData.tonos.find(t => t.id === curExcusa.tono);

      tags.innerHTML = '<span style=\"font-size:0.8rem; background:rgba(236,72,153,0.2); color:#f472b6; padding:0.25rem 0.65rem; border-radius:var(--radius-full); font-weight:700;\">' + (ambObj ? ambObj.icono + ' ' + ambObj.nombre : '') + '</span>' +
        '<span style=\"font-size:0.8rem; background:' + (gravObj ? gravObj.color : '#fff') + '20; color:' + (gravObj ? gravObj.color : '#fff') + '; padding:0.25rem 0.65rem; border-radius:var(--radius-full); font-weight:700;\">' + (gravObj ? gravObj.icono + ' ' + gravObj.nombre : '') + '</span>' +
        '<span style=\"font-size:0.8rem; background:rgba(192,132,252,0.2); color:#c084fc; padding:0.25rem 0.65rem; border-radius:var(--radius-full); font-weight:700;\">' + (tonoObj ? tonoObj.icono + ' ' + tonoObj.nombre : '') + '</span>';

      resBox.style.display = 'block';
      resBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function copyExcusa() {
      if (!curExcusa) return;
      navigator.clipboard.writeText(curExcusa.texto).then(() => {
        const btn = document.getElementById('btn-copy-excusa');
        btn.innerHTML = '<span>✅</span> <span>¡Copiada!</span>';
        setTimeout(() => {
          btn.innerHTML = '<span>📋</span> <span>Copiar Coartada</span>';
        }, 2000);
      });
    }

    function randomExcusa() {
      const rA = excusasData.ambitos[Math.floor(Math.random() * excusasData.ambitos.length)].id;
      const rG = excusasData.gravedades[Math.floor(Math.random() * excusasData.gravedades.length)].id;
      const rT = excusasData.tonos[Math.floor(Math.random() * excusasData.tonos.length)].id;
      setAmbito(rA);
      setGravedad(rG);
      setTono(rT);
      generateExcusa();
    }

    function revealOraculo() {
      const preds = oraculoData.predicciones;
      const p = preds[Math.floor(Math.random() * preds.length)];
      
      document.getElementById('oraculo-titulo').textContent = p.icono + ' ' + p.titulo;
      document.getElementById('oraculo-prob').textContent = p.probabilidad;
      document.getElementById('oraculo-dilema').textContent = p.dilema;
      document.getElementById('oraculo-veredicto').textContent = p.veredicto;
      document.getElementById('oraculo-razon').textContent = p.razon;
      document.getElementById('oraculo-consejo').textContent = p.consejo;
      document.getElementById('oraculo-afin').textContent = p.signoAfin;

      const box = document.getElementById('oraculo-result-box');
      box.style.display = 'block';
      box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function revealLey() {
      const leyes = leyesData.leyes;
      const l = leyes[Math.floor(Math.random() * leyes.length)];

      document.getElementById('ley-num').textContent = 'Ley #' + l.numero;
      document.getElementById('ley-cat').textContent = l.categoria;
      document.getElementById('ley-prob').textContent = 'Certeza: ' + l.probabilidad;
      document.getElementById('ley-nombre').textContent = l.icono + ' ' + l.nombre;
      document.getElementById('ley-desc').textContent = l.descripcion;
      document.getElementById('ley-consejo').textContent = l.consejo;

      const box = document.getElementById('ley-result-box');
      box.style.display = 'block';
      box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    let curPens = null;
    function revealPensamiento() {
      const p = pildorasData.pensamientos[Math.floor(Math.random() * pildorasData.pensamientos.length)];
      curPens = p;

      document.getElementById('pens-autor').textContent = p.icono + ' ' + p.autor;
      document.getElementById('pens-titulo').textContent = p.titulo;
      document.getElementById('pens-contenido').textContent = '“' + p.contenido + '”';

      const box = document.getElementById('pensamiento-result-box');
      box.style.display = 'block';
      box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function copyPensamiento() {
      if (!curPens) return;
      navigator.clipboard.writeText(curPens.contenido).then(() => {
        const btn = document.getElementById('btn-copy-pens');
        btn.innerHTML = '<span>✅</span> <span>¡Copiado!</span>';
        setTimeout(() => {
          btn.innerHTML = '<span>📋</span> <span>Copiar</span>';
        }, 2000);
      });
    }
  </script>
</body>
</html>`;
}

fs.writeFileSync(path.join(__dirname, 'build_robust_humor.js'), generateRobustHumorHtml.toString() + '\n\nconst output = generateRobustHumorHtml();\nfs.writeFileSync(path.join(__dirname, "..", "desvarios-de-humor.html"), output, "utf8");\nconsole.log("Successfully wrote clean and balanced desvarios-de-humor.html!");\n', 'utf8');

console.log('build_robust_humor.js updated successfully!');
