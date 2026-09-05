import { Metadata } from 'next';
import HumorHub from './HumorHub';
import {
  getAmbitos,
  getGravedades,
  getTonos,
  getCatalogoExcusas,
  getPrediccionesOraculo,
  getLeyes,
  getPensamientos,
} from '@/lib/humor';

export const metadata: Metadata = {
  title: 'Desvaríos de Humor & Caos — Generador de Excusas, Oráculo y Pensamientos de Ducha | Tus Desvaríos',
  description:
    'Consola interactiva de sátira y humor cotidiano: Generador de excusas infalibles con medidor de verosimilitud, Oráculo del Desvarío, Leyes del Caos y Pensamientos de Ducha. ¡Coartadas creíbles y reflexiones cómicas!',
  keywords: [
    'desvarios de humor',
    'generador de excusas',
    'excusas creibles para faltar al trabajo',
    'coartadas online',
    'oraculo del desvario',
    'leyes de murphy humor',
    'leyes del caos',
    'pensamientos de ducha en español',
    'shower thoughts en español',
    'satira cotidiana',
    'humor absurdo',
    'tus desvarios',
  ],
  alternates: {
    canonical: 'https://tusdesvarios.com/desvarios-de-humor',
  },
  openGraph: {
    title: 'Desvaríos de Humor & Caos — Generador de Excusas y Consola del Absurdo',
    description:
      'Calcula coartadas perfectas con medidor de verosimilitud, consulta el oráculo cósmico y explora las leyes del caos cotidiano.',
    url: 'https://tusdesvarios.com/desvarios-de-humor',
    siteName: 'Tus Desvaríos',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/images/categories/desvarios-humor.jpg',
        width: 1024,
        height: 1024,
        alt: 'Desvaríos de Humor & Caos — Tus Desvaríos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Desvaríos de Humor & Caos — Generador de Excusas y Sátira',
    description:
      'Generador interactivo de excusas, oráculo cósmico y leyes de Murphy. 100% interactivo y gratuito en tu navegador.',
    images: ['/images/categories/desvarios-humor.jpg'],
  },
};

export default function DesvariosDeHumorPage() {
  const ambitos = getAmbitos();
  const gravedades = getGravedades();
  const tonos = getTonos();
  const catalogoExcusas = getCatalogoExcusas();
  const prediccionesOraculo = getPrediccionesOraculo();
  const leyes = getLeyes();
  const pensamientos = getPensamientos();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Consola Interactiva del Absurdo — Desvaríos de Humor',
        description:
          'Herramienta web interactiva con generador de excusas personalizables, medidor de credibilidad, oráculo del desvarío, catálogo de leyes del caos y pensamientos de ducha.',
        url: 'https://tusdesvarios.com/desvarios-de-humor',
        applicationCategory: 'EntertainmentApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR',
        },
        featureList: [
          'Generador de excusas con medidor de credibilidad y consejos estratégicos',
          'Oráculo del desvarío con predicciones cuánticas y dilemas',
          'Catálogo interactivo de Leyes del Caos y variantes de Murphy',
          'Generador de pensamientos de ducha y paradojas filosóficas cómicas',
        ],
        publisher: {
          '@type': 'Organization',
          name: 'Tus Desvaríos',
          url: 'https://tusdesvarios.com',
          logo: 'https://tusdesvarios.com/images/logo.jpg',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Portada',
            item: 'https://tusdesvarios.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Desvaríos de Humor',
            item: 'https://tusdesvarios.com/desvarios-de-humor',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: '¿Cómo funciona el Generador de Excusas con medidor de verosimilitud?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Selecciona el ámbito de la crisis (trabajo, pareja, amigos, familia, gimnasio, chats, dinero o universidad), el nivel de gravedad (falta leve, compromiso medio o catástrofe total) y el tono retórico (formal, científico, dramático, caradura, conspiranoico o zen). Al pulsar "Generar Coartada", el algoritmo calcula una excusa personalizada con su porcentaje de credibilidad y una recomendación práctica para ejecutarla con éxito.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Para qué situaciones cotidianas se pueden generar coartadas?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Cubre 8 categorías clave: retrasos y ausencias laborales ante jefes, cancelaciones de citas o compromisos en pareja, excusas para no salir de fiesta con amigos, compromisos familiares ineludibles, descansos no programados del gimnasio, justificaciones para tardar en contestar en WhatsApp y redes sociales, desajustes financieros y entregas universitarias.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Qué es el Oráculo del Desvarío y cómo resuelve dilemas?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'El Oráculo del Desvarío es una máquina de predicciones absurdas que procesa dudas existenciales y cotidianas asignando una probabilidad cósmica, un veredicto definitivo, una justificación de lógica surrealista, un consejo sabio y un signo zodiacal afín para guiar tus decisiones con humor.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Qué son las Leyes del Caos y en qué se diferencian de la Ley de Murphy?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Las Leyes del Caos son un compendio satírico de la entropía urbana moderna. Amplían la clásica Ley de Murphy abordando la tecnología, las impresoras en momentos de entrega, las tostadas con mantequilla, los mensajes enviados por error y las paradojas de la productividad.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Es necesario registrarse o pagar para usar las herramientas de humor?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Todas las consolas interactivas de Desvaríos de Humor son 100% gratuitas, anónimas y se ejecutan directamente en cualquier navegador web móvil o de escritorio, sin descargas ni suscripciones.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HumorHub
        ambitos={ambitos}
        gravedades={gravedades}
        tonos={tonos}
        catalogoExcusas={catalogoExcusas}
        prediccionesOraculo={prediccionesOraculo}
        leyes={leyes}
        pensamientos={pensamientos}
      />
    </>
  );
}
