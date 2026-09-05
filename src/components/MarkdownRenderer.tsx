'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Renderizador de texto narrativo optimizado para historias interactivas.
 * Soporta párrafos, citas en bloque (> ...), negrita (**texto**), cursiva (*texto*) y listas.
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  // Separar por bloques de párrafos
  const blocks = content.split(/\n\s*\n/);

  return (
    <div className="reader-text">
      {blocks.map((block, index) => {
        const trimmed = block.trim();

        // Cita en bloque
        if (trimmed.startsWith('>')) {
          const quoteText = trimmed.replace(/^>\s*/gm, '');
          return (
            <blockquote key={index}>
              {renderFormattedInline(quoteText)}
            </blockquote>
          );
        }

        // Párrafo normal
        return (
          <p key={index}>
            {renderFormattedInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Parsea formato inline básico: **negrita**, *cursiva*, `código`
 */
function renderFormattedInline(text: string): React.ReactNode[] {
  // Regex para detectar **negrita** o *cursiva*
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    // Reemplazar saltos de línea simples dentro de un mismo párrafo
    if (part.includes('\n')) {
      const subLines = part.split('\n');
      return (
        <React.Fragment key={i}>
          {subLines.map((line, j) => (
            <React.Fragment key={j}>
              {line}
              {j < subLines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </React.Fragment>
      );
    }
    return part;
  });
}
