import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidad y Protección de Datos — Tus Desvaríos',
  description:
    'Información detallada sobre el tratamiento de datos personales en Tus Desvaríos conforme al RGPD (UE 2016/679) y la LOPDGDD (Ley Orgánica 3/2018).',
  alternates: {
    canonical: 'https://tusdesvarios.com/politica-de-privacidad',
  },
};

export default function PoliticaDePrivacidadPage() {
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
            background: 'rgba(168, 85, 247, 0.12)',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            color: '#c084fc',
            fontSize: '0.82rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '1rem',
          }}
        >
          <span>🔒</span> <span>Privacidad y Protección de Datos</span>
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
          Política de Privacidad
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted, #94a3b8)' }}>
          Cumplimiento estricto con el RGPD (UE 2016/679) y la Ley Orgánica 3/2018 (LOPDGDD) • Última actualización: Septiembre de 2026
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
            border: '1px solid #a855f7',
            background: 'rgba(168, 85, 247, 0.18)',
            color: '#c084fc',
            boxShadow: '0 0 16px rgba(168, 85, 247, 0.3)',
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
            border: '1px solid rgba(255, 255, 255, 0.12)',
            background: 'rgba(255, 255, 255, 0.03)',
            color: '#cbd5e1',
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
            <span>🛡️</span> 1. Responsable del Tratamiento de tus Datos
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: '1rem' }}>
            En cumplimiento del Reglamento General de Protección de Datos (RGPD) y de la normativa española de protección de datos, te informamos de que el responsable del tratamiento de los datos que facilites a través de este portal es:
          </p>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderLeft: '3px solid #a855f7',
              borderRadius: '0 8px 8px 0',
              padding: '1.15rem 1.35rem',
              margin: '1.25rem 0',
              color: '#f1f5f9',
              fontSize: '0.92rem',
              lineHeight: 1.6,
            }}
          >
            <p style={{ margin: '0.2rem 0' }}><strong>Identidad del Responsable:</strong> Tus Desvaríos — Pablosky92</p>
            <p style={{ margin: '0.2rem 0' }}><strong>Sitio Web:</strong> <a href="https://tusdesvarios.com" style={{ color: '#c084fc' }}>https://tusdesvarios.com</a></p>
            <p style={{ margin: '0.2rem 0' }}><strong>Correo electrónico para atención de privacidad y ejercicio de derechos:</strong> <a href="mailto:consultasydudasvarias@hotmail.com" style={{ color: '#c084fc' }}>consultasydudasvarias@hotmail.com</a></p>
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
            <span>🧭</span> 2. Principios Aplicados al Tratamiento
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: '0.75rem' }}>En el tratamiento de tus datos personales, aplicamos de forma rigurosa los principios consagrados en el RGPD:</p>
          <ul style={{ color: '#cbd5e1', paddingLeft: '1.5rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.4rem' }}><strong>Principio de licitud, lealtad y transparencia:</strong> Siempre te informamos de forma clara y accesible sobre para qué necesitamos tus datos y solicitamos tu consentimiento previo.</li>
            <li style={{ marginBottom: '0.4rem' }}><strong>Principio de minimización de datos:</strong> Solo solicitamos los datos estrictamente imprescindibles para que disfrutes de las funciones interactivas del sitio.</li>
            <li style={{ marginBottom: '0.4rem' }}><strong>Principio de limitación del plazo de conservación:</strong> Los datos se conservan únicamente durante el tiempo necesario para cumplir los fines para los que fueron recogidos.</li>
            <li style={{ marginBottom: '0.4rem' }}><strong>Principio de integridad y confidencialidad:</strong> Tus datos se tratan garantizando una seguridad adecuada mediante cifrado en tránsito (HTTPS / SSL) y contraseñas fuertemente encriptadas.</li>
          </ul>
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
            <span>📦</span> 3. Qué Datos Recopilamos, Finalidades y Bases Legales
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: '1rem' }}>
            Tus Desvaríos recopila datos exclusivamente en los siguientes supuestos específicos:
          </p>

          <div style={{ overflowX: 'auto', margin: '1.25rem 0', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.06)' }}>
                  <th style={{ padding: '0.75rem 1rem', color: '#f8fafc', fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>Canal o Funcionalidad</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#f8fafc', fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>Datos Recopilados</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#f8fafc', fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>Finalidad del Tratamiento</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#f8fafc', fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>Base Jurídica</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: '#f8fafc' }}><strong>Formulario de Contacto</strong> (Web3Forms)</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Nombre/apodo, correo electrónico y el contenido de tu mensaje.</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Atender tus consultas, sugerencias, peticiones o propuestas de colaboración enviadas al creador.</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Consentimiento expreso del interesado (Art. 6.1.a RGPD).</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: '#f8fafc' }}><strong>Cuenta de Usuario y Foro</strong> (Supabase)</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Email (privado, nunca expuesto públicamente a otros usuarios), contraseña cifrada con hash, nombre de usuario público, avatar, medallas y comentarios del foro.</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Gestión de sesión de usuario, personalización de perfil y participación en la comunidad.</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Ejecución de la relación de servicio solicitada (Art. 6.1.b RGPD).</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: '#f8fafc' }}><strong>Donaciones voluntarias</strong> (PayPal)</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Tus Desvaríos <strong>NO</strong> almacena datos bancarios ni tarjetas. Se gestionan externamente en la pasarela segura de PayPal.</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Permitir el apoyo voluntario al mantenimiento del portal (invitar a un café).</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Ejecución de la transacción voluntaria.</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem 1rem', color: '#f8fafc' }}><strong>Progreso y Récords</strong> (LocalStorage local)</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Decisiones en novelas interactivas, puntuaciones arcade y respuestas de tests.</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Reanudar lecturas o partidas en tu navegador sin perder avances. Almacenado exclusivamente en tu equipo.</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>Interés legítimo y preferencia funcional.</td>
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
            <span>🤝</span> 4. Proveedores y Encargados del Tratamiento
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: '0.75rem' }}>
            Para poder ofrecerte una plataforma rápida, estable y segura, confiamos en proveedores tecnológicos de primer nivel bajo acuerdos de estricta confidencialidad:
          </p>
          <ul style={{ color: '#cbd5e1', paddingLeft: '1.5rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.4rem' }}><strong>Supabase Inc.:</strong> Proveedor de infraestructura para la autenticación de usuarios y la base de datos del foro (cifrado en reposo y en tránsito).</li>
            <li style={{ marginBottom: '0.4rem' }}><strong>Web3Forms:</strong> Servicio de enrutamiento seguro de mensajes de contacto hacia nuestro buzón.</li>
            <li style={{ marginBottom: '0.4rem' }}><strong>PayPal (Europe) S.à r.l. et Cie, S.C.A.:</strong> Entidad de pago regulada en la Unión Europea para donaciones seguras.</li>
            <li style={{ marginBottom: '0.4rem' }}><strong>Vercel Inc. / GitHub Pages:</strong> Plataforma de alojamiento y red de distribución de contenidos (CDN).</li>
          </ul>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            <strong>No comercialización:</strong> Tus Desvaríos <strong>nunca</strong> vende, alquila ni cede tus datos personales a empresas de publicidad, brokers de datos ni a terceras partes.
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
            <span>⏳</span> 5. Plazo de Conservación de tus Datos
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: '0.75rem' }}>Los datos personales facilitados se conservarán durante los siguientes periodos:</p>
          <ul style={{ color: '#cbd5e1', paddingLeft: '1.5rem', lineHeight: 1.7 }}>
            <li style={{ marginBottom: '0.4rem' }}><strong>Consultas de contacto:</strong> Durante el tiempo imprescindible para resolver tu solicitud, más los plazos legales de prescripción.</li>
            <li style={{ marginBottom: '0.4rem' }}><strong>Cuentas de usuario:</strong> Mientras mantengas activa tu cuenta. Si solicitas la baja, tus datos personales serán suprimidos irreversiblemente.</li>
            <li style={{ marginBottom: '0.4rem' }}><strong>Almacenamiento local del navegador:</strong> Hasta que limpies la caché o datos de navegación en tu propio dispositivo.</li>
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
            <span>⚖️</span> 6. Ejercicio de tus Derechos (ARCO-POL)
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: '0.75rem' }}>
            La legislación europea te reconoce un control pleno sobre tus datos. Tienes derecho a ejercitar en cualquier momento:
          </p>
          <ul style={{ color: '#cbd5e1', paddingLeft: '1.5rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.4rem' }}><strong>Derecho de Acceso:</strong> Conocer qué datos personales tratamos sobre ti.</li>
            <li style={{ marginBottom: '0.4rem' }}><strong>Derecho de Rectificación:</strong> Modificar datos inexactos o incompletos.</li>
            <li style={{ marginBottom: '0.4rem' }}><strong>Derecho de Supresión (&quot;Derecho al Olvido&quot;):</strong> Solicitar el borrado íntegro de tus datos.</li>
            <li style={{ marginBottom: '0.4rem' }}><strong>Derecho a la Limitación:</strong> Suspender cautelarmente el tratamiento en los supuestos previstos.</li>
            <li style={{ marginBottom: '0.4rem' }}><strong>Derecho a la Portabilidad:</strong> Recibir tus datos en un formato estructurado y legible.</li>
            <li style={{ marginBottom: '0.4rem' }}><strong>Derecho de Oposición:</strong> Oponerte en cualquier momento al tratamiento de tus datos personales.</li>
          </ul>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderLeft: '3px solid #a855f7',
              borderRadius: '0 8px 8px 0',
              padding: '1.15rem 1.35rem',
              margin: '1.25rem 0',
              color: '#f1f5f9',
              fontSize: '0.92rem',
              lineHeight: 1.6,
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>¿Cómo ejercitar tus derechos?</strong> Envía un correo electrónico a <a href="mailto:consultasydudasvarias@hotmail.com" style={{ color: '#c084fc' }}>consultasydudasvarias@hotmail.com</a> indicando en el asunto &quot;Protección de Datos / Ejercicio de Derechos&quot;, especificando tu petición y tu nombre de usuario para que podamos atenderte con celeridad.
            </p>
          </div>

          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            Asimismo, puedes presentar una reclamación ante la autoridad de control en materia de protección de datos si consideras que tus derechos han sido desatendidos, dirigiéndote a la <strong>Agencia Española de Protección de Datos (AEPD)</strong> en <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" style={{ color: '#c084fc' }}>www.aepd.es</a>.
          </p>
        </section>
      </article>
    </div>
  );
}
