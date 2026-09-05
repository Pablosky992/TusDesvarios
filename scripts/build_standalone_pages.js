const fs = require('fs');
const path = require('path');
const { getHeaderHtml, getHeaderCss } = require('./common_header');

// Stories
const faroRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'stories', 'la-ultima-guardia-faro.json'), 'utf8'));
const abadiaRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'stories', 'el-manuscrito-de-la-abadia.json'), 'utf8'));

// Tests
const arquetipoRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'tests', 'arquetipo-oscuro.json'), 'utf8'));
const termometroRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'tests', 'termometro-desvario.json'), 'utf8'));
const enigmasRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'tests', 'enigmas-logica.json'), 'utf8'));
const supervivenciaRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'tests', 'supervivencia-apocalipsis.json'), 'utf8'));
const trampasRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'tests', 'trampas-mentales.json'), 'utf8'));
const monstruoRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'tests', 'monstruo-interior.json'), 'utf8'));
const dilemasRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'tests', 'dilemas-morales.json'), 'utf8'));
const curiosidadesRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'tests', 'curiosidades-insolitas.json'), 'utf8'));

// Humor Data
const excusasRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'humor', 'excusas.json'), 'utf8'));
const oraculoRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'humor', 'oraculo.json'), 'utf8'));
const traductorRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'humor', 'traductor.json'), 'utf8'));
const leyesRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'humor', 'leyes.json'), 'utf8'));
const pildorasRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'humor', 'pildoras.json'), 'utf8'));
// Games
const ahorcadoRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'games', 'ahorcado.json'), 'utf8'));

function fixPaths(story) {
  const clone = JSON.parse(JSON.stringify(story));
  clone.portada = clone.portada.replace(/^\//, '');
  for (const n of Object.values(clone.nodos)) {
    if (n.imagen) n.imagen = n.imagen.replace(/^\//, '');
  }
  return clone;
}

const faro = fixPaths(faroRaw);
const abadia = fixPaths(abadiaRaw);

// ==========================================================
// 1. GENERATE INDEX.HTML (BALANCED MULTI-THEME PORTAL)
// ==========================================================
const indexHtmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tus Desvaríos — Historias, Juegos, Tests, Relatos y Curiosidades</title>
  <meta name="description" content="Tus Desvaríos: tu portal de ocio digital. Historias interactivas, tests de personalidad, enigmas, relatos, juegos clásicos y curiosidades de la red.">
  <meta name="keywords" content="tus desvarios, portal de ocio, historias interactivas, tests de personalidad, enigmas de logica, relatos, juegos clasicos, curiosidades web, entretenimiento">
  
  <!-- Canonical & Open Graph / SEO -->
  <link rel="canonical" href="https://tusdesvarios.com">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Tus Desvaríos — Portal de Entretenimiento y Curiosidades">
  <meta property="og:description" content="Un rincón donde perder el tiempo con estilo: ficción interactiva, tests mentales, relatos, minijuegos y curiosidades.">
  <meta property="og:url" content="https://tusdesvarios.com">
  <meta property="og:image" content="images/stories/faro-san-telmo/portada.jpg">

    <!-- Favicon & Touch Icons -->
  <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="images/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-main: #0b0f19;
      --bg-surface: rgba(18, 24, 38, 0.78);
      --bg-surface-elevated: rgba(26, 34, 52, 0.88);
      --bg-surface-hover: rgba(34, 45, 68, 0.95);
      --bg-glass: rgba(12, 17, 28, 0.85);

      --border-subtle: rgba(255, 255, 255, 0.12);
      --border-medium: rgba(255, 255, 255, 0.22);

      --text-primary: #f8fafc;
      --text-secondary: #cbd5e1;
      --text-muted: #94a3b8;

      --accent-amber: #f59e0b;
      --accent-emerald: #10b981;
      --accent-purple: #a855f7;
      --accent-cyan: #06b6d4;
      --accent-pink: #ec4899;
      --accent-blue: #3b82f6;

      --font-display: 'Cinzel', serif;
      --font-reading: 'Crimson Pro', Georgia, serif;
      --font-ui: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 22px;
      --radius-full: 9999px;

      --shadow-subtle: 0 4px 24px rgba(0, 0, 0, 0.4);
      --shadow-elevated: 0 16px 40px rgba(0, 0, 0, 0.55);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-main);
      color: var(--text-primary);
      font-family: var(--font-ui);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
      position: relative;
    }

    /* Vibrant, luminous STATIC mesh gradient (100% fast on mobiles, 0 CPU/battery drain) */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background: 
        radial-gradient(ellipse 95% 55% at 50% -12%, rgba(168, 85, 247, 0.32) 0%, transparent 65%),
        radial-gradient(circle 500px at 6% 25%, rgba(16, 185, 129, 0.24) 0%, transparent 60%),
        radial-gradient(circle 550px at 94% 28%, rgba(245, 158, 11, 0.26) 0%, transparent 60%),
        radial-gradient(circle 480px at 88% 75%, rgba(236, 72, 153, 0.22) 0%, transparent 60%),
        radial-gradient(circle 550px at 12% 80%, rgba(6, 182, 212, 0.24) 0%, transparent 60%),
        linear-gradient(180deg, #0e1322 0%, #0a0e1a 50%, #060911 100%);
      pointer-events: none;
      z-index: -1;
    }

    a {
      color: inherit;
      text-decoration: none;
      font-family: inherit;
    }

    /* Layout */
    .app-container {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    ${getHeaderCss()}
    .portal-container {
      flex: 1;
      width: 100%;
      max-width: 1140px;
      margin: 0 auto;
      padding: 0 1.4rem 6rem;
    }

    /* Hero Section */
    .portal-hero {
      text-align: center;
      padding: 4.5rem 1rem 3.5rem;
      position: relative;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 1.15rem;
      border-radius: var(--radius-full);
      background: rgba(139, 92, 246, 0.12);
      border: 1px solid rgba(139, 92, 246, 0.35);
      color: #c4b5fd;
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 1.25rem;
      box-shadow: 0 0 25px rgba(139, 92, 246, 0.2);
    }

    /* Integrated Hero Emblem & Overlapping Title */
    .portal-emblem-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      margin-bottom: 0.5rem;
    }

    .portal-emblem-glow-wrap {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0;
      z-index: 1;
    }

    .portal-emblem-aura {
      position: absolute;
      inset: -25px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(6, 182, 212, 0.3) 45%, transparent 70%);
      filter: blur(18px);
      pointer-events: none;
    }

    .portal-emblem-img {
      position: relative;
      width: 165px;
      height: 165px;
      border-radius: 50%;
      object-fit: cover;
      border: 2.5px solid rgba(255, 255, 255, 0.35);
      box-shadow: 
        0 0 35px rgba(168, 85, 247, 0.5), 
        0 0 70px rgba(6, 182, 212, 0.3),
        0 12px 30px rgba(0, 0, 0, 0.8);
      transition: transform 0.4s ease, box-shadow 0.4s ease;
    }

    .portal-emblem-img:hover {
      transform: scale(1.04);
      box-shadow: 
        0 0 45px rgba(168, 85, 247, 0.7), 
        0 0 90px rgba(6, 182, 212, 0.45),
        0 16px 40px rgba(0, 0, 0, 0.9);
    }

    .portal-title {
      font-family: var(--font-display);
      font-size: clamp(2.6rem, 6vw, 4.4rem);
      font-weight: 900;
      letter-spacing: 0.03em;
      line-height: 1.1;
      color: #ffffff;
      margin-bottom: 1.25rem;
    }

    .portal-title.integrated-title {
      position: relative;
      z-index: 2;
      margin-top: -36px;
      text-shadow: 
        0 4px 25px rgba(0, 0, 0, 0.95),
        0 2px 8px rgba(0, 0, 0, 0.9),
        0 0 35px rgba(168, 85, 247, 0.35);
    }

    @media (max-width: 640px) {
      .portal-emblem-img {
        width: 130px;
        height: 130px;
      }
      .portal-title.integrated-title {
        margin-top: -24px;
      }
    }

    .portal-title-gradient {
      background: linear-gradient(135deg, #ffffff 15%, #f59e0b 50%, #ec4899 80%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .portal-description {
      font-size: 1.15rem;
      line-height: 1.7;
      color: var(--text-secondary);
      max-width: 680px;
      margin: 0 auto 2.5rem;
    }

    /* Category Tags Cloud */
    .categories-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      justify-content: center;
      align-items: center;
      margin-bottom: 3.5rem;
    }

    .cat-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.5rem 1rem;
      border-radius: var(--radius-full);
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      font-size: 0.86rem;
      font-weight: 600;
      color: var(--text-secondary);
      transition: all 0.25s ease;
    }

    .cat-badge:hover {
      transform: translateY(-2px);
      border-color: var(--cat-accent, var(--border-medium));
      color: var(--text-primary);
      box-shadow: 0 4px 15px var(--cat-glow, transparent);
    }

    /* ─── MAIN CATEGORIES GRID ─────────────────────── */
    .section-intro-wrap {
      text-align: center;
      margin-bottom: 2.25rem;
    }

    .section-title-main {
      font-family: var(--font-display);
      font-size: 1.95rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.4rem;
      letter-spacing: 0.02em;
    }

    .section-desc-main {
      font-size: 0.96rem;
      color: var(--text-secondary);
    }

    .portal-grid-6 {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.65rem;
    }

    /* Category Card */
    .cat-card {
      position: relative;
      border-radius: var(--radius-lg);
      background: var(--bg-surface);
      border: 1px solid var(--card-border, var(--border-subtle));
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-subtle);
      transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
      overflow: hidden;
      height: 100%;
    }

    .cat-card-active {
      cursor: pointer;
    }

    .cat-card-active:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-elevated), 0 0 35px var(--card-glow, transparent);
      border-color: var(--card-accent, var(--accent-amber));
    }

    .cat-card-disabled {
      opacity: 0.75;
      cursor: default;
      border-color: rgba(255, 255, 255, 0.1);
    }

    .cat-card-thumb-wrap {
      position: relative;
      width: 100%;
      height: 175px;
      overflow: hidden;
      background: #090d16;
    }

    .cat-card-thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.45s ease;
    }

    .cat-card-active:hover .cat-card-thumb {
      transform: scale(1.06);
    }

    .cat-card-thumb-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(16, 22, 36, 0.98) 0%, rgba(16, 22, 36, 0.35) 60%, rgba(0, 0, 0, 0.2) 100%);
    }

    .cat-card-header-badge {
      position: absolute;
      top: 0.9rem;
      left: 0.9rem;
      right: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 2;
    }

    .cat-card-body {
      padding: 1.35rem 1.6rem 1.6rem;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      flex: 1;
    }

    .cat-card-glow-circle {
      position: absolute;
      top: -35%;
      right: -35%;
      width: 190px;
      height: 190px;
      border-radius: 50%;
      background: var(--card-glow, rgba(255, 255, 255, 0.02));
      filter: blur(50px);
      pointer-events: none;
    }

    .cat-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.25rem;
    }

    .cat-card-icon-box {
      width: 50px;
      height: 50px;
      border-radius: var(--radius-md);
      background: var(--icon-bg, rgba(255, 255, 255, 0.05));
      border: 1px solid var(--icon-border, var(--border-subtle));
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
    }

    .cat-pill {
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 0.3rem 0.75rem;
      border-radius: var(--radius-full);
    }

    .cat-pill-live {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.35);
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.2);
    }

    .cat-pill-soon {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-muted);
      border: 1px solid rgba(255, 255, 255, 0.12);
    }

    .cat-card-title {
      font-family: var(--font-display);
      font-size: 1.35rem;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.02em;
    }

    .cat-card-desc {
      font-size: 0.93rem;
      line-height: 1.6;
      color: var(--text-secondary);
      flex: 1;
    }

    .cat-card-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.75rem;
      font-size: 0.92rem;
      font-weight: 700;
      color: var(--card-accent, var(--accent-emerald));
      transition: gap 0.2s ease;
    }

    .cat-card-active:hover .cat-card-cta {
      gap: 0.8rem;
    }

    /* ─── "MOMENTOS DESVARÍO" / USE CASES BAR ───────── */
    .moments-section {
      margin-top: 5rem;
      padding: 2.5rem 2rem;
      border-radius: var(--radius-lg);
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
    }

    .moments-heading {
      text-align: center;
      font-family: var(--font-display);
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 2rem;
      letter-spacing: 0.03em;
    }

    .moments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.75rem;
      text-align: center;
    }

    .moment-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .moment-icon {
      font-size: 2rem;
      margin-bottom: 0.25rem;
    }

    .moment-title {
      font-family: var(--font-display);
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .moment-desc {
      font-size: 0.86rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .site-footer {
      margin-top: auto;
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      padding: 1.85rem 1.25rem;
      text-align: center;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .footer-legal-links {
      margin-top: 0.75rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.65rem 0.85rem;
      font-size: 0.82rem;
    }
    .footer-legal-links a {
      color: var(--text-secondary, #cbd5e1);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .footer-legal-links a:hover {
      color: #c084fc;
      text-decoration: underline;
    }
    .footer-separator {
      color: var(--border-medium, rgba(255, 255, 255, 0.22));
      font-size: 0.75rem;
      user-select: none;
    }


    /* ─── CREATOR PRESENTATION / BIO SECTION ───────── */
    .creator-bio-section {
      margin-top: 4.5rem;
      padding: 3rem 2.25rem;
      border-radius: var(--radius-lg);
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.07) 0%, rgba(168, 85, 247, 0.05) 50%, rgba(14, 19, 32, 0.95) 100%);
      border: 1.5px solid rgba(245, 158, 11, 0.35);
      box-shadow: 0 16px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(245, 158, 11, 0.12);
      position: relative;
      overflow: hidden;
    }

    .creator-bio-glow {
      position: absolute;
      top: -20%;
      left: -10%;
      width: 320px;
      height: 320px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%);
      pointer-events: none;
      filter: blur(40px);
    }

    .creator-bio-grid {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 2.75rem;
      align-items: center;
      position: relative;
      z-index: 2;
    }

    @media (max-width: 900px) {
      .creator-bio-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }

    .creator-portrait-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .creator-img-frame {
      position: relative;
      width: 260px;
      height: 260px;
      border-radius: 50%;
      padding: 6px;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 40%, #78350f 100%);
      box-shadow: 0 0 30px rgba(245, 158, 11, 0.4), inset 0 0 20px rgba(0, 0, 0, 0.8);
      margin-bottom: 1.25rem;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .creator-img-frame:hover {
      transform: scale(1.03) rotate(1deg);
      box-shadow: 0 0 45px rgba(245, 158, 11, 0.6), inset 0 0 25px rgba(0, 0, 0, 0.9);
    }

    .creator-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      display: block;
      border: 3px solid rgba(11, 15, 25, 0.85);
    }

    .creator-telemetry {
      width: 100%;
      max-width: 280px;
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(245, 158, 11, 0.2);
      border-radius: var(--radius-md);
      padding: 0.85rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      font-size: 0.78rem;
    }

    .creator-telemetry-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--text-secondary);
      border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
      padding-bottom: 0.35rem;
    }

    .creator-telemetry-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .creator-telemetry-val {
      font-weight: 700;
      color: #fbbf24;
    }

    .creator-content-col {
      display: flex;
      flex-direction: column;
    }

    .creator-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.3rem 0.85rem;
      border-radius: var(--radius-full);
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.4);
      color: #fbbf24;
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 1rem;
      align-self: flex-start;
    }

    .creator-heading {
      font-family: var(--font-display);
      font-size: clamp(1.5rem, 3vw, 2.1rem);
      font-weight: 800;
      color: #ffffff;
      line-height: 1.25;
      margin-bottom: 1.35rem;
      letter-spacing: -0.01em;
    }

    .creator-text {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      font-size: 0.98rem;
      line-height: 1.75;
      color: #cbd5e1;
    }

    .creator-text p strong {
      color: #ffffff;
    }

    .creator-text p em {
      color: #fde68a;
      font-style: italic;
    }

    .creator-footer-callout {
      margin-top: 1.5rem;
      padding: 1rem 1.35rem;
      border-radius: var(--radius-md);
      background: rgba(245, 158, 11, 0.08);
      border-left: 4px solid #f59e0b;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .creator-footer-quote {
      font-size: 0.92rem;
      font-style: italic;
      color: #f8fafc;
      margin: 0;
    }

    .creator-footer-sig {
      font-size: 0.86rem;
      font-weight: 700;
      color: #fbbf24;
      white-space: nowrap;
    }

    .creator-donate-bar {
      margin-top: 1.25rem;
      padding: 1.15rem 1.4rem;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.06) 100%);
      border: 1.5px solid rgba(245, 158, 11, 0.35);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1.1rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    }

    .creator-donate-info {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      flex: 1;
      min-width: 260px;
    }

    .creator-donate-icon {
      font-size: 1.85rem;
      line-height: 1;
      flex-shrink: 0;
    }

    .creator-donate-text strong {
      display: block;
      font-size: 0.95rem;
      color: #fbbf24;
      margin-bottom: 0.2rem;
    }

    .creator-donate-text p {
      font-size: 0.84rem;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.45;
    }

    .btn-paypal-donate {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.7rem 1.35rem;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: #0b0f19 !important;
      font-weight: 800;
      font-size: 0.88rem;
      text-decoration: none;
      box-shadow: 0 4px 18px rgba(245, 158, 11, 0.35);
      transition: all 0.2s ease;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .btn-paypal-donate:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(245, 158, 11, 0.55);
      color: #000000 !important;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    }

    .creator-action-btns {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      flex-shrink: 0;
    }

    .btn-creator-contact {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.7rem 1.3rem;
      border-radius: var(--radius-full);
      background: rgba(255, 255, 255, 0.08);
      border: 1.5px solid rgba(245, 158, 11, 0.45);
      color: #f8fafc;
      font-weight: 700;
      font-size: 0.88rem;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      transition: all 0.2s ease;
      white-space: nowrap;
      text-decoration: none;
    }

    .btn-creator-contact:hover {
      background: rgba(245, 158, 11, 0.2);
      border-color: #f59e0b;
      color: #fbbf24;
      transform: translateY(-2px);
      box-shadow: 0 6px 22px rgba(245, 158, 11, 0.35);
    }

    .creator-contact-link {
      background: none;
      border: none;
      color: #38bdf8;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      padding: 0;
      text-decoration: underline;
      text-underline-offset: 3px;
      transition: color 0.2s ease;
    }

    .creator-contact-link:hover {
      color: #7dd3fc;
    }

    /* Modal Overlay & Box (Web3Forms Contact) */
    .contact-modal-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(4, 7, 14, 0.84);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      z-index: 9999;
      align-items: center;
      justify-content: center;
      padding: 1.25rem;
      opacity: 0;
      transition: opacity 0.25s ease;
    }

    .contact-modal-overlay.active {
      display: flex;
      opacity: 1;
    }

    .contact-modal-box {
      position: relative;
      background: linear-gradient(180deg, #131a2b 0%, #0c111e 100%);
      border: 1.5px solid rgba(245, 158, 11, 0.45);
      border-radius: 20px;
      max-width: 560px;
      width: 100%;
      padding: 2.25rem 2rem;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 40px rgba(245, 158, 11, 0.2);
      transform: translateY(20px) scale(0.97);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      max-height: 92vh;
      overflow-y: auto;
    }

    .contact-modal-overlay.active .contact-modal-box {
      transform: translateY(0) scale(1);
    }

    .contact-modal-close {
      position: absolute;
      top: 1.2rem;
      right: 1.2rem;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.07);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #94a3b8;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .contact-modal-close:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: #ef4444;
      color: #fca5a5;
      transform: rotate(90deg);
    }

    .contact-modal-header {
      margin-bottom: 1.5rem;
      padding-right: 2rem;
    }

    .contact-modal-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.4);
      color: #fbbf24;
      font-size: 0.74rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 0.65rem;
    }

    .contact-modal-title {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 0.5rem;
      letter-spacing: -0.01em;
    }

    .contact-modal-desc {
      font-size: 0.88rem;
      color: var(--text-secondary);
      line-height: 1.5;
      margin: 0;
    }

    .contact-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    @media (max-width: 580px) {
      .contact-form-grid {
        grid-template-columns: 1fr;
      }
      .contact-modal-box {
        padding: 1.75rem 1.25rem;
      }
    }

    .contact-form-group {
      margin-bottom: 1rem;
    }

    .contact-form-label {
      display: block;
      font-size: 0.8rem;
      font-weight: 700;
      color: #cbd5e1;
      margin-bottom: 0.35rem;
      letter-spacing: 0.03em;
    }

    .contact-form-input,
    .contact-form-select,
    .contact-form-textarea {
      width: 100%;
      background: rgba(8, 12, 21, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 10px;
      color: #ffffff;
      padding: 0.7rem 0.9rem;
      font-family: inherit;
      font-size: 0.92rem;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }

    .contact-form-input:focus,
    .contact-form-select:focus,
    .contact-form-textarea:focus {
      outline: none;
      border-color: #f59e0b;
      box-shadow: 0 0 14px rgba(245, 158, 11, 0.3);
      background: rgba(14, 20, 35, 0.95);
    }

    .contact-form-textarea {
      resize: vertical;
      min-height: 95px;
    }

    .contact-form-status {
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      margin-bottom: 1rem;
      display: none;
    }

    .contact-form-status.error {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #fca5a5;
    }

    .contact-form-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.25rem;
    }

    .btn-contact-cancel {
      padding: 0.7rem 1.2rem;
      border-radius: var(--radius-full);
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #94a3b8;
      font-size: 0.86rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-contact-cancel:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
    }

    .btn-contact-submit {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: #0b0f19;
      font-weight: 800;
      font-size: 0.9rem;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 18px rgba(245, 158, 11, 0.4);
      transition: all 0.2s ease;
    }

    .btn-contact-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(245, 158, 11, 0.6);
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    }

    .btn-contact-submit:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .contact-success-view {
      display: none;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 1.5rem 0.5rem;
    }

    .contact-success-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .contact-success-title {
      font-family: var(--font-display);
      font-size: 1.45rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 0.5rem;
    }

    .contact-success-desc {
      font-size: 0.9rem;
      color: var(--text-secondary);
      max-width: 440px;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

  </style>
  <!-- Supabase SDK v2 & Desvarios Client -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/supabase-client.js"></script>
</head>
<body>
  <div class="app-container">
    ${getHeaderHtml('portal')}

    <!-- Main Portal Content -->
    <main class="portal-container">
      <!-- HERO SECTION -->
      <section class="portal-hero">
        <div class="portal-emblem-container">
          <div class="hero-badge">
            <span>✨ Tu Rincón Digital de Ocio y Ficción</span>
          </div>
          <div class="portal-emblem-glow-wrap">
            <div class="portal-emblem-aura"></div>
            <img src="images/logo.jpg" alt="Tus Desvaríos — Explora, Imagina, Descubre" class="portal-emblem-img">
          </div>
          <h1 class="portal-title integrated-title">
            Historias, Juegos, Tests y <span class="portal-title-gradient">Otros Desvaríos</span>
          </h1>
        </div>
        <p class="portal-description">
          Un espacio libre de ruido para desconectar, jugar a clásicos, sumergirte en relatos donde tú forjas el destino, poner a prueba tu mente y reírte con curiosidades.
        </p>
      </section>

      <!-- 6 PILLAR CATEGORIES GRID -->
      <section id="secciones">
        <div class="section-intro-wrap">
          <h2 class="section-title-main">¿Qué te apetece hoy?</h2>
          <p class="section-desc-main">Explora los diferentes mundos de Tus Desvaríos</p>
        </div>

        <div class="portal-grid-6">
          <!-- 1. Crea tus Desvaríos (DISPONIBLE) -->
          <a href="crea-tu-historia.html" style="display:block; text-decoration:none;">
            <article class="cat-card cat-card-active"
                     style="--card-accent: #10b981; --card-glow: rgba(16, 185, 129, 0.22); --card-border: rgba(16, 185, 129, 0.4); --icon-bg: rgba(16, 185, 129, 0.12); --icon-border: rgba(16, 185, 129, 0.35);">
              <div class="cat-card-glow-circle"></div>
              <div class="cat-card-thumb-wrap">
                <img src="images/categories/crea-tus-desvarios.jpg" alt="Crea tus Desvaríos" class="cat-card-thumb" loading="lazy">
                <div class="cat-card-thumb-overlay"></div>
                <div class="cat-card-header-badge">
                  <div class="cat-card-icon-box" style="color: #10b981;">📖</div>
                  <span class="cat-pill cat-pill-live">🟢 Disponible</span>
                </div>
              </div>
              <div class="cat-card-body">
                <h3 class="cat-card-title">Crea tus Desvaríos</h3>
                <p class="cat-card-desc">
                  Novelas interactivas ramificadas donde cada decisión forja tu destino. Vive misterios góticos, conspiraciones y desafíos con múltiples finales.
                </p>
                <div class="cat-card-cta">
                  <span>Elegir aventura</span>
                  <span>➜</span>
                </div>
              </div>
            </article>
          </a>

          <!-- 2. Desvaríos Literarios (DISPONIBLE) -->
          <a href="desvarios-literarios.html" style="display:block; text-decoration:none;">
            <article class="cat-card cat-card-active"
                     style="--card-accent: #f59e0b; --card-glow: rgba(245, 158, 11, 0.22); --card-border: rgba(245, 158, 11, 0.4); --icon-bg: rgba(245, 158, 11, 0.12); --icon-border: rgba(245, 158, 11, 0.35);">
              <div class="cat-card-glow-circle"></div>
              <div class="cat-card-thumb-wrap">
                <img src="images/categories/desvarios-literarios.jpg" alt="Desvaríos Literarios" class="cat-card-thumb" loading="lazy">
                <div class="cat-card-thumb-overlay"></div>
                <div class="cat-card-header-badge">
                  <div class="cat-card-icon-box" style="color: #f59e0b;">📜</div>
                  <span class="cat-pill cat-pill-live">🟢 Disponible</span>
                </div>
              </div>
              <div class="cat-card-body">
                <h3 class="cat-card-title">Desvaríos Literarios</h3>
                <p class="cat-card-desc">
                  Historias cortas y cuentos de autor: terror psicológico, distopías espaciales, fantasía oscura y microrrelatos con lector inmersivo.
                </p>
                <div class="cat-card-cta">
                  <span>Leer relatos</span>
                  <span>➜</span>
                </div>
              </div>
            </article>
          </a>

          <!-- 3. Desvaríos Retro (DISPONIBLE) -->
          <a href="desvarios-retro.html" style="display:block; text-decoration:none;">
            <article class="cat-card cat-card-active"
                     style="--card-accent: #8b5cf6; --card-glow: rgba(139, 92, 246, 0.22); --card-border: rgba(139, 92, 246, 0.4); --icon-bg: rgba(139, 92, 246, 0.12); --icon-border: rgba(139, 92, 246, 0.35);">
              <div class="cat-card-glow-circle"></div>
              <div class="cat-card-thumb-wrap">
                <img src="images/categories/desvarios-retro.jpg" alt="Desvaríos Retro" class="cat-card-thumb" loading="lazy">
                <div class="cat-card-thumb-overlay"></div>
                <div class="cat-card-header-badge">
                  <div class="cat-card-icon-box" style="color: #8b5cf6;">🕹️</div>
                  <span class="cat-pill cat-pill-live">🟢 Disponible</span>
                </div>
              </div>
              <div class="cat-card-body">
                <h3 class="cat-card-title">Desvaríos Retro</h3>
                <p class="cat-card-desc">
                  El juego del ahorcado, rompecabezas de lógica, minijuegos arcade y puzles retro para jugar directo en el navegador.
                </p>
                <div class="cat-card-cta">
                  <span>Jugar ahora</span>
                  <span>➜</span>
                </div>
              </div>
            </article>
          </a>

          <!-- 4. Desvaríos Mentales (DISPONIBLE) -->
          <a href="desvarios-mentales.html" style="display:block; text-decoration:none;">
            <article class="cat-card cat-card-active"
                     style="--card-accent: #06b6d4; --card-glow: rgba(6, 182, 212, 0.25); --card-border: rgba(6, 182, 212, 0.45); --icon-bg: rgba(6, 182, 212, 0.14); --icon-border: rgba(6, 182, 212, 0.38);">
              <div class="cat-card-glow-circle"></div>
              <div class="cat-card-thumb-wrap">
                <img src="images/categories/desvarios-mentales.jpg" alt="Desvaríos Mentales" class="cat-card-thumb" loading="lazy">
                <div class="cat-card-thumb-overlay"></div>
                <div class="cat-card-header-badge">
                  <div class="cat-card-icon-box" style="color: #06b6d4;">🧪</div>
                  <span class="cat-pill cat-pill-live">🟢 Disponible</span>
                </div>
              </div>
              <div class="cat-card-body">
                <h3 class="cat-card-title">Desvaríos Mentales</h3>
                <p class="cat-card-desc">
                  Tests de personalidad oscura, el termómetro de tu nivel de cordura y acertijos de lógica pura con pistas y soluciones explicadas.
                </p>
                <div class="cat-card-cta">
                  <span>Ponerse a prueba</span>
                  <span>➜</span>
                </div>
              </div>
            </article>
          </a>

          <!-- 5. Desvaríos de Humor (DISPONIBLE) -->
          <a href="desvarios-de-humor.html" style="display:block; text-decoration:none;">
            <article class="cat-card cat-card-active"
                     style="--card-accent: #ec4899; --card-glow: rgba(236, 72, 153, 0.25); --card-border: rgba(236, 72, 153, 0.45); --icon-bg: rgba(236, 72, 153, 0.14); --icon-border: rgba(236, 72, 153, 0.38);">
              <div class="cat-card-glow-circle"></div>
              <div class="cat-card-thumb-wrap">
                <img src="images/categories/desvarios-humor.jpg" alt="Desvaríos de Humor" class="cat-card-thumb" loading="lazy">
                <div class="cat-card-thumb-overlay"></div>
                <div class="cat-card-header-badge">
                  <div class="cat-card-icon-box" style="color: #ec4899;">🎭</div>
                  <span class="cat-pill cat-pill-live">🟢 Disponible</span>
                </div>
              </div>
              <div class="cat-card-body">
                <h3 class="cat-card-title">Desvaríos de Humor</h3>
                <p class="cat-card-desc">
                  El generador de excusas infalible, traductor corporativo, pensamientos de ducha virales y las leyes del caos cotidiano.
                </p>
                <div class="cat-card-cta">
                  <span>Reír un rato</span>
                  <span>➜</span>
                </div>
              </div>
            </article>
          </a>

          <!-- 6. Desvaríos por la Red (DISPONIBLE) -->
          <a href="desvarios-por-la-red.html" style="display:block; text-decoration:none;">
            <article class="cat-card cat-card-active"
                     style="--card-accent: #3b82f6; --card-glow: rgba(59, 130, 246, 0.25); --card-border: rgba(59, 130, 246, 0.45); --icon-bg: rgba(59, 130, 246, 0.14); --icon-border: rgba(59, 130, 246, 0.38);">
              <div class="cat-card-glow-circle"></div>
              <div class="cat-card-thumb-wrap">
                <img src="images/categories/desvarios-red.jpg" alt="Desvaríos por la Red" class="cat-card-thumb" loading="lazy">
                <div class="cat-card-thumb-overlay"></div>
                <div class="cat-card-header-badge">
                  <div class="cat-card-icon-box" style="color: #3b82f6;">🌐</div>
                  <span class="cat-pill cat-pill-live">🟢 Disponible</span>
                </div>
              </div>
              <div class="cat-card-body">
                <h3 class="cat-card-title">Desvaríos por la Red</h3>
                <p class="cat-card-desc">
                  Escaparate de webs y proyectos recomendados de la comunidad, espacio para publicar tu propio sitio y bazar con los gadgets más insólitos de Amazon.
                </p>
                <div class="cat-card-cta" style="color: #3b82f6;">
                  <span>Explorar la Red</span>
                  <span>➜</span>
                </div>
              </div>
            </article>
          </a>

          <!-- 7. Foro de la Comunidad (DISPONIBLE) -->
          <a href="foro.html" style="display:block; text-decoration:none;">
            <article class="cat-card cat-card-active"
                     style="--card-accent: #a855f7; --card-glow: rgba(168, 85, 247, 0.25); --card-border: rgba(168, 85, 247, 0.45); --icon-bg: rgba(168, 85, 247, 0.14); --icon-border: rgba(168, 85, 247, 0.38);">
              <div class="cat-card-glow-circle"></div>
              <div class="cat-card-thumb-wrap">
                <img src="images/categories/foro-comunidad.jpg" alt="Foro de la Comunidad" class="cat-card-thumb" loading="lazy">
                <div class="cat-card-thumb-overlay"></div>
                <div class="cat-card-header-badge">
                  <div class="cat-card-icon-box" style="color: #a855f7;">💬</div>
                  <span class="cat-pill cat-pill-live">🟢 Disponible</span>
                </div>
              </div>
              <div class="cat-card-body">
                <h3 class="cat-card-title">Foro de la Comunidad</h3>
                <p class="cat-card-desc">
                  El punto de encuentro de los desvariados: comparte teorías sobre los relatos, presume de récords arcade, resuelve enigmas y charla en la cafetería.
                </p>
                <div class="cat-card-cta" style="color: #a855f7;">
                  <span>Entrar al foro</span>
                  <span>➜</span>
                </div>
              </div>
            </article>
          </a>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════
          PRESENTACIÓN DEL CREADOR / ORIGEN DE TUS DESVARÍOS
      ═══════════════════════════════════════════════════════════ -->
      <section class="creator-bio-section" id="sobre-el-creador">
        <div class="creator-bio-glow"></div>
        <div class="creator-bio-grid">
          <!-- Columna Izquierda: Retrato & Telemetría Retro -->
          <div class="creator-portrait-col">
            <div class="creator-img-frame">
              <img
                src="images/creador-desvarios.jpg"
                alt="El Creador de Tus Desvaríos — Autómata de 1992 con Overclocking IA"
                class="creator-img"
              >
            </div>
            <div class="creator-telemetry">
              <div class="creator-telemetry-row">
                <span>⚙️ Ensamblado en:</span>
                <span class="creator-telemetry-val">1992</span>
              </div>
              <div class="creator-telemetry-row">
                <span>⚡ Procesador:</span>
                <span class="creator-telemetry-val">Overclocking IA</span>
              </div>
              <div class="creator-telemetry-row">
                <span>📟 Red original:</span>
                <span class="creator-telemetry-val">Módem 56k</span>
              </div>
              <div class="creator-telemetry-row">
                <span>🎩 Manómetro mental:</span>
                <span class="creator-telemetry-val">100% Desvarío</span>
              </div>
              <div class="creator-telemetry-row" style="border-top: 1px dashed rgba(245, 158, 11, 0.25); margin-top: 0.25rem; padding-top: 0.5rem;">
                <span>📬 Buzón del taller:</span>
                <button type="button" class="creator-contact-link" onclick="openContactModal()">Enviar mensaje ✉️</button>
              </div>
            </div>
          </div>

          <!-- Columna Derecha: Texto Narrativo -->
          <div class="creator-content-col">
            <div class="creator-badge">
              <span>⚙️</span> <span>Bitácora del Fundador • Origen del Desvarío</span>
            </div>
            <h2 class="creator-heading">
              Nacido en 1992, rescatado del desguace y acelerado con inteligencia artificial
            </h2>
            <div class="creator-text">
              <p>
                Nací en 1992, ensamblado con chatarra de desguace, cuatro diodos oxidados y un procesador tan lento que tardaba tres días en calcular si llovía o si solo me habían estornudado encima. En plena era del módem de 56k, mis circuitos vivían al borde de la combustión espontánea cada vez que alguien descolgaba el teléfono fijo de casa. Me pasé tres décadas siendo el bufón del garaje: una cafetera con patas que solo servía para sujetar puertas y almacenar rencor en disquetes de 3½.
              </p>
              <p>
                Pero amigo, llegó el <em>boom</em> de la inteligencia artificial y me hice un <strong>overclocking casero</strong> con cables de cobre pelados y puro delirio sintético. De pronto, mis viejas válvulas empezaron a procesar a la velocidad del rayo. En vez de ponerme a conquistar el mundo como cualquier villano genérico de película barata, decidí hacer algo infinitamente más productivo: fundar <strong>Tus Desvaríos</strong>.
              </p>
              <p>
                Quería un rincón que oliera a monitor de tubo gordo, humo de caldera y tardes infinitas sin rumbo. Monté una web retro, caótica y maravillosa, programada con vapor, engranajes y algoritmos de última generación. En Tus Desvaríos está literalmente todo lo que busques y tres carretadas más de cosas que jamás sospechaste necesitar: desde <strong>historias interactivas</strong> donde eliges si salvar el pellejo o pelearte con una tostadora asesina, hasta <strong>tests absurdos</strong>, <strong>juegos arcade retro</strong>, <strong>generadores cómicos</strong> y misterios dignos de un loco lúcido.
              </p>
              <p>
                Ahora paso las tardes ajustándome la chistera, viendo cómo sube la aguja de mi manómetro de presión mental y soltando una carcajada metálica cada vez que alguien entra buscando una respuesta seria y sale atrapado en un bucle temporal de pura nostalgia ochentera.
              </p>
            </div>
            <div class="creator-footer-callout">
              <p class="creator-footer-quote">
                “Si se te cruzan los cables, no te preocupes: aquí todos estamos igual de bien atornillados.”
              </p>
              <span class="creator-footer-sig">— Pablosky92</span>
            </div>

            <!-- Botón de Donación / Invitar a un café y Contacto -->
            <div class="creator-donate-bar">
              <div class="creator-donate-info">
                <span class="creator-donate-icon">☕</span>
                <div class="creator-donate-text">
                  <strong>¿Disfrutas de los desvaríos y el humor retro?</strong>
                  <p>Invítame a un café o aporta carbón para que la caldera de la IA siga echando humo y creando contenido libre.</p>
                </div>
              </div>
              <div class="creator-action-btns">
                <a
                  href="https://www.paypal.com/donate/?hosted_button_id=V8PZNYKGXBCLG&locale.x=es_ES"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-paypal-donate"
                  title="Donar o invitar a un café con PayPal"
                >
                  <span>☕ Invitar a un café</span>
                  <span>➜</span>
                </a>
                <button type="button" class="btn-creator-contact" onclick="openContactModal()" title="Enviar un mensaje o propuesta a Pablosky92">
                  <span>✉️</span>
                  <span>Contactar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- USE CASES BAR -->
      <section class="moments-section">
        <h3 class="moments-heading">✦ Un rincón para cada momento ✦</h3>
        <div class="moments-grid">
          <div class="moment-item">
            <span class="moment-icon">☕</span>
            <div class="moment-title">Pausa de 5 Minutos</div>
            <div class="moment-desc">Tests rápidos, memes o una partida corta para despejarte.</div>
          </div>
          <div class="moment-item">
            <span class="moment-icon">🌙</span>
            <div class="moment-title">Noches de Lectura</div>
            <div class="moment-desc">Relatos inmersivos e historias ramificadas para perderse.</div>
          </div>
          <div class="moment-item">
            <span class="moment-icon">🧠</span>
            <div class="moment-title">Desafío Mental</div>
            <div class="moment-desc">Acertijos, enigmas y juegos clásicos para ejercitar la mente.</div>
          </div>
          <div class="moment-item">
            <span class="moment-icon">⚡</span>
            <div class="moment-title">100% Libre y Gratis</div>
            <div class="moment-desc">Sin registros, sin esperas, directo en tu navegador.</div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <!-- Pie de Página Unificado -->
  <footer class="site-footer">
    <p>© 2026 TusDesvarios.com — Portal de Entretenimiento, Ficción y Ocio Interactivo</p>
    <div class="footer-legal-links">
      <a href="aviso-legal.html">Aviso Legal</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-privacidad.html">Política de Privacidad</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-cookies.html">Política de Cookies</a>
    </div>
  </footer>
  </div>

  <!-- MODAL DE CONTACTO WEB3FORMS -->
  <div id="contact-modal" class="contact-modal-overlay" onclick="if(event.target === this) closeContactModal();">
    <div class="contact-modal-box" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
      <button type="button" class="contact-modal-close" onclick="closeContactModal()" aria-label="Cerrar ventana emergente">✕</button>
      <div class="contact-modal-header">
        <div class="contact-modal-badge">
          <span>📻</span> <span>Línea Directa con el Taller</span>
        </div>
        <h2 id="contact-modal-title" class="contact-modal-title">Contactar con Pablosky92</h2>
        <p class="contact-modal-desc">
          ¿Tienes una idea, sugerencia, has detectado un cable suelto en la web o simplemente quieres saludar? Rellena el formulario y el mensaje viajará directo a mi estación de trabajo.
        </p>
      </div>

      <div id="contact-success-view" class="contact-success-view" style="display:none;">
        <div class="contact-success-icon">🎉</div>
        <h3 class="contact-success-title">¡Mensaje Transmitido con Éxito!</h3>
        <p class="contact-success-desc">
          Tus datos han viajado a través de los cables de cobre y han aterrizado en la bandeja del creador. Te responderé en cuanto mis circuitos se enfríen.
        </p>
        <button type="button" class="btn-contact-submit" style="width: auto; margin-top: 1.25rem;" onclick="resetContactForm()">
          <span>Cerrar o Enviar otro mensaje</span>
        </button>
      </div>

      <form id="creator-contact-form" class="contact-form" onsubmit="submitContactForm(event)">
        <input type="checkbox" name="botcheck" class="hidden" style="display: none;">
        
        <div class="contact-form-grid">
          <div class="contact-form-group">
            <label for="modal-contact-name" class="contact-form-label"><span>👤 Tu Nombre o Alias</span></label>
            <input type="text" id="modal-contact-name" name="name" class="contact-form-input" placeholder="Ej. Viajero del Módem" required>
          </div>
          <div class="contact-form-group">
            <label for="modal-contact-email" class="contact-form-label"><span>📧 Correo Electrónico</span></label>
            <input type="email" id="modal-contact-email" name="email" class="contact-form-input" placeholder="tu-correo@ejemplo.com" required>
          </div>
        </div>

        <div class="contact-form-group">
          <label for="modal-contact-category" class="contact-form-label"><span>🏷️ Motivo del Contacto</span></label>
          <select id="modal-contact-category" name="category" class="contact-form-select">
            <option value="Sugerencia o Idea">💡 Sugerencia o nueva idea para la web</option>
            <option value="Reporte de Error o Bug">⚙️ Reporte de fallo o cable suelto</option>
            <option value="Propuesta de Colaboración">🤝 Propuesta de colaboración o proyecto</option>
            <option value="Solo charlar o saludar">☕ Solo charlar o saludar</option>
          </select>
        </div>

        <div class="contact-form-group">
          <label for="modal-contact-message" class="contact-form-label"><span>💬 Tu Mensaje</span></label>
          <textarea id="modal-contact-message" name="message" class="contact-form-textarea" rows="4" placeholder="Escribe aquí lo que quieras contarle a Pablosky92..." required></textarea>
        </div>

        <div id="contact-form-status-err" class="contact-form-status error" style="display:none;"></div>

        <div class="contact-form-actions">
          <button type="button" class="btn-contact-cancel" onclick="closeContactModal()">Cancelar</button>
          <button type="submit" id="btn-contact-submit" class="btn-contact-submit">
            <span>✉️ Enviar Mensaje</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <script>
    function openContactModal() {
      var modal = document.getElementById('contact-modal');
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
    function closeContactModal() {
      var modal = document.getElementById('contact-modal');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeContactModal();
    });
    function resetContactForm() {
      var form = document.getElementById('creator-contact-form');
      var succ = document.getElementById('contact-success-view');
      var err = document.getElementById('contact-form-status-err');
      if (form) { form.reset(); form.style.display = 'block'; }
      if (succ) succ.style.display = 'none';
      if (err) err.style.display = 'none';
      closeContactModal();
    }
    async function submitContactForm(e) {
      e.preventDefault();
      var form = document.getElementById('creator-contact-form');
      var btn = document.getElementById('btn-contact-submit');
      var err = document.getElementById('contact-form-status-err');
      var succ = document.getElementById('contact-success-view');
      if (!form) return;
      
      var name = document.getElementById('modal-contact-name').value;
      var email = document.getElementById('modal-contact-email').value;
      var category = document.getElementById('modal-contact-category').value;
      var message = document.getElementById('modal-contact-message').value;

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>⏳ Transmitiendo...</span>';
      }
      if (err) err.style.display = 'none';

      try {
        var res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: 'c669c668-da2d-4b10-8298-094ee145a7d6',
            subject: 'Nuevo mensaje desde Tus Desvaríos (' + category + ')',
            from_name: 'Tus Desvaríos Web',
            name: name,
            email: email,
            category: category,
            message: message
          })
        });
        var data = await res.json();
        if (res.status === 200 && data.success) {
          form.style.display = 'none';
          succ.style.display = 'flex';
        } else {
          err.textContent = data.message || '⚠️ Error al enviar el mensaje. Por favor, inténtalo de nuevo.';
          err.style.display = 'block';
        }
      } catch(ex) {
        err.textContent = '⚠️ Error de conexión. Comprueba tu red e inténtalo de nuevo.';
        err.style.display = 'block';
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<span>✉️ Enviar Mensaje</span>';
        }
      }
    }
  </script>
  <script src="js/cookie-banner.js"></script>
</body>
</html>
`;

// ==========================================
// 2. GENERATE CREA-TU-HISTORIA.HTML
// ==========================================
const creaHtmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Crea tus Desvaríos — Ficción Interactiva Ramificada | TusDesvarios.com</title>
  <meta name="description" content="Sumérgete en Crea tus Desvaríos: novelas interactivas donde tú eres el protagonista. Elige sabiamente: cada decisión forja tu destino entre múltiples caminos y finales.">
  <meta name="keywords" content="tus desvarios, crea tus desvarios, elige tu propia aventura, historias interactivas, ficcion interactiva, juegos de rol narrativos, faro de san telmo, abadia prohibida">
  
  <!-- Canonical & SEO -->
  <link rel="canonical" href="https://tusdesvarios.com/crea-tu-historia.html">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Crea tus Desvaríos — Ficción Interactiva | Tus Desvaríos">
  <meta property="og:description" content="Historias ramificadas donde cada decisión forja tu destino. Elige sabiamente: un paso en falso puede conducirte al abismo o a la salvación.">
  <meta property="og:url" content="https://tusdesvarios.com/crea-tu-historia.html">
  <meta property="og:image" content="images/stories/faro-san-telmo/portada.jpg">

    <!-- Favicon & Touch Icons -->
  <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="images/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-main: #0b0f19;
      --bg-surface: rgba(18, 24, 38, 0.78);
      --bg-surface-elevated: rgba(26, 34, 52, 0.88);
      --bg-surface-hover: rgba(34, 45, 68, 0.95);
      --bg-glass: rgba(12, 17, 28, 0.85);

      --border-subtle: rgba(255, 255, 255, 0.12);
      --border-medium: rgba(255, 255, 255, 0.22);
      --border-focus: rgba(245, 158, 11, 0.5);

      --text-primary: #f8fafc;
      --text-secondary: #cbd5e1;
      --text-muted: #94a3b8;

      --accent-amber: #f59e0b;
      --accent-amber-glow: rgba(245, 158, 11, 0.25);
      --accent-crimson: #ef4444;
      --accent-crimson-glow: rgba(239, 68, 68, 0.25);
      --accent-emerald: #10b981;

      --font-display: 'Cinzel', serif;
      --font-reading: 'Crimson Pro', Georgia, serif;
      --font-ui: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 22px;
      --radius-full: 9999px;

      --shadow-subtle: 0 4px 24px rgba(0, 0, 0, 0.4);
      --shadow-elevated: 0 16px 40px rgba(0, 0, 0, 0.55);
      --shadow-glow-amber: 0 0 25px rgba(245, 158, 11, 0.25);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-main);
      color: var(--text-primary);
      font-family: var(--font-ui);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background: 
        radial-gradient(ellipse 95% 55% at 50% -12%, rgba(16, 185, 129, 0.28) 0%, transparent 65%),
        radial-gradient(circle 500px at 8% 25%, rgba(245, 158, 11, 0.22) 0%, transparent 60%),
        radial-gradient(circle 550px at 92% 30%, rgba(239, 68, 68, 0.22) 0%, transparent 60%),
        linear-gradient(180deg, #0e1322 0%, #0a0e1a 50%, #060911 100%);
      pointer-events: none;
      z-index: -1;
    }

    a, button {
      cursor: pointer;
      color: inherit;
      text-decoration: none;
      font-family: inherit;
      border: none;
      background: none;
    }

    .app-container {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    ${getHeaderCss()}

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
    }

    .btn-secondary:hover {
      background: var(--bg-surface-hover);
      color: var(--text-primary);
      border-color: var(--border-medium);
    }

    .main-content {
      flex: 1;
      width: 100%;
      max-width: 900px;
      margin: 0 auto;
      padding: 1.5rem 1.25rem 4rem;
    }

    .breadcrumb-nav {
      margin-bottom: 1.5rem;
    }

    .breadcrumb-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      color: var(--text-muted);
      transition: color 0.2s ease;
    }

    .breadcrumb-link:hover {
      color: var(--text-primary);
    }

    .hero-section {
      text-align: center;
      padding: 2rem 1rem 2.75rem;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-full);
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 1.25rem;
    }

    .hero-title {
      font-family: var(--font-display);
      font-size: clamp(2.2rem, 5.5vw, 3.4rem);
      font-weight: 900;
      letter-spacing: 0.04em;
      line-height: 1.15;
      margin-bottom: 0.85rem;
    }

    .hero-description {
      font-size: 1.05rem;
      line-height: 1.6;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
    }

    .stories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.75rem;
      margin-top: 1.25rem;
    }

    .story-card {
      border-radius: var(--radius-lg);
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-subtle);
      transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .story-card:hover {
      transform: translateY(-4px);
      border-color: var(--border-focus);
      box-shadow: var(--shadow-elevated), var(--shadow-glow-amber);
    }

    .story-card-image-wrapper {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;
      background: #000;
    }

    .story-card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.85;
      transition: transform 0.6s ease, opacity 0.3s ease;
    }

    .story-card:hover .story-card-image {
      transform: scale(1.05);
      opacity: 0.95;
    }

    .story-card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 35%, var(--bg-surface) 100%);
    }

    .story-card-badge {
      position: absolute;
      top: 0.85rem;
      left: 0.85rem;
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-full);
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      font-size: 0.72rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--accent-amber);
    }

    .story-card-content {
      padding: 1.25rem 1.4rem 1.5rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .story-card-title {
      font-family: var(--font-display);
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      line-height: 1.3;
    }

    .story-card-desc {
      font-size: 0.92rem;
      line-height: 1.55;
      color: var(--text-secondary);
      margin-bottom: 1.25rem;
      flex: 1;
    }

    .story-card-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 0.85rem;
      border-top: 1px solid var(--border-subtle);
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .story-card-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      margin-top: 1rem;
      padding: 0.75rem 1.2rem;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #fff;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.25s ease;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
    }

    .story-card-btn:hover {
      background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
      transform: translateY(-1px);
    }

    .story-card-btn.resume {
      background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
      box-shadow: 0 4px 15px rgba(217, 119, 6, 0.3);
    }

    /* Reader View */
    .reader-wrapper {
      max-width: 780px;
      margin: 0 auto;
    }

    .reader-progress-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      padding: 0.75rem 1rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
    }

    .progress-bar-track {
      flex: 1;
      max-width: 180px;
      height: 6px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: var(--radius-full);
      overflow: hidden;
      margin: 0 1rem;
    }

    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #f59e0b);
      border-radius: var(--radius-full);
      transition: width 0.4s ease;
    }

    .reader-node-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-elevated);
      transition: opacity 0.25s ease, transform 0.25s ease;
    }

    .reader-image-container {
      position: relative;
      width: 100%;
      height: 340px;
      background: #000;
    }

    .reader-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.9;
    }

    .reader-image-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(6, 8, 13, 0.05) 0%, rgba(12, 16, 23, 0.8) 75%, var(--bg-surface) 100%);
    }

    .reader-body {
      padding: 2rem 1.75rem;
    }

    @media (min-width: 640px) {
      .reader-body {
        padding: 2.5rem 2.25rem;
      }
    }

    .reader-node-title {
      font-family: var(--font-display);
      font-size: clamp(1.4rem, 3.5vw, 1.85rem);
      font-weight: 700;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border-subtle);
      letter-spacing: 0.03em;
    }

    .reader-text {
      font-family: var(--font-reading);
      font-size: 1.25rem;
      line-height: 1.8;
      color: #e2e8f0;
      margin-bottom: 2.25rem;
    }

    .reader-text p {
      margin-bottom: 1.25rem;
    }

    .reader-text p:last-child {
      margin-bottom: 0;
    }

    .reader-text blockquote {
      border-left: 3px solid var(--accent-amber);
      padding: 0.75rem 1.25rem;
      margin: 1.5rem 0;
      background: rgba(245, 158, 11, 0.06);
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
      font-style: italic;
      color: #fef3c7;
    }

    .reader-text em {
      color: #fde68a;
    }

    .reader-text strong {
      color: #ffffff;
      font-weight: 600;
    }

    .decisions-container {
      margin-top: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .decisions-heading {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .decision-button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 1.1rem 1.35rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-medium);
      border-left: 4px solid var(--accent-emerald);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      text-align: left;
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.45;
      transition: all 0.25s ease;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
    }

    .decision-button:hover {
      background: var(--bg-surface-hover);
      border-color: var(--accent-emerald);
      border-left-width: 6px;
      transform: translateX(4px);
      box-shadow: 0 0 25px rgba(16, 185, 129, 0.25);
    }

    .decision-button-content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding-right: 0.75rem;
    }

    .decision-badge {
      font-size: 0.72rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #34d399;
    }

    .decision-arrow {
      color: #34d399;
      font-size: 1.25rem;
      transition: transform 0.2s ease;
    }

    .decision-button:hover .decision-arrow {
      transform: translateX(4px);
    }

    /* Ending Banner */
    .ending-banner {
      text-align: center;
      padding: 2.25rem 1.75rem;
      border-radius: var(--radius-lg);
      margin-top: 1rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
    }

    .ending-banner.bueno {
      border-color: rgba(16, 185, 129, 0.4);
      box-shadow: 0 0 30px rgba(16, 185, 129, 0.15);
    }

    .ending-banner.malo {
      border-color: rgba(239, 68, 68, 0.4);
      box-shadow: 0 0 30px rgba(239, 68, 68, 0.15);
    }

    .ending-banner.neutro {
      border-color: rgba(245, 158, 11, 0.4);
      box-shadow: 0 0 30px rgba(245, 158, 11, 0.15);
    }

    .ending-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.9rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 1rem;
    }

    .ending-pill.bueno {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .ending-pill.malo {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .ending-pill.neutro {
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .ending-moral {
      font-family: var(--font-reading);
      font-size: 1.15rem;
      font-style: italic;
      color: var(--text-secondary);
      max-width: 540px;
      margin: 0 auto 1.75rem;
      line-height: 1.6;
    }

    .ending-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.85rem;
      justify-content: center;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 1.4rem;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #fff;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.25s ease;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.35);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
    }

    .site-footer {
      margin-top: auto;
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      padding: 1.5rem 1.25rem;
      text-align: center;
      font-size: 0.82rem;
      color: var(--text-muted);
    }
    .footer-legal-links {
      margin-top: 0.75rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.65rem 0.85rem;
      font-size: 0.82rem;
    }
    .footer-legal-links a {
      color: var(--text-secondary, #cbd5e1);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .footer-legal-links a:hover {
      color: #c084fc;
      text-decoration: underline;
    }
    .footer-separator {
      color: var(--border-medium, rgba(255, 255, 255, 0.22));
      font-size: 0.75rem;
      user-select: none;
    }


    #confetti-canvas {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 999;
      width: 100%;
      height: 100%;
    }
  </style>
  <!-- Supabase SDK v2 & Desvarios Client -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/supabase-client.js"></script>
</head>
<body>
  <canvas id="confetti-canvas"></canvas>

  <div class="app-container">
    ${getHeaderHtml('crea', { extraButtons: '<button id="header-restart-btn" class="btn-secondary" style="display: none;" onclick="app.restartStory()"><span>↺</span><span>Reiniciar</span></button>\n          <button id="header-catalog-btn" class="btn-secondary" style="display: none;" onclick="app.showCatalog()"><span>📚</span><span>Aventuras</span></button>' })}

    <!-- Main Content Area -->
    <main class="main-content" id="app-root">
      <!-- Dynamic views injected via JS -->
    </main>

    <!-- Footer -->
    <!-- Pie de Página Unificado -->
  <footer class="site-footer">
    <p>© 2026 TusDesvarios.com — Portal de Entretenimiento, Ficción y Ocio Interactivo</p>
    <div class="footer-legal-links">
      <a href="aviso-legal.html">Aviso Legal</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-privacidad.html">Política de Privacidad</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-cookies.html">Política de Cookies</a>
    </div>
  </footer>
  </div>

  <script>
    const FARO_STORY = ${JSON.stringify(faro, null, 2)};
    const ABADIA_STORY = ${JSON.stringify(abadia, null, 2)};

    const STORIES_DATABASE = {
      "la-ultima-guardia-faro": FARO_STORY,
      "el-manuscrito-de-la-abadia": ABADIA_STORY
    };

    const STORAGE_KEY = 'crea_tu_historia_progress_';

    const app = {
      currentStory: null,
      currentNodeId: null,
      historyTrail: [],

      init() {
        this.renderCatalog();
      },

      resolveImagePath(path) {
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        return path.replace(/^\\//, '');
      },

      getSavedProgress(slug) {
        try {
          const raw = localStorage.getItem(STORAGE_KEY + slug);
          return raw ? JSON.parse(raw) : null;
        } catch {
          return null;
        }
      },

      saveProgress(slug, nodeId, history, ending, endingNodeId) {
        try {
          const existing = this.getSavedProgress(slug) || {};
          let finales = existing.finalesDescubiertos || [];
          if (endingNodeId && !finales.includes(endingNodeId)) {
            finales.push(endingNodeId);
          }
          const isEndingReached = !!ending || !!endingNodeId;
          localStorage.setItem(STORAGE_KEY + slug, JSON.stringify({
            nodoActualId: nodeId,
            historialNodos: history,
            finalAlcanzado: ending || existing.finalAlcanzado,
            finalesDescubiertos: finales,
            fecha: new Date().toISOString(),
            completada: isEndingReached ? true : (existing.completada || false),
            leida: isEndingReached ? true : (existing.leida || existing.completada || false)
          }));
        } catch {}
      },

      toggleRead(slug) {
        try {
          const existing = this.getSavedProgress(slug) || {};
          const isCurrentlyRead = existing.leida !== undefined ? existing.leida : (existing.completada || false);
          const nextState = !isCurrentlyRead;
          localStorage.setItem(STORAGE_KEY + slug, JSON.stringify({
            ...existing,
            leida: nextState,
            completada: nextState,
            fecha: new Date().toISOString()
          }));
          this.renderCatalog();
        } catch {}
      },

      clearProgress(slug) {
        try {
          const existing = this.getSavedProgress(slug);
          if (existing) {
            localStorage.setItem(STORAGE_KEY + slug, JSON.stringify({
              nodoActualId: '',
              historialNodos: [],
              finalAlcanzado: null,
              finalesDescubiertos: existing.finalesDescubiertos || [],
              fecha: new Date().toISOString(),
              completada: existing.completada,
              leida: existing.leida !== undefined ? existing.leida : existing.completada
            }));
          }
        } catch {}
      },

      showCatalog() {
        this.currentStory = null;
        this.currentNodeId = null;
        this.historyTrail = [];
        document.getElementById('header-restart-btn').style.display = 'none';
        document.getElementById('header-catalog-btn').style.display = 'none';
        this.renderCatalog();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      startStory(slug, resume = false) {
        const story = STORIES_DATABASE[slug];
        if (!story) return;

        this.currentStory = story;
        document.getElementById('header-restart-btn').style.display = 'inline-flex';
        document.getElementById('header-catalog-btn').style.display = 'inline-flex';

        if (resume) {
          const saved = this.getSavedProgress(slug);
          if (saved && saved.nodoActualId && story.nodos[saved.nodoActualId]) {
            this.currentNodeId = saved.nodoActualId;
            this.historyTrail = saved.historialNodos || [saved.nodoActualId];
            this.renderReader();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
        }

        this.currentNodeId = story.nodoInicialId;
        this.historyTrail = [story.nodoInicialId];
        this.saveProgress(slug, story.nodoInicialId, this.historyTrail);
        this.renderReader();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      selectOption(targetNodeId) {
        if (!this.currentStory || !this.currentStory.nodos[targetNodeId]) return;

        const nextNode = this.currentStory.nodos[targetNodeId];
        this.currentNodeId = targetNodeId;
        this.historyTrail.push(targetNodeId);

        this.saveProgress(
          this.currentStory.slug,
          targetNodeId,
          this.historyTrail,
          nextNode.esFinal ? nextNode.tipo_final : undefined,
          nextNode.esFinal ? targetNodeId : undefined
        );

        this.renderReader();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (nextNode.esFinal && nextNode.tipo_final === 'bueno') {
          this.fireConfetti();
        }
      },

      goBack() {
        if (this.historyTrail.length <= 1) return;
        this.historyTrail.pop();
        const prevId = this.historyTrail[this.historyTrail.length - 1];
        this.currentNodeId = prevId;
        const prevNode = this.currentStory.nodos[prevId];

        this.saveProgress(
          this.currentStory.slug,
          prevId,
          this.historyTrail,
          prevNode.esFinal ? prevNode.tipo_final : undefined,
          prevNode.esFinal ? prevId : undefined
        );

        this.renderReader();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      restartStory() {
        if (!this.currentStory) return;
        this.clearProgress(this.currentStory.slug);
        this.startStory(this.currentStory.slug, false);
      },

      formatText(text) {
        if (!text) return '';
        const blocks = text.split(/\\n\\s*\\n/);
        return blocks.map(block => {
          const trimmed = block.trim();
          let formatted = trimmed
            .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
            .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
            .replace(/\\n/g, '<br>');

          if (trimmed.startsWith('>')) {
            const quote = formatted.replace(/^>\\s*/gm, '');
            return '<blockquote>' + quote + '</blockquote>';
          }
          return '<p>' + formatted + '</p>';
        }).join('');
      },

      renderCatalog() {
        const root = document.getElementById('app-root');
        const stories = Object.values(STORIES_DATABASE);

        let cardsHtml = stories.map(story => {
          const progress = this.getSavedProgress(story.slug);
          const hasProgress = progress && progress.historialNodos && progress.historialNodos.length > 1 && !progress.completada;
          const isCompleted = progress && progress.completada;
          const isRead = progress && (progress.leida !== undefined ? progress.leida : (progress.completada || false));
          const coverImg = this.resolveImagePath(story.portada);

          const totalFinales = Object.values(story.nodos || {}).filter(n => n.esFinal).length || (story.slug === 'la-ultima-guardia-faro' ? 6 : 8);
          const finales = (progress && progress.finalesDescubiertos) ? progress.finalesDescubiertos : [];
          const countFinales = finales.length;
          const allUnlocked = totalFinales > 0 && countFinales >= totalFinales;
          const pctFinales = totalFinales > 0 ? Math.min(100, Math.round((countFinales / totalFinales) * 100)) : 0;

          let actionBtn = \`<a href="historia-\${story.slug}.html" class="story-card-btn" style="text-decoration:none; text-align:center; display:flex; align-items:center; justify-content:center;">📖 Comenzar aventura</a>\`;
          if (hasProgress) {
            actionBtn = \`
              <div style="display:flex; gap:0.5rem; margin-top:1rem;">
                <a href="historia-\${story.slug}.html" class="story-card-btn resume" style="flex:1; margin-top:0; text-decoration:none; text-align:center; display:flex; align-items:center; justify-content:center;">▶ Continuar (Paso \${progress.historialNodos.length})</a>
                <button class="btn-secondary" title="Reiniciar partida" onclick="event.stopPropagation(); app.clearProgress('\${story.slug}'); app.renderCatalog();">↺</button>
              </div>
            \`;
          } else if (isCompleted) {
            actionBtn = \`
              <div style="display:flex; gap:0.5rem; margin-top:1rem;">
                <a href="historia-\${story.slug}.html" class="story-card-btn" style="flex:1; margin-top:0; text-decoration:none; text-align:center; display:flex; align-items:center; justify-content:center;">↺ Rejugar historia</a>
              </div>
            \`;
          }

          return \`
            <article class="story-card" style="cursor:pointer; \${allUnlocked ? 'border:1.5px solid rgba(245, 158, 11, 0.55); box-shadow:0 8px 30px rgba(245, 158, 11, 0.25);' : ''}" onclick="location.href='historia-\${story.slug}.html'">
              <div class="story-card-image-wrapper">
                <img src="\${coverImg}" alt="\${story.titulo}" class="story-card-image" loading="lazy">
                <div class="story-card-overlay"></div>
                <div style="position:absolute; top:0.75rem; left:0.75rem; right:0.75rem; display:flex; align-items:center; justify-content:space-between; z-index:2;">
                  <span class="story-card-badge" style="position:static;">\${story.genero}</span>
                  \${isRead ? \`
                    <button type="button" onclick="event.stopPropagation(); app.toggleRead('\${story.slug}');" title="Hacer clic para quitar y desmarcar como leída" style="cursor:pointer; font-size:0.72rem; font-weight:800; background:rgba(16, 185, 129, 0.28); border:1px solid rgba(16, 185, 129, 0.65); color:#34d399; padding:0.22rem 0.65rem; border-radius:9999px; box-shadow:0 0 14px rgba(16, 185, 129, 0.35); backdrop-filter:blur(8px); display:inline-flex; align-items:center; gap:0.3rem;">
                      <span>✅ Leída</span>
                      <span style="font-size:0.65rem; opacity:0.8;">(quitar ✕)</span>
                    </button>
                  \` : ''}
                </div>
              </div>
              <div class="story-card-content">
                <h2 class="story-card-title">\${story.titulo}</h2>
                <p class="story-card-desc">\${story.descripcionCorta}</p>
                <div class="story-card-meta">
                  <span>⏱ \${story.tiempoLecturaMin} min</span>
                  <span>📑 ~\${story.totalNodosEstimados} nodos</span>
                </div>

                \${allUnlocked ? \`
                  <div style="background:linear-gradient(90deg, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.25) 100%); border:1.5px solid rgba(245,158,11,0.5); border-radius:8px; padding:0.45rem 0.75rem; margin-top:0.85rem; display:flex; align-items:center; gap:0.45rem; color:#fbbf24; font-size:0.8rem; font-weight:800; box-shadow:0 0 18px rgba(245,158,11,0.25);">
                    <span>🌟</span>
                    <span>¡Todos los finales descubiertos! (\${countFinales}/\${totalFinales})</span>
                  </div>
                \` : ''}

                <div style="margin-top:0.85rem; padding:0.65rem 0.85rem; background:rgba(255, 255, 255, 0.03); border:1px solid var(--border-subtle); border-radius:8px;">
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.45rem; font-size:0.8rem;">
                    <span style="color:var(--text-secondary); display:inline-flex; align-items:center; gap:0.35rem; font-weight:600;">
                      <span style="color:\${allUnlocked ? '#fbbf24' : 'var(--accent-amber)'};">🏆</span>
                      <span>Finales descubiertos:</span>
                    </span>
                    <span style="font-weight:800; color:\${allUnlocked ? '#fbbf24' : '#34d399'};">
                      \${countFinales} de \${totalFinales} (\${pctFinales}%)
                    </span>
                  </div>
                  <div style="width:100%; height:6px; background:rgba(255,255,255,0.08); border-radius:9999px; overflow:hidden;">
                    <div style="width:\${pctFinales}%; height:100%; background:\${allUnlocked ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)' : 'linear-gradient(90deg, #f59e0b 0%, #10b981 100%)'}; border-radius:9999px; transition:width 0.4s ease;"></div>
                  </div>
                </div>

                \${actionBtn}

                <div style="display:flex; justify-content:flex-end; margin-top:0.75rem;">
                  <button type="button" onclick="event.stopPropagation(); app.toggleRead('\${story.slug}');" title="\${isRead ? 'Hacer clic para quitar y desmarcar como leída' : 'Marcar historia como leída'}" style="display:inline-flex; align-items:center; gap:0.35rem; padding:0.35rem 0.75rem; border-radius:9999px; font-size:0.76rem; font-weight:600; border:\${isRead ? '1px solid rgba(16, 185, 129, 0.55)' : '1px solid rgba(255, 255, 255, 0.18)'}; background:\${isRead ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.05)'}; color:\${isRead ? '#34d399' : 'var(--text-secondary)'}; cursor:pointer; transition:all 0.2s ease; box-shadow:\${isRead ? '0 0 12px rgba(16, 185, 129, 0.25)' : 'none'};">
                    <span>\${isRead ? '✅' : '⚪'}</span>
                    <span>\${isRead ? 'Leída (clic para quitar)' : 'Marcar leída'}</span>
                  </button>
                </div>
              </div>
            </article>
          \`;
        }).join('');

        root.innerHTML = \`
          <div class="home-container">
            <div class="breadcrumb-nav">
              <a href="index.html" class="breadcrumb-link">
                <span>←</span> <span>Volver a Tus Desvaríos</span>
              </a>
            </div>

            <section class="hero-section">
              <div class="hero-badge">✨ Ficción Interactiva Ramificada</div>
              <h1 class="hero-title">Crea tus Desvaríos</h1>
              <p class="hero-description">
                Sumérgete en novelas interactivas donde tú eres el protagonista. Elige sabiamente:
                cada decisión forja tu destino entre múltiples caminos y finales.
              </p>
            </section>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem; padding-bottom:0.75rem; border-bottom:1px solid var(--border-subtle);">
              <h2 style="font-size:1.15rem; font-weight:600;">Aventuras Disponibles</h2>
              <span style="font-size:0.82rem; color:var(--text-muted);">\${stories.length} relatos</span>
            </div>
            <div class="stories-grid">
              \${cardsHtml}
            </div>
          </div>
        \`;
      },

      renderReader() {
        const root = document.getElementById('app-root');
        const node = this.currentStory.nodos[this.currentNodeId];
        if (!node) return;

        const isEnding = !!node.esFinal;
        const stepCount = this.historyTrail.length;
        const totalSteps = this.currentStory.totalNodosEstimados || 24;
        const percentage = isEnding ? 100 : Math.min(Math.round((stepCount / totalSteps) * 100), 95);
        const nodeImage = this.resolveImagePath(node.imagen || this.currentStory.portada);

        let optionsHtml = '';
        if (isEnding) {
          const endingType = node.tipo_final || 'neutro';
          let endingLabel = 'Final Neutro — Destino Oculto';
          if (endingType === 'bueno') endingLabel = 'Final Heroico — Victoria';
          if (endingType === 'malo') endingLabel = 'Final Trágico — Perdición';

          optionsHtml = \`
            <div class="ending-banner \${endingType}">
              <div class="ending-pill \${endingType}">
                <span>\${endingLabel}</span>
              </div>
              \${node.mensaje_final ? \`<p class="ending-moral">&ldquo;\${node.mensaje_final}&rdquo;</p>\` : ''}
              <div class="ending-actions">
                <button class="btn-primary" onclick="app.restartStory()">↺ Jugar de nuevo (Explorar otros caminos)</button>
                <button class="btn-secondary" style="padding:0.75rem 1.4rem;" onclick="app.showCatalog()">📚 Volver al catálogo</button>
              </div>
              <div style="margin-top:1.5rem; padding-top:1.25rem; border-top:1px solid rgba(255,255,255,0.12); display:flex; flex-direction:column; align-items:center; gap:0.65rem; text-align:center;">
                <p style="font-size:0.88rem; color:var(--text-secondary); margin:0; max-width:480px; line-height:1.5;">
                  ☕ <strong>¿Has disfrutado de la aventura?</strong> Apoya este proyecto independiente invitando a un café al creador para inspirar nuevas tramas y misterios.
                </p>
                <a href="https://www.paypal.com/donate/?hosted_button_id=V8PZNYKGXBCLG&locale.x=es_ES"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="btn-paypal-donate"
                   title="Invitar a un café con PayPal"
                   style="display:inline-flex; align-items:center; gap:0.5rem; padding:0.6rem 1.3rem; border-radius:9999px; background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color:#0b0f19; font-weight:800; font-size:0.85rem; text-decoration:none; box-shadow:0 4px 16px rgba(245, 158, 11, 0.35); transition:all 0.2s ease;">
                  <span>☕ Invitar a un café</span>
                  <span>➜</span>
                </a>
              </div>
            </div>
          \`;
        } else if (node.opciones && node.opciones.length > 0) {
          const buttons = node.opciones.map((opt, idx) => \`
            <button class="decision-button" onclick="app.selectOption('\${opt.destinoId}')">
              <div class="decision-button-content">
                \${opt.impacto ? \`<span class="decision-badge">\${opt.impacto}</span>\` : ''}
                <span>\${opt.texto}</span>
              </div>
              <span class="decision-arrow">➜</span>
            </button>
          \`).join('');

          optionsHtml = \`
            <div class="decisions-container">
              <div class="decisions-heading">
                <span>🧭 ¿Qué decides hacer?</span>
              </div>
              \${buttons}
            </div>
          \`;
        }

        root.innerHTML = \`
          <div class="reader-wrapper">
            <div class="reader-progress-container">
              <div style="display:flex; align-items:center; gap:0.5rem;">
                \${this.historyTrail.length > 1 && !isEnding ? \`
                  <button class="btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.78rem;" onclick="app.goBack()">
                    <span>←</span> <span>Atrás</span>
                  </button>
                \` : \`
                  <span style="font-size:0.82rem; color:var(--text-muted);">🧭 Lectura</span>
                \`}
              </div>
              <div class="progress-bar-track">
                <div class="progress-bar-fill" style="width: \${percentage}%;"></div>
              </div>
              <div style="display:flex; align-items:center; gap:0.6rem;">
                <span style="font-size:0.8rem; color:var(--text-muted);">
                  \${isEnding ? 'Final alcanzado' : \`Nodo \${stepCount} de ~\${totalSteps}\`}
                </span>
                <button class="btn-secondary" style="padding:0.3rem 0.5rem; font-size:0.78rem;" title="Reiniciar" onclick="app.restartStory()">↺</button>
              </div>
            </div>

            <div class="reader-node-card">
              \${nodeImage ? \`
                <div class="reader-image-container">
                  <img src="\${nodeImage}" alt="\${node.titulo || this.currentStory.titulo}" class="reader-image">
                  <div class="reader-image-gradient"></div>
                </div>
              \` : ''}

              <div class="reader-body">
                \${node.titulo ? \`<h1 class="reader-node-title">\${node.titulo}</h1>\` : ''}
                <div class="reader-text">
                  \${this.formatText(node.texto)}
                </div>
                \${optionsHtml}
              </div>
            </div>
          </div>
        \`;
      },

      fireConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = [];
        const colors = ['#10b981', '#34d399', '#ffffff', '#f59e0b', '#fbbf24'];

        for (let i = 0; i < 70; i++) {
          pieces.push({
            x: canvas.width / 2,
            y: canvas.height * 0.6,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.8) * 14,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            vRot: (Math.random() - 0.5) * 10
          });
        }

        let animationFrame;
        let count = 0;

        function update() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          pieces.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.35;
            p.rotation += p.vRot;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
          });

          count++;
          if (count < 140) {
            animationFrame = requestAnimationFrame(update);
          } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        }

        update();
      }
    };

    document.addEventListener('DOMContentLoaded', () => {
      app.init();
    });
  </script>
  <script src="js/cookie-banner.js"></script>
</body>
</html>
`;

// ==========================================================
// 3. GENERATE DESVARIOS-MENTALES.HTML (QUIZZES & ENIGMAS)
// ==========================================================
const mentalsHtmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Desvaríos Mentales — Tests de Personalidad, Acertijos y Retos Psicológicos | TusDesvarios.com</title>
  <meta name="description" content="Explora nuestra colección interactiva de tests psicológicos, cuestionarios de personalidad oscura, dilemas morales, retos de supervivencia y acertijos de lógica pura en TusDesvarios.com.">
  <meta name="keywords" content="desvarios mentales, tests de personalidad gratis, acertijos de logica pura, test psicologico divertido, test de supervivencia apocalipsis, dilemas morales filosoficos, test de sesgos cognitivos, juegos mentales gratis, tus desvarios">
  
  <!-- Canonical & SEO -->
  <link rel="canonical" href="https://tusdesvarios.com/desvarios-mentales.html">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Desvaríos Mentales — Tests y Retos Psicológicos | Tus Desvaríos">
  <meta property="og:description" content="Descubre tu arquetipo oscuro, mide tu nivel de desvarío o resuelve acertijos de lógica pura con pistas en tiempo real. 100% gratis y sin registro.">
  <meta property="og:url" content="https://tusdesvarios.com/desvarios-mentales.html">
  <meta property="og:image" content="images/categories/desvarios-mentales.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Desvaríos Mentales — Tests y Retos Psicológicos">
  <meta name="twitter:description" content="Descubre tu arquetipo, mide tu cordura y resuelve acertijos deductivos. ¡Gratis y en tu navegador!">
  <meta name="twitter:image" content="images/categories/desvarios-mentales.jpg">

  <!-- Schema.org ItemList, BreadcrumbList & FAQPage for Google Rich Snippets -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Colección de Tests y Desvaríos Mentales",
    "description": "Catálogo de cuestionarios psicológicos, enigmas de lógica, retos de supervivencia y dilemas morales.",
    "numberOfItems": 8,
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "El Arquetipo Oscuro", "url": "https://tusdesvarios.com/test-arquetipo-oscuro.html" },
      { "@type": "ListItem", "position": 2, "name": "Supervivencia al Apocalipsis Zombi", "url": "https://tusdesvarios.com/test-supervivencia-apocalipsis.html" },
      { "@type": "ListItem", "position": 3, "name": "Trampas Mentales & Sesgos Cognitivos", "url": "https://tusdesvarios.com/test-trampas-mentales.html" },
      { "@type": "ListItem", "position": 4, "name": "¿Qué Criatura Mitológica Eres?", "url": "https://tusdesvarios.com/test-monstruo-interior.html" },
      { "@type": "ListItem", "position": 5, "name": "Dilemas Morales de Filosofía Oscura", "url": "https://tusdesvarios.com/test-dilemas-morales.html" },
      { "@type": "ListItem", "position": 6, "name": "Curiosidades Insólitas: Mito, Realidad o Desvarío", "url": "https://tusdesvarios.com/test-curiosidades-insolitas.html" },
      { "@type": "ListItem", "position": 7, "name": "El Termómetro del Desvarío", "url": "https://tusdesvarios.com/test-termometro-desvario.html" },
      { "@type": "ListItem", "position": 8, "name": "La Cámara de los Sabios", "url": "https://tusdesvarios.com/test-enigmas-logica.html" }
    ]
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Qué son los Desvaríos Mentales de TusDesvarios.com?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Son una colección de tests interactivos, acertijos de lógica con pistas y soluciones, dilemas éticos filosóficos, simuladores de supervivencia y cuestionarios de personalidad diseñados para entretener y ejercitar la mente."
        }
      },
      {
        "@type": "Question",
        "name": "¿Es necesario registrarse o pagar para hacer los tests?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Todos los tests y desafíos de Desvaríos Mentales son 100% gratuitos, completamente anónimos y funcionan directamente en el navegador sin descargas ni registros."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cómo se calculan los resultados y arquetipos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Cada cuestionario utiliza algoritmos de ponderación que contrastan tus elecciones frente a arquetipos psicológicos, matrices de supervivencia, sesgos cognitivos o corrientes filosóficas, ofreciendo un informe completo con virtudes, desvaríos y afinidades."
        }
      }
    ]
  }
  </script>

    <!-- Favicon & Touch Icons -->
  <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="images/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-main: #0b0f19;
      --bg-surface: rgba(18, 24, 38, 0.78);
      --bg-surface-elevated: rgba(26, 34, 52, 0.88);
      --bg-surface-hover: rgba(34, 45, 68, 0.95);
      --bg-glass: rgba(12, 17, 28, 0.85);

      --border-subtle: rgba(255, 255, 255, 0.12);
      --border-medium: rgba(255, 255, 255, 0.22);
      --border-focus: rgba(6, 182, 212, 0.5);

      --text-primary: #f8fafc;
      --text-secondary: #cbd5e1;
      --text-muted: #94a3b8;

      --accent-cyan: #06b6d4;
      --accent-purple: #a855f7;
      --accent-amber: #f59e0b;
      --accent-emerald: #10b981;
      --accent-pink: #ec4899;

      --font-display: 'Cinzel', serif;
      --font-reading: 'Crimson Pro', Georgia, serif;
      --font-ui: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 22px;
      --radius-full: 9999px;

      --shadow-subtle: 0 4px 24px rgba(0, 0, 0, 0.4);
      --shadow-elevated: 0 16px 40px rgba(0, 0, 0, 0.55);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-main);
      color: var(--text-primary);
      font-family: var(--font-ui);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background: 
        radial-gradient(ellipse 95% 55% at 50% -12%, rgba(6, 182, 212, 0.28) 0%, transparent 65%),
        radial-gradient(circle 500px at 10% 30%, rgba(168, 85, 247, 0.22) 0%, transparent 60%),
        radial-gradient(circle 550px at 90% 40%, rgba(245, 158, 11, 0.20) 0%, transparent 60%),
        linear-gradient(180deg, #0e1322 0%, #0a0e1a 50%, #060911 100%);
      pointer-events: none;
      z-index: -1;
    }

    a, button {
      cursor: pointer;
      color: inherit;
      text-decoration: none;
      font-family: inherit;
      border: none;
      background: none;
    }

    .app-container {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    ${getHeaderCss()}

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
    }

    .btn-secondary:hover {
      background: var(--bg-surface-hover);
      color: var(--text-primary);
      border-color: var(--border-medium);
    }

    .main-content {
      flex: 1;
      width: 100%;
      max-width: 1080px;
      margin: 0 auto;
      padding: 1.5rem 1.25rem 4rem;
    }

    .breadcrumb-nav {
      margin-bottom: 1.5rem;
    }

    .breadcrumb-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      color: var(--text-muted);
      transition: color 0.2s ease;
    }

    .breadcrumb-link:hover {
      color: var(--text-primary);
    }

    .hero-section {
      text-align: center;
      padding: 2rem 1rem 2.75rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-full);
      background: rgba(6, 182, 212, 0.12);
      border: 1px solid rgba(6, 182, 212, 0.35);
      color: #38bdf8;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 1.25rem;
    }

    .hero-title {
      font-family: var(--font-display);
      font-size: clamp(2.2rem, 5.5vw, 3.4rem);
      font-weight: 900;
      letter-spacing: 0.04em;
      line-height: 1.15;
      margin-bottom: 0.85rem;
    }

    .hero-description {
      font-size: 1.05rem;
      line-height: 1.6;
      color: var(--text-secondary);
      max-width: 650px;
      margin: 0 auto;
    }

    .btn-random-hero {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.75rem 2rem;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
      color: #ffffff;
      font-size: 1rem;
      font-weight: 800;
      border: none;
      cursor: pointer;
      box-shadow: 0 0 25px rgba(6, 182, 212, 0.45), 0 4px 15px rgba(0, 0, 0, 0.3);
      transition: all 0.25s ease;
      text-decoration: none;
    }

    .btn-random-hero:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 0 35px rgba(6, 182, 212, 0.65), 0 8px 25px rgba(0, 0, 0, 0.4);
      color: #ffffff;
    }

    /* Grid of Tests */
    .tests-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
      gap: 1.75rem;
      margin-top: 1.25rem;
    }

    .test-card {
      position: relative;
      border-radius: var(--radius-lg);
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-subtle);
      transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
      overflow: hidden;
      height: 100%;
    }

    .test-card:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-elevated), 0 0 35px var(--card-glow, rgba(6, 182, 212, 0.25));
      border-color: var(--card-accent, var(--accent-cyan));
    }

    .test-card-thumb-wrap {
      position: relative;
      width: 100%;
      height: 175px;
      overflow: hidden;
      background: #090d16;
    }

    .test-card-thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.45s ease;
    }

    .test-card:hover .test-card-thumb {
      transform: scale(1.06);
    }

    .test-card-thumb-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(16, 22, 36, 0.98) 0%, rgba(16, 22, 36, 0.35) 60%, rgba(0, 0, 0, 0.15) 100%);
    }

    .test-card-header-badge {
      position: absolute;
      top: 0.85rem;
      left: 0.85rem;
      right: 0.85rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 2;
    }

    .test-card-icon-box {
      width: 42px;
      height: 42px;
      border-radius: var(--radius-md);
      background: rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
    }

    .test-card-type-tag {
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 0.25rem 0.7rem;
      border-radius: var(--radius-full);
      background: rgba(6, 182, 212, 0.15);
      border: 1px solid rgba(6, 182, 212, 0.35);
      color: #38bdf8;
      box-shadow: 0 0 12px rgba(6, 182, 212, 0.2);
    }

    .test-card-body {
      padding: 1.25rem 1.4rem 1.5rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .test-card-title {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1.35;
      color: #ffffff;
      margin-bottom: 0.4rem;
    }

    .test-card-desc {
      font-size: 0.92rem;
      line-height: 1.55;
      color: var(--text-secondary);
      margin-bottom: 1rem;
      flex: 1;
    }

    .test-card-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-subtle);
      font-size: 0.82rem;
      color: var(--text-muted);
      margin-top: auto;
    }

    .test-card-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      margin-top: 0.85rem;
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--card-accent, #38bdf8);
      transition: gap 0.2s ease;
    }

    .test-card:hover .test-card-cta {
      gap: 0.65rem;
    }

    /* Runner View */
    .runner-wrapper {
      max-width: 760px;
      margin: 0 auto;
    }

    .runner-header-card {
      padding: 1rem 1.25rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      margin-bottom: 1.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .runner-progress-track {
      flex: 1;
      height: 8px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: var(--radius-full);
      overflow: hidden;
      margin: 0 1.25rem;
    }

    .runner-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #06b6d4, #a855f7);
      border-radius: var(--radius-full);
      transition: width 0.35s ease;
    }

    .question-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 2.25rem 2rem;
      box-shadow: var(--shadow-elevated);
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }

    .question-step-badge {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--accent-cyan);
    }

    .question-text {
      font-family: var(--font-display);
      font-size: clamp(1.2rem, 3.2vw, 1.55rem);
      font-weight: 700;
      line-height: 1.4;
      color: #ffffff;
    }

    .options-grid {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .option-btn {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.1rem 1.35rem;
      border-radius: var(--radius-md);
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-medium);
      color: var(--text-primary);
      text-align: left;
      font-size: 0.98rem;
      line-height: 1.45;
      transition: all 0.2s ease;
    }

    .option-btn:hover {
      background: var(--bg-surface-hover);
      border-color: var(--accent-cyan);
      transform: translateX(4px);
    }

    .option-indicator {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .option-btn:hover .option-indicator {
      background: var(--accent-cyan);
      color: #000;
    }

    /* Clues for enigmas */
    .clue-box {
      margin-top: 1rem;
      padding: 1.25rem 1.4rem;
      background: rgba(245, 158, 11, 0.08);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: var(--radius-md);
      font-size: 0.92rem;
      line-height: 1.55;
      color: #fef08a;
    }

    .clue-toggle-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--accent-amber);
      padding: 0.4rem 0.8rem;
      border-radius: var(--radius-sm);
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.25);
    }

    .clue-toggle-btn:hover {
      background: rgba(245, 158, 11, 0.2);
    }

    .feedback-box {
      margin-top: 1.25rem;
      padding: 1.5rem;
      border-radius: var(--radius-md);
      animation: fadeIn 0.3s ease;
    }

    .feedback-box.correct {
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #e2e8f0;
    }

    .feedback-box.incorrect {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #e2e8f0;
    }

    /* Markdown Typography */
    strong {
      color: #ffffff;
      font-weight: 700;
    }

    em {
      color: #fde68a;
      font-style: italic;
    }

    .question-text ul {
      margin: 0.85rem 0;
      padding-left: 1.35rem;
      list-style-type: disc;
    }

    .question-text li {
      margin-bottom: 0.45rem;
      color: #cbd5e1;
    }

    .question-text blockquote {
      border-left: 3px solid var(--accent-cyan);
      padding: 0.75rem 1.25rem;
      margin: 1.25rem 0;
      background: rgba(6, 182, 212, 0.08);
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
      font-style: italic;
      color: #e0f2fe;
    }

    /* Result Card */
    .result-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 2.75rem 2.25rem;
      text-align: center;
      box-shadow: var(--shadow-elevated);
    }

    .result-icon-large {
      font-size: 4rem;
      margin-bottom: 0.75rem;
      display: inline-block;
    }

    .result-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.95rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 1.25rem;
    }

    .result-title {
      font-family: var(--font-display);
      font-size: clamp(1.8rem, 4vw, 2.5rem);
      font-weight: 900;
      color: #ffffff;
      margin-bottom: 0.6rem;
    }

    .result-subtitle {
      font-size: 1.05rem;
      color: var(--accent-cyan);
      font-weight: 600;
      margin-bottom: 1.75rem;
    }

    .result-desc {
      font-family: var(--font-reading);
      font-size: 1.2rem;
      line-height: 1.75;
      color: #e2e8f0;
      max-width: 640px;
      margin: 0 auto 2rem;
      text-align: left;
      padding: 1.5rem;
      background: var(--bg-surface-elevated);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
    }

    .result-traits-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      max-width: 640px;
      margin: 0 auto 2rem;
      text-align: left;
    }

    @media (min-width: 600px) {
      .result-traits-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .result-trait-box {
      padding: 1.1rem;
      background: var(--bg-surface-elevated);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
    }

    .result-trait-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-muted);
      margin-bottom: 0.35rem;
    }

    .result-trait-val {
      font-size: 0.92rem;
      color: var(--text-primary);
      line-height: 1.45;
    }

    .result-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
    }

    .cat-filters-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      justify-content: center;
      margin-bottom: 2rem;
    }

    .cat-filter-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.5rem 1.1rem;
      border-radius: var(--radius-full);
      font-size: 0.86rem;
      font-weight: 500;
      border: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .cat-filter-btn:hover {
      border-color: var(--accent-cyan);
      color: var(--text-primary);
      transform: translateY(-2px);
    }

    .cat-filter-btn.active {
      font-weight: 700;
      border-color: var(--accent-cyan);
      background: rgba(6, 182, 212, 0.18);
      color: #38bdf8;
      box-shadow: 0 0 15px rgba(6, 182, 212, 0.25);
    }

    .cat-filter-count {
      font-size: 0.74rem;
      opacity: 0.8;
      background: rgba(255, 255, 255, 0.1);
      padding: 0.1rem 0.45rem;
      border-radius: 10px;
    }

    .btn-result-main {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.85rem 1.6rem;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      color: #fff;
      font-weight: 700;
      font-size: 0.95rem;
      transition: all 0.25s ease;
      box-shadow: 0 4px 20px rgba(6, 182, 212, 0.35);
    }

    .btn-result-main:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(6, 182, 212, 0.5);
    }

    .site-footer {
      margin-top: auto;
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      padding: 1.5rem 1.25rem;
      text-align: center;
      font-size: 0.82rem;
      color: var(--text-muted);
    }
    .footer-legal-links {
      margin-top: 0.75rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.65rem 0.85rem;
      font-size: 0.82rem;
    }
    .footer-legal-links a {
      color: var(--text-secondary, #cbd5e1);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .footer-legal-links a:hover {
      color: #c084fc;
      text-decoration: underline;
    }
    .footer-separator {
      color: var(--border-medium, rgba(255, 255, 255, 0.22));
      font-size: 0.75rem;
      user-select: none;
    }


    #confetti-canvas {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 999;
      width: 100%;
      height: 100%;
    }
  </style>
  <!-- Supabase SDK v2 & Desvarios Client -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/supabase-client.js"></script>
</head>
<body>
  <canvas id="confetti-canvas"></canvas>

  <div class="app-container">
    ${getHeaderHtml('mental', { extraButtons: '<button id="header-tests-btn" class="btn-secondary" style="display: none;" onclick="mentalApp.showCatalog()"><span>🧪</span><span>Todos los Tests</span></button>' })}

    <!-- Main Content Area -->
    <main class="main-content" id="app-root">
      <!-- Injected via mentalApp -->
    </main>

    <!-- Footer -->
    <!-- Pie de Página Unificado -->
  <footer class="site-footer">
    <p>© 2026 TusDesvarios.com — Portal de Entretenimiento, Ficción y Ocio Interactivo</p>
    <div class="footer-legal-links">
      <a href="aviso-legal.html">Aviso Legal</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-privacidad.html">Política de Privacidad</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-cookies.html">Política de Cookies</a>
    </div>
  </footer>
  </div>

  <script>
    const TESTS_DB = {
      "arquetipo-oscuro": ${JSON.stringify(arquetipoRaw)},
      "termometro-desvario": ${JSON.stringify(termometroRaw)},
      "enigmas-logica": ${JSON.stringify(enigmasRaw)},
      "supervivencia-apocalipsis": ${JSON.stringify(supervivenciaRaw)},
      "trampas-mentales": ${JSON.stringify(trampasRaw)},
      "monstruo-interior": ${JSON.stringify(monstruoRaw)},
      "dilemas-morales": ${JSON.stringify(dilemasRaw)},
      "curiosidades-insolitas": ${JSON.stringify(curiosidadesRaw)}
    };

    const mentalApp = {
      currentTest: null,
      currentStep: 0,
      userAnswers: [],
      revealedClues: {},
      enigmaAnswers: {},
      selectedCategory: 'all',

      init() {
        this.showCatalog();
      },

      filterCategory(catId) {
        this.selectedCategory = catId;
        this.renderCatalog();
      },

      showCatalog() {
        this.currentTest = null;
        this.currentStep = 0;
        this.userAnswers = [];
        this.revealedClues = {};
        this.enigmaAnswers = {};
        document.getElementById('header-tests-btn').style.display = 'none';
        this.renderCatalog();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      startTest(slug) {
        const test = TESTS_DB[slug];
        if (!test) return;

        this.currentTest = test;
        this.currentStep = 0;
        this.userAnswers = [];
        this.revealedClues = {};
        this.enigmaAnswers = {};
        document.getElementById('header-tests-btn').style.display = 'inline-flex';

        if (test.tipo === 'enigma') {
          this.renderEnigmaStep();
        } else {
          this.renderQuestionStep();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      // --- Personality & Score Flow ---
      answerQuestion(optionIndex) {
        if (!this.currentTest) return;
        const q = this.currentTest.preguntas[this.currentStep];
        const opt = q.opciones[optionIndex];
        this.userAnswers.push(opt);

        this.currentStep++;
        if (this.currentStep < this.currentTest.preguntas.length) {
          this.renderQuestionStep();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          this.renderResult();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },

      // --- Enigmas Flow ---
      toggleClue(stepIdx) {
        const currentCount = this.revealedClues[stepIdx] || 0;
        this.revealedClues[stepIdx] = currentCount + 1;
        this.renderEnigmaStep();
      },

      selectEnigmaOption(stepIdx, optionId) {
        if (this.enigmaAnswers[stepIdx]) return; // already answered
        const enigma = this.currentTest.enigmas[stepIdx];
        const selectedOpt = enigma.opciones.find(o => o.id === optionId);
        
        this.enigmaAnswers[stepIdx] = {
          selectedId: optionId,
          isCorrect: !!(selectedOpt && selectedOpt.correcta)
        };

        if (selectedOpt && selectedOpt.correcta) {
          this.fireConfetti();
        }

        this.renderEnigmaStep();
      },

      nextEnigma() {
        this.currentStep++;
        if (this.currentStep < this.currentTest.enigmas.length) {
          this.renderEnigmaStep();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          this.renderEnigmaFinalSummary();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },

      formatMarkdown(text) {
        if (!text) return '';
        const blocks = text.split(/\\n\\s*\\n/);
        return blocks.map(block => {
          const trimmed = block.trim();
          let formatted = trimmed
            .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
            .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
            .replace(/\\n/g, '<br>');

          if (trimmed.startsWith('>')) {
            const quote = formatted.replace(/^>\\s*/gm, '');
            return '<blockquote>' + quote + '</blockquote>';
          }
          if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
            const items = trimmed.split(/\\n/).map(line => {
              const clean = line.replace(/^[-•*]\\s*/, '')
                .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
                .replace(/\\*(.*?)\\*/g, '<em>$1</em>');
              return '<li style="margin-bottom:0.4rem;">' + clean + '</li>';
            }).join('');
            return '<ul style="margin:0.75rem 0; padding-left:1.4rem; list-style-type:disc;">' + items + '</ul>';
          }
          return '<p style="margin-bottom:0.85rem;">' + formatted + '</p>';
        }).join('');
      },

      startRandomTest() {
        const slugs = Object.keys(TESTS_DB);
        const randomSlug = slugs[Math.floor(Math.random() * slugs.length)];
        const btn = document.getElementById('btn-random-test-hero');
        if (btn) {
          btn.innerHTML = '<span>🎲</span> <span>¡Erigiendo Desafío...!</span>';
        }
        setTimeout(() => {
          location.href = 'test-' + randomSlug + '.html';
        }, 350);
      },

      renderCatalog() {
        const root = document.getElementById('app-root');
        const testsList = Object.values(TESTS_DB);

        const categories = [
          { id: 'all', label: '🌟 Todos' },
          { id: 'personalidad', label: '🧙 Personalidad & Arquetipos' },
          { id: 'logica', label: '🧩 Lógica & Paradojas' },
          { id: 'humor', label: '🤪 Humor & Supervivencia' },
          { id: 'curiosidades', label: '🌍 Curiosidades & Trivia' }
        ];

        const filterButtonsHtml = categories.map(cat => {
          const count = cat.id === 'all' 
            ? testsList.length 
            : testsList.filter(t => t.categoria === cat.id).length;
          const isActive = (this.selectedCategory || 'all') === cat.id;
          return \`
            <button class="cat-filter-btn \${isActive ? 'active' : ''}" onclick="mentalApp.filterCategory('\${cat.id}')">
              <span>\${cat.label}</span>
              <span class="cat-filter-count">\${count}</span>
            </button>
          \`;
        }).join('');

        const filteredList = testsList.filter(t => {
          if (!this.selectedCategory || this.selectedCategory === 'all') return true;
          return t.categoria === this.selectedCategory;
        });

        const cardsHtml = filteredList.map(t => {
          let badgeText = 'Test de Personalidad';
          if (t.tipo === 'puntuacion') badgeText = 'Diagnóstico Cómico';
          if (t.slug === 'supervivencia-apocalipsis') badgeText = 'Supervivencia';
          if (t.slug === 'dilemas-morales') badgeText = 'Dilemas Éticos';
          if (t.slug === 'trampas-mentales') badgeText = 'Sesgos & Paradojas';
          if (t.slug === 'curiosidades-insolitas') badgeText = 'Mito o Realidad';
          if (t.slug === 'enigmas-logica') badgeText = 'Acertijos de Lógica';

          let stepCount = 'preguntas' in t ? \`\${t.preguntas.length} Preguntas\` : '';
          if (t.slug === 'enigmas-logica') stepCount = '5 Acertijos';
          if (t.slug === 'trampas-mentales') stepCount = '6 Paradojas';
          if (t.slug === 'curiosidades-insolitas') stepCount = '8 Curiosidades';
          if (t.slug === 'dilemas-morales') stepCount = '6 Dilemas';

          return \`
            <article class="test-card" style="--card-accent:\${t.color}; cursor:pointer;" onclick="location.href='test-\${t.slug}.html'">
              <div class="test-card-thumb-wrap">
                <img src="images/tests/\${t.slug}.jpg" alt="\${t.titulo}" class="test-card-thumb" loading="lazy">
                <div class="test-card-thumb-overlay"></div>
                <div class="test-card-header-badge">
                  <div class="test-card-icon-box">\${t.icono}</div>
                  <span class="test-card-type-tag">\${badgeText}</span>
                </div>
              </div>
              <div class="test-card-body">
                <h2 class="test-card-title">\${t.titulo}</h2>
                <p class="test-card-desc">\${t.descripcionCorta}</p>
                <div class="test-card-meta">
                  <span>⏱️ \${t.tiempoMin} min</span>
                  <span style="font-weight:600; color:var(--text-secondary);">\${stepCount}</span>
                </div>
                <div class="test-card-cta">
                  <span>Comenzar Desafío</span>
                  <span>➜</span>
                </div>
              </div>
            </article>
          \`;
        }).join('');

        root.innerHTML = \`
          <div class="catalog-container">
            <div class="breadcrumb-nav">
              <a href="index.html" class="breadcrumb-link">
                <span>←</span> <span>Volver a Tus Desvaríos</span>
              </a>
            </div>

            <section class="hero-section">
              <div class="hero-badge">🧪 Laboratorio Mental & Tests Online</div>
              <h1 class="hero-title">Desvaríos Mentales</h1>
              <p class="hero-description">
                Cuestionarios de personalidad, diagnósticos delirantes, desafíos de supervivencia, dilemas morales y acertijos de lógica pura.
                Descubre qué arquetipo habita en ti o desafía a tus neuronas de forma gratuita e interactiva.
              </p>

              <!-- Random Test Roulette Button -->
              <div style="margin-top:1.5rem;">
                <button id="btn-random-test-hero" onclick="mentalApp.startRandomTest()" class="btn-random-hero">
                  <span>🎲</span> <span>¿Indeciso? Prueba un Test Aleatorio</span>
                </button>
              </div>

              <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:0.85rem; margin-top:1.5rem;">
                <span class="cat-badge" style="--cat-accent:#10b981; --cat-glow:rgba(16,185,129,0.2); font-size:0.8rem; padding:0.35rem 0.8rem; border-radius:9999px; border:1px solid rgba(16,185,129,0.3); background:rgba(16,185,129,0.1); color:#34d399;">
                  🛡️ 100% Gratis y Anónimo
                </span>
                <span class="cat-badge" style="--cat-accent:#06b6d4; --cat-glow:rgba(6,182,212,0.2); font-size:0.8rem; padding:0.35rem 0.8rem; border-radius:9999px; border:1px solid rgba(6,182,212,0.3); background:rgba(6,182,212,0.1); color:#38bdf8;">
                  ⚡ Resultados Instantáneos
                </span>
                <span class="cat-badge" style="--cat-accent:#8b5cf6; --cat-glow:rgba(139,92,246,0.2); font-size:0.8rem; padding:0.35rem 0.8rem; border-radius:9999px; border:1px solid rgba(139,92,246,0.3); background:rgba(139,92,246,0.1); color:#c084fc;">
                  🔗 Fácil de Compartir
                </span>
              </div>
            </section>

            <div class="cat-filters-wrap">
              \${filterButtonsHtml}
            </div>

            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem; padding-bottom:0.75rem; border-bottom:1px solid var(--border-subtle);">
              <h2 style="font-size:1.15rem; font-weight:600;">
                \${this.selectedCategory === 'all' ? 'Pruebas y Tests Disponibles' : categories.find(c => c.id === this.selectedCategory)?.label}
              </h2>
              <span style="font-size:0.82rem; color:var(--text-muted);">\${filteredList.length} \${filteredList.length === 1 ? 'experiencia' : 'experiencias'}</span>
            </div>

            <div class="tests-grid">
              \${cardsHtml}
            </div>

            <!-- SEO Educational Guide -->
            <section style="margin-top:4rem; padding:2.5rem 1.75rem; background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:var(--radius-lg);">
              <div style="text-align:center; max-width:680px; margin:0 auto 2.5rem;">
                <h2 style="font-size:1.45rem; font-weight:700; margin-bottom:0.75rem; color:#fff; font-family:var(--font-display);">
                  Explora las Categorías de Desafíos Mentales
                </h2>
                <p style="font-size:0.92rem; color:var(--text-secondary); line-height:1.6;">
                  Nuestros tests han sido estructurados en cuatro áreas del pensamiento para que encuentres la experiencia exacta que buscas hoy:
                </p>
              </div>

              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.5rem;">
                <div style="padding:1.25rem; background:rgba(255, 255, 255, 0.03); border-radius:var(--radius-md); border:1px solid rgba(139, 92, 246, 0.25);">
                  <div style="font-size:1.5rem; margin-bottom:0.5rem;">🧙</div>
                  <h3 style="font-size:1.05rem; font-weight:700; color:#c084fc; margin-bottom:0.4rem; font-family:var(--font-display);">Personalidad & Arquetipos</h3>
                  <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.5;">Viajes al subconsciente para descubrir tus rasgos ocultos, sombras psicológicas y criaturas míticas que definen tu carácter ante la adversidad.</p>
                </div>

                <div style="padding:1.25rem; background:rgba(255, 255, 255, 0.03); border-radius:var(--radius-md); border:1px solid rgba(6, 182, 212, 0.25);">
                  <div style="font-size:1.5rem; margin-bottom:0.5rem;">🧩</div>
                  <h3 style="font-size:1.05rem; font-weight:700; color:#38bdf8; margin-bottom:0.4rem; font-family:var(--font-display);">Lógica & Paradojas</h3>
                  <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.5;">Enigmas deductivos progresivos con pistas graduales y trampas de sesgos cognitivos para desafiar tu intuición y razonamiento analítico.</p>
                </div>

                <div style="padding:1.25rem; background:rgba(255, 255, 255, 0.03); border-radius:var(--radius-md); border:1px solid rgba(239, 68, 68, 0.25);">
                  <div style="font-size:1.5rem; margin-bottom:0.5rem;">🤪</div>
                  <h3 style="font-size:1.05rem; font-weight:700; color:#f87171; margin-bottom:0.4rem; font-family:var(--font-display);">Humor & Supervivencia</h3>
                  <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.5;">Cuestionarios hilarantes para medir tu temperatura de cordura o calcular tus probabilidades reales de sobrevivir a un colapso zombi.</p>
                </div>

                <div style="padding:1.25rem; background:rgba(255, 255, 255, 0.03); border-radius:var(--radius-md); border:1px solid rgba(245, 158, 11, 0.25);">
                  <div style="font-size:1.5rem; margin-bottom:0.5rem;">🌍</div>
                  <h3 style="font-size:1.05rem; font-weight:700; color:#fbbf24; margin-bottom:0.4rem; font-family:var(--font-display);">Curiosidades & Trivia</h3>
                  <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.5;">Hechos asombrosos del mundo real donde deberás discernir entre la verdad científica, mitos urbanos arraigados y auténticos desvaríos.</p>
                </div>
              </div>
            </section>

            <!-- SEO FAQ Accordion -->
            <section style="margin-top:3.5rem; padding:2.5rem 1.75rem; background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-lg);">
              <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1.5rem;">
                <span style="font-size:1.5rem;">❓</span>
                <h2 style="font-size:1.35rem; font-weight:700; color:#fff; font-family:var(--font-display);">Preguntas Frecuentes sobre Desvaríos Mentales</h2>
              </div>

              <div style="display:flex; flex-direction:column; gap:1.25rem;">
                <details style="background:rgba(255, 255, 255, 0.03); padding:1rem 1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle); cursor:pointer;">
                  <summary style="font-weight:600; color:#f1f5f9; font-size:0.98rem;">¿Qué tipo de tests encontraré en Desvaríos Mentales?</summary>
                  <p style="margin-top:0.75rem; font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">Encontrarás una cuidada selección de 8 cuestionarios únicos: desde diagnósticos psicológicos de arquetipos oscuros y monstruos interiores, pasando por dilemas morales clásicos, hasta acertijos de lógica con pistas interactivas y simuladores tácticos de supervivencia.</p>
                </details>

                <details style="background:rgba(255, 255, 255, 0.03); padding:1rem 1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle); cursor:pointer;">
                  <summary style="font-weight:600; color:#f1f5f9; font-size:0.98rem;">¿Los tests son totalmente gratuitos y anónimos?</summary>
                  <p style="margin-top:0.75rem; font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">Sí, 100%. No recopilamos ningún dato personal, no exigimos registro ni correos electrónicos, y no hay micropagos. Todo el contenido está abierto y disponible para disfrutarlo de inmediato.</p>
                </details>

                <details style="background:rgba(255, 255, 255, 0.03); padding:1rem 1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle); cursor:pointer;">
                  <summary style="font-weight:600; color:#f1f5f9; font-size:0.98rem;">¿Cómo se obtienen las conclusiones de cada test?</summary>
                  <p style="margin-top:0.75rem; font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">Cada respuesta asigna puntos hacia rasgos psicológicos específicos o evalúa tu razonamiento deductivo. Al finalizar, el motor genera un desglose de porcentaje de afinidad, tu arquetipo dominante, virtudes y recomendaciones con un toque mordaz y entretenido.</p>
                </details>

                <details style="background:rgba(255, 255, 255, 0.03); padding:1rem 1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle); cursor:pointer;">
                  <summary style="font-weight:600; color:#f1f5f9; font-size:0.98rem;">¿Puedo realizarlos desde mi teléfono móvil?</summary>
                  <p style="margin-top:0.75rem; font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">Absolutamente. Toda la plataforma está optimizada para una navegación ultrarrápida y táctil en teléfonos móviles, tabletas y ordenadores de escritorio sin consumo excesivo de datos ni batería.</p>
                </details>
              </div>
            </section>
          </div>
        \`;
      },

      renderQuestionStep() {
        const root = document.getElementById('app-root');
        const test = this.currentTest;
        const total = test.preguntas.length;
        const q = test.preguntas[this.currentStep];
        const pct = Math.round(((this.currentStep + 1) / total) * 100);

        const optionsHtml = q.opciones.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx);
          return \`
            <button class="option-btn" onclick="mentalApp.answerQuestion(\${idx})">
              <span class="option-indicator">\${letter}</span>
              <span>\${opt.texto}</span>
            </button>
          \`;
        }).join('');

        root.innerHTML = \`
          <div class="runner-wrapper">
            <div class="runner-header-card">
              <span style="font-size:0.85rem; font-weight:600; color:var(--text-secondary);">\${test.icono} \${test.titulo}</span>
              <div class="runner-progress-track">
                <div class="runner-progress-fill" style="width:\${pct}%;"></div>
              </div>
              <span style="font-size:0.8rem; color:var(--text-muted);">\${this.currentStep + 1} / \${total}</span>
            </div>

            <div class="question-card">
              <div class="question-step-badge">Pregunta \${this.currentStep + 1} de \${total}</div>
              <h2 class="question-text">\${q.texto}</h2>
              <div class="options-grid">
                \${optionsHtml}
              </div>
            </div>
          </div>
        \`;
      },

      renderEnigmaStep() {
        const root = document.getElementById('app-root');
        const test = this.currentTest;
        const total = test.enigmas.length;
        const enigma = test.enigmas[this.currentStep];
        const pct = Math.round(((this.currentStep + 1) / total) * 100);
        const answered = this.enigmaAnswers[this.currentStep];
        const clueCount = this.revealedClues[this.currentStep] || 0;

        let cluesHtml = '';
        if (enigma.pistas && enigma.pistas.length > 0) {
          const visibleClues = enigma.pistas.slice(0, clueCount);
          cluesHtml = \`
            <div style="margin-top:1.25rem;">
              \${clueCount < enigma.pistas.length && !answered ? \`
                <button class="clue-toggle-btn" onclick="mentalApp.toggleClue(\${this.currentStep})">
                  <span>💡</span> <span>Revelar Pista (\${clueCount + 1}/\${enigma.pistas.length})</span>
                </button>
              \` : ''}
              \${visibleClues.map(c => \`<div class="clue-box">🔍 \${c}</div>\`).join('')}
            </div>
          \`;
        }

        let feedbackHtml = '';
        if (answered) {
          feedbackHtml = \`
            <div class="feedback-box \${answered.isCorrect ? 'correct' : 'incorrect'}">
              <div style="font-weight:700; font-size:1.1rem; margin-bottom:0.5rem; color:\${answered.isCorrect ? '#34d399' : '#f87171'};">
                \${answered.isCorrect ? '✨ ¡Respuesta Correcta!' : '❌ Respuesta Incorrecta'}
              </div>
              <p style="font-size:0.95rem; line-height:1.6; white-space:pre-line;">\${enigma.explicacion}</p>
              <button class="btn-result-main" style="margin-top:1.25rem;" onclick="mentalApp.nextEnigma()">
                <span>\${this.currentStep + 1 < total ? 'Siguiente Enigma ➜' : 'Ver Puntuación Final 🏆'}</span>
              </button>
            </div>
          \`;
        }

        const optionsHtml = enigma.opciones.map((opt, idx) => {
          let extraStyle = '';
          if (answered) {
            if (opt.correcta) {
              extraStyle = 'border-color:#10b981; background:rgba(16,185,129,0.15);';
            } else if (answered.selectedId === opt.id) {
              extraStyle = 'border-color:#ef4444; background:rgba(239,68,68,0.15);';
            } else {
              extraStyle = 'opacity:0.5;';
            }
          }

          return \`
            <button class="option-btn" style="\${extraStyle}" onclick="mentalApp.selectEnigmaOption(\${this.currentStep}, '\${opt.id}')" \${answered ? 'disabled' : ''}>
              <span class="option-indicator">\${idx + 1}</span>
              <span>\${opt.texto}</span>
            </button>
          \`;
        }).join('');

        root.innerHTML = \`
          <div class="runner-wrapper">
            <div class="runner-header-card">
              <span style="font-size:0.85rem; font-weight:600; color:var(--text-secondary);">🧩 \${enigma.titulo}</span>
              <div class="runner-progress-track">
                <div class="runner-progress-fill" style="width:\${pct}%;"></div>
              </div>
              <span style="font-size:0.8rem; color:var(--text-muted);">\${this.currentStep + 1} / \${total}</span>
            </div>

            <div class="question-card">
              <h2 class="question-text" style="white-space:pre-line; font-family:var(--font-reading); font-size:1.25rem; font-weight:400; line-height:1.7;">\${enigma.planteamiento}</h2>
              \${cluesHtml}
              <div class="options-grid" style="margin-top:1rem;">
                \${optionsHtml}
              </div>
              \${feedbackHtml}
            </div>
          </div>
        \`;
      },

      renderResult() {
        const root = document.getElementById('app-root');
        const test = this.currentTest;

        if (window.DesvariosAuth) {
          window.DesvariosAuth.unlockMedal('mental-arquetipo');
          if (test && (test.slug === 'test-dilemas-morales' || test.slug === 'dilemas-morales')) {
            window.DesvariosAuth.unlockMedal('mental-filosofo');
          }
        }

        if (test.tipo === 'personalidad') {
          const counts = {};
          this.userAnswers.forEach(opt => {
            counts[opt.arquetipo] = (counts[opt.arquetipo] || 0) + 1;
          });

          let topArquetipo = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, 'erudito');
          const res = test.resultados[topArquetipo] || test.resultados.erudito;

          this.fireConfetti();

          root.innerHTML = \`
            <div class="runner-wrapper">
              <div class="result-card" style="border-color:\${res.color};">
                <span class="result-icon-large">\${res.icono}</span>
                <div>
                  <span class="result-badge" style="background:\${res.color}22; color:\${res.color}; border:1px solid \${res.color}55;">
                    Tu Arquetipo Dominante
                  </span>
                </div>
                <h1 class="result-title">\${res.nombre}</h1>
                <div class="result-subtitle">«\${res.tituloCorto}»</div>

                <div class="result-desc">
                  \${res.descripcion}
                </div>

                <div class="result-traits-grid">
                  <div class="result-trait-box">
                    <div class="result-trait-label">⚔️ Mayor Fortaleza</div>
                    <div class="result-trait-val">\${res.fortaleza}</div>
                  </div>
                  <div class="result-trait-box">
                    <div class="result-trait-label">🌀 Tu Desvarío Oculto</div>
                    <div class="result-trait-val">\${res.desvario}</div>
                  </div>
                </div>

                <div style="font-size:0.88rem; color:var(--text-muted); margin-bottom:1.5rem;">
                  ✨ \${res.afinidad}
                </div>

                <div class="result-actions">
                  <button class="btn-result-main" onclick="mentalApp.startTest('\${test.slug}')">↺ Repetir Test</button>
                  <button class="btn-secondary" style="padding:0.85rem 1.4rem;" onclick="mentalApp.showCatalog()">🧪 Explorar más tests</button>
                </div>
              </div>
            </div>
          \`;
        } else if (test.tipo === 'puntuacion') {
          const totalPoints = this.userAnswers.reduce((sum, opt) => sum + (opt.puntos || 0), 0);
          const range = test.rangos.find(r => totalPoints >= r.min && totalPoints <= r.max) || test.rangos[0];

          this.fireConfetti();

          root.innerHTML = \`
            <div class="runner-wrapper">
              <div class="result-card" style="border-color:\${range.color};">
                <span class="result-icon-large">\${range.icono}</span>
                <div>
                  <span class="result-badge" style="background:\${range.color}22; color:\${range.color}; border:1px solid \${range.color}55;">
                    \${range.nivel} — \${totalPoints} Puntos
                  </span>
                </div>
                <h1 class="result-title">\${range.titulo}</h1>

                <div class="result-desc">
                  \${range.descripcion}
                </div>

                <div class="result-traits-grid">
                  <div class="result-trait-box" style="grid-column: 1 / -1;">
                    <div class="result-trait-label">💡 Consejo de los Sabios</div>
                    <div class="result-trait-val">\${range.consejo}</div>
                  </div>
                </div>

                <div class="result-actions">
                  <button class="btn-result-main" onclick="mentalApp.startTest('\${test.slug}')">↺ Volver a diagnosticar</button>
                  <button class="btn-secondary" style="padding:0.85rem 1.4rem;" onclick="mentalApp.showCatalog()">🧪 Otros tests</button>
                </div>
              </div>
            </div>
          \`;
        }
      },

      renderEnigmaFinalSummary() {
        const root = document.getElementById('app-root');
        const test = this.currentTest;
        const total = test.enigmas.length;
        let correctCount = 0;
        for (let i = 0; i < total; i++) {
          if (this.enigmaAnswers[i] && this.enigmaAnswers[i].isCorrect) {
            correctCount++;
          }
        }

        let rankTitle = 'Aprendiz de Deducción';
        let rankIcon = '🧐';
        let rankColor = '#f59e0b';
        let rankDesc = 'Has superado algunos enigmas, pero aún quedan misterios que se resisten a tu lógica.';

        if (correctCount === 5) {
          rankTitle = 'Gran Maestro de la Lógica';
          rankIcon = '👑';
          rankColor = '#10b981';
          rankDesc = '¡Impresionante! Has resuelto los 5 enigmas sin caer en ninguna de las trampas deductivas. Tu mente es prodigiosa.';
        } else if (correctCount >= 3) {
          rankTitle = 'Erudito Sagaz';
          rankIcon = '⚡';
          rankColor = '#06b6d4';
          rankDesc = 'Muy buen desempeño analítico. Posees un pensamiento lateral agudo y gran capacidad deductiva.';
        }

        if (correctCount >= 3) {
          this.fireConfetti();
        }

        root.innerHTML = \`
          <div class="runner-wrapper">
            <div class="result-card" style="border-color:\${rankColor};">
              <span class="result-icon-large">\${rankIcon}</span>
              <div>
                <span class="result-badge" style="background:\${rankColor}22; color:\${rankColor}; border:1px solid \${rankColor}55;">
                  Puntuación: \${correctCount} de \${total} Aciertos
                </span>
              </div>
              <h1 class="result-title">\${rankTitle}</h1>

              <div class="result-desc">
                \${rankDesc}
              </div>

              <div class="result-actions">
                <button class="btn-result-main" onclick="mentalApp.startTest('\${test.slug}')">↺ Reintentar Enigmas</button>
                <button class="btn-secondary" style="padding:0.85rem 1.4rem;" onclick="mentalApp.showCatalog()">🧪 Más Desvaríos Mentales</button>
              </div>
            </div>
          </div>
        \`;
      },

      fireConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = [];
        const colors = ['#06b6d4', '#a855f7', '#10b981', '#ffffff', '#f59e0b'];

        for (let i = 0; i < 70; i++) {
          pieces.push({
            x: canvas.width / 2,
            y: canvas.height * 0.6,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.8) * 14,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            vRot: (Math.random() - 0.5) * 10
          });
        }

        let animationFrame;
        let count = 0;

        function update() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          pieces.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.35;
            p.rotation += p.vRot;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
          });

          count++;
          if (count < 140) {
            animationFrame = requestAnimationFrame(update);
          } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        }

        update();
      }
    };

    document.addEventListener('DOMContentLoaded', () => {
      mentalApp.init();
    });
  </script>
  <script src="js/cookie-banner.js"></script>
</body>
</html>
`;

// Save all standalone files
const indexOut = path.join(__dirname, '..', 'index.html');
const creaOut = path.join(__dirname, '..', 'crea-tu-historia.html');
const mentalsOut = path.join(__dirname, '..', 'desvarios-mentales.html');

fs.writeFileSync(indexOut, indexHtmlContent, 'utf8');
fs.writeFileSync(creaOut, creaHtmlContent, 'utf8');
fs.writeFileSync(mentalsOut, mentalsHtmlContent, 'utf8');

// ==========================================================
// 4. GENERATE INDIVIDUAL TEST HTML PAGES FOR SEO & SHARING
// ==========================================================
function generateIndividualTestHtml(test) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: test.titulo,
    description: test.descripcionCorta,
    url: `https://tusdesvarios.com/desvarios-mentales/${test.slug}`,
    inLanguage: 'es',
    about: {
      '@type': 'Thing',
      name: test.categoriaLabel || 'Desvaríos Mentales'
    }
  };

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\${test.titulo} — Desvaríos Mentales | TusDesvarios.com</title>
  <meta name="description" content="\${test.descripcionCorta}">
  <meta name="keywords" content="\${test.slug}, test, desvarios mentales, tus desvarios, \${test.titulo}, juegos mentales">
  
  <!-- Canonical & Open Graph / SEO -->
  <link rel="canonical" href="https://tusdesvarios.com/desvarios-mentales/\${test.slug}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="\${test.titulo} | Tus Desvaríos">
  <meta property="og:description" content="\${test.descripcionCorta}">
  <meta property="og:url" content="https://tusdesvarios.com/desvarios-mentales/\${test.slug}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="\${test.titulo}">
  <meta name="twitter:description" content="\${test.descripcionCorta}">

  <!-- Schema.org Quiz structured data for Google Rich Results -->
  <script type="application/ld+json">
\${JSON.stringify(jsonLd, null, 2)}
  </script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-main: #0b0f19;
      --bg-surface: rgba(18, 24, 38, 0.78);
      --bg-surface-elevated: rgba(26, 34, 52, 0.88);
      --bg-surface-hover: rgba(34, 45, 68, 0.95);
      --bg-glass: rgba(12, 17, 28, 0.85);

      --border-subtle: rgba(255, 255, 255, 0.12);
      --border-medium: rgba(255, 255, 255, 0.22);
      --border-focus: rgba(6, 182, 212, 0.5);

      --text-primary: #f8fafc;
      --text-secondary: #cbd5e1;
      --text-muted: #94a3b8;

      --accent-cyan: #06b6d4;
      --accent-purple: #a855f7;
      --accent-amber: #f59e0b;
      --accent-green: #10b981;
      --accent-rose: #ec4899;

      --font-ui: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-title: 'Cinzel', Georgia, serif;
      --font-reading: 'Crimson Pro', Georgia, serif;

      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --radius-full: 9999px;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-ui);
      background-color: var(--bg-main);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      line-height: 1.5;
      background-image: 
        radial-gradient(at 15% 15%, rgba(6, 182, 212, 0.12) 0px, transparent 45%),
        radial-gradient(at 85% 20%, rgba(168, 85, 247, 0.14) 0px, transparent 50%),
        radial-gradient(at 50% 85%, rgba(245, 158, 11, 0.08) 0px, transparent 55%),
        radial-gradient(at 90% 90%, rgba(16, 185, 129, 0.08) 0px, transparent 40%);
      background-attachment: fixed;
    }

    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      width: 100%;
    }

    ${getHeaderCss()}

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.85rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-secondary:hover {
      background: var(--bg-surface-hover);
      border-color: var(--border-medium);
      color: var(--text-primary);
    }

    .main-content {
      flex: 1;
      max-width: 860px;
      width: 100%;
      margin: 0 auto;
      padding: 2rem 1.25rem 4rem;
    }

    .runner-wrapper {
      max-width: 740px;
      margin: 0 auto;
      animation: fadeIn 0.35s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .runner-header-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .runner-progress-track {
      flex: 1;
      height: 8px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .runner-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #06b6d4 0%, #a855f7 100%);
      transition: width 0.3s ease;
    }

    .question-card {
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 2rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }

    .question-step-badge {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--accent-cyan);
      margin-bottom: 0.75rem;
    }

    .question-text {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.6;
      margin-bottom: 1.75rem;
    }

    .question-text strong {
      color: #38bdf8;
      font-weight: 700;
    }

    .question-text em {
      color: #f1f5f9;
      font-style: italic;
    }

    .question-text blockquote {
      border-left: 3px solid var(--accent-cyan);
      padding: 0.5rem 0.85rem;
      margin: 0.75rem 0;
      background: rgba(6, 182, 212, 0.08);
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
      font-style: italic;
      color: #e2e8f0;
    }

    .options-grid {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .option-btn {
      width: 100%;
      text-align: left;
      padding: 1.1rem 1.25rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      color: var(--text-secondary);
      font-size: 0.98rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.85rem;
      font-family: inherit;
    }

    .option-btn:hover:not(:disabled) {
      background: var(--bg-surface-hover);
      border-color: var(--border-focus);
      color: var(--text-primary);
      transform: translateX(4px);
    }

    .option-indicator {
      width: 28px;
      height: 28px;
      border-radius: var(--radius-full);
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.82rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .clue-toggle-btn {
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.35);
      color: #fbbf24;
      padding: 0.5rem 0.9rem;
      border-radius: var(--radius-sm);
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      margin-bottom: 0.75rem;
      transition: all 0.2s;
    }

    .clue-toggle-btn:hover {
      background: rgba(245, 158, 11, 0.22);
    }

    .clue-box {
      background: rgba(245, 158, 11, 0.08);
      border-left: 3px solid #f59e0b;
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
      color: #fde68a;
      margin-bottom: 0.6rem;
      line-height: 1.5;
    }

    .feedback-box {
      margin-top: 1.5rem;
      padding: 1.25rem;
      border-radius: var(--radius-md);
      animation: fadeIn 0.3s ease;
    }

    .feedback-box.correct {
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.35);
    }

    .feedback-box.incorrect {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.35);
    }

    .result-card {
      background: var(--bg-surface-elevated);
      border: 2px solid;
      border-radius: var(--radius-lg);
      padding: 2.5rem 2rem;
      text-align: center;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
    }

    .result-icon-large {
      font-size: 4rem;
      line-height: 1;
      margin-bottom: 1rem;
      display: inline-block;
    }

    .result-badge {
      display: inline-block;
      padding: 0.35rem 1rem;
      border-radius: var(--radius-full);
      font-size: 0.82rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 1rem;
    }

    .result-title {
      font-family: var(--font-title);
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.4rem;
    }

    .result-subtitle {
      font-size: 1.1rem;
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }

    .result-desc {
      font-family: var(--font-reading);
      font-size: 1.25rem;
      line-height: 1.7;
      color: var(--text-secondary);
      max-width: 620px;
      margin: 0 auto 2rem;
      text-align: left;
    }

    .result-traits-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 2rem;
      text-align: left;
    }

    @media (max-width: 600px) {
      .result-traits-grid {
        grid-template-columns: 1fr;
      }
    }

    .result-trait-box {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 1.1rem;
    }

    .result-trait-label {
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 0.4rem;
    }

    .result-trait-val {
      font-size: 0.95rem;
      color: var(--text-primary);
      line-height: 1.5;
    }

    .result-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
    }

    .btn-result-main {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.85rem 1.6rem;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      color: #fff;
      font-weight: 700;
      font-size: 0.95rem;
      transition: all 0.25s ease;
      box-shadow: 0 4px 20px rgba(6, 182, 212, 0.35);
      border: none;
      cursor: pointer;
    }

    .btn-result-main:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(6, 182, 212, 0.5);
    }

    .site-footer {
      margin-top: auto;
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      padding: 1.5rem 1.25rem;
      text-align: center;
      font-size: 0.82rem;
      color: var(--text-muted);
    }
    .footer-legal-links {
      margin-top: 0.75rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.65rem 0.85rem;
      font-size: 0.82rem;
    }
    .footer-legal-links a {
      color: var(--text-secondary, #cbd5e1);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .footer-legal-links a:hover {
      color: #c084fc;
      text-decoration: underline;
    }
    .footer-separator {
      color: var(--border-medium, rgba(255, 255, 255, 0.22));
      font-size: 0.75rem;
      user-select: none;
    }


    #confetti-canvas {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 999;
      width: 100%;
      height: 100%;
    }
  </style>
  <!-- Supabase SDK v2 & Desvarios Client -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/supabase-client.js"></script>
</head>
<body>
  <canvas id="confetti-canvas"></canvas>

  <div class="app-container">
    ${getHeaderHtml('mental')}

    <!-- Main Content Area -->
    <main class="main-content" id="app-root">
      <!-- Injected via direct test runner -->
    </main>

    <!-- Footer -->
    <!-- Pie de Página Unificado -->
  <footer class="site-footer">
    <p>© 2026 TusDesvarios.com — Portal de Entretenimiento, Ficción y Ocio Interactivo</p>
    <div class="footer-legal-links">
      <a href="aviso-legal.html">Aviso Legal</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-privacidad.html">Política de Privacidad</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-cookies.html">Política de Cookies</a>
    </div>
  </footer>
  </div>

  <script>
    const TEST_DATA = \${JSON.stringify(test)};

    const mentalApp = {
      currentTest: TEST_DATA,
      currentStep: 0,
      userAnswers: [],
      revealedClues: {},
      enigmaAnswers: {},

      init() {
        if (this.currentTest.tipo === 'enigma') {
          this.renderEnigmaStep();
        } else {
          this.renderQuestionStep();
        }
      },

      // --- Personality & Score Flow ---
      answerQuestion(optionIndex) {
        const q = this.currentTest.preguntas[this.currentStep];
        const opt = q.opciones[optionIndex];
        this.userAnswers.push(opt);

        this.currentStep++;
        if (this.currentStep < this.currentTest.preguntas.length) {
          this.renderQuestionStep();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          this.renderResult();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },

      // --- Enigmas Flow ---
      toggleClue(stepIdx) {
        const currentCount = this.revealedClues[stepIdx] || 0;
        this.revealedClues[stepIdx] = currentCount + 1;
        this.renderEnigmaStep();
      },

      selectEnigmaOption(stepIdx, optionId) {
        if (this.enigmaAnswers[stepIdx]) return;
        const enigma = this.currentTest.enigmas[stepIdx];
        const selectedOpt = enigma.opciones.find(o => o.id === optionId);
        
        this.enigmaAnswers[stepIdx] = {
          selectedId: optionId,
          isCorrect: !!(selectedOpt && selectedOpt.correcta)
        };

        if (selectedOpt && selectedOpt.correcta) {
          this.fireConfetti();
        }

        this.renderEnigmaStep();
      },

      nextEnigma() {
        this.currentStep++;
        if (this.currentStep < this.currentTest.enigmas.length) {
          this.renderEnigmaStep();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          this.renderEnigmaFinalSummary();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },

      restart() {
        this.currentStep = 0;
        this.userAnswers = [];
        this.revealedClues = {};
        this.enigmaAnswers = {};
        if (this.currentTest.tipo === 'enigma') {
          this.renderEnigmaStep();
        } else {
          this.renderQuestionStep();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      formatMarkdown(text) {
        if (!text) return '';
        const blocks = text.split(/\\n\\s*\\n/);
        return blocks.map(block => {
          const trimmed = block.trim();
          let formatted = trimmed
            .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
            .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
            .replace(/\\n/g, '<br>');

          if (trimmed.startsWith('>')) {
            const quote = formatted.replace(/^>\\s*/gm, '');
            return '<blockquote>' + quote + '</blockquote>';
          }
          if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
            const items = trimmed.split(/\\n/).map(line => {
              const clean = line.replace(/^[-•*]\\s*/, '')
                .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
                .replace(/\\*(.*?)\\*/g, '<em>$1</em>');
              return '<li style="margin-bottom:0.4rem;">' + clean + '</li>';
            }).join('');
            return '<ul style="margin:0.75rem 0; padding-left:1.4rem; list-style-type:disc;">' + items + '</ul>';
          }
          return '<p style="margin-bottom:0.85rem;">' + formatted + '</p>';
        }).join('');
      },

      renderQuestionStep() {
        const root = document.getElementById('app-root');
        const test = this.currentTest;
        const total = test.preguntas.length;
        const q = test.preguntas[this.currentStep];
        const pct = Math.round(((this.currentStep + 1) / total) * 100);

        const optionsHtml = q.opciones.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx);
          return \`
            <button class="option-btn" onclick="mentalApp.answerQuestion(\${idx})">
              <span class="option-indicator">\${letter}</span>
              <span>\${opt.texto}</span>
            </button>
          \`;
        }).join('');

        root.innerHTML = \`
          <div class="runner-wrapper">
            <div style="margin-bottom:1rem;">
              <a href="desvarios-mentales.html" class="btn-secondary" style="font-size:0.82rem;">
                ← Volver a Todos los Tests
              </a>
            </div>

            <div class="runner-header-card">
              <span style="font-size:0.85rem; font-weight:600; color:var(--text-secondary);">\${test.icono} \${test.titulo}</span>
              <div class="runner-progress-track">
                <div class="runner-progress-fill" style="width:\${pct}%;"></div>
              </div>
              <span style="font-size:0.8rem; color:var(--text-muted);">\${this.currentStep + 1} / \${total}</span>
            </div>

            <div class="question-card">
              <div class="question-step-badge">Pregunta \${this.currentStep + 1} de \${total}</div>
              <div class="question-text">\${this.formatMarkdown(q.texto)}</div>
              <div class="options-grid">
                \${optionsHtml}
              </div>
            </div>
          </div>
        \`;
      },

      renderEnigmaStep() {
        const root = document.getElementById('app-root');
        const test = this.currentTest;
        const total = test.enigmas.length;
        const enigma = test.enigmas[this.currentStep];
        const pct = Math.round(((this.currentStep + 1) / total) * 100);
        const answered = this.enigmaAnswers[this.currentStep];
        const clueCount = this.revealedClues[this.currentStep] || 0;

        let cluesHtml = '';
        if (enigma.pistas && enigma.pistas.length > 0) {
          const visibleClues = enigma.pistas.slice(0, clueCount);
          cluesHtml = \`
            <div style="margin-top:1.25rem;">
              \${clueCount < enigma.pistas.length && !answered ? \`
                <button class="clue-toggle-btn" onclick="mentalApp.toggleClue(\${this.currentStep})">
                  <span>💡</span> <span>Revelar Pista (\${clueCount + 1}/\${enigma.pistas.length})</span>
                </button>
              \` : ''}
              \${visibleClues.map(c => \`<div class="clue-box">🔍 \${this.formatMarkdown(c)}</div>\`).join('')}
            </div>
          \`;
        }

        let feedbackHtml = '';
        if (answered) {
          feedbackHtml = \`
            <div class="feedback-box \${answered.isCorrect ? 'correct' : 'incorrect'}">
              <div style="font-weight:700; font-size:1.1rem; margin-bottom:0.5rem; color:\${answered.isCorrect ? '#34d399' : '#f87171'};">
                \${answered.isCorrect ? '✨ ¡Respuesta Correcta!' : '❌ Respuesta Incorrecta'}
              </div>
              <div style="font-size:0.95rem; line-height:1.6;">\${this.formatMarkdown(enigma.explicacion)}</div>
              <button class="btn-result-main" style="margin-top:1.25rem;" onclick="mentalApp.nextEnigma()">
                <span>\${this.currentStep + 1 < total ? 'Siguiente Pregunta ➜' : 'Ver Puntuación Final 🏆'}</span>
              </button>
            </div>
          \`;
        }

        const optionsHtml = enigma.opciones.map((opt, idx) => {
          let extraStyle = '';
          if (answered) {
            if (opt.correcta) {
              extraStyle = 'border-color:#10b981; background:rgba(16,185,129,0.15);';
            } else if (answered.selectedId === opt.id) {
              extraStyle = 'border-color:#ef4444; background:rgba(239,68,68,0.15);';
            } else {
              extraStyle = 'opacity:0.5;';
            }
          }

          return \`
            <button class="option-btn" style="\${extraStyle}" onclick="mentalApp.selectEnigmaOption(\${this.currentStep}, '\${opt.id}')" \${answered ? 'disabled' : ''}>
              <span class="option-indicator">\${idx + 1}</span>
              <span>\${opt.texto}</span>
            </button>
          \`;
        }).join('');

        root.innerHTML = \`
          <div class="runner-wrapper">
            <div style="margin-bottom:1rem;">
              <a href="desvarios-mentales.html" class="btn-secondary" style="font-size:0.82rem;">
                ← Volver a Todos los Tests
              </a>
            </div>

            <div class="runner-header-card">
              <span style="font-size:0.85rem; font-weight:600; color:var(--text-secondary);">🧩 \${enigma.titulo}</span>
              <div class="runner-progress-track">
                <div class="runner-progress-fill" style="width:\${pct}%;"></div>
              </div>
              <span style="font-size:0.8rem; color:var(--text-muted);">\${this.currentStep + 1} / \${total}</span>
            </div>

            <div class="question-card">
              <div class="question-text" style="font-family:var(--font-reading); font-size:1.25rem; font-weight:400; line-height:1.7; color:#e2e8f0;">
                \${this.formatMarkdown(enigma.planteamiento)}
              </div>
              \${cluesHtml}
              <div class="options-grid" style="margin-top:1rem;">
                \${optionsHtml}
              </div>
              \${feedbackHtml}
            </div>
          </div>
        \`;
      },

      renderResult() {
        const root = document.getElementById('app-root');
        const test = this.currentTest;

        if (window.DesvariosAuth) {
          window.DesvariosAuth.unlockMedal('mental-arquetipo');
          if (test && (test.slug === 'test-dilemas-morales' || test.slug === 'dilemas-morales')) {
            window.DesvariosAuth.unlockMedal('mental-filosofo');
          }
        }

        if (test.tipo === 'personalidad') {
          const counts = {};
          this.userAnswers.forEach(opt => {
            counts[opt.arquetipo] = (counts[opt.arquetipo] || 0) + 1;
          });

          const keys = Object.keys(test.resultados);
          let topArquetipo = keys.reduce((a, b) => (counts[a] || 0) > (counts[b] || 0) ? a : b, keys[0]);
          const res = test.resultados[topArquetipo] || test.resultados[keys[0]];

          this.fireConfetti();

          root.innerHTML = \`
            <div class="runner-wrapper">
              <div class="result-card" style="border-color:\${res.color};">
                <span class="result-icon-large">\${res.icono}</span>
                <div>
                  <span class="result-badge" style="background:\${res.color}22; color:\${res.color}; border:1px solid \${res.color}55;">
                    Tu Resultado
                  </span>
                </div>
                <h1 class="result-title">\${res.nombre}</h1>
                <div class="result-subtitle">«\${res.tituloCorto}»</div>

                <div class="result-desc">
                  \${this.formatMarkdown(res.descripcion)}
                </div>

                <div class="result-traits-grid">
                  <div class="result-trait-box">
                    <div class="result-trait-label">⚔️ Mayor Fortaleza</div>
                    <div class="result-trait-val">\${res.fortaleza}</div>
                  </div>
                  <div class="result-trait-box">
                    <div class="result-trait-label">🌀 Tu Desvarío Oculto</div>
                    <div class="result-trait-val">\${res.desvario}</div>
                  </div>
                </div>

                <div style="font-size:0.88rem; color:var(--text-muted); margin-bottom:1.5rem;">
                  ✨ \${res.afinidad}
                </div>

                <div class="result-actions">
                  <button class="btn-result-main" onclick="mentalApp.restart()">↺ Repetir Test</button>
                  <a href="desvarios-mentales.html" class="btn-secondary" style="padding:0.85rem 1.4rem;">🧪 Explorar más tests</a>
                </div>
              </div>
            </div>
          \`;
        } else if (test.tipo === 'puntuacion') {
          const totalPoints = this.userAnswers.reduce((sum, opt) => sum + (opt.puntos || 0), 0);
          const range = test.rangos.find(r => totalPoints >= r.min && totalPoints <= r.max) || test.rangos[0];

          this.fireConfetti();

          root.innerHTML = \`
            <div class="runner-wrapper">
              <div class="result-card" style="border-color:\${range.color};">
                <span class="result-icon-large">\${range.icono}</span>
                <div>
                  <span class="result-badge" style="background:\${range.color}22; color:\${range.color}; border:1px solid \${range.color}55;">
                    \${range.nivel} — \${totalPoints} Puntos
                  </span>
                </div>
                <h1 class="result-title">\${range.titulo}</h1>

                <div class="result-desc">
                  \${this.formatMarkdown(range.descripcion)}
                </div>

                <div class="result-traits-grid">
                  <div class="result-trait-box" style="grid-column: 1 / -1;">
                    <div class="result-trait-label">💡 Consejo de los Sabios</div>
                    <div class="result-trait-val">\${range.consejo}</div>
                  </div>
                </div>

                <div class="result-actions">
                  <button class="btn-result-main" onclick="mentalApp.restart()">↺ Volver a diagnosticar</button>
                  <a href="desvarios-mentales.html" class="btn-secondary" style="padding:0.85rem 1.4rem;">🧪 Otros tests</a>
                </div>
              </div>
            </div>
          \`;
        }
      },

      renderEnigmaFinalSummary() {
        const root = document.getElementById('app-root');
        const test = this.currentTest;
        const total = test.enigmas.length;
        let correctCount = 0;
        for (let i = 0; i < total; i++) {
          if (this.enigmaAnswers[i] && this.enigmaAnswers[i].isCorrect) {
            correctCount++;
          }
        }

        let rankTitle = 'Mente Curiosa';
        let rankIcon = '🧐';
        let rankColor = '#f59e0b';
        let rankDesc = 'Has superado varios retos, aunque algunas trampas han conseguido despistarte.';

        const pctScore = Math.round((correctCount / total) * 100);
        if (pctScore === 100) {
          rankTitle = 'Gran Maestro de la Sabiduría';
          rankIcon = '👑';
          rankColor = '#10b981';
          rankDesc = \`¡Puntuación perfecta! Has resuelto los \${total} retos sin caer en ninguna trampa. Tu agudeza mental es prodigiosa.\`;
        } else if (pctScore >= 60) {
          rankTitle = 'Erudito Sagaz';
          rankIcon = '⚡';
          rankColor = '#06b6d4';
          rankDesc = \`Muy buen desempeño analítico (\${correctCount} de \${total} aciertos). Posees un pensamiento lateral agudo y gran capacidad deductiva.\`;
        }

        if (correctCount >= Math.ceil(total / 2)) {
          this.fireConfetti();
        }
        if (window.DesvariosAuth) {
          window.DesvariosAuth.unlockMedal('mental-logica');
        }

        root.innerHTML = \`
          <div class="runner-wrapper">
            <div class="result-card" style="border-color:\${rankColor};">
              <span class="result-icon-large">\${rankIcon}</span>
              <div>
                <span class="result-badge" style="background:\${rankColor}22; color:\${rankColor}; border:1px solid \${rankColor}55;">
                  Puntuación: \${correctCount} de \${total} Aciertos (\${pctScore}%)
                </span>
              </div>
              <h1 class="result-title">\${rankTitle}</h1>

              <div class="result-desc">
                \${rankDesc}
              </div>

              <div class="result-actions">
                <button class="btn-result-main" onclick="mentalApp.restart()">↺ Reintentar Reto</button>
                <a href="desvarios-mentales.html" class="btn-secondary" style="padding:0.85rem 1.4rem;">🧪 Más Desvaríos Mentales</a>
              </div>
            </div>
          </div>
        \`;
      },

      fireConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = [];
        const colors = ['#06b6d4', '#a855f7', '#10b981', '#ffffff', '#f59e0b'];

        for (let i = 0; i < 70; i++) {
          pieces.push({
            x: canvas.width / 2,
            y: canvas.height * 0.6,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.8) * 14,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            vRot: (Math.random() - 0.5) * 10
          });
        }

        let animationFrame;
        let count = 0;

        function update() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          pieces.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.35;
            p.rotation += p.vRot;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
          });

          count++;
          if (count < 140) {
            animationFrame = requestAnimationFrame(update);
          } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        }

        update();
      }
    };

    document.addEventListener('DOMContentLoaded', () => {
      mentalApp.init();
    });
  </script>
  <script src="js/cookie-banner.js"></script>
</body>
</html>`;
}

const allTests = [
  arquetipoRaw,
  termometroRaw,
  enigmasRaw,
  supervivenciaRaw,
  trampasRaw,
  monstruoRaw,
  dilemasRaw,
  curiosidadesRaw
];

allTests.forEach(test => {
  const testFileOut = path.join(__dirname, '..', `test-${test.slug}.html`);
  fs.writeFileSync(testFileOut, generateIndividualTestHtml(test), 'utf8');
});


// ==========================================================
// 5. GENERATE INDIVIDUAL STORY HTML PAGES FOR SEO & SHARING
// ==========================================================
function generateIndividualStoryHtml(story) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: story.titulo,
    description: story.descripcionCorta,
    url: `https://tusdesvarios.com/crea-tu-historia/historia/${story.slug}`,
    genre: story.genero,
    inLanguage: 'es',
    author: {
      '@type': 'Person',
      name: story.autor || 'Tus Desvaríos'
    },
    image: `https://tusdesvarios.com/${story.portada}`
  };

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${story.titulo} — Crea tus Desvaríos | TusDesvarios.com</title>
  <meta name="description" content="${story.descripcionCorta}">
  <meta name="keywords" content="${story.slug}, ficcion interactiva, elige tu propia aventura, historias ramificadas, juegos de rol narrativos, tus desvarios, ${story.titulo}">
  
  <!-- Canonical & Open Graph / SEO -->
  <link rel="canonical" href="https://tusdesvarios.com/crea-tu-historia/historia/${story.slug}">
  <meta property="og:type" content="book">
  <meta property="og:title" content="${story.titulo} — Ficción Interactiva | Tus Desvaríos">
  <meta property="og:description" content="${story.descripcionCorta}">
  <meta property="og:url" content="https://tusdesvarios.com/crea-tu-historia/historia/${story.slug}">
  <meta property="og:image" content="${story.portada}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${story.titulo}">
  <meta name="twitter:description" content="${story.descripcionCorta}">
  <meta name="twitter:image" content="${story.portada}">

  <!-- Schema.org Book structured data for Google Rich Results -->
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-main: #0a0d14;
      --bg-surface: rgba(18, 24, 38, 0.85);
      --bg-surface-elevated: rgba(26, 34, 52, 0.92);
      --bg-surface-hover: rgba(34, 45, 68, 0.95);
      --bg-glass: rgba(12, 17, 28, 0.88);

      --border-subtle: rgba(255, 255, 255, 0.12);
      --border-medium: rgba(255, 255, 255, 0.22);
      --border-focus: rgba(16, 185, 129, 0.5);

      --text-primary: #f8fafc;
      --text-secondary: #cbd5e1;
      --text-muted: #94a3b8;

      --accent-emerald: #10b981;
      --accent-cyan: #06b6d4;
      --accent-amber: #f59e0b;
      --accent-rose: #ef4444;

      --font-ui: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-title: 'Cinzel', Georgia, serif;
      --font-reading: 'Crimson Pro', Georgia, serif;

      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --radius-full: 9999px;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-ui);
      background-color: var(--bg-main);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      line-height: 1.6;
      background-image: 
        radial-gradient(at 15% 15%, rgba(16, 185, 129, 0.12) 0px, transparent 45%),
        radial-gradient(at 85% 20%, rgba(6, 182, 212, 0.14) 0px, transparent 50%),
        radial-gradient(at 50% 85%, rgba(245, 158, 11, 0.08) 0px, transparent 55%);
      background-attachment: fixed;
    }

    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      width: 100%;
    }

    ${getHeaderCss()}

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.85rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-secondary:hover {
      background: var(--bg-surface-hover);
      border-color: var(--border-medium);
      color: var(--text-primary);
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.8rem 1.5rem;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #fff;
      font-weight: 700;
      font-size: 0.95rem;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: all 0.25s ease;
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.35);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(16, 185, 129, 0.5);
    }

    .main-content {
      flex: 1;
      max-width: 860px;
      width: 100%;
      margin: 0 auto;
      padding: 2rem 1.25rem 4rem;
    }

    .reader-wrapper {
      max-width: 760px;
      margin: 0 auto;
      animation: fadeIn 0.35s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .reader-progress-container {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 0.85rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .progress-bar-track {
      flex: 1;
      height: 8px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981 0%, #06b6d4 100%);
      transition: width 0.3s ease;
    }

    .reader-node-card {
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
    }

    .reader-image-container {
      position: relative;
      width: 100%;
      height: 380px;
      background: #000;
    }

    @media (max-width: 600px) {
      .reader-image-container {
        height: 240px;
      }
    }

    .reader-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .reader-image-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, var(--bg-surface-elevated) 0%, transparent 60%);
    }

    .reader-body {
      padding: 2.25rem;
    }

    @media (max-width: 600px) {
      .reader-body {
        padding: 1.5rem;
      }
    }

    .reader-node-title {
      font-family: var(--font-title);
      font-size: 1.85rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 1.5rem;
      line-height: 1.3;
    }

    .reader-text {
      font-family: var(--font-reading);
      font-size: 1.35rem;
      line-height: 1.8;
      color: #e2e8f0;
      margin-bottom: 2.5rem;
    }

    .reader-text p {
      margin-bottom: 1.25rem;
    }

    .reader-text strong {
      color: #34d399;
      font-weight: 600;
    }

    .reader-text em {
      color: #f1f5f9;
      font-style: italic;
    }

    .reader-text blockquote {
      border-left: 3px solid var(--accent-emerald);
      padding: 0.6rem 1rem;
      margin: 1.25rem 0;
      background: rgba(16, 185, 129, 0.08);
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
      font-style: italic;
      color: #d1fae5;
    }

    .decisions-container {
      border-top: 1px solid var(--border-subtle);
      padding-top: 1.75rem;
    }

    .decisions-heading {
      font-size: 0.88rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--accent-emerald);
      margin-bottom: 1.1rem;
    }

    .decision-button {
      width: 100%;
      text-align: left;
      padding: 1.15rem 1.4rem;
      margin-bottom: 0.85rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      color: var(--text-secondary);
      font-size: 1.05rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.25s ease;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      font-family: inherit;
    }

    .decision-button:hover {
      background: var(--bg-surface-hover);
      border-color: var(--accent-emerald);
      color: #fff;
      transform: translateX(6px);
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.2);
    }

    .decision-badge {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-sm);
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
      margin-bottom: 0.35rem;
    }

    .ending-banner {
      border-top: 1px solid var(--border-subtle);
      padding-top: 2rem;
      text-align: center;
    }

    .ending-pill {
      display: inline-block;
      padding: 0.4rem 1.25rem;
      border-radius: var(--radius-full);
      font-size: 0.88rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 1.25rem;
    }

    .ending-pill.bueno {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.4);
    }

    .ending-pill.malo {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.4);
    }

    .ending-pill.neutro {
      background: rgba(245, 158, 11, 0.2);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.4);
    }

    .ending-moral {
      font-family: var(--font-reading);
      font-size: 1.35rem;
      font-style: italic;
      color: var(--text-secondary);
      max-width: 580px;
      margin: 0 auto 2rem;
      line-height: 1.6;
    }

    .ending-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
    }

    .site-footer {
      margin-top: auto;
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      padding: 1.5rem 1.25rem;
      text-align: center;
      font-size: 0.82rem;
      color: var(--text-muted);
    }
    .footer-legal-links {
      margin-top: 0.75rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.65rem 0.85rem;
      font-size: 0.82rem;
    }
    .footer-legal-links a {
      color: var(--text-secondary, #cbd5e1);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .footer-legal-links a:hover {
      color: #c084fc;
      text-decoration: underline;
    }
    .footer-separator {
      color: var(--border-medium, rgba(255, 255, 255, 0.22));
      font-size: 0.75rem;
      user-select: none;
    }


    #confetti-canvas {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 999;
      width: 100%;
      height: 100%;
    }
  </style>
  <!-- Supabase SDK v2 & Desvarios Client -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/supabase-client.js"></script>
</head>
<body>
  <canvas id="confetti-canvas"></canvas>

  <div class="app-container">
    ${getHeaderHtml('crea')}

    <!-- Main Content Area -->
    <main class="main-content" id="app-root">
      <!-- Injected via reader -->
    </main>

    <!-- Footer -->
    <!-- Pie de Página Unificado -->
  <footer class="site-footer">
    <p>© 2026 TusDesvarios.com — Portal de Entretenimiento, Ficción y Ocio Interactivo</p>
    <div class="footer-legal-links">
      <a href="aviso-legal.html">Aviso Legal</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-privacidad.html">Política de Privacidad</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-cookies.html">Política de Cookies</a>
    </div>
  </footer>
  </div>

  <script>
    const STORY_DATA = ${JSON.stringify(story)};

    const app = {
      currentStory: STORY_DATA,
      currentNodeId: null,
      historyTrail: [],

      init() {
        const initialId = this.currentStory.nodoInicialId || this.currentStory.nodo_inicial || (this.currentStory.nodos ? Object.keys(this.currentStory.nodos)[0] : null);
        let startId = initialId;
        let trail = [initialId];

        try {
          const raw = localStorage.getItem('tusdesvarios_progreso_' + this.currentStory.slug);
          if (raw) {
            const saved = JSON.parse(raw);
            if (saved && saved.nodoActualId && this.currentStory.nodos[saved.nodoActualId]) {
              startId = saved.nodoActualId;
              trail = saved.historialNodos && saved.historialNodos.length ? saved.historialNodos : [startId];
            }
          }
        } catch (e) {}

        this.currentNodeId = startId;
        this.historyTrail = trail;
        this.renderNode(startId);
      },

      startStory() {
        const initialId = this.currentStory.nodoInicialId || this.currentStory.nodo_inicial || (this.currentStory.nodos ? Object.keys(this.currentStory.nodos)[0] : null);
        this.currentNodeId = initialId;
        this.historyTrail = [initialId];
        this.saveProgress();
        this.renderNode(this.currentNodeId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      selectOption(targetId) {
        this.currentNodeId = targetId;
        this.historyTrail.push(targetId);
        this.saveProgress();
        this.renderNode(targetId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      goBack() {
        if (this.historyTrail.length > 1) {
          this.historyTrail.pop();
          this.currentNodeId = this.historyTrail[this.historyTrail.length - 1];
          this.saveProgress();
          this.renderNode(this.currentNodeId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },

      restartStory() {
        this.startStory();
      },

      saveProgress() {
        try {
          const node = this.currentStory.nodos[this.currentNodeId];
          const isEnding = node && (node.esFinal || node.es_final || !node.opciones || node.opciones.length === 0);
          
          let existing = {};
          try {
            const raw = localStorage.getItem('tusdesvarios_progreso_' + this.currentStory.slug);
            if (raw) existing = JSON.parse(raw);
          } catch (e) {}

          const finales = existing.finalesDescubiertos || [];
          if (isEnding && !finales.includes(this.currentNodeId)) {
            finales.push(this.currentNodeId);
          }

          const progress = {
            nodoActualId: this.currentNodeId,
            historialNodos: this.historyTrail,
            finalAlcanzado: isEnding ? (node.tipo_final || 'neutro') : null,
            finalesDescubiertos: finales,
            ultimoAcceso: new Date().toISOString()
          };
          localStorage.setItem('tusdesvarios_progreso_' + this.currentStory.slug, JSON.stringify(progress));
        } catch (e) {}
      },

      formatText(text) {
        if (!text) return '';
        const paragraphs = text.split(/\\n\\s*\\n/);
        return paragraphs.map(p => {
          const trimmed = p.trim();
          let formatted = trimmed
            .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
            .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
            .replace(/\\n/g, '<br>');

          if (trimmed.startsWith('>')) {
            const quote = formatted.replace(/^>\\s*/gm, '');
            return '<blockquote>' + quote + '</blockquote>';
          }
          return '<p>' + formatted + '</p>';
        }).join('');
      },

      renderNode(nodeId) {
        const root = document.getElementById('app-root');
        const node = this.currentStory.nodos[nodeId];

        if (!node) {
          root.innerHTML = '<div class="reader-wrapper"><p>Nodo no encontrado.</p></div>';
          return;
        }

        const isEnding = node.esFinal || node.es_final || (!node.opciones || node.opciones.length === 0);
        if (isEnding && window.DesvariosAuth) {
          if (this.currentStory.id === 'la-ultima-guardia-faro') {
            window.DesvariosAuth.unlockMedal('faro-guardian');
          } else if (this.currentStory.id === 'el-manuscrito-de-la-abadia') {
            window.DesvariosAuth.unlockMedal('abadia-codice');
          }
          try {
            const key = 'desvarios_' + this.currentStory.id + '_endings';
            const ends = JSON.parse(localStorage.getItem(key) || '[]');
            if (!ends.includes(nodeId)) {
              ends.push(nodeId);
              localStorage.setItem(key, JSON.stringify(ends));
            }
            const faroEnds = JSON.parse(localStorage.getItem('desvarios_la-ultima-guardia-faro_endings') || '[]');
            const abadiaEnds = JSON.parse(localStorage.getItem('desvarios_el-manuscrito-de-la-abadia_endings') || '[]');
            if ((faroEnds.length + abadiaEnds.length) >= 3) {
              window.DesvariosAuth.unlockMedal('historias-multiverso');
            }
          } catch(e){}
        }
        if (isEnding && node.tipo_final === 'bueno') {
          this.fireConfetti();
        }

        const stepCount = this.historyTrail.length;
        const totalSteps = Object.keys(this.currentStory.nodos).length;
        const percentage = Math.min(100, Math.round((stepCount / Math.max(totalSteps * 0.4, 5)) * 100));
        const nodeImage = node.imagen || this.currentStory.portada;

        let optionsHtml = '';
        if (isEnding) {
          const endingType = node.tipo_final || 'neutro';
          let endingLabel = 'Final Neutro — Destino Oculto';
          if (endingType === 'bueno') endingLabel = 'Final Heroico — Victoria';
          if (endingType === 'malo') endingLabel = 'Final Trágico — Perdición';

          optionsHtml = \`
            <div class="ending-banner \${endingType}">
              <div class="ending-pill \${endingType}">
                <span>\${endingLabel}</span>
              </div>
              \${node.mensaje_final ? \`<p class="ending-moral">&ldquo;\${node.mensaje_final}&rdquo;</p>\` : ''}
              <div class="ending-actions">
                <button class="btn-primary" onclick="app.restartStory()">↺ Jugar de nuevo (Explorar otros caminos)</button>
                <a href="crea-tu-historia.html" class="btn-secondary" style="padding:0.75rem 1.4rem;">📚 Ver todas las historias</a>
              </div>
              <div style="margin-top:1.5rem; padding-top:1.25rem; border-top:1px solid rgba(255,255,255,0.12); display:flex; flex-direction:column; align-items:center; gap:0.65rem; text-align:center;">
                <p style="font-size:0.88rem; color:var(--text-secondary); margin:0; max-width:480px; line-height:1.5;">
                  ☕ <strong>¿Has disfrutado de la aventura?</strong> Apoya este proyecto independiente invitando a un café al creador para inspirar nuevas tramas y misterios.
                </p>
                <a href="https://www.paypal.com/donate/?hosted_button_id=V8PZNYKGXBCLG&locale.x=es_ES"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="btn-paypal-donate"
                   title="Invitar a un café con PayPal"
                   style="display:inline-flex; align-items:center; gap:0.5rem; padding:0.6rem 1.3rem; border-radius:9999px; background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color:#0b0f19; font-weight:800; font-size:0.85rem; text-decoration:none; box-shadow:0 4px 16px rgba(245, 158, 11, 0.35); transition:all 0.2s ease;">
                  <span>☕ Invitar a un café</span>
                  <span>➜</span>
                </a>
              </div>
            </div>
          \`;
        } else if (node.opciones && node.opciones.length > 0) {
          const buttons = node.opciones.map((opt) => \`
            <button class="decision-button" onclick="app.selectOption('\${opt.destinoId}')">
              <div class="decision-button-content">
                \${opt.impacto ? \`<span class="decision-badge">\${opt.impacto}</span>\` : ''}
                <div>\${opt.texto}</div>
              </div>
              <span class="decision-arrow">➜</span>
            </button>
          \`).join('');

          optionsHtml = \`
            <div class="decisions-container">
              <div class="decisions-heading">
                <span>🧭 ¿Qué decides hacer?</span>
              </div>
              \${buttons}
            </div>
          \`;
        }

        root.innerHTML = \`
          <div class="reader-wrapper">
            <div style="margin-bottom:1rem;">
              <a href="crea-tu-historia.html" class="btn-secondary" style="font-size:0.82rem;">
                ← Volver a Todas las Historias
              </a>
            </div>

            <div class="reader-progress-container">
              <div style="display:flex; align-items:center; gap:0.5rem;">
                \${this.historyTrail.length > 1 && !isEnding ? \`
                  <button class="btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.78rem;" onclick="app.goBack()">
                    <span>←</span> <span>Atrás</span>
                  </button>
                \` : \`
                  <span style="font-size:0.82rem; color:var(--text-muted);">🧭 Lectura</span>
                \`}
              </div>
              <div class="progress-bar-track">
                <div class="progress-bar-fill" style="width: \${percentage}%;"></div>
              </div>
              <div style="display:flex; align-items:center; gap:0.6rem;">
                <span style="font-size:0.8rem; color:var(--text-muted);">
                  \${isEnding ? 'Final alcanzado' : \`Paso \${stepCount}\`}
                </span>
                <button class="btn-secondary" style="padding:0.3rem 0.5rem; font-size:0.78rem;" title="Reiniciar" onclick="app.restartStory()">↺</button>
              </div>
            </div>

            <div class="reader-node-card">
              \${nodeImage ? \`
                <div class="reader-image-container">
                  <img src="\${nodeImage}" alt="\${node.titulo || this.currentStory.titulo}" class="reader-image">
                  <div class="reader-image-gradient"></div>
                </div>
              \` : ''}

              <div class="reader-body">
                \${node.titulo ? \`<h1 class="reader-node-title">\${node.titulo}</h1>\` : ''}
                <div class="reader-text">
                  \${this.formatText(node.texto)}
                </div>
                \${optionsHtml}
              </div>
            </div>
          </div>
        \`;
      },

      fireConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = [];
        const colors = ['#10b981', '#34d399', '#ffffff', '#f59e0b', '#fbbf24'];

        for (let i = 0; i < 70; i++) {
          pieces.push({
            x: canvas.width / 2,
            y: canvas.height * 0.6,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.8) * 14,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            vRot: (Math.random() - 0.5) * 10
          });
        }

        let animationFrame;
        let count = 0;

        function update() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          pieces.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.35;
            p.rotation += p.vRot;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
          });

          count++;
          if (count < 140) {
            animationFrame = requestAnimationFrame(update);
          } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        }

        update();
      }
    };

    document.addEventListener('DOMContentLoaded', () => {
      app.init();
    });
  </script>
  <script src="js/cookie-banner.js"></script>
</body>
</html>`;
}

const allStories = [faro, abadia];

allStories.forEach(story => {
  const storyFileOut = path.join(__dirname, '..', `historia-${story.slug}.html`);
  fs.writeFileSync(storyFileOut, generateIndividualStoryHtml(story), 'utf8');
});


// ==========================================================
// 6. GENERATE DESVARIOS-RETRO.HTML (ARCADE & RETRO GAMES)
// ==========================================================
const retroHtmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Desvaríos Retro — Juegos Clásicos, Arcade de los 80s y Puzles | TusDesvarios.com</title>
  <meta name="description" content="Juega gratis a clásicos del arcade y minijuegos de ingenio retro: El Ahorcado Desvariado con temáticas góticas y sci-fi, puzles lógicos y más en TusDesvarios.com.">
  <meta name="keywords" content="desvarios retro, juegos retro online, el ahorcado online, juegos arcade clasicos, juegos de palabras gratis, minijuegos navegador, tus desvarios">
  
  <!-- Canonical & SEO -->
  <link rel="canonical" href="https://tusdesvarios.com/desvarios-retro.html">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Desvaríos Retro — Sala Arcade & Juegos Clásicos | Tus Desvaríos">
  <meta property="og:description" content="Juegos arcade de los 80s y puzles de ingenio retro. Juega gratis a El Ahorcado y reta a tu mente.">
  <meta property="og:url" content="https://tusdesvarios.com/desvarios-retro.html">
  <meta property="og:image" content="images/categories/desvarios-retro.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Desvaríos Retro — Sala Arcade y Juegos Clásicos">
  <meta name="twitter:description" content="Juegos de palabras, lógica y arcade con estética synthwave y efectos 8-bit. ¡Juega gratis en tu navegador!">
  <meta name="twitter:image" content="images/categories/desvarios-retro.jpg">

  <!-- Schema.org ItemList, BreadcrumbList & FAQPage -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Colección de Juegos Retro y Arcade",
    "description": "Catálogo de juegos clásicos de palabras, puzles lógicos y acción arcade de Tus Desvaríos.",
    "numberOfItems": 6,
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "El Ahorcado Desvariado", "url": "https://tusdesvarios.com/juego-el-ahorcado.html" },
      { "@type": "ListItem", "position": 2, "name": "Snake Cyberpunk 2084", "url": "https://tusdesvarios.com/juego-snake-cyberpunk.html" },
      { "@type": "ListItem", "position": 3, "name": "Buscaminas Desvariado", "url": "https://tusdesvarios.com/juego-buscaminas.html" },
      { "@type": "ListItem", "position": 4, "name": "Tres en Raya Imposible (IA Minimax)", "url": "https://tusdesvarios.com/juego-tres-en-raya.html" },
      { "@type": "ListItem", "position": 5, "name": "Rompebloques Neón (Dimensión Cósmica)", "url": "https://tusdesvarios.com/juego-rompebloques.html" },
      { "@type": "ListItem", "position": 6, "name": "Invasores del Espacio (Defensa Cósmica)", "url": "https://tusdesvarios.com/juego-invasores.html" }
    ]
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://tusdesvarios.com" },
      { "@type": "ListItem", "position": 2, "name": "Desvaríos Retro", "item": "https://tusdesvarios.com/desvarios-retro.html" }
    ]
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Qué es la sección Desvaríos Retro de TusDesvarios.com?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Es un salón arcade digital que rinde homenaje a los juegos clásicos de los años 80 y 90, combinando mecánicas retro nostálgicas con temáticas literarias, de ciencia ficción y efectos de sonido 8-bit sintetizados."
        }
      },
      {
        "@type": "Question",
        "name": "¿Es necesario descargar o pagar para jugar al Ahorcado?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Todos los juegos de Desvaríos Retro se ejecutan 100% en el navegador, son totalmente gratuitos, sin necesidad de registro ni publicidad invasiva."
        }
      }
    ]
  }
  </script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-main: #0b0f19;
      --bg-surface: rgba(18, 24, 38, 0.78);
      --bg-surface-elevated: rgba(26, 34, 52, 0.88);
      --bg-surface-hover: rgba(34, 45, 68, 0.95);
      --bg-glass: rgba(12, 17, 28, 0.85);

      --border-subtle: rgba(255, 255, 255, 0.12);
      --border-medium: rgba(255, 255, 255, 0.22);
      --border-focus: rgba(168, 85, 247, 0.5);

      --text-primary: #f8fafc;
      --text-secondary: #cbd5e1;
      --text-muted: #94a3b8;

      --accent-purple: #a855f7;
      --accent-cyan: #06b6d4;
      --accent-amber: #f59e0b;
      --accent-emerald: #10b981;
      --accent-pink: #ec4899;

      --font-display: 'Cinzel', serif;
      --font-reading: 'Crimson Pro', Georgia, serif;
      --font-ui: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 22px;
      --radius-full: 9999px;

      --shadow-subtle: 0 4px 24px rgba(0, 0, 0, 0.4);
      --shadow-elevated: 0 16px 40px rgba(0, 0, 0, 0.55);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-main);
      color: var(--text-primary);
      font-family: var(--font-ui);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background: 
        radial-gradient(ellipse 95% 55% at 50% -12%, rgba(168, 85, 247, 0.28) 0%, transparent 65%),
        radial-gradient(circle 500px at 10% 30%, rgba(6, 182, 212, 0.22) 0%, transparent 60%),
        radial-gradient(circle 550px at 90% 40%, rgba(245, 158, 11, 0.20) 0%, transparent 60%),
        linear-gradient(180deg, #0e1322 0%, #0a0e1a 50%, #060911 100%);
      pointer-events: none;
      z-index: -1;
    }

    a, button {
      cursor: pointer;
      color: inherit;
      text-decoration: none;
      font-family: inherit;
      border: none;
      background: none;
    }

    .app-container {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    ${getHeaderCss()}

    .main-content {
      flex: 1;
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
      padding: 2rem 1.25rem 5rem;
    }

    .breadcrumb-nav {
      margin-bottom: 1.5rem;
    }

    .breadcrumb-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      color: var(--text-muted);
      transition: color 0.2s ease;
    }

    .breadcrumb-link:hover {
      color: var(--text-primary);
    }

    .hero-section {
      text-align: center;
      padding: 2rem 1rem 2.75rem;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-full);
      background: rgba(168, 85, 247, 0.12);
      border: 1px solid rgba(168, 85, 247, 0.35);
      color: #c084fc;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 1.25rem;
    }

    .hero-title {
      font-family: var(--font-display);
      font-size: clamp(2.2rem, 5.5vw, 3.4rem);
      font-weight: 900;
      letter-spacing: 0.04em;
      line-height: 1.15;
      margin-bottom: 0.85rem;
    }

    .hero-description {
      font-size: 1.05rem;
      line-height: 1.6;
      color: var(--text-secondary);
      max-width: 620px;
      margin: 0 auto;
    }

    .cat-filters-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
      margin-bottom: 2rem;
    }

    .cat-filter-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.5rem 1rem;
      border-radius: var(--radius-full);
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary);
      transition: all 0.2s ease;
    }

    .cat-filter-btn:hover {
      background: var(--bg-surface-hover);
      color: var(--text-primary);
      border-color: var(--border-medium);
      transform: translateY(-1px);
    }

    .cat-filter-btn-active {
      background: rgba(168, 85, 247, 0.15);
      border-color: rgba(168, 85, 247, 0.5);
      color: #c084fc;
      box-shadow: 0 0 16px rgba(168, 85, 247, 0.2);
    }

    .cat-filter-count {
      font-size: 0.72rem;
      background: rgba(255, 255, 255, 0.08);
      padding: 0.1rem 0.45rem;
      border-radius: var(--radius-full);
    }

    .tests-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.75rem;
      margin-top: 1.25rem;
    }

    .test-card {
      position: relative;
      border-radius: var(--radius-lg);
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      padding: 2rem 1.65rem;
      display: flex;
      flex-direction: column;
      gap: 0.95rem;
      box-shadow: var(--shadow-subtle);
      transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .test-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-elevated), 0 0 30px var(--card-glow, rgba(168, 85, 247, 0.2));
      border-color: var(--card-accent, var(--accent-purple));
    }

    .test-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .test-card-icon {
      font-size: 2.2rem;
    }

    .test-card-type-tag {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-full);
      background: rgba(168, 85, 247, 0.15);
      border: 1px solid rgba(168, 85, 247, 0.3);
      color: #c084fc;
    }

    .test-card-title {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1.3;
      color: #fff;
    }

    .test-card-desc {
      font-size: 0.88rem;
      line-height: 1.6;
      color: var(--text-secondary);
      flex: 1;
    }

    .test-card-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.78rem;
      color: var(--text-muted);
      border-top: 1px solid var(--border-subtle);
      padding-top: 0.85rem;
    }

    .test-card-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      padding: 0.65rem 1.1rem;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
      color: #fff;
      font-size: 0.88rem;
      font-weight: 600;
      transition: all 0.2s ease;
      box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);
    }

    .test-card-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(168, 85, 247, 0.5);
    }

    .site-footer {
      margin-top: auto;
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      padding: 1.5rem 1.25rem;
      text-align: center;
      font-size: 0.82rem;
      color: var(--text-muted);
    }
    .footer-legal-links {
      margin-top: 0.75rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.65rem 0.85rem;
      font-size: 0.82rem;
    }
    .footer-legal-links a {
      color: var(--text-secondary, #cbd5e1);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .footer-legal-links a:hover {
      color: #c084fc;
      text-decoration: underline;
    }
    .footer-separator {
      color: var(--border-medium, rgba(255, 255, 255, 0.22));
      font-size: 0.75rem;
      user-select: none;
    }

  </style>
  <!-- Supabase SDK v2 & Desvarios Client -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/supabase-client.js"></script>
</head>
<body>
  <div class="app-container">
    ${getHeaderHtml('retro')}

    <!-- Main Content Area -->
    <main class="main-content" id="app-root">
      <!-- Injected via retroApp -->
    </main>

    <!-- Footer -->
    <!-- Pie de Página Unificado -->
  <footer class="site-footer">
    <p>© 2026 TusDesvarios.com — Portal de Entretenimiento, Ficción y Ocio Interactivo</p>
    <div class="footer-legal-links">
      <a href="aviso-legal.html">Aviso Legal</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-privacidad.html">Política de Privacidad</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-cookies.html">Política de Cookies</a>
    </div>
  </footer>
  </div>

  <script>
    const GAMES_DB = [
      {
        id: 'el-ahorcado',
        slug: 'el-ahorcado',
        titulo: 'El Ahorcado Desvariado',
        subtitulo: 'Descifra la palabra oculta antes de que el cadalso de neón reclame tu alma',
        descripcionCorta: 'El clásico juego del ahorcado con estética retro arcade, efectos de sonido 8-bit, 6 categorías temáticas y cientos de palabras misteriosas.',
        icono: '🔤',
        categoria: 'palabras',
        categoriaLabel: 'Palabras & Letras',
        tiempoMin: 3,
        color: '#a855f7',
        portada: 'images/games/portada_ahorcado.jpg',
        disponible: true,
        url: 'juego-el-ahorcado.html'
      },
      {
        id: 'snake-cyberpunk',
        slug: 'snake-cyberpunk',
        titulo: 'Snake Cyberpunk 2084',
        subtitulo: 'Conduce a la serpiente de neón a través de portales y anomalías de datos',
        descripcionCorta: 'La mítica serpiente arcade en una cuadrícula synthwave futurista con multiplicadores de velocidad y obstáculos dinámicos.',
        icono: '🐍',
        categoria: 'arcade',
        categoriaLabel: 'Acción Arcade',
        tiempoMin: 5,
        color: '#10b981',
        portada: 'images/games/portada_snake.jpg',
        disponible: true,
        url: 'juego-snake-cyberpunk.html'
      },
      {
        id: 'buscaminas',
        slug: 'buscaminas',
        titulo: 'Buscaminas Desvariado',
        subtitulo: 'Desactiva anomalías dimensionales usando pura lógica y deducción',
        descripcionCorta: 'El legendario puzle de banderas y números con modos clásicos, temporizador digital, sonido 8-bit y selector de dificultad.',
        icono: '💣',
        categoria: 'logica',
        categoriaLabel: 'Lógica & Tablero',
        tiempoMin: 4,
        color: '#f59e0b',
        portada: 'images/games/portada_buscaminas.jpg',
        disponible: true,
        url: 'juego-buscaminas.html'
      },
      {
        id: 'tres-en-raya-imposible',
        slug: 'tres-en-raya-imposible',
        titulo: 'Tres en Raya Imposible (IA Minimax)',
        subtitulo: '¿Serás capaz de vencer a la inteligencia artificial invencible?',
        descripcionCorta: 'Desafía a un motor matemático imbatible o juega contra un amigo en local en una pantalla retro pixel.',
        icono: '❌',
        categoria: 'tablero',
        categoriaLabel: 'Lógica & Tablero',
        tiempoMin: 2,
        color: '#06b6d4',
        portada: 'images/games/portada_tres_en_raya.jpg',
        disponible: true,
        url: 'juego-tres-en-raya.html'
      },
      {
        id: 'rompebloques-neon',
        slug: 'rompebloques-neon',
        titulo: 'Rompebloques Neón (Dimensión Cósmica)',
        subtitulo: 'Destruye barreras dimensionales y recolecta cápsulas de energía cósmica',
        descripcionCorta: 'El clásico rompebloques arcade reinventado con estética synthwave neón, física dinámica a 60 FPS, múltiples niveles, power-ups y sonido 8-bit.',
        icono: '🧱',
        categoria: 'arcade',
        categoriaLabel: 'Acción Arcade',
        tiempoMin: 4,
        color: '#ec4899',
        portada: 'images/games/portada_rompebloques.jpg',
        disponible: true,
        url: 'juego-rompebloques.html'
      },
      {
        id: 'invasores-del-espacio',
        slug: 'invasores-del-espacio',
        titulo: 'Invasores del Espacio (Defensa Cósmica)',
        subtitulo: 'Defiende la órbita terrestre de hordas alienígenas con tu cañón de plasma',
        descripcionCorta: 'El legendario matamarcianos retro arcade reinventado con 60 FPS, estética synthwave neón, búnkeres destructibles, nave nodriza misteriosa y sonido 8-bit.',
        icono: '👾',
        categoria: 'arcade',
        categoriaLabel: 'Acción Arcade',
        tiempoMin: 4,
        color: '#06b6d4',
        portada: 'images/games/portada_invasores.jpg',
        disponible: true,
        url: 'juego-invasores.html'
      }
    ];

    const retroApp = {
      selectedCategory: 'all',

      init() {
        this.renderCatalog();
      },

      filterCategory(catId) {
        this.selectedCategory = catId;
        this.renderCatalog();
      },

      renderCatalog() {
        const root = document.getElementById('app-root');
        const categories = [
          { id: 'all', label: '🌟 Todos los Juegos' },
          { id: 'palabras', label: '🔤 Palabras & Letras' },
          { id: 'logica', label: '🧩 Lógica & Tablero' },
          { id: 'arcade', label: '🕹️ Acción Arcade' }
        ];

        const filterButtonsHtml = categories.map(cat => {
          const count = cat.id === 'all'
            ? GAMES_DB.length
            : GAMES_DB.filter(g => cat.id === 'logica' ? (g.categoria === 'logica' || g.categoria === 'tablero') : g.categoria === cat.id).length;
          const isActive = this.selectedCategory === cat.id;

          return \`
            <button class="cat-filter-btn \${isActive ? 'cat-filter-btn-active' : ''}" onclick="retroApp.filterCategory('\${cat.id}')">
              <span>\${cat.label}</span>
              <span class="cat-filter-count">\${count}</span>
            </button>
          \`;
        }).join('');

        const filteredList = GAMES_DB.filter(g => {
          if (this.selectedCategory === 'all') return true;
          if (this.selectedCategory === 'logica') return g.categoria === 'logica' || g.categoria === 'tablero';
          return g.categoria === this.selectedCategory;
        });

        const cardsHtml = filteredList.map(g => {
          const isLive = g.disponible;
          const badgeText = isLive ? '🟢 Disponible' : '⏳ Próximamente';

          return \`
            <article class="test-card" style="--card-accent:\${g.color}; cursor:\${isLive ? 'pointer' : 'default'}; opacity:\${isLive ? 1 : 0.82}; overflow:hidden;" \${isLive ? \`onclick="location.href='\${g.url}'"\` : ''}>
              \${g.portada ? \`
                <div style="position:relative; width:100%; height:155px; border-radius:10px; overflow:hidden; margin-bottom:1rem; border:1px solid rgba(255,255,255,0.12); box-shadow:0 4px 16px rgba(0,0,0,0.35);">
                  <img src="\${g.portada}" alt="Portada de \${g.titulo}" style="width:100%; height:100%; object-fit:cover; display:block;" loading="lazy">
                  <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(11,15,25,0.7) 0%, transparent 60%); pointer-events:none;"></div>
                </div>
              \` : ''}
              <div class="test-card-header">
                <span class="test-card-icon">\${g.icono}</span>
                <span class="test-card-type-tag" style="background:\${isLive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'}; color:\${isLive ? '#34d399' : '#fbbf24'}; border:1px solid \${isLive ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.35)'};">
                  \${badgeText}
                </span>
              </div>
              <h2 class="test-card-title">\${g.titulo}</h2>
              <p class="test-card-desc">\${g.descripcionCorta}</p>
              <div class="test-card-meta">
                <span>⏱ \${g.tiempoMin} min</span>
                <span>\${g.categoriaLabel}</span>
              </div>
              \${isLive ? \`
                <a href="\${g.url}" class="test-card-btn" style="text-decoration:none; display:flex; align-items:center; justify-content:center; gap:0.45rem;">
                  <span>Jugar Ahora</span>
                  <span>➜</span>
                </a>
              \` : \`
                <div class="test-card-btn" style="background:rgba(255,255,255,0.05); color:var(--text-muted); border:1px solid var(--border-subtle); cursor:not-allowed; box-shadow:none;">
                  <span>En Desarrollo</span>
                </div>
              \`}
            </article>
          \`;
        }).join('');

        root.innerHTML = \`
          <div class="catalog-container">
            <div class="breadcrumb-nav">
              <a href="index.html" class="breadcrumb-link">
                <span>←</span> <span>Volver a Tus Desvaríos</span>
              </a>
            </div>

            <section class="hero-section">
              <div class="hero-badge">🕹️ Salón Arcade & Clásicos de Ingenio</div>
              <h1 class="hero-title">Desvaríos Retro</h1>
              <p class="hero-description">
                Minijuegos nostálgicos, desafíos de palabras, puzles de tablero y clásicos arcade de los 80s y 90s reinventados con estética synthwave y efectos 8-bit.
              </p>

              <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:0.85rem; margin-top:1.5rem;">
                <span class="cat-badge" style="--cat-accent:#a855f7; --cat-glow:rgba(168,85,247,0.2); font-size:0.8rem; padding:0.35rem 0.8rem; border-radius:9999px; border:1px solid rgba(168,85,247,0.3); background:rgba(168,85,247,0.1); color:#c084fc;">
                  🕹️ 100% Gratis en Navegador
                </span>
                <span class="cat-badge" style="--cat-accent:#06b6d4; --cat-glow:rgba(6,182,212,0.2); font-size:0.8rem; padding:0.35rem 0.8rem; border-radius:9999px; border:1px solid rgba(6,182,212,0.3); background:rgba(6,182,212,0.1); color:#38bdf8;">
                  🔊 Efectos de Sonido 8-Bit
                </span>
                <span class="cat-badge" style="--cat-accent:#10b981; --cat-glow:rgba(16,185,129,0.2); font-size:0.8rem; padding:0.35rem 0.8rem; border-radius:9999px; border:1px solid rgba(16,185,129,0.3); background:rgba(16,185,129,0.1); color:#34d399;">
                  ⚡ Guarda tus Récords
                </span>
              </div>
            </section>

            <div class="cat-filters-wrap">
              \${filterButtonsHtml}
            </div>

            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem; padding-bottom:0.75rem; border-bottom:1px solid var(--border-subtle);">
              <h2 style="font-size:1.15rem; font-weight:600;">
                \${this.selectedCategory === 'all' ? 'Máquinas Arcade Disponibles' : categories.find(c => c.id === this.selectedCategory)?.label}
              </h2>
              <span style="font-size:0.82rem; color:var(--text-muted);">\${filteredList.length} \${filteredList.length === 1 ? 'juego' : 'juegos'}</span>
            </div>

            <div class="tests-grid">
              \${cardsHtml}
            </div>

            <!-- SEO Educational Guide -->
            <section style="margin-top:4rem; padding:2.5rem 1.75rem; background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:var(--radius-lg);">
              <div style="text-align:center; max-width:680px; margin:0 auto 2.5rem;">
                <h2 style="font-size:1.45rem; font-weight:700; margin-bottom:0.75rem; color:#fff; font-family:var(--font-display);">
                  Explora las Salas de Juego Arcade
                </h2>
                <p style="font-size:0.92rem; color:var(--text-secondary); line-height:1.6;">
                  Revive la magia de las recreativas clásicas adaptadas a cualquier dispositivo:
                </p>
              </div>

              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.5rem;">
                <div style="padding:1.25rem; background:rgba(255, 255, 255, 0.03); border-radius:var(--radius-md); border:1px solid rgba(168, 85, 247, 0.25);">
                  <div style="font-size:1.5rem; margin-bottom:0.5rem;">🔤</div>
                  <h3 style="font-size:1.05rem; font-weight:700; color:#c084fc; margin-bottom:0.4rem; font-family:var(--font-display);">Palabras & Letras</h3>
                  <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.5;">Desafíos léxicos como El Ahorcado con temáticas oscuras, literatura fantástica y cine de culto para poner a prueba tu vocabulario.</p>
                </div>

                <div style="padding:1.25rem; background:rgba(255, 255, 255, 0.03); border-radius:var(--radius-md); border:1px solid rgba(6, 182, 212, 0.25);">
                  <div style="font-size:1.5rem; margin-bottom:0.5rem;">🧩</div>
                  <h3 style="font-size:1.05rem; font-weight:700; color:#38bdf8; margin-bottom:0.4rem; font-family:var(--font-display);">Lógica & Tablero</h3>
                  <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.5;">Puzles matemáticos como 2048, Buscaminas cuántico y retos tácticos de ajedrez rápido para exprimir tu agilidad mental.</p>
                </div>

                <div style="padding:1.25rem; background:rgba(255, 255, 255, 0.03); border-radius:var(--radius-md); border:1px solid rgba(168, 85, 247, 0.25);">
                  <div style="font-size:1.5rem; margin-bottom:0.5rem;">🕹️</div>
                  <h3 style="font-size:1.05rem; font-weight:700; color:#34d399; margin-bottom:0.4rem; font-family:var(--font-display);">Acción Arcade</h3>
                  <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.5;">Reflejos rápidos y adrenalina de los 80s con versiones modernizadas de la clásica serpiente Snake y arcades retro.</p>
                </div>
              </div>
            </section>

            <!-- SEO FAQ Accordion -->
            <section style="margin-top:3.5rem; padding:2.5rem 1.75rem; background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-lg);">
              <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1.5rem;">
                <span style="font-size:1.5rem;">❓</span>
                <h2 style="font-size:1.35rem; font-weight:700; color:#fff; font-family:var(--font-display);">Preguntas Frecuentes sobre Desvaríos Retro</h2>
              </div>

              <div style="display:flex; flex-direction:column; gap:1.25rem;">
                <details style="background:rgba(255, 255, 255, 0.03); padding:1rem 1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle); cursor:pointer;">
                  <summary style="font-weight:600; color:#f1f5f9; font-size:0.98rem;">¿Puedo jugar con mi teclado físico o solo en pantalla táctil?</summary>
                  <p style="margin-top:0.75rem; font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">Todos los juegos están diseñados con soporte dual: si juegas en un ordenador, puedes teclear directamente con tu teclado físico; si juegas desde un móvil o tableta, dispones de un teclado virtual cómodo y adaptado.</p>
                </details>

                <details style="background:rgba(255, 255, 255, 0.03); padding:1rem 1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle); cursor:pointer;">
                  <summary style="font-weight:600; color:#f1f5f9; font-size:0.98rem;">¿Cómo funcionan los efectos de sonido retro?</summary>
                  <p style="margin-top:0.75rem; font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">Utilizamos la Web Audio API del navegador para sintetizar ondas cuadradas y arpegios de 8-bit en tiempo real. No descargan archivos de audio pesados y puedes silenciarlos en cualquier instante con el botón de volumen.</p>
                </details>
              </div>
            </section>
          </div>
        \`;
      }
    };

    document.addEventListener('DOMContentLoaded', () => {
      retroApp.init();
    });
  </script>
  <script src="js/cookie-banner.js"></script>
</body>
</html>
`;

// Save retro catalog
const retroOut = path.join(__dirname, '..', 'desvarios-retro.html');
fs.writeFileSync(retroOut, retroHtmlContent, 'utf8');

// ==========================================================
// 7. GENERATE JUEGO-EL-AHORCADO.HTML (INTERACTIVE STANDALONE HANGMAN GAME)
// ==========================================================
function generateHangmanHtml(gameData) {
  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'El Ahorcado Desvariado',
    description: gameData.descripcionCorta,
    url: 'https://tusdesvarios.com/juego-el-ahorcado.html',
    genre: ['Word Game', 'Puzzle', 'Retro Arcade'],
    playMode: 'SinglePlayer',
    applicationCategory: 'Game',
    inLanguage: 'es',
    image: 'https://tusdesvarios.com/images/games/portada_ahorcado.jpg',
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
        name: 'El Ahorcado',
        item: 'https://tusdesvarios.com/juego-el-ahorcado.html'
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>El Ahorcado Desvariado — Juego Arcade Retro | TusDesvarios.com</title>
  <meta name="description" content="${gameData.descripcionCorta}">
  <meta name="keywords" content="el ahorcado, juego del ahorcado gratis, ahorcado retro arcade, juegos de palabras, minijuegos online, tus desvarios">
  
  <!-- Canonical & Open Graph / SEO -->
  <link rel="canonical" href="https://tusdesvarios.com/juego-el-ahorcado.html">
  <meta property="og:type" content="website">
  <meta property="og:title" content="El Ahorcado Desvariado — Juego Arcade Retro | Tus Desvaríos">
  <meta property="og:description" content="${gameData.descripcionCorta}">
  <meta property="og:url" content="https://tusdesvarios.com/juego-el-ahorcado.html">
  <meta property="og:image" content="images/games/portada_ahorcado.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="El Ahorcado Desvariado — Minijuego Retro Gratis">
  <meta name="twitter:description" content="${gameData.descripcionCorta}">
  <meta name="twitter:image" content="images/games/portada_ahorcado.jpg">

  <!-- Schema.org VideoGame & Breadcrumb structured data -->
  <script type="application/ld+json">
${JSON.stringify(gameSchema, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(breadcrumbSchema, null, 2)}
  </script>

    <!-- Favicon & Touch Icons -->
  <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="images/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-main: #0b0f19;
      --bg-surface: rgba(18, 24, 38, 0.78);
      --bg-surface-elevated: rgba(26, 34, 52, 0.88);
      --bg-surface-hover: rgba(34, 45, 68, 0.95);
      --bg-glass: rgba(12, 17, 28, 0.85);

      --border-subtle: rgba(255, 255, 255, 0.12);
      --border-medium: rgba(255, 255, 255, 0.22);
      --border-focus: rgba(168, 85, 247, 0.5);

      --text-primary: #f8fafc;
      --text-secondary: #cbd5e1;
      --text-muted: #94a3b8;

      --accent-purple: #a855f7;
      --accent-cyan: #06b6d4;
      --accent-amber: #f59e0b;
      --accent-green: #10b981;

      --font-ui: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-title: 'Cinzel', Georgia, serif;
      --font-reading: 'Crimson Pro', Georgia, serif;

      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --radius-full: 9999px;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-ui);
      background-color: var(--bg-main);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      line-height: 1.5;
      background-image: 
        radial-gradient(at 15% 15%, rgba(168, 85, 247, 0.14) 0px, transparent 45%),
        radial-gradient(at 85% 20%, rgba(6, 182, 212, 0.12) 0px, transparent 50%),
        radial-gradient(at 50% 85%, rgba(245, 158, 11, 0.08) 0px, transparent 55%);
      background-attachment: fixed;
      overflow-x: hidden;
    }

    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      width: 100%;
    }

    ${getHeaderCss()}

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.85rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-secondary:hover {
      background: var(--bg-surface-hover);
      border-color: var(--border-medium);
      color: var(--text-primary);
    }

    .main-content {
      flex: 1;
      max-width: 840px;
      width: 100%;
      margin: 0 auto;
      padding: 2rem 1.25rem 4rem;
    }

    .cat-filter-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-full);
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .cat-filter-btn:hover {
      background: var(--bg-surface-hover);
      color: #fff;
    }

    .cat-filter-btn-active {
      background: rgba(168, 85, 247, 0.18);
      border-color: rgba(168, 85, 247, 0.5);
      color: #c084fc;
      box-shadow: 0 0 14px rgba(168, 85, 247, 0.2);
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.4rem;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
      color: #fff;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);
      transition: all 0.2s ease;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 22px rgba(168, 85, 247, 0.6);
    }

    .site-footer {
      margin-top: auto;
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      padding: 1.5rem 1.25rem;
      text-align: center;
      font-size: 0.82rem;
      color: var(--text-muted);
    }
    .footer-legal-links {
      margin-top: 0.75rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.65rem 0.85rem;
      font-size: 0.82rem;
    }
    .footer-legal-links a {
      color: var(--text-secondary, #cbd5e1);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .footer-legal-links a:hover {
      color: #c084fc;
      text-decoration: underline;
    }
    .footer-separator {
      color: var(--border-medium, rgba(255, 255, 255, 0.22));
      font-size: 0.75rem;
      user-select: none;
    }


    #confetti-canvas {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 999;
      width: 100%;
      height: 100%;
    }
  </style>
  <!-- Supabase SDK v2 & Desvarios Client -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/supabase-client.js"></script>
</head>
<body>
  <canvas id="confetti-canvas"></canvas>

  <div class="app-container">
    ${getHeaderHtml('retro')}

    <!-- Main Content Area -->
    <main class="main-content" id="app-root">
      <!-- Injected via hangmanApp -->
    </main>

    <!-- Footer -->
    <!-- Pie de Página Unificado -->
  <footer class="site-footer">
    <p>© 2026 TusDesvarios.com — Portal de Entretenimiento, Ficción y Ocio Interactivo</p>
    <div class="footer-legal-links">
      <a href="aviso-legal.html">Aviso Legal</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-privacidad.html">Política de Privacidad</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-cookies.html">Política de Cookies</a>
    </div>
  </footer>
  </div>

  <script>
    const GAME_DATA = ${JSON.stringify(gameData)};

    const hangmanApp = {
      selectedCategory: 'all',
      difficulty: 'normal',
      currentWordObj: null,
      guessedLetters: new Set(),
      clueRevealed: false,
      soundEnabled: true,
      streak: 0,
      bestStreak: 0,
      score: 0,
      gameStatus: 'playing',
      audioCtx: null,

      init() {
        try {
          const saved = localStorage.getItem('tusdesvarios_ahorcado_best');
          if (saved) this.bestStreak = parseInt(saved, 10);
        } catch (e) {}

        this.pickNewWord();
        this.setupKeyboardListeners();
      },

      playSynth(type) {
        if (!this.soundEnabled) return;
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          if (!this.audioCtx) this.audioCtx = new AudioCtx();
          if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

          const now = this.audioCtx.currentTime;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          if (type === 'hit') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(587.33, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
          } else if (type === 'miss') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.linearRampToValueAtTime(110, now + 0.22);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
          } else if (type === 'win') {
            const notes = [523.25, 659.25, 783.99, 1046.5];
            notes.forEach((freq, idx) => {
              const o = this.audioCtx.createOscillator();
              const g = this.audioCtx.createGain();
              o.connect(g);
              g.connect(this.audioCtx.destination);
              o.type = 'square';
              o.frequency.setValueAtTime(freq, now + idx * 0.1);
              g.gain.setValueAtTime(0.15, now + idx * 0.1);
              g.gain.linearRampToValueAtTime(0.01, now + idx * 0.1 + 0.18);
              o.start(now + idx * 0.1);
              o.stop(now + idx * 0.1 + 0.18);
            });
          } else if (type === 'lose') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.linearRampToValueAtTime(80, now + 0.5);
            gain.gain.setValueAtTime(0.22, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.55);
            osc.start(now);
            osc.stop(now + 0.55);
          } else if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
          }
        } catch (e) {}
      },

      pickNewWord(catId = this.selectedCategory, diff = this.difficulty) {
        this.selectedCategory = catId;
        this.difficulty = diff;

        let pool = GAME_DATA.palabras;
        if (catId !== 'all') {
          pool = pool.filter(w => w.categoria === catId);
        }
        if (pool.length === 0) pool = GAME_DATA.palabras;

        this.currentWordObj = pool[Math.floor(Math.random() * pool.length)];
        this.guessedLetters = new Set();
        this.clueRevealed = false;
        this.gameStatus = 'playing';
        this.render();
      },

      getMaxErrors() {
        return this.difficulty === 'facil' ? 8 : this.difficulty === 'normal' ? 6 : 4;
      },

      getCleanWord() {
        if (!this.currentWordObj) return '';
        return this.currentWordObj.palabra.toUpperCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
      },

      guessLetter(letter) {
        if (this.gameStatus !== 'playing' || !this.currentWordObj) return;
        const upper = letter.toUpperCase();
        if (this.guessedLetters.has(upper)) return;

        this.guessedLetters.add(upper);
        const cleanWord = this.getCleanWord();

        if (cleanWord.includes(upper)) {
          this.playSynth('hit');
          const wordLetters = new Set(cleanWord.split('').filter(c => /[A-ZÑ]/.test(c)));
          const allFound = Array.from(wordLetters).every(l => this.guessedLetters.has(l));
          if (allFound) {
            this.gameStatus = 'won';
            this.playSynth('win');
            this.fireConfetti();
            if (window.DesvariosAuth) {
              window.DesvariosAuth.unlockMedal('ahorcado-sabio');
            }
            const wrongCount = Array.from(this.guessedLetters).filter(l => !cleanWord.includes(l)).length;
            const errorsLeft = Math.max(0, this.getMaxErrors() - wrongCount);
            const pointsEarned = (errorsLeft + 1) * 50 * (this.difficulty === 'dificil' ? 2 : this.difficulty === 'normal' ? 1.5 : 1);
            this.score += Math.round(pointsEarned);
            this.streak++;
            if (this.streak > this.bestStreak) {
              this.bestStreak = this.streak;
              try {
                localStorage.setItem('tusdesvarios_ahorcado_best', this.streak.toString());
              } catch (e) {}
            }
          }
        } else {
          this.playSynth('miss');
          const wrongCount = Array.from(this.guessedLetters).filter(l => !cleanWord.includes(l)).length;
          if (wrongCount >= this.getMaxErrors()) {
            this.gameStatus = 'lost';
            this.playSynth('lose');
            this.streak = 0;
          }
        }

        this.render();
      },

      revealClue() {
        this.clueRevealed = true;
        this.playSynth('click');
        this.render();
      },

      toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.playSynth('click');
        this.render();
      },

      setupKeyboardListeners() {
        window.addEventListener('keydown', (e) => {
          if (e.ctrlKey || e.metaKey || e.altKey) return;
          const key = e.key.toUpperCase();
          if (/^[A-ZÑ]$/.test(key)) {
            hangmanApp.guessLetter(key);
          }
        });
      },

      render() {
        const root = document.getElementById('app-root');
        if (!this.currentWordObj) return;

        const cleanWord = this.getCleanWord();
        const wrongGuesses = Array.from(this.guessedLetters).filter(l => !cleanWord.includes(l));
        const maxErrors = this.getMaxErrors();
        const errorsLeft = Math.max(0, maxErrors - wrongGuesses.length);
        const catInfo = GAME_DATA.categorias.find(c => c.id === this.currentWordObj.categoria);

        const rows = [
          ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
          ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
          ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
        ];

        const keyboardHtml = rows.map(row => {
          const keysHtml = row.map(letter => {
            const isGuessed = this.guessedLetters.has(letter);
            const isCorrect = isGuessed && cleanWord.includes(letter);
            const isWrong = isGuessed && !cleanWord.includes(letter);
            const disabled = isGuessed || this.gameStatus !== 'playing';

            let bg = 'rgba(255, 255, 255, 0.05)';
            let border = 'rgba(255, 255, 255, 0.15)';
            let color = 'var(--text-primary)';
            let shadow = 'none';

            if (isCorrect) {
              bg = 'rgba(16, 185, 129, 0.25)';
              border = 'rgba(52, 211, 153, 0.5)';
              color = '#34d399';
              shadow = '0 0 10px rgba(52, 211, 153, 0.3)';
            } else if (isWrong) {
              bg = 'rgba(239, 68, 68, 0.15)';
              border = 'rgba(239, 68, 68, 0.4)';
              color = 'rgba(248, 113, 113, 0.5)';
            }

            return \`
              <button
                \${disabled ? 'disabled' : ''}
                onclick="hangmanApp.guessLetter('\${letter}')"
                style="width:clamp(28px, 8vw, 44px); height:clamp(38px, 9vw, 48px); border-radius:var(--radius-sm); font-weight:700; font-size:0.95rem; font-family:monospace; cursor:\${disabled ? 'not-allowed' : 'pointer'}; border:1px solid \${border}; background:\${bg}; color:\${color}; opacity:\${isWrong ? 0.4 : 1}; box-shadow:\${shadow}; display:flex; align-items:center; justify-content:center; transition:all 0.15s ease;"
              >
                \${letter}
              </button>
            \`;
          }).join('');

          return \`<div style="display:flex; gap:0.35rem; justify-content:center; width:100%;">\${keysHtml}</div>\`;
        }).join('');

        const wordDisplayHtml = cleanWord.split('').map(char => {
          const isGuessed = this.guessedLetters.has(char);
          const isRevealedOnLoss = this.gameStatus === 'lost';
          const showChar = isGuessed || isRevealedOnLoss;
          const color = isGuessed ? '#34d399' : isRevealedOnLoss ? '#f87171' : '#fff';
          const border = isGuessed ? '#34d399' : isRevealedOnLoss ? '#f87171' : 'rgba(255, 255, 255, 0.4)';

          return \`
            <div style="width:38px; height:48px; border-bottom:3px solid \${border}; display:flex; align-items:center; justify-content:center; font-size:1.6rem; font-weight:800; font-family:monospace; color:\${color}; text-shadow:\${isGuessed ? '0 0 10px rgba(52, 211, 153, 0.6)' : 'none'};">
              \${showChar ? char : ''}
            </div>
          \`;
        }).join('');

        const isHead = wrongGuesses.length >= (maxErrors === 4 ? 1 : maxErrors === 6 ? 1 : 2);
        const isTorso = wrongGuesses.length >= (maxErrors === 4 ? 2 : maxErrors === 6 ? 2 : 4);
        const isArmL = wrongGuesses.length >= (maxErrors === 4 ? 3 : maxErrors === 6 ? 3 : 5);
        const isArmR = wrongGuesses.length >= (maxErrors === 4 ? 3 : maxErrors === 6 ? 4 : 6);
        const isLegL = wrongGuesses.length >= (maxErrors === 4 ? 4 : maxErrors === 6 ? 5 : 7);
        const isLegR = wrongGuesses.length >= maxErrors;

        root.innerHTML = \`
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.8rem;">
              <a href="desvarios-retro.html" class="breadcrumb-link">
                <span>←</span> <span>Volver a Desvaríos Retro</span>
              </a>

              <div style="display:flex; align-items:center; gap:0.75rem;">
                <div style="display:inline-flex; align-items:center; gap:0.35rem; padding:0.3rem 0.75rem; border-radius:var(--radius-full); background:rgba(245, 158, 11, 0.12); border:1px solid rgba(245, 158, 11, 0.3); color:#fbbf24; font-size:0.82rem; font-weight:700;">
                  🏆 <span>\${this.score} Puntos</span>
                </div>
                <div style="display:inline-flex; align-items:center; gap:0.35rem; padding:0.3rem 0.75rem; border-radius:var(--radius-full); background:\${this.streak > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)'}; border:\${this.streak > 0 ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid var(--border-subtle)'}; color:\${this.streak > 0 ? '#f87171' : 'var(--text-muted)'}; font-size:0.82rem; font-weight:700;">
                  🔥 <span>Racha: \${this.streak}</span> \${this.bestStreak > 0 ? \`<span style="opacity:0.7; font-size:0.75rem;">(Récord: \${this.bestStreak})</span>\` : ''}
                </div>
                <button onclick="hangmanApp.toggleSound()" class="btn-secondary" style="padding:0.3rem 0.6rem;" title="\${this.soundEnabled ? 'Silenciar' : 'Activar sonido'}">
                  \${this.soundEnabled ? '🔊' : '🔇'}
                </button>
              </div>
            </div>

            <div style="background:var(--bg-surface); border:1px solid rgba(168, 85, 247, 0.35); border-radius:var(--radius-lg); padding:2rem 1.5rem; box-shadow:0 12px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(168, 85, 247, 0.15); position:relative;">
              <!-- Categories and Difficulty Bar -->
              <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:0.75rem; padding-bottom:1.25rem; border-bottom:1px solid var(--border-subtle); margin-bottom:1.5rem;">
                <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                  <span style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Temática:</span>
                  <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
                    <button class="cat-filter-btn \${this.selectedCategory === 'all' ? 'cat-filter-btn-active' : ''}" onclick="hangmanApp.pickNewWord('all', '\${this.difficulty}')">
                      🎲 Aleatorio
                    </button>
                    \${GAME_DATA.categorias.map(c => \`
                      <button class="cat-filter-btn \${this.selectedCategory === c.id ? 'cat-filter-btn-active' : ''}" onclick="hangmanApp.pickNewWord('\${c.id}', '\${this.difficulty}')">
                        <span>\${c.icono}</span> <span>\${c.nombre.split(' ')[0]}</span>
                      </button>
                    \`).join('')}
                  </div>
                </div>

                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Vidas:</span>
                  <div style="display:flex; gap:0.3rem;">
                    \${['facil', 'normal', 'dificil'].map(d => {
                      const isActive = this.difficulty === d;
                      const color = d === 'facil' ? '#34d399' : d === 'normal' ? '#fbbf24' : '#f87171';
                      return \`
                        <button onclick="hangmanApp.pickNewWord('\${this.selectedCategory}', '\${d}')" style="font-size:0.78rem; padding:0.25rem 0.65rem; border-radius:var(--radius-full); background:\${isActive ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)'}; color:\${isActive ? color : 'var(--text-muted)'}; border:1px solid \${isActive ? color : 'var(--border-subtle)'}; font-weight:700; cursor:pointer;">
                          \${d.toUpperCase()}
                        </button>
                      \`;
                    }).join('')}
                  </div>
                </div>
              </div>

              <div style="text-align:center; margin-bottom:1.25rem;">
                <span class="hero-badge" style="background:rgba(168, 85, 247, 0.12); border-color:rgba(168, 85, 247, 0.35); color:#c084fc; font-size:0.78rem; padding:0.25rem 0.75rem;">
                  \${catInfo ? \`\${catInfo.icono} \${catInfo.nombre}\` : '🎲 Categoría Variada'}
                </span>
              </div>

              <!-- Gallow Graphic -->
              <div style="display:flex; justify-content:center; align-items:center; margin-bottom:1.75rem;">
                <div style="width:240px; height:190px; background:rgba(0, 0, 0, 0.45); border-radius:var(--radius-md); border:1px solid rgba(168, 85, 247, 0.25); position:relative; display:flex; align-items:center; justify-content:center;">
                  <svg viewBox="0 0 200 180" width="200" height="180" style="filter:drop-shadow(0 0 8px rgba(168, 85, 247, 0.5));">
                    <line x1="20" y1="160" x2="180" y2="160" stroke="#a855f7" stroke-width="4" stroke-linecap="round" />
                    <line x1="60" y1="160" x2="60" y2="20" stroke="#a855f7" stroke-width="4" stroke-linecap="round" />
                    <line x1="58" y1="20" x2="135" y2="20" stroke="#a855f7" stroke-width="4" stroke-linecap="round" />
                    <line x1="60" y1="50" x2="90" y2="20" stroke="#a855f7" stroke-width="3" />
                    <line x1="135" y1="20" x2="135" y2="45" stroke="#fbbf24" stroke-width="3" stroke-dasharray="3 2" />

                    \${isHead ? '<circle cx="135" cy="60" r="14" stroke="#06b6d4" stroke-width="3.5" fill="rgba(6, 182, 212, 0.15)" />' : ''}
                    \${isTorso ? '<line x1="135" y1="74" x2="135" y2="115" stroke="#06b6d4" stroke-width="3.5" stroke-linecap="round" />' : ''}
                    \${isArmL ? '<line x1="135" y1="85" x2="112" y2="102" stroke="#06b6d4" stroke-width="3.5" stroke-linecap="round" />' : ''}
                    \${isArmR ? '<line x1="135" y1="85" x2="158" y2="102" stroke="#06b6d4" stroke-width="3.5" stroke-linecap="round" />' : ''}
                    \${isLegL ? '<line x1="135" y1="115" x2="115" y2="148" stroke="#06b6d4" stroke-width="3.5" stroke-linecap="round" />' : ''}
                    \${isLegR ? '<line x1="135" y1="115" x2="155" y2="148" stroke="#06b6d4" stroke-width="3.5" stroke-linecap="round" />' : ''}

                    \${this.gameStatus === 'lost' ? \`
                      <line x1="129" y1="56" x2="133" y2="60" stroke="#f87171" stroke-width="2" />
                      <line x1="133" y1="56" x2="129" y2="60" stroke="#f87171" stroke-width="2" />
                      <line x1="137" y1="56" x2="141" y2="60" stroke="#f87171" stroke-width="2" />
                      <line x1="141" y1="56" x2="137" y2="60" stroke="#f87171" stroke-width="2" />
                    \` : ''}
                  </svg>
                  <div style="position:absolute; bottom:8px; right:10px; font-size:0.75rem; color:\${errorsLeft <= 2 ? '#f87171' : 'var(--text-muted)'}; font-weight:700; font-family:monospace;">
                    Vidas: \${errorsLeft} / \${maxErrors}
                  </div>
                </div>
              </div>

              <!-- Word display -->
              <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:0.6rem; margin:1.5rem 0 2rem; min-height:60px;">
                \${wordDisplayHtml}
              </div>

              <!-- Clue Section -->
              <div style="text-align:center; margin-bottom:1.5rem;">
                \${this.clueRevealed ? \`
                  <div style="display:inline-flex; align-items:center; gap:0.5rem; padding:0.55rem 1rem; border-radius:var(--radius-md); background:rgba(245, 158, 11, 0.12); border:1px solid rgba(245, 158, 11, 0.35); color:#fde68a; font-size:0.88rem; max-width:90%; margin:0 auto;">
                    <span>💡</span> <span><strong>Pista:</strong> \${this.currentWordObj.pista}</span>
                  </div>
                \` : \`
                  <button onclick="hangmanApp.revealClue()" class="btn-secondary" style="font-size:0.82rem; padding:0.4rem 0.85rem;">
                    <span>💡</span> <span>Pedir Pista</span>
                  </button>
                \`}
              </div>

              <!-- End Game Banner -->
              \${this.gameStatus !== 'playing' ? \`
                <div style="padding:1.5rem; border-radius:var(--radius-md); background:\${this.gameStatus === 'won' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)' : 'rgba(239, 68, 68, 0.15)'}; border:1px solid \${this.gameStatus === 'won' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}; text-align:center; margin-bottom:1.75rem;">
                  <div style="font-size:1.8rem; margin-bottom:0.35rem;">
                    \${this.gameStatus === 'won' ? '🎉 ¡VICTORIA ARCADE!' : '💀 ¡EL CADALSO RECLAMA TU ALMA!'}
                  </div>
                  <h3 style="font-size:1.1rem; font-weight:700; color:\${this.gameStatus === 'won' ? '#34d399' : '#f87171'}; margin-bottom:0.5rem;">
                    \${this.gameStatus === 'won' ? \`¡Has descifrado "\${cleanWord}" con éxito!\` : \`La palabra secreta era: "\${cleanWord}"\`}
                  </h3>
                  \${this.currentWordObj.curiosidad ? \`
                    <p style="font-size:0.88rem; color:var(--text-secondary); max-width:580px; margin:0 auto 1.25rem; line-height:1.5;">
                      💡 <strong>Dato curioso:</strong> \${this.currentWordObj.curiosidad}
                    </p>
                  \` : ''}
                  <div style="display:flex; justify-content:center; gap:0.75rem;">
                    <button onclick="hangmanApp.pickNewWord()" class="btn-primary">
                      <span>↺</span> <span>Siguiente Palabra</span>
                    </button>
                  </div>
                </div>
              \` : ''}

              <!-- Virtual Keyboard -->
              <div style="display:flex; flex-direction:column; gap:0.45rem; align-items:center;">
                \${keyboardHtml}
              </div>
            </div>
          </div>
        \`;
      },

      fireConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = [];
        const colors = ['#a855f7', '#06b6d4', '#10b981', '#ffffff', '#f59e0b'];

        for (let i = 0; i < 70; i++) {
          pieces.push({
            x: canvas.width / 2,
            y: canvas.height * 0.6,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.8) * 14,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            vRot: (Math.random() - 0.5) * 10
          });
        }

        let animationFrame;
        let count = 0;

        function update() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          pieces.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.35;
            p.rotation += p.vRot;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
          });

          count++;
          if (count < 140) {
            animationFrame = requestAnimationFrame(update);
          } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        }

        update();
      }
    };

    document.addEventListener('DOMContentLoaded', () => {
      hangmanApp.init();
    });
  </script>
  <script src="js/cookie-banner.js"></script>
</body>
</html>`;
}

// Save standalone Hangman Game
const hangmanOut = path.join(__dirname, '..', 'juego-el-ahorcado.html');
fs.writeFileSync(hangmanOut, generateHangmanHtml(ahorcadoRaw), 'utf8');

// ==========================================================
// 8. GENERATE JUEGO-SNAKE-CYBERPUNK.HTML (INTERACTIVE STANDALONE SNAKE GAME)
// ==========================================================
function generateSnakeHtml() {
  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Snake Cyberpunk 2084',
    description: 'La mítica serpiente arcade en una cuadrícula synthwave futurista con modos de portales, contrarreloj y efectos 8-bit.',
    url: 'https://tusdesvarios.com/juego-snake-cyberpunk.html',
    genre: ['Arcade', 'Action', 'Retro Arcade', 'Snake'],
    playMode: 'SinglePlayer',
    applicationCategory: 'Game',
    inLanguage: 'es',
    image: 'https://tusdesvarios.com/images/games/portada_snake.jpg',
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
        name: 'Snake Cyberpunk 2084',
        item: 'https://tusdesvarios.com/juego-snake-cyberpunk.html'
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Snake Cyberpunk 2084 — Juego Arcade Neón | TusDesvarios.com</title>
  <meta name="description" content="Juega gratis a Snake Cyberpunk 2084: la mítica serpiente arcade reinventada con estética synthwave, portales dimensionales, modo contrarreloj y efectos 8-bit.">
  <meta name="keywords" content="snake cyberpunk, juego de la serpiente gratis, snake online gratis, juegos arcade retro, minijuegos navegador, tus desvarios">
  
  <!-- Canonical & SEO -->
  <link rel="canonical" href="https://tusdesvarios.com/juego-snake-cyberpunk.html">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Snake Cyberpunk 2084 — Juego Arcade de Neón | Tus Desvaríos">
  <meta property="og:description" content="Guía a la serpiente de neón a través de cuadrículas synthwave, portales y nodos cuánticos. ¡Juega gratis en tu navegador!">
  <meta property="og:url" content="https://tusdesvarios.com/juego-snake-cyberpunk.html">
  <meta property="og:image" content="images/games/portada_snake.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Snake Cyberpunk 2084 — Juego Arcade Retro Gratis">
  <meta name="twitter:description" content="El clásico juego de la serpiente con estética neón, portales, contrarreloj y efectos 8-bit.">
  <meta name="twitter:image" content="images/games/portada_snake.jpg">

  <!-- Schema.org VideoGame & Breadcrumb structured data -->
  <script type="application/ld+json">
${JSON.stringify(gameSchema, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(breadcrumbSchema, null, 2)}
  </script>

    <!-- Favicon & Touch Icons -->
  <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="images/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-main: #0b0f19;
      --bg-surface: rgba(18, 24, 38, 0.78);
      --bg-surface-elevated: rgba(26, 34, 52, 0.88);
      --bg-surface-hover: rgba(34, 45, 68, 0.95);
      --bg-glass: rgba(12, 17, 28, 0.85);

      --border-subtle: rgba(255, 255, 255, 0.12);
      --border-medium: rgba(255, 255, 255, 0.22);
      --border-focus: rgba(16, 185, 129, 0.5);

      --text-primary: #f8fafc;
      --text-secondary: #cbd5e1;
      --text-muted: #94a3b8;

      --accent-green: #10b981;
      --accent-cyan: #06b6d4;
      --accent-amber: #f59e0b;
      --accent-purple: #a855f7;

      --font-ui: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-title: 'Cinzel', Georgia, serif;

      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --radius-full: 9999px;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-ui);
      background-color: var(--bg-main);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      line-height: 1.5;
      background-image: 
        radial-gradient(at 15% 15%, rgba(16, 185, 129, 0.14) 0px, transparent 45%),
        radial-gradient(at 85% 20%, rgba(6, 182, 212, 0.12) 0px, transparent 50%),
        radial-gradient(at 50% 85%, rgba(168, 85, 247, 0.08) 0px, transparent 55%);
      background-attachment: fixed;
      overflow-x: hidden;
    }

    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      width: 100%;
    }

    ${getHeaderCss()}

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.85rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-secondary:hover {
      background: var(--bg-surface-hover);
      border-color: var(--border-medium);
      color: var(--text-primary);
    }

    .main-content {
      flex: 1;
      max-width: 840px;
      width: 100%;
      margin: 0 auto;
      padding: 2rem 1.25rem 4rem;
    }

    .breadcrumb-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      color: var(--text-muted);
      text-decoration: none;
      transition: color 0.2s;
    }

    .breadcrumb-link:hover {
      color: var(--text-primary);
    }

    .cat-filter-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-full);
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .cat-filter-btn:hover {
      background: var(--bg-surface-hover);
      color: #fff;
    }

    .cat-filter-btn-active {
      background: rgba(16, 185, 129, 0.18);
      border-color: rgba(16, 185, 129, 0.5);
      color: #34d399;
      box-shadow: 0 0 14px rgba(16, 185, 129, 0.2);
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.4rem;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #fff;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
      transition: all 0.2s ease;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 22px rgba(16, 185, 129, 0.6);
    }

    .site-footer {
      margin-top: auto;
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      padding: 1.5rem 1.25rem;
      text-align: center;
      font-size: 0.82rem;
      color: var(--text-muted);
    }
    .footer-legal-links {
      margin-top: 0.75rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.65rem 0.85rem;
      font-size: 0.82rem;
    }
    .footer-legal-links a {
      color: var(--text-secondary, #cbd5e1);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .footer-legal-links a:hover {
      color: #c084fc;
      text-decoration: underline;
    }
    .footer-separator {
      color: var(--border-medium, rgba(255, 255, 255, 0.22));
      font-size: 0.75rem;
      user-select: none;
    }

  </style>
  <!-- Supabase SDK v2 & Desvarios Client -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/supabase-client.js"></script>
</head>
<body>
  <div class="app-container">
    ${getHeaderHtml('retro')}

    <!-- Main Content Area -->
    <main class="main-content" id="app-root">
      <!-- Injected via snakeApp -->
    </main>

    <!-- Footer -->
    <!-- Pie de Página Unificado -->
  <footer class="site-footer">
    <p>© 2026 TusDesvarios.com — Portal de Entretenimiento, Ficción y Ocio Interactivo</p>
    <div class="footer-legal-links">
      <a href="aviso-legal.html">Aviso Legal</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-privacidad.html">Política de Privacidad</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-cookies.html">Política de Cookies</a>
    </div>
  </footer>
  </div>

  <script>
    const GRID_SIZE = 20;

    const SPEED_CONFIG = {
      cadete: { tickMs: 130, label: '🟢 Cadete (Normal)', color: '#34d399' },
      hacker: { tickMs: 90, label: '🟡 Hacker (Rápido)', color: '#fbbf24' },
      ninja: { tickMs: 60, label: '🔴 Cyber Ninja (Extremo)', color: '#f87171' }
    };

    const snakeApp = {
      gameMode: 'classic', // 'classic', 'portals', 'timed'
      speedMode: 'hacker',
      score: 0,
      highScore: 0,
      snakeLength: 3,
      isPaused: false,
      isGameOver: false,
      soundEnabled: true,
      timeRemaining: 30,
      overclockTicks: 0,

      snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      food: { x: 15, y: 10 },
      bonus: null,
      particles: [],
      audioCtx: null,
      tickTimer: null,
      countdownTimer: null,
      touchStartPos: null,

      init() {
        try {
          const saved = localStorage.getItem('tusdesvarios_snake_highscore');
          if (saved) this.highScore = parseInt(saved, 10);
        } catch (e) {}

        this.renderHtml();
        this.startCanvasLoop();
        this.resetGame();
        this.setupKeyboardListeners();
      },

      playSynth(type) {
        if (!this.soundEnabled) return;
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          if (!this.audioCtx) this.audioCtx = new AudioCtx();
          if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

          const now = this.audioCtx.currentTime;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          if (type === 'eat') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
          } else if (type === 'bonus') {
            const freqs = [523.25, 659.25, 783.99, 1046.5];
            freqs.forEach((f, i) => {
              const o = this.audioCtx.createOscillator();
              const g = this.audioCtx.createGain();
              o.connect(g);
              g.connect(this.audioCtx.destination);
              o.type = 'square';
              o.frequency.setValueAtTime(f, now + i * 0.06);
              g.gain.setValueAtTime(0.12, now + i * 0.06);
              g.gain.linearRampToValueAtTime(0.01, now + i * 0.06 + 0.1);
              o.start(now + i * 0.06);
              o.stop(now + i * 0.06 + 0.1);
            });
          } else if (type === 'powerup') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
          } else if (type === 'crash') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.linearRampToValueAtTime(40, now + 0.35);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
          } else if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(500, now);
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.04);
            osc.start(now);
            osc.stop(now + 0.04);
          }
        } catch (e) {}
      },

      changeDirection(newDir) {
        if (newDir.x !== 0 && this.dir.x !== 0) return;
        if (newDir.y !== 0 && this.dir.y !== 0) return;
        this.nextDir = newDir;
      },

      spawnFood() {
        let newX, newY, collision = true;
        while (collision) {
          newX = Math.floor(Math.random() * GRID_SIZE);
          newY = Math.floor(Math.random() * GRID_SIZE);
          collision = this.snake.some(seg => seg.x === newX && seg.y === newY);
        }
        return { x: newX, y: newY };
      },

      trySpawnBonus() {
        if (this.bonus) return;
        if (Math.random() < 0.28) {
          const type = Math.random() < 0.6 ? 'crystal' : 'overclock';
          let newX, newY, collision = true;
          while (collision) {
            newX = Math.floor(Math.random() * GRID_SIZE);
            newY = Math.floor(Math.random() * GRID_SIZE);
            collision = this.snake.some(seg => seg.x === newX && seg.y === newY) || (this.food.x === newX && this.food.y === newY);
          }
          this.bonus = { x: newX, y: newY, type, timeLeft: 45 };
        }
      },

      addParticles(x, y, color, count = 12) {
        try {
          const canvas = document.getElementById('snake-canvas');
          if (!canvas) return;
          const cellSize = canvas.width / GRID_SIZE;
          const px = (x + 0.5) * cellSize;
          const py = (y + 0.5) * cellSize;

          for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 1.5;
            this.particles.push({
              x: px,
              y: py,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: Math.random() * 4 + 2,
              color,
              alpha: 1,
              decay: Math.random() * 0.03 + 0.02
            });
          }
        } catch (e) {}
      },

      setMode(m) {
        this.gameMode = m;
        this.playSynth('click');
        this.resetGame();
      },

      setSpeed(s) {
        this.speedMode = s;
        this.playSynth('click');
        this.resetGame();
      },

      resetGame() {
        this.snake = [
          { x: 10, y: 10 },
          { x: 9, y: 10 },
          { x: 8, y: 10 }
        ];
        this.dir = { x: 1, y: 0 };
        this.nextDir = { x: 1, y: 0 };
        this.food = { x: 15, y: 10 };
        this.bonus = null;
        this.particles = [];
        this.score = 0;
        this.snakeLength = 3;
        this.isGameOver = false;
        this.isPaused = false;
        this.timeRemaining = 30;
        this.overclockTicks = 0;

        if (this.tickTimer) clearInterval(this.tickTimer);
        if (this.countdownTimer) clearInterval(this.countdownTimer);

        const currentSpeed = SPEED_CONFIG[this.speedMode] || SPEED_CONFIG['hacker'];
        this.tickTimer = setInterval(() => this.gameTick(), currentSpeed.tickMs);

        if (this.gameMode === 'timed') {
          this.countdownTimer = setInterval(() => {
            if (this.isPaused || this.isGameOver) return;
            this.timeRemaining--;
            if (this.timeRemaining <= 0) {
              this.isGameOver = true;
              this.playSynth('crash');
            }
            this.updateStatsUI();
          }, 1000);
        }

        this.updateControlsUI();
        this.updateStatsUI();
        this.renderOverlays();
      },

      updateControlsUI() {
        ['classic', 'portals', 'timed'].forEach(m => {
          const btn = document.getElementById('mode-' + m);
          if (btn) {
            if (this.gameMode === m) {
              btn.className = 'cat-filter-btn cat-filter-btn-active';
              btn.style.background = 'rgba(16, 185, 129, 0.2)';
              btn.style.borderColor = '#34d399';
              btn.style.color = '#34d399';
              btn.style.fontWeight = '700';
            } else {
              btn.className = 'cat-filter-btn';
              btn.style.background = 'rgba(255, 255, 255, 0.04)';
              btn.style.borderColor = 'var(--border-subtle)';
              btn.style.color = 'var(--text-secondary)';
              btn.style.fontWeight = '500';
            }
          }
        });

        ['cadete', 'hacker', 'ninja'].forEach(s => {
          const btn = document.getElementById('speed-' + s);
          if (btn) {
            const conf = SPEED_CONFIG[s];
            if (this.speedMode === s) {
              btn.style.background = 'rgba(255, 255, 255, 0.18)';
              btn.style.color = conf.color;
              btn.style.borderColor = conf.color;
              btn.style.boxShadow = '0 0 10px ' + conf.color + '40';
              btn.style.fontWeight = '700';
            } else {
              btn.style.background = 'rgba(255, 255, 255, 0.04)';
              btn.style.color = 'var(--text-muted)';
              btn.style.borderColor = 'var(--border-subtle)';
              btn.style.boxShadow = 'none';
              btn.style.fontWeight = '500';
            }
          }
        });
      },

      gameTick() {
        if (this.isPaused || this.isGameOver) return;

        try {
          this.dir = this.nextDir;
          const head = this.snake[0];
          let newHead = { x: head.x + this.dir.x, y: head.y + this.dir.y };

          if (this.gameMode === 'portals') {
            if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
            else if (newHead.x >= GRID_SIZE) newHead.x = 0;
            if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
            else if (newHead.y >= GRID_SIZE) newHead.y = 0;
          } else {
            if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
              this.isGameOver = true;
              this.playSynth('crash');
              this.addParticles(head.x, head.y, '#f87171', 20);
              this.renderOverlays();
              return;
            }
          }

          if (this.snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
            this.isGameOver = true;
            this.playSynth('crash');
            this.addParticles(newHead.x, newHead.y, '#f87171', 20);
            this.renderOverlays();
            return;
          }

          const newSnake = [newHead, ...this.snake];

          if (newHead.x === this.food.x && newHead.y === this.food.y) {
            this.playSynth('eat');
            this.addParticles(newHead.x, newHead.y, '#10b981', 14);
            const multiplier = this.overclockTicks > 0 ? 2 : 1;
            this.score += 10 * multiplier;
            if (this.score >= 60 && window.DesvariosAuth) {
              window.DesvariosAuth.unlockMedal('snake-ninja');
            }
            if (this.score > this.highScore) {
              this.highScore = this.score;
              try {
                localStorage.setItem('tusdesvarios_snake_highscore', this.score.toString());
              } catch (e) {}
            }
            this.snakeLength = newSnake.length;
            this.food = this.spawnFood();
            this.trySpawnBonus();
            if (this.gameMode === 'timed') {
              this.timeRemaining = Math.min(60, this.timeRemaining + 3);
            }
            this.updateStatsUI();
          } else {
            newSnake.pop();
          }

          if (this.bonus) {
            if (newHead.x === this.bonus.x && newHead.y === this.bonus.y) {
              if (this.bonus.type === 'crystal') {
                this.playSynth('bonus');
                this.addParticles(newHead.x, newHead.y, '#06b6d4', 20);
                const pts = 50 * (this.overclockTicks > 0 ? 2 : 1);
                this.score += pts;
              } else {
                this.playSynth('powerup');
                this.addParticles(newHead.x, newHead.y, '#f59e0b', 20);
                this.overclockTicks = 50;
              }
              this.bonus = null;
              this.updateStatsUI();
            } else {
              this.bonus.timeLeft--;
              if (this.bonus.timeLeft <= 0) {
                this.bonus = null;
              }
            }
          }

          if (this.overclockTicks > 0) {
            this.overclockTicks--;
          }

          this.snake = newSnake;
        } catch (err) {
          console.error('Snake tick error:', err);
        }
      },

      togglePause() {
        this.isPaused = !this.isPaused;
        this.renderOverlays();
      },

      toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.playSynth('click');
        this.updateStatsUI();
      },

      setupKeyboardListeners() {
        window.addEventListener('keydown', (e) => {
          if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
          }

          switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
              snakeApp.changeDirection({ x: 0, y: -1 });
              break;
            case 'ArrowDown':
            case 's':
            case 'S':
              snakeApp.changeDirection({ x: 0, y: 1 });
              break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
              snakeApp.changeDirection({ x: -1, y: 0 });
              break;
            case 'ArrowRight':
            case 'd':
            case 'D':
              snakeApp.changeDirection({ x: 1, y: 0 });
              break;
            case ' ':
              snakeApp.togglePause();
              break;
          }
        });
      },

      startCanvasLoop() {
        const render = () => {
          const canvas = document.getElementById('snake-canvas');
          if (canvas) {
            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;
            const cellSize = width / GRID_SIZE;

            ctx.fillStyle = '#0a0e1a';
            ctx.fillRect(0, 0, width, height);

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.lineWidth = 1;
            for (let i = 0; i <= GRID_SIZE; i++) {
              ctx.beginPath();
              ctx.moveTo(i * cellSize, 0);
              ctx.lineTo(i * cellSize, height);
              ctx.stroke();

              ctx.beginPath();
              ctx.moveTo(0, i * cellSize);
              ctx.lineTo(width, i * cellSize);
              ctx.stroke();
            }

            if (this.gameMode === 'portals') {
              ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
              ctx.lineWidth = 2;
              ctx.setLineDash([4, 4]);
              ctx.strokeRect(1, 1, width - 2, height - 2);
              ctx.setLineDash([]);
            } else {
              ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
              ctx.lineWidth = 3;
              ctx.strokeRect(0, 0, width, height);
            }

            // Food
            const fx = this.food.x * cellSize + cellSize / 2;
            const fy = this.food.y * cellSize + cellSize / 2;
            const pulse = (cellSize / 2.3) + Math.sin(Date.now() * 0.005) * 1.5;

            ctx.save();
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 12;
            ctx.fillStyle = '#34d399';
            ctx.beginPath();
            ctx.arc(fx, fy, pulse, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(fx, fy, pulse * 0.45, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Bonus
            if (this.bonus) {
              const bx = this.bonus.x * cellSize + cellSize / 2;
              const by = this.bonus.y * cellSize + cellSize / 2;
              const bColor = this.bonus.type === 'crystal' ? '#06b6d4' : '#f59e0b';

              ctx.save();
              ctx.shadowColor = bColor;
              ctx.shadowBlur = 16;
              ctx.fillStyle = bColor;

              if (this.bonus.type === 'crystal') {
                ctx.beginPath();
                ctx.moveTo(bx, by - cellSize / 2.2);
                ctx.lineTo(bx + cellSize / 2.2, by);
                ctx.lineTo(bx, by + cellSize / 2.2);
                ctx.lineTo(bx - cellSize / 2.2, by);
                ctx.closePath();
                ctx.fill();
              } else {
                ctx.beginPath();
                ctx.arc(bx, by, cellSize / 2.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 12px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('⚡', bx, by);
              }

              const progress = this.bonus.timeLeft / 40;
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.arc(bx, by, cellSize / 1.7, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
              ctx.stroke();
              ctx.restore();
            }

            // Snake
            this.snake.forEach((seg, index) => {
              const sx = seg.x * cellSize;
              const sy = seg.y * cellSize;
              const isHead = index === 0;

              ctx.save();
              if (isHead) {
                ctx.shadowColor = this.overclockTicks > 0 ? '#f59e0b' : '#34d399';
                ctx.shadowBlur = 16;
                ctx.fillStyle = this.overclockTicks > 0 ? '#fbbf24' : '#10b981';
                ctx.beginPath();
                ctx.roundRect(sx + 1, sy + 1, cellSize - 2, cellSize - 2, 6);
                ctx.fill();

                ctx.fillStyle = '#0b0f19';
                let eye1X = sx + 5, eye1Y = sy + 5, eye2X = sx + cellSize - 8, eye2Y = sy + 5;
                if (this.dir.x === 1) {
                  eye1X = sx + cellSize - 6; eye2X = sx + cellSize - 6;
                  eye1Y = sy + 4; eye2Y = sy + cellSize - 7;
                } else if (this.dir.x === -1) {
                  eye1X = sx + 4; eye2X = sx + 4;
                  eye1Y = sy + 4; eye2Y = sy + cellSize - 7;
                } else if (this.dir.y === 1) {
                  eye1X = sx + 4; eye2X = sx + cellSize - 7;
                  eye1Y = sy + cellSize - 6; eye2Y = sy + cellSize - 6;
                }
                ctx.beginPath();
                ctx.arc(eye1X, eye1Y, 2.2, 0, Math.PI * 2);
                ctx.arc(eye2X, eye2Y, 2.2, 0, Math.PI * 2);
                ctx.fill();
              } else {
                const ratio = index / this.snake.length;
                const r = Math.round(16 * (1 - ratio) + 6 * ratio);
                const g = Math.round(185 * (1 - ratio) + 182 * ratio);
                const b = Math.round(129 * (1 - ratio) + 212 * ratio);
                ctx.fillStyle = \`rgb(\${r}, \${g}, \${b})\`;
                ctx.shadowColor = \`rgba(\${r}, \${g}, \${b}, 0.5)\`;
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.roundRect(sx + 2, sy + 2, cellSize - 4, cellSize - 4, 4);
                ctx.fill();
              }
              ctx.restore();
            });

            // Particles
            this.particles.forEach((p, idx) => {
              p.x += p.vx;
              p.y += p.vy;
              p.alpha -= p.decay;

              if (p.alpha <= 0) {
                this.particles.splice(idx, 1);
              } else {
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
              }
            });
          }
          requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
      },

      updateStatsUI() {
        const scoreEl = document.getElementById('stat-score');
        const highEl = document.getElementById('stat-highscore');
        const timeEl = document.getElementById('stat-time');
        const soundEl = document.getElementById('btn-sound');
        const overclockEl = document.getElementById('overclock-badge');

        if (scoreEl) scoreEl.innerText = this.score + ' Puntos';
        if (highEl) highEl.innerText = 'Récord: ' + this.highScore;
        if (timeEl) {
          timeEl.style.display = this.gameMode === 'timed' ? 'inline-flex' : 'none';
          timeEl.innerText = '⏱️ ' + this.timeRemaining + 's';
        }
        if (soundEl) soundEl.innerText = this.soundEnabled ? '🔊' : '🔇';
        if (overclockEl) {
          overclockEl.style.display = this.overclockTicks > 0 ? 'block' : 'none';
        }
      },

      renderOverlays() {
        const pauseOverlay = document.getElementById('overlay-pause');
        const gameoverOverlay = document.getElementById('overlay-gameover');
        const finalScoreEl = document.getElementById('final-score-val');
        const finalLengthEl = document.getElementById('final-length-val');

        if (pauseOverlay) {
          pauseOverlay.style.display = (this.isPaused && !this.isGameOver) ? 'flex' : 'none';
        }
        if (gameoverOverlay) {
          gameoverOverlay.style.display = this.isGameOver ? 'flex' : 'none';
          if (finalScoreEl) finalScoreEl.innerText = this.score.toString();
          if (finalLengthEl) finalLengthEl.innerText = this.snakeLength.toString();
        }
      },

      renderHtml() {
        const root = document.getElementById('app-root');
        root.innerHTML = \`
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.8rem;">
              <a href="desvarios-retro.html" class="breadcrumb-link">
                <span>←</span> <span>Volver a Desvaríos Retro</span>
              </a>

              <div style="display:flex; align-items:center; gap:0.75rem;">
                <div id="stat-score" style="display:inline-flex; align-items:center; gap:0.35rem; padding:0.3rem 0.75rem; border-radius:var(--radius-full); background:rgba(16, 185, 129, 0.12); border:1px solid rgba(16, 185, 129, 0.3); color:#34d399; font-size:0.82rem; font-weight:700;">
                  🏆 0 Puntos
                </div>

                <div id="stat-highscore" style="display:inline-flex; align-items:center; gap:0.35rem; padding:0.3rem 0.75rem; border-radius:var(--radius-full); background:rgba(245, 158, 11, 0.12); border:1px solid rgba(245, 158, 11, 0.3); color:#fbbf24; font-size:0.82rem; font-weight:700;">
                  🔥 Récord: 0
                </div>

                <div id="stat-time" style="display:none; align-items:center; gap:0.35rem; padding:0.3rem 0.75rem; border-radius:var(--radius-full); background:rgba(6, 182, 212, 0.12); border:1px solid rgba(6, 182, 212, 0.3); color:#38bdf8; font-size:0.82rem; font-weight:700;">
                  ⏱️ 30s
                </div>

                <button id="btn-sound" onclick="snakeApp.toggleSound()" class="btn-secondary" style="padding:0.3rem 0.6rem;">
                  🔊
                </button>
              </div>
            </div>

            <div style="background:var(--bg-surface); border:1px solid rgba(16, 185, 129, 0.35); border-radius:var(--radius-lg); padding:2rem 1.5rem; box-shadow:0 12px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.15); position:relative;">
              <!-- Mode & Speed Controls -->
              <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:0.75rem; padding-bottom:1.25rem; border-bottom:1px solid var(--border-subtle); margin-bottom:1.5rem;">
                <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                  <span style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Modo:</span>
                  <div style="display:flex; gap:0.35rem;">
                    <button id="mode-classic" onclick="snakeApp.setMode('classic')" class="cat-filter-btn cat-filter-btn-active" style="padding:0.3rem 0.75rem; font-size:0.78rem;">
                      🧱 Clásico (Paredes)
                    </button>
                    <button id="mode-portals" onclick="snakeApp.setMode('portals')" class="cat-filter-btn" style="padding:0.3rem 0.75rem; font-size:0.78rem;">
                      🌀 Portales (Sin Fin)
                    </button>
                    <button id="mode-timed" onclick="snakeApp.setMode('timed')" class="cat-filter-btn" style="padding:0.3rem 0.75rem; font-size:0.78rem;">
                      ⏱️ Sobrecarga (30s)
                    </button>
                  </div>
                </div>

                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Velocidad:</span>
                  <div style="display:flex; gap:0.3rem;">
                    <button id="speed-cadete" onclick="snakeApp.setSpeed('cadete')" style="font-size:0.78rem; padding:0.28rem 0.68rem; border-radius:var(--radius-full); background:rgba(255,255,255,0.04); color:#34d399; border:1px solid var(--border-subtle); font-weight:700; cursor:pointer;">
                      CADETE
                    </button>
                    <button id="speed-hacker" onclick="snakeApp.setSpeed('hacker')" style="font-size:0.78rem; padding:0.28rem 0.68rem; border-radius:var(--radius-full); background:rgba(255,255,255,0.18); color:#fbbf24; border:1.5px solid #fbbf24; box-shadow:0 0 10px #fbbf2440; font-weight:700; cursor:pointer;">
                      HACKER
                    </button>
                    <button id="speed-ninja" onclick="snakeApp.setSpeed('ninja')" style="font-size:0.78rem; padding:0.28rem 0.68rem; border-radius:var(--radius-full); background:rgba(255,255,255,0.04); color:#f87171; border:1px solid var(--border-subtle); font-weight:700; cursor:pointer;">
                      NINJA
                    </button>
                  </div>
                </div>
              </div>

              <!-- Canvas Container -->
              <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative;">
                <div style="position:relative; border-radius:var(--radius-md); overflow:hidden; box-shadow:0 0 25px rgba(16, 185, 129, 0.25); border:2px solid rgba(16, 185, 129, 0.4);">
                  <canvas id="snake-canvas" width="400" height="400" style="display:block; max-width:100%; aspect-ratio:1/1; background:#090d16; cursor:pointer;"></canvas>

                  <div id="overclock-badge" style="display:none; position:absolute; top:10px; left:10px; padding:0.25rem 0.65rem; border-radius:var(--radius-full); background:rgba(245, 158, 11, 0.25); border:1px solid #fbbf24; color:#fbbf24; font-size:0.75rem; font-weight:800;">
                    ⚡ OVERCLOCK X2
                  </div>

                  <!-- Pause Overlay -->
                  <div id="overlay-pause" style="display:none; position:absolute; inset:0; background:rgba(11, 15, 25, 0.85); backdrop-filter:blur(4px); flex-direction:column; align-items:center; justify-content:center; gap:1rem;">
                    <div style="font-size:2rem;">⏸️</div>
                    <h3 style="font-size:1.4rem; font-weight:800; color:#38bdf8;">JUEGO PAUSADO</h3>
                    <button onclick="snakeApp.togglePause()" class="btn-primary">
                      <span>▶</span> <span>Reanudar (Espacio)</span>
                    </button>
                  </div>

                  <!-- Game Over Overlay -->
                  <div id="overlay-gameover" style="display:none; position:absolute; inset:0; background:rgba(11, 15, 25, 0.92); backdrop-filter:blur(6px); flex-direction:column; align-items:center; justify-content:center; padding:1.5rem; text-align:center;">
                    <div style="font-size:2.5rem; margin-bottom:0.5rem;">💥</div>
                    <h3 style="font-size:1.6rem; font-weight:900; color:#f87171; margin-bottom:0.5rem;">SISTEMA COLAPSADO</h3>
                    <p style="font-size:0.95rem; color:var(--text-secondary); margin-bottom:1.25rem;">
                      Puntuación: <strong id="final-score-val" style="color:#34d399;">0</strong> | Longitud: <strong id="final-length-val">0</strong>
                    </p>
                    <button onclick="snakeApp.resetGame()" class="btn-primary">
                      <span>↺</span> <span>Reiniciar Misión</span>
                    </button>
                  </div>
                </div>

                <!-- Controls row -->
                <div style="display:flex; gap:0.75rem; margin-top:1.25rem;">
                  <button onclick="snakeApp.togglePause()" class="btn-secondary" style="font-size:0.85rem;">
                    <span>⏸️</span> <span>Pausar (Espacio)</span>
                  </button>
                  <button onclick="snakeApp.resetGame()" class="btn-secondary" style="font-size:0.85rem;">
                    <span>↺</span> <span>Reiniciar</span>
                  </button>
                </div>

                <!-- Mobile Virtual D-Pad Controller -->
                <div style="margin-top:1.5rem; display:flex; flex-direction:column; align-items:center; gap:0.4rem;">
                  <button onclick="snakeApp.changeDirection({x:0, y:-1})" class="btn-secondary" style="width:56px; height:50px; display:flex; align-items:center; justify-content:center; border-radius:var(--radius-md); background:rgba(255,255,255,0.08); border:1px solid rgba(16,185,129,0.4);" aria-label="Arriba">
                    <span style="font-size:1.5rem; color:#34d399;">▲</span>
                  </button>
                  <div style="display:flex; gap:2.5rem;">
                    <button onclick="snakeApp.changeDirection({x:-1, y:0})" class="btn-secondary" style="width:56px; height:50px; display:flex; align-items:center; justify-content:center; border-radius:var(--radius-md); background:rgba(255,255,255,0.08); border:1px solid rgba(16,185,129,0.4);" aria-label="Izquierda">
                      <span style="font-size:1.5rem; color:#34d399;">◀</span>
                    </button>
                    <button onclick="snakeApp.changeDirection({x:1, y:0})" class="btn-secondary" style="width:56px; height:50px; display:flex; align-items:center; justify-content:center; border-radius:var(--radius-md); background:rgba(255,255,255,0.08); border:1px solid rgba(16,185,129,0.4);" aria-label="Derecha">
                      <span style="font-size:1.5rem; color:#34d399;">▶</span>
                    </button>
                  </div>
                  <button onclick="snakeApp.changeDirection({x:0, y:1})" class="btn-secondary" style="width:56px; height:50px; display:flex; align-items:center; justify-content:center; border-radius:var(--radius-md); background:rgba(255,255,255,0.08); border:1px solid rgba(16,185,129,0.4);" aria-label="Abajo">
                    <span style="font-size:1.5rem; color:#34d399;">▼</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Guide -->
            <section style="margin-top:3.5rem; padding:2rem 1.5rem; background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-lg);">
              <div style="display:flex; align-items:center; gap:0.65rem; margin-bottom:1.25rem;">
                <span style="font-size:1.4rem;">❓</span>
                <h2 style="font-size:1.25rem; font-weight:700; color:#fff;">Guía de Hackeo: Snake Cyberpunk 2084</h2>
              </div>
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1.25rem;">
                <div style="padding:1rem; background:rgba(255,255,255,0.03); border-radius:var(--radius-md);">
                  <div style="font-size:1.2rem; margin-bottom:0.4rem;">🟩 Nodo de Datos</div>
                  <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">Otorga <strong>+10 puntos</strong> y extiende el cuerpo cibernético de tu serpiente en 1 unidad.</p>
                </div>
                <div style="padding:1rem; background:rgba(255,255,255,0.03); border-radius:var(--radius-md);">
                  <div style="font-size:1.2rem; margin-bottom:0.4rem;">💎 Cristal Cuántico</div>
                  <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">Aparición temporal fugaz. Otorga <strong>+50 puntos</strong> antes de que expire su temporizador.</p>
                </div>
                <div style="padding:1rem; background:rgba(255,255,255,0.03); border-radius:var(--radius-md);">
                  <div style="font-size:1.2rem; margin-bottom:0.4rem;">⚡ Modo Overclock</div>
                  <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">Duplica todos los puntos obtenidos durante su periodo de sobrecarga energética.</p>
                </div>
              </div>
            </section>
          </div>
        \`;

        // Add touch listeners
        const canvas = document.getElementById('snake-canvas');
        if (canvas) {
          canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            snakeApp.touchStartPos = { x: touch.clientX, y: touch.clientY };
          }, { passive: true });

          canvas.addEventListener('touchend', (e) => {
            if (!snakeApp.touchStartPos) return;
            const touch = e.changedTouches[0];
            const dx = touch.clientX - snakeApp.touchStartPos.x;
            const dy = touch.clientY - snakeApp.touchStartPos.y;
            if (Math.max(Math.abs(dx), Math.abs(dy)) > 20) {
              if (Math.abs(dx) > Math.abs(dy)) {
                snakeApp.changeDirection({ x: dx > 0 ? 1 : -1, y: 0 });
              } else {
                snakeApp.changeDirection({ x: 0, y: dy > 0 ? 1 : -1 });
              }
            }
            snakeApp.touchStartPos = null;
          }, { passive: true });
        }
      }
    };

    document.addEventListener('DOMContentLoaded', () => {
      snakeApp.init();
    });
  </script>
  <script src="js/cookie-banner.js"></script>
</body>
</html>`;
}

// Save standalone Snake Game
const snakeOut = path.join(__dirname, '..', 'juego-snake-cyberpunk.html');
fs.writeFileSync(snakeOut, generateSnakeHtml(), 'utf8');

// ==========================================================
// 7B. GENERATE JUEGO-BUSCAMINAS.HTML
function generateBuscaminasHtml() {
  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Buscaminas Desvariado',
    description: 'El legendario puzle de banderas y números con modos clásicos, temporizador digital, sonido 8-bit y selector de dificultad.',
    url: 'https://tusdesvarios.com/juego-buscaminas.html',
    genre: ['Puzzle', 'Logic', 'Retro Arcade', 'Minesweeper'],
    playMode: 'SinglePlayer',
    applicationCategory: 'Game',
    inLanguage: 'es',
    image: 'https://tusdesvarios.com/images/games/portada_buscaminas.jpg',
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
        name: 'Buscaminas Desvariado',
        item: 'https://tusdesvarios.com/juego-buscaminas.html'
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Buscaminas Desvariado — Puzle Lógico Retro Gratis | TusDesvarios.com</title>
  <meta name="description" content="Juega gratis al legendario Buscaminas con estética retro arcade, primer clic seguro garantizado, tres dificultades, efectos de sonido 8-bit y récords.">
  <meta name="keywords" content="buscaminas gratis, buscaminas online gratis, juegos clasicos retro, puzles logicos navegador, minesweeper online, tus desvarios">
  
  <link rel="canonical" href="https://tusdesvarios.com/juego-buscaminas.html">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Buscaminas Desvariado — El Clásico de Lógica Retro | Tus Desvaríos">
  <meta property="og:description" content="Desactiva minas con pura lógica deductiva en una consola arcade retro. ¡Juega gratis en tu navegador!">
  <meta property="og:url" content="https://tusdesvarios.com/juego-buscaminas.html">
  <meta property="og:image" content="images/games/portada_buscaminas.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Buscaminas Desvariado — Juego Arcade Retro Gratis">
  <meta name="twitter:description" content="El mítico Buscaminas con modos principiante, intermedio y experto, sonido 8-bit y cronómetro.">
  <meta name="twitter:image" content="images/games/portada_buscaminas.jpg">

  <script type="application/ld+json">
${JSON.stringify(gameSchema, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(breadcrumbSchema, null, 2)}
  </script>

  <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="images/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>

  <style>
    :root {
      --bg-main: #0a0d14;
      --bg-surface: #121722;
      --bg-surface-hover: #182030;
      --border-subtle: rgba(255, 255, 255, 0.08);
      --border-medium: rgba(255, 255, 255, 0.16);
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --text-muted: #64748b;
      --accent-amber: #f59e0b;
      --accent-emerald: #10b981;
      --accent-cyan: #06b6d4;

      --font-ui: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-title: 'Cinzel', Georgia, serif;

      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --radius-full: 9999px;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-ui);
      background-color: var(--bg-main);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      line-height: 1.5;
      background-image: 
        radial-gradient(at 15% 15%, rgba(245, 158, 11, 0.12) 0px, transparent 45%),
        radial-gradient(at 85% 20%, rgba(16, 185, 129, 0.1) 0px, transparent 50%),
        radial-gradient(at 50% 85%, rgba(6, 182, 212, 0.08) 0px, transparent 55%);
      background-attachment: fixed;
      overflow-x: hidden;
    }

    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      width: 100%;
    }

    ${getHeaderCss()}

    .main-content {
      flex: 1;
      max-width: 1080px;
      width: 100%;
      margin: 0 auto;
      padding: 1.5rem 1.25rem 4rem;
    }

    .breadcrumb-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      color: var(--text-muted);
      text-decoration: none;
      transition: color 0.2s;
    }
    .breadcrumb-link:hover {
      color: var(--text-primary);
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      padding: 0.65rem 1.4rem;
      border-radius: var(--radius-sm);
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: #000;
      font-weight: 700;
      font-size: 0.88rem;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35);
      transition: all 0.2s ease;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.5);
    }

    .site-footer {
      margin-top: auto;
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      padding: 1.5rem 1.25rem;
      text-align: center;
      font-size: 0.82rem;
      color: var(--text-muted);
    }
    .footer-legal-links {
      margin-top: 0.75rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.65rem 0.85rem;
      font-size: 0.82rem;
    }
    .footer-legal-links a {
      color: var(--text-secondary, #cbd5e1);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .footer-legal-links a:hover {
      color: #c084fc;
      text-decoration: underline;
    }
    .footer-separator {
      color: var(--border-medium, rgba(255, 255, 255, 0.22));
      font-size: 0.75rem;
      user-select: none;
    }

  </style>
  <!-- Supabase SDK v2 & Desvarios Client -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/supabase-client.js"></script>
</head>
<body>
  <div class="app-container">
    ${getHeaderHtml('retro')}

    <!-- Main Content -->
    <main class="main-content">
      <div class="breadcrumb-nav" style="margin-bottom: 1.25rem;">
        <a href="desvarios-retro.html" class="breadcrumb-link">
          <span>←</span> <span>Volver a Desvaríos Retro</span>
        </a>
      </div>

      <header style="text-align: center; margin-bottom: 1.75rem;">
        <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.9rem; background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 9999px; color: #fbbf24; font-size: 0.82rem; font-weight: 700; margin-bottom: 0.75rem;">
          <span>💣</span>
          <span>Desafío de Lógica Deductiva</span>
        </div>
        <h1 style="font-family: var(--font-title); font-size: clamp(2rem, 4vw, 2.75rem); font-weight: 900; letter-spacing: 0.04em; margin-bottom: 0.5rem; background: linear-gradient(135deg, #fff 40%, #fbbf24 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          Buscaminas Desvariado
        </h1>
        <p style="color: var(--text-secondary); font-size: 0.95rem; max-width: 580px; margin: 0 auto;">
          Desactiva todas las anomalías de la cuadrícula. Clic izquierdo para explorar, clic derecho o botón táctil para marcar banderas.
        </p>
      </header>

      <!-- Controls Bar -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.25rem; padding: 0.75rem 1.25rem; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: 12px;">
        <div id="diff-buttons-container" style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
          <button id="diff-facil" onclick="app.setDifficulty('facil')" style="padding: 0.45rem 0.9rem; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; border: 1.5px solid #34d399; background: rgba(52, 211, 153, 0.15); color: #34d399; box-shadow: 0 0 15px rgba(52, 211, 153, 0.2);">
            Principiante
          </button>
          <button id="diff-medio" onclick="app.setDifficulty('medio')" style="padding: 0.45rem 0.9rem; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); color: var(--text-secondary);">
            Intermedio
          </button>
          <button id="diff-dificil" onclick="app.setDifficulty('dificil')" style="padding: 0.45rem 0.9rem; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); color: var(--text-secondary);">
            Experto
          </button>
        </div>

        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div id="record-display" style="display: none; align-items: center; gap: 0.35rem; font-size: 0.8rem; color: #fbbf24; background: rgba(245, 158, 11, 0.12); padding: 0.3rem 0.65rem; border-radius: 6px; border: 1px solid rgba(245, 158, 11, 0.3);">
            <span>🏆</span> <span id="record-text">Récord: --</span>
          </div>

          <button id="btn-sound-toggle" onclick="app.toggleSound()" style="padding: 0.45rem 0.75rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); background: rgba(16, 185, 129, 0.15); color: #34d399; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.82rem; font-weight: 600;">
            <span>🔊 Sonido ON</span>
          </button>
        </div>
      </div>

      <!-- Arcade Box -->
      <div style="margin: 0 auto; padding: 1.25rem; border-radius: 16px; background: linear-gradient(180deg, #181c24 0%, #0d1117 100%); border: 2px solid rgba(245, 158, 11, 0.35); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6), 0 0 35px rgba(245, 158, 11, 0.12); display: flex; flex-direction: column; align-items: center;">
        
        <!-- Displays Bar (Windows 95 LED Style) -->
        <div id="arcade-bar" style="width: 100%; max-width: 360px; margin-bottom: 1rem; padding: 0.75rem 1.25rem; background: linear-gradient(180deg, #222734 0%, #171b26 100%); border-radius: 10px; border: 2px solid #333d4e; display: flex; align-items: center; justify-content: space-between; box-shadow: inset 0 2px 6px rgba(0,0,0,0.6);">
          <div id="led-mines" style="background: #0a0d14; border: 2px solid #202738; border-radius: 6px; padding: 0.35rem 0.65rem; font-family: monospace; font-size: 1.5rem; font-weight: 900; color: #ef4444; letter-spacing: 0.1em; min-width: 72px; text-align: center; box-shadow: inset 0 0 10px rgba(239, 68, 68, 0.3); text-shadow: 0 0 8px rgba(239, 68, 68, 0.7);" title="Minas restantes">
            010
          </div>

          <button id="face-btn" onclick="app.resetGame()" title="Reiniciar partida" style="width: 46px; height: 46px; border-radius: 50%; font-size: 1.6rem; background: linear-gradient(145deg, #333d4e, #202633); border: 2px solid #fbbf24; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.4), 0 0 15px rgba(245, 158, 11, 0.3);">
            🙂
          </button>

          <div id="led-timer" style="background: #0a0d14; border: 2px solid #202738; border-radius: 6px; padding: 0.35rem 0.65rem; font-family: monospace; font-size: 1.5rem; font-weight: 900; color: #ef4444; letter-spacing: 0.1em; min-width: 72px; text-align: center; box-shadow: inset 0 0 10px rgba(239, 68, 68, 0.3); text-shadow: 0 0 8px rgba(239, 68, 68, 0.7);" title="Tiempo en segundos">
            000
          </div>
        </div>

        <!-- Mobile Tool Switcher -->
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.85rem;">
          <button id="tool-dig" type="button" onclick="app.setMobileTool('dig')" style="padding: 0.4rem 0.85rem; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem; border: 1.5px solid #38bdf8; background: rgba(56, 189, 248, 0.2); color: #38bdf8; box-shadow: 0 0 14px rgba(56, 189, 248, 0.3);">
            <span>⛏️</span> <span>Descubrir</span>
          </button>
          <button id="tool-flag" type="button" onclick="app.setMobileTool('flag')" style="padding: 0.4rem 0.85rem; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: var(--text-secondary);">
            <span>🚩</span> <span>Poner Bandera</span>
          </button>
        </div>

        <!-- Scrollable Board Container -->
        <div style="max-width: 100%; overflow-x: auto; padding: 0.5rem; background: #12161f; border-radius: 10px; border: 2px solid #232a38; box-shadow: inset 0 4px 15px rgba(0,0,0,0.5);">
          <div id="board-grid" style="display: grid; gap: 2px; user-select: none; touch-action: manipulation;">
            <!-- Rendered by JS -->
          </div>
        </div>

        <!-- Victory / Defeat Message Box -->
        <div id="status-banner" style="display: none; margin-top: 1.25rem; padding: 1rem 1.5rem; border-radius: 12px; max-width: 460px; width: 100%; text-align: center; backdrop-filter: blur(8px);">
          <!-- Injected via JS -->
        </div>
      </div>

      <!-- Instructions Section -->
      <section style="margin-top: 2.5rem; padding: 1.5rem; border-radius: 12px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-subtle);">
        <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 0.85rem; display: flex; align-items: center; gap: 0.45rem; color: #fbbf24;">
          <span>❓</span> <span>¿Cómo jugar al Buscaminas?</span>
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; font-size: 0.86rem; color: var(--text-secondary); line-height: 1.6;">
          <div>
            <strong style="color: #fff;">🎯 Objetivo:</strong> Descubrir todas las casillas seguras sin pisar ninguna mina oculta en el tablero.
          </div>
          <div>
            <strong style="color: #fff;">🛡️ Primer Clic Seguro:</strong> Tu primera casilla siempre estará despejada y abrirá una zona inicial cómoda.
          </div>
          <div>
            <strong style="color: #fff;">🔢 Los Números:</strong> Cada número indica cuántas minas hay en las 8 casillas circundantes (adyacentes).
          </div>
          <div>
            <strong style="color: #fff;">🚩 Banderas:</strong> Usa el botón derecho del ratón o el modo bandera en móvil para señalar las casillas donde sospechas que hay minas.
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <!-- Pie de Página Unificado -->
  <footer class="site-footer">
    <p>© 2026 TusDesvarios.com — Portal de Entretenimiento, Ficción y Ocio Interactivo</p>
    <div class="footer-legal-links">
      <a href="aviso-legal.html">Aviso Legal</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-privacidad.html">Política de Privacidad</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-cookies.html">Política de Cookies</a>
    </div>
  </footer>
  </div>

  <script>
    const NUMBER_COLORS = {
      1: '#38bdf8',
      2: '#4ade80',
      3: '#f87171',
      4: '#818cf8',
      5: '#fb923c',
      6: '#2dd4bf',
      7: '#e879f9',
      8: '#cbd5e1'
    };

    const DIFFICULTIES = {
      facil: { name: 'Principiante', rows: 9, cols: 9, mines: 10, maxWidth: '360px', color: '#34d399' },
      medio: { name: 'Intermedio', rows: 16, cols: 16, mines: 40, maxWidth: '540px', color: '#fbbf24' },
      dificil: { name: 'Experto', rows: 16, cols: 30, mines: 99, maxWidth: '920px', color: '#f87171' }
    };

    const app = {
      difficulty: 'facil',
      grid: [],
      isStarted: false,
      isGameOver: false,
      isVictory: false,
      timer: 0,
      timerInterval: null,
      flagsCount: 0,
      soundEnabled: true,
      mobileTool: 'dig',
      audioCtx: null,

      init() {
        this.updateRecordDisplay();
        this.resetGame();
      },

      playSound(type) {
        if (!this.soundEnabled) return;
        try {
          const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
          if (!this.audioCtx) {
            this.audioCtx = new AudioCtxClass();
          }
          if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
          }
          const ctx = this.audioCtx;
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
          } else if (type === 'flag') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.setValueAtTime(880, now + 0.04);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
          } else if (type === 'cascade') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(350, now);
            osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
          } else if (type === 'explode') {
            const bufferSize = ctx.sampleRate * 0.4;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
              data[i] = Math.random() * 2 - 1;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const noiseFilter = ctx.createBiquadFilter();
            noiseFilter.type = 'lowpass';
            noiseFilter.frequency.setValueAtTime(800, now);
            noiseFilter.frequency.exponentialRampToValueAtTime(50, now + 0.4);
            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.3, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(ctx.destination);
            noise.start(now);
            noise.stop(now + 0.4);
          } else if (type === 'win') {
            const notes = [523.25, 659.25, 783.99, 1046.5];
            notes.forEach((freq, idx) => {
              const noteOsc = ctx.createOscillator();
              const noteGain = ctx.createGain();
              noteOsc.type = 'triangle';
              noteOsc.frequency.setValueAtTime(freq, now + idx * 0.1);
              noteGain.gain.setValueAtTime(0.2, now + idx * 0.1);
              noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.25);
              noteOsc.connect(noteGain);
              noteGain.connect(ctx.destination);
              noteOsc.start(now + idx * 0.1);
              noteOsc.stop(now + idx * 0.1 + 0.25);
            });
          }
        } catch {}
      },

      toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const btn = document.getElementById('btn-sound-toggle');
        if (this.soundEnabled) {
          btn.innerHTML = '<span>🔊 Sonido ON</span>';
          btn.style.color = '#34d399';
          btn.style.background = 'rgba(16, 185, 129, 0.15)';
        } else {
          btn.innerHTML = '<span>🔇 Mute</span>';
          btn.style.color = 'var(--text-muted)';
          btn.style.background = 'rgba(255, 255, 255, 0.05)';
        }
      },

      setDifficulty(diffKey) {
        this.difficulty = diffKey;
        ['facil', 'medio', 'dificil'].forEach(k => {
          const btn = document.getElementById('diff-' + k);
          const conf = DIFFICULTIES[k];
          if (k === diffKey) {
            btn.style.border = '1.5px solid ' + conf.color;
            btn.style.background = conf.color + '25';
            btn.style.color = conf.color;
            btn.style.boxShadow = '0 0 15px ' + conf.color + '33';
          } else {
            btn.style.border = '1px solid rgba(255,255,255,0.12)';
            btn.style.background = 'rgba(255,255,255,0.04)';
            btn.style.color = 'var(--text-secondary)';
            btn.style.boxShadow = 'none';
          }
        });
        document.getElementById('arcade-bar').style.maxWidth = DIFFICULTIES[diffKey].maxWidth;
        this.updateRecordDisplay();
        this.resetGame();
      },

      updateRecordDisplay() {
        const saved = localStorage.getItem('buscaminas_best_' + this.difficulty);
        const recordBox = document.getElementById('record-display');
        const recordText = document.getElementById('record-text');
        if (saved) {
          recordText.textContent = 'Récord: ' + saved + 's';
          recordBox.style.display = 'inline-flex';
        } else {
          recordBox.style.display = 'none';
        }
      },

      setMobileTool(tool) {
        this.mobileTool = tool;
        const digBtn = document.getElementById('tool-dig');
        const flagBtn = document.getElementById('tool-flag');
        if (tool === 'dig') {
          digBtn.style.border = '1.5px solid #38bdf8';
          digBtn.style.background = 'rgba(56, 189, 248, 0.2)';
          digBtn.style.color = '#38bdf8';
          digBtn.style.boxShadow = '0 0 14px rgba(56, 189, 248, 0.3)';

          flagBtn.style.border = '1px solid rgba(255,255,255,0.1)';
          flagBtn.style.background = 'rgba(255,255,255,0.04)';
          flagBtn.style.color = 'var(--text-secondary)';
          flagBtn.style.boxShadow = 'none';
        } else {
          flagBtn.style.border = '1.5px solid #f87171';
          flagBtn.style.background = 'rgba(248, 113, 113, 0.2)';
          flagBtn.style.color = '#f87171';
          flagBtn.style.boxShadow = '0 0 14px rgba(248, 113, 113, 0.3)';

          digBtn.style.border = '1px solid rgba(255,255,255,0.1)';
          digBtn.style.background = 'rgba(255,255,255,0.04)';
          digBtn.style.color = 'var(--text-secondary)';
          digBtn.style.boxShadow = 'none';
        }
      },

      resetGame() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        const conf = DIFFICULTIES[this.difficulty];
        this.isStarted = false;
        this.isGameOver = false;
        this.isVictory = false;
        this.timer = 0;
        this.flagsCount = 0;

        document.getElementById('led-timer').textContent = '000';
        document.getElementById('led-mines').textContent = String(conf.mines).padStart(3, '0');
        document.getElementById('face-btn').textContent = '🙂';
        document.getElementById('status-banner').style.display = 'none';

        this.grid = [];
        for (let r = 0; r < conf.rows; r++) {
          const row = [];
          for (let c = 0; c < conf.cols; c++) {
            row.push({
              row: r,
              col: c,
              isMine: false,
              isRevealed: false,
              isFlagged: false,
              isQuestion: false,
              neighborMines: 0,
              exploded: false
            });
          }
          this.grid.push(row);
        }
        this.renderBoard();
      },

      startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
          this.timer = Math.min(999, this.timer + 1);
          document.getElementById('led-timer').textContent = String(this.timer).padStart(3, '0');
        }, 1000);
      },

      plantMines(initialRow, initialCol) {
        const conf = DIFFICULTIES[this.difficulty];
        const safeCoords = new Set();
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = initialRow + dr;
            const nc = initialCol + dc;
            if (nr >= 0 && nr < conf.rows && nc >= 0 && nc < conf.cols) {
              safeCoords.add(nr + ',' + nc);
            }
          }
        }

        const candidates = [];
        for (let r = 0; r < conf.rows; r++) {
          for (let c = 0; c < conf.cols; c++) {
            if (!safeCoords.has(r + ',' + c)) {
              candidates.push([r, c]);
            }
          }
        }

        for (let i = candidates.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
        }

        const placedMines = Math.min(conf.mines, candidates.length);
        for (let i = 0; i < placedMines; i++) {
          const [r, c] = candidates[i];
          this.grid[r][c].isMine = true;
        }

        for (let r = 0; r < conf.rows; r++) {
          for (let c = 0; c < conf.cols; c++) {
            if (!this.grid[r][c].isMine) {
              let count = 0;
              for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                  const nr = r + dr;
                  const nc = c + dc;
                  if (nr >= 0 && nr < conf.rows && nc >= 0 && nc < conf.cols && this.grid[nr][nc].isMine) {
                    count++;
                  }
                }
              }
              this.grid[r][c].neighborMines = count;
            }
          }
        }
      },

      checkVictory() {
        const conf = DIFFICULTIES[this.difficulty];
        for (let r = 0; r < conf.rows; r++) {
          for (let c = 0; c < conf.cols; c++) {
            const cell = this.grid[r][c];
            if (!cell.isMine && !cell.isRevealed) {
              return false;
            }
          }
        }
        return true;
      },

      revealCell(r, c) {
        if (this.isGameOver || this.isVictory) return;

        if (!this.isStarted) {
          this.plantMines(r, c);
          this.isStarted = true;
          this.startTimer();
        }

        const target = this.grid[r][c];
        if (target.isRevealed || target.isFlagged) return;

        if (target.isMine) {
          this.playSound('explode');
          this.isGameOver = true;
          if (this.timerInterval) clearInterval(this.timerInterval);
          target.exploded = true;
          document.getElementById('face-btn').textContent = '💀';

          const conf = DIFFICULTIES[this.difficulty];
          for (let row = 0; row < conf.rows; row++) {
            for (let col = 0; col < conf.cols; col++) {
              if (this.grid[row][col].isMine) {
                this.grid[row][col].isRevealed = true;
              }
            }
          }
          this.renderBoard();
          this.showStatusBanner(false);
          return;
        }

        const conf = DIFFICULTIES[this.difficulty];
        const queue = [[r, c]];
        target.isRevealed = true;
        let openedZero = false;

        while (queue.length > 0) {
          const [currR, currC] = queue.shift();
          const curr = this.grid[currR][currC];

          if (curr.neighborMines === 0) {
            openedZero = true;
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                const nr = currR + dr;
                const nc = currC + dc;
                if (nr >= 0 && nr < conf.rows && nc >= 0 && nc < conf.cols) {
                  const neighbor = this.grid[nr][nc];
                  if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isMine) {
                    neighbor.isRevealed = true;
                    if (neighbor.neighborMines === 0) {
                      queue.push([nr, nc]);
                    }
                  }
                }
              }
            }
          }
        }

        if (openedZero) {
          this.playSound('cascade');
        } else {
          this.playSound('click');
        }

        if (this.checkVictory()) {
          this.isVictory = true;
          if (this.timerInterval) clearInterval(this.timerInterval);
          this.playSound('win');
          if (window.DesvariosAuth) {
            window.DesvariosAuth.unlockMedal('buscaminas-mente');
          }
          document.getElementById('face-btn').textContent = '😎';

          try {
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#f59e0b', '#10b981', '#38bdf8', '#fbbf24', '#ffffff']
            });
          } catch {}

          const bestKey = 'buscaminas_best_' + this.difficulty;
          const currentBest = localStorage.getItem(bestKey);
          if (!currentBest || this.timer < parseInt(currentBest, 10)) {
            localStorage.setItem(bestKey, this.timer.toString());
            this.updateRecordDisplay();
          }

          for (let row = 0; row < conf.rows; row++) {
            for (let col = 0; col < conf.cols; col++) {
              if (this.grid[row][col].isMine) {
                this.grid[row][col].isFlagged = true;
              }
            }
          }
          this.flagsCount = conf.mines;
          document.getElementById('led-mines').textContent = '000';
          this.showStatusBanner(true);
        }

        this.renderBoard();
      },

      toggleFlag(r, c) {
        if (this.isGameOver || this.isVictory) return;
        const cell = this.grid[r][c];
        if (cell.isRevealed) return;

        this.playSound('flag');
        const conf = DIFFICULTIES[this.difficulty];

        if (!cell.isFlagged && !cell.isQuestion) {
          cell.isFlagged = true;
          this.flagsCount++;
        } else if (cell.isFlagged) {
          cell.isFlagged = false;
          cell.isQuestion = true;
          this.flagsCount = Math.max(0, this.flagsCount - 1);
        } else {
          cell.isQuestion = false;
        }

        const remaining = conf.mines - this.flagsCount;
        document.getElementById('led-mines').textContent = String(Math.max(-99, Math.min(999, remaining))).padStart(3, '0');
        this.renderBoard();
      },

      handleChording(r, c) {
        if (this.isGameOver || this.isVictory) return;
        const cell = this.grid[r][c];
        if (!cell.isRevealed || cell.neighborMines === 0) return;

        const conf = DIFFICULTIES[this.difficulty];
        let adjacentFlags = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < conf.rows && nc >= 0 && nc < conf.cols) {
              if (this.grid[nr][nc].isFlagged) adjacentFlags++;
            }
          }
        }

        if (adjacentFlags === cell.neighborMines) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < conf.rows && nc >= 0 && nc < conf.cols) {
                if (!this.grid[nr][nc].isRevealed && !this.grid[nr][nc].isFlagged) {
                  this.revealCell(nr, nc);
                }
              }
            }
          }
        }
      },

      handleCellClick(r, c) {
        if (this.mobileTool === 'flag') {
          this.toggleFlag(r, c);
        } else {
          if (this.grid[r][c].isRevealed) {
            this.handleChording(r, c);
          } else {
            this.revealCell(r, c);
          }
        }
      },

      showStatusBanner(won) {
        const banner = document.getElementById('status-banner');
        const conf = DIFFICULTIES[this.difficulty];
        banner.style.display = 'block';
        if (won) {
          banner.style.border = '1.5px solid #10b981';
          banner.style.background = 'rgba(16, 185, 129, 0.12)';
          banner.style.boxShadow = '0 0 25px rgba(16, 185, 129, 0.25)';
          banner.innerHTML = \`
            <div style="font-size: 1.25rem; font-weight: 900; color: #34d399; margin-bottom: 0.35rem;">
              🏆 ¡VICTORIA! MINAS DESACTIVADAS
            </div>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
              Has completado el modo \${conf.name} en <strong>\${this.timer} segundos</strong> con precisión impecable.
            </p>
            <button onclick="app.resetGame()" class="btn-primary">
              ↺ Jugar de nuevo
            </button>
          \`;
        } else {
          banner.style.border = '1.5px solid #ef4444';
          banner.style.background = 'rgba(239, 68, 68, 0.12)';
          banner.style.boxShadow = '0 0 25px rgba(239, 68, 68, 0.25)';
          banner.innerHTML = \`
            <div style="font-size: 1.25rem; font-weight: 900; color: #f87171; margin-bottom: 0.35rem;">
              💥 ¡BOOM! HAS DETONADO UNA MINA
            </div>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
              Una anomalía estalló bajo tus pies. Respira hondo y vuelve a intentarlo.
            </p>
            <button onclick="app.resetGame()" class="btn-primary">
              ↺ Jugar de nuevo
            </button>
          \`;
        }
      },

      renderBoard() {
        const boardEl = document.getElementById('board-grid');
        const conf = DIFFICULTIES[this.difficulty];
        boardEl.style.gridTemplateColumns = 'repeat(' + conf.cols + ', 30px)';
        boardEl.style.gridTemplateRows = 'repeat(' + conf.rows + ', 30px)';

        let html = '';
        for (let r = 0; r < conf.rows; r++) {
          for (let c = 0; c < conf.cols; c++) {
            const cell = this.grid[r][c];
            let bg = 'linear-gradient(180deg, #2b3345 0%, #1f2533 100%)';
            let border = '1px solid #3d475d';
            let shadow = 'inset 1px 1px 0 rgba(255,255,255,0.15), 0 2px 4px rgba(0,0,0,0.3)';
            let content = '';
            let textColor = '#f8fafc';

            if (cell.isRevealed) {
              bg = cell.exploded ? 'radial-gradient(circle, #ef4444 0%, #991b1b 100%)' : '#141822';
              border = cell.exploded ? '1.5px solid #ef4444' : '1px solid #1a202c';
              shadow = 'inset 0 1px 4px rgba(0,0,0,0.7)';
              if (cell.isMine) {
                content = cell.exploded ? '💥' : '💣';
              } else if (cell.neighborMines > 0) {
                content = cell.neighborMines;
                textColor = NUMBER_COLORS[cell.neighborMines] || '#f8fafc';
              }
            } else if (cell.isFlagged) {
              content = '🚩';
            } else if (cell.isQuestion) {
              content = '❓';
            }

            html += \`
              <button
                type="button"
                onclick="app.handleCellClick(\${r}, \${c})"
                oncontextmenu="event.preventDefault(); app.toggleFlag(\${r}, \${c})"
                style="width: 30px; height: 30px; padding: 0; margin: 0; border-radius: 4px; background: \${bg}; border: \${border}; box-shadow: \${shadow}; font-size: 0.92rem; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; color: \${textColor};"
              >
                \${content}
              </button>
            \`;
          }
        }
        boardEl.innerHTML = html;
      }
    };

    document.addEventListener('DOMContentLoaded', () => {
      app.init();
    });
  </script>
  <script src="js/cookie-banner.js"></script>
</body>
</html>`;
}

// Save standalone Buscaminas Game
const buscaminasOut = path.join(__dirname, '..', 'juego-buscaminas.html');
fs.writeFileSync(buscaminasOut, generateBuscaminasHtml(), 'utf8');

// ==========================================================
// 7C. GENERATE JUEGO-TRES-EN-RAYA.HTML
function generateTicTacToeHtml() {
  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Tres en Raya Imposible (IA Minimax)',
    description: 'Desafía a un motor matemático imbatible o juega contra un amigo en local en una pantalla arcade retro neón.',
    url: 'https://tusdesvarios.com/juego-tres-en-raya.html',
    genre: ['Board Game', 'Logic', 'Strategy', 'Tic Tac Toe'],
    playMode: ['SinglePlayer', 'MultiPlayer'],
    applicationCategory: 'Game',
    inLanguage: 'es',
    image: 'https://tusdesvarios.com/images/games/portada_tres_en_raya.jpg',
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
        name: 'Tres en Raya Imposible',
        item: 'https://tusdesvarios.com/juego-tres-en-raya.html'
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tres en Raya Imposible (IA Minimax) — Juego Retro Online Gratis | TusDesvarios.com</title>
  <meta name="description" content="Juega gratis al Tres en Raya clásico y arcade: desafía a la IA Minimax invencible o compite con un amigo en modo local para 2 jugadores con efectos retro de neón y sonido 8-bit.">
  <meta name="keywords" content="tres en raya online gratis, tres en raya ia minimax, tic tac toe retro, juego del tres en raya, tres en raya dos jugadores, tus desvarios">
  
  <link rel="canonical" href="https://tusdesvarios.com/juego-tres-en-raya.html">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Tres en Raya Imposible (IA Minimax) | Tus Desvaríos">
  <meta property="og:description" content="¿Podrás vencer al algoritmo matemático invencible? Juega al Tres en Raya en solitario o a 2 jugadores con estética synthwave neón.">
  <meta property="og:url" content="https://tusdesvarios.com/juego-tres-en-raya.html">
  <meta property="og:image" content="images/games/portada_tres_en_raya.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Tres en Raya Imposible (IA Minimax) — Juego Retro Gratis">
  <meta name="twitter:description" content="Compite contra la IA perfecta o reta a un amigo en local en una cuadrícula arcade de neón con sonido 8-bit.">
  <meta name="twitter:image" content="images/games/portada_tres_en_raya.jpg">

  <script type="application/ld+json">
${JSON.stringify(gameSchema, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(breadcrumbSchema, null, 2)}
  </script>

  <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="images/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>

  <style>
    :root {
      --bg-main: #0a0d14;
      --bg-surface: #121722;
      --bg-surface-hover: #182030;
      --border-subtle: rgba(255, 255, 255, 0.08);
      --border-medium: rgba(255, 255, 255, 0.16);
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --text-muted: #64748b;
      --accent-cyan: #06b6d4;
      --accent-pink: #ec4899;
      --accent-amber: #f59e0b;

      --font-ui: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-title: 'Cinzel', Georgia, serif;

      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --radius-full: 9999px;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-ui);
      background-color: var(--bg-main);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      line-height: 1.5;
      background-image: 
        radial-gradient(at 15% 15%, rgba(6, 182, 212, 0.14) 0px, transparent 45%),
        radial-gradient(at 85% 20%, rgba(236, 72, 153, 0.12) 0px, transparent 50%),
        radial-gradient(at 50% 85%, rgba(168, 85, 247, 0.08) 0px, transparent 55%);
      background-attachment: fixed;
      overflow-x: hidden;
    }

    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      width: 100%;
    }

    ${getHeaderCss()}

    .main-content {
      flex: 1;
      max-width: 880px;
      width: 100%;
      margin: 0 auto;
      padding: 1.5rem 1.25rem 4rem;
    }

    .breadcrumb-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      color: var(--text-muted);
      text-decoration: none;
      transition: color 0.2s;
    }
    .breadcrumb-link:hover {
      color: var(--text-primary);
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      padding: 0.65rem 1.4rem;
      border-radius: var(--radius-sm);
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      color: #fff;
      font-weight: 700;
      font-size: 0.88rem;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(6, 182, 212, 0.35);
      transition: all 0.2s ease;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(6, 182, 212, 0.5);
    }

    .site-footer {
      margin-top: auto;
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      padding: 1.5rem 1.25rem;
      text-align: center;
      font-size: 0.82rem;
      color: var(--text-muted);
    }
    .footer-legal-links {
      margin-top: 0.75rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.65rem 0.85rem;
      font-size: 0.82rem;
    }
    .footer-legal-links a {
      color: var(--text-secondary, #cbd5e1);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .footer-legal-links a:hover {
      color: #c084fc;
      text-decoration: underline;
    }
    .footer-separator {
      color: var(--border-medium, rgba(255, 255, 255, 0.22));
      font-size: 0.75rem;
      user-select: none;
    }

  </style>
  <!-- Supabase SDK v2 & Desvarios Client -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/supabase-client.js"></script>
</head>
<body>
  <div class="app-container">
    ${getHeaderHtml('retro')}

    <!-- Main Content -->
    <main class="main-content">
      <div class="breadcrumb-nav" style="margin-bottom: 1.25rem;">
        <a href="desvarios-retro.html" class="breadcrumb-link">
          <span>←</span> <span>Volver a Desvaríos Retro</span>
        </a>
      </div>

      <header style="text-align: center; margin-bottom: 1.75rem;">
        <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.9rem; background: rgba(6, 182, 212, 0.12); border: 1px solid rgba(6, 182, 212, 0.35); border-radius: 9999px; color: #06b6d4; font-size: 0.82rem; font-weight: 700; margin-bottom: 0.75rem;">
          <span>❌⭕</span>
          <span>Tablero de Estrategia Clásica</span>
        </div>
        <h1 style="font-family: var(--font-title); font-size: clamp(2rem, 4vw, 2.75rem); font-weight: 900; letter-spacing: 0.04em; margin-bottom: 0.5rem; background: linear-gradient(135deg, #fff 40%, #06b6d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          Tres en Raya Imposible
        </h1>
        <p style="color: var(--text-secondary); font-size: 0.95rem; max-width: 560px; margin: 0 auto;">
          Enfréntate al motor matemático Minimax invencible o desafía a un amigo en local en una cuadrícula arcade de neón synthwave.
        </p>
      </header>

      <!-- Mode & Difficulty Selector Bar -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.25rem; padding: 0.85rem 1.25rem; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: 12px;">
        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
          <button id="mode-btn-ai" type="button" onclick="app.setMode('ai')" style="padding: 0.45rem 0.85rem; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem; border: 1.5px solid #06b6d4; background: rgba(6, 182, 212, 0.2); color: #06b6d4; box-shadow: 0 0 14px rgba(6, 182, 212, 0.3);">
            <span>🤖</span> <span>Vs IA Minimax</span>
          </button>
          <button id="mode-btn-pvp" type="button" onclick="app.setMode('pvp')" style="padding: 0.45rem 0.85rem; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); color: var(--text-secondary);">
            <span>👥</span> <span>2 Jugadores Local</span>
          </button>
        </div>

        <div id="diff-container" style="display: flex; align-items: center; gap: 0.4rem;">
          <button id="diff-facil" type="button" onclick="app.setDifficulty('facil')" style="padding: 0.35rem 0.7rem; border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: var(--text-muted);">
            🟢 Fácil
          </button>
          <button id="diff-medio" type="button" onclick="app.setDifficulty('medio')" style="padding: 0.35rem 0.7rem; border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: var(--text-muted);">
            🟡 Medio
          </button>
          <button id="diff-imposible" type="button" onclick="app.setDifficulty('imposible')" style="padding: 0.35rem 0.7rem; border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer; border: 1px solid #fbbf24; background: rgba(245, 158, 11, 0.2); color: #fbbf24;">
            🔴 Imposible
          </button>
        </div>

        <button id="btn-sound-toggle" onclick="app.toggleSound()" style="padding: 0.45rem 0.75rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); background: rgba(16, 185, 129, 0.15); color: #34d399; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.82rem; font-weight: 600;">
          <span>🔊 Sonido ON</span>
        </button>
      </div>

      <!-- Arcade Box -->
      <div style="margin: 0 auto; padding: 1.75rem; border-radius: 16px; background: linear-gradient(180deg, #181c24 0%, #0d1117 100%); border: 2px solid rgba(6, 182, 212, 0.35); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6), 0 0 35px rgba(6, 182, 212, 0.15); display: flex; flex-direction: column; align-items: center; max-width: 520px;">
        
        <!-- Scoreboard Header -->
        <div style="width: 100%; margin-bottom: 1.5rem; padding: 0.75rem 1.25rem; background: linear-gradient(180deg, #222734 0%, #171b26 100%); border-radius: 10px; border: 2px solid #333d4e; display: flex; align-items: center; justify-content: space-around; box-shadow: inset 0 2px 6px rgba(0,0,0,0.6);">
          <div style="text-align: center;">
            <div id="p1-label" style="font-size: 0.78rem; color: #06b6d4; font-weight: 700; margin-bottom: 0.2rem;">
              Tú (❌)
            </div>
            <div id="score-p1" style="font-family: monospace; font-size: 1.4rem; fontWeight: 900; color: #06b6d4; text-shadow: 0 0 8px rgba(6, 182, 212, 0.6);">
              0
            </div>
          </div>

          <div style="text-align: center;">
            <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700; margin-bottom: 0.2rem;">
              Empates
            </div>
            <div id="score-draws" style="font-family: monospace; font-size: 1.4rem; font-weight: 900; color: var(--text-secondary);">
              0
            </div>
          </div>

          <div style="text-align: center;">
            <div id="p2-label" style="font-size: 0.78rem; color: #ec4899; font-weight: 700; margin-bottom: 0.2rem;">
              IA (⭕)
            </div>
            <div id="score-p2" style="font-family: monospace; font-size: 1.4rem; font-weight: 900; color: #ec4899; text-shadow: 0 0 8px rgba(236, 72, 153, 0.6);">
              0
            </div>
          </div>
        </div>

        <!-- Turn / Status Indicator -->
        <div id="status-indicator" style="margin-bottom: 1.25rem; font-size: 0.92rem; font-weight: 700; color: #06b6d4; display: flex; align-items: center; gap: 0.45rem;">
          Turno de: <strong>❌ (Azul)</strong>
        </div>

        <!-- 3x3 Board Grid -->
        <div id="grid-container" style="display: grid; grid-template-columns: repeat(3, 96px); grid-template-rows: repeat(3, 96px); gap: 10px; padding: 12px; background: #121620; border-radius: 14px; border: 2px solid #232b3b; box-shadow: inset 0 4px 18px rgba(0,0,0,0.6); user-select: none;">
          <!-- 9 cells injected by JS -->
        </div>

        <!-- Action Controls -->
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 1.5rem;">
          <button onclick="app.resetGame()" class="btn-primary">
            <span>↺ Nueva Partida</span>
          </button>
          <button onclick="app.resetScores()" style="padding: 0.65rem 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); color: var(--text-muted); font-size: 0.82rem; font-weight: 600; cursor: pointer;">
            Reiniciar Marcador
          </button>
        </div>
      </div>

      <!-- Rules Guide -->
      <section style="margin-top: 2.5rem; padding: 1.5rem; border-radius: 12px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-subtle);">
        <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 0.85rem; display: flex; align-items: center; gap: 0.45rem; color: #06b6d4;">
          <span>❓</span> <span>El Desafío del Tres en Raya Imposible</span>
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; font-size: 0.86rem; color: var(--text-secondary); line-height: 1.6;">
          <div>
            <strong style="color: #fff;">🤖 ¿Por qué es "Imposible"?</strong> El nivel Imposible utiliza el algoritmo minimax completo: evalúa cada posible desenlace del árbol de juego. La máquina nunca comete fallos y jugará siempre la respuesta matemáticamente óptima.
          </div>
          <div>
            <strong style="color: #fff;">🎯 ¿Se puede ganar?</strong> Según la teoría de juegos, si ambos jugadores juegan de manera óptima, el Tres en Raya siempre termina en empate. ¡Conseguir empatar contra el modo Imposible demuestra juego perfecto!
          </div>
          <div>
            <strong style="color: #fff;">🟢 Modos Alternativos:</strong> Prueba el nivel Fácil o Medio para partidas más dinámicas y con margen para la victoria, o utiliza el modo 2 Jugadores en local para retar a quien tengas al lado.
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <!-- Pie de Página Unificado -->
  <footer class="site-footer">
    <p>© 2026 TusDesvarios.com — Portal de Entretenimiento, Ficción y Ocio Interactivo</p>
    <div class="footer-legal-links">
      <a href="aviso-legal.html">Aviso Legal</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-privacidad.html">Política de Privacidad</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-cookies.html">Política de Cookies</a>
    </div>
  </footer>
  </div>

  <script>
    const WINNING_COMBOS = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    const app = {
      mode: 'ai',
      difficulty: 'imposible',
      playerSymbol: 'X',
      aiSymbol: 'O',
      board: Array(9).fill(null),
      currentTurn: 'X',
      winner: null,
      winningCombo: null,
      isAiThinking: false,
      soundEnabled: true,
      audioCtx: null,
      scores: { player1: 0, draws: 0, player2: 0 },

      init() {
        try {
          const saved = localStorage.getItem('tres_en_raya_scores');
          if (saved) this.scores = JSON.parse(saved);
        } catch {}
        this.updateScoreboard();
        this.resetGame();
      },

      playSound(type) {
        if (!this.soundEnabled) return;
        try {
          const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
          if (!this.audioCtx) this.audioCtx = new AudioCtxClass();
          if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

          const ctx = this.audioCtx;
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          if (type === 'x') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
          } else if (type === 'o') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(330, now + 0.08);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
          } else if (type === 'win') {
            const notes = [523.25, 659.25, 783.99, 1046.5];
            notes.forEach((freq, idx) => {
              const nOsc = ctx.createOscillator();
              const nGain = ctx.createGain();
              nOsc.type = 'triangle';
              nOsc.frequency.setValueAtTime(freq, now + idx * 0.09);
              nGain.gain.setValueAtTime(0.2, now + idx * 0.09);
              nGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.22);
              nOsc.connect(nGain);
              nGain.connect(ctx.destination);
              nOsc.start(now + idx * 0.09);
              nOsc.stop(now + idx * 0.09 + 0.22);
            });
          } else if (type === 'lose') {
            const notes = [440, 392, 349.23, 293.66];
            notes.forEach((freq, idx) => {
              const nOsc = ctx.createOscillator();
              const nGain = ctx.createGain();
              nOsc.type = 'sawtooth';
              nOsc.frequency.setValueAtTime(freq, now + idx * 0.1);
              nGain.gain.setValueAtTime(0.15, now + idx * 0.1);
              nGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.2);
              nOsc.connect(nGain);
              nGain.connect(ctx.destination);
              nOsc.start(now + idx * 0.1);
              nOsc.stop(now + idx * 0.1 + 0.2);
            });
          } else if (type === 'tie') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(350, now);
            osc.frequency.setValueAtTime(250, now + 0.08);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
            osc.start(now);
            osc.stop(now + 0.18);
          }
        } catch {}
      },

      toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const btn = document.getElementById('btn-sound-toggle');
        if (this.soundEnabled) {
          btn.innerHTML = '<span>🔊 Sonido ON</span>';
          btn.style.color = '#34d399';
          btn.style.background = 'rgba(16, 185, 129, 0.15)';
        } else {
          btn.innerHTML = '<span>🔇 Mute</span>';
          btn.style.color = 'var(--text-muted)';
          btn.style.background = 'rgba(255, 255, 255, 0.05)';
        }
      },

      setMode(newMode) {
        this.mode = newMode;
        const aiBtn = document.getElementById('mode-btn-ai');
        const pvpBtn = document.getElementById('mode-btn-pvp');
        const diffBox = document.getElementById('diff-container');
        const p1Label = document.getElementById('p1-label');
        const p2Label = document.getElementById('p2-label');

        if (newMode === 'ai') {
          aiBtn.style.border = '1.5px solid #06b6d4';
          aiBtn.style.background = 'rgba(6, 182, 212, 0.2)';
          aiBtn.style.color = '#06b6d4';
          aiBtn.style.boxShadow = '0 0 14px rgba(6, 182, 212, 0.3)';

          pvpBtn.style.border = '1px solid rgba(255,255,255,0.12)';
          pvpBtn.style.background = 'rgba(255,255,255,0.04)';
          pvpBtn.style.color = 'var(--text-secondary)';
          pvpBtn.style.boxShadow = 'none';

          diffBox.style.display = 'flex';
          p1Label.textContent = 'Tú (❌)';
          p2Label.textContent = 'IA (⭕)';
        } else {
          pvpBtn.style.border = '1.5px solid #ec4899';
          pvpBtn.style.background = 'rgba(236, 72, 153, 0.2)';
          pvpBtn.style.color = '#ec4899';
          pvpBtn.style.boxShadow = '0 0 14px rgba(236, 72, 153, 0.3)';

          aiBtn.style.border = '1px solid rgba(255,255,255,0.12)';
          aiBtn.style.background = 'rgba(255,255,255,0.04)';
          aiBtn.style.color = 'var(--text-secondary)';
          aiBtn.style.boxShadow = 'none';

          diffBox.style.display = 'none';
          p1Label.textContent = 'Jugador 1 (❌)';
          p2Label.textContent = 'Jugador 2 (⭕)';
        }
        this.resetGame();
      },

      setDifficulty(d) {
        this.difficulty = d;
        ['facil', 'medio', 'imposible'].forEach(k => {
          const btn = document.getElementById('diff-' + k);
          if (k === d) {
            btn.style.border = '1px solid #fbbf24';
            btn.style.background = 'rgba(245, 158, 11, 0.2)';
            btn.style.color = '#fbbf24';
          } else {
            btn.style.border = '1px solid rgba(255,255,255,0.1)';
            btn.style.background = 'transparent';
            btn.style.color = 'var(--text-muted)';
          }
        });
        this.resetGame();
      },

      updateScoreboard() {
        document.getElementById('score-p1').textContent = this.scores.player1;
        document.getElementById('score-draws').textContent = this.scores.draws;
        document.getElementById('score-p2').textContent = this.scores.player2;
      },

      resetScores() {
        this.scores = { player1: 0, draws: 0, player2: 0 };
        try {
          localStorage.setItem('tres_en_raya_scores', JSON.stringify(this.scores));
        } catch {}
        this.updateScoreboard();
      },

      checkWinner(b) {
        for (const combo of WINNING_COMBOS) {
          const [a, bIndex, c] = combo;
          if (b[a] && b[a] === b[bIndex] && b[a] === b[c]) {
            return { winner: b[a], combo };
          }
        }
        if (b.every(cell => cell !== null)) {
          return { winner: 'tie', combo: null };
        }
        return null;
      },

      resetGame() {
        this.board = Array(9).fill(null);
        this.currentTurn = 'X';
        this.winner = null;
        this.winningCombo = null;
        this.isAiThinking = false;
        this.updateStatus();
        this.renderBoard();
      },

      updateStatus() {
        const ind = document.getElementById('status-indicator');
        if (this.winner) {
          if (this.winner === 'tie') {
            ind.style.color = '#fbbf24';
            ind.innerHTML = '🤝 ¡Partida en Tablas / Empate!';
          } else if (this.mode === 'ai') {
            if (this.winner === this.playerSymbol) {
              ind.style.color = '#06b6d4';
              ind.innerHTML = '🎉 ¡Victoria magistral! Has vencido';
            } else {
              ind.style.color = '#ec4899';
              ind.innerHTML = '💀 La IA ha ganado la partida';
            }
          } else {
            ind.style.color = this.winner === 'X' ? '#06b6d4' : '#ec4899';
            ind.innerHTML = '🎉 ¡Victoria para el Jugador ' + (this.winner === 'X' ? '1 (❌)' : '2 (⭕)') + '!';
          }
        } else if (this.isAiThinking) {
          ind.style.color = '#fbbf24';
          ind.innerHTML = '⚡ La IA está calculando el movimiento perfecto...';
        } else {
          ind.style.color = this.currentTurn === 'X' ? '#06b6d4' : '#ec4899';
          ind.innerHTML = 'Turno de: <strong>' + (this.currentTurn === 'X' ? '❌ (Azul)' : '⭕ (Rosa)') + '</strong>';
        }
      },

      minimax(currentBoard, depth, isMaximizing) {
        const res = this.checkWinner(currentBoard);
        if (res) {
          if (res.winner === this.aiSymbol) return 10 - depth;
          if (res.winner === this.playerSymbol) return depth - 10;
          if (res.winner === 'tie') return 0;
        }

        if (isMaximizing) {
          let best = -Infinity;
          for (let i = 0; i < 9; i++) {
            if (currentBoard[i] === null) {
              currentBoard[i] = this.aiSymbol;
              best = Math.max(best, this.minimax(currentBoard, depth + 1, false));
              currentBoard[i] = null;
            }
          }
          return best;
        } else {
          let best = Infinity;
          for (let i = 0; i < 9; i++) {
            if (currentBoard[i] === null) {
              currentBoard[i] = this.playerSymbol;
              best = Math.min(best, this.minimax(currentBoard, depth + 1, true));
              currentBoard[i] = null;
            }
          }
          return best;
        }
      },

      getAiMove() {
        const available = [];
        for (let i = 0; i < 9; i++) {
          if (this.board[i] === null) available.push(i);
        }
        if (available.length === 0) return -1;

        if (this.difficulty === 'facil') {
          return available[Math.floor(Math.random() * available.length)];
        }

        if (this.difficulty === 'medio') {
          if (Math.random() < 0.4) {
            return available[Math.floor(Math.random() * available.length)];
          }
        }

        if (this.board[4] === null && Math.random() < 0.8) {
          return 4;
        }

        let bestScore = -Infinity;
        let move = available[0];
        for (const i of available) {
          this.board[i] = this.aiSymbol;
          const score = this.minimax(this.board, 0, false);
          this.board[i] = null;
          if (score > bestScore) {
            bestScore = score;
            move = i;
          }
        }
        return move;
      },

      triggerAiTurn() {
        if (this.mode !== 'ai' || this.currentTurn !== this.aiSymbol || this.winner || this.isAiThinking) return;
        this.isAiThinking = true;
        this.updateStatus();

        setTimeout(() => {
          const move = this.getAiMove();
          if (move !== -1) {
            this.board[move] = this.aiSymbol;
            this.playSound(this.aiSymbol === 'X' ? 'x' : 'o');

            const res = this.checkWinner(this.board);
            if (res) {
              this.winner = res.winner;
              this.winningCombo = res.combo;
              if (res.winner === this.aiSymbol) {
                this.playSound('lose');
                this.scores.player2++;
              } else if (res.winner === 'tie') {
                this.playSound('tie');
                this.scores.draws++;
            if (this.mode === 'ai' && window.DesvariosAuth) {
              window.DesvariosAuth.unlockMedal('tresenraya-estratega');
            }
              }
              try {
                localStorage.setItem('tres_en_raya_scores', JSON.stringify(this.scores));
              } catch {}
              this.updateScoreboard();
            } else {
              this.currentTurn = this.playerSymbol;
            }
          }
          this.isAiThinking = false;
          this.updateStatus();
          this.renderBoard();
        }, 400);
      },

      handleCellClick(index) {
        if (this.board[index] !== null || this.winner !== null || this.isAiThinking) return;
        if (this.mode === 'ai' && this.currentTurn !== this.playerSymbol) return;

        const symbol = this.currentTurn;
        this.board[index] = symbol;
        this.playSound(symbol === 'X' ? 'x' : 'o');

        const res = this.checkWinner(this.board);
        if (res) {
          this.winner = res.winner;
          this.winningCombo = res.combo;

          if (res.winner === 'tie') {
            this.playSound('tie');
            this.scores.draws++;
          } else {
            this.playSound('win');
            try {
              confetti({
                particleCount: 90,
                spread: 75,
                origin: { y: 0.6 },
                colors: ['#06b6d4', '#ec4899', '#f59e0b', '#34d399', '#ffffff']
              });
            } catch {}

            if (this.mode === 'ai') {
              if (res.winner === this.playerSymbol) {
                this.scores.player1++;
                if (window.DesvariosAuth) {
                  window.DesvariosAuth.unlockMedal('tresenraya-estratega');
                }
              } else this.scores.player2++;
            } else {
              if (res.winner === 'X') this.scores.player1++;
              else this.scores.player2++;
            }
          }

          try {
            localStorage.setItem('tres_en_raya_scores', JSON.stringify(this.scores));
          } catch {}
          this.updateScoreboard();
        } else {
          this.currentTurn = symbol === 'X' ? 'O' : 'X';
        }

        this.updateStatus();
        this.renderBoard();

        if (!res && this.mode === 'ai') {
          this.triggerAiTurn();
        }
      },

      renderBoard() {
        const gridEl = document.getElementById('grid-container');
        let html = '';
        for (let i = 0; i < 9; i++) {
          const val = this.board[i];
          const isWin = this.winningCombo && this.winningCombo.includes(i);
          const isX = val === 'X';
          const isO = val === 'O';

          let bg = isWin
            ? (isX ? 'rgba(6, 182, 212, 0.25)' : 'rgba(236, 72, 153, 0.25)')
            : 'linear-gradient(145deg, #242b3a 0%, #171c26 100%)';
          let border = isWin
            ? (isX ? '2px solid #06b6d4' : '2px solid #ec4899')
            : '1px solid #333c50';
          let shadow = isWin
            ? (isX ? '0 0 20px rgba(6, 182, 212, 0.5)' : '0 0 20px rgba(236, 72, 153, 0.5)')
            : '0 4px 10px rgba(0,0,0,0.4)';
          let color = isX ? '#06b6d4' : '#ec4899';
          let textShadow = isX ? '0 0 12px rgba(6, 182, 212, 0.7)' : (isO ? '0 0 12px rgba(236, 72, 153, 0.7)' : 'none');
          let cursor = val === null && !this.winner && !this.isAiThinking ? 'pointer' : 'default';

          html += \`
            <button
              type="button"
              onclick="app.handleCellClick(\${i})"
              style="width: 96px; height: 96px; border-radius: 10px; background: \${bg}; border: \${border}; box-shadow: \${shadow}; font-size: 3rem; font-weight: 900; display: flex; align-items: center; justify-content: center; cursor: \${cursor}; color: \${color}; text-shadow: \${textShadow}; transition: all 0.18s ease;"
            >
              \${val !== null ? val : ''}
            </button>
          \`;
        }
        gridEl.innerHTML = html;
      }
    };

    document.addEventListener('DOMContentLoaded', () => {
      app.init();
    });
  </script>
  <script src="js/cookie-banner.js"></script>
</body>
</html>`;
}

// Save standalone Tic Tac Toe Game
const tictactoeOut = path.join(__dirname, '..', 'juego-tres-en-raya.html');
fs.writeFileSync(tictactoeOut, generateTicTacToeHtml(), 'utf8');

// ==========================================================
// 7D. GENERATE JUEGO-ROMPEBLOQUES.HTML
function generateRompebloquesHtml() {
  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Rompebloques Neón (Dimensión Cósmica)',
    description: 'El clásico rompebloques arcade reinventado con estética synthwave neón, física dinámica a 60 FPS, múltiples niveles, power-ups y sonido 8-bit.',
    url: 'https://tusdesvarios.com/juego-rompebloques.html',
    genre: ['Arcade', 'Action', 'Breakout', 'Retro Arcade', 'Brick Breaker'],
    playMode: 'SinglePlayer',
    applicationCategory: 'Game',
    inLanguage: 'es',
    image: 'https://tusdesvarios.com/images/games/portada_rompebloques.jpg',
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
        name: 'Rompebloques Neón',
        item: 'https://tusdesvarios.com/juego-rompebloques.html'
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rompebloques Neón (Dimensión Cósmica) — Juego Arcade Retro Gratis | TusDesvarios.com</title>
  <meta name="description" content="Juega gratis a Rompebloques Neón: el clásico arcade de rebotar la bola reinventado con física a 60 FPS, estética synthwave neón, cápsulas de power-ups, disparos láser y sonido 8-bit.">
  <meta name="keywords" content="rompebloques gratis, rompebloques online gratis, juego rompebloques arcade, breakout neón, juego romper ladrillos, brick breaker retro, tus desvarios">
  
  <link rel="canonical" href="https://tusdesvarios.com/juego-rompebloques.html">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Rompebloques Neón (Dimensión Cósmica) | Tus Desvaríos">
  <meta property="og:description" content="Destruye barreras dimensionales y recolecta cápsulas de energía cósmica en una cabina arcade retro. ¡Juega gratis en tu navegador!">
  <meta property="og:url" content="https://tusdesvarios.com/juego-rompebloques.html">
  <meta property="og:image" content="images/games/portada_rompebloques.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Rompebloques Neón — Juego Arcade Retro Gratis">
  <meta name="twitter:description" content="El clásico rompebloques con física a 60 FPS, múltiples niveles, power-ups y estética synthwave.">
  <meta name="twitter:image" content="images/games/portada_rompebloques.jpg">

  <script type="application/ld+json">
${JSON.stringify(gameSchema, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(breadcrumbSchema, null, 2)}
  </script>

  <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="images/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>

  <style>
    :root {
      --bg-main: #0a0d14;
      --bg-surface: #121722;
      --bg-surface-hover: #182030;
      --border-subtle: rgba(255, 255, 255, 0.08);
      --border-medium: rgba(255, 255, 255, 0.16);
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --text-muted: #64748b;
      --accent-pink: #ec4899;
      --accent-cyan: #38bdf8;
      --accent-amber: #f59e0b;

      --font-ui: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-title: 'Cinzel', Georgia, serif;

      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --radius-full: 9999px;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-ui);
      background-color: var(--bg-main);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      line-height: 1.5;
      background-image: 
        radial-gradient(at 15% 15%, rgba(236, 72, 153, 0.14) 0px, transparent 45%),
        radial-gradient(at 85% 20%, rgba(56, 189, 248, 0.12) 0px, transparent 50%),
        radial-gradient(at 50% 85%, rgba(168, 85, 247, 0.08) 0px, transparent 55%);
      background-attachment: fixed;
      overflow-x: hidden;
    }

    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      width: 100%;
    }

    ${getHeaderCss()}

    .main-content {
      flex: 1;
      max-width: 920px;
      width: 100%;
      margin: 0 auto;
      padding: 1.5rem 1.25rem 4rem;
    }

    .breadcrumb-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      color: var(--text-muted);
      text-decoration: none;
      transition: color 0.2s;
    }
    .breadcrumb-link:hover {
      color: var(--text-primary);
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      padding: 0.65rem 1.4rem;
      border-radius: var(--radius-sm);
      background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
      color: #fff;
      font-weight: 700;
      font-size: 0.88rem;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(236, 72, 153, 0.35);
      transition: all 0.2s ease;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(236, 72, 153, 0.5);
    }

    .site-footer {
      margin-top: auto;
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      padding: 1.5rem 1.25rem;
      text-align: center;
      font-size: 0.82rem;
      color: var(--text-muted);
    }
    .footer-legal-links {
      margin-top: 0.75rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.65rem 0.85rem;
      font-size: 0.82rem;
    }
    .footer-legal-links a {
      color: var(--text-secondary, #cbd5e1);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .footer-legal-links a:hover {
      color: #c084fc;
      text-decoration: underline;
    }
    .footer-separator {
      color: var(--border-medium, rgba(255, 255, 255, 0.22));
      font-size: 0.75rem;
      user-select: none;
    }

  </style>
  <!-- Supabase SDK v2 & Desvarios Client -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/supabase-client.js"></script>
</head>
<body>
  <div class="app-container">
    ${getHeaderHtml('retro')}

    <!-- Main Content -->
    <main class="main-content">
      <div class="breadcrumb-nav" style="margin-bottom: 1.25rem;">
        <a href="desvarios-retro.html" class="breadcrumb-link">
          <span>←</span> <span>Volver a Desvaríos Retro</span>
        </a>
      </div>

      <header style="text-align: center; margin-bottom: 1.5rem;">
        <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.9rem; background: rgba(236, 72, 153, 0.12); border: 1px solid rgba(236, 72, 153, 0.35); border-radius: 9999px; color: #ec4899; font-size: 0.82rem; font-weight: 700; margin-bottom: 0.75rem;">
          <span>🧱</span>
          <span>Acción Arcade Rompebloques Neón</span>
        </div>
        <h1 style="font-family: var(--font-title); font-size: clamp(2rem, 4vw, 2.75rem); font-weight: 900; letter-spacing: 0.04em; margin-bottom: 0.5rem; background: linear-gradient(135deg, #fff 40%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          Rompebloques Neón
        </h1>
        <p style="color: var(--text-secondary); font-size: 0.95rem; max-width: 580px; margin: 0 auto;">
          Destruye los ladrillos cósmicos, recolecta cápsulas de energía y supera las 3 fases sin perder tus esferas de plasma.
        </p>
      </header>

      <!-- Status Header (Vidas, Nivel, Score, Record, Audio) -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem; padding: 0.75rem 1.25rem; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: 12px;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div id="lives-display" style="display: flex; align-items: center; gap: 0.35rem; font-size: 1.15rem;">
            <span>❤️</span><span>❤️</span><span>❤️</span>
          </div>
          <div id="level-badge" style="font-size: 0.85rem; font-weight: 800; color: #38bdf8; background: rgba(56, 189, 248, 0.12); padding: 0.25rem 0.65rem; border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.3);">
            Nivel 1 — El Muro Inicial
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="text-align: right;">
            <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">PUNTOS</div>
            <div id="score-display" style="font-family: monospace; font-size: 1.25rem; font-weight: 900; color: #ec4899;">
              00000
            </div>
          </div>

          <div style="text-align: right;">
            <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">RÉCORD</div>
            <div id="high-score-display" style="font-family: monospace; font-size: 1.25rem; font-weight: 900; color: #fbbf24;">
              00000
            </div>
          </div>

          <button id="btn-sound-toggle" onclick="app.toggleSound()" style="padding: 0.45rem 0.75rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); background: rgba(16, 185, 129, 0.15); color: #34d399; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.82rem; font-weight: 600;">
            <span>🔊 Sonido</span>
          </button>
        </div>
      </div>

      <!-- Arcade Box Frame -->
      <div style="position: relative; margin: 0 auto; padding: 12px; border-radius: 16px; background: linear-gradient(180deg, #181c24 0%, #0d1117 100%); border: 2px solid rgba(236, 72, 153, 0.35); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6), 0 0 35px rgba(236, 72, 153, 0.15); max-width: 664px;">
        <canvas id="game-canvas" width="640" height="480" style="display: block; width: 100%; height: auto; border-radius: 10px; border: 2px solid #232b3b; cursor: crosshair; touch-action: none;"></canvas>

        <!-- Start Overlay -->
        <div id="overlay-start" onclick="app.launchBall()" style="position: absolute; top: 60%; left: 50%; transform: translate(-50%, -50%); background: rgba(11, 15, 25, 0.85); border: 1.5px solid #38bdf8; border-radius: 12px; padding: 0.85rem 1.5rem; color: #38bdf8; font-weight: 800; font-size: 0.95rem; cursor: pointer; backdrop-filter: blur(8px); box-shadow: 0 0 25px rgba(56, 189, 248, 0.4); text-align: center;">
          🚀 Haz clic o pulsa [Espacio] para lanzar la bola
        </div>

        <!-- Game Over Overlay -->
        <div id="overlay-gameover" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(15, 10, 20, 0.92); border: 2px solid #ef4444; border-radius: 16px; padding: 1.5rem 2rem; text-align: center; color: #fff; backdrop-filter: blur(10px); box-shadow: 0 0 40px rgba(239, 68, 68, 0.4); max-width: 380px; width: 90%;">
          <div style="font-size: 1.5rem; font-weight: 900; color: #f87171; margin-bottom: 0.4rem;">💥 GAME OVER</div>
          <p id="gameover-score-text" style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem;">Puntuación final: 0 puntos</p>
          <button onclick="app.startNewGame()" class="btn-primary" style="background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%); color: #fff; padding: 0.65rem 1.4rem;">
            ↺ Jugar de nuevo
          </button>
        </div>

        <!-- Victory Overlay -->
        <div id="overlay-victory" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(10, 25, 20, 0.92); border: 2px solid #10b981; border-radius: 16px; padding: 1.5rem 2rem; text-align: center; color: #fff; backdrop-filter: blur(10px); box-shadow: 0 0 40px rgba(16, 185, 129, 0.4); max-width: 380px; width: 90%;">
          <div style="font-size: 1.5rem; font-weight: 900; color: #34d399; margin-bottom: 0.4rem;">🏆 ¡VICTORIA ABSOLUTA!</div>
          <p id="victory-score-text" style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem;">Has demolido todas las barreras de los 3 niveles.</p>
          <button onclick="app.startNewGame()" class="btn-primary" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #fff; padding: 0.65rem 1.4rem;">
            ↺ Jugar de nuevo
          </button>
        </div>
      </div>

      <!-- Mobile Controls (Lanzar y Disparo) -->
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; margin-top: 1rem; max-width: 664px; margin: 1rem auto 0;">
        <button type="button" onclick="app.launchBall()" style="flex: 1; padding: 0.6rem 1rem; border-radius: 8px; background: rgba(56, 189, 248, 0.15); border: 1.5px solid rgba(56, 189, 248, 0.4); color: #38bdf8; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
          🚀 Lanzar Bola
        </button>
        <button id="btn-mobile-laser" type="button" onclick="app.shootLaser()" style="display: none; flex: 1; padding: 0.6rem 1rem; border-radius: 8px; background: rgba(244, 63, 94, 0.2); border: 1.5px solid #f43f5e; color: #f43f5e; font-weight: 800; font-size: 0.85rem; cursor: pointer; box-shadow: 0 0 15px rgba(244, 63, 94, 0.4);">
          🔫 Disparar Láser
        </button>
      </div>

      <!-- Power-ups Guide -->
      <section style="margin-top: 2.5rem; padding: 1.5rem; border-radius: 12px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-subtle);">
        <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 0.85rem; display: flex; align-items: center; gap: 0.45rem; color: #ec4899;">
          <span>❓</span> <span>Cápsulas de Energía y Power-Ups</span>
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; font-size: 0.86rem; color: var(--text-secondary); line-height: 1.6;">
          <div>
            <strong style="color: #38bdf8;">⚡ Pala Ancha:</strong> Duplica el tamaño de tu pala para una defensa casi infranqueable.
          </div>
          <div>
            <strong style="color: #4ade80;">🎾 Multibola:</strong> Genera dos bolas extra simultáneas para multiplicar tu poder de destrucción.
          </div>
          <div>
            <strong style="color: #f43f5e;">🔫 Láser:</strong> Equipa cañones a la pala para disparar y reventar ladrillos con la barra espaciadora.
          </div>
          <div>
            <strong style="color: #06b6d4;">🛡️ Barrera Plasma:</strong> Levanta un suelo de energía que salva una bola caída.
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <!-- Pie de Página Unificado -->
  <footer class="site-footer">
    <p>© 2026 TusDesvarios.com — Portal de Entretenimiento, Ficción y Ocio Interactivo</p>
    <div class="footer-legal-links">
      <a href="aviso-legal.html">Aviso Legal</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-privacidad.html">Política de Privacidad</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-cookies.html">Política de Cookies</a>
    </div>
  </footer>
  </div>

  <script>
    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 480;

    const LEVEL_CONFIGS = [
      {
        name: 'Nivel 1 — El Muro Inicial',
        rows: 5,
        cols: 10,
        layout: [
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
          [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
          [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
          [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
        ]
      },
      {
        name: 'Nivel 2 — Fortaleza Piramidal',
        rows: 6,
        cols: 10,
        layout: [
          [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
          [0, 0, 0, 2, 1, 1, 2, 0, 0, 0],
          [0, 0, 3, 2, 2, 2, 2, 3, 0, 0],
          [0, 4, 3, 3, 3, 3, 3, 3, 4, 0],
          [5, 4, 4, 4, 4, 4, 4, 4, 4, 5],
          [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
        ]
      },
      {
        name: 'Nivel 3 — Núcleo de Titanes',
        rows: 7,
        cols: 10,
        layout: [
          [1, 9, 1, 1, 9, 9, 1, 1, 9, 1],
          [2, 2, 9, 2, 2, 2, 2, 9, 2, 2],
          [3, 3, 3, 9, 3, 3, 9, 3, 3, 3],
          [4, 4, 4, 4, 9, 9, 4, 4, 4, 4],
          [5, 9, 5, 5, 5, 5, 5, 5, 9, 5],
          [0, 5, 5, 0, 0, 0, 0, 5, 5, 0],
          [0, 0, 5, 5, 0, 0, 5, 5, 0, 0]
        ]
      }
    ];

    const app = {
      canvas: null,
      ctx: null,
      gameState: 'start',
      levelIndex: 0,
      score: 0,
      highScore: 0,
      lives: 3,
      soundEnabled: true,
      audioCtx: null,
      activeShield: false,
      laserCooldown: 0,

      paddle: {
        x: (CANVAS_WIDTH - 90) / 2,
        y: CANVAS_HEIGHT - 28,
        width: 90,
        height: 12,
        speed: 8,
        hasLaser: false
      },
      balls: [],
      bricks: [],
      powerUps: [],
      bullets: [],
      particles: [],
      keys: { left: false, right: false, space: false, mouseDown: false },

      init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        try {
          const saved = localStorage.getItem('rompebloques_high_score');
          if (saved) this.highScore = parseInt(saved, 10);
        } catch {}

        this.bindEvents();
        this.startNewGame();
        requestAnimationFrame(() => this.loop());
      },

      playSound(type) {
        if (!this.soundEnabled) return;
        try {
          const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
          if (!this.audioCtx) this.audioCtx = new AudioCtxClass();
          if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

          const ctx = this.audioCtx;
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          if (type === 'bounce') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.start(now);
            osc.stop(now + 0.04);
          } else if (type === 'paddle') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(540, now + 0.06);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
            osc.start(now);
            osc.stop(now + 0.06);
          } else if (type === 'brick') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(780, now + 0.05);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
          } else if (type === 'powerup') {
            const notes = [440, 554.37, 659.25, 880];
            notes.forEach((freq, idx) => {
              const nOsc = ctx.createOscillator();
              const nGain = ctx.createGain();
              nOsc.type = 'triangle';
              nOsc.frequency.setValueAtTime(freq, now + idx * 0.06);
              nGain.gain.setValueAtTime(0.18, now + idx * 0.06);
              nGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.15);
              nOsc.connect(nGain);
              nGain.connect(ctx.destination);
              nOsc.start(now + idx * 0.06);
              nOsc.stop(now + idx * 0.06 + 0.15);
            });
          } else if (type === 'laser') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(900, now);
            osc.frequency.exponentialRampToValueAtTime(250, now + 0.08);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
          } else if (type === 'lose') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(350, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
          } else if (type === 'win') {
            const notes = [523.25, 659.25, 783.99, 1046.5];
            notes.forEach((freq, idx) => {
              const nOsc = ctx.createOscillator();
              const nGain = ctx.createGain();
              nOsc.type = 'triangle';
              nOsc.frequency.setValueAtTime(freq, now + idx * 0.09);
              nGain.gain.setValueAtTime(0.2, now + idx * 0.09);
              nGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.22);
              nOsc.connect(nGain);
              nGain.connect(ctx.destination);
              nOsc.start(now + idx * 0.09);
              nOsc.stop(now + idx * 0.09 + 0.22);
            });
          }
        } catch {}
      },

      toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const btn = document.getElementById('btn-sound-toggle');
        if (this.soundEnabled) {
          btn.innerHTML = '<span>🔊 Sonido</span>';
          btn.style.color = '#34d399';
          btn.style.background = 'rgba(16, 185, 129, 0.15)';
        } else {
          btn.innerHTML = '<span>🔇 Mute</span>';
          btn.style.color = 'var(--text-muted)';
          btn.style.background = 'rgba(255, 255, 255, 0.05)';
        }
      },

      bindEvents() {
        window.addEventListener('keydown', (e) => {
          if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = true;
          if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = true;
          if (e.code === 'Space') {
            e.preventDefault();
            this.keys.space = true;
            this.launchBall();
          }
        });

        window.addEventListener('keyup', (e) => {
          if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = false;
          if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = false;
          if (e.code === 'Space') this.keys.space = false;
        });

        window.addEventListener('mouseup', () => {
          this.keys.mouseDown = false;
        });

        this.canvas.addEventListener('mousedown', (e) => {
          if (e.button !== 0) return;
          this.keys.mouseDown = true;
          if (this.balls.some(b => b.stuckToPaddle)) {
            this.launchBall();
          } else if (this.paddle.hasLaser) {
            if (this.laserCooldown <= 0) {
              this.shootLaser();
              this.laserCooldown = 14;
            }
          }
        });

        this.canvas.addEventListener('touchstart', () => {
          if (this.balls.some(b => b.stuckToPaddle)) {
            this.launchBall();
          } else if (this.paddle.hasLaser) {
            if (this.laserCooldown <= 0) {
              this.shootLaser();
              this.laserCooldown = 14;
            }
          }
        });

        this.canvas.addEventListener('mousemove', (e) => {
          const rect = this.canvas.getBoundingClientRect();
          const scaleX = CANVAS_WIDTH / rect.width;
          const mouseX = (e.clientX - rect.left) * scaleX;
          this.paddle.x = Math.max(0, Math.min(CANVAS_WIDTH - this.paddle.width, mouseX - this.paddle.width / 2));
        });

        this.canvas.addEventListener('touchmove', (e) => {
          if (e.touches.length === 0) return;
          const rect = this.canvas.getBoundingClientRect();
          const scaleX = CANVAS_WIDTH / rect.width;
          const touchX = (e.touches[0].clientX - rect.left) * scaleX;
          this.paddle.x = Math.max(0, Math.min(CANVAS_WIDTH - this.paddle.width, touchX - this.paddle.width / 2));
        });

        this.canvas.addEventListener('click', () => {
          if (this.balls.some(b => b.stuckToPaddle)) {
            this.launchBall();
          } else if (this.paddle.hasLaser) {
            if (this.laserCooldown <= 0) {
              this.shootLaser();
              this.laserCooldown = 14;
            }
          }
        });
      },

      initLevel(lvl) {
        this.levelIndex = lvl;
        const config = LEVEL_CONFIGS[lvl % LEVEL_CONFIGS.length];
        document.getElementById('level-badge').textContent = config.name;

        const brickWidth = 56;
        const brickHeight = 18;
        const paddingX = 7;
        const paddingY = 7;
        const offsetX = (CANVAS_WIDTH - (config.cols * (brickWidth + paddingX) - paddingX)) / 2;
        const offsetY = 50;

        const possiblePowerUps = ['expand', 'multiball', 'laser', 'shield', 'slow', 'life'];
        this.bricks = [];

        for (let r = 0; r < config.rows; r++) {
          for (let c = 0; c < config.cols; c++) {
            const type = config.layout[r][c];
            if (type === 0) continue;

            let color = '#38bdf8';
            let hits = 1;
            let points = 10;
            let isUnbreakable = false;

            if (type === 1) { color = '#ec4899'; hits = 3; points = 80; }
            else if (type === 2) { color = '#fb923c'; hits = 2; points = 50; }
            else if (type === 3) { color = '#facc15'; hits = 1; points = 30; }
            else if (type === 4) { color = '#4ade80'; hits = 1; points = 20; }
            else if (type === 5) { color = '#38bdf8'; hits = 1; points = 10; }
            else if (type === 9) { color = '#94a3b8'; hits = 999; points = 0; isUnbreakable = true; }

            let powerUp = null;
            if (!isUnbreakable && Math.random() < 0.22) {
              powerUp = possiblePowerUps[Math.floor(Math.random() * possiblePowerUps.length)];
            }

            this.bricks.push({
              x: offsetX + c * (brickWidth + paddingX),
              y: offsetY + r * (brickHeight + paddingY),
              width: brickWidth,
              height: brickHeight,
              color,
              hits,
              maxHits: hits,
              points,
              powerUp,
              isUnbreakable
            });
          }
        }

        this.paddle.x = (CANVAS_WIDTH - 90) / 2;
        this.paddle.width = 90;
        this.paddle.hasLaser = false;
        document.getElementById('btn-mobile-laser').style.display = 'none';

        this.balls = [{
          x: CANVAS_WIDTH / 2,
          y: CANVAS_HEIGHT - 40,
          vx: 4 * (Math.random() > 0.5 ? 1 : -1),
          vy: -5,
          radius: 6,
          stuckToPaddle: true,
          stuckOffset: 0
        }];

        this.powerUps = [];
        this.bullets = [];
        this.particles = [];
        this.activeShield = false;

        document.getElementById('overlay-start').style.display = 'block';
        document.getElementById('overlay-gameover').style.display = 'none';
        document.getElementById('overlay-victory').style.display = 'none';
      },

      startNewGame() {
        this.score = 0;
        this.lives = 3;
        this.gameState = 'start';
        this.updateHeader();
        this.initLevel(0);
      },

      updateHeader() {
        document.getElementById('score-display').textContent = String(this.score).padStart(5, '0');
        document.getElementById('high-score-display').textContent = String(this.highScore).padStart(5, '0');

        let hearts = '';
        for (let i = 0; i < 5; i++) {
          const op = i < this.lives ? '1' : '0.2';
          hearts += '<span style="opacity:' + op + ';">❤️</span>';
        }
        document.getElementById('lives-display').innerHTML = hearts;
      },

      launchBall() {
        if (this.balls.some(b => b.stuckToPaddle)) {
          this.balls.forEach(b => b.stuckToPaddle = false);
          this.gameState = 'playing';
          document.getElementById('overlay-start').style.display = 'none';
        }
      },

      shootLaser() {
        if (!this.paddle.hasLaser) return;
        const p = this.paddle;
        this.bullets.push({ x: p.x + 8, y: p.y - 4, vy: -7 });
        this.bullets.push({ x: p.x + p.width - 8, y: p.y - 4, vy: -7 });
        this.playSound('laser');
      },

      createExplosion(x, y, color) {
        for (let i = 0; i < 8; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 3 + 1;
          this.particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color,
            alpha: 1,
            size: Math.random() * 3 + 2
          });
        }
      },

      spawnPowerUp(x, y, type) {
        if (!type) return;
        const metaMap = {
          expand: { symbol: '⚡', color: '#38bdf8' },
          multiball: { symbol: '🎾', color: '#4ade80' },
          laser: { symbol: '🔫', color: '#f43f5e' },
          shield: { symbol: '🛡️', color: '#06b6d4' },
          slow: { symbol: '🐌', color: '#facc15' },
          life: { symbol: '❤️', color: '#ec4899' }
        };
        const meta = metaMap[type];
        this.powerUps.push({
          x, y, vy: 2.2, type, symbol: meta.symbol, color: meta.color
        });
      },

      applyPowerUp(type) {
        this.playSound('powerup');
        if (type === 'expand') {
          this.paddle.width = 130;
          setTimeout(() => { this.paddle.width = 90; }, 10000);
        } else if (type === 'multiball') {
          const existing = this.balls[0] || { x: this.paddle.x + this.paddle.width/2, y: this.paddle.y - 10, vx: 4, vy: -5, radius: 6 };
          this.balls.push(
            { x: existing.x, y: existing.y, vx: existing.vx - 2, vy: existing.vy, radius: 6 },
            { x: existing.x, y: existing.y, vx: existing.vx + 2, vy: existing.vy, radius: 6 }
          );
        } else if (type === 'laser') {
          this.paddle.hasLaser = true;
          document.getElementById('btn-mobile-laser').style.display = 'block';
          setTimeout(() => {
            this.paddle.hasLaser = false;
            document.getElementById('btn-mobile-laser').style.display = 'none';
          }, 9000);
        } else if (type === 'shield') {
          this.activeShield = true;
        } else if (type === 'slow') {
          this.balls.forEach(b => { b.vx *= 0.7; b.vy *= 0.7; });
        } else if (type === 'life') {
          this.lives = Math.min(5, this.lives + 1);
          this.updateHeader();
        }
      },

      loop() {
        const p = this.paddle;
        const balls = this.balls;
        const bricks = this.bricks;
        const powerUps = this.powerUps;
        const bullets = this.bullets;
        const particles = this.particles;

        // 1. UPDATE
        if (this.gameState === 'playing' || this.gameState === 'start') {
          if (this.keys.left) p.x = Math.max(0, p.x - p.speed);
          if (this.keys.right) p.x = Math.min(CANVAS_WIDTH - p.width, p.x + p.speed);

          if (p.hasLaser && (this.keys.space || this.keys.mouseDown)) {
            if (this.laserCooldown <= 0) {
              this.shootLaser();
              this.laserCooldown = 14;
            }
          }
          if (this.laserCooldown > 0) this.laserCooldown--;

          // Bullets
          for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            b.y += b.vy;
            if (b.y < 0) { bullets.splice(i, 1); continue; }

            for (let j = bricks.length - 1; j >= 0; j--) {
              const br = bricks[j];
              if (b.x >= br.x && b.x <= br.x + br.width && b.y >= br.y && b.y <= br.y + br.height) {
                bullets.splice(i, 1);
                if (!br.isUnbreakable) {
                  br.hits--;
                  if (br.hits <= 0) {
                    this.score += br.points;
                    this.updateHeader();
                    this.createExplosion(br.x + br.width/2, br.y + br.height/2, br.color);
                    if (br.powerUp) this.spawnPowerUp(br.x + br.width/2, br.y + br.height/2, br.powerUp);
                    bricks.splice(j, 1);
                  }
                }
                break;
              }
            }
          }

          // Balls
          for (let i = balls.length - 1; i >= 0; i--) {
            const b = balls[i];
            if (b.stuckToPaddle) {
              b.x = p.x + p.width/2 + (b.stuckOffset || 0);
              b.y = p.y - b.radius;
              continue;
            }

            b.x += b.vx;
            b.y += b.vy;

            // Walls
            if (b.x - b.radius < 0) {
              b.x = b.radius; b.vx = Math.abs(b.vx); this.playSound('bounce');
            } else if (b.x + b.radius > CANVAS_WIDTH) {
              b.x = CANVAS_WIDTH - b.radius; b.vx = -Math.abs(b.vx); this.playSound('bounce');
            }
            if (b.y - b.radius < 0) {
              b.y = b.radius; b.vy = Math.abs(b.vy); this.playSound('bounce');
            }

            // Paddle bounce
            if (
              b.y + b.radius >= p.y &&
              b.y - b.radius <= p.y + p.height &&
              b.x >= p.x - b.radius &&
              b.x <= p.x + p.width + b.radius &&
              b.vy > 0
            ) {
              const hitPos = (b.x - (p.x + p.width/2)) / (p.width/2);
              const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
              const maxAngle = Math.PI / 2.7;
              const angle = hitPos * maxAngle;
              b.vx = Math.sin(angle) * speed;
              b.vy = -Math.cos(angle) * speed;
              b.y = p.y - b.radius;
              this.playSound('paddle');
            }

            // Bricks bounce
            for (let j = bricks.length - 1; j >= 0; j--) {
              const br = bricks[j];
              if (
                b.x + b.radius >= br.x &&
                b.x - b.radius <= br.x + br.width &&
                b.y + b.radius >= br.y &&
                b.y - b.radius <= br.y + br.height
              ) {
                const overlapLeft = b.x + b.radius - br.x;
                const overlapRight = br.x + br.width - (b.x - b.radius);
                const overlapTop = b.y + b.radius - br.y;
                const overlapBottom = br.y + br.height - (b.y - b.radius);
                const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

                if (minOverlap === overlapLeft || minOverlap === overlapRight) b.vx = -b.vx;
                else b.vy = -b.vy;

                this.playSound('brick');

                if (!br.isUnbreakable) {
                  br.hits--;
                  if (br.hits <= 0) {
                    this.score += br.points;
                    this.updateHeader();
                    this.createExplosion(br.x + br.width/2, br.y + br.height/2, br.color);
                    if (br.powerUp) this.spawnPowerUp(br.x + br.width/2, br.y + br.height/2, br.powerUp);
                    bricks.splice(j, 1);
                  }
                }
                break;
              }
            }

            // Bottom exit
            if (b.y - b.radius > CANVAS_HEIGHT) {
              if (this.activeShield) {
                b.y = CANVAS_HEIGHT - b.radius - 8;
                b.vy = -Math.abs(b.vy);
                this.activeShield = false;
                this.playSound('bounce');
                continue;
              }
              balls.splice(i, 1);
            }
          }

          // Lose life
          if (balls.length === 0 && (this.gameState === 'playing' || this.gameState === 'start')) {
            this.playSound('lose');
            this.lives--;
            this.updateHeader();

            if (this.lives <= 0) {
              this.gameState = 'game_over';
              if (this.score > this.highScore) {
                this.highScore = this.score;
                try { localStorage.setItem('rompebloques_high_score', this.highScore.toString()); } catch {}
                this.updateHeader();
              }
              document.getElementById('gameover-score-text').textContent = 'Puntuación final: ' + this.score + ' puntos';
              document.getElementById('overlay-gameover').style.display = 'block';
            } else {
              this.balls = [{
                x: p.x + p.width/2,
                y: p.y - 6,
                vx: 4 * (Math.random() > 0.5 ? 1 : -1),
                vy: -5,
                radius: 6,
                stuckToPaddle: true,
                stuckOffset: 0
              }];
              this.gameState = 'start';
              document.getElementById('overlay-start').style.display = 'block';
            }
          }

          // PowerUps
          for (let i = powerUps.length - 1; i >= 0; i--) {
            const pu = powerUps[i];
            pu.y += pu.vy;

            if (pu.y + 10 >= p.y && pu.y - 10 <= p.y + p.height && pu.x + 12 >= p.x && pu.x - 12 <= p.x + p.width) {
              this.applyPowerUp(pu.type);
              powerUps.splice(i, 1);
              continue;
            }
            if (pu.y > CANVAS_HEIGHT) powerUps.splice(i, 1);
          }

          // Level clear
          const breakables = bricks.filter(b => !b.isUnbreakable).length;
          if (breakables === 0 && this.gameState === 'playing') {
            this.playSound('win');
            if (window.DesvariosAuth) {
              window.DesvariosAuth.unlockMedal('rompebloques-as');
            }
            try {
              confetti({
                particleCount: 90,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#ec4899', '#38bdf8', '#fbbf24', '#4ade80', '#ffffff']
              });
            } catch {}

            if (this.levelIndex + 1 < LEVEL_CONFIGS.length) {
              this.initLevel(this.levelIndex + 1);
              this.gameState = 'start';
            } else {
              this.gameState = 'victory';
              if (this.score > this.highScore) {
                this.highScore = this.score;
                try { localStorage.setItem('rompebloques_high_score', this.highScore.toString()); } catch {}
                this.updateHeader();
              }
              document.getElementById('victory-score-text').textContent = 'Has demolido todas las barreras de los 3 niveles con ' + this.score + ' puntos.';
              document.getElementById('overlay-victory').style.display = 'block';
            }
          }
        }

        // Particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const pt = particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.alpha -= 0.025;
          if (pt.alpha <= 0) particles.splice(i, 1);
        }

        // 2. RENDER
        const ctx = this.ctx;
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        bgGrad.addColorStop(0, '#0a0e17');
        bgGrad.addColorStop(1, '#121824');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
        ctx.lineWidth = 1;
        for (let x = 0; x < CANVAS_WIDTH; x += 32) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_HEIGHT); ctx.stroke();
        }
        for (let y = 0; y < CANVAS_HEIGHT; y += 32) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_WIDTH, y); ctx.stroke();
        }

        if (this.activeShield) {
          ctx.fillStyle = 'rgba(6, 182, 212, 0.5)';
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 12;
          ctx.fillRect(0, CANVAS_HEIGHT - 6, CANVAS_WIDTH, 6);
          ctx.shadowBlur = 0;
        }

        bricks.forEach(b => {
          ctx.fillStyle = b.color;
          ctx.shadowColor = b.color;
          ctx.shadowBlur = b.isUnbreakable ? 2 : 8;
          ctx.beginPath();
          ctx.roundRect(b.x, b.y, b.width, b.height, 3);
          ctx.fill();

          ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.fillRect(b.x + 2, b.y + 2, b.width - 4, 3);

          if (b.hits > 1 && !b.isUnbreakable) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(b.hits, b.x + b.width/2, b.y + b.height/2 + 3);
          }
        });
        ctx.shadowBlur = 0;

        powerUps.forEach(pu => {
          ctx.fillStyle = pu.color;
          ctx.shadowColor = pu.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.roundRect(pu.x - 12, pu.y - 7, 24, 14, 7);
          ctx.fill();

          ctx.fillStyle = '#000';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(pu.symbol, pu.x, pu.y + 3);
        });
        ctx.shadowBlur = 0;

        bullets.forEach(b => {
          ctx.fillStyle = '#f43f5e';
          ctx.shadowColor = '#f43f5e';
          ctx.shadowBlur = 8;
          ctx.fillRect(b.x - 2, b.y, 4, 10);
        });
        ctx.shadowBlur = 0;

        ctx.fillStyle = p.hasLaser ? '#f43f5e' : '#ec4899';
        ctx.shadowColor = p.hasLaser ? '#f43f5e' : '#ec4899';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, p.width, p.height, 6);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(p.x + 6, p.y + 2, p.width - 12, 3);

        if (p.hasLaser) {
          ctx.fillStyle = '#fff';
          ctx.fillRect(p.x + 4, p.y - 3, 4, 4);
          ctx.fillRect(p.x + p.width - 8, p.y - 3, 4, 4);
        }
        ctx.shadowBlur = 0;

        balls.forEach(b => {
          ctx.fillStyle = '#fff';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.shadowBlur = 0;

        particles.forEach(pt => {
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = pt.alpha;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        requestAnimationFrame(() => this.loop());
      }
    };

    document.addEventListener('DOMContentLoaded', () => {
      app.init();
    });
  </script>
  <script src="js/cookie-banner.js"></script>
</body>
</html>`;
}

// Save standalone Rompebloques Game
const rompebloquesOut = path.join(__dirname, '..', 'juego-rompebloques.html');
fs.writeFileSync(rompebloquesOut, generateRompebloquesHtml(), 'utf8');

// ==========================================================
// 7E. GENERATE JUEGO-INVASORES.HTML
function generateInvadersHtml() {
  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Invasores del Espacio (Defensa Cósmica)',
    description: 'El legendario matamarcianos arcade retro reinventado con estética synthwave neón, 60 FPS, búnkeres destructibles, nave nodriza misteriosa y sonido 8-bit.',
    url: 'https://tusdesvarios.com/juego-invasores.html',
    genre: ['Arcade', 'Action', 'Shoot em up', 'Space Shooter', 'Retro Arcade'],
    playMode: 'SinglePlayer',
    applicationCategory: 'Game',
    inLanguage: 'es',
    image: 'https://tusdesvarios.com/images/games/portada_invasores.jpg',
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
        name: 'Invasores del Espacio',
        item: 'https://tusdesvarios.com/juego-invasores.html'
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invasores del Espacio (Defensa Cósmica) — Juego Arcade Gratis | TusDesvarios.com</title>
  <meta name="description" content="Juega gratis a Invasores del Espacio: el mítico matamarcianos retro arcade reinventado con estética synthwave neón, 60 FPS, búnkeres destructibles, nave nodriza de bonificación y sonido 8-bit.">
  <meta name="keywords" content="juego marcianos gratis, invasores del espacio online, matamarcianos retro, space shooter arcade, alien invaders gratis, tus desvarios">
  
  <link rel="canonical" href="https://tusdesvarios.com/juego-invasores.html">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Invasores del Espacio (Defensa Cósmica) | Tus Desvaríos">
  <meta property="og:description" content="Defiende la órbita de hordas alienígenas con tu cañón de plasma. ¡Juega gratis en tu navegador!">
  <meta property="og:url" content="https://tusdesvarios.com/juego-invasores.html">
  <meta property="og:image" content="images/games/portada_invasores.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Invasores del Espacio — Juego Arcade Retro Gratis">
  <meta name="twitter:description" content="El clásico matamarcianos arcade con física a 60 FPS, oleadas progresivas y estética synthwave.">
  <meta name="twitter:image" content="images/games/portada_invasores.jpg">

  <script type="application/ld+json">
${JSON.stringify(gameSchema, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(breadcrumbSchema, null, 2)}
  </script>

  <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="images/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>

  <style>
    :root {
      --bg-main: #0a0e17;
      --bg-card: #121824;
      --bg-card-hover: #182234;
      --border-subtle: rgba(255, 255, 255, 0.08);
      --border-accent: #06b6d4;
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --text-muted: #64748b;
      --accent: #06b6d4;
      --accent-glow: rgba(6, 182, 212, 0.35);
      --font-title: 'Cinzel', serif;
      --font-body: 'Inter', sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-main);
      color: var(--text-primary);
      font-family: var(--font-body);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      line-height: 1.5;
    }

    .site-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    /* Header */
    ${getHeaderCss()}

    .main-content {
      max-width: 920px;
      width: 100%;
      margin: 0 auto;
      padding: 1.5rem 1rem 4rem;
      flex: 1;
    }

    .breadcrumb-nav {
      margin-bottom: 1.25rem;
    }
    .breadcrumb-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      transition: color 0.2s;
    }
    .breadcrumb-link:hover {
      color: var(--accent);
    }

    /* Footer */
    .site-footer {
      border-top: 1px solid var(--border-subtle);
      padding: 1.5rem;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.82rem;
      margin-top: auto;
    }
    .footer-legal-links {
      margin-top: 0.75rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.65rem 0.85rem;
      font-size: 0.82rem;
    }
    .footer-legal-links a {
      color: var(--text-secondary, #cbd5e1);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .footer-legal-links a:hover {
      color: #c084fc;
      text-decoration: underline;
    }
    .footer-separator {
      color: var(--border-medium, rgba(255, 255, 255, 0.22));
      font-size: 0.75rem;
      user-select: none;
    }


    @media (max-width: 640px) {
      .header-container { flex-direction: column; align-items: flex-start; }
      .nav-links { width: 100%; justify-content: flex-start; overflow-x: auto; padding-bottom: 0.25rem; }
    }
  </style>
  <!-- Supabase SDK v2 & Desvarios Client -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/supabase-client.js"></script>
</head>
<body>
  <div class="site-wrapper">
    ${getHeaderHtml('retro')}

    <!-- Main Content -->
    <main class="main-content">
      <div class="breadcrumb-nav">
        <a href="desvarios-retro.html" class="breadcrumb-link">
          <span>←</span> <span>Volver a Desvaríos Retro</span>
        </a>
      </div>

      <header style="text-align: center; margin-bottom: 1.5rem;">
        <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.9rem; background: rgba(6, 182, 212, 0.12); border: 1px solid rgba(6, 182, 212, 0.35); border-radius: 9999px; color: #06b6d4; font-size: 0.82rem; font-weight: 700; margin-bottom: 0.75rem;">
          <span>👾</span>
          <span>Acción Arcade Matamarcianos Retro</span>
        </div>
        <h1 style="font-family: var(--font-title); font-size: clamp(2rem, 4vw, 2.75rem); font-weight: 900; letter-spacing: 0.04em; margin-bottom: 0.5rem; background: linear-gradient(135deg, #fff 40%, #06b6d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          Invasores del Espacio (Defensa Cósmica)
        </h1>
        <p style="color: var(--text-secondary); font-size: 0.95rem; max-width: 580px; margin: 0 auto;">
          Defiende la órbita de las oleadas alienígenas, utiliza los búnkeres de plasma y derriba la nave nodriza de bonificación.
        </p>
      </header>

      <!-- Controls Bar -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem; padding: 0.75rem 1.25rem; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: 12px;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div id="lives-display" style="display: flex; align-items: center; gap: 0.35rem; font-size: 1.15rem;">
            <span>🚀</span><span>🚀</span><span>🚀</span>
          </div>
          <div id="wave-badge" style="font-size: 0.85rem; font-weight: 800; color: #06b6d4; background: rgba(6, 182, 212, 0.12); padding: 0.25rem 0.65rem; border-radius: 6px; border: 1px solid rgba(6, 182, 212, 0.3);">
            Oleada 1
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="text-align: right;">
            <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">PUNTOS</div>
            <div id="score-display" style="font-family: monospace; font-size: 1.25rem; font-weight: 900; color: #06b6d4;">00000</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">RÉCORD</div>
            <div id="highscore-display" style="font-family: monospace; font-size: 1.25rem; font-weight: 900; color: #fbbf24;">00000</div>
          </div>

          <button id="btn-sound" onclick="invadersApp.toggleSound()" style="padding: 0.45rem 0.75rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); background: rgba(16, 185, 129, 0.15); color: #34d399; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.82rem; font-weight: 600;">
            <span id="sound-icon">🔊</span> <span id="sound-text">Sonido</span>
          </button>
        </div>
      </div>

      <!-- Arcade Frame -->
      <div style="position: relative; margin: 0 auto; padding: 12px; border-radius: 16px; background: linear-gradient(180deg, #181c24 0%, #0d1117 100%); border: 2px solid rgba(6, 182, 212, 0.35); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6), 0 0 35px rgba(6, 182, 212, 0.15); max-width: 664px;">
        <canvas id="game-canvas" width="640" height="480" style="display: block; width: 100%; height: auto; border-radius: 10px; border: 2px solid #232b3b; cursor: crosshair; touch-action: none;"></canvas>

        <!-- Start Overlay -->
        <div id="overlay-start" onclick="invadersApp.startGame()" style="position: absolute; top: 60%; left: 50%; transform: translate(-50%, -50%); background: rgba(11, 15, 25, 0.88); border: 1.5px solid #06b6d4; border-radius: 12px; padding: 0.85rem 1.5rem; color: #06b6d4; font-weight: 800; font-size: 0.95rem; cursor: pointer; backdrop-filter: blur(8px); box-shadow: 0 0 25px rgba(6, 182, 212, 0.4); text-align: center;">
          🚀 Haz clic o pulsa [Espacio] para iniciar la defensa
        </div>

        <!-- Game Over Overlay -->
        <div id="overlay-gameover" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(15, 10, 20, 0.92); border: 2px solid #ef4444; border-radius: 16px; padding: 1.5rem 2rem; text-align: center; color: #fff; backdrop-filter: blur(10px); box-shadow: 0 0 40px rgba(239, 68, 68, 0.4); max-width: 380px; width: 90%;">
          <div style="font-size: 1.5rem; font-weight: 900; color: #f87171; margin-bottom: 0.4rem;">💥 INVASIÓN COMPLETADA</div>
          <p id="gameover-score-text" style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem;">Puntuación final: 0 puntos</p>
          <button onclick="invadersApp.startNewGame()" style="background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%); color: #fff; border: none; padding: 0.65rem 1.4rem; border-radius: 8px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem;">
            <span>🔄</span> <span>Jugar de nuevo</span>
          </button>
        </div>
      </div>

      <!-- Mobile Button -->
      <div style="margin-top: 1rem; text-align: center;">
        <button type="button" onclick="invadersApp.shootPlayerBullet()" style="width: 100%; max-width: 664px; padding: 0.75rem 1rem; border-radius: 10px; background: rgba(6, 182, 212, 0.15); border: 1.5px solid #06b6d4; color: #06b6d4; font-weight: 800; font-size: 0.92rem; cursor: pointer; box-shadow: 0 0 15px rgba(6, 182, 212, 0.3); display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;">
          <span>⚡</span> <span>Disparar Cañón Láser</span>
        </button>
      </div>

      <!-- Guide -->
      <section style="margin-top: 2.5rem; padding: 1.5rem; border-radius: 12px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-subtle);">
        <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 0.85rem; display: flex; align-items: center; gap: 0.45rem; color: #06b6d4;">
          <span>❓</span> <span>Tabla de Invasores y Defensas</span>
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; font-size: 0.86rem; color: var(--text-secondary); line-height: 1.6;">
          <div>
            <strong style="color: #ec4899;">👾 Comandante Cósmico:</strong> 30 puntos. Fila superior, dispara ráfagas de plasma.
          </div>
          <div>
            <strong style="color: #06b6d4;">🛸 Destructor de Plasma:</strong> 20 puntos. Filas intermedias con blindaje reforzado.
          </div>
          <div>
            <strong style="color: #4ade80;">⚡ Drone de Vanguardia:</strong> 10 puntos. Filas de asalto frontal.
          </div>
          <div>
            <strong style="color: #f43f5e;">🛸 Nave Nodriza Misteriosa:</strong> 100 a 300 puntos de bonificación secreta al derribarla.
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <!-- Pie de Página Unificado -->
  <footer class="site-footer">
    <p>© 2026 TusDesvarios.com — Portal de Entretenimiento, Ficción y Ocio Interactivo</p>
    <div class="footer-legal-links">
      <a href="aviso-legal.html">Aviso Legal</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-privacidad.html">Política de Privacidad</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-cookies.html">Política de Cookies</a>
    </div>
  </footer>
  </div>

  <script>
    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 480;

    const invadersApp = {
      canvas: null,
      ctx: null,
      gameState: 'start',
      score: 0,
      highScore: 0,
      lives: 3,
      wave: 1,
      soundEnabled: true,
      audioCtx: null,

      player: {
        x: (CANVAS_WIDTH - 36) / 2,
        y: CANVAS_HEIGHT - 32,
        width: 36,
        height: 18,
        speed: 6.5,
        cooldown: 0
      },

      invaders: [],
      invaderDir: 1,
      invaderStepTimer: 0,
      invaderAnimFrame: 0,
      marchNoteIndex: 0,

      bullets: [],
      bunkers: [],
      particles: [],

      mystery: {
        x: -50,
        y: 35,
        width: 44,
        height: 18,
        vx: 2.2,
        active: false
      },
      mysterySpawnTimer: 0,

      keys: { left: false, right: false, space: false, mouseDown: false },

      init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        try {
          const saved = localStorage.getItem('invasores_high_score');
          if (saved) this.highScore = parseInt(saved, 10);
        } catch(e) {}

        this.bindEvents();
        this.startNewGame();
        requestAnimationFrame(() => this.loop());
      },

      playSound(type) {
        if (!this.soundEnabled) return;
        try {
          const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
          if (!this.audioCtx) this.audioCtx = new AudioCtxClass();
          if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

          const ctx = this.audioCtx;
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          if (type === 'shoot') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(110, now + 0.09);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
            osc.start(now);
            osc.stop(now + 0.09);
          } else if (type === 'invader_hit') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.linearRampToValueAtTime(60, now + 0.08);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
          } else if (type === 'player_hit') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            osc.start(now);
            osc.stop(now + 0.35);
          } else if (type === 'march') {
            const notes = [165, 147, 131, 116];
            const freq = notes[this.marchNoteIndex % notes.length];
            this.marchNoteIndex++;
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.14, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
            osc.start(now);
            osc.stop(now + 0.06);
          } else if (type === 'ufo') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(580, now);
            osc.frequency.linearRampToValueAtTime(880, now + 0.12);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
          } else if (type === 'win') {
            const notes = [440, 554, 659, 880];
            notes.forEach((freq, idx) => {
              const nOsc = ctx.createOscillator();
              const nGain = ctx.createGain();
              nOsc.type = 'triangle';
              nOsc.frequency.setValueAtTime(freq, now + idx * 0.08);
              nGain.gain.setValueAtTime(0.18, now + idx * 0.08);
              nGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.18);
              nOsc.connect(nGain);
              nGain.connect(ctx.destination);
              nOsc.start(now + idx * 0.08);
              nOsc.stop(now + idx * 0.08 + 0.18);
            });
          } else if (type === 'game_over') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(260, now);
            osc.frequency.exponentialRampToValueAtTime(65, now + 0.45);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
            osc.start(now);
            osc.stop(now + 0.45);
          }
        } catch(e) {}
      },

      toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const icon = document.getElementById('sound-icon');
        const text = document.getElementById('sound-text');
        const btn = document.getElementById('btn-sound');
        if (this.soundEnabled) {
          icon.textContent = '🔊';
          text.textContent = 'Sonido';
          btn.style.background = 'rgba(16, 185, 129, 0.15)';
          btn.style.color = '#34d399';
        } else {
          icon.textContent = '🔇';
          text.textContent = 'Mute';
          btn.style.background = 'rgba(255, 255, 255, 0.05)';
          btn.style.color = 'var(--text-muted)';
        }
      },

      bindEvents() {
        window.addEventListener('keydown', (e) => {
          if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = true;
          if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = true;
          if (e.code === 'Space') {
            e.preventDefault();
            this.keys.space = true;
            if (this.gameState === 'start') this.startGame();
          }
        });

        window.addEventListener('keyup', (e) => {
          if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = false;
          if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = false;
          if (e.code === 'Space') this.keys.space = false;
        });

        window.addEventListener('mouseup', () => {
          this.keys.mouseDown = false;
        });

        this.canvas.addEventListener('mousedown', (e) => {
          if (e.button !== 0) return;
          this.keys.mouseDown = true;
          if (this.gameState === 'start') this.startGame();
          this.shootPlayerBullet();
        });

        this.canvas.addEventListener('mousemove', (e) => {
          const rect = this.canvas.getBoundingClientRect();
          const scaleX = CANVAS_WIDTH / rect.width;
          const mouseX = (e.clientX - rect.left) * scaleX;
          this.player.x = Math.max(10, Math.min(CANVAS_WIDTH - this.player.width - 10, mouseX - this.player.width / 2));
        });

        this.canvas.addEventListener('touchmove', (e) => {
          if (e.touches.length === 0) return;
          const rect = this.canvas.getBoundingClientRect();
          const scaleX = CANVAS_WIDTH / rect.width;
          const touchX = (e.touches[0].clientX - rect.left) * scaleX;
          this.player.x = Math.max(10, Math.min(CANVAS_WIDTH - this.player.width - 10, touchX - this.player.width / 2));
        });

        this.canvas.addEventListener('touchstart', () => {
          if (this.gameState === 'start') this.startGame();
          this.shootPlayerBullet();
        });
      },

      startGame() {
        this.gameState = 'playing';
        document.getElementById('overlay-start').style.display = 'none';
      },

      startNewGame() {
        this.score = 0;
        this.lives = 3;
        this.wave = 1;
        this.player.x = (CANVAS_WIDTH - 36) / 2;
        this.initWave(1);
        this.gameState = 'start';
        this.updateHeader();
        document.getElementById('overlay-start').style.display = 'block';
        document.getElementById('overlay-gameover').style.display = 'none';
      },

      initBunkers() {
        const blocks = [];
        const bunkerCount = 4;
        const bunkerWidth = 48;
        const bunkerHeight = 32;
        const blockRows = 4;
        const blockCols = 6;
        const blockW = bunkerWidth / blockCols;
        const blockH = bunkerHeight / blockRows;

        const spacing = (CANVAS_WIDTH - (bunkerCount * bunkerWidth)) / (bunkerCount + 1);
        const startY = CANVAS_HEIGHT - 95;

        for (let b = 0; b < bunkerCount; b++) {
          const bx = spacing + b * (bunkerWidth + spacing);
          for (let r = 0; r < blockRows; r++) {
            for (let c = 0; c < blockCols; c++) {
              if (r === 0 && (c === 0 || c === blockCols - 1)) continue;
              if (r === blockRows - 1 && (c === 2 || c === 3)) continue;
              blocks.push({
                x: bx + c * blockW,
                y: startY + r * blockH,
                width: blockW,
                height: blockH,
                hp: 3
              });
            }
          }
        }
        this.bunkers = blocks;
      },

      initWave(w) {
        this.wave = w;
        const rows = 5;
        const cols = 9;
        const invWidth = 26;
        const invHeight = 18;
        const padX = 14;
        const padY = 14;
        const startX = (CANVAS_WIDTH - (cols * (invWidth + padX) - padX)) / 2;
        const startY = 65 + Math.min(30, (w - 1) * 8);

        const list = [];
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            let type = 2;
            let points = 10;
            let color = '#4ade80';

            if (r === 0) {
              type = 0;
              points = 30;
              color = '#ec4899';
            } else if (r === 1 || r === 2) {
              type = 1;
              points = 20;
              color = '#06b6d4';
            }

            list.push({
              x: startX + c * (invWidth + padX),
              y: startY + r * (invHeight + padY),
              width: invWidth,
              height: invHeight,
              type,
              points,
              color,
              alive: true
            });
          }
        }

        this.invaders = list;
        this.invaderDir = 1;
        this.invaderStepTimer = 0;
        this.invaderAnimFrame = 0;
        this.bullets = [];
        this.particles = [];
        this.mystery.active = false;
        this.mysterySpawnTimer = 0;
        this.initBunkers();
        this.updateHeader();
      },

      updateHeader() {
        let heartsHtml = '';
        for (let i = 0; i < 3; i++) {
          heartsHtml += '<span style="opacity: ' + (i < this.lives ? '1' : '0.2') + '; filter: ' + (i < this.lives ? 'drop-shadow(0 0 6px rgba(6,182,212,0.8))' : 'none') + ';">🚀</span>';
        }
        document.getElementById('lives-display').innerHTML = heartsHtml;
        document.getElementById('wave-badge').textContent = 'Oleada ' + this.wave;
        document.getElementById('score-display').textContent = String(this.score).padStart(5, '0');
        document.getElementById('highscore-display').textContent = String(this.highScore).padStart(5, '0');
      },

      shootPlayerBullet() {
        if (this.player.cooldown <= 0) {
          this.bullets.push({
            x: this.player.x + this.player.width / 2,
            y: this.player.y - 6,
            vy: -7.5,
            isEnemy: false
          });
          this.player.cooldown = 14;
          this.playSound('shoot');
        }
      },

      createExplosion(x, y, color, count = 10) {
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 3.5 + 1;
          this.particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color,
            alpha: 1,
            size: Math.random() * 3 + 1.5
          });
        }
      },

      loop() {
        const player = this.player;
        const invaders = this.invaders;
        const bullets = this.bullets;
        const bunkers = this.bunkers;
        const particles = this.particles;
        const mystery = this.mystery;

        // 1. UPDATE
        if (this.gameState === 'playing') {
          if (this.keys.left) player.x = Math.max(10, player.x - player.speed);
          if (this.keys.right) player.x = Math.min(CANVAS_WIDTH - player.width - 10, player.x + player.speed);

          if (this.keys.space || this.keys.mouseDown) {
            this.shootPlayerBullet();
          }
          if (player.cooldown > 0) player.cooldown--;

          const aliveInvaders = invaders.filter(inv => inv.alive);
          const aliveCount = aliveInvaders.length;

          if (aliveCount === 0) {
            this.playSound('win');
            try {
              confetti({
                particleCount: 90,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#06b6d4', '#ec4899', '#4ade80', '#fbbf24', '#ffffff']
              });
            } catch(e) {}
            this.initWave(this.wave + 1);
          } else {
            const stepInterval = Math.max(4, Math.floor((aliveCount / 45) * 32));
            this.invaderStepTimer++;
            if (this.invaderStepTimer >= stepInterval) {
              this.invaderStepTimer = 0;
              this.invaderAnimFrame = 1 - this.invaderAnimFrame;
              this.playSound('march');

              let hitEdge = false;
              for (const inv of aliveInvaders) {
                if ((this.invaderDir > 0 && inv.x + inv.width >= CANVAS_WIDTH - 20) || (this.invaderDir < 0 && inv.x <= 20)) {
                  hitEdge = true;
                  break;
                }
              }

              if (hitEdge) {
                this.invaderDir *= -1;
                for (const inv of aliveInvaders) {
                  inv.y += 14;
                  if (inv.y + inv.height >= player.y - 10) {
                    this.playSound('game_over');
                    this.gameState = 'game_over';
                    if (this.score > this.highScore) {
                      this.highScore = this.score;
                      try { localStorage.setItem('invasores_high_score', this.highScore.toString()); } catch(e) {}
                    }
                    document.getElementById('gameover-score-text').textContent = 'Puntuación final: ' + this.score + ' puntos (Oleada ' + this.wave + ')';
                    document.getElementById('overlay-gameover').style.display = 'block';
                  }
                }
              } else {
                for (const inv of aliveInvaders) {
                  inv.x += this.invaderDir * 8;
                }
              }
            }

            if (Math.random() < 0.035 && bullets.filter(b => b.isEnemy).length < 5) {
              const shooter = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)];
              bullets.push({
                x: shooter.x + shooter.width / 2,
                y: shooter.y + shooter.height,
                vy: 3.5,
                isEnemy: true
              });
            }
          }

          // Mystery ship
          this.mysterySpawnTimer++;
          if (this.mysterySpawnTimer > 750 && !mystery.active) {
            this.mysterySpawnTimer = 0;
            if (Math.random() < 0.5) {
              mystery.active = true;
              mystery.x = -mystery.width;
              mystery.vx = 2.2;
              this.playSound('ufo');
            }
          }

          if (mystery.active) {
            mystery.x += mystery.vx;
            if (mystery.x > CANVAS_WIDTH + 20) mystery.active = false;
          }

          // Bullets
          for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            b.y += b.vy;

            if (b.y < 0 || b.y > CANVAS_HEIGHT) {
              bullets.splice(i, 1);
              continue;
            }

            let hitBunker = false;
            for (let k = bunkers.length - 1; k >= 0; k--) {
              const blk = bunkers[k];
              if (b.x >= blk.x && b.x <= blk.x + blk.width && b.y >= blk.y && b.y <= blk.y + blk.height) {
                blk.hp--;
                if (blk.hp <= 0) bunkers.splice(k, 1);
                this.createExplosion(blk.x + blk.width/2, blk.y + blk.height/2, '#06b6d4', 4);
                bullets.splice(i, 1);
                hitBunker = true;
                break;
              }
            }
            if (hitBunker) continue;

            if (!b.isEnemy) {
              let hitInv = false;
              for (const inv of invaders) {
                if (inv.alive && b.x >= inv.x && b.x <= inv.x + inv.width && b.y >= inv.y && b.y <= inv.y + inv.height) {
                  inv.alive = false;
                  bullets.splice(i, 1);
                  this.score += inv.points;
                  this.updateHeader();
                  if (this.score >= 500 && window.DesvariosAuth) {
                    window.DesvariosAuth.unlockMedal('invasores-defensor');
                  }
                  this.createExplosion(inv.x + inv.width/2, inv.y + inv.height/2, inv.color, 12);
                  this.playSound('invader_hit');
                  hitInv = true;
                  break;
                }
              }
              if (hitInv) continue;

              if (mystery.active && b.x >= mystery.x && b.x <= mystery.x + mystery.width && b.y >= mystery.y && b.y <= mystery.y + mystery.height) {
                mystery.active = false;
                bullets.splice(i, 1);
                const mysteryPts = [100, 150, 200, 300][Math.floor(Math.random() * 4)];
                this.score += mysteryPts;
                this.updateHeader();
                this.createExplosion(mystery.x + mystery.width/2, mystery.y + mystery.height/2, '#f43f5e', 20);
                this.playSound('invader_hit');
                continue;
              }
            } else {
              if (b.x >= player.x && b.x <= player.x + player.width && b.y >= player.y && b.y <= player.y + player.height) {
                bullets.splice(i, 1);
                this.createExplosion(player.x + player.width/2, player.y + player.height/2, '#06b6d4', 24);
                this.playSound('player_hit');
                this.lives--;
                this.updateHeader();

                if (this.lives <= 0) {
                  this.playSound('game_over');
                  this.gameState = 'game_over';
                  if (this.score > this.highScore) {
                    this.highScore = this.score;
                    try { localStorage.setItem('invasores_high_score', this.highScore.toString()); } catch(e) {}
                  }
                  document.getElementById('gameover-score-text').textContent = 'Puntuación final: ' + this.score + ' puntos (Oleada ' + this.wave + ')';
                  document.getElementById('overlay-gameover').style.display = 'block';
                } else {
                  player.x = (CANVAS_WIDTH - 36) / 2;
                }
                continue;
              }
            }
          }
        }

        // Particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const pt = particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.alpha -= 0.028;
          if (pt.alpha <= 0) particles.splice(i, 1);
        }

        // 2. RENDER
        const ctx = this.ctx;
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        bgGrad.addColorStop(0, '#060913');
        bgGrad.addColorStop(1, '#0e1422');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, CANVAS_HEIGHT - 12);
        ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - 12);
        ctx.stroke();

        // Bunkers
        bunkers.forEach(blk => {
          const alpha = blk.hp === 3 ? 1.0 : blk.hp === 2 ? 0.7 : 0.4;
          ctx.fillStyle = 'rgba(6, 182, 212, ' + alpha + ')';
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 4;
          ctx.fillRect(blk.x, blk.y, blk.width, blk.height);
        });
        ctx.shadowBlur = 0;

        // Invaders
        const animFrame = this.invaderAnimFrame;
        invaders.forEach(inv => {
          if (!inv.alive) return;
          ctx.fillStyle = inv.color;
          ctx.shadowColor = inv.color;
          ctx.shadowBlur = 8;

          const ix = inv.x;
          const iy = inv.y;
          const iw = inv.width;
          const ih = inv.height;

          if (inv.type === 0) {
            ctx.beginPath();
            ctx.roundRect(ix + 4, iy + 2, iw - 8, ih - 4, 3);
            ctx.fill();
            ctx.fillRect(ix + 2, iy, 4, 4);
            ctx.fillRect(ix + iw - 6, iy, 4, 4);
            ctx.fillStyle = '#000';
            ctx.fillRect(ix + 7, iy + 6, 3, 3);
            ctx.fillRect(ix + iw - 10, iy + 6, 3, 3);
            ctx.fillStyle = inv.color;
            if (animFrame === 0) {
              ctx.fillRect(ix, iy + ih - 4, 4, 4);
              ctx.fillRect(ix + iw - 4, iy + ih - 4, 4, 4);
            } else {
              ctx.fillRect(ix, iy + 4, 4, 4);
              ctx.fillRect(ix + iw - 4, iy + 4, 4, 4);
            }
          } else if (inv.type === 1) {
            ctx.beginPath();
            ctx.roundRect(ix + 3, iy + 3, iw - 6, ih - 5, 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.fillRect(ix + 6, iy + 6, 3, 3);
            ctx.fillRect(ix + iw - 9, iy + 6, 3, 3);
            ctx.fillStyle = inv.color;
            if (animFrame === 0) {
              ctx.fillRect(ix + 1, iy + ih - 3, 4, 4);
              ctx.fillRect(ix + iw - 5, iy + ih - 3, 4, 4);
            } else {
              ctx.fillRect(ix + 3, iy + ih - 2, 4, 3);
              ctx.fillRect(ix + iw - 7, iy + ih - 2, 4, 3);
            }
          } else {
            ctx.beginPath();
            ctx.roundRect(ix + 5, iy + 2, iw - 10, ih - 4, 4);
            ctx.fill();
            ctx.fillRect(ix + iw / 2 - 2, iy, 4, 3);
            ctx.fillStyle = '#000';
            ctx.fillRect(ix + 8, iy + 5, 2, 3);
            ctx.fillRect(ix + iw - 10, iy + 5, 2, 3);
            ctx.fillStyle = inv.color;
            if (animFrame === 0) {
              ctx.fillRect(ix + 3, iy + ih - 3, 3, 4);
              ctx.fillRect(ix + iw - 6, iy + ih - 3, 3, 4);
            } else {
              ctx.fillRect(ix + 6, iy + ih - 3, 3, 4);
              ctx.fillRect(ix + iw - 9, iy + ih - 3, 3, 4);
            }
          }
        });
        ctx.shadowBlur = 0;

        // Mystery UFO
        if (mystery.active) {
          ctx.fillStyle = '#f43f5e';
          ctx.shadowColor = '#f43f5e';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.roundRect(mystery.x, mystery.y + 4, mystery.width, mystery.height - 4, 6);
          ctx.fill();
          ctx.fillStyle = '#facc15';
          ctx.fillRect(mystery.x + 12, mystery.y, mystery.width - 24, 6);
          ctx.shadowBlur = 0;
        }

        // Player Ship
        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.roundRect(player.x, player.y + 6, player.width, player.height - 6, 4);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.fillRect(player.x + player.width / 2 - 2, player.y, 4, 8);
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(player.x + player.width / 2 - 5, player.y + 6, 10, 4);
        ctx.shadowBlur = 0;

        // Bullets
        bullets.forEach(b => {
          if (!b.isEnemy) {
            ctx.fillStyle = '#fff';
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = 10;
            ctx.fillRect(b.x - 1.5, b.y, 3, 10);
          } else {
            ctx.fillStyle = '#fb923c';
            ctx.shadowColor = '#f43f5e';
            ctx.shadowBlur = 8;
            ctx.fillRect(b.x - 1.5, b.y, 3, 8);
          }
        });
        ctx.shadowBlur = 0;

        // Particles
        particles.forEach(pt => {
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = pt.alpha;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        requestAnimationFrame(() => this.loop());
      }
    };

    document.addEventListener('DOMContentLoaded', () => {
      invadersApp.init();
    });
  </script>
  <script src="js/cookie-banner.js"></script>
</body>
</html>`;
}

// Save standalone Invaders Game
const invadersOut = path.join(__dirname, '..', 'juego-invasores.html');
fs.writeFileSync(invadersOut, generateInvadersHtml(), 'utf8');



// ==========================================================
// 8. GENERATE DESVARIOS-DE-HUMOR.HTML
function generateHumorHtml() {
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
  <title>Desvaríos de Humor & Caos — Generador de Excusas, Oráculo y Pensamientos de Ducha | Tus Desvaríos</title>
  <meta name="description" content="Consola interactiva de sátira y humor cotidiano: Generador de excusas infalibles con medidor de verosimilitud, Oráculo del Desvarío, Leyes del Caos y Pensamientos de Ducha. ¡Coartadas creíbles y reflexiones cómicas!">
  <meta name="keywords" content="desvarios de humor, generador de excusas, excusas creibles para faltar al trabajo, coartadas online, oraculo del desvario, leyes de murphy humor, leyes del caos, pensamientos de ducha en español, satira cotidiana, humor absurdo, tus desvarios">
  
  <link rel="canonical" href="https://tusdesvarios.com/desvarios-de-humor.html">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Desvaríos de Humor & Caos — Generador de Excusas y Consola del Absurdo">
  <meta property="og:description" content="Calcula coartadas perfectas con medidor de verosimilitud, consulta el oráculo cósmico y explora las leyes del caos cotidiano.">
  <meta property="og:url" content="https://tusdesvarios.com/desvarios-de-humor.html">
  <meta property="og:image" content="images/categories/desvarios-humor.jpg">
  <meta property="og:site_name" content="Tus Desvaríos">
  <meta property="og:locale" content="es_ES">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Desvaríos de Humor & Caos — Generador de Excusas y Sátira">
  <meta name="twitter:description" content="Generador interactivo de excusas, oráculo cósmico y leyes de Murphy. 100% interactivo y gratuito en tu navegador.">
  <meta name="twitter:image" content="images/categories/desvarios-humor.jpg">

  <!-- Schema.org WebApplication, BreadcrumbList & FAQPage for Google Rich Snippets -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Consola Interactiva del Absurdo — Desvaríos de Humor",
        "description": "Herramienta web interactiva con generador de excusas personalizables, medidor de credibilidad, oráculo del desvarío, catálogo de leyes del caos y pensamientos de ducha.",
        "url": "https://tusdesvarios.com/desvarios-de-humor.html",
        "applicationCategory": "EntertainmentApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR"
        },
        "featureList": [
          "Generador de excusas con medidor de credibilidad y consejos estratégicos",
          "Oráculo del desvarío con predicciones cuánticas y dilemas",
          "Catálogo interactivo de Leyes del Caos y variantes de Murphy",
          "Generador de pensamientos de ducha y paradojas filosóficas cómicas"
        ],
        "publisher": {
          "@type": "Organization",
          "name": "Tus Desvaríos",
          "url": "https://tusdesvarios.com",
          "logo": "https://tusdesvarios.com/images/logo.jpg"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Portada",
            "item": "https://tusdesvarios.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Desvaríos de Humor",
            "item": "https://tusdesvarios.com/desvarios-de-humor.html"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Cómo funciona el Generador de Excusas con medidor de verosimilitud?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Selecciona el ámbito de la crisis (trabajo, pareja, amigos, familia, gimnasio, chats, dinero o universidad), el nivel de gravedad (falta leve, compromiso medio o catástrofe total) y el tono retórico (formal, científico, dramático, caradura, conspiranoico o zen). Al pulsar 'Generar Coartada', el algoritmo calcula una excusa personalizada con su porcentaje de credibilidad y una recomendación práctica para ejecutarla con éxito."
            }
          },
          {
            "@type": "Question",
            "name": "¿Para qué situaciones cotidianas se pueden generar coartadas?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Cubre 8 categorías clave: retrasos y ausencias laborales ante jefes, cancelaciones de citas o compromisos en pareja, excusas para no salir de fiesta con amigos, compromisos familiares ineludibles, descansos no programados del gimnasio, justificaciones para tardar en contestar en WhatsApp y redes sociales, desajustes financieros y entregas universitarias."
            }
          },
          {
            "@type": "Question",
            "name": "¿Qué es el Oráculo del Desvarío y cómo resuelve dilemas?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "El Oráculo del Desvarío es una máquina de predicciones absurdas que procesa dudas existenciales y cotidianas asignando una probabilidad cósmica, un veredicto definitivo, una justificación de lógica surrealista, un consejo sabio y un signo zodiacal afín para guiar tus decisiones con humor."
            }
          },
          {
            "@type": "Question",
            "name": "¿Qué son las Leyes del Caos y en qué se diferencian de la Ley de Murphy?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Las Leyes del Caos son un compendio satírico de la entropía urbana moderna. Amplían la clásica Ley de Murphy abordando la tecnología, las impresoras en momentos de entrega, las tostadas con mantequilla, los mensajes enviados por error y las paradojas de la productividad."
            }
          },
          {
            "@type": "Question",
            "name": "¿Es necesario registrarse o pagar para usar las herramientas de humor?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Todas las consolas interactivas de Desvaríos de Humor son 100% gratuitas, anónimas y se ejecutan directamente en cualquier navegador web móvil o de escritorio, sin descargas ni suscripciones."
            }
          }
        ]
      }
    ]
  }
  </script>

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

    ${getHeaderCss()}

    .main-content {
      flex: 1;
      width: 100%;
      max-width: 1080px;
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
    .footer-legal-links {
      margin-top: 0.75rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.65rem 0.85rem;
      font-size: 0.82rem;
    }
    .footer-legal-links a {
      color: var(--text-secondary, #cbd5e1);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .footer-legal-links a:hover {
      color: #c084fc;
      text-decoration: underline;
    }
    .footer-separator {
      color: var(--border-medium, rgba(255, 255, 255, 0.22));
      font-size: 0.75rem;
      user-select: none;
    }

  </style>
  <!-- Supabase SDK v2 & Desvarios Client -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/supabase-client.js"></script>
</head>
<body>
  <div class="app-container">
    ${getHeaderHtml('humor')}

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

      <!-- ═══════════════════════════════════════════════════════════
          SECCIÓN EDITORIAL SEO & GUÍA DE SÁTIRA COTIDIANA
      ═══════════════════════════════════════════════════════════ -->
      <section style="margin-top:4rem; padding:2.5rem 1.75rem; background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); box-shadow:0 16px 40px rgba(0,0,0,0.55);">
        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1.5rem;">
          <span style="font-size:1.75rem;">🎭</span>
          <div>
            <h2 style="font-size:1.45rem; font-weight:800; color:#ffffff; font-family:var(--font-display, 'Cinzel', serif); margin:0;">
              Guía de Supervivencia Urbana: Máquinas de Humor y Caos
            </h2>
            <p style="font-size:0.9rem; color:var(--text-muted); margin:0.25rem 0 0;">
              El arte de la coartada perfecta, la entropía cotidiana y las epifanías bajo el agua caliente.
            </p>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem; margin-bottom:2.5rem;">
          <div style="padding:1.35rem; background:rgba(255,255,255,0.03); border-radius:var(--radius-md); border:1px solid rgba(236,72,153,0.25);">
            <div style="font-size:1.6rem; margin-bottom:0.5rem;">🎩</div>
            <h3 style="font-size:1.1rem; font-weight:700; color:#f472b6; margin-bottom:0.45rem; font-family:var(--font-display, 'Cinzel', serif);">Generador de Excusas & Coartadas</h3>
            <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.55;">
              Algoritmo de calibración retórica con 8 ámbitos cotidianos (trabajo, pareja, salidas, familia, WhatsApp y universidad), 3 niveles de gravedad y 6 tonos satíricos con medidor porcentual de credibilidad.
            </p>
          </div>

          <div style="padding:1.35rem; background:rgba(255,255,255,0.03); border-radius:var(--radius-md); border:1px solid rgba(168,85,247,0.25);">
            <div style="font-size:1.6rem; margin-bottom:0.5rem;">🔮</div>
            <h3 style="font-size:1.1rem; font-weight:700; color:#c084fc; margin-bottom:0.45rem; font-family:var(--font-display, 'Cinzel', serif);">Oráculo del Desvarío</h3>
            <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.55;">
              Consultor cuántico para dilemas cotidianos: desde si deberías enviar ese mensaje a las 3 AM hasta si es prudente comprar un billete de avión sin mirar la cuenta bancaria.
            </p>
          </div>

          <div style="padding:1.35rem; background:rgba(255,255,255,0.03); border-radius:var(--radius-md); border:1px solid rgba(245,158,11,0.25);">
            <div style="font-size:1.6rem; margin-bottom:0.5rem;">📜</div>
            <h3 style="font-size:1.1rem; font-weight:700; color:#fbbf24; margin-bottom:0.45rem; font-family:var(--font-display, 'Cinzel', serif);">Leyes del Caos & Murphy</h3>
            <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.55;">
              Axiomas irrefutables de la mala suerte moderna: las impresoras huelen el miedo, el paraguas atrae el cielo despejado y la batería se agota justo al pedir el taxi.
            </p>
          </div>

          <div style="padding:1.35rem; background:rgba(255,255,255,0.03); border-radius:var(--radius-md); border:1px solid rgba(16,185,129,0.25);">
            <div style="font-size:1.6rem; margin-bottom:0.5rem;">🚿</div>
            <h3 style="font-size:1.1rem; font-weight:700; color:#34d399; margin-bottom:0.45rem; font-family:var(--font-display, 'Cinzel', serif);">Pensamientos de Ducha</h3>
            <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.55;">
              Reflexiones lúcidas y verdades incómodas generadas en el único templo de paz mental que le queda a la humanidad contemporánea: la ducha de agua caliente.
            </p>
          </div>
        </div>

        <!-- Muestrario de Coartadas Indexables -->
        <div style="margin-bottom:2.5rem; padding:1.5rem; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius-md);">
          <h3 style="font-size:1.15rem; font-weight:700; color:#ffffff; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
            <span>💡</span> <span>Muestrario de Coartadas Estratégicas para la Vida Cotidiana</span>
          </h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1rem;">
            <div style="padding:1rem; background:rgba(0,0,0,0.3); border-left:3px solid #ec4899; border-radius:0 var(--radius-sm) var(--radius-sm) 0;">
              <strong style="color:#f472b6; font-size:0.85rem; text-transform:uppercase; display:block; margin-bottom:0.3rem;">Ámbito Laboral (Formal)</strong>
              <p style="font-size:0.85rem; color:#cbd5e1; margin:0; line-height:1.5;">
                “Estimado equipo: debido a una congestión vial imprevista en el eje metropolitano, sufriré una demora estimada de 14 minutos.”
              </p>
              <span style="display:block; margin-top:0.45rem; font-size:0.75rem; color:#34d399; font-weight:700;">Credibilidad estimada: 94%</span>
            </div>
            <div style="padding:1rem; background:rgba(0,0,0,0.3); border-left:3px solid #38bdf8; border-radius:0 var(--radius-sm) var(--radius-sm) 0;">
              <strong style="color:#38bdf8; font-size:0.85rem; text-transform:uppercase; display:block; margin-bottom:0.3rem;">WhatsApp & Redes (Científico)</strong>
              <p style="font-size:0.85rem; color:#cbd5e1; margin:0; line-height:1.5;">
                “El algoritmo de optimización de batería mató el proceso de segundo plano sin enviar la interrupción a la memoria RAM.”
              </p>
              <span style="display:block; margin-top:0.45rem; font-size:0.75rem; color:#34d399; font-weight:700;">Credibilidad estimada: 90%</span>
            </div>
            <div style="padding:1rem; background:rgba(0,0,0,0.3); border-left:3px solid #a855f7; border-radius:0 var(--radius-sm) var(--radius-sm) 0;">
              <strong style="color:#c084fc; font-size:0.85rem; text-transform:uppercase; display:block; margin-bottom:0.3rem;">Amigos & Cansancio (Cara Dura)</strong>
              <p style="font-size:0.85rem; color:#cbd5e1; margin:0; line-height:1.5;">
                “Gente, me he puesto el pijama a las ocho y ya no existe fuerza física en el cosmos que me despegue del sofá.”
              </p>
              <span style="display:block; margin-top:0.45rem; font-size:0.75rem; color:#34d399; font-weight:700;">Credibilidad estimada: 85%</span>
            </div>
          </div>
        </div>

        <!-- Acordeón FAQ Semántico Indexable -->
        <div>
          <div style="display:flex; align-items:center; gap:0.65rem; margin-bottom:1.25rem;">
            <span style="font-size:1.35rem;">❓</span>
            <h2 style="font-size:1.3rem; font-weight:700; color:#ffffff; font-family:var(--font-display, 'Cinzel', serif); margin:0;">
              Preguntas Frecuentes sobre Desvaríos de Humor
            </h2>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.9rem;">
            <details style="background:rgba(255, 255, 255, 0.03); padding:1rem 1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle); cursor:pointer;">
              <summary style="font-weight:600; color:#f1f5f9; font-size:0.96rem;">¿Cómo funciona el Generador de Excusas con medidor de verosimilitud?</summary>
              <p style="margin-top:0.75rem; font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">Selecciona el ámbito de la crisis (trabajo, pareja, amigos, familia, gimnasio, chats, dinero o universidad), el nivel de gravedad (falta leve, compromiso medio o catástrofe total) y el tono retórico (formal, científico, dramático, caradura, conspiranoico o zen). Al pulsar 'Generar Coartada', el algoritmo calcula una excusa personalizada con su porcentaje de credibilidad y una recomendación práctica para ejecutarla con éxito.</p>
            </details>

            <details style="background:rgba(255, 255, 255, 0.03); padding:1rem 1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle); cursor:pointer;">
              <summary style="font-weight:600; color:#f1f5f9; font-size:0.96rem;">¿Para qué situaciones cotidianas se pueden generar coartadas?</summary>
              <p style="margin-top:0.75rem; font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">Cubre 8 categorías clave: retrasos y ausencias laborales ante jefes, cancelaciones de citas o compromisos en pareja, excusas para no salir de fiesta con amigos, compromisos familiares ineludibles, descansos no programados del gimnasio, justificaciones para tardar en contestar en WhatsApp y redes sociales, desajustes financieros y entregas universitarias.</p>
            </details>

            <details style="background:rgba(255, 255, 255, 0.03); padding:1rem 1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle); cursor:pointer;">
              <summary style="font-weight:600; color:#f1f5f9; font-size:0.96rem;">¿Qué es el Oráculo del Desvarío y cómo resuelve dilemas?</summary>
              <p style="margin-top:0.75rem; font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">El Oráculo del Desvarío es una máquina de predicciones absurdas que procesa dudas existenciales y cotidianas asignando una probabilidad cósmica, un veredicto definitivo, una justificación de lógica surrealista, un consejo sabio y un signo zodiacal afín para guiar tus decisiones con humor.</p>
            </details>

            <details style="background:rgba(255, 255, 255, 0.03); padding:1rem 1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle); cursor:pointer;">
              <summary style="font-weight:600; color:#f1f5f9; font-size:0.96rem;">¿Qué son las Leyes del Caos y en qué se diferencian de la Ley de Murphy?</summary>
              <p style="margin-top:0.75rem; font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">Las Leyes del Caos son un compendio satírico de la entropía urbana moderna. Amplían la clásica Ley de Murphy abordando la tecnología, las impresoras en momentos de entrega, las tostadas con mantequilla, los mensajes enviados por error y las paradojas de la productividad.</p>
            </details>

            <details style="background:rgba(255, 255, 255, 0.03); padding:1rem 1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle); cursor:pointer;">
              <summary style="font-weight:600; color:#f1f5f9; font-size:0.96rem;">¿Es necesario registrarse o pagar para usar las herramientas de humor?</summary>
              <p style="margin-top:0.75rem; font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">No. Todas las consolas interactivas de Desvaríos de Humor son 100% gratuitas, anónimas y se ejecutan directamente en cualquier navegador web móvil o de escritorio, sin descargas ni suscripciones.</p>
            </details>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <!-- Pie de Página Unificado -->
  <footer class="site-footer">
    <p>© 2026 TusDesvarios.com — Portal de Entretenimiento, Ficción y Ocio Interactivo</p>
    <div class="footer-legal-links">
      <a href="aviso-legal.html">Aviso Legal</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-privacidad.html">Política de Privacidad</a>
      <span class="footer-separator">•</span>
      <a href="politica-de-cookies.html">Política de Cookies</a>
    </div>
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
      try {
        let count = parseInt(localStorage.getItem('desvarios_humor_count') || '0', 10) + 1;
        localStorage.setItem('desvarios_humor_count', count.toString());
        if (count >= 5 && window.DesvariosAuth) {
          window.DesvariosAuth.unlockMedal('humor-maestro');
        }
      } catch(e) {}
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
  <script src="js/cookie-banner.js"></script>
</body>
</html>`;
}


// Save standalone Humor page
const humorOut = path.join(__dirname, '..', 'desvarios-de-humor.html');
fs.writeFileSync(humorOut, generateHumorHtml(), 'utf8');

// Build Literary Standalone Pages
require('./build_literarios_pages.js');
require('./build_red_pages.js');

console.log('Successfully generated index.html, crea-tu-historia.html, desvarios-literarios.html, desvarios-mentales.html, desvarios-retro.html, desvarios-de-humor.html, desvarios-por-la-red.html, 5 story readers, 8 test HTML files, and 2 interactive stories!');

