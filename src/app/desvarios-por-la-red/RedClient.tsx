'use client';

import React, { useState } from 'react';
import { WebItem, AmazonProduct, getAmazonProductUrl } from '@/lib/red';
import {
  Globe,
  ShoppingBag,
  ExternalLink,
  PlusCircle,
  Sparkles,
  Star,
  Tag,
  Send,
  X,
  CheckCircle2,
  HelpCircle,
  Laptop,
  Gift,
  Gamepad2,
  Cpu
} from 'lucide-react';

interface RedClientProps {
  webs: WebItem[];
  products: AmazonProduct[];
}

const AMAZON_CATEGORIES = [
  { id: 'all', label: '🌟 Todos los Gadgets', icon: Sparkles },
  { id: 'tech', label: '⚡ Gadgets & Tech', icon: Cpu },
  { id: 'setup', label: '💻 Setup & Escritorio', icon: Laptop },
  { id: 'regalos', label: '🎁 Regalos Curiosos', icon: Gift },
  { id: 'ocio', label: '👾 Ocio & Frikis', icon: Gamepad2 },
];

export default function RedClient({ webs, products }: RedClientProps) {
  const [activeTab, setActiveTab] = useState<'webs' | 'amazon'>('webs');
  const [selectedAmazonCat, setSelectedAmazonCat] = useState('all');
  
  // Submission modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    webName: '',
    webUrl: '',
    email: '',
    plan: 'Propuesta Estándar (Revisión Comunitaria)',
    description: '',
  });

  const filteredProducts = products.filter((p) => {
    if (selectedAmazonCat === 'all') return true;
    return p.categoria === selectedAmazonCat;
  });

  const handleSubmitWeb = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: 'c669c668-da2d-4b10-8298-094ee145a7d6',
          subject: `Nueva propuesta de Web para el Escaparate (${formData.webName} - ${formData.plan})`,
          from_name: 'Tus Desvaríos - Escaparate Web',
          name: formData.webName,
          email: formData.email,
          website_url: formData.webUrl,
          plan: formData.plan,
          description: formData.description,
          message: `Solicitud para publicar web en Tus Desvaríos:\n• Proyecto: ${formData.webName}\n• URL: ${formData.webUrl}\n• Modalidad: ${formData.plan}\n• Email del solicitante: ${formData.email}\n• Descripción: ${formData.description}`,
        }),
      });
      const data = await response.json();
      if (response.status === 200 && data.success) {
        setFormSubmitted(true);
      } else {
        setErrorMessage(data.message || 'Error al enviar la propuesta. Puedes escribirnos directamente a consultasydudasvarias@hotmail.com');
      }
    } catch {
      setErrorMessage('Error de conexión. Puedes escribirnos directamente a consultasydudasvarias@hotmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ webName: '', webUrl: '', email: '', plan: 'Propuesta Estándar (Revisión Comunitaria)', description: '' });
    setFormSubmitted(false);
    setErrorMessage('');
    setIsModalOpen(false);
  };

  return (
    <div className="container-custom" style={{ paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <div
        className="portal-hero"
        style={{
          textAlign: 'center',
          padding: '2.5rem 1rem 1.75rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.95rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            color: '#60a5fa',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
            boxShadow: '0 0 16px rgba(59, 130, 246, 0.25)',
          }}
        >
          <Globe size={14} />
          <span>Directorio de Proyectos & Bazar de Curiosidades</span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display, 'Cinzel', serif)",
            fontSize: 'clamp(2.3rem, 5.5vw, 3.6rem)',
            fontWeight: 900,
            letterSpacing: '0.02em',
            marginBottom: '1rem',
            color: '#ffffff',
          }}
        >
          Desvaríos por la{' '}
          <span
            style={{
              color: '#3b82f6',
              textShadow: '0 0 35px rgba(59, 130, 246, 0.55)',
            }}
          >
            Red
          </span>
        </h1>

        <p
          style={{
            fontSize: '1.08rem',
            lineHeight: '1.65',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 1.75rem',
          }}
        >
          Un punto de encuentro para descubrir proyectos web recomendados, dar a conocer tu página y explorar una selección de los gadgets más insólitos y divertidos de Amazon.
        </p>

        {/* Big Dual Tab Switcher */}
        <div
          style={{
            display: 'inline-flex',
            background: 'rgba(15, 23, 42, 0.85)',
            padding: '0.35rem',
            borderRadius: 'var(--radius-full)',
            border: '1.5px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 25px rgba(59, 130, 246, 0.15)',
            gap: '0.35rem',
          }}
        >
          <button
            onClick={() => setActiveTab('webs')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.4rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: activeTab === 'webs' ? 800 : 600,
              fontSize: '0.95rem',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'webs' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'transparent',
              color: activeTab === 'webs' ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: activeTab === 'webs' ? '0 0 20px rgba(59, 130, 246, 0.45)' : 'none',
              transition: 'all 0.22s ease',
            }}
          >
            <Globe size={17} />
            <span>🌐 Escaparate Web</span>
            <span
              style={{
                fontSize: '0.75rem',
                background: activeTab === 'webs' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                padding: '0.1rem 0.45rem',
                borderRadius: '10px',
              }}
            >
              {webs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('amazon')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.4rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: activeTab === 'amazon' ? 800 : 600,
              fontSize: '0.95rem',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'amazon' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'transparent',
              color: activeTab === 'amazon' ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: activeTab === 'amazon' ? '0 0 20px rgba(245, 158, 11, 0.45)' : 'none',
              transition: 'all 0.22s ease',
            }}
          >
            <ShoppingBag size={17} />
            <span>🛍️ Bazar de Amazon</span>
            <span
              style={{
                fontSize: '0.75rem',
                background: activeTab === 'amazon' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                padding: '0.1rem 0.45rem',
                borderRadius: '10px',
              }}
            >
              {products.length}
            </span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: ESCAPARATE DE WEBS
      ========================================================================= */}
      {activeTab === 'webs' && (
        <section style={{ marginTop: '1rem' }}>
          {/* Call to Action Banner: Publica tu Web */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '1.5px solid rgba(59, 130, 246, 0.35)',
              borderRadius: '16px',
              padding: '1.5rem 1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.25rem',
              marginBottom: '2rem',
              boxShadow: '0 10px 35px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.1)',
            }}
          >
            <div style={{ maxWidth: '640px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '1.25rem' }}>🚀</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  ¿Tienes una web, blog o proyecto digital?
                </h3>
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Anúnciate en nuestro escaparate para ganar visibilidad ante nuestra comunidad. Aceptamos proyectos independientes, blogs, webs amigas y colaboraciones.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.92rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
                transition: 'all 0.2s ease',
              }}
            >
              <PlusCircle size={17} />
              <span>Publicar mi Web aquí</span>
            </button>
          </div>

          {/* Web Showcase Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {webs.map((w) => (
              <article
                key={w.id}
                className="cat-card cat-card-active"
                style={
                  {
                    '--card-accent': w.badgeColor,
                    '--card-glow': `${w.badgeColor}33`,
                    '--card-border': `${w.badgeColor}55`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  } as React.CSSProperties
                }
              >
                <div className="cat-card-glow-circle" />

                {/* Card Thumbnail Wrap */}
                <div className="cat-card-thumb-wrap" style={{ height: '185px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={`/images/red/${w.imagen}`}
                    alt={w.titulo}
                    className="cat-card-thumb"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div className="cat-card-thumb-overlay" />
                  
                  {/* Badge & Icon */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '0.85rem',
                      left: '0.85rem',
                      right: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(0, 0, 0, 0.55)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.3rem',
                      }}
                    >
                      {w.icono}
                    </div>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        background: `${w.badgeColor}25`,
                        border: `1px solid ${w.badgeColor}60`,
                        color: '#ffffff',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        boxShadow: `0 0 12px ${w.badgeColor}35`,
                      }}
                    >
                      {w.badge}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="cat-card-body" style={{ padding: '1.35rem 1.4rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 className="cat-card-title" style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#ffffff' }}>
                    {w.titulo}
                  </h3>

                  <p className="cat-card-desc" style={{ fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.1rem', flex: 1 }}>
                    {w.descripcion}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                    {w.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: '0.72rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          color: 'var(--text-muted)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '6px',
                        }}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* External Link Button */}
                  <a
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.65rem 1rem',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: `1.5px solid ${w.badgeColor}55`,
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      marginTop: 'auto',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${w.badgeColor}22`;
                      e.currentTarget.style.borderColor = w.badgeColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                      e.currentTarget.style.borderColor = `${w.badgeColor}55`;
                    }}
                  >
                    <span>Visitar Web</span>
                    <ExternalLink size={14} style={{ color: w.badgeColor }} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 2: BAZAR DE AMAZON
      ========================================================================= */}
      {activeTab === 'amazon' && (
        <section style={{ marginTop: '1rem' }}>
          {/* Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.55rem',
              marginBottom: '2rem',
            }}
          >
            {AMAZON_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedAmazonCat === cat.id;
              const count =
                cat.id === 'all'
                  ? products.length
                  : products.filter((p) => p.categoria === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedAmazonCat(cat.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.48rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.86rem',
                    fontWeight: isActive ? 700 : 500,
                    border: isActive
                      ? '1.5px solid #f59e0b'
                      : '1px solid var(--border-subtle)',
                    background: isActive
                      ? 'rgba(245, 158, 11, 0.2)'
                      : 'var(--bg-surface)',
                    color: isActive ? '#fbbf24' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 0 15px rgba(245, 158, 11, 0.25)' : 'none',
                  }}
                >
                  <Icon size={14} />
                  <span>{cat.label}</span>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      opacity: 0.85,
                      background: isActive ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255, 255, 255, 0.1)',
                      color: isActive ? '#ffffff' : 'inherit',
                      padding: '0.1rem 0.45rem',
                      borderRadius: '10px',
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Amazon Products Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {filteredProducts.map((p) => {
              const amazonUrl = getAmazonProductUrl(p);

              return (
                <article
                  key={p.id}
                  className="cat-card cat-card-active"
                  style={
                    {
                      '--card-accent': p.color,
                      '--card-glow': `${p.color}33`,
                      '--card-border': `${p.color}55`,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    } as React.CSSProperties
                  }
                >
                  <div className="cat-card-glow-circle" />

                  {/* Thumbnail Wrap */}
                  <div className="cat-card-thumb-wrap" style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={`/images/red/${p.imagen}`}
                      alt={p.titulo}
                      className="cat-card-thumb"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div className="cat-card-thumb-overlay" />
                    
                    {/* Top Tag & Icon */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '0.75rem',
                        left: '0.75rem',
                        right: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        zIndex: 2,
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          background: 'rgba(15, 23, 42, 0.85)',
                          border: `1px solid ${p.color}88`,
                          color: p.color,
                          padding: '0.2rem 0.65rem',
                          borderRadius: '9999px',
                          boxShadow: `0 0 12px ${p.color}40`,
                        }}
                      >
                        {p.etiqueta}
                      </span>
                      <span
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'rgba(0, 0, 0, 0.55)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(8px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.1rem',
                        }}
                      >
                        {p.icono}
                      </span>
                    </div>
                  </div>

                  {/* Product Body */}
                  <div className="cat-card-body" style={{ padding: '1.25rem 1.35rem 1.4rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.categoriaNombre}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.78rem', color: '#fbbf24' }}>
                        <Star size={12} fill="#fbbf24" /> {p.estrellas} ({p.resenas})
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.45rem', lineHeight: 1.35 }}>
                      {p.titulo}
                    </h3>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1.25rem', flex: 1 }}>
                      {p.descripcion}
                    </p>

                    {/* Amazon Buy Button */}
                    <a
                      href={amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.92rem',
                        textDecoration: 'none',
                        boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.55)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.35)';
                      }}
                    >
                      <span>Ver en Amazon</span>
                      <ExternalLink size={15} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Amazon Affiliate Disclaimer Footer */}
          <div
            style={{
              marginTop: '3.5rem',
              padding: '1.25rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '12px',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0 }}>
              📌 <strong>Aviso de Afiliación:</strong> En calidad de Afiliado de Amazon, podemos obtener ingresos por las compras adscritas que cumplen los requisitos aplicables. Los precios y disponibilidad de los productos son orientativos y corresponden al momento de la publicación.
            </p>
          </div>
        </section>
      )}

      {/* =========================================================================
          SUBMIT WEB MODAL
      ========================================================================= */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            style={{
              background: 'linear-gradient(180deg, #131b2e 0%, #0b0f19 100%)',
              border: '1.5px solid rgba(59, 130, 246, 0.45)',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(59, 130, 246, 0.2)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: 'var(--text-secondary)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>

            {!formSubmitted ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgba(59, 130, 246, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                    }}
                  >
                    🚀
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                      Publica tu Web o Proyecto
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                      Envía los datos de tu sitio o contáctanos directamente en{' '}
                      <a href="mailto:consultasydudasvarias@hotmail.com" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
                        consultasydudasvarias@hotmail.com
                      </a>
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmitWeb} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.35rem' }}>
                      Nombre de la Web / Proyecto *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Mi Rincón Creativo"
                      value={formData.webName}
                      onChange={(e) => setFormData({ ...formData, webName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.9rem',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.35rem' }}>
                      URL del Sitio Web *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://tudominio.com"
                      value={formData.webUrl}
                      onChange={(e) => setFormData({ ...formData, webUrl: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.9rem',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.35rem' }}>
                      Tu Email de Contacto *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tuemail@ejemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.9rem',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.35rem' }}>
                      Modalidad deseada
                    </label>
                    <select
                      value={formData.plan}
                      onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.9rem',
                        borderRadius: '8px',
                        background: '#1e293b',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                      }}
                    >
                      <option value="Propuesta Estándar (Revisión Comunitaria)">🌟 Propuesta Estándar (Revisión Comunitaria)</option>
                      <option value="Enlace Patrocinado / Destacado">💎 Enlace Patrocinado / Destacado</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.35rem' }}>
                      Breve descripción de la web
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Explica en 1 o 2 frases de qué trata tu página y por qué le gustará a nuestros visitantes..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.9rem',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        fontSize: '0.88rem',
                        resize: 'none',
                      }}
                    />
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                    🔒 Tu propuesta viajará de forma segura mediante Web3Forms directo a nuestra bandeja oficial:{' '}
                    <em>consultasydudasvarias@hotmail.com</em>.
                  </p>

                  {errorMessage && (
                    <div
                      style={{
                        color: '#f87171',
                        fontSize: '0.85rem',
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        padding: '0.6rem 0.8rem',
                        textAlign: 'center',
                      }}
                    >
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      marginTop: '0.35rem',
                      padding: '0.8rem',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      border: 'none',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting ? 0.75 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.45)',
                    }}
                  >
                    <Send size={16} />
                    <span>{isSubmitting ? 'Transmitiendo propuesta...' : 'Enviar Propuesta'}</span>
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle2 size={56} style={{ color: '#10b981', margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
                  ¡Propuesta Recibida con Éxito!
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Hemos recibido los datos de <strong>{formData.webName}</strong> en nuestro buzón oficial (<em>consultasydudasvarias@hotmail.com</em>). Revisaremos tu sitio y nos pondremos en contacto al correo <strong>{formData.email}</strong> para confirmar su inclusión en el escaparate.
                </p>
                <button
                  onClick={resetForm}
                  style={{
                    padding: '0.65rem 1.5rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
