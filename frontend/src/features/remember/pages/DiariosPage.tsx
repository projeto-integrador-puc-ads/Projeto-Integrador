import React, { useEffect, useState } from 'react';
import { getDiarios } from '../api/remember';
import type { Diario } from '../types/remember';

const DiariosPage: React.FC = () => {
  const [diarios, setDiarios] = useState<Diario[]>([]);

  useEffect(() => {
    getDiarios().then((res) => setDiarios(res.data));
  }, []);

  return (
    <div>
      <h1>Diários</h1>
      <ul>
        {diarios.map((d) => (
          <li key={d.id}>
            <strong>{d.titulo}</strong> - {d.data}
            <p>{d.conteudo}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiariosPage;
