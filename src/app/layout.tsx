import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import CookieBanner from '@/components/CookieBanner';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tus Desvaríos — Portal de Historias, Juegos y Curiosidades',
  description:
    'Tus Desvaríos: tu rincón de entretenimiento interactivo. Historias ramificadas donde tú forjas el destino, relatos, juegos clásicos y tests.',
  keywords: ['tus desvarios', 'historias interactivas', 'relatos', 'juegos clasicos', 'tests', 'ficcion interactiva', 'elige tu propia aventura'],
  authors: [{ name: 'TusDesvarios.com' }],
  metadataBase: new URL('https://tusdesvarios.com'),
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Tus Desvaríos — Historias, Juegos y Curiosidades',
    description: 'Un rincón para desconectar, jugar y dejar volar la imaginación. Explora historias donde tú decides el final, relatos, juegos y tests.',
    type: 'website',
    url: 'https://tusdesvarios.com',
    images: [
      {
        url: '/images/logo.jpg',
        width: 1024,
        height: 1024,
        alt: 'Tus Desvaríos Logo',
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#07090e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div className="app-container">
          <Header />
          <main className="main-content">{children}</main>
          <footer className="site-footer">
            <p>
              © {new Date().getFullYear()} TusDesvarios.com — Portal de Entretenimiento, Ficción y Ocio Interactivo
            </p>
            <div className="footer-legal-links">
              <Link href="/aviso-legal">Aviso Legal</Link>
              <span className="footer-separator">•</span>
              <Link href="/politica-de-privacidad">Política de Privacidad</Link>
              <span className="footer-separator">•</span>
              <Link href="/politica-de-cookies">Política de Cookies</Link>
            </div>
          </footer>
          <CookieBanner />
        </div>
      </body>
    </html>
  );
}
