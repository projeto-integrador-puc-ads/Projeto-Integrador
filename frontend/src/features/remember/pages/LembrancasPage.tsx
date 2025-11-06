import React, { useEffect, useState } from 'react';
import { getLembrancas } from '../api/remember';
import type { Lembranca } from '../types/remember';

const LembrancasPage: React.FC = () => {
  const [lembrancas, setLembrancas] = useState<Lembranca[]>([]);

  useEffect(() => {
    getLembrancas().then((res) => setLembrancas(res.data));
  }, []);

  return (
    <div>
      <h1>Lembranças</h1>
      <ul>
        {lembrancas.map((l) => (
          <li key={l.id}>
            <strong>{l.titulo}</strong> - {l.data}
            <p>{l.descricao}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LembrancasPage;
