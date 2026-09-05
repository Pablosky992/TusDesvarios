'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('tusdesvarios_cookie_consent');
      if (!consent) {
        setVisible(true);
      }
    } catch {
      // localStorage may fail in some iframe/private browsing modes
    }

    const handleOpen = () => setVisible(true);
    window.addEventListener('open_cookie_banner', handleOpen);
    return () => window.removeEventListener('open_cookie_banner', handleOpen);
  }, []);

  const handleConsent = (type: 'all' | 'necessary') => {
    try {
      localStorage.setItem('tusdesvarios_cookie_consent', type);
      localStorage.setItem('tusdesvarios_cookie_consent_date', new Date().toISOString());
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies y privacidad"
      style={{
        position: 'fixed',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 2rem)',
        maxWidth: '960px',
        zIndex: 9999,
        background: 'rgba(15, 20, 32, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(168, 85, 247, 0.35)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(168, 85, 247, 0.2)',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.25rem',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ flex: '1 1 500px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.4rem',
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>🍪</span>
          <span
            style={{
              fontWeight: 700,
              fontSize: '0.98rem',
              color: '#f8fafc',
              letterSpacing: '0.02em',
            }}
          >
            Tu privacidad en Tus Desvaríos
          </span>
        </div>
        <p
          style={{
            fontSize: '0.85rem',
            lineHeight: 1.55,
            color: '#cbd5e1',
            margin: 0,
          }}
        >
          Utilizamos cookies y almacenamiento local estrictamente necesarios para guardar tu progreso en las historias interactivas, registrar tus récords arcade y mantener tu sesión de usuario. No vendemos tus datos a terceros. Puedes aceptar todas o elegir solo las necesarias.{' '}
          <Link
            href="/politica-de-cookies"
            style={{
              color: '#c084fc',
              textDecoration: 'underline',
              fontWeight: 500,
            }}
          >
            Leer Política de Cookies
          </Link>
          .
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={() => handleConsent('necessary')}
          style={{
            padding: '0.55rem 1.15rem',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            background: 'rgba(255, 255, 255, 0.06)',
            color: '#e2e8f0',
            fontSize: '0.84rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.18s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.color = '#e2e8f0';
          }}
        >
          Solo Necesarias
        </button>

        <button
          type="button"
          onClick={() => handleConsent('all')}
          style={{
            padding: '0.55rem 1.35rem',
            borderRadius: '9999px',
            border: 'none',
            background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
            color: '#ffffff',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 18px rgba(168, 85, 247, 0.45)',
            transition: 'all 0.18s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(168, 85, 247, 0.6)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 18px rgba(168, 85, 247, 0.45)';
          }}
        >
          Aceptar Todas
        </button>
      </div>
    </div>
  );
}
