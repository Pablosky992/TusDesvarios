const fs = require('fs');
const path = require('path');

const standardCss = `
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
`;

function getHeaderHtml(activeKey, extraButtons = '') {
  return `<header class="site-header">
      <div class="site-header-inner">
        <a href="index.html" class="logo-link" title="Ir a la portada de Tus Desvaríos">
          <img src="images/logo-icon.png" alt="Tus Desvaríos Logo" class="logo-image">
          <span>Tus Desvaríos</span>
        </a>
        <nav class="header-nav">
          <a href="crea-tu-historia.html" class="nav-link ${activeKey === 'crea' ? 'active-crea' : ''}" title="Novelas y Ficción Interactiva">
            <span>📖</span>
            <span class="nav-link-text">Crea tus Desvaríos</span>
          </a>
          <a href="desvarios-retro.html" class="nav-link ${activeKey === 'retro' ? 'active-retro' : ''}" title="Arcade, Juegos Clásicos y El Ahorcado">
            <span>🕹️</span>
            <span class="nav-link-text">Desvaríos Retro</span>
          </a>
          <a href="desvarios-mentales.html" class="nav-link ${activeKey === 'mental' ? 'active-mental' : ''}" title="Tests, Enigmas y Retos Psicológicos">
            <span>🧪</span>
            <span class="nav-link-text">Desvaríos Mentales</span>
          </a>
          <a href="desvarios-de-humor.html" class="nav-link ${activeKey === 'humor' ? 'active-humor' : ''}" title="Sátira, Generador de Excusas y Pensamientos de Ducha">
            <span>🎭</span>
            <span class="nav-link-text">Desvaríos de Humor</span>
          </a>
          <a href="index.html" class="nav-link ${activeKey === 'portal' ? 'active-portal' : ''}" title="Portada Principal">
            <span>🏛️</span>
            <span class="nav-link-text">Portal</span>
          </a>${extraButtons ? '\n          ' + extraButtons : ''}
        </nav>
      </div>
    </header>`;
}

// 1. Process build_standalone_pages.js
const scriptPath = path.join(__dirname, 'build_standalone_pages.js');
let code = fs.readFileSync(scriptPath, 'utf8');

// Replace all .site-header { ... } blocks up to .main-content or next section
// Let's replace any instance of .site-header { ... .active-humor { ... } }
code = code.replace(/\.site-header\s*\{[\s\S]*?\.active-humor\s*\{[\s\S]*?\}\s*\}/g, standardCss.trim());
code = code.replace(/\.site-header\s*\{[\s\S]*?\.active-portal\s*\{[\s\S]*?\}\s*\}/g, standardCss.trim());

// Also replace any lingering .site-header-inner { max-width: ... }
code = code.replace(/\.site-header-inner\s*\{[^}]*\}/g, `
    .site-header-inner {
      max-width: 1280px;
      width: 100%;
      margin: 0 auto;
      padding: 0.85rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }`);

// Replace all headers with exact matched configurations
const extraButtons1 = `<button id="header-restart-btn" class="btn-secondary" style="display: none;" onclick="app.restartStory()">
            <span>↺</span>
            <span>Reiniciar</span>
          </button>
          <button id="header-catalog-btn" class="btn-secondary" style="display: none;" onclick="app.showCatalog()">
            <span>📚</span>
            <span>Aventuras</span>
          </button>`;

const extraButtons2 = `<button id="header-tests-btn" class="btn-secondary" style="display: none;" onclick="mentalApp.showCatalog()">
            <span>🧪</span>
            <span>Todos los Tests</span>
          </button>`;

let headerIdx = 0;
code = code.replace(/<header class="site-header">[\s\S]*?<\/header>/g, (m) => {
  const cur = headerIdx++;
  if (cur === 0) return getHeaderHtml('portal');
  if (cur === 1) return getHeaderHtml('crea', extraButtons1);
  if (cur === 2) return getHeaderHtml('mental', extraButtons2);
  if (cur === 3) return getHeaderHtml('mental');
  if (cur === 4) return getHeaderHtml('crea');
  if (cur === 5) return getHeaderHtml('retro');
  if (cur === 6) return getHeaderHtml('retro');
  if (cur === 7) return getHeaderHtml('retro');
  if (cur === 8) return getHeaderHtml('humor');
  return m;
});

fs.writeFileSync(scriptPath, code, 'utf8');
console.log('Successfully updated build_standalone_pages.js with unified CSS and HTML headers!');

// 2. Process build_robust_humor.js
const humorScriptPath = path.join(__dirname, 'build_robust_humor.js');
if (fs.existsSync(humorScriptPath)) {
  let humorCode = fs.readFileSync(humorScriptPath, 'utf8');
  humorCode = humorCode.replace(/\.site-header\s*\{[\s\S]*?\.active-humor\s*\{[\s\S]*?\}\s*\}/g, standardCss.trim());
  humorCode = humorCode.replace(/<header class="site-header">[\s\S]*?<\/header>/g, getHeaderHtml('humor'));
  fs.writeFileSync(humorScriptPath, humorCode, 'utf8');
  console.log('Successfully updated build_robust_humor.js with unified CSS and HTML header!');
}
