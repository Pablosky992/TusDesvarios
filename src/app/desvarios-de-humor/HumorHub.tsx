'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Copy,
  Check,
  Shuffle,
  RefreshCw,
  Zap,
  Lightbulb,
  Wand2,
  Compass,
} from 'lucide-react';
import {
  AmbitoExcusa,
  GravedadExcusa,
  TonoExcusa,
  ExcusaItem,
  PrediccionOraculo,
  LeyItem,
  PensamientoItem,
} from '@/lib/humor';

interface HumorHubProps {
  ambitos: AmbitoExcusa[];
  gravedades: GravedadExcusa[];
  tonos: TonoExcusa[];
  catalogoExcusas: ExcusaItem[];
  prediccionesOraculo: PrediccionOraculo[];
  leyes: LeyItem[];
  pensamientos: PensamientoItem[];
}

type MachineTab = 'excusas' | 'oraculo' | 'leyes' | 'pensamientos';

export default function HumorHub({
  ambitos,
  gravedades,
  tonos,
  catalogoExcusas,
  prediccionesOraculo,
  leyes,
  pensamientos,
}: HumorHubProps) {
  // Main Tab Navigation
  const [activeTab, setActiveTab] = useState<MachineTab>('excusas');

  // ─── 1. MÁQUINA DE EXCUSAS STATE ─────────────────────────────
  const [selectedAmbito, setSelectedAmbito] = useState<string>(ambitos[0]?.id || 'trabajo');
  const [selectedGravedad, setSelectedGravedad] = useState<string>('leve');
  const [selectedTono, setSelectedTono] = useState<string>('formal');
  const [copiedExcusa, setCopiedExcusa] = useState<boolean>(false);
  const [isGeneratingExcusa, setIsGeneratingExcusa] = useState<boolean>(false);
  const [hasGeneratedExcusa, setHasGeneratedExcusa] = useState<boolean>(false);
  const [currentVariantIdx, setCurrentVariantIdx] = useState<number>(0);
  const [totalVariants, setTotalVariants] = useState<number>(1);
  const [activeExcusa, setActiveExcusa] = useState<ExcusaItem | null>(null);

  const generateNewExcusa = () => {
    setIsGeneratingExcusa(true);
    setTimeout(() => {
      const matches = catalogoExcusas.filter(
        (e) => e.ambito === selectedAmbito && e.gravedad === selectedGravedad && e.tono === selectedTono
      );

      const pool = matches.length > 0
        ? matches
        : catalogoExcusas.filter((e) => e.ambito === selectedAmbito && e.gravedad === selectedGravedad);

      const finalPool = pool.length > 0 ? pool : catalogoExcusas.filter((e) => e.ambito === selectedAmbito);
      const safePool = finalPool.length > 0 ? finalPool : catalogoExcusas;

      const nextIdx = (currentVariantIdx + 1) % safePool.length;
      setCurrentVariantIdx(nextIdx);
      setTotalVariants(safePool.length);
      setActiveExcusa(safePool[nextIdx]);
      setHasGeneratedExcusa(true);
      setIsGeneratingExcusa(false);
    }, 280);
  };

  const handleCopyExcusa = () => {
    if (!activeExcusa) return;
    navigator.clipboard.writeText(activeExcusa.texto);
    setCopiedExcusa(true);
    setTimeout(() => setCopiedExcusa(false), 2000);
  };

  const handleRandomExcusa = () => {
    const rAmb = ambitos[Math.floor(Math.random() * ambitos.length)].id;
    const rGrav = gravedades[Math.floor(Math.random() * gravedades.length)].id;
    const rTon = tonos[Math.floor(Math.random() * tonos.length)].id;
    setSelectedAmbito(rAmb);
    setSelectedGravedad(rGrav);
    setSelectedTono(rTon);

    setIsGeneratingExcusa(true);
    setTimeout(() => {
      const matches = catalogoExcusas.filter(
        (e) => e.ambito === rAmb && e.gravedad === rGrav && e.tono === rTon
      );
      const safePool = matches.length > 0 ? matches : catalogoExcusas;
      const randIdx = Math.floor(Math.random() * safePool.length);
      setCurrentVariantIdx(randIdx);
      setTotalVariants(safePool.length);
      setActiveExcusa(safePool[randIdx]);
      setHasGeneratedExcusa(true);
      setIsGeneratingExcusa(false);
    }, 280);
  };

  // ─── 2. ORÁCULO DEL DESVARÍO STATE (DIRECT PREDICTIONS) ───────
  const [isGeneratingOraculo, setIsGeneratingOraculo] = useState<boolean>(false);
  const [hasGeneratedOraculo, setHasGeneratedOraculo] = useState<boolean>(false);
  const [currentOraculoIdx, setCurrentOraculoIdx] = useState<number>(0);
  const [copiedOraculo, setCopiedOraculo] = useState<boolean>(false);

  const activePrediccion = prediccionesOraculo[currentOraculoIdx % prediccionesOraculo.length] || prediccionesOraculo[0];

  const handleConsultarOraculo = () => {
    setIsGeneratingOraculo(true);
    setTimeout(() => {
      const next = Math.floor(Math.random() * prediccionesOraculo.length);
      setCurrentOraculoIdx(next === currentOraculoIdx ? (next + 1) % prediccionesOraculo.length : next);
      setHasGeneratedOraculo(true);
      setIsGeneratingOraculo(false);
    }, 320);
  };

  const handleCopyOraculo = () => {
    if (!activePrediccion) return;
    const textToCopy = `✦ ${activePrediccion.titulo} ✦\n"${activePrediccion.veredicto}"\n${activePrediccion.razon}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedOraculo(true);
    setTimeout(() => setCopiedOraculo(false), 2000);
  };

  // ─── 3. LEYES DEL CAOS STATE (DIRECT RANDOM LAWS) ────────────
  const [isGeneratingLey, setIsGeneratingLey] = useState<boolean>(false);
  const [hasGeneratedLey, setHasGeneratedLey] = useState<boolean>(false);
  const [currentLeyIdx, setCurrentLeyIdx] = useState<number>(0);
  const [copiedLey, setCopiedLey] = useState<boolean>(false);

  const activeLey = leyes[currentLeyIdx % leyes.length] || leyes[0];

  const handleRevelarLey = () => {
    setIsGeneratingLey(true);
    setTimeout(() => {
      const next = Math.floor(Math.random() * leyes.length);
      setCurrentLeyIdx(next === currentLeyIdx ? (next + 1) % leyes.length : next);
      setHasGeneratedLey(true);
      setIsGeneratingLey(false);
    }, 280);
  };

  const handleCopyLey = () => {
    if (!activeLey) return;
    const textToCopy = `✦ LEY DEL CAOS #${activeLey.numero}: ${activeLey.nombre} ✦\n"${activeLey.descripcion}"\n💡 Consejo: ${activeLey.consejo}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedLey(true);
    setTimeout(() => setCopiedLey(false), 2000);
  };

  // ─── 4. PENSAMIENTOS DE DUCHA STATE (CLEAN RANDOM THOUGHTS) ───
  const [isGeneratingThought, setIsGeneratingThought] = useState<boolean>(false);
  const [hasGeneratedThought, setHasGeneratedThought] = useState<boolean>(false);
  const [currentThoughtIdx, setCurrentThoughtIdx] = useState<number>(0);
  const [copiedThought, setCopiedThought] = useState<boolean>(false);

  const activeThought = pensamientos[currentThoughtIdx % pensamientos.length] || pensamientos[0];

  const handleRevelarThought = () => {
    setIsGeneratingThought(true);
    setTimeout(() => {
      const next = Math.floor(Math.random() * pensamientos.length);
      setCurrentThoughtIdx(next === currentThoughtIdx ? (next + 1) % pensamientos.length : next);
      setHasGeneratedThought(true);
      setIsGeneratingThought(false);
    }, 280);
  };

  const handleCopyThought = () => {
    if (!activeThought) return;
    const textToCopy = `✦ ${activeThought.titulo} ✦\n"${activeThought.contenido}"\n— ${activeThought.autor}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedThought(true);
    setTimeout(() => setCopiedThought(false), 2000);
  };

  return (
    <div className="home-container" style={{ maxWidth: '1220px', padding: '0 1.25rem 4rem' }}>
      {/* ─── Hero Header ─────────────────────────────────────────── */}
      <section className="portal-hero" style={{ padding: '1.5rem 0 2rem' }}>
        <div
          className="hero-badge"
          style={{
            borderColor: 'rgba(236, 72, 153, 0.45)',
            background: 'rgba(236, 72, 153, 0.12)',
            color: '#f472b6',
            fontSize: '0.92rem',
            padding: '0.45rem 1.15rem',
            marginBottom: '1.25rem',
          }}
        >
          <Sparkles size={16} />
          <span>Consola Interactiva del Absurdo & Sátira Cotidiana</span>
        </div>

        <h1 className="portal-title" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Desvaríos de <span style={{ color: '#ec4899', textShadow: '0 0 35px rgba(236,72,153,0.55)' }}>Humor</span>
        </h1>

        <p className="portal-description" style={{ maxWidth: '820px', fontSize: '1.15rem', lineHeight: 1.7, margin: '0 auto 2rem' }}>
          Configura tus parámetros y pulsa los generadores para calcular coartadas, consultar predicciones cósmicas, descubrir las leyes del caos y reflexionar con pensamientos de ducha.
        </p>

        {/* ─── Top Dynamic Machine Selector Tabs (Larger & More Prominent) ─── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.75rem',
            marginTop: '1.5rem',
          }}
        >
          {[
            { id: 'excusas', label: 'Máquina de Excusas', icon: '🎩', color: '#ec4899' },
            { id: 'oraculo', label: 'Oráculo del Desvarío', icon: '🔮', color: '#a855f7' },
            { id: 'leyes', label: 'Leyes del Caos', icon: '📜', color: '#f59e0b' },
            { id: 'pensamientos', label: 'Pensamientos de Ducha', icon: '🚿', color: '#10b981' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as MachineTab)}
                style={{
                  padding: '0.75rem 1.45rem',
                  borderRadius: 'var(--radius-full)',
                  border: `2px solid ${isActive ? tab.color : 'rgba(255, 255, 255, 0.12)'}`,
                  background: isActive ? `${tab.color}25` : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  boxShadow: isActive ? `0 0 24px ${tab.color}50` : 'none',
                  transform: isActive ? 'scale(1.03)' : 'scale(1)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MÁQUINA 1: GENERADOR DE EXCUSAS (EXPANDIDO & DETALLADO)
      ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'excusas' && (
        <section
          style={{
            marginTop: '1.25rem',
            padding: '3rem 2.5rem',
            background: 'linear-gradient(180deg, rgba(28, 18, 36, 0.94) 0%, rgba(15, 18, 30, 0.96) 100%)',
            border: '2px solid rgba(236, 72, 153, 0.45)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 16px 50px rgba(0,0,0,0.6), 0 0 45px rgba(236,72,153,0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.25rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(236, 72, 153, 0.15)', border: '1.5px solid rgba(236, 72, 153, 0.5)', boxShadow: '0 0 20px rgba(236,72,153,0.35)' }}>
                <span style={{ fontSize: '2.4rem' }}>🎩</span>
              </div>
              <div>
                <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
                  La Máquina de Excusas con Medidor de Verosimilitud
                </h2>
                <p style={{ fontSize: '1.02rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>
                  Configura tus 3 parámetros clave y pulsa el botón para calcular una coartada infalible
                </p>
              </div>
            </div>

            <button
              onClick={handleRandomExcusa}
              className="btn-secondary"
              style={{ fontSize: '0.95rem', padding: '0.65rem 1.25rem', gap: '0.5rem' }}
            >
              <Shuffle size={16} style={{ color: '#ec4899' }} />
              <span>Ruleta Aleatoria</span>
            </button>
          </div>

          {/* Selectors Grid: 3 Clean, Large Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.75rem', marginBottom: '2.5rem' }}>
            {/* 1. Ámbito */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.92rem', fontWeight: 800, color: '#f472b6', textTransform: 'uppercase', marginBottom: '0.85rem', letterSpacing: '0.06em' }}>
                <span>1. Ámbito de la Crisis</span>
                <span style={{ fontSize: '0.78rem', background: 'rgba(236,72,153,0.18)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>{ambitos.length}</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {ambitos.map((amb) => {
                  const isSel = selectedAmbito === amb.id;
                  return (
                    <button
                      key={amb.id}
                      onClick={() => setSelectedAmbito(amb.id)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        fontSize: '1rem',
                        padding: '0.75rem 1.1rem',
                        borderRadius: 'var(--radius-sm)',
                        background: isSel ? 'rgba(236, 72, 153, 0.25)' : 'rgba(255,255,255,0.03)',
                        border: `2px solid ${isSel ? '#ec4899' : 'rgba(255,255,255,0.08)'}`,
                        color: isSel ? '#ffffff' : 'var(--text-secondary)',
                        fontWeight: isSel ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        boxShadow: isSel ? '0 0 16px rgba(236,72,153,0.35)' : 'none',
                        transition: 'all 0.16s ease',
                      }}
                    >
                      <span style={{ fontSize: '1.3rem' }}>{amb.icono}</span>
                      <span>{amb.nombre}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Gravedad */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.92rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.85rem', letterSpacing: '0.06em' }}>
                <span>2. Nivel de Gravedad</span>
                <span style={{ fontSize: '0.78rem', background: 'rgba(56,189,248,0.18)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>{gravedades.length}</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {gravedades.map((grav) => {
                  const isSel = selectedGravedad === grav.id;
                  return (
                    <button
                      key={grav.id}
                      onClick={() => setSelectedGravedad(grav.id)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        fontSize: '1rem',
                        padding: '0.75rem 1.1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: `2px solid ${isSel ? grav.color : 'rgba(255,255,255,0.08)'}`,
                        background: isSel ? `${grav.color}25` : 'rgba(255,255,255,0.03)',
                        color: isSel ? '#ffffff' : 'var(--text-secondary)',
                        fontWeight: isSel ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        boxShadow: isSel ? `0 0 16px ${grav.color}40` : 'none',
                        transition: 'all 0.16s ease',
                      }}
                    >
                      <span style={{ fontSize: '1.3rem' }}>{grav.icono}</span>
                      <span>{grav.nombre}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Tono */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.92rem', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', marginBottom: '0.85rem', letterSpacing: '0.06em' }}>
                <span>3. Tono Retórico</span>
                <span style={{ fontSize: '0.78rem', background: 'rgba(192,132,252,0.18)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>{tonos.length}</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {tonos.map((tono) => {
                  const isSel = selectedTono === tono.id;
                  return (
                    <button
                      key={tono.id}
                      onClick={() => setSelectedTono(tono.id)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        fontSize: '1rem',
                        padding: '0.75rem 1.1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: `2px solid ${isSel ? '#f472b6' : 'rgba(255,255,255,0.08)'}`,
                        background: isSel ? 'rgba(236,72,153,0.25)' : 'rgba(255,255,255,0.03)',
                        color: isSel ? '#ffffff' : 'var(--text-secondary)',
                        fontWeight: isSel ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        boxShadow: isSel ? '0 0 16px rgba(236,72,153,0.35)' : 'none',
                        transition: 'all 0.16s ease',
                      }}
                    >
                      <span style={{ fontSize: '1.3rem' }}>{tono.icono}</span>
                      <span>{tono.nombre}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* LARGE ACTION GENERATE BUTTON */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <button
              onClick={generateNewExcusa}
              className="btn-primary"
              disabled={isGeneratingExcusa}
              style={{
                fontSize: '1.2rem',
                padding: '1rem 3rem',
                background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                boxShadow: '0 8px 35px rgba(236, 72, 153, 0.65)',
                cursor: isGeneratingExcusa ? 'wait' : 'pointer',
                borderRadius: 'var(--radius-full)',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <Wand2 size={24} />
              <span>{isGeneratingExcusa ? 'Calibrando Coartada Perfecta...' : '✨ Generar Excusa'}</span>
            </button>
          </div>

          {/* Dynamic Large Output Card */}
          {hasGeneratedExcusa && activeExcusa && (
            <div
              style={{
                padding: '2.5rem 2.25rem',
                background: 'rgba(10, 14, 25, 0.95)',
                border: '2px dashed rgba(236, 72, 153, 0.6)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 12px 45px rgba(0,0,0,0.65), 0 0 30px rgba(236,72,153,0.2)',
                animation: 'fadeIn 0.3s ease',
                maxWidth: '960px',
                margin: '0 auto',
              }}
            >
              {/* Credibility Meter Bar (Large & Prominent) */}
              <div style={{ marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Zap size={18} style={{ color: '#fbbf24' }} />
                    Medidor de Credibilidad & Verosimilitud:
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#f472b6', background: 'rgba(236,72,153,0.2)', border: '1px solid rgba(236,72,153,0.4)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontWeight: 800 }}>
                      Variante {currentVariantIdx + 1} de {totalVariants}
                    </span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: activeExcusa.credibilidad > 75 ? '#34d399' : activeExcusa.credibilidad > 50 ? '#fbbf24' : '#f87171' }}>
                      {activeExcusa.credibilidad}% {activeExcusa.credibilidad > 75 ? '🟢 Alta Fiabilidad' : activeExcusa.credibilidad > 50 ? '🟡 Nivel Medio' : '🔴 Zona de Riesgo'}
                    </span>
                  </div>
                </div>
                <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden', padding: '2px' }}>
                  <div
                    style={{
                      width: `${activeExcusa.credibilidad}%`,
                      height: '100%',
                      background: activeExcusa.credibilidad > 75 ? 'linear-gradient(90deg, #10b981, #34d399)' : activeExcusa.credibilidad > 50 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #ef4444, #f87171)',
                      borderRadius: '999px',
                      boxShadow: '0 0 12px rgba(255,255,255,0.3)',
                      transition: 'width 0.45s ease',
                    }}
                  />
                </div>
              </div>

              {/* Excuse Main Text (Huge & Impactful) */}
              <div style={{ fontSize: '1.35rem', lineHeight: 1.75, color: '#ffffff', fontStyle: 'italic', marginBottom: '1.75rem', padding: '1rem 1.5rem', background: 'rgba(236,72,153,0.08)', borderLeft: '5px solid #ec4899', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                &ldquo;{activeExcusa.texto}&rdquo;
              </div>

              {/* Advice Box & Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', fontSize: '1rem', color: '#fbbf24', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245,158,11,0.3)', padding: '0.6rem 1.15rem', borderRadius: 'var(--radius-sm)', maxWidth: '620px' }}>
                  <Lightbulb size={18} style={{ flexShrink: 0 }} />
                  <span><strong>Consejo de Ejecución:</strong> {activeExcusa.consejo}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={generateNewExcusa}
                    className="btn-secondary"
                    style={{ fontSize: '0.95rem', padding: '0.65rem 1.25rem' }}
                  >
                    <RefreshCw size={16} />
                    <span>🔄 Otra Variante</span>
                  </button>

                  <button
                    onClick={handleCopyExcusa}
                    className="btn-primary"
                    style={{
                      background: copiedExcusa
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                      boxShadow: copiedExcusa
                        ? '0 6px 20px rgba(16, 185, 129, 0.5)'
                        : '0 6px 20px rgba(236, 72, 153, 0.5)',
                      fontSize: '0.95rem',
                      padding: '0.65rem 1.45rem',
                    }}
                  >
                    {copiedExcusa ? <Check size={17} /> : <Copy size={17} />}
                    <span>{copiedExcusa ? '¡Copiada!' : 'Copiar Excusa'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {!hasGeneratedExcusa && (
            <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(236,72,153,0.3)', borderRadius: 'var(--radius-md)', maxWidth: '720px', margin: '0 auto' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>💡</span>
              <p style={{ fontSize: '1.08rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                Selecciona tus 3 opciones arriba y haz clic en <strong>&ldquo;✨ Generar Excusa&rdquo;</strong> para calcular tu justificación personalizada lista para usar.
              </p>
            </div>
          )}
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MÁQUINA 2: EL ORÁCULO DEL DESVARÍO (EXPANDIDO & DETALLADO)
      ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'oraculo' && (
        <section
          style={{
            marginTop: '1.25rem',
            padding: '3.5rem 2.5rem',
            background: 'linear-gradient(180deg, rgba(30, 20, 52, 0.95) 0%, rgba(14, 16, 32, 0.98) 100%)',
            border: '2px solid rgba(168, 85, 247, 0.55)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 16px 50px rgba(0,0,0,0.65), 0 0 45px rgba(168,85,247,0.25)',
            textAlign: 'center',
          }}
        >
          {/* Oracle Header Emblem (Huge & Glowing) */}
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '88px', height: '88px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(168, 85, 247, 0.05) 70%)', border: '2px solid rgba(168, 85, 247, 0.7)', boxShadow: '0 0 35px rgba(168,85,247,0.5)', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '3rem' }}>🔮</span>
          </div>

          <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.65rem', textShadow: '0 0 30px rgba(168,85,247,0.5)', letterSpacing: '-0.01em' }}>
            El Oráculo del Desvarío
          </h2>
          <p style={{ fontSize: '1.12rem', color: '#cbd5e1', maxWidth: '720px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Sin formularios ni decisiones que tomar. Consulta directamente la sabiduría inapelable del cosmos ante los grandes dilemas del absurdo cotidiano.
          </p>

          {/* MAIN DIRECT ORACLE BUTTON */}
          <div style={{ marginBottom: '2.75rem' }}>
            <button
              onClick={handleConsultarOraculo}
              className="btn-primary"
              disabled={isGeneratingOraculo}
              style={{
                fontSize: '1.2rem',
                padding: '1rem 3rem',
                background: 'linear-gradient(135deg, #a855f7 0%, #6d28d9 100%)',
                boxShadow: '0 8px 35px rgba(168, 85, 247, 0.65)',
                cursor: isGeneratingOraculo ? 'wait' : 'pointer',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                border: 'none',
                fontWeight: 800,
              }}
            >
              <Sparkles size={22} />
              <span>{isGeneratingOraculo ? 'Alineando Constelaciones...' : '🔮 Revelar Predicción Cósmica'}</span>
            </button>
          </div>

          {/* Direct Prophecy Output Card (Large & High Detail) */}
          {hasGeneratedOraculo && activePrediccion && (
            <div
              style={{
                padding: '2.75rem 2.5rem',
                background: 'rgba(11, 14, 28, 0.96)',
                border: '2px solid rgba(168, 85, 247, 0.65)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 16px 50px rgba(0,0,0,0.7), 0 0 35px rgba(168,85,247,0.3)',
                textAlign: 'left',
                animation: 'fadeIn 0.3s ease',
                maxWidth: '960px',
                margin: '0 auto',
              }}
            >
              {/* Header Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '1.5rem', paddingBottom: '1.15rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.8rem' }}>{activePrediccion.icono}</span>
                  <span style={{ fontSize: '1rem', fontWeight: 900, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {activePrediccion.titulo}
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#e9d5ff', background: 'rgba(168,85,247,0.22)', border: '1px solid rgba(168,85,247,0.4)', padding: '0.3rem 0.85rem', borderRadius: 'var(--radius-full)', fontWeight: 800 }}>
                  Acierto: {activePrediccion.probabilidad}
                </div>
              </div>

              {/* Question / Dilemma */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '1.05rem', color: '#94a3b8', fontStyle: 'italic', marginBottom: '1.35rem' }}>
                <span style={{ fontSize: '1.2rem' }}>❓</span>
                <span><strong>Dilema Cósmico Consultado:</strong> {activePrediccion.dilema}</span>
              </div>

              {/* Bold Verdict Banner */}
              <div style={{ padding: '1.35rem 1.65rem', background: 'rgba(168, 85, 247, 0.16)', borderLeft: '6px solid #a855f7', borderRadius: '0 var(--radius-md) var(--radius-md) 0', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                  ✦ SENTENCIA Y VEREDICTO INAPELABLE ✦
                </div>
                <h3 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff', margin: 0, textShadow: '0 0 20px rgba(168,85,247,0.5)', lineHeight: 1.4 }}>
                  &ldquo;{activePrediccion.veredicto}&rdquo;
                </h3>
              </div>

              {/* Prophecy Details */}
              <p style={{ fontSize: '1.18rem', color: '#e2e8f0', lineHeight: 1.8, marginBottom: '1.75rem' }}>
                {activePrediccion.razon}
              </p>

              {/* Affinity & Advice */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginBottom: '2rem', padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.98rem', color: '#fbbf24', lineHeight: 1.6 }}>
                  <strong>💡 Consejo Divino:</strong> {activePrediccion.consejo}
                </div>
                <div style={{ fontSize: '0.98rem', color: '#38bdf8', lineHeight: 1.6 }}>
                  <strong>🌌 Afinidad Astral:</strong> {activePrediccion.signoAfin}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '0.85rem' }}>
                <button
                  onClick={handleConsultarOraculo}
                  className="btn-secondary"
                  style={{ fontSize: '0.95rem', padding: '0.65rem 1.25rem' }}
                >
                  <RefreshCw size={16} />
                  <span>🔄 Otra Predicción Cósmica</span>
                </button>

                <button
                  onClick={handleCopyOraculo}
                  className="btn-primary"
                  style={{
                    background: copiedOraculo
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                    boxShadow: copiedOraculo
                      ? '0 6px 20px rgba(16, 185, 129, 0.5)'
                      : '0 6px 25px rgba(168, 85, 247, 0.6)',
                    fontSize: '0.95rem',
                    padding: '0.65rem 1.45rem',
                  }}
                >
                  {copiedOraculo ? <Check size={17} /> : <Copy size={17} />}
                  <span>{copiedOraculo ? '¡Profecía Copiada!' : 'Copiar Sentencia'}</span>
                </button>
              </div>
            </div>
          )}

          {!hasGeneratedOraculo && (
            <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(168,85,247,0.35)', borderRadius: 'var(--radius-md)', maxWidth: '720px', margin: '0 auto' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>✨</span>
              <p style={{ fontSize: '1.08rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                Pulsa <strong>&ldquo;Revelar Predicción Cósmica&rdquo;</strong> arriba para que el oráculo examine las vibraciones del momento y emita su veredicto.
              </p>
            </div>
          )}
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MÁQUINA 3: LEYES DEL CAOS (EXPANDIDO & DETALLADO)
      ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'leyes' && (
        <section
          style={{
            marginTop: '1.25rem',
            padding: '3.5rem 2.5rem',
            background: 'linear-gradient(180deg, rgba(38, 28, 16, 0.95) 0%, rgba(18, 15, 28, 0.98) 100%)',
            border: '2px solid rgba(245, 158, 11, 0.55)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 16px 50px rgba(0,0,0,0.65), 0 0 45px rgba(245,158,11,0.25)',
            textAlign: 'center',
          }}
        >
          {/* Chaos Header Emblem (Huge & Glowing) */}
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '88px', height: '88px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, rgba(245, 158, 11, 0.05) 70%)', border: '2px solid rgba(245, 158, 11, 0.7)', boxShadow: '0 0 35px rgba(245,158,11,0.5)', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '3rem' }}>📜</span>
          </div>

          <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.65rem', textShadow: '0 0 30px rgba(245,158,11,0.5)', letterSpacing: '-0.01em' }}>
            Leyes del Caos & Principios de Murphy
          </h2>
          <p style={{ fontSize: '1.12rem', color: '#cbd5e1', maxWidth: '720px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            El universo conspira con precisión matemática en los momentos más inoportunos. Pulsa el botón para revelar una ley universal del absurdo cotidiano.
          </p>

          {/* MAIN DIRECT LAW BUTTON */}
          <div style={{ marginBottom: '2.75rem' }}>
            <button
              onClick={handleRevelarLey}
              className="btn-primary"
              disabled={isGeneratingLey}
              style={{
                fontSize: '1.2rem',
                padding: '1rem 3rem',
                background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
                boxShadow: '0 8px 35px rgba(245, 158, 11, 0.65)',
                cursor: isGeneratingLey ? 'wait' : 'pointer',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                border: 'none',
                fontWeight: 800,
              }}
            >
              <Zap size={22} />
              <span>{isGeneratingLey ? 'Consultando el Caos...' : '📜 Revelar Ley del Caos'}</span>
            </button>
          </div>

          {/* Direct Law Output Card (Large & High Detail) */}
          {hasGeneratedLey && activeLey && (
            <div
              style={{
                padding: '2.75rem 2.5rem',
                background: 'rgba(12, 14, 28, 0.96)',
                border: '2px solid rgba(245, 158, 11, 0.65)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 16px 50px rgba(0,0,0,0.7), 0 0 35px rgba(245,158,11,0.3)',
                textAlign: 'left',
                animation: 'fadeIn 0.3s ease',
                maxWidth: '960px',
                margin: '0 auto',
              }}
            >
              {/* Header Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '1.5rem', paddingBottom: '1.15rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.8rem' }}>{activeLey.icono}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#fbbf24', background: 'rgba(245, 158, 11, 0.22)', border: '1px solid rgba(245,158,11,0.4)', padding: '0.3rem 0.85rem', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    LEY #{activeLey.numero}
                  </span>
                  <span style={{ fontSize: '0.95rem', color: '#94a3b8', fontWeight: 700 }}>
                    {activeLey.categoria}
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#fca5a5', background: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.35)', padding: '0.3rem 0.85rem', borderRadius: 'var(--radius-full)', fontWeight: 800 }}>
                  Probabilidad: {activeLey.probabilidad}
                </div>
              </div>

              {/* Law Name */}
              <h3 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff', marginBottom: '1.15rem', lineHeight: 1.4 }}>
                {activeLey.nombre}
              </h3>

              {/* Law Description */}
              <p style={{ fontSize: '1.18rem', color: '#e2e8f0', lineHeight: 1.8, marginBottom: '1.75rem' }}>
                {activeLey.descripcion}
              </p>

              {/* Survival Advice Box */}
              <div style={{ padding: '1.15rem 1.5rem', background: 'rgba(245, 158, 11, 0.15)', borderLeft: '5px solid #f59e0b', borderRadius: '0 var(--radius-md) var(--radius-md) 0', marginBottom: '2rem' }}>
                <div style={{ fontSize: '1.05rem', color: '#fbbf24', lineHeight: 1.6 }}>
                  <strong>💡 Consejo de Supervivencia:</strong> {activeLey.consejo}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '0.85rem' }}>
                <button
                  onClick={handleRevelarLey}
                  className="btn-secondary"
                  style={{ fontSize: '0.95rem', padding: '0.65rem 1.25rem' }}
                >
                  <RefreshCw size={16} />
                  <span>🔄 Otra Ley del Caos</span>
                </button>

                <button
                  onClick={handleCopyLey}
                  className="btn-primary"
                  style={{
                    background: copiedLey
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    boxShadow: copiedLey
                      ? '0 6px 20px rgba(16, 185, 129, 0.5)'
                      : '0 6px 25px rgba(245, 158, 11, 0.6)',
                    fontSize: '0.95rem',
                    padding: '0.65rem 1.45rem',
                  }}
                >
                  {copiedLey ? <Check size={17} /> : <Copy size={17} />}
                  <span>{copiedLey ? '¡Ley Copiada!' : 'Copiar Ley'}</span>
                </button>
              </div>
            </div>
          )}

          {!hasGeneratedLey && (
            <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(245,158,11,0.35)', borderRadius: 'var(--radius-md)', maxWidth: '720px', margin: '0 auto' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>⚡</span>
              <p style={{ fontSize: '1.08rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                Pulsa <strong>&ldquo;Revelar Ley del Caos&rdquo;</strong> arriba para conocer qué principio físico-satírico está rigiendo tu destino en este momento.
              </p>
            </div>
          )}
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MÁQUINA 4: PENSAMIENTOS DE DUCHA (EXPANDIDO & DETALLADO)
      ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'pensamientos' && (
        <section
          style={{
            marginTop: '1.25rem',
            padding: '3.5rem 2.5rem',
            background: 'linear-gradient(180deg, rgba(16, 36, 28, 0.95) 0%, rgba(12, 18, 30, 0.98) 100%)',
            border: '2px solid rgba(16, 185, 129, 0.55)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 16px 50px rgba(0,0,0,0.65), 0 0 45px rgba(16,185,129,0.25)',
            textAlign: 'center',
          }}
        >
          {/* Shower Emblem (Huge & Glowing) */}
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '88px', height: '88px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(16, 185, 129, 0.05) 70%)', border: '2px solid rgba(16, 185, 129, 0.7)', boxShadow: '0 0 35px rgba(16,185,129,0.5)', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '3rem' }}>🚿</span>
          </div>

          <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.65rem', textShadow: '0 0 30px rgba(16,185,129,0.5)', letterSpacing: '-0.01em' }}>
            Pensamientos de Ducha & Paradojas Cotidianas
          </h2>
          <p style={{ fontSize: '1.12rem', color: '#cbd5e1', maxWidth: '720px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Las ideas más profundas, absurdas e incuestionables de la mente humana surgen bajo el agua caliente. Pulsa el botón para destapar una revelación existencial.
          </p>

          {/* MAIN DIRECT THOUGHT BUTTON */}
          <div style={{ marginBottom: '2.75rem' }}>
            <button
              onClick={handleRevelarThought}
              className="btn-primary"
              disabled={isGeneratingThought}
              style={{
                fontSize: '1.2rem',
                padding: '1rem 3rem',
                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                boxShadow: '0 8px 35px rgba(16, 185, 129, 0.65)',
                cursor: isGeneratingThought ? 'wait' : 'pointer',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                border: 'none',
                fontWeight: 800,
              }}
            >
              <Sparkles size={22} />
              <span>{isGeneratingThought ? 'Abriendo el Grifo Mental...' : '🚿 Revelar Pensamiento de Ducha'}</span>
            </button>
          </div>

          {/* Direct Thought Output Card (Large & High Detail) */}
          {hasGeneratedThought && activeThought && (
            <div
              style={{
                padding: '2.75rem 2.5rem',
                background: 'rgba(11, 15, 28, 0.96)',
                border: '2px solid rgba(16, 185, 129, 0.65)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 16px 50px rgba(0,0,0,0.7), 0 0 35px rgba(16,185,129,0.3)',
                textAlign: 'left',
                animation: 'fadeIn 0.3s ease',
                maxWidth: '960px',
                margin: '0 auto',
              }}
            >
              {/* Header Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '1.5rem', paddingBottom: '1.15rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.8rem' }}>{activeThought.icono || '🚿'}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#34d399', background: 'rgba(16, 185, 129, 0.22)', border: '1px solid rgba(16,185,129,0.4)', padding: '0.3rem 0.85rem', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {activeThought.autor}
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 700 }}>
                  Pensamiento {(currentThoughtIdx % pensamientos.length) + 1} de {pensamientos.length}
                </div>
              </div>

              {/* Thought Title */}
              <h3 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff', marginBottom: '1.15rem', lineHeight: 1.4 }}>
                {activeThought.titulo}
              </h3>

              {/* Thought Content */}
              <p style={{ fontSize: '1.25rem', color: '#e2e8f0', lineHeight: 1.85, fontStyle: 'italic', marginBottom: '2rem', padding: '1rem 1.5rem', background: 'rgba(16,185,129,0.08)', borderLeft: '5px solid #10b981', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                &ldquo;{activeThought.contenido}&rdquo;
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '0.85rem' }}>
                <button
                  onClick={handleRevelarThought}
                  className="btn-secondary"
                  style={{ fontSize: '0.95rem', padding: '0.65rem 1.25rem' }}
                >
                  <RefreshCw size={16} />
                  <span>🔄 Otro Pensamiento</span>
                </button>

                <button
                  onClick={handleCopyThought}
                  className="btn-primary"
                  style={{
                    background: copiedThought
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                    boxShadow: copiedThought
                      ? '0 6px 20px rgba(16, 185, 129, 0.5)'
                      : '0 6px 25px rgba(16, 185, 129, 0.6)',
                    fontSize: '0.95rem',
                    padding: '0.65rem 1.45rem',
                  }}
                >
                  {copiedThought ? <Check size={17} /> : <Copy size={17} />}
                  <span>{copiedThought ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          )}

          {!hasGeneratedThought && (
            <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(16,185,129,0.35)', borderRadius: 'var(--radius-md)', maxWidth: '720px', margin: '0 auto' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>🚿</span>
              <p style={{ fontSize: '1.08rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                Pulsa <strong>&ldquo;Revelar Pensamiento de Ducha&rdquo;</strong> arriba para que el chorro de agua caliente destape una paradoja existencial.
              </p>
            </div>
          )}
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SECCIÓN EDITORIAL SEO & GUÍA DE SÁTIRA COTIDIANA
      ═══════════════════════════════════════════════════════════ */}
      <section
        style={{
          marginTop: '4rem',
          padding: '2.5rem 1.75rem',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.55)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '1.75rem' }}>🎭</span>
          <div>
            <h2
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#ffffff',
                fontFamily: 'var(--font-display, Cinzel, serif)',
                margin: 0,
              }}
            >
              Guía de Supervivencia Urbana: Máquinas de Humor y Caos
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
              El arte de la coartada perfecta, la entropía cotidiana y las epifanías bajo el agua caliente.
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          <div
            style={{
              padding: '1.35rem',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(236,72,153,0.25)',
            }}
          >
            <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>🎩</div>
            <h3
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#f472b6',
                marginBottom: '0.45rem',
                fontFamily: 'var(--font-display, Cinzel, serif)',
              }}
            >
              Generador de Excusas & Coartadas
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Algoritmo de calibración retórica con 8 ámbitos cotidianos (trabajo, pareja, salidas, familia, WhatsApp y universidad), 3 niveles de gravedad y 6 tonos satíricos con medidor porcentual de credibilidad.
            </p>
          </div>

          <div
            style={{
              padding: '1.35rem',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(168,85,247,0.25)',
            }}
          >
            <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>🔮</div>
            <h3
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#c084fc',
                marginBottom: '0.45rem',
                fontFamily: 'var(--font-display, Cinzel, serif)',
              }}
            >
              Oráculo del Desvarío
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Consultor cuántico para dilemas cotidianos: desde si deberías enviar ese mensaje a las 3 AM hasta si es prudente comprar un billete de avión sin mirar la cuenta bancaria.
            </p>
          </div>

          <div
            style={{
              padding: '1.35rem',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(245,158,11,0.25)',
            }}
          >
            <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>📜</div>
            <h3
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#fbbf24',
                marginBottom: '0.45rem',
                fontFamily: 'var(--font-display, Cinzel, serif)',
              }}
            >
              Leyes del Caos & Murphy
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Axiomas irrefutables de la mala suerte moderna: las impresoras huelen el miedo, el paraguas atrae el cielo despejado y la batería se agota justo al pedir el taxi.
            </p>
          </div>

          <div
            style={{
              padding: '1.35rem',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(16,185,129,0.25)',
            }}
          >
            <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>🚿</div>
            <h3
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#34d399',
                marginBottom: '0.45rem',
                fontFamily: 'var(--font-display, Cinzel, serif)',
              }}
            >
              Pensamientos de Ducha
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Reflexiones lúcidas y verdades incómodas generadas en el único templo de paz mental que le queda a la humanidad contemporánea: la ducha de agua caliente.
            </p>
          </div>
        </div>

        {/* Muestrario de Coartadas Indexables */}
        <div
          style={{
            marginBottom: '2.5rem',
            padding: '1.5rem',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>💡</span> <span>Muestrario de Coartadas Estratégicas para la Vida Cotidiana</span>
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1rem',
            }}
          >
            <div
              style={{
                padding: '1rem',
                background: 'rgba(0,0,0,0.3)',
                borderLeft: '3px solid #ec4899',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
              }}
            >
              <strong style={{ color: '#f472b6', fontSize: '0.85rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
                Ámbito Laboral (Formal)
              </strong>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                &ldquo;Estimado equipo: debido a una congestión vial imprevista en el eje metropolitano, sufriré una demora estimada de 14 minutos.&rdquo;
              </p>
              <span style={{ display: 'block', marginTop: '0.45rem', fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>
                Credibilidad estimada: 94%
              </span>
            </div>
            <div
              style={{
                padding: '1rem',
                background: 'rgba(0,0,0,0.3)',
                borderLeft: '3px solid #38bdf8',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
              }}
            >
              <strong style={{ color: '#38bdf8', fontSize: '0.85rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
                WhatsApp & Redes (Científico)
              </strong>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                &ldquo;El algoritmo de optimización de batería mató el proceso de segundo plano sin enviar la interrupción a la memoria RAM.&rdquo;
              </p>
              <span style={{ display: 'block', marginTop: '0.45rem', fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>
                Credibilidad estimada: 90%
              </span>
            </div>
            <div
              style={{
                padding: '1rem',
                background: 'rgba(0,0,0,0.3)',
                borderLeft: '3px solid #a855f7',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
              }}
            >
              <strong style={{ color: '#c084fc', fontSize: '0.85rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
                Amigos & Cansancio (Cara Dura)
              </strong>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                &ldquo;Gente, me he puesto el pijama a las ocho y ya no existe fuerza física en el cosmos que me despegue del sofá.&rdquo;
              </p>
              <span style={{ display: 'block', marginTop: '0.45rem', fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>
                Credibilidad estimada: 85%
              </span>
            </div>
          </div>
        </div>

        {/* Acordeón FAQ Semántico Indexable */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.35rem' }}>❓</span>
            <h2
              style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                color: '#ffffff',
                fontFamily: 'var(--font-display, Cinzel, serif)',
                margin: 0,
              }}
            >
              Preguntas Frecuentes sobre Desvaríos de Humor
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <details
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
              }}
            >
              <summary style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.96rem' }}>
                ¿Cómo funciona el Generador de Excusas con medidor de verosimilitud?
              </summary>
              <p style={{ marginTop: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Selecciona el ámbito de la crisis (trabajo, pareja, amigos, familia, gimnasio, chats, dinero o universidad), el nivel de gravedad (falta leve, compromiso medio o catástrofe total) y el tono retórico (formal, científico, dramático, caradura, conspiranoico o zen). Al pulsar &apos;Generar Coartada&apos;, el algoritmo calcula una excusa personalizada con su porcentaje de credibilidad y una recomendación práctica para ejecutarla con éxito.
              </p>
            </details>

            <details
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
              }}
            >
              <summary style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.96rem' }}>
                ¿Para qué situaciones cotidianas se pueden generar coartadas?
              </summary>
              <p style={{ marginTop: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Cubre 8 categorías clave: retrasos y ausencias laborales ante jefes, cancelaciones de citas o compromisos en pareja, excusas para no salir de fiesta con amigos, compromisos familiares ineludibles, descansos no programados del gimnasio, justificaciones para tardar en contestar en WhatsApp y redes sociales, desajustes financieros y entregas universitarias.
              </p>
            </details>

            <details
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
              }}
            >
              <summary style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.96rem' }}>
                ¿Qué es el Oráculo del Desvarío y cómo resuelve dilemas?
              </summary>
              <p style={{ marginTop: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                El Oráculo del Desvarío es una máquina de predicciones absurdas que procesa dudas existenciales y cotidianas asignando una probabilidad cósmica, un veredicto definitivo, una justificación de lógica surrealista, un consejo sabio y un signo zodiacal afín para guiar tus decisiones con humor.
              </p>
            </details>

            <details
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
              }}
            >
              <summary style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.96rem' }}>
                ¿Qué son las Leyes del Caos y en qué se diferencian de la Ley de Murphy?
              </summary>
              <p style={{ marginTop: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Las Leyes del Caos son un compendio satírico de la entropía urbana moderna. Amplían la clásica Ley de Murphy abordando la tecnología, las impresoras en momentos de entrega, las tostadas con mantequilla, los mensajes enviados por error y las paradojas de la productividad.
              </p>
            </details>

            <details
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
              }}
            >
              <summary style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.96rem' }}>
                ¿Es necesario registrarse o pagar para usar las herramientas de humor?
              </summary>
              <p style={{ marginTop: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                No. Todas las consolas interactivas de Desvaríos de Humor son 100% gratuitas, anónimas y se ejecutan directamente en cualquier navegador web móvil o de escritorio, sin descargas ni suscripciones.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer Navigation Back to Portal */}
      <div style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '2rem' }}>
        <Link href="/" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', fontSize: '1rem', padding: '0.75rem 1.5rem' }}>
          <span>🏛️</span>
          <span>Volver a la Portada de Tus Desvaríos</span>
        </Link>
      </div>
    </div>
  );
}
