import React from 'react';
import type { Lembranca } from '../types/remember';

interface LembrancaCardProps {
  lembranca: Lembranca;
}

const LembrancaCard: React.FC<LembrancaCardProps> = ({ lembranca }) => (
  <div className="lembranca-card">
    <h3>{lembranca.titulo}</h3>
    <span>{lembranca.data}</span>
    <p>{lembranca.descricao}</p>
  </div>
);

export default LembrancaCard;
