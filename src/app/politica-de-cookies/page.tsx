import { Metadata } from 'next';
import Link from 'next/link';
import CookieSettingsButton from '@/components/CookieSettingsButton';

export const metadata: Metadata = {
  title: 'Política de Cookies — Tus Desvaríos',
  description:
    'Información completa sobre el uso de cookies y tecnologías de almacenamiento local en Tus Desvaríos conforme a la directiva ePrivacy y las directrices de la AEPD.',
  alternates: {
    canonical: 'https://tusdesvarios.com/politica-de-cookies',
  },
};

export default function PoliticaDeCookiesPage() {
  return (
    <div style={{ maxWidth: '920px', margin: '2.5rem auto 4rem', padding: '0 1.25rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.95rem',
            borderRadius: '9999px',
            background: 'rgba(236, 72, 153, 0.12)',
            border: '1px solid rgba(236, 72, 153, 0.35)',
            color: '#f472b6',
            fontSize: '0.82rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '1rem',
          }}
        >
          <span>🍪</span> <span>Transparencia y Privacidad</span>
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display, 'Cinzel', serif)",
            fontSize: '2.4rem',
            fontWeight: 900,
            color: '#ffffff',
            marginBottom: '0.75rem',
            lineHeight: 1.2,
          }}
        >
          Política de Cookies
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted, #94a3b8)' }}>
          Uso de cookies y tecnologías de almacenamiento local en Tus Desvaríos • Última actualización: Septiembre de 2026
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <Link
          href="/aviso-legal"
          style={{
            padding: '0.55rem 1.15rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            background: 'rgba(255, 255, 255, 0.03)',
            color: '#cbd5e1',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 600,
          }}
        >
          Aviso Legal
        </Link>
        <Link
          href="/politica-de-privacidad"
          style={{
            padding: '0.55rem 1.15rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            background: 'rgba(255, 255, 255, 0.03)',
            color: '#cbd5e1',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 600,
          }}
        >
          Política de Privacidad
        </Link>
        <Link
          href="/politica-de-cookies"
          style={{
            padding: '0.55rem 1.15rem',
            borderRadius: '8px',
            border: '1px solid #ec4899',
            background: 'rgba(236, 72, 153, 0.18)',
            color: '#f472b6',
            boxShadow: '0 0 16px rgba(236, 72, 153, 0.3)',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 600,
          }}
        >
          Política de Cookies
        </Link>
      </div>

      <article
        style={{
          background: 'rgba(18, 24, 38, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.55)',
        }}
      >
        <section style={{ marginBottom: '2.5rem' }}>
          <h2
            style={{
              fontFamily: "var(--font-display, 'Cinzel', serif)",
              fontSize: '1.35rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '0.5rem',
            }}
          >
            <span>🍪</span> 1. ¿Qué son las Cookies y el Almacenamiento Local?
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: '1rem' }}>
            Una <strong>cookie</strong> es un pequeño fichero de texto que se descarga y almacena en tu ordenador, smartphone o tableta al acceder a determinadas páginas web. Permite a un sitio web recordar información sobre tu visita, como tu sesión iniciada o tus preferencias.
          </p>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            Junto a las cookies tradicionales, la tecnología moderna de los navegadores web incluye el <strong>Almacenamiento Local (LocalStorage)</strong> y el <strong>Almacenamiento de Sesión (SessionStorage)</strong>. Estas herramientas almacenan información exclusivamente en la memoria interna de tu propio navegador web, sin enviarla automáticamente en cada petición de red a servidores externos, ofreciendo una experiencia mucho más rápida, fluida y privada.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2
            style={{
              fontFamily: "var(--font-display, 'Cinzel', serif)",
              fontSize: '1.35rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '0.5rem',
            }}
          >
            <span>🔍</span> 2. Qué Cookies y Almacenamiento Utilizamos en Tus Desvaríos
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: '1rem' }}>
            En <strong>Tus Desvaríos</strong> priorizamos una navegación limpia, sin intrusiones y con respeto absoluto a tu privacidad. A continuación te detallamos todas las tecnologías de almacenamiento que utiliza el portal:
          </p>

          <div style={{ overflowX: 'auto', margin: '1.25rem 0', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.06)' }}>
                  <th style={{ padding: '0.75rem 1rem', color: '#f8fafc', fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>Elemento / Clave</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#f8fafc', fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>Tipo y Origen</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#f8fafc', fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>Finalidad Específica</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#f8fafc', fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: '#f8fafc' }}><strong>sb-*-auth-token</strong></td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Cookie técnica / Supabase</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Mantener la sesión de usuario activa para navegar por el foro y tu perfil sin necesidad de identificarte en cada clic.</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Sesión / Persistente</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: '#f8fafc' }}><strong>desvarios_user_cache</strong></td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>LocalStorage (Local)</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Guarda tu apodo y avatar en tu propio navegador para que la cabecera cargue de inmediato tu ficha sin latencia de red.</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Persistente</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: '#f8fafc' }}><strong>tusdesvarios_cookie_consent</strong></td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>LocalStorage (Local)</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Registra tu preferencia sobre el banner de cookies para no volver a mostrarte la ventana una vez hayas decidido.</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>1 año</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: '#f8fafc' }}><strong>historia_*_progress</strong></td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>LocalStorage (Local)</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Almacena el capítulo y las decisiones tomadas en novelas interactivas para reanudar la lectura donde la dejaste.</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Persistente</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: '#f8fafc' }}><strong>arcade_records_*</strong></td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>LocalStorage (Local)</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Guarda tus mejores marcas y récords en juegos clásicos como Ahorcado, Buscaminas, Invasores o Snake Cyberpunk.</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Persistente</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem 1rem', color: '#f8fafc' }}><strong>Cookies de terceros</strong></td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>PayPal / Amazon</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Únicamente se activan si interactúas voluntariamente con la pasarela de donaciones de PayPal o al pulsar sobre recomendaciones del programa de afiliados de Amazon en <em>Por la Red</em>.</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Según terceros</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2
            style={{
              fontFamily: "var(--font-display, 'Cinzel', serif)",
              fontSize: '1.35rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '0.5rem',
            }}
          >
            <span>⚙️</span> 3. Panel de Configuración de tu Consentimiento
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: '1rem' }}>
            De acuerdo con las directrices de la Agencia Española de Protección de Datos (AEPD), puedes cambiar de opinión o reconfigurar tus preferencias de cookies en cualquier instante pulsando el siguiente botón:
          </p>
          <div style={{ textAlign: 'center', padding: '1.25rem 0' }}>
            <CookieSettingsButton />
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted, #94a3b8)', textAlign: 'center' }}>
            Al pulsar, se volverá a desplegar el banner inferior permitiéndote seleccionar entre <em>Aceptar Todas</em> o <em>Solo Necesarias</em>.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2
            style={{
              fontFamily: "var(--font-display, 'Cinzel', serif)",
              fontSize: '1.35rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '0.5rem',
            }}
          >
            <span>🌐</span> 4. Cómo Configurar o Eliminar las Cookies en tu Navegador
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: '1rem' }}>
            Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones de tu navegador de internet. Ten en cuenta que si deshabilitas todas las cookies y el almacenamiento local, es posible que no puedas guardar tu progreso en las historias ni mantener la sesión iniciada en tu perfil.
          </p>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: '0.75rem' }}>A continuación te facilitamos los enlaces a las guías oficiales de los principales navegadores:</p>
          <ul style={{ color: '#cbd5e1', paddingLeft: '1.5rem', lineHeight: 1.7 }}>
            <li style={{ marginBottom: '0.4rem' }}><a href="https://support.google.com/chrome/answer/95647?hl=es" target="_blank" rel="noopener noreferrer" style={{ color: '#c084fc' }}>Configuración de cookies en Google Chrome</a></li>
            <li style={{ marginBottom: '0.4rem' }}><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" style={{ color: '#c084fc' }}>Configuración de cookies en Mozilla Firefox</a></li>
            <li style={{ marginBottom: '0.4rem' }}><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" style={{ color: '#c084fc' }}>Configuración de cookies en Apple Safari</a></li>
            <li style={{ marginBottom: '0.4rem' }}><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" style={{ color: '#c084fc' }}>Configuración de cookies en Microsoft Edge</a></li>
          </ul>
        </section>

        <section>
          <h2
            style={{
              fontFamily: "var(--font-display, 'Cinzel', serif)",
              fontSize: '1.35rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '0.5rem',
            }}
          >
            <span>📬</span> 5. Dudas y Preguntas sobre la Política de Cookies
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            Si tienes cualquier duda sobre cómo utilizamos las cookies o sobre el tratamiento de tus datos, puedes ponerte en contacto con nosotros escribiéndonos a <a href="mailto:consultasydudasvarias@hotmail.com" style={{ color: '#c084fc' }}>consultasydudasvarias@hotmail.com</a>.
          </p>
        </section>
      </article>
    </div>
  );
}
