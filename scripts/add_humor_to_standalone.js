const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'build_standalone_pages.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Top data imports
const dataImports = `// Humor
const excusasRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'humor', 'excusas.json'), 'utf8'));
const pildorasRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'humor', 'pildoras.json'), 'utf8'));
const traductorRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'humor', 'traductor.json'), 'utf8'));
`;

if (!content.includes('data/humor/excusas.json')) {
  content = content.replace('// Games', dataImports + '\n// Games');
}

// 2. Update navigation in all templates to include Desvaríos de Humor link
const oldNavBlock = `<a href="desvarios-mentales.html" class="nav-link" title="Tests, Enigmas y Retos Psicológicos">
            <span>🧪</span>
            <span class="nav-link-text">Desvaríos Mentales</span>
          </a>`;

const newNavBlock = `<a href="desvarios-mentales.html" class="nav-link" title="Tests, Enigmas y Retos Psicológicos">
            <span>🧪</span>
            <span class="nav-link-text">Desvaríos Mentales</span>
          </a>
          <a href="desvarios-de-humor.html" class="nav-link" title="Sátira, Generador de Excusas y Pensamientos de Ducha">
            <span>🎭</span>
            <span class="nav-link-text">Desvaríos de Humor</span>
          </a>`;

// Replace in navbars (avoid duplicate if already present)
if (!content.includes('href="desvarios-de-humor.html"')) {
  content = content.split(oldNavBlock).join(newNavBlock);
}

// 3. Update index.html humor card
const oldHumorCard = `<div class="cat-card cat-card-inactive" style="--card-accent:#ec4899; --card-glow:rgba(236,72,153,0.15); --card-border:rgba(236,72,153,0.25);">
          <div class="cat-card-header">
            <span class="cat-card-icon" style="background:rgba(236,72,153,0.1); border-color:rgba(236,72,153,0.2);">🎭</span>
            <span class="cat-pill cat-pill-soon">⏳ Próximamente</span>
          </div>
          <h3 class="cat-card-title">Desvaríos de Humor</h3>
          <p class="cat-card-desc">Chistes, viñetas, memes seleccionados y anécdotas absurdas para sacar una sonrisa y desconectar de la rutina diaria.</p>
          <div class="cat-card-cta" style="color:var(--text-muted);">
            <span>Próximamente</span>
          </div>
        </div>`;

const newHumorCard = `<a href="desvarios-de-humor.html" class="cat-card cat-card-active" style="--card-accent:#ec4899; --card-glow:rgba(236,72,153,0.25); --card-border:rgba(236,72,153,0.45); text-decoration:none;">
          <div class="cat-card-header">
            <span class="cat-card-icon" style="background:rgba(236,72,153,0.14); border-color:rgba(236,72,153,0.38);">🎭</span>
            <span class="cat-pill cat-pill-live">🟢 Disponible</span>
          </div>
          <h3 class="cat-card-title">Desvaríos de Humor</h3>
          <p class="cat-card-desc">El generador de excusas infalible, traductor corporativo, pensamientos de ducha virales y las leyes del caos cotidiano.</p>
          <div class="cat-card-cta">
            <span>Explorar Humor</span>
            <span>→</span>
          </div>
        </a>`;

if (content.includes(oldHumorCard)) {
  content = content.replace(oldHumorCard, newHumorCard);
}

// 4. Update index.html hero category strip link
const oldHeroHumor = `<span class="cat-badge" style="--cat-accent:#ec4899; --cat-glow:rgba(236,72,153,0.25);">
            <span>🎭</span> <span>Desvaríos de Humor</span>
          </span>`;

const newHeroHumor = `<a href="desvarios-de-humor.html" class="cat-badge" style="--cat-accent:#ec4899; --cat-glow:rgba(236,72,153,0.25);">
            <span>🎭</span> <span>Desvaríos de Humor</span>
          </a>`;

if (content.includes(oldHeroHumor)) {
  content = content.replace(oldHeroHumor, newHeroHumor);
}

