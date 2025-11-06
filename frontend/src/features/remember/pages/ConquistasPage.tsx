import React, { useEffect, useState } from 'react';
import { getConquistas } from '../api/remember';
import { Conquista } from '../types/remember';

const ConquistasPage: React.FC = () => {
  const [conquistas, setConquistas] = useState<Conquista[]>([]);

  useEffect(() => {
    getConquistas().then((res) => setConquistas(res.data));
  }, []);

  return (
    <div>
      <h1>Conquistas</h1>
      <ul>
        {conquistas.map((c) => (
          <li key={c.id}>
            <strong>{c.nome}</strong>: {c.descricao}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConquistasPage;
