const fs = require('fs');
const path = require('path');
const { getHeaderHtml, getHeaderCss } = require('./common_header');

const relatosPath = path.join(__dirname, '..', 'data', 'literarios', 'relatos.json');
const relatos = JSON.parse(fs.readFileSync(relatosPath, 'utf8'));

function generateCatalogHtml() {
  const cardsHtml = relatos.map(r => {
    let imageName = 'el-susurro-relojes.jpg';
    if (r.slug === 'el-ultimo-eco-de-andromeda') imageName = 'el-ultimo-eco-andromeda.jpg';
    if (r.slug === 'la-taberna-del-cuervo-ciego') imageName = 'la-taberna-cuervo-ciego.jpg';
    if (r.slug === 'el-coleccionista-de-silencios') imageName = 'el-coleccionista-silencios.jpg';
    if (r.slug === 'microrrelatos-de-impacto') imageName = 'microrrelatos-impacto.jpg';

    return `
      <article class="story-card cat-card cat-card-active" data-slug="${r.slug}" data-genero="${r.genero}" style="--card-accent:${r.color}; --card-glow:${r.color}33; --card-border:${r.color}55; height:100%; cursor:pointer;" onclick="location.href='relato-${r.slug}.html'">
        <div class="cat-card-glow-circle"></div>
        <div class="cat-card-thumb-wrap" style="height:185px; position:relative; overflow:hidden;">
          <img src="images/literarios/${imageName}" alt="${r.titulo}" class="cat-card-thumb" style="width:100%; height:100%; object-fit:cover; transition:transform 0.45s ease;" loading="lazy">
          <div class="cat-card-thumb-overlay" style="position:absolute; inset:0; background:linear-gradient(to top, rgba(16, 22, 36, 0.98) 0%, rgba(16, 22, 36, 0.35) 60%, rgba(0, 0, 0, 0.15) 100%);"></div>
          <div class="cat-card-header-badge" style="position:absolute; top:0.85rem; left:0.85rem; right:0.85rem; display:flex; align-items:center; justify-content:space-between; z-index:2;">
            <div style="display:flex; align-items:center; gap:0.45rem;">
              <div class="cat-card-icon-box" style="width:42px; height:42px; border-radius:var(--radius-md); background:rgba(0,0,0,0.45); border:1px solid rgba(255,255,255,0.2); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; font-size:1.4rem;">
                ${r.icono}
              </div>
              <span class="badge-read-status" id="badge-read-${r.slug}" style="display:none; font-size:0.72rem; font-weight:800; background:rgba(16, 185, 129, 0.25); border:1px solid rgba(16, 185, 129, 0.6); color:#34d399; padding:0.22rem 0.65rem; border-radius:9999px; box-shadow:0 0 14px rgba(16, 185, 129, 0.35);">
                ✅ Leído
              </span>
            </div>
            <span class="cat-pill" style="font-size:0.74rem; font-weight:700; background:${r.color}25; border:1px solid ${r.color}60; color:#ffffff; padding:0.25rem 0.7rem; border-radius:9999px; box-shadow:0 0 12px ${r.color}30;">
              ${r.generoNombre}
            </span>
          </div>
        </div>
        <div class="cat-card-body" style="padding:1.35rem 1.4rem 1.5rem; flex:1; display:flex; flex-direction:column;">
          <h3 class="cat-card-title" style="font-family:var(--font-display, 'Cinzel', serif); font-size:1.3rem; margin-bottom:0.45rem; color:#ffffff; font-weight:700; line-height:1.3;">
            ${r.titulo}
          </h3>
          <p class="cat-card-desc" style="font-size:0.92rem; line-height:1.6; color:var(--text-secondary); margin-bottom:1.1rem; flex:1;">
            ${r.descripcionCorta}
          </p>
          <div style="display:flex; align-items:center; justify-content:space-between; padding-top:0.75rem; border-top:1px solid var(--border-subtle); font-size:0.82rem; color:var(--text-muted); margin-top:auto;">
            <span style="display:inline-flex; align-items:center; gap:0.35rem;">⏱️ ${r.tiempoLecturaMin} min de lectura</span>
            <span style="font-weight:600; color:var(--text-secondary);">~${r.palabras} palabras</span>
          </div>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-top:0.85rem; padding-top:0.65rem; border-top:1px dashed rgba(255,255,255,0.09);">
            <div class="cat-card-cta" style="color:${r.color}; font-size:0.88rem; font-weight:700; display:inline-flex; align-items:center; gap:0.4rem;">
              <span id="cta-text-${r.slug}">Leer Relato</span>
              <span>➜</span>
            </div>
            <button type="button" class="btn-toggle-read-card" id="btn-toggle-${r.slug}" onclick="event.stopPropagation(); toggleStoryRead('${r.slug}');" title="Marcar o desmarcar como leído">
              <span id="btn-icon-${r.slug}">⚪</span>
              <span id="btn-label-${r.slug}">Marcar leído</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Desvaríos Literarios — Relatos, Terror Gótico, Ciencia Ficción y Cuentos | Tus Desvaríos</title>
  <meta name="description" content="Biblioteca de ficción narrativa y cuentos breves de autor: terror psicológico, distopías espaciales, fantasía oscura y microrrelatos con modo de lectura inmersivo.">
  <meta name="keywords" content="desvarios literarios, relatos cortos gratis, cuentos de terror, ciencia ficcion relatos, fantasia oscura, microrrelatos online, tus desvarios">
  
  <link rel="canonical" href="https://tusdesvarios.com/desvarios-literarios.html">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Desvaríos Literarios — Historias Cortas y Ficción Inmersiva">
  <meta property="og:description" content="Relatos autoconclusivos de terror gótico, ciencia ficción profunda y realismo mágico con lector atmosférico configurable.">
  <meta property="og:url" content="https://tusdesvarios.com/desvarios-literarios.html">
  <meta property="og:image" content="images/categories/desvarios-literarios.jpg">

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
      --border-subtle: rgba(255, 255, 255, 0.12);
      --border-medium: rgba(255, 255, 255, 0.22);
      --text-primary: #f8fafc;
      --text-secondary: #cbd5e1;
      --text-muted: #94a3b8;
      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --radius-full: 9999px;
      --font-display: 'Cinzel', serif;
      --font-ui: 'Inter', -apple-system, sans-serif;
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
      max-width: 1100px;
      margin: 0 auto;
      padding: 2rem 1.25rem 5rem;
    }

    .portal-hero {
      text-align: center;
      padding: 1.5rem 1rem 2.5rem;
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
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.35);
      color: #fbbf24;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 1.25rem;
      box-shadow: 0 0 16px rgba(245, 158, 11, 0.25);
    }

    .portal-title {
      font-family: var(--font-display);
      font-size: clamp(2.2rem, 5vw, 3.4rem);
      font-weight: 900;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 1rem;
      color: #ffffff;
      line-height: 1.15;
    }

    .portal-description {
      font-size: 1.05rem;
      color: var(--text-secondary);
      max-width: 680px;
      margin: 0 auto 1.5rem;
      line-height: 1.65;
    }

    .stories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.75rem;
    }

    .cat-card {
      position: relative;
      border-radius: var(--radius-lg);
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
      overflow: hidden;
      text-decoration: none;
    }

    .cat-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 35px rgba(0,0,0,0.5), 0 0 30px var(--card-glow, transparent);
      border-color: var(--card-accent, #f59e0b);
    }

    .cat-card:hover .cat-card-thumb {
      transform: scale(1.06);
    }

    .btn-random-hero {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.75rem 2rem;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%);
      color: #ffffff;
      font-size: 1rem;
      font-weight: 800;
      border: none;
      cursor: pointer;
      box-shadow: 0 0 25px rgba(245, 158, 11, 0.45), 0 4px 15px rgba(0, 0, 0, 0.3);
      transition: all 0.25s ease;
      text-decoration: none;
    }

    .btn-random-hero:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 0 35px rgba(245, 158, 11, 0.65), 0 8px 25px rgba(0, 0, 0, 0.4);
    }

    .filter-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.48rem 1rem;
      border-radius: var(--radius-full);
      font-size: 0.86rem;
      font-weight: 500;
      border: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .filter-btn[data-genre="all"].active,
    .filter-btn[data-genre="terror"].active {
      font-weight: 700;
      border: 1.5px solid #f59e0b;
      background: rgba(245, 158, 11, 0.22);
      color: #fbbf24;
      box-shadow: 0 0 16px rgba(245, 158, 11, 0.35);
    }
    .filter-btn[data-genre="scifi"].active {
      font-weight: 700;
      border: 1.5px solid #06b6d4;
      background: rgba(6, 182, 212, 0.22);
      color: #67e8f9;
      box-shadow: 0 0 16px rgba(6, 182, 212, 0.35);
    }
    .filter-btn[data-genre="fantasia"].active {
      font-weight: 700;
      border: 1.5px solid #8b5cf6;
      background: rgba(139, 92, 246, 0.22);
      color: #c4b5fd;
      box-shadow: 0 0 16px rgba(139, 92, 246, 0.35);
    }
    .filter-btn[data-genre="surrealismo"].active {
      font-weight: 700;
      border: 1.5px solid #10b981;
      background: rgba(16, 185, 129, 0.22);
      color: #6ee7b7;
      box-shadow: 0 0 16px rgba(16, 185, 129, 0.35);
    }
    .filter-btn[data-genre="microrrelato"].active {
      font-weight: 700;
      border: 1.5px solid #ec4899;
      background: rgba(236, 72, 153, 0.22);
      color: #f472b6;
      box-shadow: 0 0 16px rgba(236, 72, 153, 0.35);
    }
    .filter-btn[data-genre="unread"].active {
      font-weight: 700;
      border: 1.5px solid #38bdf8;
      background: rgba(56, 189, 248, 0.22);
      color: #38bdf8;
      box-shadow: 0 0 16px rgba(56, 189, 248, 0.35);
    }
    .filter-btn[data-genre="read"].active {
      font-weight: 700;
      border: 1.5px solid #10b981;
      background: rgba(16, 185, 129, 0.22);
      color: #34d399;
      box-shadow: 0 0 16px rgba(16, 185, 129, 0.35);
    }

    /* Read story state & buttons */
    .story-card.is-read {
      border-color: rgba(16, 185, 129, 0.45) !important;
    }
    .story-card.is-read .cat-card-glow-circle {
      background: radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, transparent 70%) !important;
    }
    .btn-toggle-read-card {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.76rem;
      font-weight: 600;
      border: 1px solid rgba(255, 255, 255, 0.18);
      background: rgba(255, 255, 255, 0.06);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-toggle-read-card:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.3);
      color: #ffffff;
      transform: scale(1.03);
    }
    .btn-toggle-read-card.active {
      background: rgba(16, 185, 129, 0.2) !important;
      border-color: rgba(16, 185, 129, 0.55) !important;
      color: #34d399 !important;
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.25);
    }

    .reading-progress-card {
      max-width: 620px;
      margin: 0 auto 2rem;
      padding: 1rem 1.4rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      box-shadow: 0 8px 30px rgba(0,0,0,0.3);
      backdrop-filter: blur(10px);
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
    ${getHeaderHtml('literarios')}

    <!-- Main Content -->
    <main class="main-content">
      <section class="portal-hero">
        <div class="hero-badge">
          <span>📜</span> <span>Ficción Narrativa & Cuentos de Autor</span>
        </div>
        <h1 class="portal-title">
          Desvaríos <span style="color:#f59e0b; text-shadow:0 0 35px rgba(245,158,11,0.55);">Literarios</span>
        </h1>
        <p class="portal-description">
          Historias breves, terror gótico, paradojas de ciencia ficción y realismo mágico.
          Lecturas completas diseñadas para desconectar de la prisa y perderse entre palabras.
        </p>

        <!-- Random Story Button -->
        <div style="margin-top:0.5rem; margin-bottom:1.5rem;">
          <button id="btn-random-story" onclick="pickRandomStory()" class="btn-random-hero">
            <span>🎲</span> <span>¿Indeciso? Lee un Relato al Azar</span>
          </button>
        </div>

        <!-- Reading Progress Banner -->
        <div class="reading-progress-card">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.55rem; font-size:0.86rem;">
            <div style="display:flex; align-items:center; gap:0.45rem; font-weight:700; color:#f8fafc;">
              <span>📚</span> <span>Tu Progreso de Lectura:</span>
              <span id="progress-summary-text" style="color:#fbbf24; font-weight:700;">0 de ${relatos.length} leídos</span>
            </div>
            <span id="progress-pct-badge" style="font-weight:800; font-size:0.78rem; background:rgba(245,158,11,0.18); border:1px solid rgba(245,158,11,0.35); color:#fbbf24; padding:0.15rem 0.55rem; border-radius:9999px;">0%</span>
          </div>
          <div style="width:100%; height:7px; background:rgba(255,255,255,0.08); border-radius:9999px; overflow:hidden;">
            <div id="progress-bar-fill" style="width:0%; height:100%; background:linear-gradient(90deg, #f59e0b 0%, #10b981 100%); border-radius:9999px; transition:width 0.4s ease;"></div>
          </div>
        </div>

        <!-- Filter Buttons -->
        <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:0.6rem;">
          <button class="filter-btn active" data-genre="all" onclick="filterGenre('all')">🌟 Todos</button>
          <button class="filter-btn" data-genre="unread" onclick="filterGenre('unread')">📖 Pendientes</button>
          <button class="filter-btn" data-genre="read" onclick="filterGenre('read')">✅ Leídos</button>
          <button class="filter-btn" data-genre="terror" onclick="filterGenre('terror')">👻 Terror & Gótico</button>
          <button class="filter-btn" data-genre="scifi" onclick="filterGenre('scifi')">🚀 Ciencia Ficción</button>
          <button class="filter-btn" data-genre="fantasia" onclick="filterGenre('fantasia')">🕯️ Fantasía Oscura</button>
          <button class="filter-btn" data-genre="surrealismo" onclick="filterGenre('surrealismo')">🫙 Realismo Mágico</button>
          <button class="filter-btn" data-genre="microrrelato" onclick="filterGenre('microrrelato')">⚡ Microrrelatos</button>
        </div>
      </section>

      <!-- Stories Grid -->
      <section class="stories-grid" id="stories-grid-container">
        ${cardsHtml}
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
    const relatosData = ${JSON.stringify(relatos)};
    const STORAGE_KEY = 'tusdesvarios_relatos_leidos';

    function getReadStories() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    }

    function saveReadStories(list) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) {}
    }

    function toggleStoryRead(slug) {
      const list = getReadStories();
      const idx = list.indexOf(slug);
      if (idx >= 0) {
        list.splice(idx, 1);
      } else {
        list.push(slug);
      }
      saveReadStories(list);
      updateCatalogReadUI();
    }

    function updateCatalogReadUI() {
      const readList = getReadStories();
      const total = relatosData.length;
      const count = readList.length;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;

      // Update progress banner
      const summaryElem = document.getElementById('progress-summary-text');
      const pctElem = document.getElementById('progress-pct-badge');
      const fillElem = document.getElementById('progress-bar-fill');

      if (summaryElem) summaryElem.textContent = count + ' de ' + total + ' leídos';
      if (pctElem) pctElem.textContent = pct + '%';
      if (fillElem) fillElem.style.width = pct + '%';

      // Update each story card
      relatosData.forEach(r => {
        const card = document.querySelector('.story-card[data-slug="' + r.slug + '"]');
        const badge = document.getElementById('badge-read-' + r.slug);
        const btn = document.getElementById('btn-toggle-' + r.slug);
        const icon = document.getElementById('btn-icon-' + r.slug);
        const label = document.getElementById('btn-label-' + r.slug);
        const cta = document.getElementById('cta-text-' + r.slug);

        const isRead = readList.includes(r.slug);

        if (card) {
          if (isRead) card.classList.add('is-read');
          else card.classList.remove('is-read');
        }
        if (badge) {
          badge.style.display = isRead ? 'inline-flex' : 'none';
        }
        if (btn) {
          if (isRead) {
            btn.classList.add('active');
            btn.title = 'Hacer clic para desmarcar como leído';
          } else {
            btn.classList.remove('active');
            btn.title = 'Marcar como leído';
          }
        }
        if (icon) icon.textContent = isRead ? '✅' : '⚪';
        if (label) label.textContent = isRead ? 'Leído' : 'Marcar leído';
        if (cta) cta.textContent = isRead ? 'Releer Relato' : 'Leer Relato';
      });

      // Desbloqueo de medallas literarias
      if (readList.length >= 1 && window.DesvariosAuth) {
        window.DesvariosAuth.unlockMedal('literarios-lector');
      }
      if (readList.length >= relatosData.length && window.DesvariosAuth) {
        window.DesvariosAuth.unlockMedal('literarios-devorador');
      }

      // Refresh filter if unread or read is currently active
      const activeBtn = document.querySelector('.filter-btn.active');
      if (activeBtn) {
        const activeGenre = activeBtn.getAttribute('data-genre');
        if (activeGenre === 'read' || activeGenre === 'unread') {
          filterGenre(activeGenre);
        }
      }
    }

    function filterGenre(genre) {
      const buttons = document.querySelectorAll('.filter-btn');
      buttons.forEach(btn => {
        if (btn.getAttribute('data-genre') === genre) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      const readList = getReadStories();
      const cards = document.querySelectorAll('.story-card');
      cards.forEach(c => {
        const cGenre = c.getAttribute('data-genero');
        const cSlug = c.getAttribute('data-slug');
        const isRead = readList.includes(cSlug);

        if (genre === 'all') {
          c.style.display = 'flex';
        } else if (genre === 'read') {
          c.style.display = isRead ? 'flex' : 'none';
        } else if (genre === 'unread') {
          c.style.display = !isRead ? 'flex' : 'none';
        } else if (cGenre === genre) {
          c.style.display = 'flex';
        } else {
          c.style.display = 'none';
        }
      });
    }

    function pickRandomStory() {
      const btn = document.getElementById('btn-random-story');
      btn.innerHTML = '<span>🎲</span> <span>¡Buscando lectura...!</span>';
      setTimeout(() => {
        const randomRelato = relatosData[Math.floor(Math.random() * relatosData.length)];
        location.href = 'relato-' + randomRelato.slug + '.html';
      }, 350);
    }

    // Initialize state on load and on tab focus/storage events
    window.addEventListener('DOMContentLoaded', updateCatalogReadUI);
    window.addEventListener('storage', updateCatalogReadUI);
    updateCatalogReadUI();
  </script>
  <script src="js/cookie-banner.js"></script>
</body>
</html>`;
}

function generateStoryReaderHtml(relato, index, all) {
  let imageName = 'el-susurro-relojes.jpg';
  if (relato.slug === 'el-ultimo-eco-de-andromeda') imageName = 'el-ultimo-eco-andromeda.jpg';
  if (relato.slug === 'la-taberna-del-cuervo-ciego') imageName = 'la-taberna-cuervo-ciego.jpg';
  if (relato.slug === 'el-coleccionista-de-silencios') imageName = 'el-coleccionista-silencios.jpg';
  if (relato.slug === 'microrrelatos-de-impacto') imageName = 'microrrelatos-impacto.jpg';

  const prev = index > 0 ? all[index - 1] : null;
  const next = index < all.length - 1 ? all[index + 1] : null;

  // Convert markdown body to clean HTML
  const sections = relato.contenido.split('\n\n');
  const formattedBody = sections.map(sec => {
    const trimmed = sec.trim();
    if (trimmed.startsWith('### ')) {
      return `<h3 class="reader-section-title">${trimmed.replace('### ', '')}</h3>`;
    }
    if (trimmed.startsWith('> ')) {
      const cleanQuote = trimmed.replace(/^>\s*\*?/, '').replace(/\*?$/, '');
      return `<blockquote class="reader-quote">${cleanQuote}</blockquote>`;
    }
    if (trimmed === '---') {
      return `<hr class="reader-divider">`;
    }
    if (trimmed.startsWith('* ')) {
      const items = trimmed.split('\n').map(item => {
        const clean = item.replace(/^\*\s*/, '')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>');
        return `<li>${clean}</li>`;
      }).join('');
      return `<ul class="reader-list">${items}</ul>`;
    }
    const cleanParagraph = trimmed
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
    return `<p class="reader-p">${cleanParagraph}</p>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${relato.titulo} — Desvaríos Literarios | Tus Desvaríos</title>
  <meta name="description" content="${relato.descripcionCorta}">
  <meta name="author" content="${relato.autor}">
  <meta name="keywords" content="${relato.etiquetas.join(', ')}, desvarios literarios, relatos cortos, lectura online">
  
  <link rel="canonical" href="https://tusdesvarios.com/relato-${relato.slug}.html">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${relato.titulo} — ${relato.subtitulo}">
  <meta property="og:description" content="${relato.descripcionCorta}">
  <meta property="og:url" content="https://tusdesvarios.com/relato-${relato.slug}.html">
  <meta property="og:image" content="images/literarios/${imageName}">

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
      --bg-card: rgba(18, 24, 38, 0.85);
      --border-color: rgba(255, 255, 255, 0.12);
      --text-main: #f8fafc;
      --text-sec: #cbd5e1;
      --accent-color: ${relato.color};
      --font-body: 'Crimson Pro', Georgia, serif;
      --font-size: 19px;
      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-full: 9999px;
    }

    /* THEMES */
    body.theme-dark {
      --bg-main: #0b0f19;
      --bg-card: rgba(18, 24, 38, 0.88);
      --border-color: rgba(255, 255, 255, 0.12);
      --text-main: #f8fafc;
      --text-sec: #cbd5e1;
    }
    body.theme-sepia {
      --bg-main: #1c1510;
      --bg-card: rgba(34, 25, 18, 0.95);
      --border-color: rgba(245, 158, 11, 0.25);
      --text-main: #fef3c7;
      --text-sec: #fde68a;
      --accent-color: #f59e0b;
    }
    body.theme-night {
      --bg-main: #0f172a;
      --bg-card: rgba(30, 41, 59, 0.88);
      --border-color: rgba(148, 163, 184, 0.18);
      --text-main: #e2e8f0;
      --text-sec: #94a3b8;
      --accent-color: #38bdf8;
    }

    body.font-serif { --font-body: 'Crimson Pro', Georgia, serif; }
    body.font-sans { --font-body: 'Inter', -apple-system, sans-serif; }
    body.font-display { --font-body: 'Cinzel', Georgia, serif; }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg-main);
      color: var(--text-main);
      font-family: var(--font-body);
      min-height: 100vh;
      line-height: 1.85;
      transition: background 0.3s ease, color 0.3s ease;
      overflow-x: hidden;
    }

    #scroll-progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 4px;
      width: 0%;
      background: linear-gradient(90deg, var(--accent-color), #ec4899);
      z-index: 1000;
      box-shadow: 0 0 12px var(--accent-color);
      transition: width 0.1s ease;
    }

    .reader-controls-bar {
      position: sticky;
      top: 0;
      z-index: 90;
      background: var(--bg-card);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      padding: 0.65rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.75rem;
      max-width: 1000px;
      margin: 0 auto 2rem;
      border-radius: 0 0 14px 14px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
      font-family: 'Inter', sans-serif;
    }

    .btn-ctrl {
      padding: 0.35rem 0.65rem;
      border-radius: 6px;
      border: 1px solid var(--border-color);
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-main);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-ctrl:hover {
      background: rgba(255, 255, 255, 0.09);
    }

    .reader-canvas {
      max-width: 780px;
      margin: 0 auto;
      padding: 0 1.5rem 6rem;
    }

    .reader-header {
      text-align: center;
      margin-bottom: 3rem;
      padding-top: 1rem;
      font-family: 'Inter', sans-serif;
    }

    .story-genre-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.9rem;
      border-radius: 9999px;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid var(--accent-color);
      color: var(--accent-color);
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 1.25rem;
    }

    .reader-title {
      font-family: 'Cinzel', serif;
      font-size: clamp(2.2rem, 5.5vw, 3.4rem);
      font-weight: 900;
      letter-spacing: 0.03em;
      color: var(--text-main);
      line-height: 1.15;
      margin-bottom: 1rem;
    }

    .reader-subtitle {
      font-size: 1.15rem;
      font-style: italic;
      color: var(--text-sec);
      max-width: 620px;
      margin: 0 auto 1.75rem;
      line-height: 1.6;
    }

    .reader-meta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      font-size: 0.88rem;
      color: var(--text-sec);
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
    }

    .featured-quote-card {
      padding: 1.5rem 1.75rem;
      background: var(--bg-card);
      border: 1.5px solid var(--accent-color);
      border-radius: 14px;
      margin-bottom: 3rem;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
      font-family: 'Inter', sans-serif;
    }

    .reader-p {
      font-size: var(--font-size);
      line-height: 1.85;
      margin-bottom: 1.4rem;
      color: var(--text-main);
      text-align: justify;
      text-justify: inter-word;
    }

    .reader-section-title {
      font-family: 'Cinzel', serif;
      font-size: 1.45rem;
      font-weight: 800;
      color: var(--accent-color);
      margin-top: 2.5rem;
      margin-bottom: 1.25rem;
      letter-spacing: 0.04em;
    }

    .reader-quote {
      border-left: 3px solid var(--accent-color);
      padding: 0.85rem 1.4rem;
      margin: 1.75rem 0;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 0 8px 8px 0;
      font-style: italic;
      font-size: calc(var(--font-size) * 1.05);
      line-height: 1.7;
      color: var(--text-sec);
    }

    .reader-divider {
      border: none;
      height: 1px;
      background: var(--border-color);
      margin: 2.25rem 0;
    }

    .reader-list {
      padding-left: 1.5rem;
      margin: 1rem 0 1.5rem;
      line-height: 1.8;
      font-size: var(--font-size);
    }

    .nav-story-box {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.25rem;
      margin-top: 4rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border-color);
      font-family: 'Inter', sans-serif;
    }

    .nav-story-card {
      padding: 1.25rem;
      border-radius: 12px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      text-decoration: none;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      transition: all 0.2s ease;
      color: var(--text-main);
    }
    .nav-story-card:hover {
      border-color: var(--accent-color);
      transform: translateY(-2px);
    }

    .btn-ctrl.read-active {
      background: rgba(16, 185, 129, 0.2) !important;
      border-color: #10b981 !important;
      color: #34d399 !important;
      font-weight: 700 !important;
      box-shadow: 0 0 14px rgba(16, 185, 129, 0.3) !important;
    }

    .story-completion-card {
      margin-top: 3.5rem;
      padding: 2rem 2.2rem;
      border-radius: 18px;
      background: linear-gradient(180deg, rgba(18,24,38,0.92) 0%, rgba(11,15,25,0.96) 100%);
      border: 1.5px solid rgba(255,255,255,0.14);
      text-align: center;
      box-shadow: 0 12px 35px rgba(0,0,0,0.45);
      font-family: 'Inter', sans-serif;
      transition: all 0.3s ease;
    }
    .story-completion-card.is-read {
      border-color: rgba(16, 185, 129, 0.55);
      box-shadow: 0 12px 35px rgba(0,0,0,0.45), 0 0 25px rgba(16, 185, 129, 0.25);
    }
    .btn-completion-read {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.8rem 1.85rem;
      border-radius: 9999px;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.25s ease;
      border: 1.5px solid rgba(16, 185, 129, 0.5);
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.3) 100%);
      color: #34d399;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.25);
    }
    .btn-completion-read:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 30px rgba(16, 185, 129, 0.5);
    }

    ${getHeaderCss()}
  </style>
</head>
<body class="theme-dark font-serif">
  <div id="scroll-progress"></div>

  ${getHeaderHtml('literarios')}

  <!-- Reader Controls Bar -->
  <div class="reader-controls-bar">
    <a href="desvarios-literarios.html" style="display:inline-flex; align-items:center; gap:0.4rem; font-size:0.85rem; font-weight:600; color:var(--text-sec); text-decoration:none;">
      <span>←</span> <span>Catálogo Literario</span>
    </a>

    <!-- Theme & Typography controls -->
    <div style="display:flex; align-items:center; gap:0.65rem; flex-wrap:wrap;">
      <!-- Toggle Read -->
      <button class="btn-ctrl" id="btn-reader-toggle-read" onclick="toggleCurrentStoryRead()" title="Marcar o desmarcar como leído">
        <span id="reader-btn-icon">⚪</span> <span id="reader-btn-text">Marcar Leído</span>
      </button>

      <!-- Font Family -->
      <button class="btn-ctrl" onclick="setFontFamily('serif')">Serif</button>
      <button class="btn-ctrl" onclick="setFontFamily('sans')">Sans</button>

      <!-- Font Size -->
      <button class="btn-ctrl" onclick="adjustFontSize(-2)">A-</button>
      <button class="btn-ctrl" onclick="adjustFontSize(2)">A+</button>

      <!-- Themes -->
      <button class="btn-ctrl" onclick="setTheme('dark')">🌌 Noche</button>
      <button class="btn-ctrl" onclick="setTheme('sepia')">📜 Sepia</button>
      <button class="btn-ctrl" onclick="setTheme('night')">☕ Café</button>

      <!-- Share -->
      <button class="btn-ctrl" id="btn-share-story" onclick="shareStory()">
        <span>🔗 Compartir</span>
      </button>
    </div>
  </div>

  <!-- Main Reader Canvas -->
  <main class="reader-canvas">
    <header class="reader-header">
      <span class="story-genre-badge" style="background:${relato.color}22; border:1.5px solid ${relato.color}65; color:${relato.color}; box-shadow:0 0 16px ${relato.color}30;">
        <span>${relato.icono}</span> <span>${relato.generoNombre}</span>
      </span>
      <h1 class="reader-title">${relato.titulo}</h1>
      <p class="reader-subtitle">${relato.subtitulo}</p>
      <div class="reader-meta">
        ${relato.autor ? `<span>✍️ ${relato.autor}</span>` : ''}
        <span>⏱️ ${relato.tiempoLecturaMin} min de lectura</span>
        <span style="opacity:0.85;">~${relato.palabras} palabras</span>
      </div>
    </header>

    ${relato.citasDestacadas && relato.citasDestacadas.length > 0 ? `
      <div class="featured-quote-card">
        <div style="display:flex; align-items:center; gap:0.45rem; color:var(--accent-color); font-weight:700; font-size:0.85rem; text-transform:uppercase; margin-bottom:0.5rem;">
          <span>✨</span> <span>Cita del Relato</span>
        </div>
        <p style="font-size:1.15rem; font-style:italic; line-height:1.6; margin:0;">
          “${relato.citasDestacadas[0]}”
        </p>
      </div>
    ` : ''}

    <article>
      ${formattedBody}
    </article>

    <!-- Story Completion Box -->
    <div id="story-completion-card" class="story-completion-card">
      <div style="display:inline-flex; align-items:center; justify-content:center; width:54px; height:54px; border-radius:50%; background:rgba(245,158,11,0.15); border:1.5px solid rgba(245,158,11,0.4); font-size:1.6rem; margin-bottom:1rem; box-shadow:0 0 20px rgba(245,158,11,0.25);" id="completion-icon-box">
        ✨
      </div>
      <h3 id="completion-title" style="font-family:'Cinzel', serif; font-size:1.45rem; color:#ffffff; margin-bottom:0.5rem; letter-spacing:0.03em;">
        Fin de la Lectura
      </h3>
      <p id="completion-desc" style="font-size:0.95rem; color:var(--text-sec); max-width:540px; margin:0 auto 1.35rem; line-height:1.6;">
        ¿Has terminado de leer <em>${relato.titulo}</em>? Marca esta obra para llevar el recuento en tu biblioteca de Tus Desvaríos.
      </p>
      <button id="btn-completion-action" onclick="toggleCurrentStoryRead()" class="btn-completion-read">
        <span id="completion-btn-icon">✅</span>
        <span id="completion-btn-text">Marcar como Leído</span>
      </button>
      <!-- Apoyo al creador / Donaciones PayPal -->
      <div class="story-donate-box" style="margin-top:1.75rem; padding-top:1.5rem; border-top:1px solid rgba(255,255,255,0.1); display:flex; flex-direction:column; align-items:center; gap:0.75rem;">
        <p style="font-size:0.9rem; color:var(--text-sec); margin:0; max-width:500px; line-height:1.5;">
          ☕ <strong>¿Has disfrutado de la lectura?</strong> Si te gusta este contenido libre e independiente, puedes invitar a un café al creador para apoyar nuevos relatos.
        </p>
        <a href="https://www.paypal.com/donate/?hosted_button_id=V8PZNYKGXBCLG&locale.x=es_ES"
           target="_blank"
           rel="noopener noreferrer"
           class="btn-paypal-donate"
           title="Invitar a un café con PayPal"
           style="display:inline-flex; align-items:center; gap:0.55rem; padding:0.65rem 1.4rem; border-radius:9999px; background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color:#0b0f19; font-weight:800; font-size:0.88rem; text-decoration:none; box-shadow:0 4px 18px rgba(245, 158, 11, 0.35); transition:all 0.2s ease;">
          <span>☕ Invitar a un café</span>
          <span>➜</span>
        </a>
      </div>
    </div>

    <!-- Prev & Next Story Navigation -->
    <div class="nav-story-box">
      ${prev ? `
        <a href="relato-${prev.slug}.html" class="nav-story-card">
          <span style="font-size:0.8rem; color:var(--text-sec);">← Relato Anterior</span>
          <strong style="font-size:1rem;">${prev.titulo}</strong>
        </a>
      ` : '<div></div>'}

      ${next ? `
        <a href="relato-${next.slug}.html" class="nav-story-card" style="align-items:flex-end; text-align:right;">
          <span style="font-size:0.8rem; color:var(--text-sec);">Siguiente Relato →</span>
          <strong style="font-size:1rem;">${next.titulo}</strong>
        </a>
      ` : '<div></div>'}
    </div>

    <div style="text-align:center; margin-top:3rem;">
      <a href="desvarios-literarios.html" style="display:inline-flex; align-items:center; gap:0.5rem; padding:0.75rem 1.75rem; border-radius:9999px; background:rgba(245, 158, 11, 0.2); border:1.5px solid var(--accent-color); color:#ffffff; font-weight:700; text-decoration:none; font-size:0.92rem; font-family:'Inter', sans-serif;">
        <span>📜</span> <span>Explorar más Desvaríos Literarios</span>
      </a>
    </div>
  </main>

  <script>
    let curFontSize = 19;
    const STORAGE_KEY = 'tusdesvarios_relatos_leidos';
    const currentSlug = '${relato.slug}';

    function getReadStories() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    }

    function saveReadStories(list) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) {}
    }

    function toggleCurrentStoryRead() {
      const list = getReadStories();
      const idx = list.indexOf(currentSlug);
      if (idx >= 0) {
        list.splice(idx, 1);
      } else {
        list.push(currentSlug);
      }
      saveReadStories(list);
      updateReaderReadUI();
    }

    function updateReaderReadUI() {
      const list = getReadStories();
      const isRead = list.includes(currentSlug);

      const topBtn = document.getElementById('btn-reader-toggle-read');
      const topIcon = document.getElementById('reader-btn-icon');
      const topText = document.getElementById('reader-btn-text');

      const card = document.getElementById('story-completion-card');
      const iconBox = document.getElementById('completion-icon-box');
      const title = document.getElementById('completion-title');
      const desc = document.getElementById('completion-desc');
      const compBtn = document.getElementById('btn-completion-action');
      const compIcon = document.getElementById('completion-btn-icon');
      const compText = document.getElementById('completion-btn-text');

      if (topBtn) {
        if (isRead) {
          topBtn.classList.add('read-active');
          if (topIcon) topIcon.textContent = '✅';
          if (topText) topText.textContent = 'Leído';
          topBtn.title = 'Hacer clic para desmarcar como leído';
        } else {
          topBtn.classList.remove('read-active');
          if (topIcon) topIcon.textContent = '⚪';
          if (topText) topText.textContent = 'Marcar Leído';
          topBtn.title = 'Marcar como leído';
        }
      }

      if (card) {
        if (isRead) {
          card.classList.add('is-read');
          if (iconBox) {
            iconBox.textContent = '🎉';
            iconBox.style.background = 'rgba(16, 185, 129, 0.2)';
            iconBox.style.borderColor = 'rgba(16, 185, 129, 0.6)';
            iconBox.style.boxShadow = '0 0 25px rgba(16, 185, 129, 0.4)';
          }
          if (title) title.textContent = '¡Obra Completada!';
          if (desc) desc.textContent = 'Has marcado esta historia como leída. Tu progreso ha quedado registrado en tu navegador.';
          if (compBtn) {
            compBtn.style.background = 'rgba(16, 185, 129, 0.2)';
            compBtn.style.borderColor = '#10b981';
            compBtn.style.color = '#34d399';
          }
          if (compIcon) compIcon.textContent = '✅';
          if (compText) compText.textContent = 'Leído (Hacer clic para desmarcar)';
        } else {
          card.classList.remove('is-read');
          if (iconBox) {
            iconBox.textContent = '✨';
            iconBox.style.background = 'rgba(245, 158, 11, 0.15)';
            iconBox.style.borderColor = 'rgba(245, 158, 11, 0.4)';
            iconBox.style.boxShadow = '0 0 20px rgba(245, 158, 11, 0.25)';
          }
          if (title) title.textContent = 'Fin de la Lectura';
          if (desc) desc.textContent = '¿Has terminado de leer este relato? Márcalo para llevar el recuento en tu biblioteca.';
          if (compBtn) {
            compBtn.style.background = 'linear-gradient(135deg, rgba(16,185,129,0.25) 0%, rgba(5,150,105,0.3) 100%)';
            compBtn.style.borderColor = 'rgba(16, 185, 129, 0.5)';
            compBtn.style.color = '#34d399';
          }
          if (compIcon) compIcon.textContent = '✅';
          if (compText) compText.textContent = 'Marcar como Leído';
        }
      }
    }

    let hasAutoMarked = false;
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        const pct = (window.scrollY / total) * 100;
        document.getElementById('scroll-progress').style.width = Math.min(100, Math.max(0, pct)) + '%';
        if (pct >= 95 && !hasAutoMarked) {
          hasAutoMarked = true;
          const list = getReadStories();
          if (!list.includes(currentSlug)) {
            list.push(currentSlug);
            saveReadStories(list);
            updateReaderReadUI();
            if (list.length >= 1 && window.DesvariosAuth) {
              window.DesvariosAuth.unlockMedal('literarios-lector');
            }
            if (list.length >= 5 && window.DesvariosAuth) {
              window.DesvariosAuth.unlockMedal('literarios-devorador');
            }
          }
        }
      }
    });

    function setTheme(t) {
      document.body.className = 'theme-' + t + ' ' + (document.body.classList.contains('font-sans') ? 'font-sans' : 'font-serif');
    }

    function setFontFamily(f) {
      const curTheme = document.body.className.includes('theme-sepia') ? 'theme-sepia' : (document.body.className.includes('theme-night') ? 'theme-night' : 'theme-dark');
      document.body.className = curTheme + ' font-' + f;
    }

    function adjustFontSize(delta) {
      curFontSize = Math.min(26, Math.max(14, curFontSize + delta));
      document.documentElement.style.setProperty('--font-size', curFontSize + 'px');
    }

    function shareStory() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(() => {
          const btn = document.getElementById('btn-share-story');
          btn.innerHTML = '<span>✅ ¡Copiado!</span>';
          setTimeout(() => {
            btn.innerHTML = '<span>🔗 Compartir</span>';
          }, 2000);
        });
      }
    }

    window.addEventListener('DOMContentLoaded', updateReaderReadUI);
    window.addEventListener('storage', updateReaderReadUI);
    updateReaderReadUI();
  </script>
  <script src="js/cookie-banner.js"></script>
</body>
</html>`;
}

// 1. Generate desvarios-literarios.html
const catalogOutput = generateCatalogHtml();
fs.writeFileSync(path.join(__dirname, '..', 'desvarios-literarios.html'), catalogOutput, 'utf8');
console.log('Successfully generated desvarios-literarios.html!');

// 2. Generate all individual story pages
relatos.forEach((r, idx) => {
  const storyHtml = generateStoryReaderHtml(r, idx, relatos);
  const outPath = path.join(__dirname, '..', `relato-${r.slug}.html`);
  fs.writeFileSync(outPath, storyHtml, 'utf8');
  console.log(`Successfully generated relato-${r.slug}.html`);
});

console.log('All literary standalone pages generated successfully!');
