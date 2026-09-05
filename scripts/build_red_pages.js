const fs = require('fs');
const path = require('path');
const { getHeaderHtml, getHeaderCss } = require('./common_header');

const websPath = path.join(__dirname, '..', 'data', 'red', 'webs.json');
const amazonPath = path.join(__dirname, '..', 'data', 'red', 'amazon.json');

const webs = JSON.parse(fs.readFileSync(websPath, 'utf8'));
const products = JSON.parse(fs.readFileSync(amazonPath, 'utf8'));

const AMAZON_TAG = 'tusdesvarios-21';

function getAmazonUrl(p) {
  if (p.amazonUrl) {
    return p.amazonUrl;
  }
  const query = encodeURIComponent(p.amazonSearchQuery || p.titulo);
  return `https://www.amazon.es/s?k=${query}&tag=${AMAZON_TAG}`;
}

function generateRedHtml() {
  // Webs cards HTML
  const websCardsHtml = webs.map(w => `
    <article class="cat-card cat-card-active web-card" style="--card-accent:${w.badgeColor}; --card-glow:${w.badgeColor}33; --card-border:${w.badgeColor}55;">
      <div class="cat-card-glow-circle"></div>
      <div class="cat-card-thumb-wrap" style="height:185px; position:relative; overflow:hidden;">
        <img src="images/red/${w.imagen}" alt="${w.titulo}" class="cat-card-thumb" style="width:100%; height:100%; object-fit:cover;" loading="lazy">
        <div class="cat-card-thumb-overlay"></div>
        <div style="position:absolute; top:0.85rem; left:0.85rem; right:0.85rem; display:flex; align-items:center; justify-content:space-between; z-index:2;">
          <div class="cat-card-icon-box" style="width:40px; height:40px; border-radius:var(--radius-md); background:rgba(0,0,0,0.55); border:1px solid rgba(255,255,255,0.2); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; font-size:1.3rem;">
            ${w.icono}
          </div>
          <span style="font-size:0.74rem; font-weight:700; background:${w.badgeColor}25; border:1px solid ${w.badgeColor}60; color:#ffffff; padding:0.25rem 0.75rem; border-radius:9999px; box-shadow:0 0 12px ${w.badgeColor}35;">
            ${w.badge}
          </span>
        </div>
      </div>
      <div class="cat-card-body" style="padding:1.35rem 1.4rem 1.5rem; flex:1; display:flex; flex-direction:column;">
        <h3 class="cat-card-title" style="font-size:1.3rem; margin-bottom:0.5rem; color:#ffffff;">
          ${w.titulo}
        </h3>
        <p class="cat-card-desc" style="font-size:0.92rem; line-height:1.6; color:var(--text-secondary); margin-bottom:1.1rem; flex:1;">
          ${w.descripcion}
        </p>
        <div style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-bottom:1.25rem;">
          ${w.tags.map(t => `<span style="font-size:0.72rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); color:var(--text-muted); padding:0.15rem 0.5rem; border-radius:6px;">#${t}</span>`).join('')}
        </div>
        <a href="${w.url}" target="_blank" rel="noopener noreferrer" class="btn-visit-web" style="--btn-color:${w.badgeColor};">
          <span>Visitar Web</span>
          <span>↗</span>
        </a>
      </div>
    </article>
  `).join('');

  // Products cards HTML
  const productsCardsHtml = products.map(p => `
    <article class="cat-card cat-card-active amazon-card" data-cat="${p.categoria}" style="--card-accent:${p.color}; --card-glow:${p.color}33; --card-border:${p.color}55;">
      <div class="cat-card-glow-circle"></div>
      <div class="cat-card-thumb-wrap" style="height:200px; position:relative; overflow:hidden;">
        <img src="images/red/${p.imagen}" alt="${p.titulo}" class="cat-card-thumb" style="width:100%; height:100%; object-fit:cover;" loading="lazy">
        <div class="cat-card-thumb-overlay"></div>
        <div style="position:absolute; top:0.75rem; left:0.75rem; right:0.75rem; display:flex; align-items:center; justify-content:space-between; z-index:2;">
          <span style="font-size:0.74rem; font-weight:800; background:rgba(15,23,42,0.85); border:1px solid ${p.color}88; color:${p.color}; padding:0.2rem 0.65rem; border-radius:9999px; box-shadow:0 0 12px ${p.color}40;">
            ${p.etiqueta}
          </span>
          <span style="width:32px; height:32px; border-radius:50%; background:rgba(0,0,0,0.55); border:1px solid rgba(255,255,255,0.2); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; font-size:1.1rem;">
            ${p.icono}
          </span>
        </div>
      </div>
      <div class="cat-card-body" style="padding:1.25rem 1.35rem 1.4rem; flex:1; display:flex; flex-direction:column;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.35rem;">
          <span style="font-size:0.78rem; color:var(--text-muted);">${p.categoriaNombre}</span>
          <span style="display:inline-flex; align-items:center; gap:0.2rem; font-size:0.78rem; color:#fbbf24;">
            ⭐ ${p.estrellas} (${p.resenas})
          </span>
        </div>
        <h3 style="font-size:1.15rem; font-weight:700; color:#ffffff; margin-bottom:0.45rem; line-height:1.35;">
          ${p.titulo}
        </h3>
        <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.55; margin-bottom:1.25rem; flex:1;">
          ${p.descripcion}
        </p>
        <a href="${getAmazonUrl(p)}" target="_blank" rel="noopener noreferrer sponsored" class="btn-amazon-buy">
          <span>Ver en Amazon</span>
          <span>🛍️</span>
        </a>
      </div>
    </article>
  `).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Desvaríos por la Red — Escaparate Web & Bazar de Gadgets Curiosos | Tus Desvaríos</title>
  <meta name="description" content="Descubre proyectos web recomendados, publica tu propio sitio y explora una selección de gadgets insólitos y curiosidades de Amazon en Tus Desvaríos.">
  <!-- Favicon & Touch Icons -->
  <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="images/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

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
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 1.5rem 1.25rem 4rem;
    }

    /* Hero Section */
    .portal-hero {
      text-align: center;
      padding: 2.5rem 1rem 1.75rem;
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
      background: rgba(59, 130, 246, 0.12);
      border: 1px solid rgba(59, 130, 246, 0.35);
      color: #60a5fa;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 1.25rem;
      box-shadow: 0 0 16px rgba(59, 130, 246, 0.25);
    }

    .portal-title {
      font-family: var(--font-display);
      font-size: clamp(2.3rem, 5.5vw, 3.6rem);
      font-weight: 900;
      letter-spacing: 0.02em;
      margin-bottom: 1rem;
      color: #ffffff;
      line-height: 1.15;
    }

    .portal-title-highlight {
      color: #3b82f6;
      text-shadow: 0 0 35px rgba(59, 130, 246, 0.55);
    }

    .portal-description {
      font-size: 1.08rem;
      line-height: 1.65;
      color: var(--text-secondary);
      max-width: 680px;
      margin: 0 auto 1.75rem;
    }

    /* Dual Tab Switcher */
    .tab-switcher {
      display: inline-flex;
      background: rgba(15, 23, 42, 0.85);
      padding: 0.35rem;
      border-radius: var(--radius-full);
      border: 1.5px solid rgba(59, 130, 246, 0.3);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4), 0 0 25px rgba(59, 130, 246, 0.15);
      gap: 0.35rem;
      margin-bottom: 1rem;
    }

    .tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1.4rem;
      border-radius: var(--radius-full);
      font-size: 0.95rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      background: transparent;
      color: var(--text-secondary);
      transition: all 0.22s ease;
    }

    .tab-btn.active-tab-webs {
      font-weight: 800;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: #ffffff;
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.45);
    }

    .tab-btn.active-tab-amazon {
      font-weight: 800;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: #ffffff;
      box-shadow: 0 0 20px rgba(245, 158, 11, 0.45);
    }

    .tab-badge {
      font-size: 0.75rem;
      padding: 0.1rem 0.45rem;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.1);
    }

    /* Grids & Cards */
    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.75rem;
    }

    .amazon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.75rem;
    }

    .cat-card {
      background: var(--bg-surface);
      border: 1px solid var(--card-border, var(--border-subtle));
      border-radius: var(--radius-lg);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
      transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .cat-card:hover {
      transform: translateY(-4px);
      border-color: var(--card-accent, #3b82f6);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5), 0 0 20px var(--card-glow, rgba(59, 130, 246, 0.2));
    }

    .cat-card-thumb-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(16, 22, 36, 0.98) 0%, rgba(16, 22, 36, 0.35) 60%, rgba(0, 0, 0, 0.15) 100%);
    }

    .btn-visit-web {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.65rem 1rem;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.06);
      border: 1.5px solid var(--btn-color, #3b82f6);
      color: #ffffff;
      font-weight: 700;
      font-size: 0.88rem;
      text-decoration: none;
      transition: all 0.2s ease;
      margin-top: auto;
    }

    .btn-visit-web:hover {
      background: rgba(59, 130, 246, 0.22);
      border-color: #3b82f6;
    }

    .btn-amazon-buy {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: #ffffff;
      font-weight: 800;
      font-size: 0.92rem;
      text-decoration: none;
      box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35);
      transition: all 0.2s ease;
      margin-top: auto;
    }

    .btn-amazon-buy:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.55);
    }

    /* Filter buttons for Amazon */
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

    .filter-btn.active {
      font-weight: 700;
      border: 1.5px solid #f59e0b;
      background: rgba(245, 158, 11, 0.2);
      color: #fbbf24;
      box-shadow: 0 0 15px rgba(245, 158, 11, 0.25);
    }

    /* Modal */
    .modal-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 999;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(10px);
      align-items: center;
      justify-content: center;
      padding: 1.25rem;
    }

    .modal-box {
      background: linear-gradient(180deg, #131b2e 0%, #0b0f19 100%);
      border: 1.5px solid rgba(59, 130, 246, 0.45);
      border-radius: 20px;
      max-width: 520px;
      width: 100%;
      padding: 2rem;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(59, 130, 246, 0.2);
      position: relative;
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
    ${getHeaderHtml('red')}

    <!-- Main Content -->
    <main class="main-content">
      <!-- Hero -->
      <section class="portal-hero">
        <div class="hero-badge">
          <span>🌐</span>
          <span>Directorio de Proyectos & Bazar de Curiosidades</span>
        </div>

        <h1 class="portal-title">
          Desvaríos por la <span class="portal-title-highlight">Red</span>
        </h1>

        <p class="portal-description">
          Un punto de encuentro para descubrir proyectos web recomendados, dar a conocer tu página y explorar una selección de los gadgets más insólitos y divertidos de Amazon.
        </p>

        <!-- Dual Tab Switcher -->
        <div class="tab-switcher">
          <button id="tab-btn-webs" class="tab-btn active-tab-webs" onclick="switchTab('webs')">
            <span>🌐 Escaparate Web</span>
            <span class="tab-badge">${webs.length}</span>
          </button>
          <button id="tab-btn-amazon" class="tab-btn" onclick="switchTab('amazon')">
            <span>🛍️ Bazar de Amazon</span>
            <span class="tab-badge">${products.length}</span>
          </button>
        </div>
      </section>

      <!-- TAB 1: ESCAPARATE DE WEBS -->
      <section id="section-webs" style="margin-top:1rem;">
        <!-- Banner Publica tu Web -->
        <div style="background:linear-gradient(135deg, rgba(30,58,138,0.4) 0%, rgba(15,23,42,0.8) 100%); border:1.5px solid rgba(59,130,246,0.35); border-radius:16px; padding:1.5rem 1.75rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1.25rem; margin-bottom:2rem; box-shadow:0 10px 35px rgba(0,0,0,0.3), 0 0 20px rgba(59,130,246,0.1);">
          <div style="max-width:640px;">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem;">
              <span style="fontSize:1.25rem;">🚀</span>
              <h3 style="fontSize:1.25rem; font-weight:800; color:#ffffff; margin:0;">
                ¿Tienes una web, blog o proyecto digital?
              </h3>
            </div>
            <p style="font-size:0.92rem; color:var(--text-secondary); margin:0; line-height:1.5;">
              Anúnciate en nuestro escaparate para ganar visibilidad ante nuestra comunidad. Aceptamos proyectos independientes, blogs, webs amigas y colaboraciones.
            </p>
          </div>
          <button onclick="openModal()" style="display:inline-flex; align-items:center; gap:0.5rem; padding:0.75rem 1.5rem; border-radius:var(--radius-full); background:linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color:#ffffff; font-weight:700; font-size:0.92rem; border:none; cursor:pointer; box-shadow:0 0 20px rgba(59,130,246,0.4); transition:all 0.2s ease;">
            <span>➕</span>
            <span>Publicar mi Web aquí</span>
          </button>
        </div>

        <!-- Web Cards Grid -->
        <div class="grid-container">
          ${websCardsHtml}
        </div>
      </section>

      <!-- TAB 2: BAZAR DE AMAZON -->
      <section id="section-amazon" style="display:none; margin-top:1rem;">
        <!-- Filter Buttons -->
        <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:0.55rem; margin-bottom:2rem;">
          <button class="filter-btn active" onclick="filterAmazon('all')">🌟 Todos los Gadgets</button>
          <button class="filter-btn" onclick="filterAmazon('tech')">⚡ Gadgets & Tech</button>
          <button class="filter-btn" onclick="filterAmazon('setup')">💻 Setup & Escritorio</button>
          <button class="filter-btn" onclick="filterAmazon('regalos')">🎁 Regalos Curiosos</button>
          <button class="filter-btn" onclick="filterAmazon('ocio')">👾 Ocio & Frikis</button>
        </div>

        <!-- Amazon Products Grid -->
        <div class="amazon-grid">
          ${productsCardsHtml}
        </div>

        <!-- Disclaimer -->
        <div style="margin-top:3.5rem; padding:1.25rem 1.5rem; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:12px; font-size:0.82rem; color:var(--text-muted); line-height:1.6; text-align:center;">
          <p style="margin:0;">
            📌 <strong>Aviso de Afiliación:</strong> En calidad de Afiliado de Amazon, podemos obtener ingresos por las compras adscritas que cumplen los requisitos aplicables. Los precios y disponibilidad de los productos son orientativos y corresponden al momento de la publicación.
          </p>
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

  <!-- Modal Submission -->
  <div id="submit-modal" class="modal-backdrop" onclick="if(event.target===this) closeModal()">
    <div class="modal-box">
      <button onclick="closeModal()" style="position:absolute; top:1.25rem; right:1.25rem; background:rgba(255,255,255,0.08); border:none; color:var(--text-secondary); width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer;">
        ✕
      </button>

      <div id="modal-form-content">
        <div style="display:flex; align-items:center; gap:0.65rem; margin-bottom:0.65rem;">
          <div style="width:42px; height:42px; border-radius:50%; background:rgba(59,130,246,0.2); border:1px solid rgba(59,130,246,0.5); display:flex; align-items:center; justify-content:center; font-size:1.25rem;">
            🚀
          </div>
          <div>
            <h3 style="font-size:1.35rem; font-weight:800; color:#ffffff; margin:0;">
              Publica tu Web o Proyecto
            </h3>
            <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">
              Envía los datos de tu sitio o contáctanos directamente en <a href="mailto:consultasydudasvarias@hotmail.com" style="color:#60a5fa; text-decoration:underline;">consultasydudasvarias@hotmail.com</a>
            </p>
          </div>
        </div>

        <form id="publish-web-form" onsubmit="handleFormSubmit(event)" style="margin-top:1.5rem; display:flex; flex-direction:column; gap:1rem;">
          <input type="checkbox" name="botcheck" class="hidden" style="display:none;">

          <div>
            <label style="display:block; font-size:0.84rem; font-weight:600; color:#e2e8f0; margin-bottom:0.35rem;">
              Nombre de la Web / Proyecto *
            </label>
            <input type="text" id="form-name" required placeholder="Ej: Mi Rincón Creativo" style="width:100%; padding:0.65rem 0.9rem; border-radius:8px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); color:#ffffff; font-size:0.9rem;">
          </div>

          <div>
            <label style="display:block; font-size:0.84rem; font-weight:600; color:#e2e8f0; margin-bottom:0.35rem;">
              URL del Sitio Web *
            </label>
            <input type="url" id="form-url" required placeholder="https://tudominio.com" style="width:100%; padding:0.65rem 0.9rem; border-radius:8px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); color:#ffffff; font-size:0.9rem;">
          </div>

          <div>
            <label style="display:block; font-size:0.84rem; font-weight:600; color:#e2e8f0; margin-bottom:0.35rem;">
              Tu Email de Contacto *
            </label>
            <input type="email" id="form-email" required placeholder="tuemail@ejemplo.com" style="width:100%; padding:0.65rem 0.9rem; border-radius:8px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); color:#ffffff; font-size:0.9rem;">
          </div>

          <div>
            <label style="display:block; font-size:0.84rem; font-weight:600; color:#e2e8f0; margin-bottom:0.35rem;">
              Modalidad deseada
            </label>
            <select id="form-plan" style="width:100%; padding:0.65rem 0.9rem; border-radius:8px; background:#1e293b; border:1px solid rgba(255,255,255,0.15); color:#ffffff; font-size:0.9rem;">
              <option value="Propuesta Estándar (Revisión Comunitaria)">🌟 Propuesta Estándar (Revisión Comunitaria)</option>
              <option value="Enlace Patrocinado / Destacado">💎 Enlace Patrocinado / Destacado</option>
            </select>
          </div>

          <div>
            <label style="display:block; font-size:0.84rem; font-weight:600; color:#e2e8f0; margin-bottom:0.35rem;">
              Breve descripción de la web
            </label>
            <textarea id="form-desc" rows="3" placeholder="Explica en 1 o 2 frases de qué trata tu página..." style="width:100%; padding:0.65rem 0.9rem; border-radius:8px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); color:#ffffff; font-size:0.88rem; resize:none;"></textarea>
          </div>

          <p style="font-size:0.78rem; color:var(--text-muted); margin:0; line-height:1.4;">
            🔒 Tu mensaje viajará de forma segura mediante Web3Forms directo a nuestra bandeja oficial: <em>consultasydudasvarias@hotmail.com</em>.
          </p>

          <div id="form-error-msg" style="display:none; color:#f87171; font-size:0.85rem; background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.3); border-radius:8px; padding:0.6rem 0.8rem; text-align:center;"></div>

          <button type="submit" id="form-submit-btn" style="margin-top:0.35rem; padding:0.8rem; border-radius:10px; background:linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color:#ffffff; font-weight:800; font-size:0.95rem; border:none; cursor:pointer; box-shadow:0 0 20px rgba(59,130,246,0.45); transition:all 0.2s ease;">
            <span>🚀 Enviar Propuesta</span>
          </button>
        </form>
      </div>

      <div id="modal-success-content" style="display:none; text-align:center; padding:1.5rem 0;">
        <div style="font-size:3.5rem; margin-bottom:1rem;">✅</div>
        <h3 style="font-size:1.4rem; font-weight:800; color:#ffffff; margin-bottom:0.5rem;">
          ¡Propuesta Recibida con Éxito!
        </h3>
        <p id="success-msg-text" style="font-size:0.92rem; color:var(--text-secondary); line-height:1.6; margin-bottom:1.5rem;">
          Hemos registrado los datos de tu sitio web. Nos pondremos en contacto a través de tu email.
        </p>
        <button onclick="closeModal()" style="padding:0.65rem 1.5rem; border-radius:var(--radius-full); background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:#ffffff; font-weight:700; cursor:pointer;">
          Cerrar
        </button>
      </div>
    </div>
  </div>

  <script>
    function switchTab(tab) {
      if (window.DesvariosAuth) {
        window.DesvariosAuth.unlockMedal('red-explorador');
      }
      const sectionWebs = document.getElementById('section-webs');
      const sectionAmazon = document.getElementById('section-amazon');
      const btnWebs = document.getElementById('tab-btn-webs');
      const btnAmazon = document.getElementById('tab-btn-amazon');

      if (tab === 'webs') {
        sectionWebs.style.display = 'block';
        sectionAmazon.style.display = 'none';
        btnWebs.className = 'tab-btn active-tab-webs';
        btnAmazon.className = 'tab-btn';
      } else {
        sectionWebs.style.display = 'none';
        sectionAmazon.style.display = 'block';
        btnWebs.className = 'tab-btn';
        btnAmazon.className = 'tab-btn active-tab-amazon';
      }
    }

    function filterAmazon(cat) {
      if (window.DesvariosAuth) {
        window.DesvariosAuth.unlockMedal('red-explorador');
      }
      const buttons = document.querySelectorAll('#section-amazon .filter-btn');
      buttons.forEach(btn => {
        if (cat === 'all' && btn.innerText.includes('Todos')) {
          btn.classList.add('active');
        } else if (cat !== 'all' && btn.getAttribute('onclick').includes(cat)) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      const cards = document.querySelectorAll('.amazon-card');
      cards.forEach(c => {
        if (cat === 'all' || c.getAttribute('data-cat') === cat) {
          c.style.display = 'flex';
        } else {
          c.style.display = 'none';
        }
      });
    }

    function openModal() {
      document.getElementById('submit-modal').style.display = 'flex';
      document.getElementById('modal-form-content').style.display = 'block';
      document.getElementById('modal-success-content').style.display = 'none';
      const err = document.getElementById('form-error-msg');
      if (err) err.style.display = 'none';
    }

    function closeModal() {
      document.getElementById('submit-modal').style.display = 'none';
      const form = document.getElementById('publish-web-form');
      const err = document.getElementById('form-error-msg');
      const btn = document.getElementById('form-submit-btn');
      if (form) form.reset();
      if (err) err.style.display = 'none';
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>🚀 Enviar Propuesta</span>';
      }
      document.getElementById('modal-form-content').style.display = 'block';
      document.getElementById('modal-success-content').style.display = 'none';
    }

    async function handleFormSubmit(e) {
      e.preventDefault();
      const form = document.getElementById('publish-web-form');
      const btn = document.getElementById('form-submit-btn');
      const err = document.getElementById('form-error-msg');
      const name = document.getElementById('form-name').value;
      const url = document.getElementById('form-url').value;
      const email = document.getElementById('form-email').value;
      const plan = document.getElementById('form-plan').value;
      const desc = document.getElementById('form-desc').value;

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>⏳ Transmitiendo propuesta...</span>';
      }
      if (err) err.style.display = 'none';

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: 'c669c668-da2d-4b10-8298-094ee145a7d6',
            subject: 'Nueva propuesta de Web para el Escaparate (' + name + ' - ' + plan + ')',
            from_name: 'Tus Desvaríos - Escaparate Web',
            name: name,
            email: email,
            website_url: url,
            plan: plan,
            description: desc,
            message: 'Solicitud para publicar web en Tus Desvaríos:\\n' +
                     '• Proyecto: ' + name + '\\n' +
                     '• URL: ' + url + '\\n' +
                     '• Modalidad: ' + plan + '\\n' +
                     '• Email del solicitante: ' + email + '\\n' +
                     '• Descripción: ' + desc
          })
        });
        const data = await res.json();
        if (res.status === 200 && data.success) {
          document.getElementById('modal-form-content').style.display = 'none';
          document.getElementById('modal-success-content').style.display = 'block';
          document.getElementById('success-msg-text').innerHTML = 'Hemos recibido la propuesta para <strong>' + name + '</strong> en nuestro buzón oficial (<em>consultasydudasvarias@hotmail.com</em>). Revisaremos tu sitio y te responderemos a <strong>' + email + '</strong>.';
        } else {
          if (err) {
            err.textContent = data.message || '⚠️ Error al enviar la propuesta. Puedes escribirnos directamente a consultasydudasvarias@hotmail.com';
            err.style.display = 'block';
          }
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<span>🚀 Enviar Propuesta</span>';
          }
        }
      } catch (error) {
        if (err) {
          err.textContent = '⚠️ Error de conexión. Puedes escribirnos directamente a consultasydudasvarias@hotmail.com';
          err.style.display = 'block';
        }
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<span>🚀 Enviar Propuesta</span>';
        }
      }
    }
  </script>
  <script src="js/cookie-banner.js"></script>
</body>
</html>`;
}

function build() {
  const html = generateRedHtml();
  const outPath = path.join(__dirname, '..', 'desvarios-por-la-red.html');
  fs.writeFileSync(outPath, html, 'utf8');
  console.log('Successfully generated desvarios-por-la-red.html!');
}

build();

module.exports = { generateRedHtml, build };

