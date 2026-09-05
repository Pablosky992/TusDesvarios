const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, 'build_standalone_pages.js');
let code = fs.readFileSync(scriptPath, 'utf8');

function getHeader(activeKey, extraButtons = '') {
  return `<header class="site-header">
      <div class="site-header-inner">
        <a href="index.html" class="logo-link" title="Ir a la portada de Tus Desvaríos">
          <img src="images/logo-icon.png" alt="Tus Desvaríos Logo" class="logo-image" style="width:36px; height:36px; border-radius:50%; object-fit:cover; border:1.5px solid rgba(255,255,255,0.25); box-shadow:0 0 14px rgba(168,85,247,0.35);">
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

const activeStylesCss = `
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
    }`;

// Find all matches of headers in the file
const headerRegex = /<header class="site-header">[\s\S]*?<\/header>/g;
let matchIndex = 0;

// Configurations for each header in order:
// 0: index.html (portal)
// 1: crea-tu-historia.html (crea + restart/catalog buttons)
// 2: desvarios-mentales.html (mental + tests button)
// 3: individual test HTML (mental)
// 4: story HTML (crea)
// 5: desvarios-retro.html (retro)
// 6: juego-el-ahorcado.html (retro)
// 7: juego-snake-cyberpunk.html (retro)
// 8: desvarios-de-humor.html (humor)

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

code = code.replace(headerRegex, (match) => {
  const current = matchIndex++;
  console.log(`Replacing header #${current}...`);
  if (current === 0) return getHeader('portal');
  if (current === 1) return getHeader('crea', extraButtons1);
  if (current === 2) return getHeader('mental', extraButtons2);
  if (current === 3) return getHeader('mental');
  if (current === 4) return getHeader('crea');
  if (current === 5) return getHeader('retro');
  if (current === 6) return getHeader('retro');
  if (current === 7) return getHeader('retro');
  if (current === 8) return getHeader('humor');
  return match;
});

// Now ensure all style blocks define .active-humor, .active-portal, .active-crea, .active-retro, .active-mental
code = code.replace(/\.active-mental\s*\{[\s\S]*?\}/g, (m) => {
  return `.active-mental {
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
    }`;
});

fs.writeFileSync(scriptPath, code, 'utf8');
console.log('Successfully patched all standalone headers in build_standalone_pages.js!');
