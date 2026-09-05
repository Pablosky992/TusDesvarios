const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'build_standalone_pages.js');
let content = fs.readFileSync(filePath, 'utf8');

// Function to generate standard nav links for a given active key and optional extra buttons
function getStandardNavHtml(activeKey, extraButtons = '') {
  return `<nav class="header-nav">
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
        </nav>`;
}

// Ensure active styles exist in all style blocks
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

// 1. Index Header
content = content.replace(
  /<header class="site-header">[\s\S]*?<\/header>/,
  `<header class="site-header">
      <div class="site-header-inner">
        <a href="index.html" class="logo-link" title="Ir a la portada de Tus Desvaríos">
          <img src="images/logo-icon.png" alt="Tus Desvaríos Logo" class="logo-image" style="width:36px; height:36px; border-radius:50%; object-fit:cover; border:1.5px solid rgba(255,255,255,0.25); box-shadow:0 0 14px rgba(168,85,247,0.35);">
          <span>Tus Desvaríos</span>
        </a>
        ${getStandardNavHtml('portal')}
      </div>
    </header>`
);

console.log('Updated Index header.');

// Write back and verify
fs.writeFileSync(filePath, content, 'utf8');
