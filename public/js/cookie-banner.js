/**
 * Tus Desvaríos — Cookie Consent Banner (RGPD / LOPDGDD / LSSI-CE)
 * Banner ligero y accesible sin dependencias externas.
 */
(function () {
  function initCookieBanner() {
    // Si ya existe el banner en el DOM, no duplicar
    if (document.getElementById('tusdesvarios-cookie-banner')) return;

    var consent = null;
    try {
      consent = localStorage.getItem('tusdesvarios_cookie_consent');
    } catch (e) {}

    // Si ya consintió y no estamos forzando apertura, salir
    if (consent) return;

    renderBanner();
  }

  function renderBanner() {
    if (document.getElementById('tusdesvarios-cookie-banner')) return;

    var banner = document.createElement('div');
    banner.id = 'tusdesvarios-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Aviso de cookies y privacidad');

    banner.style.position = 'fixed';
    banner.style.bottom = '1rem';
    banner.style.left = '50%';
    banner.style.transform = 'translateX(-50%)';
    banner.style.width = 'calc(100% - 2rem)';
    banner.style.maxWidth = '960px';
    banner.style.zIndex = '99999';
    banner.style.background = 'rgba(15, 20, 32, 0.97)';
    banner.style.backdropFilter = 'blur(16px)';
    banner.style.webkitBackdropFilter = 'blur(16px)';
    banner.style.border = '1px solid rgba(168, 85, 247, 0.35)';
    banner.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(168, 85, 247, 0.2)';
    banner.style.borderRadius = '16px';
    banner.style.padding = '1.25rem 1.5rem';
    banner.style.display = 'flex';
    banner.style.flexDirection = 'row';
    banner.style.alignItems = 'center';
    banner.style.justifyContent = 'space-between';
    banner.style.gap = '1.25rem';
    banner.style.flexWrap = 'wrap';
    banner.style.color = '#f8fafc';
    banner.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

    banner.innerHTML = `
      <div style="flex: 1 1 500px;">
        <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem;">
          <span style="font-size:1.25rem;">🍪</span>
          <span style="font-weight:700; font-size:0.98rem; color:#f8fafc; letter-spacing:0.02em;">Tu privacidad en Tus Desvaríos</span>
        </div>
        <p style="font-size:0.85rem; line-height:1.55; color:#cbd5e1; margin:0;">
          Utilizamos cookies y almacenamiento local estrictamente necesarios para guardar tu progreso en las historias interactivas, registrar tus récords arcade y mantener tu sesión de usuario. No vendemos tus datos a terceros. Puedes aceptar todas o elegir solo las necesarias.
          <a href="politica-de-cookies.html" style="color:#c084fc; text-decoration:underline; font-weight:500; margin-left:0.25rem;">Leer Política de Cookies</a>.
        </p>
      </div>
      <div style="display:flex; align-items:center; gap:0.65rem; flex-wrap:wrap;">
        <button type="button" id="cookie-btn-necessary" style="padding:0.55rem 1.15rem; border-radius:9999px; border:1px solid rgba(255, 255, 255, 0.18); background:rgba(255, 255, 255, 0.06); color:#e2e8f0; font-size:0.84rem; font-weight:600; cursor:pointer; transition:all 0.18s ease; white-space:nowrap;">
          Solo Necesarias
        </button>
        <button type="button" id="cookie-btn-all" style="padding:0.55rem 1.35rem; border-radius:9999px; border:none; background:linear-gradient(135deg, #a855f7 0%, #7c3aed 100%); color:#ffffff; font-size:0.84rem; font-weight:700; cursor:pointer; box-shadow:0 4px 18px rgba(168, 85, 247, 0.45); transition:all 0.18s ease; white-space:nowrap;">
          Aceptar Todas
        </button>
      </div>
    `;

    document.body.appendChild(banner);

    var btnNec = document.getElementById('cookie-btn-necessary');
    var btnAll = document.getElementById('cookie-btn-all');

    if (btnNec) {
      btnNec.onclick = function () {
        setConsent('necessary');
      };
    }
    if (btnAll) {
      btnAll.onclick = function () {
        setConsent('all');
      };
    }
  }

  function setConsent(type) {
    try {
      localStorage.setItem('tusdesvarios_cookie_consent', type);
      localStorage.setItem('tusdesvarios_cookie_consent_date', new Date().toISOString());
    } catch (e) {}

    var banner = document.getElementById('tusdesvarios-cookie-banner');
    if (banner) {
      banner.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      banner.style.opacity = '0';
      banner.style.transform = 'translate(-50%, 15px)';
      setTimeout(function () {
        if (banner.parentNode) banner.parentNode.removeChild(banner);
      }, 260);
    }
  }

  window.openCookieSettings = function () {
    try {
      localStorage.removeItem('tusdesvarios_cookie_consent');
    } catch (e) {}
    renderBanner();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieBanner);
  } else {
    initCookieBanner();
  }
})();
