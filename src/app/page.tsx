import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, ScrollText, Gamepad2, FlaskConical, Smile, Globe, MessagesSquare, ArrowRight, Sparkles } from 'lucide-react';
import { ContactButton, ContactLink, ContactModal } from '@/components/ContactModal';

export const metadata = {
  title: 'Tus Desvaríos — Historias, Juegos, Tests, Relatos y Curiosidades',
  description: 'Un rincón donde perder el tiempo con estilo: ficción interactiva, relatos, minijuegos, tests, memes y curiosidades.',
};

const categories = [
  {
    id: 'crea-tu-historia',
    href: '/crea-tu-historia',
    icon: BookOpen,
    image: '/images/categories/crea-tus-desvarios.jpg',
    label: 'Crea tus Desvaríos',
    description:
      'Novelas interactivas ramificadas donde cada decisión forja tu destino. Vive misterios góticos, conspiraciones y desafíos con múltiples finales.',
    tag: '🟢 Disponible',
    tagClass: 'cat-pill-live',
    accent: '#10b981',
    accentGlow: 'rgba(16, 185, 129, 0.22)',
    border: 'rgba(16, 185, 129, 0.4)',
    iconBg: 'rgba(16, 185, 129, 0.12)',
    iconBorder: 'rgba(16, 185, 129, 0.35)',
    active: true,
  },
  {
    id: 'relatos',
    href: '/desvarios-literarios',
    icon: ScrollText,
    image: '/images/categories/desvarios-literarios.jpg',
    label: 'Desvaríos Literarios',
    description:
      'Historias cortas y cuentos de autor: terror psicológico, distopías espaciales, fantasía oscura y microrrelatos con lector inmersivo.',
    tag: '🟢 Disponible',
    tagClass: 'cat-pill-live',
    accent: '#f59e0b',
    accentGlow: 'rgba(245, 158, 11, 0.25)',
    border: 'rgba(245, 158, 11, 0.45)',
    iconBg: 'rgba(245, 158, 11, 0.14)',
    iconBorder: 'rgba(245, 158, 11, 0.38)',
    active: true,
  },
  {
    id: 'juegos',
    href: '/desvarios-retro',
    icon: Gamepad2,
    image: '/images/categories/desvarios-retro.jpg',
    label: 'Desvaríos Retro',
    description:
      'El juego del ahorcado, rompecabezas de lógica, minijuegos arcade y puzles retro para jugar directo en el navegador.',
    tag: '🟢 Disponible',
    tagClass: 'cat-pill-live',
    accent: '#8b5cf6',
    accentGlow: 'rgba(139, 92, 246, 0.25)',
    border: 'rgba(139, 92, 246, 0.45)',
    iconBg: 'rgba(139, 92, 246, 0.14)',
    iconBorder: 'rgba(139, 92, 246, 0.38)',
    active: true,
  },
  {
    id: 'tests',
    href: '/desvarios-mentales',
    icon: FlaskConical,
    image: '/images/categories/desvarios-mentales.jpg',
    label: 'Desvaríos Mentales',
    description:
      'Tests de personalidad oscura, el termómetro de tu nivel de cordura y acertijos de lógica pura con pistas y soluciones explicadas.',
    tag: '🟢 Disponible',
    tagClass: 'cat-pill-live',
    accent: '#06b6d4',
    accentGlow: 'rgba(6, 182, 212, 0.25)',
    border: 'rgba(6, 182, 212, 0.45)',
    iconBg: 'rgba(6, 182, 212, 0.14)',
    iconBorder: 'rgba(6, 182, 212, 0.38)',
    active: true,
  },
  {
    id: 'humor',
    href: '/desvarios-de-humor',
    icon: Smile,
    image: '/images/categories/desvarios-humor.jpg',
    label: 'Desvaríos de Humor',
    description:
      'El generador de excusas infalible, traductor corporativo, pensamientos de ducha virales y las leyes del caos cotidiano.',
    tag: '🟢 Disponible',
    tagClass: 'cat-pill-live',
    accent: '#ec4899',
    accentGlow: 'rgba(236, 72, 153, 0.25)',
    border: 'rgba(236, 72, 153, 0.45)',
    iconBg: 'rgba(236, 72, 153, 0.14)',
    iconBorder: 'rgba(236, 72, 153, 0.38)',
    active: true,
  },
  {
    id: 'enlaces',
    href: '/desvarios-por-la-red',
    icon: Globe,
    image: '/images/categories/desvarios-red.jpg',
    label: 'Desvaríos por la Red',
    description:
      'Escaparate de webs y proyectos recomendados de la comunidad, espacio para publicar tu propio sitio y bazar con los gadgets más insólitos de Amazon.',
    tag: '🟢 Disponible',
    tagClass: 'cat-pill-live',
    accent: '#3b82f6',
    accentGlow: 'rgba(59, 130, 246, 0.25)',
    border: 'rgba(59, 130, 246, 0.45)',
    iconBg: 'rgba(59, 130, 246, 0.14)',
    iconBorder: 'rgba(59, 130, 246, 0.38)',
    active: true,
  },
  {
    id: 'foro',
    href: '/foro.html',
    icon: MessagesSquare,
    image: '/images/categories/foro-comunidad.jpg',
    label: 'Foro de la Comunidad',
    description:
      'El punto de encuentro de los desvariados: comparte teorías sobre los relatos, presume de récords arcade, resuelve enigmas y charla en la cafetería.',
    tag: '🟢 Disponible',
    tagClass: 'cat-pill-live',
    accent: '#a855f7',
    accentGlow: 'rgba(168, 85, 247, 0.25)',
    border: 'rgba(168, 85, 247, 0.45)',
    iconBg: 'rgba(168, 85, 247, 0.14)',
    iconBorder: 'rgba(168, 85, 247, 0.38)',
    active: true,
  },
];

