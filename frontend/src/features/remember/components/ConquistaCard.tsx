import React from 'react';
import type { Conquista } from '../types/remember';

interface ConquistaCardProps {
  conquista: Conquista;
}

const ConquistaCard: React.FC<ConquistaCardProps> = ({ conquista }) => (
  <div className="conquista-card">
    <h3>{conquista.nome}</h3>
    <p>{conquista.descricao}</p>
  </div>
);

export default ConquistaCard;
