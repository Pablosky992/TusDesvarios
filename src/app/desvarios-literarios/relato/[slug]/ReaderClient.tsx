'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Relato } from '@/lib/literarios';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Feather,
  Share2,
  Sparkles,
  Type,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';

interface ReaderClientProps {
  relato: Relato;
  allRelatos: Relato[];
}

const STORAGE_KEY = 'tusdesvarios_relatos_leidos';

export default function ReaderClient({ relato, allRelatos }: ReaderClientProps) {
  const [theme, setTheme] = useState<'dark' | 'sepia' | 'night'>('dark');
  const [fontSize, setFontSize] = useState<number>(18); // px
  const [fontFamily, setFontFamily] = useState<'serif' | 'display' | 'sans'>('serif');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isRead, setIsRead] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const list: string[] = JSON.parse(stored);
        setIsRead(list.includes(relato.slug));
      }
    } catch (e) {}

    const handleStorage = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const list: string[] = JSON.parse(stored);
          setIsRead(list.includes(relato.slug));
        } else {
          setIsRead(false);
        }
      } catch (e) {}
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [relato.slug]);

  const toggleRead = () => {
    setIsRead((prev) => {
      const nextState = !prev;
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        let list: string[] = stored ? JSON.parse(stored) : [];
        if (nextState) {
          if (!list.includes(relato.slug)) list.push(relato.slug);
        } else {
          list = list.filter((s) => s !== relato.slug);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) {}
      return nextState;
    });
  };

  useEffect(() => {
    let hasAutoMarked = false;
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));

        if (currentProgress >= 95 && !hasAutoMarked) {
          hasAutoMarked = true;
          try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const list: string[] = stored ? JSON.parse(stored) : [];
            if (!list.includes(relato.slug)) {
              list.push(relato.slug);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
              setIsRead(true);
            }
          } catch (e) {}
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [relato.slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Find next and prev story
  const currentIndex = allRelatos.findIndex((r) => r.slug === relato.slug);
  const prevRelato = currentIndex > 0 ? allRelatos[currentIndex - 1] : null;
  const nextRelato = currentIndex < allRelatos.length - 1 ? allRelatos[currentIndex + 1] : null;

  // Theme Styles
  const themeStyles = {
    dark: {
      bg: '#0b0f19',
      cardBg: 'rgba(18, 24, 38, 0.85)',
      text: '#f8fafc',
      secondaryText: '#cbd5e1',
      border: 'rgba(255, 255, 255, 0.12)',
      accent: relato.color,
    },
    sepia: {
      bg: '#1c1510',
      cardBg: 'rgba(34, 25, 18, 0.95)',
      text: '#fef3c7',
      secondaryText: '#fde68a',
      border: 'rgba(245, 158, 11, 0.25)',
      accent: '#f59e0b',
    },
    night: {
      bg: '#0f172a',
      cardBg: 'rgba(30, 41, 59, 0.85)',
      text: '#e2e8f0',
      secondaryText: '#94a3b8',
      border: 'rgba(148, 163, 184, 0.15)',
      accent: '#38bdf8',
    },
  }[theme];

  const fontFamilies = {
    serif: "'Crimson Pro', Georgia, serif",
    display: "'Cinzel', Georgia, serif",
    sans: "'Inter', -apple-system, sans-serif",
  };

  // Format markdown to HTML paragraphs
  const renderFormattedContent = () => {
    const sections = relato.contenido.split('\n\n');
    return sections.map((sec, idx) => {
      const trimmed = sec.trim();
      if (trimmed.startsWith('### ')) {
        return (
          <h3
            key={idx}
            style={{
              fontFamily: "var(--font-display, 'Cinzel', serif)",
              fontSize: '1.45rem',
              fontWeight: 800,
              color: themeStyles.accent,
              marginTop: '2.5rem',
              marginBottom: '1.25rem',
              letterSpacing: '0.04em',
            }}
          >
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote
            key={idx}
            style={{
              borderLeft: `3px solid ${themeStyles.accent}`,
              padding: '0.85rem 1.4rem',
              margin: '1.75rem 0',
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '0 8px 8px 0',
              fontStyle: 'italic',
              fontSize: `${fontSize * 1.05}px`,
              lineHeight: 1.7,
              color: themeStyles.secondaryText,
            }}
          >
            {trimmed.replace(/^>\s*\*/g, '').replace(/\*$/g, '')}
          </blockquote>
        );
      }
      if (trimmed === '---') {
        return (
          <hr
            key={idx}
            style={{
              border: 'none',
              height: '1px',
              background: themeStyles.border,
              margin: '2rem 0',
            }}
          />
        );
      }
      if (trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').map((item, i) => (
          <li key={i} style={{ marginBottom: '0.5rem' }}>
            <span
              dangerouslySetInnerHTML={{
                __html: item
                  .replace(/^\*\s*/, '')
                  .replace(/\*\*(.*?)\*\*/g, `<strong>$1</strong>`)
                  .replace(/\*(.*?)\*/g, `<em>$1</em>`),
              }}
            />
          </li>
        ));
        return (
          <ul
            key={idx}
            style={{
              paddingLeft: '1.5rem',
              margin: '1rem 0 1.5rem',
              lineHeight: 1.8,
              fontSize: `${fontSize}px`,
            }}
          >
            {items}
          </ul>
        );
      }

      return (
        <p
          key={idx}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: 1.85,
            marginBottom: '1.4rem',
            color: themeStyles.text,
          }}
          dangerouslySetInnerHTML={{
            __html: trimmed
              .replace(/\*\*(.*?)\*\*/g, `<strong>$1</strong>`)
              .replace(/\*(.*?)\*/g, `<em>$1</em>`),
          }}
        />
      );
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: themeStyles.bg, transition: 'background 0.3s ease' }}>
      {/* Top Reading Progress Bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: `${scrollProgress}%`,
          height: '4px',
          background: `linear-gradient(90deg, ${themeStyles.accent}, #ec4899)`,
          zIndex: 1000,
          boxShadow: `0 0 12px ${themeStyles.accent}`,
          transition: 'width 0.1s ease',
        }}
      />

      {/* Reader Floating Controls Bar */}
      <div
        style={{
          position: 'sticky',
          top: '64px',
          zIndex: 90,
          background: themeStyles.cardBg,
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${themeStyles.border}`,
          padding: '0.65rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          maxWidth: '1000px',
          margin: '0 auto 2rem',
          borderRadius: '0 0 14px 14px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
        }}
      >
        <Link
          href="/desvarios-literarios"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: themeStyles.secondaryText,
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={15} />
          <span>Catálogo Literario</span>
        </Link>

        {/* Customization Controls: Font Size, Font Family, Theme */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Font Family Selector */}
          <div style={{ display: 'inline-flex', borderRadius: '8px', border: `1px solid ${themeStyles.border}`, overflow: 'hidden' }}>
            <button
              onClick={() => setFontFamily('serif')}
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.8rem',
                fontWeight: fontFamily === 'serif' ? 700 : 500,
                background: fontFamily === 'serif' ? `${themeStyles.accent}30` : 'transparent',
                color: fontFamily === 'serif' ? '#ffffff' : themeStyles.secondaryText,
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Crimson Pro', serif",
              }}
            >
              Serif
            </button>
            <button
              onClick={() => setFontFamily('sans')}
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.8rem',
                fontWeight: fontFamily === 'sans' ? 700 : 500,
                background: fontFamily === 'sans' ? `${themeStyles.accent}30` : 'transparent',
                color: fontFamily === 'sans' ? '#ffffff' : themeStyles.secondaryText,
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Sans
            </button>
          </div>

          {/* Font Size Adjusters */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
            <button
              onClick={() => setFontSize((s) => Math.max(14, s - 2))}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                border: `1px solid ${themeStyles.border}`,
                background: 'rgba(255,255,255,0.04)',
                color: themeStyles.text,
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              title="Reducir tamaño de letra"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize((s) => Math.min(26, s + 2))}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                border: `1px solid ${themeStyles.border}`,
                background: 'rgba(255,255,255,0.04)',
                color: themeStyles.text,
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              title="Aumentar tamaño de letra"
            >
              A+
            </button>
          </div>

          {/* Theme Switchers */}
          <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
            <button
              onClick={() => setTheme('dark')}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                border: theme === 'dark' ? `1.5px solid ${themeStyles.accent}` : `1px solid ${themeStyles.border}`,
                background: '#0b0f19',
                color: '#fff',
                fontSize: '0.78rem',
                fontWeight: theme === 'dark' ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              🌌 Noche
            </button>
            <button
              onClick={() => setTheme('sepia')}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                border: theme === 'sepia' ? `1.5px solid #f59e0b` : `1px solid ${themeStyles.border}`,
                background: '#241a12',
                color: '#fef3c7',
                fontSize: '0.78rem',
                fontWeight: theme === 'sepia' ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              📜 Sepia
            </button>
            <button
              onClick={() => setTheme('night')}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                border: theme === 'night' ? `1.5px solid #38bdf8` : `1px solid ${themeStyles.border}`,
                background: '#1e293b',
                color: '#e2e8f0',
                cursor: 'pointer',
              }}
            >
              ☕ Café
            </button>
          </div>

          {/* Toggle Read Button */}
          <button
            onClick={toggleRead}
            title={isRead ? 'Hacer clic para desmarcar como leído' : 'Marcar como leído'}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              border: isRead ? '1px solid #10b981' : `1px solid ${themeStyles.border}`,
              background: isRead ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              color: isRead ? '#34d399' : themeStyles.secondaryText,
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isRead ? '0 0 14px rgba(16, 185, 129, 0.3)' : 'none',
            }}
          >
            <span>{isRead ? '✅' : '⚪'}</span>
            <span>{isRead ? 'Leído' : 'Marcar Leído'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              border: `1px solid ${themeStyles.border}`,
              background: 'rgba(255,255,255,0.05)',
              color: copied ? '#10b981' : themeStyles.secondaryText,
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
            }}
          >
            {copied ? <Check size={14} /> : <Share2 size={14} />}
            <span>{copied ? '¡Copiado!' : 'Compartir'}</span>
          </button>
        </div>
      </div>

      {/* Main Reading Canvas */}
      <main
        style={{
          maxWidth: '780px',
          margin: '0 auto',
          padding: '0 1.5rem 6rem',
          fontFamily: fontFamilies[fontFamily],
        }}
      >
        {/* Story Header */}
        <header style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '1rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.9rem',
              borderRadius: '9999px',
              background: `${themeStyles.accent}20`,
              border: `1px solid ${themeStyles.accent}45`,
              color: themeStyles.accent,
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '1.25rem',
            }}
          >
            <span>{relato.icono}</span>
            <span>{relato.generoNombre}</span>
          </span>

          <h1
            style={{
              fontFamily: "var(--font-display, 'Cinzel', serif)",
              fontSize: 'clamp(2.2rem, 5.5vw, 3.4rem)',
              fontWeight: 900,
              letterSpacing: '0.03em',
              color: themeStyles.text,
              lineHeight: 1.15,
              marginBottom: '1rem',
            }}
          >
            {relato.titulo}
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              fontStyle: 'italic',
              color: themeStyles.secondaryText,
              maxWidth: '620px',
              margin: '0 auto 1.75rem',
              lineHeight: 1.6,
            }}
          >
            {relato.subtitulo}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              fontSize: '0.88rem',
              color: themeStyles.secondaryText,
              paddingTop: '1rem',
              borderTop: `1px solid ${themeStyles.border}`,
            }}
          >
            {relato.autor && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Feather size={14} style={{ color: themeStyles.accent }} /> {relato.autor}
              </span>
            )}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={14} /> {relato.tiempoLecturaMin} min de lectura
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: themeStyles.secondaryText, opacity: 0.85 }}>
              ~{relato.palabras} palabras
            </span>
          </div>
        </header>

        {/* Featured Quotes Card */}
        {relato.citasDestacadas && relato.citasDestacadas.length > 0 && (
          <div
            style={{
              padding: '1.5rem 1.75rem',
              background: themeStyles.cardBg,
              border: `1.5px solid ${themeStyles.accent}40`,
              borderRadius: '14px',
              marginBottom: '3rem',
              boxShadow: `0 8px 30px rgba(0, 0, 0, 0.35)`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: themeStyles.accent, fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
              <Sparkles size={14} />
              <span>Cita del Relato</span>
            </div>
            <p style={{ fontSize: '1.15rem', fontStyle: 'italic', color: themeStyles.text, lineHeight: 1.6, margin: 0 }}>
              “{relato.citasDestacadas[0]}”
            </p>
          </div>
        )}

        {/* Body Text */}
        <article style={{ textAlign: 'justify', textJustify: 'inter-word' }}>
          {renderFormattedContent()}
        </article>

        {/* Story Completion Card */}
        <div
          style={{
            marginTop: '3.5rem',
            padding: '2rem 2.2rem',
            borderRadius: '18px',
            background: themeStyles.cardBg,
            border: isRead ? '1.5px solid rgba(16, 185, 129, 0.55)' : `1.5px solid ${themeStyles.border}`,
            textAlign: 'center',
            boxShadow: isRead ? '0 12px 35px rgba(0,0,0,0.45), 0 0 25px rgba(16, 185, 129, 0.25)' : '0 12px 35px rgba(0,0,0,0.45)',
            fontFamily: "'Inter', sans-serif",
            transition: 'all 0.3s ease',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: isRead ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245,158,11,0.15)',
              border: isRead ? '1.5px solid rgba(16, 185, 129, 0.6)' : '1.5px solid rgba(245,158,11,0.4)',
              fontSize: '1.6rem',
              marginBottom: '1rem',
              boxShadow: isRead ? '0 0 25px rgba(16, 185, 129, 0.4)' : '0 0 20px rgba(245,158,11,0.25)',
            }}
          >
            {isRead ? '🎉' : '✨'}
          </div>
          <h3
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '1.45rem',
              color: themeStyles.text,
              marginBottom: '0.5rem',
              letterSpacing: '0.03em',
            }}
          >
            {isRead ? '¡Obra Completada!' : 'Fin de la Lectura'}
          </h3>
          <p
            style={{
              fontSize: '0.95rem',
              color: themeStyles.secondaryText,
              maxWidth: '540px',
              margin: '0 auto 1.35rem',
              lineHeight: 1.6,
            }}
          >
            {isRead
              ? 'Has marcado esta historia como leída. Tu progreso se encuentra guardado en tu biblioteca personal.'
              : `¿Has terminado de leer ${relato.titulo}? Marca esta obra para llevar el recuento en tu biblioteca personal.`}
          </p>
          <button
            type="button"
            onClick={toggleRead}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.8rem 1.85rem',
              borderRadius: '9999px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              border: isRead ? '1.5px solid #10b981' : '1.5px solid rgba(16, 185, 129, 0.5)',
              background: isRead
                ? 'rgba(16, 185, 129, 0.2)'
                : 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.3) 100%)',
              color: '#34d399',
              boxShadow: isRead ? '0 0 15px rgba(16, 185, 129, 0.2)' : '0 0 20px rgba(16, 185, 129, 0.25)',
            }}
          >
            <span>✅</span>
            <span>{isRead ? 'Leído (Hacer clic para desmarcar)' : 'Marcar como Leído'}</span>
          </button>

          {/* Apoyo al creador / Donaciones PayPal */}
          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1.5rem',
              borderTop: `1px solid ${themeStyles.border}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <p style={{ fontSize: '0.9rem', color: themeStyles.secondaryText, margin: 0, maxWidth: '500px', lineHeight: 1.5 }}>
              ☕ <strong>¿Has disfrutado de la lectura?</strong> Si te gusta este contenido libre e independiente, puedes invitar a un café al creador para apoyar nuevos relatos.
            </p>
            <a
              href="https://www.paypal.com/donate/?hosted_button_id=V8PZNYKGXBCLG&locale.x=es_ES"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-paypal-donate"
              title="Invitar a un café con PayPal"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.65rem 1.4rem',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#0b0f19',
                fontWeight: 800,
                fontSize: '0.88rem',
                textDecoration: 'none',
                boxShadow: '0 4px 18px rgba(245, 158, 11, 0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>☕ Invitar a un café</span>
              <span>➜</span>
            </a>
          </div>
        </div>

        {/* Story Footer Navigation (Prev / Next) */}
        <footer
          style={{
            marginTop: '5rem',
            paddingTop: '2.5rem',
            borderTop: `1px solid ${themeStyles.border}`,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            {prevRelato ? (
              <Link
                href={`/desvarios-literarios/relato/${prevRelato.slug}`}
                style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  background: themeStyles.cardBg,
                  border: `1px solid ${themeStyles.border}`,
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: '0.8rem', color: themeStyles.secondaryText, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <ChevronLeft size={14} /> Relato Anterior
                </span>
                <strong style={{ color: themeStyles.text, fontSize: '1rem' }}>{prevRelato.titulo}</strong>
              </Link>
            ) : <div />}

            {nextRelato ? (
              <Link
                href={`/desvarios-literarios/relato/${nextRelato.slug}`}
                style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  background: themeStyles.cardBg,
                  border: `1px solid ${themeStyles.border}`,
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '0.35rem',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: '0.8rem', color: themeStyles.secondaryText, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  Siguiente Relato <ChevronRight size={14} />
                </span>
                <strong style={{ color: themeStyles.text, fontSize: '1rem', textAlign: 'right' }}>{nextRelato.titulo}</strong>
              </Link>
            ) : <div />}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link
              href="/desvarios-literarios"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.75rem',
                borderRadius: '9999px',
                background: `${themeStyles.accent}20`,
                border: `1.5px solid ${themeStyles.accent}`,
                color: '#ffffff',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.92rem',
              }}
            >
              <BookOpen size={16} />
              <span>Explorar más Desvaríos Literarios</span>
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
