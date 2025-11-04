import React from 'react';
import type { PerguntaCognitiva } from '../types/remember';

interface PerguntaCognitivaCardProps {
  pergunta: PerguntaCognitiva;
}

const PerguntaCognitivaCard: React.FC<PerguntaCognitivaCardProps> = ({ pergunta }) => (
  <div className="pergunta-cognitiva-card">
    <h3>{pergunta.pergunta}</h3>
    <p>Resposta: {pergunta.resposta}</p>
  </div>
);

export default PerguntaCognitivaCard;