// 5. Add generateHumorHtml() function and file saving
const humorHtmlGenerator = `
// ==========================================================
// 8. GENERATE DESVARIOS-DE-HUMOR.HTML (STANDALONE)
// ==========================================================
function generateHumorHtml() {
  const situacionesJson = JSON.stringify(excusasRaw.situaciones);
  const tonosJson = JSON.stringify(excusasRaw.tonos);
  const excusasJson = JSON.stringify(excusasRaw.excusas);
  const categoriasJson = JSON.stringify(pildorasRaw.categorias);
  const pildorasJson = JSON.stringify(pildorasRaw.pildoras);
  const leyesJson = JSON.stringify(pildorasRaw.leyesMurphy);
  const traduccionesJson = JSON.stringify(traductorRaw.ejemplos);

  return \`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Desvaríos de Humor — Generador de Excusas, Sátira y Pensamientos de Ducha | Tus Desvaríos</title>
  <meta name="description" content="Ríete con el Generador de Excusas Infalible, el Traductor Corporativo, pensamientos de ducha virales y las leyes del caos cotidiano en Tus Desvaríos.">
  <meta name="keywords" content="desvarios de humor, generador de excusas, pensamientos de ducha, shower thoughts en español, traductor corporativo, humor geek, leyes de murphy, satira cotidiana, tus desvarios">
  
  <link rel="canonical" href="https://tusdesvarios.com/desvarios-de-humor">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Desvaríos de Humor — Sátira, Generador de Excusas y Pensamientos de Ducha">
  <meta property="og:description" content="El laboratorio del absurdo y la sátira cotidiana. Excusas con rigor académico, traductor de postureo corporativo y píldoras cómicas.">
  <meta property="og:url" content="https://tusdesvarios.com/desvarios-de-humor">
  <meta property="og:image" content="images/categories/desvarios-humor.jpg">

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
      --radius-lg: 22px;
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
    }

    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .site-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(11, 15, 25, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-subtle);
    }
    .site-header-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.75rem 1.25rem;
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
      font-family: var(--font-display);
      font-size: 1.15rem;
      font-weight: 700;
    }
    .header-nav {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      overflow-x: auto;
      padding-bottom: 2px;
    }
    .nav-link {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.4rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.82rem;
      font-weight: 500;
      color: var(--text-muted);
      text-decoration: none;
      border: 1px solid transparent;
      transition: all 0.18s ease;
      white-space: nowrap;
    }
    .nav-link:hover {
      color: var(--text-primary);
      background: rgba(255, 255, 255, 0.05);
    }
    .active-humor {
      color: #f472b6 !important;
      background: rgba(236, 72, 153, 0.15) !important;
      border-color: rgba(236, 72, 153, 0.45) !important;
      font-weight: 700 !important;
    }

    .main-content {
      flex: 1;
      max-width: 980px;
      margin: 0 auto;
      padding: 2rem 1.25rem 4rem;
      width: 100%;
    }

    .portal-hero {
      text-align: center;
      padding: 1.5rem 0 2.5rem;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.9rem;
      border-radius: var(--radius-full);
      background: rgba(236, 72, 153, 0.12);
      border: 1px solid rgba(236, 72, 153, 0.4);
      color: #f472b6;
      font-size: 0.82rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
    }
    .portal-title {
      font-family: var(--font-display);
      font-size: clamp(2rem, 4.5vw, 3rem);
      font-weight: 900;
      letter-spacing: -0.01em;
      margin-bottom: 0.85rem;
    }
    .portal-description {
      font-size: 1.05rem;
      color: var(--text-secondary);
      max-width: 680px;
      margin: 0 auto 1.5rem;
      line-height: 1.65;
    }

    .categories-strip {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1.25rem;
    }
    .cat-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.35rem 0.8rem;
      border-radius: var(--radius-full);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--cat-accent, var(--border-subtle));
      color: var(--text-secondary);
      font-size: 0.82rem;
      text-decoration: none;
      transition: all 0.2s;
    }
    .cat-badge:hover {
      background: var(--cat-glow);
      color: #fff;
    }

    .cat-filter-btn {
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-full);
      border: 1px solid var(--border-subtle);
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-secondary);
      font-size: 0.82rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      transition: all 0.15s ease;
    }
    .cat-filter-btn-active {
      background: rgba(236, 72, 153, 0.2) !important;
      border-color: #ec4899 !important;
      color: #f472b6 !important;
      font-weight: 700 !important;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 1rem;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
      color: #fff;
      font-weight: 700;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);
      transition: all 0.2s ease;
      text-decoration: none;
    }
    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(236, 72, 153, 0.6);
    }
    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-full);
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      text-decoration: none;
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.12);
      color: var(--text-primary);
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
  </style>
</head>
<body>
  <div class="app-container">
    <!-- Header -->
    <header class="site-header">
      <div class="site-header-inner">
        <a href="index.html" class="logo-link" title="Ir a la portada de Tus Desvaríos">
          <img src="images/logo-icon.png" alt="Tus Desvaríos Logo" class="logo-image" style="width:34px; height:34px; border-radius:50%; object-fit:cover; border:1.5px solid rgba(255,255,255,0.25); box-shadow:0 0 14px rgba(168,85,247,0.35);">
          <span>Tus Desvaríos</span>
        </a>
        <nav class="header-nav">
          <a href="crea-tu-historia.html" class="nav-link" title="Novelas y Ficción Interactiva">
            <span>📖</span>
            <span class="nav-link-text">Crea tus Desvaríos</span>
          </a>
          <a href="desvarios-retro.html" class="nav-link" title="Arcade, Juegos Clásicos y El Ahorcado">
            <span>🕹️</span>
            <span class="nav-link-text">Desvaríos Retro</span>
          </a>
          <a href="desvarios-mentales.html" class="nav-link" title="Tests, Enigmas y Retos Psicológicos">
            <span>🧪</span>
            <span class="nav-link-text">Desvaríos Mentales</span>
          </a>
          <a href="desvarios-de-humor.html" class="nav-link active-humor" title="Sátira, Generador de Excusas y Pensamientos de Ducha">
            <span>🎭</span>
            <span class="nav-link-text">Desvaríos de Humor</span>
          </a>
          <a href="index.html" class="nav-link" title="Portada Principal">
            <span>🏛️</span>
            <span class="nav-link-text">Portal</span>
          </a>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div id="humor-app-root"></div>
    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <p>© \${new Date().getFullYear()} TusDesvarios.com — Tu rincón de entretenimiento y ficción.</p>
    </footer>
  </div>

  <script>
    const situacionesData = \${situacionesJson};
    const tonosData = \${tonosJson};
    const excusasData = \${excusasJson};
    const categoriasPildorasData = \${categoriasJson};
    const pildorasData = \${pildorasJson};
    const leyesData = \${leyesJson};
    const traduccionesData = \${traduccionesJson};

    const humorApp = {
      selectedSituacion: situacionesData[0].id,
      selectedTono: 'formal',
      selectedTraduccionIndex: 0,
      selectedCatPildora: 'todas',
      activePildoraIndex: 0,
      reactions: {},
      userReacted: {},

      init() {
        try {
          const saved = localStorage.getItem('tusdesvarios_humor_reactions');
          if (saved) {
            this.reactions = JSON.parse(saved);
          } else {
            pildorasData.forEach(p => {
              this.reactions[p.id] = {
                lol: p.likesDefault,
                mindblown: Math.floor(p.likesDefault * 0.4),
                facepalm: Math.floor(p.likesDefault * 0.25)
              };
            });
          }
        } catch(e) {}
        this.render();
      },

      setSituacion(id) {
        this.selectedSituacion = id;
        this.render();
      },

      setTono(id) {
        this.selectedTono = id;
        this.render();
      },

      randomExcusa() {
        const randSit = situacionesData[Math.floor(Math.random() * situacionesData.length)].id;
        const randTon = tonosData[Math.floor(Math.random() * tonosData.length)].id;
        this.selectedSituacion = randSit;
        this.selectedTono = randTon;
        this.render();
      },

      copyExcusa() {
        const excusa = excusasData.find(e => e.situacion === this.selectedSituacion && e.tono === this.selectedTono) || excusasData[0];
        navigator.clipboard.writeText(excusa.texto);
        const btn = document.getElementById('btn-copy-excusa');
        if (btn) {
          btn.innerHTML = '<span>✓</span> <span>¡Copiado al Portapapeles!</span>';
          btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
          setTimeout(() => { this.render(); }, 2000);
        }
      },

      setTraduccion(idx) {
        this.selectedTraduccionIndex = idx;
        this.render();
      },

      copyTraduccion() {
        const tr = traduccionesData[this.selectedTraduccionIndex] || traduccionesData[0];
        navigator.clipboard.writeText(tr.corporativo);
        const btn = document.getElementById('btn-copy-traduccion');
        if (btn) {
          btn.innerHTML = '<span>✓</span> <span>¡Copiado al Portapapeles!</span>';
          btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
          setTimeout(() => { this.render(); }, 2000);
        }
      },

      setCatPildora(catId) {
        this.selectedCatPildora = catId;
        this.activePildoraIndex = 0;
        this.render();
      },

      nextPildora() {
        const filtered = this.selectedCatPildora === 'todas' ? pildorasData : pildorasData.filter(p => p.categoria === this.selectedCatPildora);
        this.activePildoraIndex = (this.activePildoraIndex + 1) % filtered.length;
        this.render();
      },

      randomPildora() {
        const filtered = this.selectedCatPildora === 'todas' ? pildorasData : pildorasData.filter(p => p.categoria === this.selectedCatPildora);
        this.activePildoraIndex = Math.floor(Math.random() * filtered.length);
        this.render();
      },

      reactPildora(pildoraId, type) {
        if (this.userReacted[pildoraId] === type) return;
        if (!this.reactions[pildoraId]) {
          this.reactions[pildoraId] = { lol: 50, mindblown: 20, facepalm: 10 };
        }
        this.reactions[pildoraId][type] = (this.reactions[pildoraId][type] || 0) + 1;
        this.userReacted[pildoraId] = type;
        try {
          localStorage.setItem('tusdesvarios_humor_reactions', JSON.stringify(this.reactions));
        } catch(e) {}
        this.render();
      },

      render() {
        const root = document.getElementById('humor-app-root');
        if (!root) return;

        const activeExcusa = excusasData.find(e => e.situacion === this.selectedSituacion && e.tono === this.selectedTono) || excusasData[0];
        const activeTraduccion = traduccionesData[this.selectedTraduccionIndex] || traduccionesData[0];
        const filteredPildoras = this.selectedCatPildora === 'todas' ? pildorasData : pildorasData.filter(p => p.categoria === this.selectedCatPildora);
        const currentPildora = filteredPildoras[this.activePildoraIndex % filteredPildoras.length] || pildorasData[0];
        const pildoraReactions = this.reactions[currentPildora.id] || { lol: currentPildora.likesDefault, mindblown: 20, facepalm: 10 };

        let html = \`
          <!-- Hero Section -->
          <section class="portal-hero">
            <div class="hero-badge">
              <span>✨</span> <span>El Laboratorio del Absurdo y la Sátira Cotidiana</span>
            </div>
            <h1 class="portal-title">
              Desvaríos de <span style="color:#ec4899; text-shadow:0 0 25px rgba(236,72,153,0.45);">Humor</span>
            </h1>
            <p class="portal-description">
              Un rincón donde perder el tiempo con estilo. Generadores de excusas con rigor académico, traductores de postureo corporativo, pensamientos de ducha y las leyes del caos cotidiano.
            </p>

            <div class="categories-strip">
              <a href="#generador-excusas" class="cat-badge" style="--cat-accent:#ec4899; --cat-glow:rgba(236,72,153,0.25);">
                <span>🎩</span> <span>Generador de Excusas</span>
              </a>
              <a href="#ruleta-pildoras" class="cat-badge" style="--cat-accent:#a855f7; --cat-glow:rgba(168,85,247,0.25);">
                <span>🚿</span> <span>Pensamientos de Ducha</span>
              </a>
              <a href="#traductor-corporativo" class="cat-badge" style="--cat-accent:#06b6d4; --cat-glow:rgba(6,182,212,0.25);">
                <span>💼</span> <span>Traductor Corporativo</span>
              </a>
              <a href="#leyes-caos" class="cat-badge" style="--cat-accent:#f59e0b; --cat-glow:rgba(245,158,11,0.25);">
                <span>📜</span> <span>Leyes de Murphy</span>
              </a>
            </div>
          </section>

          <!-- 1. GENERADOR DE EXCUSAS -->
          <section id="generador-excusas" style="margin-top:2rem; padding:2.25rem 1.75rem; background:var(--bg-surface); border:1px solid rgba(236,72,153,0.35); border-radius:var(--radius-lg); box-shadow:0 12px 35px rgba(0,0,0,0.5), 0 0 25px rgba(236,72,153,0.12);">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem; margin-bottom:1.25rem;">
              <div style="display:flex; align-items:center; gap:0.65rem;">
                <span style="font-size:1.75rem;">🎩</span>
                <div>
                  <h2 style="font-size:1.35rem; font-weight:800; color:#ffffff; margin:0;">El Generador de Excusas Infalible</h2>
                  <p style="font-size:0.85rem; color:var(--text-muted); margin:0;">Justificaciones absurdamente elaboradas para situaciones de emergencia social</p>
                </div>
              </div>
              <button onclick="humorApp.randomExcusa()" class="btn-secondary">
                <span style="color:#ec4899;">🔀</span> <span>Excusa Aleatoria</span>
              </button>
            </div>

            <!-- Situación -->
            <div style="margin-bottom:1.25rem;">
              <label style="display:block; font-size:0.8rem; font-weight:700; color:var(--text-secondary); text-transform:uppercase; margin-bottom:0.5rem; letter-spacing:0.04em;">
                1. Selecciona la situación de crisis:
              </label>
              <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
        \`;

        situacionesData.forEach(sit => {
          const isSelected = humorApp.selectedSituacion === sit.id;
          html += \`
            <button onclick="humorApp.setSituacion('\${sit.id}')" class="cat-filter-btn \${isSelected ? 'cat-filter-btn-active' : ''}">
              <span>\${sit.icono}</span>
              <span>\${sit.nombre}</span>
            </button>
          \`;
        });

        html += \`
              </div>
            </div>

            <!-- Tono -->
            <div style="margin-bottom:1.5rem;">
              <label style="display:block; font-size:0.8rem; font-weight:700; color:var(--text-secondary); text-transform:uppercase; margin-bottom:0.5rem; letter-spacing:0.04em;">
                2. Elige el tono de la justificación:
              </label>
              <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
        \`;

        tonosData.forEach(tono => {
          const isSelected = humorApp.selectedTono === tono.id;
          html += \`
            <button onclick="humorApp.setTono('\${tono.id}')" style="font-size:0.82rem; padding:0.35rem 0.75rem; border-radius:var(--radius-full); background:\${isSelected ? 'rgba(236,72,153,0.25)' : 'rgba(255,255,255,0.04)'}; border:1px solid \${isSelected ? '#ec4899' : 'var(--border-subtle)'}; color:\${isSelected ? '#f472b6' : 'var(--text-muted)'}; font-weight:\${isSelected ? '700' : '500'}; cursor:pointer; display:inline-flex; align-items:center; gap:0.35rem;">
              <span>\${tono.icono}</span>
              <span>\${tono.nombre}</span>
            </button>
          \`;
        });

        html += \`
              </div>
            </div>

            <!-- Card Result -->
            <div style="padding:1.5rem; background:rgba(11, 15, 25, 0.75); border:1.5px dashed rgba(236, 72, 153, 0.45); border-radius:var(--radius-md);">
              <div style="font-size:1.05rem; line-height:1.65; color:#f8fafc; font-style:italic; margin-bottom:1.25rem;">
                &ldquo;\${activeExcusa.texto}&rdquo;
              </div>
              <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem;">
                <span style="font-size:0.78rem; color:#f472b6; fontWeight:600;">✨ Calibrada para salvar tu reputación</span>
                <button id="btn-copy-excusa" onclick="humorApp.copyExcusa()" class="btn-primary">
                  <span>📋</span> <span>Copiar Excusa</span>
                </button>
              </div>
            </div>
          </section>

          <!-- 2. RULETA DE PÍLDORAS CÓMICAS -->
          <section id="ruleta-pildoras" style="margin-top:3.5rem; padding:2.25rem 1.75rem; background:var(--bg-surface); border:1px solid rgba(168, 85, 247, 0.35); border-radius:var(--radius-lg); box-shadow:0 12px 35px rgba(0,0,0,0.5), 0 0 25px rgba(168,85,247,0.12);">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem; margin-bottom:1.25rem;">
              <div style="display:flex; align-items:center; gap:0.65rem;">
                <span style="font-size:1.75rem;">🚿</span>
                <div>
                  <h2 style="font-size:1.35rem; font-weight:800; color:#ffffff; margin:0;">Pensamientos de Ducha & Píldoras Cómicas</h2>
                  <p style="font-size:0.85rem; color:var(--text-muted); margin:0;">Verdades incómodas, paradojas cotidianas y chistes con fundamento</p>
                </div>
              </div>
              <button onclick="humorApp.randomPildora()" class="btn-secondary">
                <span style="color:#a855f7;">🔀</span> <span>Píldora Aleatoria</span>
              </button>
            </div>

            <!-- Categories -->
            <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1.5rem;">
        \`;

        categoriasPildorasData.forEach(cat => {
          const isSelected = humorApp.selectedCatPildora === cat.id;
          html += \`
            <button onclick="humorApp.setCatPildora('\${cat.id}')" class="cat-filter-btn \${isSelected ? 'cat-filter-btn-active' : ''}" style="\${isSelected ? 'background:rgba(168, 85, 247, 0.2) !important; border-color:#a855f7 !important; color:#c084fc !important;' : ''}">
              <span>\${cat.icono}</span>
              <span>\${cat.nombre}</span>
            </button>
          \`;
        });

        html += \`
            </div>

            <!-- Current Pill Card -->
            <div style="padding:1.75rem 1.5rem; background:rgba(11, 15, 25, 0.85); border:1px solid rgba(168, 85, 247, 0.3); border-radius:var(--radius-md); box-shadow:0 8px 25px rgba(0,0,0,0.4); min-height:180px; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
                  <span style="font-size:0.75rem; padding:0.2rem 0.6rem; border-radius:var(--radius-full); background:rgba(168, 85, 247, 0.15); border:1px solid rgba(168, 85, 247, 0.3); color:#c084fc; font-weight:700;">
                    \${currentPildora.autor}
                  </span>
                  <span style="font-size:0.8rem; color:var(--text-muted);">
                    \${humorApp.activePildoraIndex + 1} de \${filteredPildoras.length}
                  </span>
                </div>
                <h3 style="font-size:1.2rem; font-weight:800; color:#f8fafc; margin-bottom:0.65rem;">\${currentPildora.titulo}</h3>
                <p style="font-size:1rem; color:#cbd5e1; line-height:1.6; margin:0;">\${currentPildora.contenido}</p>
              </div>

              <!-- Reactions & Next -->
              <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.8rem; margin-top:1.5rem; padding-top:1rem; border-top:1px solid rgba(255,255,255,0.08);">
                <div style="display:flex; gap:0.5rem;">
                  <button onclick="humorApp.reactPildora('\${currentPildora.id}', 'lol')" style="display:inline-flex; align-items:center; gap:0.35rem; padding:0.3rem 0.65rem; border-radius:var(--radius-full); background:\${humorApp.userReacted[currentPildora.id] === 'lol' ? 'rgba(236,72,153,0.3)' : 'rgba(255,255,255,0.05)'}; border:1px solid \${humorApp.userReacted[currentPildora.id] === 'lol' ? '#ec4899' : 'var(--border-subtle)'}; color:#f8fafc; font-size:0.82rem; cursor:pointer;">
                    <span>😂</span> <span>\${pildoraReactions.lol}</span>
                  </button>
                  <button onclick="humorApp.reactPildora('\${currentPildora.id}', 'mindblown')" style="display:inline-flex; align-items:center; gap:0.35rem; padding:0.3rem 0.65rem; border-radius:var(--radius-full); background:\${humorApp.userReacted[currentPildora.id] === 'mindblown' ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.05)'}; border:1px solid \${humorApp.userReacted[currentPildora.id] === 'mindblown' ? '#a855f7' : 'var(--border-subtle)'}; color:#f8fafc; font-size:0.82rem; cursor:pointer;">
                    <span>🤯</span> <span>\${pildoraReactions.mindblown}</span>
                  </button>
                  <button onclick="humorApp.reactPildora('\${currentPildora.id}', 'facepalm')" style="display:inline-flex; align-items:center; gap:0.35rem; padding:0.3rem 0.65rem; border-radius:var(--radius-full); background:\${humorApp.userReacted[currentPildora.id] === 'facepalm' ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.05)'}; border:1px solid \${humorApp.userReacted[currentPildora.id] === 'facepalm' ? '#f59e0b' : 'var(--border-subtle)'}; color:#f8fafc; font-size:0.82rem; cursor:pointer;">
                    <span>🤦‍♂️</span> <span>\${pildoraReactions.facepalm}</span>
                  </button>
                </div>

                <button onclick="humorApp.nextPildora()" class="btn-primary" style="background:linear-gradient(135deg, #a855f7 0%, #7c3aed 100%); box-shadow:0 4px 15px rgba(168, 85, 247, 0.4);">
                  <span>Siguiente Desvarío</span> <span>→</span>
                </button>
              </div>
            </div>
          </section>

          <!-- 3. TRADUCTOR CORPORATIVO -->
          <section id="traductor-corporativo" style="margin-top:3.5rem; padding:2.25rem 1.75rem; background:var(--bg-surface); border:1px solid rgba(6, 182, 212, 0.35); border-radius:var(--radius-lg); box-shadow:0 12px 35px rgba(0,0,0,0.5), 0 0 25px rgba(6,182,212,0.12);">
            <div style="display:flex; align-items:center; gap:0.65rem; margin-bottom:1.25rem;">
              <span style="font-size:1.75rem;">💼</span>
              <div>
                <h2 style="font-size:1.35rem; font-weight:800; color:#ffffff; margin:0;">El Traductor de Postureo Corporativo</h2>
                <p style="font-size:0.85rem; color:var(--text-muted); margin:0;">Cómo convertir pensamientos 100% sinceros en jerga de consultoría estratégica</p>
              </div>
            </div>

            <div style="margin-bottom:1.25rem;">
              <label style="display:block; font-size:0.8rem; font-weight:700; color:var(--text-secondary); text-transform:uppercase; margin-bottom:0.5rem; letter-spacing:0.04em;">
                Selecciona la frase sincera:
              </label>
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:0.5rem;">
        \`;

        traduccionesData.forEach((tr, idx) => {
          const isSelected = humorApp.selectedTraduccionIndex === idx;
          html += \`
            <button onclick="humorApp.setTraduccion(\${idx})" style="padding:0.65rem 0.85rem; text-align:left; border-radius:var(--radius-sm); background:\${isSelected ? 'rgba(6, 182, 212, 0.18)' : 'rgba(255, 255, 255, 0.03)'}; border:1px solid \${isSelected ? '#06b6d4' : 'var(--border-subtle)'}; color:\${isSelected ? '#38bdf8' : 'var(--text-secondary)'}; font-size:0.83rem; cursor:pointer;">
              <span style="font-weight:600;">&ldquo;\${tr.sincero}&rdquo;</span>
            </button>
          \`;
        });

        html += \`
              </div>
            </div>

            <div style="padding:1.5rem; background:rgba(11, 15, 25, 0.75); border:1.5px solid rgba(6, 182, 212, 0.4); border-radius:var(--radius-md);">
              <div style="font-size:0.78rem; color:#38bdf8; font-weight:700; text-transform:uppercase; margin-bottom:0.4rem; letter-spacing:0.05em;">
                Versión para enviar por Slack / Correo:
              </div>
              <div style="font-size:1.02rem; line-height:1.6; color:#f8fafc; margin-bottom:1.25rem;">
                \${activeTraduccion.corporativo}
              </div>
              <div style="display:flex; justify-content:flex-end;">
                <button id="btn-copy-traduccion" onclick="humorApp.copyTraduccion()" class="btn-primary" style="background:linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); box-shadow:0 4px 15px rgba(6, 182, 212, 0.4);">
                  <span>📋</span> <span>Copiar Jerga</span>
                </button>
              </div>
            </div>
          </section>

          <!-- 4. LEYES DEL CAOS COTIDIANO -->
          <section id="leyes-caos" style="margin-top:3.5rem; padding:2.25rem 1.75rem; background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-lg);">
            <div style="display:flex; align-items:center; gap:0.65rem; margin-bottom:1.5rem;">
              <span style="font-size:1.75rem;">📜</span>
              <div>
                <h2 style="font-size:1.35rem; font-weight:800; color:#ffffff; margin:0;">Leyes del Caos Cotidiano</h2>
                <p style="font-size:0.85rem; color:var(--text-muted); margin:0;">Principios universales que demuestran que el cosmos tiene sentido del humor</p>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1.25rem;">
        \`;

        leyesData.forEach(ley => {
          html += \`
            <div style="padding:1.25rem; background:rgba(255,255,255,0.03); border:1px solid rgba(245, 158, 11, 0.25); border-radius:var(--radius-md);">
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
                <span style="font-size:0.72rem; font-weight:800; color:#fbbf24; background:rgba(245, 158, 11, 0.15); padding:0.15rem 0.5rem; border-radius:var(--radius-full);">
                  LEY #\${ley.numero}
                </span>
                <h3 style="font-size:0.98rem; font-weight:700; color:#f8fafc; margin:0;">\${ley.nombre}</h3>
              </div>
              <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.55; margin:0;">\${ley.descripcion}</p>
            </div>
          \`;
        });

        html += \`
            </div>
          </section>

          <!-- Back to portal -->
          <div style="text-align:center; margin-top:3.5rem; margin-bottom:2rem;">
            <a href="index.html" class="btn-secondary" style="display:inline-flex; align-items:center; gap:0.5rem;">
              <span>🏛️</span> <span>Volver a la Portada de Tus Desvaríos</span>
            </a>
          </div>
        \`;

        root.innerHTML = html;
      }
    };

    document.addEventListener('DOMContentLoaded', () => {
      humorApp.init();
    });
  </script>
</body>
</html>\`;
}

// Save standalone Humor page
const humorOut = path.join(__dirname, '..', 'desvarios-de-humor.html');
fs.writeFileSync(humorOut, generateHumorHtml(), 'utf8');
`;

if (!content.includes('generateHumorHtml')) {
  // Insert before console.log
  content = content.replace("console.log('Successfully generated index.html,", humorHtmlGenerator + "\nconsole.log('Successfully generated index.html, desvarios-de-humor.html,");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Updated scripts/build_standalone_pages.js with generateHumorHtml and navigation links!');
