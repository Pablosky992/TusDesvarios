'use client';

import React from 'react';
import { StoryOption } from '@/types/story';
import { ChevronRight } from 'lucide-react';

interface DecisionButtonProps {
  option: StoryOption;
  index: number;
  onClick: (targetNodeId: string) => void;
  disabled?: boolean;
}

export function DecisionButton({ option, index, onClick, disabled = false }: DecisionButtonProps) {
  return (
    <button
      className="decision-button"
      onClick={() => onClick(option.destinoId)}
      disabled={disabled}
      aria-label={`Opción ${index + 1}: ${option.texto}`}
    >
      <div className="decision-button-content">
        {option.impacto && (
          <span className="decision-badge">{option.impacto}</span>
        )}
        <span>{option.texto}</span>
      </div>
      <ChevronRight className="decision-arrow" size={20} />
    </button>
  );
}