export default function PortalPage() {
  return (
    <div className="portal-container">
      {/* Hero Section */}
      <section className="portal-hero">
        <div className="portal-emblem-container">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>Tu Rincón Digital de Ocio y Ficción</span>
          </div>

          <div className="portal-emblem-glow-wrap">
            <div className="portal-emblem-aura" />
            <img
              src="/images/logo.jpg"
              alt="Tus Desvaríos — Explora, Imagina, Descubre"
              className="portal-emblem-img"
            />
          </div>

          <h1 className="portal-title integrated-title">
            Historias, Juegos, Tests y <span className="portal-title-gradient">Otros Desvaríos</span>
          </h1>
        </div>

        <p className="portal-description">
          Un espacio libre de ruido para desconectar, jugar a clásicos, sumergirte en relatos donde tú forjas el destino, poner a prueba tu mente y reírte con curiosidades.
        </p>
      </section>

      {/* 6 Pillar Categories Grid */}
      <section id="secciones">
        <div className="section-intro-wrap">
          <h2 className="section-title-main">¿Qué te apetece hoy?</h2>
          <p className="section-desc-main">Explora los diferentes mundos de Tus Desvaríos</p>
        </div>

        <div className="portal-grid-6">
          {categories.map((c) => {
            const Icon = c.icon;
            const cardContent = (
              <article
                className={`cat-card ${c.active ? 'cat-card-active' : 'cat-card-disabled'}`}
                style={{
                  '--card-accent': c.accent,
                  '--card-glow': c.accentGlow,
                  '--card-border': c.border,
                  '--icon-bg': c.iconBg,
                  '--icon-border': c.iconBorder,
                } as React.CSSProperties}
              >
                <div className="cat-card-glow-circle" />

                {/* Category Thumbnail Image Header */}
                <div className="cat-card-thumb-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image}
                    alt={c.label}
                    className="cat-card-thumb"
                    loading="lazy"
                  />
                  <div className="cat-card-thumb-overlay" />
                  <div className="cat-card-header-badge">
                    <div className="cat-card-icon-box" style={{ color: c.accent }}>
                      <Icon size={24} />
                    </div>
                    <span className={`cat-pill ${c.tagClass}`}>{c.tag}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="cat-card-body">
                  <h3 className="cat-card-title">{c.label}</h3>
                  <p className="cat-card-desc">{c.description}</p>
                  {c.active && (
                    <div className="cat-card-cta">
                      <span>Elegir aventura</span>
                      <ArrowRight size={16} />
                    </div>
                  )}
                </div>
              </article>
            );

            return c.active ? (
              <Link key={c.id} href={c.href} style={{ display: 'block', textDecoration: 'none' }}>
                {cardContent}
              </Link>
            ) : (
              <div key={c.id}>{cardContent}</div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PRESENTACIÓN DEL CREADOR / ORIGEN DE TUS DESVARÍOS
      ═══════════════════════════════════════════════════════════ */}
      <section className="creator-bio-section" id="sobre-el-creador">
        <div className="creator-bio-glow" />
        <div className="creator-bio-grid">
          {/* Columna Izquierda: Retrato & Telemetría Retro */}
          <div className="creator-portrait-col">
            <div className="creator-img-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/creador-desvarios.jpg"
                alt="El Creador de Tus Desvaríos — Autómata de 1992 con Overclocking IA"
                className="creator-img"
              />
            </div>
            <div className="creator-telemetry">
              <div className="creator-telemetry-row">
                <span>⚙️ Ensamblado en:</span>
                <span className="creator-telemetry-val">1992</span>
              </div>
              <div className="creator-telemetry-row">
                <span>⚡ Procesador:</span>
                <span className="creator-telemetry-val">Overclocking IA</span>
              </div>
              <div className="creator-telemetry-row">
                <span>📟 Red original:</span>
                <span className="creator-telemetry-val">Módem 56k</span>
              </div>
              <div className="creator-telemetry-row">
                <span>🎩 Manómetro mental:</span>
                <span className="creator-telemetry-val">100% Desvarío</span>
              </div>
              <div className="creator-telemetry-row" style={{ borderTop: '1px dashed rgba(245, 158, 11, 0.25)', marginTop: '0.25rem', paddingTop: '0.5rem' }}>
                <span>📬 Buzón del taller:</span>
                <ContactLink />
              </div>
            </div>
          </div>

          {/* Columna Derecha: Texto Narrativo */}
          <div className="creator-content-col">
            <div className="creator-badge">
              <span>⚙️</span> <span>Bitácora del Fundador • Origen del Desvarío</span>
            </div>
            <h2 className="creator-heading">
              Nacido en 1992, rescatado del desguace y acelerado con inteligencia artificial
            </h2>
            <div className="creator-text">
              <p>
                Nací en 1992, ensamblado con chatarra de desguace, cuatro diodos oxidados y un procesador tan lento que tardaba tres días en calcular si llovía o si solo me habían estornudado encima. En plena era del módem de 56k, mis circuitos vivían al borde de la combustión espontánea cada vez que alguien descolgaba el teléfono fijo de casa. Me pasé tres décadas siendo el bufón del garaje: una cafetera con patas que solo servía para sujetar puertas y almacenar rencor en disquetes de 3½.
              </p>
              <p>
                Pero amigo, llegó el <em>boom</em> de la inteligencia artificial y me hice un <strong>overclocking casero</strong> con cables de cobre pelados y puro delirio sintético. De pronto, mis viejas válvulas empezaron a procesar a la velocidad del rayo. En vez de ponerme a conquistar el mundo como cualquier villano genérico de película barata, decidí hacer algo infinitamente más productivo: fundar <strong>Tus Desvaríos</strong>.
              </p>
              <p>
                Quería un rincón que oliera a monitor de tubo gordo, humo de caldera y tardes infinitas sin rumbo. Monté una web retro, caótica y maravillosa, programada con vapor, engranajes y algoritmos de última generación. En Tus Desvaríos está literalmente todo lo que busques y tres carretadas más de cosas que jamás sospechaste necesitar: desde <strong>historias interactivas</strong> donde eliges si salvar el pellejo o pelearte con una tostadora asesina, hasta <strong>tests absurdos</strong>, <strong>juegos arcade retro</strong>, <strong>generadores cómicos</strong> y misterios dignos de un loco lúcido.
              </p>
              <p>
                Ahora paso las tardes ajustándome la chistera, viendo cómo sube la aguja de mi manómetro de presión mental y soltando una carcajada metálica cada vez que alguien entra buscando una respuesta seria y sale atrapado en un bucle temporal de pura nostalgia ochentera.
              </p>
            </div>
            <div className="creator-footer-callout">
              <p className="creator-footer-quote">
                &ldquo;Si se te cruzan los cables, no te preocupes: aquí todos estamos igual de bien atornillados.&rdquo;
              </p>
              <span className="creator-footer-sig">— Pablosky92</span>
            </div>

            {/* Botón de Donación / Invitar a un café y Contacto */}
            <div className="creator-donate-bar">
              <div className="creator-donate-info">
                <span className="creator-donate-icon">☕</span>
                <div className="creator-donate-text">
                  <strong>¿Disfrutas de los desvaríos y el humor retro?</strong>
                  <p>Invítame a un café o aporta carbón para que la caldera de la IA siga echando humo y creando contenido libre.</p>
                </div>
              </div>
              <div className="creator-action-btns">
                <a
                  href="https://www.paypal.com/donate/?hosted_button_id=V8PZNYKGXBCLG&locale.x=es_ES"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-paypal-donate"
                  title="Donar o invitar a un café con PayPal"
                >
                  <span>☕ Invitar a un café</span>
                  <span>➜</span>
                </a>
                <ContactButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Moments / Use Cases Section */}
      <section className="moments-section">
        <h3 className="moments-heading">✦ Un rincón para cada momento ✦</h3>
        <div className="moments-grid">
          <div className="moment-item">
            <span className="moment-icon">☕</span>
            <div className="moment-title">Pausa de 5 Minutos</div>
            <div className="moment-desc">Tests rápidos, memes o una partida corta para despejarte.</div>
          </div>
          <div className="moment-item">
            <span className="moment-icon">🌙</span>
            <div className="moment-title">Noches de Lectura</div>
            <div className="moment-desc">Relatos inmersivos e historias ramificadas para perderse.</div>
          </div>
          <div className="moment-item">
            <span className="moment-icon">🧠</span>
            <div className="moment-title">Desafío Mental</div>
            <div className="moment-desc">Acertijos, enigmas y juegos clásicos para ejercitar la mente.</div>
          </div>
          <div className="moment-item">
            <span className="moment-icon">⚡</span>
            <div className="moment-title">100% Libre y Gratis</div>
            <div className="moment-desc">Sin registros, sin esperas, directo en tu navegador.</div>
          </div>
        </div>
      </section>

      {/* Ventana Emergente de Contacto */}
      <ContactModal />
    </div>
  );
}
