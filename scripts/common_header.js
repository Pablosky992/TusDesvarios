function getHeaderHtml(activeSection = '', options = {}) {
  const extraButtons = typeof options === 'string' ? options : (options && options.extraButtons ? options.extraButtons : '');
  return `
    <header class="site-header">
      <div class="site-header-inner">
        <a href="index.html" class="logo-link" title="Ir a la portada de Tus Desvaríos">
          <img src="images/logo-icon.png" alt="Tus Desvaríos Logo" class="logo-image">
          <div class="logo-text-group">
            <span class="logo-text-top">TUS</span>
            <span class="logo-text-main">DESVARÍOS</span>
          </div>
        </a>
        <nav class="header-nav">
          <a href="crea-tu-historia.html" class="nav-link ${activeSection === 'crea' ? 'active-crea' : ''}" title="Novelas y Ficción Interactiva">
            <span>📖</span>
            <span class="nav-link-text">Crea Historias</span>
          </a>
          <a href="desvarios-literarios.html" class="nav-link ${activeSection === 'literarios' ? 'active-literarios' : ''}" title="Relatos, Cuentos y Ficción Narrativa">
            <span>📜</span>
            <span class="nav-link-text">Relatos</span>
          </a>
          <a href="desvarios-retro.html" class="nav-link ${activeSection === 'retro' ? 'active-retro' : ''}" title="Arcade, Juegos Clásicos y El Ahorcado">
            <span>🕹️</span>
            <span class="nav-link-text">Juegos Retro</span>
          </a>
          <a href="desvarios-mentales.html" class="nav-link ${activeSection === 'mental' ? 'active-mental' : ''}" title="Tests, Enigmas y Retos Psicológicos">
            <span>🧪</span>
            <span class="nav-link-text">Tests Mentales</span>
          </a>
          <a href="desvarios-de-humor.html" class="nav-link ${activeSection === 'humor' ? 'active-humor' : ''}" title="Sátira, Generador de Excusas y Pensamientos de Ducha">
            <span>🎭</span>
            <span class="nav-link-text">Humor & Caos</span>
          </a>
          <a href="desvarios-por-la-red.html" class="nav-link ${activeSection === 'red' ? 'active-red' : ''}" title="Escaparate Web y Bazar de Curiosidades de Amazon">
            <span>🌐</span>
            <span class="nav-link-text">Por la Red</span>
          </a>
          <a href="foro.html" class="nav-link ${activeSection === 'foro' ? 'active-foro' : ''}" title="Comunidad y Foro de Debate">
            <span>💬</span>
            <span class="nav-link-text">Foro</span>
          </a>
          <a href="index.html" class="nav-link ${activeSection === 'portal' ? 'active-portal' : ''}" title="Portada Principal">
            <span>🏛️</span>
            <span class="nav-link-text">Portal</span>
          </a>
          <a href="login.html" class="nav-link nav-link-user ${activeSection === 'usuario' ? 'active-usuario' : ''}" id="header-user-btn" title="Acceso / Mi Perfil">
            <span id="header-user-icon">👤</span>
            <span class="nav-link-text" id="header-user-name">Acceder</span>
          </a>${extraButtons ? '\n          ' + extraButtons : ''}
        </nav>
      </div>
      <script>
        (function(){
          try {
            var raw = localStorage.getItem('desvarios_user_cache');
            if (raw) {
              var u = JSON.parse(raw);
              var btn = document.getElementById('header-user-btn');
              var nameEl = document.getElementById('header-user-name');
              var iconEl = document.getElementById('header-user-icon');
              if (btn && nameEl && u && u.username) {
                btn.href = 'perfil.html';
                btn.title = 'Ficha de ' + u.username;
                btn.classList.add('logged-in');
                nameEl.textContent = '@' + u.username;
                if (iconEl && u.avatar_id) {
                  iconEl.innerHTML = '<img src="images/avatars/' + u.avatar_id + '.svg" alt="' + u.username + '" style="width:18px;height:18px;border-radius:50%;object-fit:cover;vertical-align:middle;display:inline-block;border:1px solid rgba(255,255,255,0.4);">';
                }
              }
            }
          } catch(e){}
        })();
      </script>
    </header>
  `;
}

