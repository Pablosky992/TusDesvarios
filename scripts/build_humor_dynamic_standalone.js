const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'build_standalone_pages.js');
let content = fs.readFileSync(filePath, 'utf8');

// Ensure top imports load all humor json files
const humorImports = `// Humor Data
const excusasRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'humor', 'excusas.json'), 'utf8'));
const oraculoRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'humor', 'oraculo.json'), 'utf8'));
const traductorRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'humor', 'traductor.json'), 'utf8'));
const leyesRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'humor', 'leyes.json'), 'utf8'));
const pildorasRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'humor', 'pildoras.json'), 'utf8'));
`;

// Replace top data imports cleanly
const topSplit = content.split('// Games')[0];
const restAfterTop = content.substring(topSplit.length);

let newTop = topSplit;
if (newTop.includes('// Humor')) {
  newTop = newTop.split('// Humor')[0] + humorImports;
} else {
  newTop = newTop + humorImports;
}

const baseContent = restAfterTop.split('// ==========================================================\n// 8. GENERATE DESVARIOS-DE-HUMOR.HTML')[0];

const fullDynamicHumorGenerator = `// ==========================================================
// 8. GENERATE DESVARIOS-DE-HUMOR.HTML (DYNAMIC INTERACTIVE HUB)
// ==========================================================
function generateHumorHtml() {
  const excusasJson = JSON.stringify(excusasRaw);
  const oraculoJson = JSON.stringify(oraculoRaw);
  const traductorJson = JSON.stringify(traductorRaw);
  const leyesJson = JSON.stringify(leyesRaw);
  const pildorasJson = JSON.stringify(pildorasRaw);

  return \`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Desvaríos de Humor — Consola Interactiva del Absurdo | Tus Desvaríos</title>
  <meta name="description" content="Generador de excusas infalible con medidor de credibilidad, oráculo del desvarío, traductor corporativo a 3 niveles y leyes de Murphy situacionales.">
  <meta name="keywords" content="desvarios de humor, generador de excusas, oraculo del desvario, pensamientos de ducha, traductor corporativo, leyes de murphy, satira cotidiana, tus desvarios">
  
  <link rel="canonical" href="https://tusdesvarios.com/desvarios-de-humor">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Desvaríos de Humor — Consola Interactiva del Absurdo">
  <meta property="og:description" content="Herramientas dinámicas de sátira con generador de excusas, oráculo de dilemas cotidianos y traductor corporativo.">
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
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem 1.25rem 4rem;
      width: 100%;
    }

    .portal-hero {
      text-align: center;
      padding: 1rem 0 1.5rem;
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
      max-width: 700px;
      margin: 0 auto 1.5rem;
      line-height: 1.65;
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
      background: rgba(236, 72, 153, 0.22) !important;
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
      <!-- Hero Section -->
      <section class="portal-hero">
        <div class="hero-badge">
          <span>✨</span> <span>Consola Interactiva del Absurdo & Sátira Cotidiana</span>
        </div>
        <h1 class="portal-title">
          Desvaríos de <span style="color:#ec4899; text-shadow:0 0 25px rgba(236,72,153,0.45);">Humor</span>
        </h1>
        <p class="portal-description">
          Elige una máquina interactiva, selecciona tu situación y genera respuestas, excusas y sentencias cósmicas instantáneas.
        </p>

        <!-- Machine Navigation Tabs -->
        <div id="machine-tabs" style="display:flex; flex-wrap:wrap; justify-content:center; gap:0.5rem; margin-top:1.5rem;">
          <button onclick="humorConsole.setTab('excusas')" id="tab-btn-excusas" style="padding:0.5rem 1rem; border-radius:var(--radius-full); border:1.5px solid #ec4899; background:rgba(236,72,153,0.25); color:#fff; font-weight:800; font-size:0.85rem; cursor:pointer; display:inline-flex; align-items:center; gap:0.45rem;">
            <span>🎩</span> <span>Máquina de Excusas</span>
          </button>
          <button onclick="humorConsole.setTab('oraculo')" id="tab-btn-oraculo" style="padding:0.5rem 1rem; border-radius:var(--radius-full); border:1.5px solid var(--border-subtle); background:rgba(255,255,255,0.04); color:var(--text-secondary); font-weight:500; font-size:0.85rem; cursor:pointer; display:inline-flex; align-items:center; gap:0.45rem;">
            <span>🔮</span> <span>Oráculo del Desvarío</span>
          </button>
          <button onclick="humorConsole.setTab('traductor')" id="tab-btn-traductor" style="padding:0.5rem 1rem; border-radius:var(--radius-full); border:1.5px solid var(--border-subtle); background:rgba(255,255,255,0.04); color:var(--text-secondary); font-weight:500; font-size:0.85rem; cursor:pointer; display:inline-flex; align-items:center; gap:0.45rem;">
            <span>💼</span> <span>Traductor Sincero (3 Capas)</span>
          </button>
          <button onclick="humorConsole.setTab('leyes')" id="tab-btn-leyes" style="padding:0.5rem 1rem; border-radius:var(--radius-full); border:1.5px solid var(--border-subtle); background:rgba(255,255,255,0.04); color:var(--text-secondary); font-weight:500; font-size:0.85rem; cursor:pointer; display:inline-flex; align-items:center; gap:0.45rem;">
            <span>📜</span> <span>Leyes del Caos</span>
          </button>
          <button onclick="humorConsole.setTab('pensamientos')" id="tab-btn-pensamientos" style="padding:0.5rem 1rem; border-radius:var(--radius-full); border:1.5px solid var(--border-subtle); background:rgba(255,255,255,0.04); color:var(--text-secondary); font-weight:500; font-size:0.85rem; cursor:pointer; display:inline-flex; align-items:center; gap:0.45rem;">
            <span>🚿</span> <span>Pensamientos de Ducha</span>
          </button>
        </div>
      </section>

      <!-- Machine Content Container -->
      <div id="machine-content" style="margin-top:1.5rem;"></div>

      <!-- Back to portal -->
      <div style="text-align:center; margin-top:3.5rem; margin-bottom:2rem;">
        <a href="index.html" class="btn-secondary" style="display:inline-flex; align-items:center; gap:0.5rem;">
          <span>🏛️</span> <span>Volver a la Portada de Tus Desvaríos</span>
        </a>
      </div>
    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <p>© \${new Date().getFullYear()} TusDesvarios.com — Tu rincón de entretenimiento y ficción.</p>
    </footer>
  </div>

  <script>
    const excusasData = \${excusasJson};
    const oraculoData = \${oraculoJson};
    const traductorData = \${traductorJson};
    const leyesData = \${leyesJson};
    const pildorasData = \${pildorasJson};

    const humorConsole = {
      activeTab: 'excusas',
      
      // Excusas state
      selectedAmbito: 'trabajo',
      selectedGravedad: 'leve',
      selectedTono: 'formal',

      // Oraculo state
      selectedCatDilema: 'comida',
      selectedDilemaId: 'd1',

      // Traductor state
      selectedCatTraductor: 'oficina',
      selectedFraseId: 'tr1',

      // Leyes state
      selectedEscenario: 'aeropuerto',

      // Pensamientos state
      selectedMood: 'todos',
      activePensamientoIndex: 0,
      reactions: {},
      userReacted: {},

      init() {
        try {
          const saved = localStorage.getItem('tusdesvarios_humor_reactions');
          if (saved) {
            this.reactions = JSON.parse(saved);
          } else {
            pildorasData.pensamientos.forEach(p => {
              this.reactions[p.id] = {
                lol: p.likes,
                mindblown: Math.floor(p.likes * 0.45),
                facepalm: Math.floor(p.likes * 0.2)
              };
            });
          }
        } catch(e) {}
        this.render();
      },

      setTab(tabName) {
        this.activeTab = tabName;
        const tabs = ['excusas', 'oraculo', 'traductor', 'leyes', 'pensamientos'];
        const colors = {
          excusas: '#ec4899',
          oraculo: '#a855f7',
          traductor: '#06b6d4',
          leyes: '#f59e0b',
          pensamientos: '#10b981'
        };

        tabs.forEach(t => {
          const btn = document.getElementById('tab-btn-' + t);
          if (btn) {
            if (t === tabName) {
              btn.style.border = '1.5px solid ' + colors[t];
              btn.style.background = colors[t] + '25';
              btn.style.color = '#ffffff';
              btn.style.fontWeight = '800';
              btn.style.boxShadow = '0 0 16px ' + colors[t] + '40';
            } else {
              btn.style.border = '1.5px solid var(--border-subtle)';
              btn.style.background = 'rgba(255,255,255,0.04)';
              btn.style.color = 'var(--text-secondary)';
              btn.style.fontWeight = '500';
              btn.style.boxShadow = 'none';
            }
          }
        });

        this.render();
      },

      // --- Excusas actions ---
      setAmbito(id) {
        this.selectedAmbito = id;
        this.render();
      },
      setGravedad(id) {
        this.selectedGravedad = id;
        this.render();
      },
      setTono(id) {
        this.selectedTono = id;
        this.render();
      },
      randomExcusa() {
        const rAmb = excusasData.ambitos[Math.floor(Math.random() * excusasData.ambitos.length)].id;
        const rGrav = excusasData.gravedades[Math.floor(Math.random() * excusasData.gravedades.length)].id;
        const rTon = excusasData.tonos[Math.floor(Math.random() * excusasData.tonos.length)].id;
        this.selectedAmbito = rAmb;
        this.selectedGravedad = rGrav;
        this.selectedTono = rTon;
        this.render();
      },
      copyExcusaText(text) {
        navigator.clipboard.writeText(text);
        const btn = document.getElementById('btn-copy-excusa');
        if (btn) {
          btn.innerHTML = '<span>✓</span> <span>¡Copiado al Portapapeles!</span>';
          btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
          setTimeout(() => {
            btn.innerHTML = '<span>📋</span> <span>Copiar Excusa</span>';
            btn.style.background = 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)';
          }, 2000);
        }
      },

      // --- Oraculo actions ---
      setCatDilema(catId) {
        this.selectedCatDilema = catId;
        const first = oraculoData.dilemas.find(d => d.categoria === catId);
        if (first) this.selectedDilemaId = first.id;
        this.render();
      },
      setDilema(id) {
        this.selectedDilemaId = id;
        this.render();
      },
      randomDilema() {
        const rand = oraculoData.dilemas[Math.floor(Math.random() * oraculoData.dilemas.length)];
        this.selectedCatDilema = rand.categoria;
        this.selectedDilemaId = rand.id;
        this.render();
      },

      // --- Traductor actions ---
      setCatTraductor(catId) {
        this.selectedCatTraductor = catId;
        const first = traductorData.frases.find(f => f.categoria === catId);
        if (first) this.selectedFraseId = first.id;
        this.render();
      },
      setFrase(id) {
        this.selectedFraseId = id;
        this.render();
      },
      copyTraduccionText(text, btnId) {
        navigator.clipboard.writeText(text);
        const btn = document.getElementById(btnId);
        if (btn) {
          btn.innerHTML = '<span>✓</span> <span>Copiado</span>';
          setTimeout(() => {
            btn.innerHTML = '<span>📋</span> <span>Copiar</span>';
          }, 2000);
        }
      },

      // --- Leyes actions ---
      setEscenario(id) {
        this.selectedEscenario = id;
        this.render();
      },

      // --- Pensamientos actions ---
      setMood(moodId) {
        this.selectedMood = moodId;
        this.activePensamientoIndex = 0;
        this.render();
      },
      nextPensamiento() {
        const filtered = this.selectedMood === 'todos' ? pildorasData.pensamientos : pildorasData.pensamientos.filter(p => p.mood === this.selectedMood);
        this.activePensamientoIndex = (this.activePensamientoIndex + 1) % filtered.length;
        this.render();
      },
      randomPensamiento() {
        const filtered = this.selectedMood === 'todos' ? pildorasData.pensamientos : pildorasData.pensamientos.filter(p => p.mood === this.selectedMood);
        this.activePensamientoIndex = Math.floor(Math.random() * filtered.length);
        this.render();
      },
      reactPensamiento(pId, type) {
        if (this.userReacted[pId] === type) return;
        if (!this.reactions[pId]) {
          this.reactions[pId] = { lol: 50, mindblown: 20, facepalm: 10 };
        }
        this.reactions[pId][type] = (this.reactions[pId][type] || 0) + 1;
        this.userReacted[pId] = type;
        try {
          localStorage.setItem('tusdesvarios_humor_reactions', JSON.stringify(this.reactions));
        } catch(e) {}
        this.render();
      },

      render() {
        const container = document.getElementById('machine-content');
        if (!container) return;

        // 1. EXCUSAS
        if (this.activeTab === 'excusas') {
          const excusa = excusasData.catalogo.find(e => e.ambito === this.selectedAmbito && e.gravedad === this.selectedGravedad && e.tono === this.selectedTono) ||
                         excusasData.catalogo.find(e => e.ambito === this.selectedAmbito && e.gravedad === this.selectedGravedad) ||
                         excusasData.catalogo.find(e => e.ambito === this.selectedAmbito) ||
                         excusasData.catalogo[0];

          let h = '<section style="padding:2.25rem 1.75rem; background:var(--bg-surface); border:1px solid rgba(236,72,153,0.35); border-radius:var(--radius-lg); box-shadow:0 12px 35px rgba(0,0,0,0.5), 0 0 30px rgba(236,72,153,0.15);">';
          h += '<div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem; margin-bottom:1.5rem;">';
          h += '<div style="display:flex; align-items:center; gap:0.65rem;"><span style="font-size:2rem;">🎩</span><div><h2 style="font-size:1.35rem; font-weight:800; color:#ffffff; margin:0;">La Máquina de Excusas con Medidor de Verosimilitud</h2><p style="font-size:0.85rem; color:var(--text-muted); margin:0;">Selecciona ámbito, gravedad y tono: la excusa se calcula automáticamente</p></div></div>';
          h += '<button onclick="humorConsole.randomExcusa()" class="btn-secondary" style="font-size:0.82rem;"><span style="color:#ec4899;">🔀</span> <span>Ruleta Aleatoria</span></button></div>';

          h += '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem; margin-bottom:1.5rem;">';
          
          // Ámbitos
          h += '<div><label style="display:block; font-size:0.78rem; font-weight:700; color:var(--text-secondary); text-transform:uppercase; margin-bottom:0.45rem;">1. Ámbito de la Crisis:</label><div style="display:flex; flex-wrap:wrap; gap:0.35rem;">';
          excusasData.ambitos.forEach(a => {
            const isSel = this.selectedAmbito === a.id;
            h += '<button onclick="humorConsole.setAmbito(\\'' + a.id + '\\')" class="cat-filter-btn ' + (isSel ? 'cat-filter-btn-active' : '') + '"><span>' + a.icono + '</span> <span>' + a.nombre + '</span></button>';
          });
          h += '</div></div>';

          // Gravedades
          h += '<div><label style="display:block; font-size:0.78rem; font-weight:700; color:var(--text-secondary); text-transform:uppercase; margin-bottom:0.45rem;">2. Nivel de Gravedad:</label><div style="display:flex; flex-wrap:wrap; gap:0.35rem;">';
          excusasData.gravedades.forEach(g => {
            const isSel = this.selectedGravedad === g.id;
            h += '<button onclick="humorConsole.setGravedad(\\'' + g.id + '\\')" style="font-size:0.8rem; padding:0.35rem 0.65rem; border-radius:var(--radius-full); border:1px solid ' + (isSel ? g.color : 'var(--border-subtle)') + '; background:' + (isSel ? g.color + '25' : 'rgba(255,255,255,0.03)') + '; color:' + (isSel ? '#ffffff' : 'var(--text-muted)') + '; font-weight:' + (isSel ? '700' : '500') + '; cursor:pointer; display:inline-flex; align-items:center; gap:0.35rem;"><span>' + g.icono + '</span> <span>' + g.nombre + '</span></button>';
          });
          h += '</div></div>';

          // Tonos
          h += '<div><label style="display:block; font-size:0.78rem; font-weight:700; color:var(--text-secondary); text-transform:uppercase; margin-bottom:0.45rem;">3. Tono Retórico:</label><div style="display:flex; flex-wrap:wrap; gap:0.35rem;">';
          excusasData.tonos.forEach(t => {
            const isSel = this.selectedTono === t.id;
            h += '<button onclick="humorConsole.setTono(\\'' + t.id + '\\')" style="font-size:0.8rem; padding:0.35rem 0.65rem; border-radius:var(--radius-full); border:1px solid ' + (isSel ? '#f472b6' : 'var(--border-subtle)') + '; background:' + (isSel ? 'rgba(236,72,153,0.2)' : 'rgba(255,255,255,0.03)') + '; color:' + (isSel ? '#f472b6' : 'var(--text-muted)') + '; font-weight:' + (isSel ? '700' : '500') + '; cursor:pointer; display:inline-flex; align-items:center; gap:0.35rem;"><span>' + t.icono + '</span> <span>' + t.nombre + '</span></button>';
          });
          h += '</div></div></div>';

          // Result box
          h += '<div style="padding:1.75rem 1.5rem; background:rgba(11, 15, 25, 0.85); border:1.5px dashed rgba(236, 72, 153, 0.5); border-radius:var(--radius-md); box-shadow:0 8px 30px rgba(0,0,0,0.4);">';
          h += '<div style="margin-bottom:1.25rem; padding-bottom:1rem; border-bottom:1px solid rgba(255,255,255,0.08);">';
          h += '<div style="display:flex; justify-content:space-between; align-items:center; marginBottom:0.4rem;"><span style="font-size:0.8rem; font-weight:700; color:var(--text-secondary);">⚡ Medidor de Credibilidad Estimada:</span><span style="font-size:0.85rem; font-weight:800; color:' + (excusa.credibilidad > 75 ? '#34d399' : excusa.credibilidad > 50 ? '#fbbf24' : '#f87171') + ';">' + excusa.credibilidad + '% ' + (excusa.credibilidad > 75 ? '🟢 Alta' : excusa.credibilidad > 50 ? '🟡 Media' : '🔴 Riesgo') + '</span></div>';
          h += '<div style="width:100%; height:8px; background:rgba(255,255,255,0.08); border-radius:999px; overflow:hidden;"><div style="width:' + excusa.credibilidad + '%; height:100%; background:' + (excusa.credibilidad > 75 ? 'linear-gradient(90deg, #10b981, #34d399)' : excusa.credibilidad > 50 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #ef4444, #f87171)') + '; border-radius:999px;"></div></div></div>';
          
          h += '<div style="font-size:1.1rem; line-height:1.7; color:#f8fafc; font-style:italic; margin-bottom:1.25rem;">&ldquo;' + excusa.texto + '&rdquo;</div>';
          
          h += '<div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.85rem;">';
          h += '<div style="display:inline-flex; align-items:center; gap:0.4rem; font-size:0.82rem; color:#fbbf24; background:rgba(245, 158, 11, 0.12); padding:0.35rem 0.75rem; border-radius:var(--radius-sm);"><span>💡 <strong>Consejo:</strong> ' + excusa.consejo + '</span></div>';
          h += '<button id="btn-copy-excusa" onclick="humorConsole.copyExcusaText(\\'' + excusa.texto.replace(/'/g, "\\\\'") + '\\')" class="btn-primary"><span>📋</span> <span>Copiar Excusa</span></button></div>';
          h += '</div></section>';

          container.innerHTML = h;
        }

        // 2. ORACULO
        else if (this.activeTab === 'oraculo') {
          const dilema = oraculoData.dilemas.find(d => d.id === this.selectedDilemaId) || oraculoData.dilemas[0];

          let h = '<section style="padding:2.25rem 1.75rem; background:var(--bg-surface); border:1px solid rgba(168, 85, 247, 0.35); border-radius:var(--radius-lg); box-shadow:0 12px 35px rgba(0,0,0,0.5), 0 0 30px rgba(168,85,247,0.15);">';
          h += '<div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem; margin-bottom:1.5rem;">';
          h += '<div style="display:flex; align-items:center; gap:0.65rem;"><span style="font-size:2rem;">🔮</span><div><h2 style="font-size:1.35rem; font-weight:800; color:#ffffff; margin:0;">El Oráculo del Desvarío: Decisor Cósmico Inapelable</h2><p style="font-size:0.85rem; color:var(--text-muted); margin:0;">Selecciona tu dilema existencial y recibe la sentencia cósmica inmediata</p></div></div>';
          h += '<button onclick="humorConsole.randomDilema()" class="btn-secondary" style="font-size:0.82rem;"><span style="color:#a855f7;">🔀</span> <span>Dilema Aleatorio</span></button></div>';

          // Categories
          h += '<div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1.25rem;">';
          oraculoData.categoriasDilemas.forEach(c => {
            const isSel = this.selectedCatDilema === c.id;
            h += '<button onclick="humorConsole.setCatDilema(\\'' + c.id + '\\')" class="cat-filter-btn ' + (isSel ? 'cat-filter-btn-active' : '') + '" style="' + (isSel ? 'background:rgba(168, 85, 247, 0.25) !important; border-color:#a855f7 !important; color:#c084fc !important;' : '') + '"><span>' + c.icono + '</span> <span>' + c.nombre + '</span></button>';
          });
          h += '</div>';

          // Dilemmas list
          h += '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:0.65rem; margin-bottom:1.5rem;">';
          oraculoData.dilemas.filter(d => d.categoria === this.selectedCatDilema).forEach(d => {
            const isSel = this.selectedDilemaId === d.id;
            h += '<button onclick="humorConsole.setDilema(\\'' + d.id + '\\')" style="padding:0.75rem 1rem; text-align:left; border-radius:var(--radius-md); background:' + (isSel ? 'rgba(168, 85, 247, 0.18)' : 'rgba(255,255,255,0.03)') + '; border:1px solid ' + (isSel ? '#a855f7' : 'var(--border-subtle)') + '; color:' + (isSel ? '#ffffff' : 'var(--text-secondary)') + '; font-size:0.85rem; font-weight:' + (isSel ? '700' : '500') + '; cursor:pointer;">' + d.pregunta + '</button>';
          });
          h += '</div>';

          // Output
          h += '<div style="padding:2rem 1.75rem; background:rgba(11, 15, 25, 0.9); border:1.5px solid rgba(168, 85, 247, 0.5); border-radius:var(--radius-md); box-shadow:0 10px 35px rgba(0,0,0,0.6); text-align:center;">';
          h += '<div style="font-size:0.75rem; color:#c084fc; text-transform:uppercase; letter-spacing:0.08em; font-weight:800; margin-bottom:0.5rem;">✦ SENTENCIA DEL ORÁCULO ✦</div>';
          h += '<h3 style="font-size:1.5rem; font-weight:900; color:#f8fafc; margin-bottom:0.85rem; text-shadow:0 0 20px rgba(168,85,247,0.5);">&ldquo;' + dilema.veredicto + '&rdquo;</h3>';
          h += '<p style="font-size:1rem; color:#cbd5e1; line-height:1.65; max-width:650px; margin:0 auto 1.25rem;">' + dilema.razon + '</p>';
          h += '<div style="display:inline-flex; align-items:center; gap:0.4rem; font-size:0.8rem; padding:0.3rem 0.75rem; border-radius:var(--radius-full); background:rgba(168,85,247,0.15); border:1px solid rgba(168,85,247,0.3); color:#c084fc;"><span>🎯 Precisión Cósmica:</span> <strong>' + dilema.probabilidadExito + '</strong></div>';
          h += '</div></section>';

          container.innerHTML = h;
        }

        // 3. TRADUCTOR
        else if (this.activeTab === 'traductor') {
          const frase = traductorData.frases.find(f => f.id === this.selectedFraseId) || traductorData.frases[0];

          let h = '<section style="padding:2.25rem 1.75rem; background:var(--bg-surface); border:1px solid rgba(6, 182, 212, 0.35); border-radius:var(--radius-lg); box-shadow:0 12px 35px rgba(0,0,0,0.5), 0 0 30px rgba(6,182,212,0.15);">';
          h += '<div style="display:flex; align-items:center; gap:0.65rem; margin-bottom:1.5rem;"><span style="font-size:2rem;">💼</span><div><h2 style="font-size:1.35rem; font-weight:800; color:#ffffff; margin:0;">El Traductor Sincero a 3 Capas de Postureo</h2><p style="font-size:0.85rem; color:var(--text-muted); margin:0;">Compara al instante lo que piensas, cómo decirlo con educación y cómo postearlo en LinkedIn</p></div></div>';

          // Categories
          h += '<div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1.25rem;">';
          traductorData.categoriasTraductor.forEach(c => {
            const isSel = this.selectedCatTraductor === c.id;
            h += '<button onclick="humorConsole.setCatTraductor(\\'' + c.id + '\\')" class="cat-filter-btn ' + (isSel ? 'cat-filter-btn-active' : '') + '" style="' + (isSel ? 'background:rgba(6, 182, 212, 0.22) !important; border-color:#06b6d4 !important; color:#38bdf8 !important;' : '') + '"><span>' + c.icono + '</span> <span>' + c.nombre + '</span></button>';
          });
          h += '</div>';

          // Phrases list
          h += '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:0.6rem; margin-bottom:1.75rem;">';
          traductorData.frases.filter(f => f.categoria === this.selectedCatTraductor).forEach(f => {
            const isSel = this.selectedFraseId === f.id;
            h += '<button onclick="humorConsole.setFrase(\\'' + f.id + '\\')" style="padding:0.65rem 0.85rem; text-align:left; border-radius:var(--radius-sm); background:' + (isSel ? 'rgba(6, 182, 212, 0.18)' : 'rgba(255,255,255,0.03)') + '; border:1px solid ' + (isSel ? '#06b6d4' : 'var(--border-subtle)') + '; color:' + (isSel ? '#38bdf8' : 'var(--text-secondary)') + '; font-size:0.83rem; cursor:pointer;"><span style="font-weight:600;">&ldquo;' + f.sincero + '&rdquo;</span></button>';
          });
          h += '</div>';

          // 3 layers cards
          h += '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem;">';
          
          // Layer 1
          h += '<div style="padding:1.25rem; background:rgba(239, 68, 68, 0.08); border:1px solid rgba(239, 68, 68, 0.3); border-radius:var(--radius-md); display:flex; flexDirection:column; justify-content:space-between;">';
          h += '<div><div style="font-size:0.72rem; font-weight:800; color:#f87171; text-transform:uppercase; margin-bottom:0.4rem;">🔴 Nivel 1: Lo que piensas de verdad</div><div style="font-size:0.95rem; color:#f8fafc; line-height:1.5; margin-bottom:1rem;">&ldquo;' + frase.sincero + '&rdquo;</div></div>';
          h += '<button id="btn-copy-l1" onclick="humorConsole.copyTraduccionText(\\'' + frase.sincero.replace(/'/g, "\\\\'") + '\\', \\'btn-copy-l1\\')" class="btn-secondary" style="align-self:flex-start; font-size:0.75rem; padding:0.25rem 0.6rem;"><span>📋</span> <span>Copiar</span></button></div>';

          // Layer 2
          h += '<div style="padding:1.25rem; background:rgba(6, 182, 212, 0.08); border:1px solid rgba(6, 182, 212, 0.3); border-radius:var(--radius-md); display:flex; flex-direction:column; justify-content:space-between;">';
          h += '<div><div style="font-size:0.72rem; font-weight:800; color:#38bdf8; text-transform:uppercase; margin-bottom:0.4rem;">🟡 Nivel 2: Para Correo / Slack</div><div style="font-size:0.95rem; color:#f8fafc; line-height:1.5; margin-bottom:1rem;">&ldquo;' + frase.diplomatico + '&rdquo;</div></div>';
          h += '<button id="btn-copy-l2" onclick="humorConsole.copyTraduccionText(\\'' + frase.diplomatico.replace(/'/g, "\\\\'") + '\\', \\'btn-copy-l2\\')" class="btn-secondary" style="align-self:flex-start; font-size:0.75rem; padding:0.25rem 0.6rem; border-color:#06b6d4; color:#38bdf8;"><span>📋</span> <span>Copiar</span></button></div>';

          // Layer 3
          h += '<div style="padding:1.25rem; background:rgba(168, 85, 247, 0.08); border:1px solid rgba(168, 85, 247, 0.35); border-radius:var(--radius-md); display:flex; flex-direction:column; justify-content:space-between;">';
          h += '<div><div style="font-size:0.72rem; font-weight:800; color:#c084fc; text-transform:uppercase; margin-bottom:0.4rem;">🟣 Nivel 3: Modo LinkedIn Guru</div><div style="font-size:0.95rem; color:#f8fafc; line-height:1.5; margin-bottom:1rem;">&ldquo;' + frase.linkedin + '&rdquo;</div></div>';
          h += '<button id="btn-copy-l3" onclick="humorConsole.copyTraduccionText(\\'' + frase.linkedin.replace(/'/g, "\\\\'") + '\\', \\'btn-copy-l3\\')" class="btn-secondary" style="align-self:flex-start; font-size:0.75rem; padding:0.25rem 0.6rem; border-color:#a855f7; color:#c084fc;"><span>📋</span> <span>Copiar</span></button></div>';

          h += '</div></section>';
          container.innerHTML = h;
        }

        // 4. LEYES
        else if (this.activeTab === 'leyes') {
          const ley = leyesData.leyes.find(l => l.escenario === this.selectedEscenario) || leyesData.leyes[0];

          let h = '<section style="padding:2.25rem 1.75rem; background:var(--bg-surface-elevated); border:1px solid rgba(245, 158, 11, 0.35); border-radius:var(--radius-lg); box-shadow:0 12px 35px rgba(0,0,0,0.5), 0 0 30px rgba(245,158,11,0.15);">';
          h += '<div style="display:flex; align-items:center; gap:0.65rem; margin-bottom:1.5rem;"><span style="font-size:2rem;">📜</span><div><h2 style="font-size:1.35rem; font-weight:800; color:#ffffff; margin:0;">Generador de Leyes de Murphy Situacionales</h2><p style="font-size:0.85rem; color:var(--text-muted); margin:0;">Elige tu escenario actual y conoce la catástrofe cósmica inevitable</p></div></div>';

          // Scenarios
          h += '<div style="display:flex; flex-wrap:wrap; gap:0.45rem; margin-bottom:1.75rem;">';
          leyesData.escenarios.forEach(esc => {
            const isSel = this.selectedEscenario === esc.id;
            h += '<button onclick="humorConsole.setEscenario(\\'' + esc.id + '\\')" style="padding:0.45rem 0.85rem; border-radius:var(--radius-full); background:' + (isSel ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255,255,255,0.03)') + '; border:1px solid ' + (isSel ? '#f59e0b' : 'var(--border-subtle)') + '; color:' + (isSel ? '#fbbf24' : 'var(--text-secondary)') + '; font-weight:' + (isSel ? '700' : '500') + '; font-size:0.82rem; cursor:pointer; display:inline-flex; align-items:center; gap:0.35rem;"><span>' + esc.icono + '</span> <span>' + esc.nombre + '</span></button>';
          });
          h += '</div>';

          // Ley Output
          h += '<div style="padding:2rem 1.75rem; background:rgba(11, 15, 25, 0.85); border:1.5px solid rgba(245, 158, 11, 0.45); border-radius:var(--radius-md);">';
          h += '<div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.75rem;"><span style="font-size:0.75rem; font-weight:800; color:#fbbf24; background:rgba(245, 158, 11, 0.18); padding:0.2rem 0.6rem; border-radius:var(--radius-full);">LEY #' + ley.numero + '</span><h3 style="font-size:1.25rem; font-weight:800; color:#f8fafc; margin:0;">' + ley.nombre + '</h3></div>';
          h += '<p style="font-size:1.05rem; color:#cbd5e1; line-height:1.65; margin-bottom:1.25rem;">' + ley.descripcion + '</p>';
          h += '<div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem; padding-top:1rem; border-top:1px solid rgba(255,255,255,0.08);">';
          h += '<div style="font-size:0.82rem; color:#fbbf24;"><strong>💡 Consejo de supervivencia:</strong> ' + ley.consejo + '</div>';
          h += '<div style="font-size:0.78rem; color:#f87171; font-weight:700;">Probabilidad de ocurrencia: ' + ley.probabilidad + '</div>';
          h += '</div></div></section>';

          container.innerHTML = h;
        }

        // 5. PENSAMIENTOS
        else if (this.activeTab === 'pensamientos') {
          const filtered = this.selectedMood === 'todos' ? pildorasData.pensamientos : pildorasData.pensamientos.filter(p => p.mood === this.selectedMood);
          const pensamiento = filtered[this.activePensamientoIndex % filtered.length] || pildorasData.pensamientos[0];
          const reacts = this.reactions[pensamiento.id] || { lol: pensamiento.likes, mindblown: 25, facepalm: 10 };

          let h = '<section style="padding:2.25rem 1.75rem; background:var(--bg-surface); border:1px solid rgba(16, 185, 129, 0.35); border-radius:var(--radius-lg); box-shadow:0 12px 35px rgba(0,0,0,0.5), 0 0 30px rgba(16,185,129,0.15);">';
          h += '<div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem; margin-bottom:1.5rem;">';
          h += '<div style="display:flex; align-items:center; gap:0.65rem;"><span style="font-size:2rem;">🚿</span><div><h2 style="font-size:1.35rem; font-weight:800; color:#ffffff; margin:0;">Pensamientos de Ducha por Estado de Ánimo</h2><p style="font-size:0.85rem; color:var(--text-muted); margin:0;">Filtra por tu estado mental y reacciona con votos en tiempo real</p></div></div>';
          h += '<button onclick="humorConsole.randomPensamiento()" class="btn-secondary" style="font-size:0.82rem;"><span style="color:#10b981;">🔀</span> <span>Pensamiento Aleatorio</span></button></div>';

          // Mood filter
          h += '<div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1.5rem;">';
          pildorasData.moods.forEach(m => {
            const isSel = this.selectedMood === m.id;
            h += '<button onclick="humorConsole.setMood(\\'' + m.id + '\\')" class="cat-filter-btn ' + (isSel ? 'cat-filter-btn-active' : '') + '" style="' + (isSel ? 'background:rgba(16, 185, 129, 0.22) !important; border-color:#10b981 !important; color:#34d399 !important;' : '') + '"><span>' + m.icono + '</span> <span>' + m.nombre + '</span></button>';
          });
          h += '</div>';

          // Thought Card
          h += '<div style="padding:1.75rem 1.5rem; background:rgba(11, 15, 25, 0.85); border:1px solid rgba(16, 185, 129, 0.3); border-radius:var(--radius-md); min-height:180px; display:flex; flex-direction:column; justify-content:space-between;">';
          h += '<div><div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;"><span style="font-size:0.75rem; padding:0.2rem 0.6rem; border-radius:var(--radius-full); background:rgba(16, 185, 129, 0.15); border:1px solid rgba(16, 185, 129, 0.3); color:#34d399; font-weight:700;">' + pensamiento.autor + '</span><span style="font-size:0.8rem; color:var(--text-muted);">' + ((this.activePensamientoIndex % filtered.length) + 1) + ' de ' + filtered.length + '</span></div>';
          h += '<h3 style="font-size:1.25rem; font-weight:800; color:#f8fafc; margin-bottom:0.65rem;">' + pensamiento.titulo + '</h3>';
          h += '<p style="font-size:1.02rem; color:#cbd5e1; line-height:1.65; margin:0;">' + pensamiento.contenido + '</p></div>';

          // Reactions & Next
          h += '<div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.8rem; margin-top:1.5rem; padding-top:1rem; border-top:1px solid rgba(255,255,255,0.08);">';
          h += '<div style="display:flex; gap:0.5rem;">';
          h += '<button onclick="humorConsole.reactPensamiento(\\'' + pensamiento.id + '\\', \\'lol\\')" style="display:inline-flex; align-items:center; gap:0.35rem; padding:0.3rem 0.65rem; border-radius:var(--radius-full); background:' + (this.userReacted[pensamiento.id] === 'lol' ? 'rgba(236,72,153,0.3)' : 'rgba(255,255,255,0.05)') + '; border:1px solid ' + (this.userReacted[pensamiento.id] === 'lol' ? '#ec4899' : 'var(--border-subtle)') + '; color:#f8fafc; font-size:0.82rem; cursor:pointer;"><span>😂</span> <span>' + reacts.lol + '</span></button>';
          h += '<button onclick="humorConsole.reactPensamiento(\\'' + pensamiento.id + '\\', \\'mindblown\\')" style="display:inline-flex; align-items:center; gap:0.35rem; padding:0.3rem 0.65rem; border-radius:var(--radius-full); background:' + (this.userReacted[pensamiento.id] === 'mindblown' ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.05)') + '; border:1px solid ' + (this.userReacted[pensamiento.id] === 'mindblown' ? '#a855f7' : 'var(--border-subtle)') + '; color:#f8fafc; font-size:0.82rem; cursor:pointer;"><span>🤯</span> <span>' + reacts.mindblown + '</span></button>';
          h += '<button onclick="humorConsole.reactPensamiento(\\'' + pensamiento.id + '\\', \\'facepalm\\')" style="display:inline-flex; align-items:center; gap:0.35rem; padding:0.3rem 0.65rem; border-radius:var(--radius-full); background:' + (this.userReacted[pensamiento.id] === 'facepalm' ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.05)') + '; border:1px solid ' + (this.userReacted[pensamiento.id] === 'facepalm' ? '#f59e0b' : 'var(--border-subtle)') + '; color:#f8fafc; font-size:0.82rem; cursor:pointer;"><span>🤦‍♂️</span> <span>' + reacts.facepalm + '</span></button></div>';

          h += '<button onclick="humorConsole.nextPensamiento()" class="btn-primary" style="background:linear-gradient(135deg, #10b981 0%, #059669 100%); box-shadow:0 4px 15px rgba(16, 185, 129, 0.4); font-size:0.85rem; padding:0.45rem 1rem;"><span>Siguiente Pensamiento</span> <span>→</span></button>';
          h += '</div></div></section>';

          container.innerHTML = h;
        }
      }
    };

    document.addEventListener('DOMContentLoaded', () => {
      humorConsole.init();
    });
  </script>
</body>
</html>\`;
}

// Save standalone Humor page
const humorOut = path.join(__dirname, '..', 'desvarios-de-humor.html');
fs.writeFileSync(humorOut, generateHumorHtml(), 'utf8');

console.log('Successfully generated index.html, crea-tu-historia.html, desvarios-mentales.html, desvarios-retro.html, desvarios-de-humor.html, juego-el-ahorcado.html, juego-snake-cyberpunk.html, 8 test HTML files, and 2 story HTML files!');
`;

const finalScript = newTop + baseContent + fullDynamicHumorGenerator;
fs.writeFileSync(filePath, finalScript, 'utf8');
console.log('Updated scripts/build_standalone_pages.js with full dynamic 5-machine interactive console!');
