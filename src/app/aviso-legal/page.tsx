import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Aviso Legal y Términos de Uso — Tus Desvaríos',
  description:
    'Aviso Legal y Condiciones Generales de Uso de Tus Desvaríos conforme a la Ley 34/2002 de Servicios de la Sociedad de la Información (LSSI-CE).',
  alternates: {
    canonical: 'https://tusdesvarios.com/aviso-legal',
  },
};

export default function AvisoLegalPage() {
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
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            color: '#fbbf24',
            fontSize: '0.82rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '1rem',
          }}
        >
          <span>⚖️</span> <span>Marco Normativo LSSI-CE</span>
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
          Aviso Legal y Términos de Uso
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted, #94a3b8)' }}>
          Condiciones de acceso, propiedad intelectual y responsabilidades de navegación en Tus Desvaríos • Última actualización: Septiembre de 2026
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <Link
          href="/aviso-legal"
          style={{
            padding: '0.55rem 1.15rem',
            borderRadius: '8px',
            border: '1px solid #fbbf24',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#fbbf24',
            boxShadow: '0 0 16px rgba(245, 158, 11, 0.25)',
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
            <span>📋</span> 1. Datos Identificativos del Responsable
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: '1rem' }}>
            En cumplimiento del artículo 10 de la <strong>Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE)</strong>, se facilitan a continuación los datos informativos del titular del presente sitio web:
          </p>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderLeft: '3px solid #fbbf24',
              borderRadius: '0 8px 8px 0',
              padding: '1.15rem 1.35rem',
              margin: '1.25rem 0',
              color: '#f1f5f9',
              fontSize: '0.92rem',
              lineHeight: 1.6,
            }}
          >
            <p style={{ margin: '0.2rem 0' }}><strong>Denominación del proyecto:</strong> Tus Desvaríos</p>
            <p style={{ margin: '0.2rem 0' }}><strong>Titular / Responsable:</strong> Tus Desvaríos — Pablosky92</p>
            <p style={{ margin: '0.2rem 0' }}><strong>Sitio web oficial:</strong> <a href="https://tusdesvarios.com" style={{ color: '#c084fc' }}>https://tusdesvarios.com</a></p>
            <p style={{ margin: '0.2rem 0' }}><strong>Correo electrónico de contacto y consultas:</strong> <a href="mailto:consultasydudasvarias@hotmail.com" style={{ color: '#c084fc' }}>consultasydudasvarias@hotmail.com</a></p>
            <p style={{ margin: '0.2rem 0' }}><strong>Actividad del portal:</strong> Difusión de relatos literarios, ficción interactiva, minijuegos arcade retro, generadores humorísticos y comunidad de debate cultural y de ocio.</p>
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
            <span>🌐</span> 2. Objeto y Condiciones Generales de Uso
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: '1rem' }}>
            El presente Aviso Legal regula el acceso, la navegación y el uso del sitio web <strong>TusDesvarios.com</strong>. La condición de <strong>Usuario</strong> se adquiere por la mera navegación o utilización de cualquiera de los contenidos o servicios ofrecidos en la plataforma, lo que implica la aceptación plena, expresa y sin reservas de todas las disposiciones incluidas en este documento.
          </p>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: '1rem' }}>
            El acceso a los relatos, juegos y herramientas del portal tiene carácter libre y gratuito. Ciertas funciones complementarias (como publicar mensajes en el Foro de la Comunidad o acumular medallas de logros) requieren la creación voluntaria de una cuenta de usuario, sujeta a las condiciones descritas en este aviso y en la <Link href="/politica-de-privacidad" style={{ color: '#c084fc' }}>Política de Privacidad</Link>.
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
            <span>🛡️</span> 3. Obligaciones y Conducta Responsable del Usuario
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: '0.75rem' }}>El Usuario se compromete expresamente a hacer un uso adecuado, lícito y de buena fe de los contenidos y servicios de Tus Desvaríos, y en particular a:</p>
          <ul style={{ color: '#cbd5e1', paddingLeft: '1.5rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.4rem' }}>No emplear los servicios o foros para incurrir en actividades ilícitas, ilegales o contrarias al orden público.</li>
            <li style={{ marginBottom: '0.4rem' }}>No difundir contenidos, comentarios o propaganda de carácter racista, xenófobo, denigratorio, de apología del terrorismo o que atenten contra los derechos humanos o la dignidad de las personas.</li>
            <li style={{ marginBottom: '0.4rem' }}>No introducir ni difundir en la red virus informáticos, troyanos, scripts maliciosos o cualquier otro sistema lógico o físico capaz de provocar daños en los sistemas del portal o de terceras personas.</li>
            <li style={{ marginBottom: '0.4rem' }}>Custodiar diligentemente las credenciales de acceso a su cuenta personal, siendo responsable de las actividades que se realicen bajo su nombre de usuario.</li>
            <li style={{ marginBottom: '0.4rem' }}>Respetar las normas de convivencia y respeto mutuo en los hilos del Foro de la Comunidad.</li>
          </ul>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            Tus Desvaríos se reserva el derecho de moderar, editar o retirar cualquier comentario o aportación que vulnere el respeto a la dignidad de la persona o que no resulte adecuado para el propósito del portal.
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
            <span>📜</span> 4. Propiedad Intelectual e Industrial
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: '1rem' }}>
            Todos los elementos que forman parte de Tus Desvaríos —incluyendo a título enunciativo pero no limitativo: los textos originales de los relatos de ficción, guiones de historias interactivas, preguntas de tests mentales, lógica de los generadores de humor, diseño gráfico, código fuente, logotipos, combinaciones de colores y estructura de navegación— son titularidad exclusiva de <strong>Tus Desvaríos — Pablosky92</strong> o de terceros que han autorizado legítimamente su inclusión, estando protegidos por la legislación española e internacional sobre Propiedad Intelectual e Industrial.
          </p>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: '1rem' }}>
            Queda expresamente prohibida la reproducción, distribución, comunicación pública, transformación o explotación con fines comerciales de la totalidad o parte de los contenidos de este portal, en cualquier soporte y por cualquier medio técnico, sin la previa autorización expresa y por escrito del titular.
          </p>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            Se autoriza la visualización, impresión y descarga parcial de contenidos exclusivamente para el <strong>uso personal, privado y no lucrativo</strong> del Usuario, siempre que se cite la procedencia y se mantengan intactos los avisos de autoría y copyright.
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
            <span>⚠️</span> 5. Exclusión de Garantías y Limitación de Responsabilidad
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: '0.75rem' }}>
            Tus Desvaríos adopta medidas técnicas razonables para garantizar la disponibilidad y seguridad del portal. No obstante, no se responsabiliza de los daños o perjuicios que pudieran derivarse de:
          </p>
          <ul style={{ color: '#cbd5e1', paddingLeft: '1.5rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.4rem' }}>Interrupciones temporales, caídas del servidor o fallos de conexión ajenos a nuestro control técnico.</li>
            <li style={{ marginBottom: '0.4rem' }}>La presencia de software malicioso introducido por terceros mediante ataques informáticos imprevisibles.</li>
            <li style={{ marginBottom: '0.4rem' }}>El uso indebido, fraudulento o ilícito que los usuarios pudieran hacer de las herramientas interactivas o de las opiniones vertidas libremente en el foro.</li>
          </ul>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            <strong>Enlaces hacia terceros y programas de afiliación:</strong> El portal puede incluir enlaces a páginas web gestionadas por terceros (como pasarelas de pago de PayPal o enlaces de compra en Amazon a través del programa de afiliados en la sección &quot;Por la Red&quot;). Tus Desvaríos no ejerce control alguno sobre dichos sitios externos ni asume responsabilidad alguna por sus contenidos, políticas de privacidad o condiciones de contratación.
          </p>
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
            <span>⚖️</span> 6. Modificaciones, Legislación y Jurisdicción
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: '1rem' }}>
            Tus Desvaríos se reserva el derecho de efectuar sin previo aviso las modificaciones que considere oportunas en el portal, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios prestados como la forma en que estos aparezcan presentados o localizados.
          </p>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            La relación entre el titular del sitio web y el Usuario se regirá por la normativa española vigente. Para la resolución de cualquier controversia judicial o discrepancia relacionada con el uso de este portal, ambas partes se someten a los juzgados y tribunales competentes conforme a la legislación aplicable en materia de consumidores y usuarios.
          </p>
        </section>
      </article>
    </div>
  );
}