function getHeaderCss() {
  return `
    .site-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(11, 15, 25, 0.92);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    }

    .site-header-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.65rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.25rem;
    }

    .logo-link {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      text-decoration: none;
      color: #ffffff;
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }

    .logo-link:hover {
      transform: scale(1.02);
    }

    .logo-image {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(255, 255, 255, 0.28);
      box-shadow: 0 0 18px rgba(168, 85, 247, 0.4), 0 0 36px rgba(6, 182, 212, 0.2);
      transition: transform 0.25s ease;
    }

    .logo-link:hover .logo-image {
      transform: scale(1.05);
    }

    .logo-text-group {
      display: flex;
      flex-direction: column;
      line-height: 1.05;
    }

    .logo-text-top {
      font-family: var(--font-display, 'Cinzel', serif);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.26em;
      color: #c4b5fd;
      text-transform: uppercase;
    }

    .logo-text-main {
      font-family: var(--font-display, 'Cinzel', serif);
      font-size: 1.35rem;
      font-weight: 900;
      letter-spacing: 0.05em;
      background: linear-gradient(135deg, #ffffff 30%, #e2e8f0 70%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-transform: uppercase;
      margin-top: 1px;
    }

    .header-nav {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      align-items: center;
      gap: 0.42rem 0.5rem;
      max-width: 680px;
    }

    .nav-link {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.38rem 0.8rem;
      border-radius: 9999px;
      font-size: 0.82rem;
      font-weight: 600;
      color: #cbd5e1;
      text-decoration: none;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      transition: all 0.2s ease;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.25);
      transform: translateY(-1.5px);
    }

    .nav-link.active-crea {
      background: rgba(16, 185, 129, 0.2) !important;
      color: #34d399 !important;
      border-color: rgba(16, 185, 129, 0.5) !important;
      box-shadow: 0 0 14px rgba(16, 185, 129, 0.25) !important;
      font-weight: 700 !important;
    }

    .nav-link.active-literarios {
      background: rgba(245, 158, 11, 0.2) !important;
      color: #fbbf24 !important;
      border-color: rgba(245, 158, 11, 0.5) !important;
      box-shadow: 0 0 14px rgba(245, 158, 11, 0.25) !important;
      font-weight: 700 !important;
    }

    .nav-link.active-retro {
      background: rgba(168, 85, 247, 0.2) !important;
      color: #c084fc !important;
      border-color: rgba(168, 85, 247, 0.5) !important;
      box-shadow: 0 0 14px rgba(168, 85, 247, 0.25) !important;
      font-weight: 700 !important;
    }

    .nav-link.active-mental {
      background: rgba(6, 182, 212, 0.2) !important;
      color: #38bdf8 !important;
      border-color: rgba(6, 182, 212, 0.5) !important;
      box-shadow: 0 0 14px rgba(6, 182, 212, 0.25) !important;
      font-weight: 700 !important;
    }

    .nav-link.active-humor {
      background: rgba(236, 72, 153, 0.2) !important;
      color: #f472b6 !important;
      border-color: rgba(236, 72, 153, 0.5) !important;
      box-shadow: 0 0 14px rgba(236, 72, 153, 0.25) !important;
      font-weight: 700 !important;
    }

    .nav-link.active-red {
      background: rgba(59, 130, 246, 0.2) !important;
      color: #60a5fa !important;
      border-color: rgba(59, 130, 246, 0.5) !important;
      box-shadow: 0 0 14px rgba(59, 130, 246, 0.25) !important;
      font-weight: 700 !important;
    }

    .nav-link.active-portal {
      background: rgba(168, 85, 247, 0.2) !important;
      color: #c084fc !important;
      border-color: rgba(168, 85, 247, 0.5) !important;
      box-shadow: 0 0 14px rgba(168, 85, 247, 0.25) !important;
      font-weight: 700 !important;
    }

    .nav-link.nav-link-user {
      border-color: rgba(168, 85, 247, 0.35);
      background: rgba(168, 85, 247, 0.08);
      color: #e9d5ff;
    }

    .nav-link.nav-link-user:hover {
      background: rgba(168, 85, 247, 0.2);
      border-color: rgba(168, 85, 247, 0.6);
      box-shadow: 0 0 12px rgba(168, 85, 247, 0.3);
      color: #ffffff;
    }

    .nav-link.nav-link-user.logged-in {
      border-color: rgba(56, 189, 248, 0.4);
      background: rgba(56, 189, 248, 0.1);
      color: #bae6fd;
    }

    .nav-link.nav-link-user.logged-in:hover {
      border-color: rgba(56, 189, 248, 0.7);
      box-shadow: 0 0 14px rgba(56, 189, 248, 0.35);
      color: #ffffff;
    }

    .nav-link.active-usuario {
      background: rgba(168, 85, 247, 0.25) !important;
      color: #e9d5ff !important;
      border-color: rgba(168, 85, 247, 0.6) !important;
      box-shadow: 0 0 14px rgba(168, 85, 247, 0.35) !important;
      font-weight: 700 !important;
    }

    .nav-link.active-foro {
      background: rgba(245, 158, 11, 0.2) !important;
      color: #fbbf24 !important;
      border-color: rgba(245, 158, 11, 0.5) !important;
      box-shadow: 0 0 14px rgba(245, 158, 11, 0.25) !important;
      font-weight: 700 !important;
    }

    @media (max-width: 900px) {
      .site-header-inner {
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
      }
      .header-nav {
        justify-content: center;
        max-width: 100%;
      }
    }

    @media (max-width: 480px) {
      .logo-image {
        width: 42px;
        height: 42px;
      }
      .logo-text-top {
        font-size: 0.72rem;
      }
      .logo-text-main {
        font-size: 1.15rem;
      }
      .nav-link {
        padding: 0.32rem 0.65rem;
        font-size: 0.78rem;
      }
    }
  `;
}

module.exports = { getHeaderHtml, getHeaderCss };
