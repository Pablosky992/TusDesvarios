import Link from 'next/link';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '5rem 1rem',
        maxWidth: '500px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          padding: '1rem',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          color: '#ef4444',
          marginBottom: '1.5rem',
        }}
      >
        <Compass size={36} />
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          fontWeight: 700,
          marginBottom: '0.75rem',
          color: 'var(--text-primary)',
        }}
      >
        Camino Desconocido
      </h1>

      <p
        style={{
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: '2rem',
        }}
      >
        Has llegado a un sendero que no figura en ningún mapa. La niebla oculta tus pasos y no hay salida por aquí.
      </p>

      <Link href="/" className="btn-primary">
        <Home size={16} />
        <span>Regresar al camino principal</span>
      </Link>
    </div>
  );
}
