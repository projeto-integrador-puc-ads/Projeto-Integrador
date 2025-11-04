import React, { useEffect, useState } from 'react';
import { getPerguntasCognitivas } from '../api/remember';
import type { PerguntaCognitiva } from '../types/remember';

const PerguntasCognitivasPage: React.FC = () => {
  const [perguntas, setPerguntas] = useState<PerguntaCognitiva[]>([]);

  useEffect(() => {
    getPerguntasCognitivas().then((res) => setPerguntas(res.data));
  }, []);

  return (
    <div>
      <h1>Perguntas Cognitivas</h1>
      <ul>
        {perguntas.map((p) => (
          <li key={p.id}>
            <strong>{p.pergunta}</strong>
            <p>Resposta: {p.resposta}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PerguntasCognitivasPage;
