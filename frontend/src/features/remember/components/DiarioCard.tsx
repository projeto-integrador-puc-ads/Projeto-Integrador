import React from 'react';
import type { Diario } from '../types/remember';

interface DiarioCardProps {
  diario: Diario;
}

const DiarioCard: React.FC<DiarioCardProps> = ({ diario }) => (
  <div className="diario-card">
    <h3>{diario.titulo}</h3>
    <span>{diario.data}</span>
    <p>{diario.conteudo}</p>
  </div>
);

export default DiarioCard;
