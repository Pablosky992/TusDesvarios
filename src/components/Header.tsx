'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, FlaskConical, Gamepad2, Globe, Home, MessageSquare, RotateCcw, ScrollText, Smile, User } from 'lucide-react';

interface HeaderProps {
  storyTitle?: string;
  onRestart?: () => void;
  showRestart?: boolean;
}

export function Header({ storyTitle, onRestart, showRestart = false }: HeaderProps) {
  const pathname = usePathname();

  const isPortal = pathname === '/';
  const isCrea = pathname.startsWith('/crea-tu-historia') || pathname.startsWith('/historia/');
  const isLiterarios = pathname.startsWith('/desvarios-literarios');
  const isRetro = pathname.startsWith('/desvarios-retro');
  const isMental = pathname.startsWith('/desvarios-mentales');
  const isHumor = pathname.startsWith('/desvarios-de-humor');
  const isRed = pathname.startsWith('/desvarios-por-la-red');
  const isForo = pathname.startsWith('/foro');

  const [cachedUser, setCachedUser] = useState<{ username: string; avatar_id: string } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('desvarios_user_cache');
      if (raw) {
        setCachedUser(JSON.parse(raw));
      }
    } catch (e) {}
  }, []);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        {/* Logo */}
        <Link href="/" className="logo-link" title="Ir a la portada de Tus Desvaríos">
          <img
            src="/images/logo-icon.png"
            alt="Tus Desvaríos Logo"
            className="logo-image"
          />
          <div className="logo-text-group">
            <span className="logo-text-top">TUS</span>
            <span className="logo-text-main">DESVARÍOS</span>
          </div>
        </Link>

        {/* Unified Navigation Bar */}
        <nav className="header-nav">
          <Link
            href="/crea-tu-historia"
            className={`nav-link ${isCrea ? 'active-crea' : ''}`}
            title="Novelas y Ficción Interactiva"
          >
            <BookOpen size={15} />
            <span className="nav-link-text">Crea Historias</span>
          </Link>

          <Link
            href="/desvarios-literarios"
            className={`nav-link ${isLiterarios ? 'active-literarios' : ''}`}
            title="Relatos, Cuentos y Ficción Narrativa"
          >
            <ScrollText size={15} />
            <span className="nav-link-text">Relatos</span>
          </Link>

          <Link
            href="/desvarios-retro"
            className={`nav-link ${isRetro ? 'active-retro' : ''}`}
            title="Arcade, Juegos Clásicos y El Ahorcado"
          >
            <Gamepad2 size={15} />
            <span className="nav-link-text">Juegos Retro</span>
          </Link>

          <Link
            href="/desvarios-mentales"
            className={`nav-link ${isMental ? 'active-mental' : ''}`}
            title="Tests, Enigmas y Retos Psicológicos"
          >
            <FlaskConical size={15} />
            <span className="nav-link-text">Tests Mentales</span>
          </Link>

          <Link
            href="/desvarios-de-humor"
            className={`nav-link ${isHumor ? 'active-humor' : ''}`}
            title="Sátira, Generador de Excusas y Pensamientos de Ducha"
          >
            <Smile size={15} />
            <span className="nav-link-text">Humor & Caos</span>
          </Link>

          <Link
            href="/desvarios-por-la-red"
            className={`nav-link ${isRed ? 'active-red' : ''}`}
            title="Escaparate Web y Bazar de Curiosidades de Amazon"
          >
            <Globe size={15} />
            <span className="nav-link-text">Por la Red</span>
          </Link>

          <a
            href="/foro.html"
            className={`nav-link ${isForo ? 'active-foro' : ''}`}
            title="Comunidad y Foro de Debate"
          >
            <MessageSquare size={15} />
            <span className="nav-link-text">Foro</span>
          </a>

          <Link
            href="/"
            className={`nav-link ${isPortal ? 'active-portal' : ''}`}
            title="Portada Principal"
          >
            <Home size={15} />
            <span className="nav-link-text">Portal</span>
          </Link>

          <a
            href={cachedUser ? '/perfil.html' : '/login.html'}
            className={`nav-link nav-link-user ${cachedUser ? 'logged-in' : ''}`}
            title={cachedUser ? `Ficha de @${cachedUser.username}` : 'Acceso / Mi Perfil'}
          >
            {cachedUser?.avatar_id ? (
              <img
                src={`/images/avatars/${cachedUser.avatar_id}.svg`}
                alt={cachedUser.username}
                style={{ width: 18, height: 18, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.4)' }}
              />
            ) : (
              <User size={15} />
            )}
            <span className="nav-link-text">
              {cachedUser ? `@${cachedUser.username}` : 'Acceder'}
            </span>
          </a>

          {showRestart && onRestart && (
            <button
              onClick={onRestart}
              className="btn-secondary"
              style={{ marginLeft: '0.4rem', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              title="Reiniciar historia desde el principio"
            >
              <RotateCcw size={13} />
              <span>Reiniciar</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
