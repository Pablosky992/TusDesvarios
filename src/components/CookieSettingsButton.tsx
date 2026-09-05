'use client';

import React from 'react';

export default function CookieSettingsButton() {
  const handleClick = () => {
    try {
      localStorage.removeItem('tusdesvarios_cookie_consent');
      window.dispatchEvent(new Event('open_cookie_banner'));
    } catch {
      // ignore
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.8rem 1.75rem',
        borderRadius: '9999px',
        border: 'none',
        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        color: '#ffffff',
        fontSize: '0.92rem',
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(168, 85, 247, 0.4)',
        transition: 'all 0.2s ease',
        marginTop: '0.5rem',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 25px rgba(236, 72, 153, 0.55)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(168, 85, 247, 0.4)';
      }}
    >
      <span>🍪</span> <span>Gestionar mi Consentimiento de Cookies</span>
    </button>
  );
}
